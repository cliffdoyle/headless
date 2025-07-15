// Test WordPress connection
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_WORDPRESS_URL;
const USERNAME = import.meta.env.VITE_WORDPRESS_USERNAME;
const PASSWORD = import.meta.env.VITE_WORDPRESS_APP_PASSWORD;

// Test basic connection
export const testConnection = async () => {
  try {
    console.log('Testing connection to:', BASE_URL);
    
    // Test 1: Basic API endpoint
    const response = await axios.get(`${BASE_URL}/wp-json/wp/v2/posts`);
    console.log('✅ Basic API connection successful');
    console.log('Posts found:', response.data.length);
    
    return { success: true, message: 'Connection successful' };
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Test authenticated connection
export const testAuthConnection = async () => {
  try {
    console.log('Testing authenticated connection...');
    console.log('Username:', USERNAME);
    console.log('Password length:', PASSWORD ? PASSWORD.length : 0);
    
    const authApi = axios.create({
      baseURL: `${BASE_URL}/wp-json/wp/v2`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`,
      },
    });
    
    // Test authenticated request
    const response = await authApi.get('/users/me');
    console.log('✅ Authenticated connection successful');
    console.log('User:', response.data.name);
    
    return { success: true, user: response.data };
  } catch (error) {
    console.error('❌ Authentication failed:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

// Test post creation (without image)
export const testPostCreation = async () => {
  try {
    console.log('Testing post creation...');

    const authApi = axios.create({
      baseURL: `${BASE_URL}/wp-json/wp/v2`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`,
      },
    });

    const testPost = {
      title: 'Test Post from React - ' + new Date().toISOString(),
      content: 'This is a test post created from the React frontend.',
      status: 'pending'
    };

    console.log('Sending post data:', testPost);
    const response = await authApi.post('/posts', testPost);
    console.log('✅ Post creation successful');
    console.log('Post ID:', response.data.id);
    console.log('Post data:', response.data);

    return { success: true, post: response.data };
  } catch (error) {
    console.error('❌ Post creation failed:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error headers:', error.response?.headers);
    return {
      success: false,
      error: error.response?.data || error.message,
      status: error.response?.status,
      details: error.response
    };
  }
};

// Test media upload separately
export const testMediaUpload = async () => {
  try {
    console.log('Testing media upload...');

    // Create a simple test image (100x100 pixel PNG)
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(0, 0, 100, 100);

    // Convert to blob
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    console.log('Created test image blob:', blob.size, 'bytes');

    // Try Method 1: Using axios with proper headers (WordPress REST API way)
    try {
      console.log('Trying Method 1: Axios with binary data...');

      const authApi = axios.create({
        baseURL: `${BASE_URL}/wp-json/wp/v2`,
        headers: {
          'Authorization': `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`,
        },
      });

      const response = await authApi.post('/media', blob, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': 'attachment; filename=test-image.png',
        },
      });

      console.log('✅ Media upload successful (Method 1)');
      console.log('Media ID:', response.data.id);
      console.log('Media URL:', response.data.source_url);
      return { success: true, media: response.data };

    } catch (axiosError) {
      console.log('Method 1 failed, trying Method 2...');
      console.error('Axios error:', axiosError.response?.data || axiosError.message);
    }

    // Try Method 2: Using fetch with FormData
    console.log('Trying Method 2: Fetch with FormData...');

    const formData = new FormData();
    formData.append('file', blob, 'test-image.png');
    formData.append('title', 'Test Image Upload');
    formData.append('alt_text', 'Test image for API testing');

    const response = await fetch(`${BASE_URL}/wp-json/wp/v2/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`,
        // Don't set Content-Type - let browser set it with boundary for FormData
      },
      body: formData
    });

    console.log('Media upload response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Media upload failed - Response:', errorText);
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    const data = await response.json();
    console.log('✅ Media upload successful (Method 2)');
    console.log('Media ID:', data.id);
    console.log('Media URL:', data.source_url);

    return { success: true, media: data };
  } catch (error) {
    console.error('❌ Media upload failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Test user permissions (requires wordpress-debug.php to be added to functions.php)
export const testUserPermissions = async () => {
  try {
    console.log('Testing user permissions...');

    const authApi = axios.create({
      baseURL: `${BASE_URL}/wp-json/custom/v1`,
      headers: {
        'Authorization': `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`,
      },
    });

    const response = await authApi.get('/debug-user');
    console.log('✅ User permissions check successful');
    console.log('User data:', response.data);

    return { success: true, user: response.data };
  } catch (error) {
    console.error('❌ User permissions check failed:', error);
    return {
      success: false,
      error: error.response?.data || error.message,
    };
  }
};
