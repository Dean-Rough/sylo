# NestJS Backend Deployment Guide

This document outlines the process for deploying the Sylo NestJS backend application to AWS Elastic Container Service (ECS).

## Deployment Architecture

The backend application is deployed as a containerized service using the following AWS services:

- **Amazon ECR**: For storing Docker container images
- **Amazon ECS**: For running the containerized application
- **Amazon Fargate**: For serverless container execution
- **Amazon CloudWatch**: For logging and monitoring
- **AWS Parameter Store**: For securely storing environment variables
- **Amazon Application Load Balancer**: For routing traffic to the service

## Prerequisites

Before deploying, ensure you have:

1. AWS CLI installed and configured with appropriate permissions
2. Docker installed locally
3. Access to the AWS account where the application will be deployed

## Environment Variables

The following environment variables need to be configured in AWS Parameter Store:

### Required Environment Variables

```
/sylo/api-main/NODE_ENV=production
/sylo/api-main/PORT=3000
/sylo/api-main/HOST=0.0.0.0
/sylo/api-main/CORS_ORIGINS=https://sylo.example.com,https://api.sylo.example.com
/sylo/api-main/SUPABASE_URL=your_supabase_url_here
/sylo/api-main/SUPABASE_ANON_KEY=your_supabase_anon_key_here
/sylo/api-main/SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
/sylo/api-main/JWT_SECRET=your_jwt_secret_here
/sylo/api-main/JWT_EXPIRATION=1d
/sylo/api-main/AI_CHAT_CORE_URL=https://ai-chat.sylo.example.com
/sylo/api-main/GOOGLE_CLIENT_ID=your_google_client_id_here
/sylo/api-main/GOOGLE_CLIENT_SECRET=your_google_client_secret_here
/sylo/api-main/GOOGLE_REDIRECT_URI=https://api.sylo.example.com/auth/google/callback
/sylo/api-main/GOOGLE_API_SCOPES=https://www.googleapis.com/auth/calendar,https://www.googleapis.com/auth/drive.readonly
```

### Optional Environment Variables

```
/sylo/api-main/LOG_LEVEL=info
/sylo/api-main/RATE_LIMIT_WINDOW=15m
/sylo/api-main/RATE_LIMIT_MAX=100
/sylo/api-main/CACHE_TTL=300
```

## Deployment Process

### 1. Build and Push Docker Image

```bash
# Navigate to the monorepo root
cd sylo-monorepo

# Authenticate with AWS ECR
aws ecr get-login-password --region <REGION> | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com

# Build the Docker image
docker build -t sylo-api-main -f apps/api-main/Dockerfile .

# Tag the image
docker tag sylo-api-main:latest <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/sylo-api-main:latest

# Push the image to ECR
docker push <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/sylo-api-main:latest
```

### 2. Create ECS Resources

#### Create ECS Cluster (if not exists)

```bash
aws ecs create-cluster --cluster-name sylo-cluster
```

#### Create Task Definition

```bash
# Update the task definition with your account ID and region
sed -i 's/ACCOUNT_ID/<your-account-id>/g' apps/api-main/aws-ecs-task-definition.json
sed -i 's/REGION/<your-region>/g' apps/api-main/aws-ecs-task-definition.json

# Register the task definition
aws ecs register-task-definition --cli-input-json file://apps/api-main/aws-ecs-task-definition.json
```

#### Create ECS Service

```bash
aws ecs create-service \
  --cluster sylo-cluster \
  --service-name sylo-api-main \
  --task-definition sylo-api-main:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --platform-version LATEST \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345678,subnet-87654321],securityGroups=[sg-12345678],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:REGION:ACCOUNT_ID:targetgroup/sylo-api-main/1234567890,containerName=sylo-api-main,containerPort=3000"
```

### 3. Update GitHub Workflow

Update the `.github/WORKFLOWS/backend.yml` file to include the actual deployment steps:

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: ${{ secrets.AWS_REGION }}

- name: Login to Amazon ECR
  id: login-ecr
  uses: aws-actions/amazon-ecr-login@v2

- name: Build, tag, and push image to Amazon ECR
  env:
    ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
    ECR_REPOSITORY: sylo-api-main
    IMAGE_TAG: ${{ github.sha }}
  run: |
    cd sylo-monorepo
    docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG -t $ECR_REGISTRY/$ECR_REPOSITORY:latest -f apps/api-main/Dockerfile .
    docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
    docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

- name: Update ECS service
  run: |
    aws ecs update-service --cluster sylo-cluster --service sylo-api-main --force-new-deployment
```

## Monitoring and Logging

- **CloudWatch Logs**: All application logs are sent to CloudWatch Logs in the `/ecs/sylo-api-main` log group
- **CloudWatch Alarms**: Set up alarms for CPU utilization, memory usage, and error rates
- **Health Checks**: The application exposes a `/health` endpoint for load balancer health checks

## Scaling

The service is configured to run on AWS Fargate with 0.5 vCPU and 1GB of memory. To scale the service:

```bash
# Scale horizontally (add more tasks)
aws ecs update-service --cluster sylo-cluster --service sylo-api-main --desired-count 4

# Scale vertically (increase task resources)
# Update the task definition with new CPU and memory values, then update the service
```

## Rollback Process

To roll back to a previous version:

```bash
# Update the service to use a specific task definition revision
aws ecs update-service --cluster sylo-cluster --service sylo-api-main --task-definition sylo-api-main:5
```

## Troubleshooting

1. **Container fails to start**: Check CloudWatch Logs for error messages
2. **Health checks failing**: Verify the `/health` endpoint is working correctly
3. **Connection issues**: Check security group rules and network configuration
4. **Environment variable problems**: Verify all required parameters are set in Parameter Store