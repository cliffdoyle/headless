#!/usr/bin/env node

// Test script to check Sanity token permissions
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const projectId = process.env.VITE_SANITY_PROJECT_ID || 'l4fw3vb6';
const dataset = process.env.VITE_SANITY_DATASET || 'production';
const token = process.env.VITE_SANITY_TOKEN;

console.log('🔍 Testing Sanity Token Permissions...\n');

if (!token) {
  console.log('❌ No VITE_SANITY_TOKEN found in .env file');
  console.log('📝 Please add your Sanity token to the .env file');
  process.exit(1);
}

console.log(`📊 Project ID: ${projectId}`);
console.log(`📊 Dataset: ${dataset}`);
console.log(`🔑 Token: ${token.substring(0, 10)}...${token.substring(token.length - 10)}`);
console.log('');

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

async function testPermissions() {
  try {
    // Test 1: Read permissions
    console.log('🔍 Testing READ permissions...');
    const posts = await client.fetch('*[_type == "post"][0..2] { _id, title }');
    console.log(`✅ READ test passed - Found ${posts.length} posts`);

    // Test 2: Write permissions - try to create a test document
    console.log('\n🔍 Testing WRITE permissions...');
    const testDoc = {
      _type: 'post',
      title: 'Test Post - DELETE ME',
      slug: { current: 'test-post-delete-me' },
      content: 'This is a test post to check write permissions. Please delete.',
      status: 'draft',
      publishedAt: new Date().toISOString(),
    };

    const result = await client.create(testDoc);
    console.log(`✅ WRITE test passed - Created test document: ${result._id}`);

    // Test 3: Delete permissions - clean up the test document
    console.log('\n🔍 Testing DELETE permissions...');
    await client.delete(result._id);
    console.log('✅ DELETE test passed - Cleaned up test document');

    console.log('\n🎉 All tests passed! Your Sanity token has full permissions.');
    console.log('✨ You should be able to submit blog posts now.');

  } catch (error) {
    console.log('\n❌ Permission test failed:');
    console.log(`Error: ${error.message}`);
    
    if (error.message.includes('read only') || error.message.includes('readonly')) {
      console.log('\n🔧 SOLUTION: Your token has read-only permissions');
      console.log('1. Go to https://sanity.io/manage');
      console.log(`2. Select your project: ${projectId}`);
      console.log('3. Go to API → Tokens');
      console.log('4. Create a new token with "Editor" permissions');
      console.log('5. Update VITE_SANITY_TOKEN in your .env file');
      console.log('6. Restart your development server');
    } else if (error.statusCode === 401) {
      console.log('\n🔧 SOLUTION: Token authentication failed');
      console.log('1. Check if your token is correct in .env file');
      console.log('2. Make sure the token hasn\'t expired');
      console.log('3. Generate a new token if needed');
    } else {
      console.log('\n🔧 SOLUTION: Check your Sanity configuration');
      console.log('1. Verify project ID and dataset are correct');
      console.log('2. Check if the token has the right permissions');
      console.log('3. Try generating a new token');
    }
  }
}

testPermissions();
