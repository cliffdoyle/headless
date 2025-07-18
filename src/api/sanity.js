// src/api/sanity.js
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Sanity configuration
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || '';
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production';
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01';
const token = import.meta.env.VITE_SANITY_TOKEN || '';

// Create Sanity client
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token, // Only needed for write operations
  useCdn: true, // Enable CDN for faster reads
});

// Create image URL builder
const builder = imageUrlBuilder(client);

// Helper function to generate image URLs
export const urlFor = (source) => {
  return builder.image(source);
};

// Fetch all published posts from Sanity
export const getPublishedPosts = async () => {
  try {
    console.log('Fetching published posts from Sanity...');

    const query = `*[_type == "post" && status == "published"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      content,
      publishedAt,
      status,
      author->{
        _id,
        name,
        bio,
        image
      },
      mainImage,
      categories[]->{
        _id,
        title,
        slug
      }
    }`;

    const posts = await client.fetch(query);
    console.log(`Successfully fetched ${posts.length} posts from Sanity`);
    return posts || [];
  } catch (error) {
    console.error('Error fetching posts from Sanity:', error);
    return [];
  }
};

// Fetch a single post by slug from Sanity
export const getPostBySlug = async (slug) => {
  try {
    console.log('Fetching post by slug:', slug);

    const query = `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      content,
      publishedAt,
      status,
      author->{
        _id,
        name,
        bio,
        image
      },
      mainImage,
      categories[]->{
        _id,
        title,
        slug
      }
    }`;

    const post = await client.fetch(query, { slug });
    console.log('Fetched post:', post ? 'Found' : 'Not found');
    return post;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
};

// Fetch author data from Sanity
export const getAdminData = async (authorId = null) => {
  try {
    console.log('Fetching author data...');

    // If no specific author ID, get the first author or a default one
    const query = authorId
      ? `*[_type == "author" && _id == $authorId][0]`
      : `*[_type == "author"][0] {
          _id,
          name,
          bio,
          image,
          email,
          social
        }`;

    const author = await client.fetch(query, authorId ? { authorId } : {});
    console.log('Fetched author data:', author ? 'Success' : 'Not found');
    return author;
  } catch (error) {
    console.error('Error fetching author data:', error);
    return null;
  }
};

// Create a new post in Sanity
export const createPost = async (postData) => {
  try {
    console.log('Creating new post in Sanity with title:', postData.title);

    if (!token) {
      throw new Error('Sanity write token not configured');
    }

    // Generate a slug from the title
    const slug = postData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    let mainImageAsset = null;

    // Handle image upload if provided
    if (postData.image) {
      console.log('Uploading image to Sanity...');
      try {
        mainImageAsset = await client.assets.upload('image', postData.image, {
          filename: postData.image.name
        });
        console.log('Image uploaded successfully:', mainImageAsset._id);
      } catch (imageError) {
        console.error('Error uploading image:', imageError);
        throw new Error('Failed to upload image. Please try again.');
      }
    }

    // Create the post document
    const postDocument = {
      _type: 'post',
      title: postData.title,
      slug: {
        _type: 'slug',
        current: slug
      },
      excerpt: postData.content.substring(0, 200) + '...',
      content: postData.content,
      status: 'pending', // Will be reviewed before publishing
      submittedBy: postData.author,
      submittedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    };

    // Add main image if uploaded
    if (mainImageAsset) {
      postDocument.mainImage = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: mainImageAsset._id
        }
      };
    }

    console.log('Sending post to Sanity...');
    const result = await client.create(postDocument);

    console.log('Post created successfully in Sanity with ID:', result._id);
    return {
      id: result._id,
      title: result.title,
      slug: result.slug.current,
      status: result.status
    };
  } catch (error) {
    console.error('Error creating post in Sanity:', error);

    // Provide more helpful error messages
    if (error.message.includes('Insufficient permissions')) {
      throw new Error('Authentication failed. Check your Sanity token permissions.');
    } else if (error.message.includes('Invalid document')) {
      throw new Error('Invalid post data. Please check your input.');
    } else {
      throw new Error(`Failed to create post: ${error.message}`);
    }
  }
};

// Fetch posts by status for admin review
export const getPostsByStatus = async (status = 'pending') => {
  try {
    console.log(`Fetching ${status} posts for admin review...`);

    const query = `*[_type == "post" && status == $status] | order(submittedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      content,
      status,
      submittedBy,
      submittedAt,
      publishedAt,
      author->{
        _id,
        name,
        bio,
        image
      },
      mainImage
    }`;

    const posts = await client.fetch(query, { status });
    console.log(`Successfully fetched ${posts.length} ${status} posts`);
    return posts || [];
  } catch (error) {
    console.error(`Error fetching ${status} posts:`, error);
    return [];
  }
};

// Update post status (for publishing/rejecting)
export const updatePostStatus = async (postId, newStatus, authorId = null) => {
  try {
    console.log(`Updating post ${postId} status to ${newStatus}...`);

    if (!token) {
      throw new Error('Sanity write token not configured');
    }

    const updateData = {
      status: newStatus
    };

    // If publishing, set published date and assign author
    if (newStatus === 'published') {
      updateData.publishedAt = new Date().toISOString();

      // If authorId provided, assign it
      if (authorId) {
        updateData.author = {
          _type: 'reference',
          _ref: authorId
        };
      }
    }

    const result = await client.patch(postId).set(updateData).commit();
    console.log(`Post status updated successfully to ${newStatus}`);
    return result;
  } catch (error) {
    console.error('Error updating post status:', error);
    throw new Error(`Failed to update post status: ${error.message}`);
  }
};

// Bulk update post statuses
export const bulkUpdatePostStatus = async (postIds, newStatus, authorId = null) => {
  try {
    console.log(`Bulk updating ${postIds.length} posts to ${newStatus}...`);

    if (!token) {
      throw new Error('Sanity write token not configured');
    }

    const updatePromises = postIds.map(postId =>
      updatePostStatus(postId, newStatus, authorId)
    );

    const results = await Promise.all(updatePromises);
    console.log(`Successfully bulk updated ${results.length} posts`);
    return results;
  } catch (error) {
    console.error('Error bulk updating posts:', error);
    throw new Error(`Failed to bulk update posts: ${error.message}`);
  }
};

// Delete a post
export const deletePost = async (postId) => {
  try {
    console.log(`Deleting post ${postId}...`);

    if (!token) {
      throw new Error('Sanity write token not configured');
    }

    const result = await client.delete(postId);
    console.log('Post deleted successfully');
    return result;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error(`Failed to delete post: ${error.message}`);
  }
};

// Test Sanity API connectivity
export const testSanityAPI = async () => {
  try {
    console.log('Testing Sanity API connectivity...');

    // Test basic connectivity by fetching a simple query
    const query = `*[_type == "post"][0..2] {
      _id,
      title
    }`;

    const result = await client.fetch(query);
    console.log('Sanity API is accessible, found posts:', result.length);

    return {
      success: true,
      postsCount: result.length,
      projectId,
      dataset
    };
  } catch (error) {
    console.error('Sanity API test failed:', error.message);
    return {
      success: false,
      error: error.message,
      projectId,
      dataset
    };
  }
};