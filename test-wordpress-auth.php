<?php
/**
 * Direct WordPress authentication test
 * Run this by visiting: http://myblog-backend.local/test-wordpress-auth.php
 */

// WordPress bootstrap
require_once('/home/cliff/Local Sites/myblog-backend/app/public/wp-config.php');

echo "<h1>WordPress Authentication Test</h1>";

// Simulate the Authorization header that your React app is sending
$auth_header = 'Basic YWRtaW46VGVzdCBQYXNzd29yZCAxMjM0';
$_SERVER['HTTP_AUTHORIZATION'] = $auth_header;

echo "<h2>Testing Authentication</h2>";
echo "<p><strong>Auth Header:</strong> $auth_header</p>";

// Decode the basic auth
$decoded = base64_decode(substr($auth_header, 6)); // Remove "Basic "
list($username, $password) = explode(':', $decoded, 2);

echo "<p><strong>Username:</strong> $username</p>";
echo "<p><strong>Password:</strong> [hidden]</p>";

// Test WordPress authentication
$user = wp_authenticate($username, $password);

if (is_wp_error($user)) {
    echo "<p style='color: red;'><strong>❌ Authentication Failed:</strong> " . $user->get_error_message() . "</p>";
} else {
    echo "<p style='color: green;'><strong>✅ Authentication Successful!</strong></p>";
    echo "<p><strong>User ID:</strong> " . $user->ID . "</p>";
    echo "<p><strong>User Login:</strong> " . $user->user_login . "</p>";
    echo "<p><strong>User Email:</strong> " . $user->user_email . "</p>";
    echo "<p><strong>User Roles:</strong> " . implode(', ', $user->roles) . "</p>";
    
    // Set the current user
    wp_set_current_user($user->ID);
    
    echo "<h3>User Capabilities:</h3>";
    echo "<ul>";
    echo "<li>upload_files: " . (current_user_can('upload_files') ? '✅ YES' : '❌ NO') . "</li>";
    echo "<li>edit_posts: " . (current_user_can('edit_posts') ? '✅ YES' : '❌ NO') . "</li>";
    echo "<li>publish_posts: " . (current_user_can('publish_posts') ? '✅ YES' : '❌ NO') . "</li>";
    echo "<li>edit_others_posts: " . (current_user_can('edit_others_posts') ? '✅ YES' : '❌ NO') . "</li>";
    echo "<li>delete_posts: " . (current_user_can('delete_posts') ? '✅ YES' : '❌ NO') . "</li>";
    echo "</ul>";
}

echo "<h2>Testing REST API Authentication</h2>";

// Simulate REST API authentication
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['REQUEST_URI'] = '/wp-json/wp/v2/posts';

// Test REST authentication
$auth_result = apply_filters('rest_authentication_errors', null);

if (is_wp_error($auth_result)) {
    echo "<p style='color: red;'><strong>❌ REST Auth Failed:</strong> " . $auth_result->get_error_message() . "</p>";
} else {
    echo "<p style='color: green;'><strong>✅ REST Authentication OK</strong></p>";
}

echo "<h2>Test Media Upload Permissions</h2>";

// Test media upload specifically
if (current_user_can('upload_files')) {
    echo "<p style='color: green;'><strong>✅ User can upload files</strong></p>";
    
    // Test if we can create an attachment
    $attachment_data = array(
        'post_title' => 'Test Upload',
        'post_content' => '',
        'post_status' => 'inherit',
        'post_type' => 'attachment'
    );
    
    // Don't actually insert, just test permissions
    $can_insert = current_user_can('edit_posts');
    echo "<p>Can insert attachments: " . ($can_insert ? '✅ YES' : '❌ NO') . "</p>";
} else {
    echo "<p style='color: red;'><strong>❌ User cannot upload files</strong></p>";
}

echo "<h2>CORS Headers Test</h2>";
echo "<p>Origin header would be: http://localhost:5173</p>";

// Test CORS function
$_SERVER['HTTP_ORIGIN'] = 'http://localhost:5173';
$origin = get_http_origin();
echo "<p>Detected origin: " . ($origin ?: 'none') . "</p>";

if ($origin === 'http://localhost:5173') {
    echo "<p style='color: green;'><strong>✅ CORS origin matches</strong></p>";
} else {
    echo "<p style='color: red;'><strong>❌ CORS origin doesn't match</strong></p>";
}

echo "<h2>Next Steps</h2>";
echo "<p>If authentication is working here but failing in your React app, the issue is likely:</p>";
echo "<ul>";
echo "<li>CORS headers not being sent properly</li>";
echo "<li>REST API authentication filters interfering</li>";
echo "<li>Timing issues with authentication</li>";
echo "</ul>";

?>
