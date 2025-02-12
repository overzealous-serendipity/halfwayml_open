# HalfwayML - Open Source Transcription & Subtitling

A free, open-source alternative to commercial transcription services like Happyscribe, Notta, and Amberscript. Built for developers, content creators, and anyone who needs reliable transcription capabilities without the hefty price tag.

## Why HalfwayML?

Transcription isn't magic - it's technology that should be accessible to everyone. While most commercial services rely on the same speech-to-text models (like Whisper or AssemblyAI), they charge premium prices for their user interface.

HalfwayML provides:
- Professional-grade transcription capabilities
- User-friendly interface 
- Complete control over your data
- Self-hosted solution
- Transparent, open-source codebase

Currently, we support AssemblyAI (which offers $50 free credit to get started), with plans to integrate more models like Groq Whisper and other state-of-the-art options.

## Prerequisites

Before you begin, you'll need to install two essential pieces of software on your computer:

### 1. Node.js
This is a JavaScript runtime that powers our application

- Download from: https://nodejs.org/
- Choose the "LTS" (Long Term Support) version 
- Follow the installation instructions for your operating system

### 2. Docker
This helps run our database and storage services

- Download from: https://www.docker.com/products/docker-desktop/
- Install Docker Desktop for your operating system
- Make sure to start Docker Desktop after installation

## Installation Steps

### 1. Run the Setup Script
```bash
./setup.sh
```
This script will:

Start the required services (database and storage)
Install project dependencies
Set up the database

## 2. Configure Storage Service

Open your web browser and go to: http://localhost:9001
Login with:

Username: minioadmin
Password: minioadmin


Create a new bucket named "media"
Create access keys:

Click on "Access Keys" in the left sidebar
Click "Create access key"
Save both the Access Key and Secret Key somewhere safe



3. Update Environment Variables

Find the .env.local file in your project directory
Replace these values with the keys you just created:
```env
MINIO_ACCESS_KEY=your_access_key_here
MINIO_SECRET_KEY=your_secret_key_here
```
## 4. Start the Application
The application should now be running at http://localhost:3000
Note
We apologize for the somewhat complex setup process. We're actively working on simplifying this in future updates.
Need Help?
If you run into any issues or need assistance, please don't hesitate to reach out:

Email: mo@halfwayml.com
Create an issue on GitHub
Join our Discord community

We also offer a cloud version at halfwayml.com if you prefer a managed solution.
## Troubleshooting

Make sure Docker Desktop is running before starting the setup
If you get permission errors running the setup script, try: chmod +x setup.sh
If the services don't start, try stopping any existing databases running on port 5432