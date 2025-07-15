<?php
/**
 * WordPress Debug Helper
 * Add this to your WordPress functions.php temporarily to debug permissions
 */

// Add a custom REST endpoint to check user permissions
add_action('rest_api_init', function() {
    register_rest_route('custom/v1', '/debug-user', array(
        'methods' => 'GET',
        'callback' => 'debug_user_permissions',
        'permission_callback' => '__return_true', // Allow anyone to access this debug endpoint
    ));
});

function debug_user_permissions($request) {
    // Get current user
    $user = wp_get_current_user();
    
    if (!$user->ID) {
        return new WP_REST_Response(array(
            'authenticated' => false,
            'message' => 'No user authenticated'
        ), 401);
    }
    
    return new WP_REST_Response(array(
        'authenticated' => true,
        'user_id' => $user->ID,
        'username' => $user->user_login,
        'email' => $user->user_email,
        'roles' => $user->roles,
        'capabilities' => array(
            'upload_files' => current_user_can('upload_files'),
            'edit_posts' => current_user_can('edit_posts'),
            'publish_posts' => current_user_can('publish_posts'),
            'edit_others_posts' => current_user_can('edit_others_posts'),
            'delete_posts' => current_user_can('delete_posts'),
        ),
        'all_caps' => array_keys($user->allcaps, true), // Only show capabilities that are true
    ), 200);
}

// Enhanced CORS for debug endpoint
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        if ($origin === 'http://localhost:5173') {
            header('Access-Control-Allow-Origin: http://localhost:5173');
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Expose-Headers: X-WP-Total, X-WP-TotalPages');
        }
        return $value;
    });
});

// Handle preflight requests
add_action('init', function() {
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        if ($origin === 'http://localhost:5173') {
            header('Access-Control-Allow-Origin: http://localhost:5173');
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
            header('Access-Control-Allow-Credentials: true');
            status_header(200);
            exit();
        }
    }
});

// Log all REST API requests for debugging
add_filter('rest_pre_dispatch', function($result, $server, $request) {
    error_log('=== REST API REQUEST ===');
    error_log('Method: ' . $request->get_method());
    error_log('Route: ' . $request->get_route());
    error_log('Headers: ' . print_r($request->get_headers(), true));
    
    $user = wp_get_current_user();
    if ($user->ID) {
        error_log('User: ' . $user->user_login . ' (ID: ' . $user->ID . ')');
        error_log('Can upload files: ' . (current_user_can('upload_files') ? 'YES' : 'NO'));
    } else {
        error_log('No authenticated user');
    }
    
    return $result;
}, 10, 3);
?>
