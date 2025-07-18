# 🚀 Vercel Deployment Guide for Lanfintech Blog

This guide will help you deploy your React frontend to Vercel and connect it to your WordPress backend.

## 📋 Prerequisites

Before deploying, make sure you have:

1. ✅ WordPress installed and configured at `https://versaceptal.com`
2. ✅ WordPress REST API enabled
3. ✅ Application Password created for API authentication
4. ✅ Content imported into WordPress
5. ✅ Git repository set up (GitHub, GitLab, or Bitbucket)

## 🔧 Step 1: Prepare Your Repository

### 1.1 Initialize Git Repository (if not done)
```bash
git init
git add .
git commit -m "Initial commit: Lanfintech blog setup"
```

### 1.2 Push to GitHub
```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/yourusername/lanfintech-blog.git
git branch -M main
git push -u origin main
```

## 🌐 Step 2: Deploy to Vercel

### 2.1 Sign Up/Login to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up or login with your GitHub account

### 2.2 Import Your Project
1. Click **"New Project"**
2. Import your GitHub repository
3. Vercel will automatically detect it's a Vite project

### 2.3 Configure Build Settings
Vercel should auto-detect these settings:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

## 🔐 Step 3: Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add these variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `VITE_WORDPRESS_URL` | `https://versaceptal.com` | Production |
| `VITE_WORDPRESS_USERNAME` | `your-wp-username` | Production |
| `VITE_WORDPRESS_APP_PASSWORD` | `your-app-password` | Production |

### 🔑 Getting Your WordPress Credentials

#### WordPress Username:
- This is your WordPress admin username

#### Application Password:
1. Login to your WordPress admin at `https://versaceptal.com/wp-admin`
2. Go to **Users** → **Profile**
3. Scroll down to **Application Passwords**
4. Create a new application password named "Vercel Frontend"
5. Copy the generated password (format: `xxxx xxxx xxxx xxxx`)

## 🚀 Step 4: Deploy

1. Click **"Deploy"** in Vercel
2. Wait for the build to complete
3. Your site will be available at `https://your-project-name.vercel.app`

## 🔧 Step 5: Test Your Deployment

### 5.1 Check Homepage
- Visit your Vercel URL
- Verify the homepage loads correctly
- Check that posts are fetching from WordPress

### 5.2 Test API Endpoints
Open browser console and check for:
- ✅ No CORS errors
- ✅ Posts loading successfully
- ✅ Images displaying correctly

### 5.3 Test Post Creation
- Try creating a new post through your frontend
- Verify it appears in WordPress admin as "Pending"

## 🌍 Step 6: Custom Domain (Optional)

### 6.1 Add Custom Domain
1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain (e.g., `blog.yourdomain.com`)
3. Follow Vercel's DNS configuration instructions

### 6.2 Update WordPress Settings
If using a custom domain, update your WordPress settings:
1. Go to WordPress admin → **Settings** → **General**
2. Update **Site Address (URL)** if needed
3. Update any hardcoded URLs in your content

## 🐛 Troubleshooting

### Common Issues:

#### 1. CORS Errors
- Ensure WordPress has proper CORS headers
- Check that your WordPress URL is correct
- Verify REST API is enabled

#### 2. Authentication Errors
- Double-check your application password
- Ensure username is correct
- Test credentials with a REST API client

#### 3. Build Failures
- Check that all dependencies are in `package.json`
- Verify TypeScript compilation passes locally
- Check Vercel build logs for specific errors

#### 4. Environment Variables Not Working
- Ensure variables start with `VITE_`
- Redeploy after adding environment variables
- Check variable names match exactly

## 📱 Step 7: Final Verification

Test these features on your deployed site:

- [ ] Homepage loads with posts from WordPress
- [ ] Individual post pages work
- [ ] Post creation form functions
- [ ] Images upload and display correctly
- [ ] Responsive design works on mobile
- [ ] Dark theme is applied correctly

## 🔄 Step 8: Continuous Deployment

Vercel automatically redeploys when you push to your main branch:

```bash
# Make changes to your code
git add .
git commit -m "Update: your changes"
git push origin main
# Vercel will automatically redeploy
```

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Test WordPress API endpoints directly
3. Verify environment variables are set correctly
4. Check browser console for errors

---

🎉 **Congratulations!** Your Lanfintech blog should now be live on Vercel and connected to your WordPress backend!
