const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

console.log(`${colors.bright}${colors.cyan}=== Builder Aura Field - Auto Build Script ===${colors.reset}\n`);

try {
  // Step 1: Install dependencies
  console.log(`${colors.yellow}Installing dependencies...${colors.reset}`);
  execSync('npm install', { stdio: 'inherit' });
  
  // Step 2: Build the project
  console.log(`\n${colors.yellow}Building project with updated API URL...${colors.reset}`);
  execSync('npm run build', { stdio: 'inherit' });
  
  // Step 3: Verify the build
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    const files = fs.readdirSync(distPath);
    console.log(`\n${colors.green}Build successful! ${files.length} files/directories created in dist folder.${colors.reset}`);
    console.log(`\n${colors.magenta}The application is now configured to use the Render backend at:${colors.reset}`);
    
    // Read the API URL from .env.production
    const envPath = path.join(__dirname, '.env.production');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const apiUrlMatch = envContent.match(/VITE_API_URL=(.+)/);
      if (apiUrlMatch && apiUrlMatch[1]) {
        console.log(`${colors.bright}${apiUrlMatch[1]}${colors.reset}`);
      }
    }
    
    console.log(`\n${colors.cyan}You can now deploy the contents of the dist folder to your web server.${colors.reset}`);
  } else {
    console.error(`\n${colors.red}Build failed! The dist directory was not created.${colors.reset}`);
    process.exit(1);
  }
} catch (error) {
  console.error(`\n${colors.red}Error during build process:${colors.reset}\n`, error);
  process.exit(1);
}