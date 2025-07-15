<?php
/**
 * WordPress REST API File Upload Fix
 * Add this code to your theme's functions.php file or create a custom plugin
 */

// Enable file uploads for REST API
add_action('rest_api_init', function() {
    // Allow file uploads for authenticated users
    add_filter('rest_pre_serve_request', function($served, $result, $request, $server) {
        if ($request->get_route() === '/wp/v2/media' && $request->get_method() === 'POST') {
            // Ensure the user has upload capabilities
            if (current_user_can('upload_files')) {
                return $served;
            }
        }
        return $served;
    }, 10, 4);
});

// Ensure admin users have upload_files capability
add_action('init', function() {
    $admin_role = get_role('administrator');
    if ($admin_role && !$admin_role->has_cap('upload_files')) {
        $admin_role->add_cap('upload_files');
    }
});

// Fix REST API authentication for Application Passwords
add_filter('rest_authentication_errors', function($result) {
    // If authentication is already handled, return the result
    if (!empty($result)) {
        return $result;
    }
    
    // Check if we have basic auth headers
    if (!isset($_SERVER['HTTP_AUTHORIZATION'])) {
        return $result;
    }
    
    $auth_header = $_SERVER['HTTP_AUTHORIZATION'];
    if (strpos($auth_header, 'Basic ') !== 0) {
        return $result;
    }
    
    // Decode the basic auth
    $credentials = base64_decode(substr($auth_header, 6));
    list($username, $password) = explode(':', $credentials, 2);
    
    // Authenticate the user
    $user = wp_authenticate($username, $password);
    
    if (is_wp_error($user)) {
        return $user;
    }
    
    // Set the current user
    wp_set_current_user($user->ID);
    
    return true;
});

// Enable CORS for your React app (optional, for development)
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: http://localhost:5173');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With');
        header('Access-Control-Allow-Credentials: true');
        return $value;
    });
});
?>
