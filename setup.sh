#!/bin/bash

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js is required. Please install it first."
    exit 1
fi

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo "Docker is required. Please install it first."
    exit 1
fi

# Start services
docker compose up -d

# Install dependencies
npm install

# Initialize database
npx prisma migrate deploy

# Start application
npm run dev