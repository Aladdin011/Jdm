#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 JD Marc Frontend - Hostinger Deployment Script');
console.log('================================================');

try {
  // Step 1: Clean previous build
  console.log('\n📦 Step 1: Cleaning previous build...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
    console.log('✅ Previous build cleaned');
  }

  // Step 2: Run type check
  console.log('\n🔍 Step 2: Running type check...');
  execSync('npm run typecheck', { stdio: 'inherit' });
  console.log('✅ Type check passed');

  // Step 3: Build for production
  console.log('\n🏗️  Step 3: Building for production...');
  const buildStart = Date.now();
  execSync('npm run build', { stdio: 'inherit' });
  const buildTime = ((Date.now() - buildStart) / 1000).toFixed(2);
  console.log(`✅ Build completed in ${buildTime}s`);

  // Step 4: Create .htaccess file
  console.log('\n📝 Step 4: Creating .htaccess file...');
  const htaccessContent = `RewriteEngine On
RewriteBase /

# Handle client-side routing for React Router (SPA)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>`;

  fs.writeFileSync('dist/.htaccess', htaccessContent);
  console.log('✅ .htaccess file created');

  // Step 5: Analyze bundle size
  console.log('\n📊 Step 5: Analyzing bundle...');
  const distPath = path.join(__dirname, '..', 'dist');
  const assets = fs.readdirSync(path.join(distPath, 'assets'));
  
  let totalSize = 0;
  const sizeAnalysis = {
    css: 0,
    js: 0,
    other: 0
  };

  assets.forEach(file => {
    const filePath = path.join(distPath, 'assets', file);
    const stats = fs.statSync(filePath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    totalSize += stats.size;

    if (file.endsWith('.css')) {
      sizeAnalysis.css += stats.size;
    } else if (file.endsWith('.js')) {
      sizeAnalysis.js += stats.size;
    } else {
      sizeAnalysis.other += stats.size;
    }
  });

  console.log(`📦 Total bundle size: ${(totalSize / 1024).toFixed(2)} KB`);
  console.log(`   - CSS: ${(sizeAnalysis.css / 1024).toFixed(2)} KB`);
  console.log(`   - JS: ${(sizeAnalysis.js / 1024).toFixed(2)} KB`);
  console.log(`   - Other: ${(sizeAnalysis.other / 1024).toFixed(2)} KB`);

  // Step 6: Deployment instructions
  console.log('\n🌐 Step 6: Deployment Instructions');
  console.log('==================================');
  console.log('\n📋 Option A: Manual Upload to Hostinger');
  console.log('1. Login to your Hostinger control panel');
  console.log('2. Go to File Manager');
  console.log('3. Navigate to public_html/');
  console.log('4. Upload all files from the "dist/" folder');
  console.log('5. Ensure index.html is in the root of public_html/');
  
  console.log('\n🔗 Option B: Git Deployment (Recommended)');
  console.log('1. Push your code to your repository');
  console.log('2. In Hostinger, set up Git deployment');
  console.log('3. Build command: npm run build');
  console.log('4. Output directory: dist');
  
  console.log('\n⚙️  Environment Variables to Set in Hostinger:');
  console.log('VITE_API_URL=https://your-backend-domain.com');
  
  console.log('\n📁 Required Files Structure in public_html/:');
  console.log('public_html/');
  console.log('├── index.html');
  console.log('├── .htaccess');
  console.log('├── assets/');
  console.log('│   ├── *.css');
  console.log('│   ├── *.js');
  console.log('│   └── *.svg');
  console.log('└── images/ (if you have local images)');

  console.log('\n✅ Deployment package ready!');
  console.log('📦 Files to upload: dist/ folder contents');
  console.log(`📊 Total size: ${(totalSize / 1024).toFixed(2)} KB`);
  
} catch (error) {
  console.error('\n❌ Deployment failed:', error.message);
  process.exit(1);
}
