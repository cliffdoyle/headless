// Simple script to test Sanity API connectivity
import { createClient } from '@sanity/client';

// Test configuration - replace with your actual values
const testConfig = {
  projectId: 'l4fw3vb6', // Your actual project ID
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
};

async function runTest() {
  try {
    console.log('Testing Sanity API connectivity...');
    console.log('Config:', testConfig);

    if (testConfig.projectId === 'your-project-id') {
      console.log('⚠️  Please update the projectId in test-sanity-api.js with your actual Sanity project ID');
      return;
    }

    const client = createClient(testConfig);

    // Test basic connectivity
    const query = `*[_type == "post"][0..2] {
      _id,
      title
    }`;

    const result = await client.fetch(query);
    console.log('✅ Sanity API test successful!');
    console.log('Project ID:', testConfig.projectId);
    console.log('Dataset:', testConfig.dataset);
    console.log('Posts found:', result.length);

    if (result.length === 0) {
      console.log('ℹ️  No posts found. Make sure you have created some post documents in your Sanity studio.');
    } else {
      console.log('Sample posts:', result);
    }

  } catch (error) {
    console.error('❌ Test script failed:', error.message);
    console.log('Make sure you have:');
    console.log('1. Created a Sanity project');
    console.log('2. Updated the projectId in this test file');
    console.log('3. Set up the post schema in your Sanity studio');
  }
}

runTest();
