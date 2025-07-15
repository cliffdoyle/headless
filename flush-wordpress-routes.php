<?php
/**
 * Script to flush WordPress rewrite rules and force endpoint registration
 * Run this by visiting: http://myblog-backend.local/flush-wordpress-routes.php
 */

// WordPress bootstrap
require_once('/home/cliff/Local Sites/myblog-backend/app/public/wp-config.php');

echo "<h1>WordPress Route Flush</h1>";

// Force flush rewrite rules
flush_rewrite_rules(true);
echo "<p>✅ Flushed rewrite rules</p>";

// Clear any cached options
delete_option('custom_routes_flushed');
echo "<p>✅ Cleared custom route cache</p>";

// Trigger REST API initialization
do_action('rest_api_init');
echo "<p>✅ Triggered REST API initialization</p>";

// Test if our custom endpoint is now available
$rest_server = rest_get_server();
$routes = $rest_server->get_routes();

echo "<h2>Available Custom Routes:</h2>";
echo "<ul>";
foreach ($routes as $route => $handlers) {
    if (strpos($route, 'custom/') !== false) {
        echo "<li><strong>$route</strong></li>";
    }
}
echo "</ul>";

echo "<h2>Test Custom Endpoint:</h2>";
echo "<p><a href='http://myblog-backend.local/wp-json/custom/v1/debug-user' target='_blank'>Test debug-user endpoint</a></p>";

echo "<h2>All REST Routes (first 20):</h2>";
echo "<ul>";
$count = 0;
foreach ($routes as $route => $handlers) {
    if ($count++ < 20) {
        echo "<li>$route</li>";
    }
}
echo "</ul>";

echo "<p><strong>Done!</strong> Try accessing the debug endpoint now.</p>";
?>
