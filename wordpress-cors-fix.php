<?php
/**
 * WordPress CORS Fix
 * 
 * Upload this file to your WordPress theme's functions.php file
 * or create it as a simple plugin to enable CORS for REST API
 */

// Add CORS headers to WordPress REST API
function add_cors_http_header() {
    // Allow requests from your React app domain
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");
}

// Hook into REST API init
add_action('rest_api_init', function() {
    add_cors_http_header();
});

// Handle preflight OPTIONS requests
add_action('init', function() {
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        add_cors_http_header();
        exit(0);
    }
});

// Also add CORS headers to all WordPress requests
add_action('wp_headers', function($headers) {
    $headers['Access-Control-Allow-Origin'] = '*';
    $headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    $headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
    return $headers;
});

// Enable REST API for all users (if needed)
add_filter('rest_authentication_errors', function($result) {
    // If a previous authentication check was applied,
    // pass that result along without modification.
    if (true === $result || is_wp_error($result)) {
        return $result;
    }

    // No authentication has been performed yet.
    // Return an error if user is not logged in.
    if (!is_user_logged_in()) {
        // Allow GET requests without authentication
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            return true;
        }
        // For other methods, require authentication
        return new WP_Error(
            'rest_not_logged_in',
            __('You are not currently logged in.'),
            array('status' => 401)
        );
    }

    // This is a normal request by a logged in user, proceed normally.
    return $result;
});

?>
