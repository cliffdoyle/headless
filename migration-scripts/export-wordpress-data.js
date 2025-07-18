// Export WordPress data for migration
import fs from 'fs';
import path from 'path';
import axios from 'axios';

// Current WordPress configuration
const CURRENT_WP_URL = 'http://myblog-backend.local';
const USERNAME = 'admin';
const APP_PASSWORD = 'fcFk t6aI VwpR ABjn rqtL mDlR';

const api = axios.create({
  baseURL: `${CURRENT_WP_URL}/wp-json/wp/v2`,
  headers: {
    'Authorization': `Basic ${btoa(`${USERNAME}:${APP_PASSWORD}`)}`,
  },
});

async function exportWordPressData() {
  try {
    console.log('🚀 Starting WordPress data export...');
    
    // Create export directory
    const exportDir = './wordpress-export';
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // Export posts
    console.log('📝 Exporting posts...');
    const postsResponse = await api.get('/posts?per_page=100&status=publish,draft,pending');
    const posts = postsResponse.data;
    fs.writeFileSync(
      path.join(exportDir, 'posts.json'),
      JSON.stringify(posts, null, 2)
    );
    console.log(`✅ Exported ${posts.length} posts`);

    // Export media
    console.log('🖼️ Exporting media...');
    const mediaResponse = await api.get('/media?per_page=100');
    const media = mediaResponse.data;
    fs.writeFileSync(
      path.join(exportDir, 'media.json'),
      JSON.stringify(media, null, 2)
    );
    console.log(`✅ Exported ${media.length} media items`);

    // Export users
    console.log('👥 Exporting users...');
    const usersResponse = await api.get('/users');
    const users = usersResponse.data;
    fs.writeFileSync(
      path.join(exportDir, 'users.json'),
      JSON.stringify(users, null, 2)
    );
    console.log(`✅ Exported ${users.length} users`);

    // Export categories
    console.log('📂 Exporting categories...');
    const categoriesResponse = await api.get('/categories?per_page=100');
    const categories = categoriesResponse.data;
    fs.writeFileSync(
      path.join(exportDir, 'categories.json'),
      JSON.stringify(categories, null, 2)
    );
    console.log(`✅ Exported ${categories.length} categories`);

    // Export tags
    console.log('🏷️ Exporting tags...');
    const tagsResponse = await api.get('/tags?per_page=100');
    const tags = tagsResponse.data;
    fs.writeFileSync(
      path.join(exportDir, 'tags.json'),
      JSON.stringify(tags, null, 2)
    );
    console.log(`✅ Exported ${tags.length} tags`);

    console.log('🎉 Export completed successfully!');
    console.log(`📁 Data exported to: ${path.resolve(exportDir)}`);
    
    // Create summary
    const summary = {
      exportDate: new Date().toISOString(),
      sourceUrl: CURRENT_WP_URL,
      counts: {
        posts: posts.length,
        media: media.length,
        users: users.length,
        categories: categories.length,
        tags: tags.length
      }
    };
    
    fs.writeFileSync(
      path.join(exportDir, 'export-summary.json'),
      JSON.stringify(summary, null, 2)
    );

  } catch (error) {
    console.error('❌ Export failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

exportWordPressData();
