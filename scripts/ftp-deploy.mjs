#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import * as ftp from 'basic-ftp';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Load environment variables from the most specific file available
const envCandidates = ['.env.ftp', '.env.local', '.env'];
for (const candidate of envCandidates) {
  const envPath = path.join(projectRoot, candidate);
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

const {
  FTP_HOST,
  FTP_USER,
  FTP_PASSWORD,
  FTP_PASS,
  FTP_PORT = '21',
  FTP_SECURE = 'false',
  FTP_REMOTE_DIR,
  REMOTE_DIR,
  FTP_LOCAL_DIR,
  LOCAL_DIR,
  FTP_CLEAN = 'false',
} = process.env;

// Resolve compatibility across env var names
const resolvedPassword = FTP_PASSWORD ?? FTP_PASS;
const resolvedRemoteDir = FTP_REMOTE_DIR ?? REMOTE_DIR ?? '/public_html';
const resolvedLocalDir = FTP_LOCAL_DIR ?? LOCAL_DIR ?? 'dist';

function assert(value, name) {
  if (!value || String(value).trim() === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

async function main() {
  console.log('🚀 Hostinger FTP Deploy: Starting');

  // Validate required envs
  assert(FTP_HOST, 'FTP_HOST');
  assert(FTP_USER, 'FTP_USER');
  assert(resolvedPassword, 'FTP_PASSWORD/FTP_PASS');

  console.log('🔧 Configuration');
  console.log(`   • Host: ${FTP_HOST}`);
  console.log(`   • User: ${FTP_USER}`);
  console.log(`   • Port: ${FTP_PORT}`);
  console.log(`   • Secure: ${FTP_SECURE}`);
  console.log(`   • Remote Dir: ${resolvedRemoteDir}`);
  console.log(`   • Local Dir: ${resolvedLocalDir}`);

  // Ensure production build exists
  const localUploadPath = path.join(projectRoot, resolvedLocalDir);
  if (resolvedLocalDir === 'dist') {
    if (!fs.existsSync(localUploadPath)) {
      console.log('📦 No dist/ found. Running production build...');
      const buildStart = Date.now();
      execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });
      const buildTime = ((Date.now() - buildStart) / 1000).toFixed(2);
      console.log(`✅ Build completed in ${buildTime}s`);
    }
  } else {
    // Custom local directory; ensure it exists
    if (!fs.existsSync(localUploadPath)) {
      throw new Error(`Local upload directory not found: ${localUploadPath}`);
    }
  }

  const client = new ftp.Client();
  client.ftp.verbose = true;

  try {
    console.log(`🔌 Connecting to ${FTP_HOST}:${FTP_PORT} (secure: ${FTP_SECURE})`);
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: resolvedPassword,
      port: Number(FTP_PORT),
      secure: FTP_SECURE === 'true',
    });

    console.log(`📁 Ensuring remote directory: ${resolvedRemoteDir}`);
    await client.ensureDir(resolvedRemoteDir);

    if (FTP_CLEAN === 'true') {
      console.log('🧹 Cleaning remote directory before upload...');
      await client.clearWorkingDir();
    }

    console.log(`⏫ Uploading ${resolvedLocalDir}/ contents to server...`);
    await client.uploadFromDir(localUploadPath);

    // Upload .htaccess for SPA only when deploying dist
    if (resolvedLocalDir === 'dist') {
      const publicHtaccess = path.join(projectRoot, 'public', '.htaccess');
      if (fs.existsSync(publicHtaccess)) {
        console.log('⚙️ Uploading public/.htaccess');
        await client.uploadFrom(publicHtaccess, path.posix.join(resolvedRemoteDir, '.htaccess'));
      }
      const rootHtaccess = path.join(projectRoot, '.htaccess');
      if (fs.existsSync(rootHtaccess)) {
        console.log('ℹ️ Root .htaccess detected but not uploaded to avoid conflicts. Using public/.htaccess for SPA rewrites.');
      }
    }
    console.log('✅ Upload complete');

    console.log('🔒 Closing connection');
    client.close();
  } catch (err) {
    console.error('❌ FTP deployment failed:', err?.message || err);
    try { client.close(); } catch (_) {}
    process.exit(1);
  }

  console.log('🎉 Deployment finished successfully');
}

main();