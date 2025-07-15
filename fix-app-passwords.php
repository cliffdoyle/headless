<?php
/**
 * Fix Application Passwords for local development
 * Run this by visiting: http://myblog-backend.local/fix-app-passwords.php
 */

// WordPress bootstrap
require_once('/home/cliff/Local Sites/myblog-backend/app/public/wp-config.php');

echo "<h1>Fix Application Passwords for Local Development</h1>";

// Check current environment
echo "<h2>Current Environment</h2>";
echo "<p><strong>WP_ENVIRONMENT_TYPE:</strong> " . (defined('WP_ENVIRONMENT_TYPE') ? WP_ENVIRONMENT_TYPE : 'Not defined') . "</p>";
echo "<p><strong>HTTPS:</strong> " . (is_ssl() ? 'Yes' : 'No') . "</p>";
echo "<p><strong>Application Passwords Available:</strong> " . (WP_Application_Passwords::is_available() ? 'Yes' : 'No') . "</p>";

// If Application Passwords aren't available, let's try to fix it
if (!WP_Application_Passwords::is_available()) {
    echo "<h2>Attempting to Fix Application Passwords</h2>";
    
    // Method 1: Set environment type programmatically
    if (!defined('WP_ENVIRONMENT_TYPE')) {
        define('WP_ENVIRONMENT_TYPE', 'local');
        echo "<p>✅ Set WP_ENVIRONMENT_TYPE to 'local'</p>";
    }
    
    // Method 2: Force HTTPS detection for local development
    $_SERVER['HTTPS'] = 'on';
    $_SERVER['SERVER_PORT'] = '443';
    
    echo "<p>✅ Forced HTTPS detection</p>";
    
    // Check again
    if (WP_Application_Passwords::is_available()) {
        echo "<p style='color: green;'><strong>✅ Application Passwords are now available!</strong></p>";
    } else {
        echo "<p style='color: red;'><strong>❌ Application Passwords still not available</strong></p>";
    }
}

// Get or create Application Password for admin user
$user = get_user_by('login', 'admin');
if ($user) {
    echo "<h2>Application Password Management</h2>";
    
    // Check existing passwords
    $existing_passwords = WP_Application_Passwords::get_user_application_passwords($user->ID);
    
    $found_test_password = false;
    foreach ($existing_passwords as $password) {
        if ($password['name'] === 'React App Test') {
            $found_test_password = true;
            echo "<p>✅ Found existing 'React App Test' password</p>";
            break;
        }
    }
    
    if (!$found_test_password) {
        echo "<p>Creating new Application Password...</p>";
        
        // Create new Application Password
        $result = WP_Application_Passwords::create_new_application_password($user->ID, array(
            'name' => 'React App Test'
        ));
        
        if (is_wp_error($result)) {
            echo "<p style='color: red;'><strong>❌ Failed to create password:</strong> " . $result->get_error_message() . "</p>";
        } else {
            echo "<p style='color: green;'><strong>✅ Created new Application Password!</strong></p>";
            echo "<div style='background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 10px 0;'>";
            echo "<h3>🔑 Your New Application Password</h3>";
            echo "<p><strong>Username:</strong> admin</p>";
            echo "<p><strong>Password:</strong> <code style='background: white; padding: 5px;'>" . $result[0] . "</code></p>";
            echo "<p><strong>Base64 for Authorization header:</strong></p>";
            echo "<code style='background: white; padding: 5px; display: block; word-break: break-all;'>Basic " . base64_encode('admin:' . $result[0]) . "</code>";
            echo "</div>";
            
            // Test the new password immediately
            echo "<h3>Testing New Password</h3>";
            $auth_test = WP_Application_Passwords::authenticate(null, 'admin', $result[0]);
            
            if (is_wp_error($auth_test)) {
                echo "<p style='color: red;'><strong>❌ Test failed:</strong> " . $auth_test->get_error_message() . "</p>";
            } elseif ($auth_test) {
                echo "<p style='color: green;'><strong>✅ Password works!</strong></p>";
            } else {
                echo "<p style='color: orange;'><strong>⚠️ Test inconclusive</strong></p>";
            }
        }
    }
}

// Provide instructions for wp-config.php
echo "<h2>Manual Fix Instructions</h2>";
echo "<p>If Application Passwords still don't work, add this to your wp-config.php file:</p>";
echo "<pre style='background: #f0f0f0; padding: 10px; border-radius: 5px;'>";
echo "// Enable Application Passwords for local development\n";
echo "define('WP_ENVIRONMENT_TYPE', 'local');\n";
echo "\n";
echo "// Alternative: Force Application Passwords to be available\n";
echo "add_filter('wp_is_application_passwords_available', '__return_true');\n";
echo "</pre>";

echo "<h2>Test Commands</h2>";
echo "<p>Test with curl:</p>";
echo "<pre style='background: #f0f0f0; padding: 10px; border-radius: 5px;'>";
echo 'curl -X GET "http://myblog-backend.local/wp-json/wp/v2/users/me" \\' . "\n";
echo '  -H "Authorization: Basic [BASE64_FROM_ABOVE]"' . "\n";
echo "</pre>";

?>
