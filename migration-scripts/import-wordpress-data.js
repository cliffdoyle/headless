// Import WordPress data to new installation
import fs from 'fs';
import path from 'path';
import axios from 'axios';

// New WordPress configuration (update these after setting up on 100webspace)
const NEW_WP_URL = 'https://vanessaphil.com';
const NEW_USERNAME = 'admin'; // Update with your actual admin username
const NEW_APP_PASSWORD = 'PASTE_YOUR_APPLICATION_PASSWORD_HERE'; // Update with the app password you just created

const api = axios.create({
  baseURL: `${NEW_WP_URL}/wp-json/wp/v2`,
  headers: {
    'Authorization': `Basic ${btoa(`${NEW_USERNAME}:${NEW_APP_PASSWORD}`)}`,
  },
});

async function importWordPressData() {
  try {
    console.log('🚀 Starting WordPress data import...');
    
    const exportDir = './wordpress-export';
    
    // Check if export directory exists
    if (!fs.existsSync(exportDir)) {
      throw new Error('Export directory not found. Please run export script first.');
    }

    // Import categories first (posts may reference them)
    console.log('📂 Importing categories...');
    const categories = JSON.parse(fs.readFileSync(path.join(exportDir, 'categories.json')));
    const categoryMap = new Map();
    
    for (const category of categories) {
      if (category.id === 1) continue; // Skip default "Uncategorized" category
      
      try {
        const newCategory = await api.post('/categories', {
          name: category.name,
          description: category.description,
          slug: category.slug
        });
        categoryMap.set(category.id, newCategory.data.id);
        console.log(`✅ Imported category: ${category.name}`);
      } catch (error) {
        console.log(`⚠️ Category already exists or failed: ${category.name}`);
      }
    }

    // Import tags
    console.log('🏷️ Importing tags...');
    const tags = JSON.parse(fs.readFileSync(path.join(exportDir, 'tags.json')));
    const tagMap = new Map();
    
    for (const tag of tags) {
      try {
        const newTag = await api.post('/tags', {
          name: tag.name,
          description: tag.description,
          slug: tag.slug
        });
        tagMap.set(tag.id, newTag.data.id);
        console.log(`✅ Imported tag: ${tag.name}`);
      } catch (error) {
        console.log(`⚠️ Tag already exists or failed: ${tag.name}`);
      }
    }

    // Import media (this is complex - we'll need to download and re-upload)
    console.log('🖼️ Importing media...');
    const media = JSON.parse(fs.readFileSync(path.join(exportDir, 'media.json')));
    const mediaMap = new Map();
    
    for (const mediaItem of media) {
      try {
        // Download the original image
        const imageResponse = await axios.get(mediaItem.source_url, {
          responseType: 'arraybuffer'
        });
        
        // Upload to new WordPress
        const formData = new FormData();
        const blob = new Blob([imageResponse.data], { type: mediaItem.mime_type });
        formData.append('file', blob, mediaItem.slug);
        formData.append('title', mediaItem.title.rendered);
        formData.append('alt_text', mediaItem.alt_text);
        
        const uploadResponse = await fetch(`${NEW_WP_URL}/wp-json/wp/v2/media`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${NEW_USERNAME}:${NEW_APP_PASSWORD}`)}`,
          },
          body: formData
        });
        
        if (uploadResponse.ok) {
          const newMedia = await uploadResponse.json();
          mediaMap.set(mediaItem.id, newMedia.id);
          console.log(`✅ Imported media: ${mediaItem.title.rendered}`);
        }
      } catch (error) {
        console.log(`⚠️ Failed to import media: ${mediaItem.title.rendered}`);
      }
    }

    // Import posts
    console.log('📝 Importing posts...');
    const posts = JSON.parse(fs.readFileSync(path.join(exportDir, 'posts.json')));
    
    for (const post of posts) {
      try {
        const postData = {
          title: post.title.rendered,
          content: post.content.rendered,
          excerpt: post.excerpt.rendered,
          status: post.status,
          slug: post.slug,
          date: post.date,
        };

        // Map categories
        if (post.categories && post.categories.length > 0) {
          postData.categories = post.categories
            .map(catId => categoryMap.get(catId))
            .filter(Boolean);
        }

        // Map tags
        if (post.tags && post.tags.length > 0) {
          postData.tags = post.tags
            .map(tagId => tagMap.get(tagId))
            .filter(Boolean);
        }

        // Map featured media
        if (post.featured_media && mediaMap.has(post.featured_media)) {
          postData.featured_media = mediaMap.get(post.featured_media);
        }

        const newPost = await api.post('/posts', postData);
        console.log(`✅ Imported post: ${post.title.rendered}`);
      } catch (error) {
        console.log(`⚠️ Failed to import post: ${post.title.rendered}`);
        console.error(error.response?.data || error.message);
      }
    }

    console.log('🎉 Import completed successfully!');
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

importWordPressData();
