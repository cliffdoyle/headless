<?php
/**
 * Add this to your WordPress functions.php to check user permissions
 * This will help debug what's going wrong with post creation
 */

// Add detailed logging for REST API requests
add_filter('rest_pre_dispatch', function($result, $server, $request) {
    error_log('REST API Request: ' . $request->get_method() . ' ' . $request->get_route());
    error_log('Request params: ' . print_r($request->get_params(), true));
    
    // Check if user is authenticated
    $user = wp_get_current_user();
    if ($user->ID) {
        error_log('Authenticated user: ' . $user->user_login . ' (ID: ' . $user->ID . ')');
        error_log('User capabilities: ' . print_r($user->allcaps, true));
    } else {
        error_log('No authenticated user found');
    }
    
    return $result;
}, 10, 3);

// Check post creation permissions specifically
add_filter('rest_pre_insert_post', function($prepared_post, $request) {
    error_log('Attempting to create post: ' . print_r($prepared_post, true));
    
    $user = wp_get_current_user();
    if (!$user->ID) {
        error_log('ERROR: No user authenticated for post creation');
        return new WP_Error('rest_cannot_create', 'Sorry, you are not allowed to create posts.', array('status' => 401));
    }
    
    if (!current_user_can('publish_posts')) {
        error_log('User cannot publish_posts, checking edit_posts...');
        if (!current_user_can('edit_posts')) {
            error_log('ERROR: User cannot edit_posts either');
            return new WP_Error('rest_cannot_create', 'Sorry, you are not allowed to create posts.', array('status' => 403));
        }
    }
    
    error_log('User has permission to create posts');
    return $prepared_post;
}, 10, 2);

// Also check media upload permissions
add_filter('rest_pre_insert_attachment', function($prepared_post, $request) {
    error_log('Attempting to upload media: ' . print_r($prepared_post, true));
    
    $user = wp_get_current_user();
    if (!$user->ID) {
        error_log('ERROR: No user authenticated for media upload');
        return new WP_Error('rest_cannot_create', 'Sorry, you are not allowed to upload files.', array('status' => 401));
    }
    
    if (!current_user_can('upload_files')) {
        error_log('ERROR: User cannot upload_files');
        return new WP_Error('rest_cannot_create', 'Sorry, you are not allowed to upload files.', array('status' => 403));
    }
    
    error_log('User has permission to upload files');
    return $prepared_post;
}, 10, 2);
?>
