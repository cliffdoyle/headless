// src/api/wordpress.js
import axios from 'axios';

// Accessing environment variables in Vite uses import.meta.env
const BASE_URL = import.meta.env.VITE_WORDPRESS_URL;
const USERNAME = import.meta.env.VITE_WORDPRESS_USERNAME;
const PASSWORD = import.meta.env.VITE_WORDPRESS_APP_PASSWORD;

// This API instance is for public requests (GET)
const api = axios.create({
  baseURL: `${BASE_URL}/wp-json/wp/v2`,
});

// This API instance is for authenticated requests (POST)
const secureApi = axios.create({
  baseURL: `${BASE_URL}/wp-json/wp/v2`,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`,
  },
});

// Fetch all published posts. _embed gets featured image and author data in one call.
export const getPublishedPosts = async () => {
  const response = await api.get('/posts?status=publish&_embed');
  return response.data;
};

// Fetch a single post by its slug
export const getPostBySlug = async (slug) => {
  const response = await api.get(`/posts?slug=${slug}&_embed`);
  return response.data[0]; // API returns an array, we want the first item
};

// Fetch the admin user data (assuming admin user ID is 1)
export const getAdminData = async (adminId = 1) => {
  const response = await api.get(`/users/${adminId}`);
  return response.data;
};

// Handle the full submission workflow
export const createPost = async (postData) => {
  console.log('Starting post creation process...');
  console.log('Post data:', {
    title: postData.title,
    author: postData.author,
    contentLength: postData.content?.length,
    imageType: postData.image?.type,
    imageName: postData.image?.name,
    imageSize: postData.image?.size
  });

  try {
    // 1. Upload the image file first to the media endpoint
    console.log('Step 1: Uploading image...');

    let mediaResponse;
    try {
      // Try Method 1: Direct binary upload (original method)
      mediaResponse = await secureApi.post('/media', postData.image, {
        headers: {
          'Content-Type': postData.image.type,
          'Content-Disposition': `attachment; filename=${postData.image.name}`,
        },
      });
      console.log('✅ Image upload successful (Method 1)');
    } catch (uploadError) {
      console.log('Method 1 failed, trying Method 2 (FormData)...');
      console.error('Upload error:', uploadError.response?.data || uploadError.message);

      // Try Method 2: FormData upload
      const formData = new FormData();
      formData.append('file', postData.image, postData.image.name);
      formData.append('title', `Featured image for ${postData.title}`);

      const response = await fetch(`${BASE_URL}/wp-json/wp/v2/media`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Media upload failed: ${response.status} - ${errorText}`);
      }

      mediaResponse = { data: await response.json() };
      console.log('✅ Image upload successful (Method 2)');
    }

    const mediaId = mediaResponse.data.id;
    console.log('Media ID:', mediaId);
    console.log('Media URL:', mediaResponse.data.source_url);

    // 2. Create the post and link the uploaded image as the featured image
    console.log('Step 2: Creating post...');
    const postResponse = await secureApi.post('/posts', {
      title: postData.title,
      content: `${postData.content} <hr> <em>Submitted by: ${postData.author}</em>`,
      status: 'pending',
      featured_media: mediaId,
    });

    console.log('✅ Post creation successful');
    console.log('Post ID:', postResponse.data.id);
    console.log('Post status:', postResponse.data.status);

    return postResponse.data;

  } catch (error) {
    console.error('❌ Post creation failed:', error);
    console.error('Error details:', error.response?.data || error.message);
    throw error;
  }
};

// Test WordPress connection and authentication
export const testWordPressConnection = async () => {
  try {
    const response = await secureApi.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('WordPress connection test failed:', error);
    throw error;
  }
};