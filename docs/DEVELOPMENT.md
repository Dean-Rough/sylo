# Development Guide

This document provides comprehensive instructions for development across all components of the Design Studio Productivity App.

## Table of Contents

1. [Development Environment Setup](#development-environment-setup)
2. [Monorepo Structure](#monorepo-structure)
3. [Frontend Development (Next.js)](#frontend-development-nextjs)
4. [Backend Development (NestJS)](#backend-development-nestjs)
5. [AI Chat Core Development (Python/FastAPI)](#ai-chat-core-development-pythonfastapi)
6. [Development Process](#development-process)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

## Development Environment Setup

### Prerequisites

* Node.js v20.19.x (recommended for Nx compatibility)
* npm (preferred package manager)
* Python 3.10+ (for AI Chat Core)
* pip (for Python package management)
* Docker (for running local instances of Supabase or other services if needed)
* Access to Supabase project credentials
* OpenAI API key
* Google Cloud Platform project for OAuth credentials

### Initial Setup

1. Clone the repository
2. Install root dependencies:
   ```bash
   cd sylo-monorepo
   npm install
   ```
3. Set up environment variables:
   * Copy the `.env.example` files in the root and in each app directory to `.env` (or `.env.local` for Next.js)
   * Fill in the required credentials and configuration values

## Monorepo Structure

The project is organized as a monorepo managed by [Nx](https://nx.dev/). For a detailed overview of the directory structure, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Frontend Development (Next.js)

### Starting the Development Server

```bash
cd sylo-monorepo
npx nx serve web
```

The frontend will be available at `http://localhost:4200`.

### Building for Production

```bash
cd sylo-monorepo
npx nx build web
```

## Backend Development (NestJS)

### Starting the Development Server

```bash
cd sylo-monorepo
npx nx serve api-main
```

The API will be available at `http://localhost:3000`.

### Building for Production

```bash
cd sylo-monorepo
npx nx build api-main
```

This will compile the TypeScript code and place the output in the `dist` folder within `apps/api-main`.

To run the production build:

```bash
cd apps/api-main
npm run start:prod
```

### NestJS-AI Chat Core Integration

The NestJS backend communicates with the AI Chat Core service via HTTP requests. The `AiChatCoreModule` provides a service and controller for this communication:

- `AiChatCoreService`: Makes HTTP requests to the AI Chat Core API
- `AiChatCoreController`: Exposes endpoints for the frontend to use

To configure the NestJS backend to communicate with the AI Chat Core service, add the following to your `.env` file:

```
AI_CHAT_CORE_URL=http://localhost:4000
```

Available endpoints in the NestJS backend for interacting with the AI Chat Core:

- `POST /ai-chat/completion`: Generate a chat completion
- `POST /ai-chat/sessions`: Create a new chat session
- `DELETE /ai-chat/sessions/:sessionId`: Delete a chat session
- `GET /ai-chat/settings`: Get user settings
- `PUT /ai-chat/settings`: Update user settings
- `POST /ai-chat/prompts/improve`: Improve a prompt
- `POST /ai-chat/prompts/categorize`: Suggest categories for a prompt

All endpoints require authentication using the JWT strategy.

## AI Chat Core Development (Python/FastAPI)

### Tech Stack

* **Language/Framework:** Python with FastAPI
* **Dependency Management:** pip with `requirements.txt`
* **Development Server:** Uvicorn

### Common Development Scripts

The following scripts are located in the `apps/ai-chat-core/scripts/` directory.

#### 1. Install Dependencies

* **Script:** `./scripts/install-deps.sh`
* **Purpose:** Installs Python packages from `apps/ai-chat-core/requirements.txt`

```bash
cd apps/ai-chat-core
./scripts/install-deps.sh
```

#### 2. Start Development Server

* **Script:** `./scripts/start-dev.sh`
* **Purpose:** Starts the FastAPI application in development mode

```bash
cd apps/ai-chat-core
./scripts/start-dev.sh
```

The service will be available at `http://0.0.0.0:4000`.

#### 3. Kill Port 4000 and Start Server (Go Script)

* **Script:** `./scripts/go.sh`
* **Purpose:** Kills any process running on port 4000 and starts the server

```bash
cd apps/ai-chat-core
./scripts/go.sh
```

### Environment Variables

Ensure you have a `.env` file in the `apps/ai-chat-core/` directory, based on the `.env.example` template. This file should contain necessary configurations such as API keys and database connection strings.

## Development Process

The project follows a structured development roadmap outlined in [ROADMAP.md](./ROADMAP.md). This roadmap is organized into phases with clear milestones and task tracking to help coordinate development efforts.

### Development Workflow

1. **Task Selection**: Select tasks from the current phase in the roadmap
2. **Implementation**: Follow the coding standards in the project
3. **Testing**: Write appropriate tests for your implementation
4. **Code Review**: Submit a PR for review by at least one team member
5. **Deployment**: Once approved, changes will be deployed via CI/CD

### Tracking Progress

- Use the checkboxes in the roadmap to track completed tasks
- Update the "Current Progress" section in the roadmap when significant milestones are reached
- Keep the README.md "Implementation Status" section in sync with the roadmap

## Testing

### Frontend (Next.js/React)
- Unit Tests: Jest + React Testing Library
- End-to-End Tests: Playwright or Cypress (post-MVP)

### Backend (NestJS)
- Unit Tests: Jest
- Integration Tests: Jest
- End-to-End Tests: Jest with Supertest

### AI Chat Core (Python/FastAPI)
- Unit Tests: Pytest

## Deployment

### Frontend (Next.js)
- Deployed to Vercel
- CI/CD via GitHub Actions

### Backend (NestJS)
- Deployed to cloud environment (AWS ECS)
- CI/CD via GitHub Actions

### AI Chat Core (Python/FastAPI)
- Deployed to cloud environment (Google Cloud Run)
- CI/CD via GitHub Actions

## Troubleshooting

### Nx Build Issues

If you encounter issues with Nx builds, try the following:

1. Clear the Nx cache: `npx nx reset`
2. Remove `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Ensure you're using the correct Node.js version (v20.19.x)

### NestJS Build Issues

If you encounter issues with the NestJS build, the project uses a simplified build configuration that bypasses the complex Nx webpack configuration:

```json
// sylo-monorepo/apps/api-main/project.json (build target)
"build": {
  "executor": "nx:run-commands",
  "outputs": ["{projectRoot}/dist"],
  "options": {
    "command": "cd apps/api-main && npx nest build",
    "cwd": "."
  },
  "configurations": {
    "production": {
      "command": "cd apps/api-main && npx nest build --prod"
    }
  }
}
```

This approach:
1. Uses NestJS's native build system
2. Avoids issues with the `@nx/nest` package's missing executors
3. Is more reliable and easier to maintain