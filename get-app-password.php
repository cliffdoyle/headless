<?php
/**
 * Get Application Password for testing
 */

// WordPress bootstrap
require_once('/home/cliff/Local Sites/myblog-backend/app/public/wp-config.php');

// Get admin user
$user = get_user_by('login', 'admin');
if (!$user) {
    echo "ERROR: Admin user not found\n";
    exit(1);
}

// Delete any existing test passwords
$existing_passwords = WP_Application_Passwords::get_user_application_passwords($user->ID);
foreach ($existing_passwords as $password) {
    if (strpos($password['name'], 'Test') !== false || strpos($password['name'], 'React') !== false) {
        WP_Application_Passwords::delete_application_password($user->ID, $password['uuid']);
    }
}

// Create a new Application Password
$result = WP_Application_Passwords::create_new_application_password($user->ID, array(
    'name' => 'Headless React App Test'
));

if (is_wp_error($result)) {
    echo "ERROR: Failed to create password: " . $result->get_error_message() . "\n";
    exit(1);
}

$new_password = $result[0];
$auth_string = base64_encode("admin:$new_password");

echo "SUCCESS\n";
echo "Username: admin\n";
echo "Password: $new_password\n";
echo "Auth String: $auth_string\n";

?>
