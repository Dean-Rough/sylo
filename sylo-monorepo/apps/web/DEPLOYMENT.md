# Next.js Frontend Deployment Guide

This document outlines the process for deploying the Sylo Next.js frontend application to Vercel.

## Deployment Configuration

The frontend application is configured to be deployed to Vercel using the following setup:

- **Framework**: Next.js
- **Build Command**: `cd ../../ && npx nx build web`
- **Output Directory**: `../../dist/apps/web/.next`
- **Region**: `cdg1` (Europe - London)

## Environment Variables

The following environment variables need to be configured in the Vercel project settings:

### Required Environment Variables

```
# API URLs
NEXT_PUBLIC_API_URL=https://api.sylo.example.com
NEXT_PUBLIC_AI_CHAT_CORE_URL=https://ai-chat.sylo.example.com

# Authentication
NEXTAUTH_URL=https://sylo.example.com
NEXTAUTH_SECRET=your-nextauth-secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Optional Environment Variables

```
# Feature Flags
NEXT_PUBLIC_ENABLE_CHAT_HISTORY=true
NEXT_PUBLIC_ENABLE_PROMPT_REPOSITORY=true
NEXT_PUBLIC_ENABLE_USER_SETTINGS=true

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Deployment
NEXT_PUBLIC_DEPLOYMENT_ENV=production
```

## Deployment Process

### Automatic Deployment via GitHub

The application is configured for automatic deployment through GitHub integration:

1. The GitHub workflow (`.github/WORKFLOWS/frontend.yml`) is triggered on pushes to the `main` branch.
2. The workflow runs linting, testing, and building steps.
3. If all checks pass, the application is deployed to Vercel using the Vercel CLI.

Required GitHub secrets for the workflow:
- `VERCEL_TOKEN`: API token from Vercel
- `VERCEL_PROJECT_ID`: Project ID from Vercel
- `VERCEL_ORG_ID`: Organization ID from Vercel

### Manual Deployment

To deploy manually:

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```
   vercel login
   ```

3. Navigate to the project directory:
   ```
   cd sylo-monorepo/apps/web
   ```

4. Deploy to production:
   ```
   vercel --prod
   ```

## Vercel Configuration

The `vercel.json` file in the project root configures the deployment settings:

- Custom build and output directory settings for the NX monorepo
- Environment variable configuration
- API route rewrites
- Security headers
- GitHub integration settings

## Post-Deployment Verification

After deployment, verify the following:

1. The application loads correctly at the deployed URL
2. Authentication flows work properly
3. API connections to the backend services function correctly
4. All features are working as expected

## Troubleshooting

Common issues and solutions:

- **Build Failures**: Check the build logs in Vercel for specific errors
- **API Connection Issues**: Verify the `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_AI_CHAT_CORE_URL` environment variables
- **Authentication Problems**: Ensure `NEXTAUTH_URL` matches the deployed URL and `NEXTAUTH_SECRET` is properly set
- **Supabase Connection Issues**: Verify the Supabase URL and anon key are correct