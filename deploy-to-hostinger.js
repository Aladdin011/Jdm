#!/usr/bin/env node

/**
 * Simple Hostinger Deployment Script
 * Builds the frontend and uploads to Hostinger via FTP
 */

import { execSync } from 'child_process';
import { FTP } from 'basic-ftp';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function deployToHostinger() {
  console.log('🚀 JD Marc Limited - Hostinger Deployment');
  console.log('==========================================\n');

  try {
    // Step 1: Build the project
    console.log('📦 Building project...');
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully\n');

    // Step 2: Verify build output
    if (!fs.existsSync('./dist')) {
      throw new Error('Build directory not found. Please ensure the build was successful.');
    }

    // Step 3: FTP Configuration
    const ftpConfig = {
      host: process.env.VITE_FTP_HOST || '46.202.183.111',
      user: process.env.VITE_FTP_USERNAME || 'u158969833.jdmarcng.com',
      password: process.env.VITE_FTP_PASSWORD || 'N#P5Q2pX~u5ivA30',
      port: parseInt(process.env.VITE_FTP_PORT) || 21,
      secure: false
    };

    console.log('🔗 Connecting to Hostinger...');
    console.log(`📡 Host: ${ftpConfig.host}`);
    console.log(`👤 User: ${ftpConfig.user}\n`);

    // Step 4: Upload to FTP
    const client = new FTP();
    
    await client.access(ftpConfig);
    console.log('✅ Connected to FTP server');

    // Navigate to public_html directory
    const remotePath = process.env.VITE_FTP_REMOTE_PATH || '/home/u158969833/domains/jdmarcng.com/public_html';
    await client.cd(remotePath);
    console.log(`📁 Changed to directory: ${remotePath}`);

    // Upload all files from dist directory
    console.log('📤 Uploading files...');
    await client.uploadFromDir('./dist');
    console.log('✅ All files uploaded successfully');

    // Step 5: Verify deployment
    const uploadedFiles = await client.list();
    console.log(`📊 Uploaded ${uploadedFiles.length} files/folders`);

    client.close();

    console.log('\n🎉 DEPLOYMENT SUCCESSFUL!');
    console.log('========================');
    console.log('🌐 Your website is now live at: https://jdmarcng.com');
    console.log('📱 Mobile version: https://m.jdmarcng.com');
    console.log('\n✅ Next Steps:');
    console.log('1. Test the website functionality');
    console.log('2. Update API URL to point to Render backend');
    console.log('3. Configure domain DNS if needed');
    console.log('4. Set up SSL certificate');

  } catch (error) {
    console.error('\n❌ DEPLOYMENT FAILED');
    console.error('==================');
    console.error('Error:', error.message);
    
    if (error.message.includes('530')) {
      console.log('\n💡 FTP Authentication Tips:');
      console.log('1. Check FTP credentials in .env file');
      console.log('2. Verify username and password in Hostinger panel');
      console.log('3. Ensure FTP service is enabled');
    }
    
    process.exit(1);
  }
}

// Run deployment
deployToHostinger();
