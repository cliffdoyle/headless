// Update frontend configuration to point to new WordPress backend
import fs from 'fs';
import path from 'path';

// New WordPress configuration
const NEW_WP_URL = 'https://vanessaphil.com';
const NEW_USERNAME = 'admin'; // Update with your new admin username
const NEW_APP_PASSWORD = 'YOUR_NEW_APP_PASSWORD'; // Update with new app password

function updateEnvFile() {
  try {
    console.log('🔄 Updating frontend configuration...');
    
    // Path to .env file
    const envPath = path.resolve('.env');
    
    // Read current .env file
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Update WordPress URL
    envContent = envContent.replace(
      /VITE_WORDPRESS_URL=.*/,
      `VITE_WORDPRESS_URL=${NEW_WP_URL}`
    );
    
    // Update WordPress username
    envContent = envContent.replace(
      /VITE_WORDPRESS_USERNAME=.*/,
      `VITE_WORDPRESS_USERNAME=${NEW_USERNAME}`
    );
    
    // Update WordPress app password
    envContent = envContent.replace(
      /VITE_WORDPRESS_APP_PASSWORD=.*/,
      `VITE_WORDPRESS_APP_PASSWORD=${NEW_APP_PASSWORD}`
    );
    
    // Create backup of original .env file
    fs.writeFileSync(`${envPath}.backup`, fs.readFileSync(envPath));
    
    // Write updated .env file
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ Frontend configuration updated successfully!');
    console.log('📝 Original configuration backed up to .env.backup');
    
  } catch (error) {
    console.error('❌ Failed to update frontend configuration:', error.message);
  }
}

updateEnvFile();
