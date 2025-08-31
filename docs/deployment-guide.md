# MBTI Assessment System - Deployment Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Environment Configuration](#environment-configuration)
4. [Deployment Option 1: Vercel (Recommended for Beginners)](#deployment-option-1-vercel)
5. [Deployment Option 2: Docker](#deployment-option-2-docker)
6. [Post-Deployment Steps](#post-deployment-steps)
7. [Troubleshooting](#troubleshooting)
8. [Security Considerations](#security-considerations)

## Introduction

This guide will walk you through deploying the MBTI Assessment System using two popular methods:
- **Vercel**: A cloud platform perfect for Next.js applications (easiest option)
- **Docker**: Containerized deployment for more control and portability

Both methods are production-ready and scalable. Choose based on your needs:
- **Choose Vercel if**: You want the simplest deployment with automatic SSL, global CDN, and zero configuration
- **Choose Docker if**: You need more control, want to deploy on your own servers, or need to integrate with existing infrastructure

## Prerequisites

### General Requirements
- Node.js 18.x or higher installed locally
- Git installed and configured
- A GitHub, GitLab, or Bitbucket account
- Basic command line knowledge

### For Vercel Deployment
- A Vercel account (free tier available)
- Your project pushed to a Git repository

### For Docker Deployment
- Docker Desktop installed (Windows/Mac) or Docker Engine (Linux)
- Basic understanding of containers
- (Optional) Docker Hub account for pushing images

## Environment Configuration

Before deploying, you need to set up your environment variables. The application uses these for API keys, database connections, and other sensitive data.

### 1. Create Environment Variables

Create a `.env.production` file in your project root:

```bash
# Copy the example file
cp .env.local .env.production
```

### 2. Required Environment Variables

```env
# Application Settings
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# API Keys (if using external services)
OPENAI_API_KEY=your-openai-api-key
DATABASE_URL=your-database-connection-string

# Session Configuration
SESSION_SECRET=generate-a-secure-random-string

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### 3. Generating Secure Values

For `SESSION_SECRET`, generate a secure random string:

```bash
# On Linux/Mac
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Deployment Option 1: Vercel

Vercel is the company behind Next.js and provides the easiest deployment experience.

### Step 1: Prepare Your Project

1. Ensure your project builds successfully:
   ```bash
   npm run build
   ```

2. Test the production build locally:
   ```bash
   npm run start
   ```

3. Commit all changes to Git:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### Step 2: Connect to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy your project:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Link to existing project? **No** (for first deployment)
   - What's your project's name? **mbti-assessment** (or your choice)
   - In which directory is your code located? **./** (press Enter)
   - Want to override the settings? **No**

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: **./** (leave as is)
   - Build Command: **npm run build** (default)
   - Output Directory: **.next** (default)

### Step 3: Configure Environment Variables in Vercel

1. In Vercel Dashboard, go to your project
2. Navigate to "Settings" → "Environment Variables"
3. Add each variable from your `.env.production`:
   - Name: `OPENAI_API_KEY`
   - Value: `your-actual-api-key`
   - Environment: Select all (Production, Preview, Development)
4. Click "Save" for each variable

### Step 4: Deploy

1. If using CLI:
   ```bash
   vercel --prod
   ```

2. If using Dashboard:
   - Click "Deploy"
   - Wait for the build to complete (usually 2-5 minutes)

### Step 5: Configure Custom Domain (Optional)

1. In Vercel Dashboard → "Settings" → "Domains"
2. Add your domain: `yourdomain.com`
3. Follow DNS configuration instructions:
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or use Vercel's nameservers for automatic configuration

### Vercel Deployment Complete! 🎉

Your app is now live at:
- Default URL: `https://your-project.vercel.app`
- Custom domain: `https://yourdomain.com` (if configured)

## Deployment Option 2: Docker

Docker provides a consistent environment across different platforms and is ideal for self-hosted deployments.

### Step 1: Create Dockerfile

Create a `Dockerfile` in your project root:

```dockerfile
# Stage 1: Dependencies
FROM node:18-alpine AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build the application
RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expose port
EXPOSE 3000

ENV PORT 3000

# Start the application
CMD ["node", "server.js"]
```

### Step 2: Create Docker Compose (Optional but Recommended)

Create `docker-compose.yml` for easier management:

```yaml
version: '3.8'

services:
  mbti-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_URL=https://yourdomain.com
    env_file:
      - .env.production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').request('http://localhost:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).end()"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Step 3: Update Next.js Configuration for Docker

Update `next.config.js` to support standalone output:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // ... your other configurations
}

module.exports = nextConfig
```

### Step 4: Build and Run with Docker

#### Option A: Using Docker Commands

1. Build the Docker image:
   ```bash
   docker build -t mbti-assessment .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 --env-file .env.production mbti-assessment
   ```

#### Option B: Using Docker Compose

1. Build and start:
   ```bash
   docker-compose up -d --build
   ```

2. View logs:
   ```bash
   docker-compose logs -f
   ```

3. Stop the application:
   ```bash
   docker-compose down
   ```

### Step 5: Push to Docker Hub (Optional)

1. Tag your image:
   ```bash
   docker tag mbti-assessment yourusername/mbti-assessment:latest
   ```

2. Push to Docker Hub:
   ```bash
   docker push yourusername/mbti-assessment:latest
   ```

### Step 6: Deploy to Production Server

On your production server:

1. Pull the image:
   ```bash
   docker pull yourusername/mbti-assessment:latest
   ```

2. Run with environment variables:
   ```bash
   docker run -d \
     --name mbti-app \
     -p 80:3000 \
     --restart unless-stopped \
     --env-file /path/to/.env.production \
     yourusername/mbti-assessment:latest
   ```

### Step 7: Configure Reverse Proxy (Nginx)

For production, use Nginx as a reverse proxy:

Create `/etc/nginx/sites-available/mbti-app`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/mbti-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 8: SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Post-Deployment Steps

### 1. Verify Deployment

- [ ] Visit your application URL
- [ ] Test all major features:
  - Language switching (Arabic/English)
  - Assessment flow
  - Results display
  - Session persistence

### 2. Set Up Monitoring

#### For Vercel:
- Analytics are included automatically
- Check the "Analytics" tab in your dashboard

#### For Docker:
Consider adding monitoring tools:

```yaml
# Add to docker-compose.yml
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"
```

### 3. Configure Backups

#### Database Backups:
```bash
# Example backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec postgres-container pg_dump -U user dbname > backup_$DATE.sql
```

#### Application State:
- Store session data in a persistent database
- Back up user-generated content regularly

### 4. Set Up CI/CD (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
      # Add deployment steps based on your platform
```

## Troubleshooting

### Common Vercel Issues

#### Build Failures
```
Error: Cannot find module 'X'
```
**Solution**: Ensure all dependencies are in `package.json`, not `devDependencies`

#### Environment Variable Issues
```
Error: Missing required environment variable
```
**Solution**: Check all variables are added in Vercel Dashboard → Settings → Environment Variables

#### Memory Issues
```
Error: JavaScript heap out of memory
```
**Solution**: Add to `package.json` scripts:
```json
"build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
```

### Common Docker Issues

#### Port Already in Use
```
Error: bind: address already in use
```
**Solution**: 
```bash
# Find process using port 3000
lsof -i :3000
# Or use different port
docker run -p 8080:3000 ...
```

#### Permission Denied
```
Error: EACCES: permission denied
```
**Solution**: Ensure the Dockerfile creates proper user permissions (already included in our Dockerfile)

#### Container Keeps Restarting
**Solution**: Check logs:
```bash
docker logs container-name
# Or with docker-compose
docker-compose logs mbti-app
```

### General Issues

#### API Calls Failing
- Verify environment variables are set correctly
- Check CORS settings if calling external APIs
- Ensure API keys are valid and have proper permissions

#### Styles Not Loading
- Clear browser cache
- Check that CSS imports are correct
- Verify Tailwind CSS is properly configured

#### Session Issues
- Ensure `SESSION_SECRET` is set and consistent
- Check cookie settings for production domain
- Verify session storage is persistent

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files to Git
- Use strong, unique values for secrets
- Rotate API keys regularly
- Use different keys for development and production

### 2. HTTPS Configuration
- Always use HTTPS in production
- Vercel provides SSL automatically
- For Docker, use Let's Encrypt or your SSL provider

### 3. Security Headers
Add to `next.config.js`:
```javascript
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}
```

### 4. Rate Limiting
Consider implementing rate limiting for API routes:
```javascript
// Example using express-rate-limit
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
```

### 5. Regular Updates
- Keep dependencies updated: `npm audit fix`
- Monitor security advisories
- Set up Dependabot on GitHub

## Conclusion

Congratulations! Your MBTI Assessment System is now deployed and ready for users. Remember to:

1. Monitor application performance
2. Keep dependencies updated
3. Regularly backup data
4. Review security settings
5. Scale resources as needed

For additional help:
- Next.js Documentation: https://nextjs.org/docs
- Vercel Documentation: https://vercel.com/docs
- Docker Documentation: https://docs.docker.com

Happy deploying! 🚀