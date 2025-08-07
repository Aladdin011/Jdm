#!/bin/bash

# Create a temporary directory for backend-only repository
TEMP_DIR=$(mktemp -d)
echo "Created temporary directory: $TEMP_DIR"

# Copy backend files to temporary directory
cp -r backend/* $TEMP_DIR/
echo "Copied backend files to temporary directory"

# Navigate to temporary directory
cd $TEMP_DIR

# Initialize git repository
git init
echo "Initialized git repository"

# Add all files
git add .
echo "Added all files to git"

# Commit files
git commit -m "Initial backend setup for JD Marc"
echo "Created initial commit"

# Add remote origin
git remote add origin https://github.com/Aladdin011/Jdback.git
echo "Added remote origin"

# Set branch to main
git branch -M main
echo "Set branch to main"

# Push to remote repository
git push -u origin main
echo "Pushed to remote repository"

# Clean up
cd -
rm -rf $TEMP_DIR
echo "Cleaned up temporary directory"

echo "Backend successfully pushed to https://github.com/Aladdin011/Jdback.git"
