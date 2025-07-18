<?php
/**
 * WordPress Production Setup Script for Lanfintech Blog
 * 
 * Upload this file to your WordPress root directory and run it once
 * to configure your WordPress installation for headless operation.
 * 
 * URL: https://versaceptal.com/wordpress-production-setup.php
 */

// Security check - remove this file after running
if (!defined('WP_DEBUG') && !isset($_GET['setup'])) {
    die('Access denied. Add ?setup=true to run this script.');
}

// Load WordPress
require_once('wp-config.php');
require_once('wp-load.php');

if (!current_user_can('administrator')) {
    wp_die('You must be logged in as an administrator to run this script.');
}

echo "<h1>🚀 Lanfintech Blog - WordPress Production Setup</h1>";

// 1. Enable REST API
echo "<h2>1. Checking REST API Status</h2>";
$rest_enabled = get_option('rest_api_enabled', true);
if ($rest_enabled) {
    echo "✅ REST API is enabled<br>";
} else {
    update_option('rest_api_enabled', true);
    echo "✅ REST API has been enabled<br>";
}

// 2. Configure CORS headers
echo "<h2>2. Configuring CORS Headers</h2>";
$cors_code = "
// Enable CORS for headless WordPress
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function(\$value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
        header('Access-Control-Allow-Credentials: true');
        return \$value;
    });
});

// Handle preflight OPTIONS requests
add_action('init', function() {
    if (\$_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
        header('Access-Control-Allow-Credentials: true');
        exit(0);
    }
});
";

$functions_file = get_template_directory() . '/functions.php';
if (file_exists($functions_file)) {
    $functions_content = file_get_contents($functions_file);
    if (strpos($functions_content, 'Enable CORS for headless WordPress') === false) {
        file_put_contents($functions_file, $functions_content . "\n" . $cors_code);
        echo "✅ CORS headers added to functions.php<br>";
    } else {
        echo "✅ CORS headers already configured<br>";
    }
} else {
    echo "⚠️ Could not find functions.php. Please add CORS headers manually.<br>";
}

// 3. Check Application Passwords
echo "<h2>3. Application Passwords Status</h2>";
if (function_exists('wp_is_application_passwords_available') && wp_is_application_passwords_available()) {
    echo "✅ Application Passwords are available<br>";
    
    // Get current user's application passwords
    $user_id = get_current_user_id();
    $passwords = WP_Application_Passwords::get_user_application_passwords($user_id);
    
    if (!empty($passwords)) {
        echo "✅ You have " . count($passwords) . " application password(s) configured<br>";
        echo "<strong>Existing Application Passwords:</strong><br>";
        foreach ($passwords as $password) {
            echo "- " . esc_html($password['name']) . " (created: " . date('Y-m-d H:i:s', $password['created']) . ")<br>";
        }
    } else {
        echo "⚠️ No application passwords found. You'll need to create one.<br>";
        echo "<a href='/wp-admin/profile.php#application-passwords-section'>Create Application Password</a><br>";
    }
} else {
    echo "❌ Application Passwords are not available. Please enable them.<br>";
}

// 4. Check permalink structure
echo "<h2>4. Permalink Structure</h2>";
$permalink_structure = get_option('permalink_structure');
if (empty($permalink_structure)) {
    update_option('permalink_structure', '/%postname%/');
    flush_rewrite_rules();
    echo "✅ Permalink structure set to /%postname%/<br>";
} else {
    echo "✅ Permalink structure: " . $permalink_structure . "<br>";
}

// 5. Test REST API endpoints
echo "<h2>5. Testing REST API Endpoints</h2>";

$test_endpoints = [
    '/wp-json/wp/v2/posts' => 'Posts endpoint',
    '/wp-json/wp/v2/users' => 'Users endpoint',
    '/wp-json/wp/v2/media' => 'Media endpoint',
    '/wp-json/wp/v2/categories' => 'Categories endpoint'
];

foreach ($test_endpoints as $endpoint => $description) {
    $url = home_url($endpoint);
    $response = wp_remote_get($url);
    
    if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200) {
        echo "✅ $description: <a href='$url' target='_blank'>$url</a><br>";
    } else {
        echo "❌ $description failed: $url<br>";
    }
}

// 6. Site configuration summary
echo "<h2>6. Site Configuration Summary</h2>";
echo "<strong>Site URL:</strong> " . home_url() . "<br>";
echo "<strong>Admin URL:</strong> " . admin_url() . "<br>";
echo "<strong>REST API Base:</strong> " . home_url('/wp-json/wp/v2') . "<br>";
echo "<strong>Current User:</strong> " . wp_get_current_user()->user_login . "<br>";

// 7. Environment variables for Vercel
echo "<h2>7. Environment Variables for Vercel</h2>";
echo "<p>Use these values in your Vercel environment variables:</p>";
echo "<code>";
echo "VITE_WORDPRESS_URL=" . home_url() . "<br>";
echo "VITE_WORDPRESS_USERNAME=" . wp_get_current_user()->user_login . "<br>";
echo "VITE_WORDPRESS_APP_PASSWORD=your-application-password-here<br>";
echo "</code>";

// 8. Next steps
echo "<h2>8. Next Steps</h2>";
echo "<ol>";
echo "<li>✅ Create an Application Password if you haven't already</li>";
echo "<li>✅ Test the REST API endpoints above</li>";
echo "<li>✅ Configure your Vercel environment variables</li>";
echo "<li>✅ Deploy your React frontend to Vercel</li>";
echo "<li>✅ Test the connection between frontend and backend</li>";
echo "<li>🗑️ <strong>Delete this file after setup is complete</strong></li>";
echo "</ol>";

// Security reminder
echo "<div style='background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 20px 0;'>";
echo "<strong>⚠️ Security Reminder:</strong><br>";
echo "Please delete this file (wordpress-production-setup.php) after running the setup to prevent unauthorized access.";
echo "</div>";

echo "<hr>";
echo "<p><strong>Setup completed!</strong> Your WordPress installation is now configured for headless operation.</p>";
?>
