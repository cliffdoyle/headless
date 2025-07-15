<?php
/**
 * Test Application Passwords functionality
 * Run this by visiting: http://myblog-backend.local/test-app-passwords.php
 */

// WordPress bootstrap
require_once('/home/cliff/Local Sites/myblog-backend/app/public/wp-config.php');

echo "<h1>Application Passwords Test</h1>";

// Check if Application Passwords are available
if (!class_exists('WP_Application_Passwords')) {
    echo "<p style='color: red;'><strong>❌ Application Passwords class not available</strong></p>";
    echo "<p>This might be a WordPress version issue or plugin conflict.</p>";
    exit;
}

echo "<p style='color: green;'><strong>✅ Application Passwords class is available</strong></p>";

// Check if Application Passwords are enabled
if (!WP_Application_Passwords::is_available()) {
    echo "<p style='color: red;'><strong>❌ Application Passwords are not available</strong></p>";
    echo "<p>Reasons could be:</p>";
    echo "<ul>";
    echo "<li>HTTPS is required but not available</li>";
    echo "<li>Application Passwords are disabled</li>";
    echo "<li>User doesn't have permission</li>";
    echo "</ul>";
} else {
    echo "<p style='color: green;'><strong>✅ Application Passwords are available</strong></p>";
}

// Get the admin user
$user = get_user_by('login', 'admin');
if (!$user) {
    echo "<p style='color: red;'><strong>❌ Admin user not found</strong></p>";
    exit;
}

echo "<p><strong>Testing user:</strong> {$user->user_login} (ID: {$user->ID})</p>";

// Check if user can use Application Passwords
if (!WP_Application_Passwords::is_available_for_user($user)) {
    echo "<p style='color: red;'><strong>❌ Application Passwords not available for this user</strong></p>";
} else {
    echo "<p style='color: green;'><strong>✅ Application Passwords available for this user</strong></p>";
}

// List existing Application Passwords
$app_passwords = WP_Application_Passwords::get_user_application_passwords($user->ID);
echo "<h2>Existing Application Passwords:</h2>";

if (empty($app_passwords)) {
    echo "<p style='color: orange;'><strong>⚠️ No Application Passwords found</strong></p>";
    echo "<p>Let's create one...</p>";
    
    // Create an Application Password
    $app_password_data = WP_Application_Passwords::create_new_application_password($user->ID, array(
        'name' => 'React App Test'
    ));
    
    if (is_wp_error($app_password_data)) {
        echo "<p style='color: red;'><strong>❌ Failed to create Application Password:</strong> " . $app_password_data->get_error_message() . "</p>";
    } else {
        echo "<p style='color: green;'><strong>✅ Created new Application Password</strong></p>";
        echo "<p><strong>Password:</strong> <code>" . $app_password_data[0] . "</code></p>";
        echo "<p><strong>UUID:</strong> " . $app_password_data[1]['uuid'] . "</p>";
        echo "<p style='background: #f0f0f0; padding: 10px; border-radius: 5px;'>";
        echo "<strong>Use this for authentication:</strong><br>";
        echo "Username: admin<br>";
        echo "Password: " . $app_password_data[0] . "<br>";
        echo "Base64 encoded: " . base64_encode('admin:' . $app_password_data[0]);
        echo "</p>";
    }
} else {
    echo "<ul>";
    foreach ($app_passwords as $app_password) {
        echo "<li>";
        echo "<strong>Name:</strong> " . $app_password['name'] . "<br>";
        echo "<strong>UUID:</strong> " . $app_password['uuid'] . "<br>";
        echo "<strong>Created:</strong> " . date('Y-m-d H:i:s', $app_password['created']) . "<br>";
        echo "<strong>Last Used:</strong> " . ($app_password['last_used'] ? date('Y-m-d H:i:s', $app_password['last_used']) : 'Never') . "<br>";
        echo "</li>";
    }
    echo "</ul>";
}

// Test authentication with the password we know
echo "<h2>Testing Authentication</h2>";
$test_password = 'Test Password 1234';
echo "<p>Testing with password: <code>$test_password</code></p>";

// Test if this password works
$auth_result = WP_Application_Passwords::authenticate(null, 'admin', $test_password);

if (is_wp_error($auth_result)) {
    echo "<p style='color: red;'><strong>❌ Authentication failed:</strong> " . $auth_result->get_error_message() . "</p>";
} elseif ($auth_result) {
    echo "<p style='color: green;'><strong>✅ Authentication successful!</strong></p>";
    echo "<p>User: " . $auth_result->user_login . " (ID: " . $auth_result->ID . ")</p>";
} else {
    echo "<p style='color: orange;'><strong>⚠️ Authentication returned null (not handled by Application Passwords)</strong></p>";
}

// Check WordPress version
echo "<h2>System Information</h2>";
echo "<p><strong>WordPress Version:</strong> " . get_bloginfo('version') . "</p>";
echo "<p><strong>PHP Version:</strong> " . PHP_VERSION . "</p>";
echo "<p><strong>HTTPS:</strong> " . (is_ssl() ? 'Yes' : 'No') . "</p>";

// Check if HTTPS is required for Application Passwords
if (!is_ssl() && !defined('WP_ENVIRONMENT_TYPE')) {
    echo "<p style='color: orange;'><strong>⚠️ HTTPS not detected</strong></p>";
    echo "<p>Application Passwords typically require HTTPS in production.</p>";
    echo "<p>For local development, you might need to add this to wp-config.php:</p>";
    echo "<pre>define('WP_ENVIRONMENT_TYPE', 'local');</pre>";
}

?>
