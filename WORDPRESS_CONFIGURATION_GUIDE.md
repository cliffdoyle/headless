# 🔧 WordPress Configuration Guide for Lanfintech Blog

## 📋 **Step-by-Step WordPress Setup**

Based on your debug screen, here are the exact steps to fix the authentication and permission issues:

### **Step 1: Enable Application Passwords**

1. **Log into your WordPress admin dashboard** (usually `http://localhost:10004/wp-admin/`)

2. **Go to Users → Your Profile** (or Users → All Users → Edit your user)

3. **Scroll down to "Application Passwords" section**

4. **Create a new Application Password:**
   - Name: `Lanfintech Frontend`
   - Click "Add New Application Password"
   - **COPY THE GENERATED PASSWORD** - you'll need this for your React app

### **Step 2: Update WordPress Functions.php**

1. **Navigate to your WordPress installation:**
   ```
   Local Sites/myblog-backend/app/public/wp-content/themes/[your-active-theme]/functions.php
   ```

2. **Add this code to the TOP of functions.php** (after the opening `<?php` tag):

```php
// ========================================
// LANFINTECH BLOG CONFIGURATION
// ========================================

// Enable Application Passwords for local development
if (!defined("WP_ENVIRONMENT_TYPE")) {
    define("WP_ENVIRONMENT_TYPE", "local");
}

// Force Application Passwords to be available
add_filter("wp_is_application_passwords_available", "__return_true");

// Additional filter to ensure Application Passwords work without HTTPS in local dev
add_filter("wp_is_application_passwords_available_for_user", function($available, $user) {
    return true;
}, 10, 2);

// Fix user permissions for post creation
add_action('init', function() {
    // Get the current user or admin user
    $current_user = wp_get_current_user();
    
    if ($current_user && $current_user->ID) {
        // Ensure user has all necessary capabilities
        $current_user->add_cap('edit_posts');
        $current_user->add_cap('publish_posts');
        $current_user->add_cap('edit_others_posts');
        $current_user->add_cap('delete_posts');
        $current_user->add_cap('upload_files');
        $current_user->add_cap('edit_files');
    }
});

// Allow CORS for local development
add_action('init', function() {
    header('Access-Control-Allow-Origin: http://localhost:5174');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
});

// Handle preflight requests
add_action('wp_loaded', function() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Access-Control-Allow-Origin: http://localhost:5174');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Allow-Credentials: true');
        exit;
    }
});
```

### **Step 3: Update Your React App Configuration**

1. **Update your `.env` file in the React project:**
```env
VITE_WP_API_URL=http://localhost:10004/wp-json/wp/v2
VITE_WP_USERNAME=your_wordpress_username
VITE_WP_APP_PASSWORD=your_generated_application_password
```

2. **Replace with your actual:**
   - WordPress username (usually `admin` or whatever you set up)
   - The Application Password you generated in Step 1

### **Step 4: Test the Connection**

1. **Restart your WordPress server** (stop and start Local by Flywheel)

2. **Restart your React development server:**
   ```bash
   npm run dev
   ```

3. **Go to your React app** and click "Test WordPress Connection"

4. **You should now see:**
   - ✅ Basic Connection: SUCCESS
   - ✅ Authentication: SUCCESS  
   - ✅ Post Creation: SUCCESS
   - ✅ Media Upload: SUCCESS
   - ✅ User Permissions: SUCCESS

### **Step 5: Submit Your First Article**

1. **Go to "Share Insight" page** in your React app

2. **Fill out the form:**
   - Title: "Test Article"
   - Content: "This is a test article to verify the connection works."
   - Category: Select any category

3. **Click "Submit for Review"**

4. **Check WordPress Admin:**
   - Go to Posts → All Posts
   - You should see your article with status "Pending Review"

### **Step 6: Approve Articles (WordPress Admin)**

1. **In WordPress Admin, go to Posts → All Posts**

2. **Find your submitted article**

3. **Change status from "Pending Review" to "Published"**

4. **Click "Update"**

5. **The article will now appear on your React frontend**

## 🔍 **Troubleshooting Common Issues**

### **Issue: "You are not currently logged in"**
- **Solution**: Make sure you've added the Application Password correctly
- **Check**: Username and password in `.env` file are correct

### **Issue: "Sorry, you are not allowed to create posts as this user"**
- **Solution**: The functions.php code above should fix this
- **Alternative**: In WordPress Admin, go to Users → Your User → Role → Change to "Administrator"

### **Issue: "HTTP 401: {"code":"rest_not_logged_in"}"**
- **Solution**: Regenerate your Application Password
- **Check**: Make sure CORS headers are added to functions.php

### **Issue: Posts not appearing on frontend**
- **Solution**: Make sure posts are "Published" not "Pending"
- **Check**: Your React app is fetching from the correct API endpoint

## 🎯 **Final Verification**

After completing all steps, your debug screen should show:
- ✅ Basic Connection: SUCCESS
- ✅ Authentication: SUCCESS
- ✅ Post Creation: SUCCESS
- ✅ Media Upload: SUCCESS
- ✅ User Permissions: SUCCESS

## 📝 **Workflow Summary**

1. **Write article** in React frontend
2. **Submit for review** → Goes to WordPress as "Pending"
3. **Admin approves** in WordPress dashboard → Changes to "Published"
4. **Article appears** on React frontend automatically

Your Lanfintech blog is now ready for content creation! 🚀
