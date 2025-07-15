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
  // 1. Upload the image file first to the media endpoint
  const mediaResponse = await secureApi.post('/media', postData.image, {
    headers: {
      'Content-Type': postData.image.type,
      'Content-Disposition': `attachment; filename=${postData.image.name}`,
    },
  });
  const mediaId = mediaResponse.data.id;

  // 2. Create the post and link the uploaded image as the featured image
  const postResponse = await secureApi.post('/posts', {
    title: postData.title,
    // We can embed the user's name directly into the content
    content: `${postData.content} <hr> <em>Submitted by: ${postData.author}</em>`,
    status: 'pending', // THIS IS THE KEY! Saves as a draft for review.
    featured_media: mediaId,
  });

  return postResponse.data;
};