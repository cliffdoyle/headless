# WordPress Migration Guide: Local to 100webspace.com

This guide will help you migrate your WordPress backend from your local development environment to 100webspace.com hosting.

## Prerequisites

- 100webspace.com hosting account (✅ You have this)
- Domain: vanessaphil.com (✅ You have this)
- Access to your current local WordPress installation

## Step 1: Set up WordPress on 100webspace.com

### 1.1 Install WordPress
1. Log into your 100webspace.com control panel
2. Click on **"Installer"** in the control panel
3. Find **WordPress** in the list of applications
4. Click **Install**
5. Configure the installation:
   - **Domain**: Select `vanessaphil.com`
   - **Directory**: Leave empty (install in root)
   - **Admin Username**: Choose a username (remember this!)
   - **Admin Password**: Choose a strong password
   - **Admin Email**: Your email address
   - **Site Title**: "Lanfintech" or your preferred title

### 1.2 Verify Installation
1. Visit `https://vanessaphil.com` to see your new WordPress site
2. Visit `https://vanessaphil.com/wp-admin` to access the admin panel
3. Log in with the credentials you created

## Step 2: Configure WordPress for Headless Use

### 2.1 Enable REST API (should be enabled by default)
1. Go to **Settings → Permalinks**
2. Choose any option except "Plain" (recommended: "Post name")
3. Click **Save Changes**

### 2.2 Create Application Password
1. Go to **Users → Your Profile**
2. Scroll down to **"Application Passwords"**
3. Add a new application password:
   - **Name**: "React Frontend"
   - Click **Add New Application Password**
4. **IMPORTANT**: Copy the generated password immediately (you won't see it again)

### 2.3 Install Required Plugins (Optional but Recommended)
1. Go to **Plugins → Add New**
2. Search for and install:
   - **"Application Passwords"** (if not already available)
   - **"WP REST API"** (usually built-in)
   - **"CORS"** plugin if you encounter cross-origin issues

## Step 3: Export Data from Local WordPress

### 3.1 Run Export Script
```bash
# Make sure you're in your project directory
cd /home/cliff/headless-wp-blog

# Install dependencies if needed
npm install axios

# Run the export script
node migration-scripts/export-wordpress-data.js
```

This will create a `wordpress-export` folder with all your content.

### 3.2 Alternative: WordPress Export Tool
If the script doesn't work, use WordPress's built-in export:
1. Go to your local WordPress admin: `http://myblog-backend.local/wp-admin`
2. Go to **Tools → Export**
3. Select **"All content"**
4. Click **Download Export File**

## Step 4: Import Data to New WordPress

### 4.1 Update Import Script Configuration
Edit `migration-scripts/import-wordpress-data.js`:
```javascript
const NEW_WP_URL = 'https://vanessaphil.com';
const NEW_USERNAME = 'your_new_admin_username';
const NEW_APP_PASSWORD = 'your_new_app_password';
```

### 4.2 Run Import Script
```bash
node migration-scripts/import-wordpress-data.js
```

### 4.3 Alternative: WordPress Import Tool
If the script doesn't work:
1. Go to `https://vanessaphil.com/wp-admin`
2. Go to **Tools → Import**
3. Install **WordPress Importer**
4. Upload your export file
5. Follow the import wizard

## Step 5: Update Frontend Configuration

### 5.1 Update Environment Variables
Edit `migration-scripts/update-frontend-config.js` with your new credentials:
```javascript
const NEW_WP_URL = 'https://vanessaphil.com';
const NEW_USERNAME = 'your_new_admin_username';
const NEW_APP_PASSWORD = 'your_new_app_password';
```

### 5.2 Run Configuration Update
```bash
node migration-scripts/update-frontend-config.js
```

### 5.3 Manual Update (Alternative)
Edit your `.env` file directly:
```env
VITE_WORDPRESS_URL=https://vanessaphil.com
VITE_WORDPRESS_USERNAME=your_new_admin_username
VITE_WORDPRESS_APP_PASSWORD=your_new_app_password
```

## Step 6: Test the Migration

### 6.1 Test WordPress API
Visit these URLs to verify your WordPress API is working:
- `https://vanessaphil.com/wp-json/wp/v2/posts`
- `https://vanessaphil.com/wp-json/wp/v2/users`

### 6.2 Test Frontend Connection
```bash
# Start your React development server
npm run dev

# Visit http://localhost:5173
# Check if posts are loading from the new WordPress backend
```

### 6.3 Test Post Submission
1. Go to the Submit page in your React app
2. Try creating a test post
3. Check if it appears in your WordPress admin panel

## Step 7: Configure Domain and SSL

### 7.1 SSL Certificate
100webspace.com should provide free SSL certificates. If not:
1. Go to your control panel
2. Look for **SSL/TLS** or **Security** section
3. Enable SSL for your domain

### 7.2 WordPress URL Settings
1. Go to **Settings → General** in WordPress admin
2. Make sure both URLs use `https://`:
   - **WordPress Address (URL)**: `https://vanessaphil.com`
   - **Site Address (URL)**: `https://vanessaphil.com`

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Install a CORS plugin in WordPress
2. **404 on API endpoints**: Check permalink settings
3. **Authentication fails**: Verify application password is correct
4. **Images not loading**: Check media upload permissions

### Support:
- 100webspace.com support documentation
- WordPress REST API documentation
- Check browser console for specific error messages

## Next Steps After Migration

1. **Update DNS** (if needed) to point to 100webspace.com
2. **Set up backups** on your hosting account
3. **Configure caching** if available
4. **Monitor performance** and optimize as needed
5. **Update any hardcoded URLs** in your content

## Security Recommendations

1. **Change default admin username** from "admin"
2. **Use strong passwords**
3. **Keep WordPress updated**
4. **Install security plugins** if needed
5. **Regular backups**

---

**Note**: Keep your local WordPress installation as a backup until you're confident the migration is successful!
