<?php
/**
 * WordPress Upload Permissions Fix
 * 
 * Add this code to your WordPress theme's functions.php file
 * to fix the "Sorry, you are not allowed to upload files" error
 * when using the REST API with Application Passwords.
 */

// CRITICAL FIX: Ensure admin users have upload_files capability
add_action('init', function() {
    // Fix administrator role capabilities
    $admin_role = get_role('administrator');
    if ($admin_role && !$admin_role->has_cap('upload_files')) {
        $admin_role->add_cap('upload_files');
        error_log('Added upload_files capability to administrator role');
    }
    
    // Also ensure all current admin users have the capability
    $admin_users = get_users(array('role' => 'administrator'));
    foreach ($admin_users as $admin_user) {
        if (!$admin_user->has_cap('upload_files')) {
            $admin_user->add_cap('upload_files');
            error_log('Added upload_files capability to user: ' . $admin_user->user_login);
        }
    }
});

// Fix REST API authentication for file uploads specifically
add_filter('rest_authentication_errors', function($result) {
    // Skip if already authenticated or error
    if (!empty($result)) {
        return $result;
    }
    
    // Only handle media uploads
    if (strpos($_SERVER['REQUEST_URI'], '/wp-json/wp/v2/media') === false) {
        return $result;
    }
    
    // Check for Authorization header
    if (!isset($_SERVER['HTTP_AUTHORIZATION'])) {
        return $result;
    }
    
    $auth_header = $_SERVER['HTTP_AUTHORIZATION'];
    if (strpos($auth_header, 'Basic ') !== 0) {
        return $result;
    }
    
    // Decode basic auth credentials
    $credentials = base64_decode(substr($auth_header, 6));
    if (!$credentials) {
        return $result;
    }
    
    $parts = explode(':', $credentials, 2);
    if (count($parts) !== 2) {
        return $result;
    }
    
    list($username, $password) = $parts;
    
    // Authenticate user
    $user = wp_authenticate($username, $password);
    if (is_wp_error($user)) {
        return $user;
    }
    
    // Set current user
    wp_set_current_user($user->ID);
    
    // Ensure user has upload capability
    if (!current_user_can('upload_files')) {
        return new WP_Error('rest_cannot_create', 'User does not have upload permissions.', array('status' => 403));
    }
    
    return true;
});

// Additional capability check for media endpoint
add_filter('rest_pre_dispatch', function($result, $server, $request) {
    // Only for media uploads
    if ($request->get_route() === '/wp/v2/media' && $request->get_method() === 'POST') {
        $user = wp_get_current_user();
        
        if (!$user->ID) {
            return new WP_Error('rest_not_logged_in', 'You are not currently logged in.', array('status' => 401));
        }
        
        if (!current_user_can('upload_files')) {
            // Force add the capability if user is admin
            if (in_array('administrator', $user->roles)) {
                $user->add_cap('upload_files');
                // Refresh capabilities
                $user->get_role_caps();
                error_log('Force-added upload_files capability to admin user: ' . $user->user_login);
            }
            
            // Check again
            if (!current_user_can('upload_files')) {
                return new WP_Error('rest_cannot_create', 'Sorry, you are not allowed to upload files.', array('status' => 403));
            }
        }
    }
    
    return $result;
}, 10, 3);

// Enhanced media upload permission check
add_filter('rest_pre_insert_attachment', function($prepared_post, $request) {
    $user = wp_get_current_user();
    
    if (!$user->ID) {
        return new WP_Error('rest_cannot_create', 'You must be logged in to upload files.', array('status' => 401));
    }
    
    // Force capability for administrators
    if (in_array('administrator', $user->roles) && !current_user_can('upload_files')) {
        $user->add_cap('upload_files');
        error_log('Force-added upload_files capability during attachment insert for: ' . $user->user_login);
    }
    
    if (!current_user_can('upload_files')) {
        return new WP_Error('rest_cannot_create', 'You do not have permission to upload files.', array('status' => 403));
    }
    
    return $prepared_post;
}, 10, 2);

// Debug endpoint to check user capabilities
add_action('rest_api_init', function() {
    register_rest_route('custom/v1', '/check-upload-permissions', array(
        'methods' => 'GET',
        'callback' => 'check_upload_permissions_debug',
        'permission_callback' => '__return_true',
    ));
});

function check_upload_permissions_debug($request) {
    $user = wp_get_current_user();
    
    if (!$user->ID) {
        return new WP_REST_Response(array(
            'authenticated' => false,
            'message' => 'No user authenticated'
        ), 401);
    }
    
    $admin_role = get_role('administrator');
    
    return new WP_REST_Response(array(
        'authenticated' => true,
        'user_id' => $user->ID,
        'username' => $user->user_login,
        'roles' => $user->roles,
        'capabilities' => array(
            'upload_files' => current_user_can('upload_files'),
            'edit_posts' => current_user_can('edit_posts'),
            'publish_posts' => current_user_can('publish_posts'),
        ),
        'admin_role_has_upload_files' => $admin_role ? $admin_role->has_cap('upload_files') : false,
        'user_caps_raw' => $user->caps,
        'all_caps' => array_keys(array_filter($user->allcaps)),
    ), 200);
}

// Log authentication attempts for debugging
add_filter('rest_pre_dispatch', function($result, $server, $request) {
    if ($request->get_route() === '/wp/v2/media' && $request->get_method() === 'POST') {
        $user = wp_get_current_user();
        error_log('=== MEDIA UPLOAD ATTEMPT ===');
        error_log('User ID: ' . ($user->ID ?: 'None'));
        error_log('Username: ' . ($user->user_login ?: 'None'));
        error_log('Roles: ' . implode(', ', $user->roles ?: array()));
        error_log('Can upload files: ' . (current_user_can('upload_files') ? 'YES' : 'NO'));
        error_log('Authorization header present: ' . (isset($_SERVER['HTTP_AUTHORIZATION']) ? 'YES' : 'NO'));
    }
    
    return $result;
}, 5, 3);

?>
