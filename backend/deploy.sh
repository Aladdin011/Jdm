#!/bin/bash

# JD Marc Backend - Fly.io Deployment Script
echo "🚀 Starting JD Marc Backend deployment to Fly.io..."

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo "❌ flyctl is not installed. Please install it first."
    exit 1
fi

# Check if user is logged in
if ! flyctl auth whoami &> /dev/null; then
    echo "🔐 Please login to Fly.io first:"
    flyctl auth login
fi

# Build the application
echo "📦 Building the application..."
npm run build

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Deploy to Fly.io
echo "🚀 Deploying to Fly.io..."
flyctl deploy

# Check deployment status
echo "✅ Deployment completed!"
echo "🌐 Your app is available at: https://jdmarc-backend.fly.dev"
echo "📊 Check logs with: flyctl logs"
echo "🔧 Open dashboard with: flyctl dashboard"