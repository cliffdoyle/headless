// Simple script to test WordPress API connectivity
import axios from 'axios';

const BASE_URL = 'http://vanessaphil.com';
const API_URL = `${BASE_URL}/wp-json/wp/v2`;

async function testAPI() {
  try {
    console.log('Testing WordPress API connectivity...');
    
    // Test basic connectivity
    console.log('Testing root endpoint...');
    const rootResponse = await axios.get(`${BASE_URL}/wp-json`, {
      timeout: 15000
    });
    console.log('WordPress REST API is accessible:', rootResponse.status);
    
    // Test posts endpoint
    console.log('Testing posts endpoint...');
    const postsResponse = await axios.get(`${API_URL}/posts?per_page=1`, {
      timeout: 15000
    });
    console.log('Posts endpoint accessible, found posts:', postsResponse.data.length);
    
    return {
      success: true,
      apiVersion: rootResponse.data,
      postsCount: postsResponse.data.length
    };
  } catch (error) {
    console.error('WordPress REST API test failed:', error.message);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    return {
      success: false,
      error: error.message,
      status: error.response?.status
    };
  }
}

testAPI()
  .then(result => {
    console.log('Test completed:', result);
  })
  .catch(err => {
    console.error('Test failed:', err);
  });
