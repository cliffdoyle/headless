# Lanfintech Blog - React + WordPress Headless CMS

A modern, responsive blog built with React and powered by WordPress as a headless CMS.

## Features

- 🌙 Dark theme design
- 📱 Fully responsive
- ⚡ Fast loading with Vite
- 📝 Article submission form
- 🔍 Search functionality
- 📊 Admin bio section

## Tech Stack

- **Frontend**: React, Vite, CSS Modules
- **Backend**: WordPress REST API
- **Styling**: CSS Modules with dark theme
- **Deployment**: Vercel

## Environment Variables

Set these in your Vercel deployment:

```
VITE_WORDPRESS_USERNAME=your_wordpress_username
VITE_WORDPRESS_APP_PASSWORD=your_app_password
```

## WordPress Setup

1. Install WordPress
2. Enable REST API (usually enabled by default)
3. Create an Application Password for API access
4. Ensure HTTPS is configured for production

## Development

```bash
npm install
npm run dev
```

## Deployment

This project is configured for automatic deployment on Vercel. Simply push to the main branch and Vercel will handle the build and deployment.

## WordPress Connection

The app connects to `https://wp.vanessaphil.com` via the WordPress REST API. Posts are fetched publicly, while post creation requires authentication.
