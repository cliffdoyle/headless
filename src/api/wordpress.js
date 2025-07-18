// src/api/wordpress.js
import axios from 'axios';

// WordPress configuration
const BASE_URL = 'https://wp.vanessaphil.com';
const USERNAME = import.meta.env.VITE_WORDPRESS_USERNAME || '';
const PASSWORD = import.meta.env.VITE_WORDPRESS_APP_PASSWORD || '';

// Simple API instance
const api = axios.create({
  baseURL: `${BASE_URL}/wp-json/wp/v2`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Fetch all published posts
export const getPublishedPosts = async () => {
  try {
    const response = await api.get('/posts?status=publish&_embed');
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

// Fetch a single post by slug
export const getPostBySlug = async (slug) => {
  try {
    const response = await api.get(`/posts?slug=${slug}&_embed`);
    return response.data[0];
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
};

// Fetch admin user data
export const getAdminData = async (adminId = 1) => {
  try {
    const response = await api.get(`/users/${adminId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return null;
  }
};

// Create a new post (simplified)
export const createPost = async (postData) => {
  try {
    if (!USERNAME || !PASSWORD) {
      throw new Error('WordPress credentials not configured');
    }

    const response = await api.post('/posts', {
      title: postData.title,
      content: `${postData.content} <hr> <em>Submitted by: ${postData.author}</em>`,
      status: 'pending',
    }, {
      headers: {
        'Authorization': `Basic ${btoa(`${USERNAME}:${PASSWORD}`)}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};