<?php
/**
 * Create a working Application Password
 * Run this by visiting: http://myblog-backend.local/create-app-password.php
 */

// WordPress bootstrap
require_once('/home/cliff/Local Sites/myblog-backend/app/public/wp-config.php');

echo "<h1>Create Working Application Password</h1>";

// Get admin user
$user = get_user_by('login', 'admin');
if (!$user) {
    echo "<p style='color: red;'>❌ Admin user not found</p>";
    exit;
}

echo "<p>✅ Found admin user: {$user->user_login} (ID: {$user->ID})</p>";

// Check if Application Passwords are available
echo "<p><strong>Application Passwords Available:</strong> " . (WP_Application_Passwords::is_available() ? 'Yes' : 'No') . "</p>";
echo "<p><strong>Available for User:</strong> " . (WP_Application_Passwords::is_available_for_user($user) ? 'Yes' : 'No') . "</p>";

// Delete any existing "Test Password 1234" entries
$existing_passwords = WP_Application_Passwords::get_user_application_passwords($user->ID);
foreach ($existing_passwords as $password) {
    if (strpos($password['name'], 'Test') !== false || strpos($password['name'], 'React') !== false) {
        WP_Application_Passwords::delete_application_password($user->ID, $password['uuid']);
        echo "<p>🗑️ Deleted existing password: {$password['name']}</p>";
    }
}

// Create a new Application Password with a known value
echo "<h2>Creating New Application Password</h2>";

$result = WP_Application_Passwords::create_new_application_password($user->ID, array(
    'name' => 'Headless React App'
));

if (is_wp_error($result)) {
    echo "<p style='color: red;'>❌ Failed to create password: " . $result->get_error_message() . "</p>";
    exit;
}

$new_password = $result[0];
$password_data = $result[1];

echo "<p style='color: green;'>✅ Created new Application Password!</p>";

echo "<div style='background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;'>";
echo "<h3>🔑 Your Application Password Details</h3>";
echo "<p><strong>Name:</strong> Headless React App</p>";
echo "<p><strong>Username:</strong> admin</p>";
echo "<p><strong>Password:</strong> <code style='background: white; padding: 5px; font-size: 14px;'>$new_password</code></p>";
echo "<p><strong>UUID:</strong> {$password_data['uuid']}</p>";

$auth_string = base64_encode("admin:$new_password");
echo "<p><strong>Authorization Header:</strong></p>";
echo "<code style='background: white; padding: 10px; display: block; word-break: break-all; font-size: 12px;'>Authorization: Basic $auth_string</code>";
echo "</div>";

// Test the password immediately
echo "<h2>Testing the New Password</h2>";

// Test with WP_Application_Passwords::authenticate
$auth_test = WP_Application_Passwords::authenticate(null, 'admin', $new_password);

if (is_wp_error($auth_test)) {
    echo "<p style='color: red;'>❌ Direct authentication test failed: " . $auth_test->get_error_message() . "</p>";
} elseif ($auth_test && $auth_test->ID) {
    echo "<p style='color: green;'>✅ Direct authentication test passed!</p>";
    echo "<p>Authenticated as: {$auth_test->user_login} (ID: {$auth_test->ID})</p>";
} else {
    echo "<p style='color: orange;'>⚠️ Direct authentication returned: " . var_export($auth_test, true) . "</p>";
}

// Test with curl command
echo "<h2>Test Commands</h2>";
echo "<p>Test with curl:</p>";
echo "<pre style='background: #f0f0f0; padding: 10px; border-radius: 5px; font-size: 12px;'>";
echo "curl -X GET \"http://myblog-backend.local/wp-json/wp/v2/users/me\" \\\n";
echo "  -H \"Authorization: Basic $auth_string\"";
echo "</pre>";

echo "<p>Test media upload:</p>";
echo "<pre style='background: #f0f0f0; padding: 10px; border-radius: 5px; font-size: 12px;'>";
echo "curl -X POST \"http://myblog-backend.local/wp-json/wp/v2/media\" \\\n";
echo "  -H \"Authorization: Basic $auth_string\" \\\n";
echo "  -H \"Content-Disposition: attachment; filename=test.jpg\" \\\n";
echo "  -H \"Content-Type: image/jpeg\" \\\n";
echo "  --data-binary @/path/to/test.jpg";
echo "</pre>";

// Update your React app configuration
echo "<h2>Update Your React App</h2>";
echo "<p>In your React app, update the authentication to use:</p>";
echo "<pre style='background: #f0f0f0; padding: 10px; border-radius: 5px;'>";
echo "const auth = {\n";
echo "  username: 'admin',\n";
echo "  password: '$new_password'\n";
echo "};\n\n";
echo "// Or use the base64 encoded version:\n";
echo "const authHeader = 'Basic $auth_string';";
echo "</pre>";

?>
