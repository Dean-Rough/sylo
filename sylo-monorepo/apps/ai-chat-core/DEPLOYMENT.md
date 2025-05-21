# AI Chat Core Deployment Guide

This document outlines the process for deploying the Sylo AI Chat Core Python FastAPI application to Google Cloud Run.

## Deployment Architecture

The AI Chat Core service is deployed as a containerized service using the following Google Cloud services:

- **Google Cloud Run**: For running the containerized application
- **Google Container Registry (GCR)**: For storing Docker container images
- **Google Secret Manager**: For securely storing environment variables
- **Google Cloud Logging**: For logging and monitoring

## Prerequisites

Before deploying, ensure you have:

1. Google Cloud SDK installed and configured with appropriate permissions
2. Docker installed locally
3. Access to the Google Cloud project where the application will be deployed

## Environment Variables

The following environment variables need to be configured as secrets in Google Secret Manager:

### Required Environment Variables

```
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ORG_ID=your_openai_org_id_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
JWT_SECRET=your_jwt_secret_here
CORS_ORIGINS=https://sylo.example.com,https://api.sylo.example.com
```

### Default Environment Variables (Set in Cloud Run Configuration)

```
ENVIRONMENT=production
API_HOST=0.0.0.0
API_PORT=4000
API_ROOT_PATH=/api/v1
LOG_LEVEL=INFO
LOG_FORMAT=json
ENABLE_MULTI_MODEL=true
DEFAULT_MODEL=gpt-4o
DEFAULT_MAX_TOKENS=1000
DEFAULT_TEMPERATURE=0.7
```

## Deployment Process

### 1. Create Google Cloud Resources

#### Create Service Account

```bash
# Create a service account for the AI Chat Core service
gcloud iam service-accounts create sylo-ai-chat-core \
  --display-name="Sylo AI Chat Core Service Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:sylo-ai-chat-core@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

#### Create Secrets in Secret Manager

```bash
# Create secrets for each environment variable
for SECRET_NAME in OPENAI_API_KEY OPENAI_ORG_ID ANTHROPIC_API_KEY SUPABASE_URL SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY JWT_SECRET CORS_ORIGINS; do
  echo "Creating secret $SECRET_NAME"
  echo -n "Enter value for $SECRET_NAME: "
  read -s SECRET_VALUE
  echo
  
  # Create the secret
  echo -n $SECRET_VALUE | gcloud secrets create "ai-chat-core-$SECRET_NAME" \
    --replication-policy="automatic" \
    --data-file=-
  
  # Grant access to the service account
  gcloud secrets add-iam-policy-binding "ai-chat-core-$SECRET_NAME" \
    --member="serviceAccount:sylo-ai-chat-core@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
done
```

### 2. Build and Push Docker Image

```bash
# Navigate to the AI Chat Core directory
cd sylo-monorepo/apps/ai-chat-core

# Build the Docker image
docker build -t gcr.io/PROJECT_ID/sylo-ai-chat-core:latest .

# Push the image to Google Container Registry
docker push gcr.io/PROJECT_ID/sylo-ai-chat-core:latest
```

### 3. Deploy to Cloud Run

#### Using the Cloud Run Service YAML

```bash
# Update the service YAML with your project ID
sed -i 's/PROJECT_ID/your-project-id/g' cloud-run-service.yaml

# Deploy the service
gcloud run services replace cloud-run-service.yaml --region=us-central1
```

#### Using the gcloud Command Line

```bash
# Deploy the service
gcloud run deploy sylo-ai-chat-core \
  --image=gcr.io/PROJECT_ID/sylo-ai-chat-core:latest \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --service-account=sylo-ai-chat-core@PROJECT_ID.iam.gserviceaccount.com \
  --memory=2Gi \
  --cpu=1 \
  --min-instances=1 \
  --max-instances=10 \
  --port=4000 \
  --set-env-vars=ENVIRONMENT=production,API_HOST=0.0.0.0,API_PORT=4000,API_ROOT_PATH=/api/v1,LOG_LEVEL=INFO,LOG_FORMAT=json,ENABLE_MULTI_MODEL=true,DEFAULT_MODEL=gpt-4o,DEFAULT_MAX_TOKENS=1000,DEFAULT_TEMPERATURE=0.7 \
  --set-secrets=OPENAI_API_KEY=ai-chat-core-OPENAI_API_KEY:latest,OPENAI_ORG_ID=ai-chat-core-OPENAI_ORG_ID:latest,ANTHROPIC_API_KEY=ai-chat-core-ANTHROPIC_API_KEY:latest,SUPABASE_URL=ai-chat-core-SUPABASE_URL:latest,SUPABASE_ANON_KEY=ai-chat-core-SUPABASE_ANON_KEY:latest,SUPABASE_SERVICE_ROLE_KEY=ai-chat-core-SUPABASE_SERVICE_ROLE_KEY:latest,JWT_SECRET=ai-chat-core-JWT_SECRET:latest,CORS_ORIGINS=ai-chat-core-CORS_ORIGINS:latest
```

### 4. Update GitHub Workflow

Update the `.github/WORKFLOWS/ai-chat-core.yml` file to include the actual deployment steps:

```yaml
- name: Setup Google Cloud SDK
  uses: google-github-actions/setup-gcloud@v2
  with:
    project_id: ${{ secrets.GCP_PROJECT_ID }}
    service_account_key: ${{ secrets.GCP_SA_KEY }}
    export_default_credentials: true

- name: Configure Docker for GCR
  run: gcloud auth configure-docker gcr.io

- name: Build and push Docker image
  run: |
    cd sylo-monorepo/apps/ai-chat-core
    docker build -t gcr.io/${{ secrets.GCP_PROJECT_ID }}/sylo-ai-chat-core:${{ github.sha }} -t gcr.io/${{ secrets.GCP_PROJECT_ID }}/sylo-ai-chat-core:latest .
    docker push gcr.io/${{ secrets.GCP_PROJECT_ID }}/sylo-ai-chat-core:${{ github.sha }}
    docker push gcr.io/${{ secrets.GCP_PROJECT_ID }}/sylo-ai-chat-core:latest

- name: Deploy to Cloud Run
  run: |
    gcloud run deploy sylo-ai-chat-core \
      --image=gcr.io/${{ secrets.GCP_PROJECT_ID }}/sylo-ai-chat-core:${{ github.sha }} \
      --platform=managed \
      --region=${{ secrets.GCP_REGION }} \
      --quiet
```

## Monitoring and Logging

- **Cloud Logging**: All application logs are sent to Cloud Logging
- **Cloud Monitoring**: Set up alerts for error rates, latency, and instance count
- **Health Checks**: The application exposes a `/health` endpoint for health checks

## Scaling

The service is configured to run on Cloud Run with 1 vCPU and 2GB of memory. Cloud Run automatically scales based on traffic:

- Minimum instances: 1 (to avoid cold starts)
- Maximum instances: 10 (to control costs)

## Rollback Process

To roll back to a previous version:

```bash
# List previous revisions
gcloud run revisions list --service=sylo-ai-chat-core --region=us-central1

# Roll back to a specific revision
gcloud run services update-traffic sylo-ai-chat-core \
  --to-revisions=REVISION_NAME=100 \
  --region=us-central1
```

## Troubleshooting

1. **Container fails to start**: Check Cloud Logging for error messages
2. **Health checks failing**: Verify the `/health` endpoint is working correctly
3. **Connection issues**: Check network configuration and firewall rules
4. **Environment variable problems**: Verify all required secrets are properly set
5. **API errors**: Check the application logs for specific error messages