#!/bin/bash

# Deploy Backend to Hostinger
# This script uploads the PHP backend files to Hostinger via FTP

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FTP_HOST="srv1847.hstgr.io"
FTP_USER="u158969833_JDM"
FTP_PASS="1~mPr^A60mH"
REMOTE_DIR="/public_html/backend"
LOCAL_DIR="./hostinger-backend"

echo -e "${BLUE}🚀 Starting Backend Deployment to Hostinger...${NC}"

# Check if local directory exists
if [ ! -d "$LOCAL_DIR" ]; then
    echo -e "${RED}❌ Error: Local directory $LOCAL_DIR not found${NC}"
    exit 1
fi

# Check if lftp is installed
if ! command -v lftp &> /dev/null; then
    echo -e "${YELLOW}⚠️  lftp not found. Installing via Homebrew...${NC}"
    brew install lftp
fi

echo -e "${YELLOW}📁 Uploading backend files...${NC}"

# Upload files using lftp
lftp -c "
set ftp:ssl-allow no
set ssl:verify-certificate no
open -u $FTP_USER,$FTP_PASS $FTP_HOST
lcd $LOCAL_DIR
cd $REMOTE_DIR
mirror --reverse --delete --verbose --exclude-glob=node_modules/ --exclude-glob=.git/ --exclude-glob=*.log
bye
"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend deployment successful!${NC}"
    echo -e "${BLUE}🌐 Backend URL: https://jdmarcng.com/backend/${NC}"
    echo -e "${BLUE}🔍 Test endpoint: https://jdmarcng.com/backend/index.php${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
