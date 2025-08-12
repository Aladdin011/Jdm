#!/usr/bin/env node

require("dotenv").config();
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const FtpDeploy = require('ftp-deploy');

// === STEP 1: Validate Environment Variables ===
console.log('\n🔎 [Step 1] Validating environment variables...');
const requiredEnvVars = [
  'FTP_USER',
  'FTP_PASSWORD',
  'FTP_HOST',
  'VITE_API_BASE_URL'
];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease add these to your .env file:');
  requiredEnvVars.forEach(varName => console.error(`${varName}=your-value`));
  process.exit(1);
}
console.log('✅ All required environment variables are set.');

// === STEP 2: Build the Project ===
console.log('\n🏗️  [Step 2] Building the project...');
try {
  // Ensure the public/images directory exists with required subdirectories
  const imagesDirs = [
    path.join('public', 'images'),
    path.join('public', 'images', 'blog'),
    path.join('public', 'images', 'projects'),
    path.join('public', 'images', 'team'),
    path.join('public', 'images', 'services'),
    path.join('public', 'images', 'brand')
  ];

  imagesDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });

  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed!');
  process.exit(1);
}

// === STEP 3: Prepare Build Directory ===
console.log('\n📁 [Step 3] Preparing build directory...');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
const buildDirName = `jdmarc-frontend-build-${timestamp}`;
const buildDirPath = path.join(__dirname, buildDirName);

if (fs.existsSync(buildDirPath)) {
  fse.removeSync(buildDirPath);
  console.log(`🧹 Removed existing build directory: ${buildDirName}`);
}
fs.mkdirSync(buildDirPath);
console.log(`✅ Created build directory: ${buildDirName}`);

// === STEP 4: Copy Build Files ===
console.log('\n📋 [Step 4] Copying build files...');
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  fse.copySync(distPath, buildDirPath, { overwrite: true });
  
  // Copy images directory if it exists
  const imagesPath = path.join(__dirname, 'public', 'images');
  if (fs.existsSync(imagesPath)) {
    fse.copySync(imagesPath, path.join(buildDirPath, 'images'), { overwrite: true });
    console.log('✅ Images copied to build directory');
  }
  
  console.log(`✅ Files copied to: ${buildDirPath}`);
} else {
  console.error('❌ Build directory "dist" not found!');
  process.exit(1);
}

// === STEP 5: FTP Upload ===
console.log('\n🌐 [Step 5] Uploading to FTP server...');
const ftpDeploy = new FtpDeploy();
const config = {
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  host: process.env.FTP_HOST,
  port: parseInt(process.env.FTP_PORT) || 21,
  localRoot: buildDirPath,
  remoteRoot: process.env.FTP_REMOTE_PATH || "/public_html/",
  include: ["*", "**/*", ".htaccess"],
  exclude: [
    ".git/**",
    ".gitignore",
    "node_modules/**",
    "src/**",
    "*.log",
    "package.json",
    "package-lock.json"
  ],
  deleteRemote: true,
  forcePasv: true,
  sftp: false
};

console.log(`   Host: ${config.host}:${config.port}`);
console.log(`   User: ${config.user}`);
console.log(`   Remote path: ${config.remoteRoot}`);

ftpDeploy
  .deploy(config)
  .then(res => {
    console.log("\n✅ FTP upload completed successfully!");
    console.log(`📊 Uploaded ${res.length} files`);
    
    // === STEP 6: Cleanup ===
    console.log('\n🧹 [Step 6] Cleaning up local build directory...');
    fse.removeSync(buildDirPath);
    console.log('✅ Cleanup completed!');

    // === SUMMARY ===
    console.log('\n🎉 Deployment complete! Your site is live.');
  })
  .catch(err => {
    console.error("\n❌ FTP upload failed:", err.message);
    console.log('💡 Local build files are still available at:', buildDirPath);
    process.exit(1);
  });
