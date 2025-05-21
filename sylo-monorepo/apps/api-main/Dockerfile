# Stage 1: Build the application
FROM node:20.19-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Copy the entire monorepo
COPY packages/ ./packages/
COPY apps/api-main/ ./apps/api-main/

# Install dependencies
RUN npm ci

# Build the application
RUN npx nx build api-main

# Stage 2: Create the production image
FROM node:20.19-alpine AS production

# Set working directory
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy package files
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application
COPY --from=builder /app/dist/apps/api-main ./dist

# Copy environment variables example file (for reference)
COPY --from=builder /app/apps/api-main/.env.example ./

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main.js"]