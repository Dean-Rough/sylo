# Directory Structure

This document outlines the proposed initial directory structure for the Design Studio Productivity App monorepo. The monorepo will be managed using a tool like Nx or Turborepo.

## Monorepo Root

```
/
|-- apps/
|   |-- web/                   # Next.js frontend application
|   |-- api-main/              # NestJS primary backend application
|   |-- ai-chat-core/          # Python FastAPI AI Chat Core service
|-- packages/
|   |-- ui/                    # Shared React UI components (Shadcn UI/Radix)
|   |-- config/                # Shared configurations (ESLint, Prettier, TypeScript)
|   |-- types/                 # Shared TypeScript types/interfaces
|-- .github/
|   |-- WORKFLOWS/             # CI/CD GitHub Actions
|-- .env.example               # Monorepo root example environment variables (if any)
|-- .eslintrc.js
|-- .gitignore
|-- .prettierrc.js
|-- package.json               # Monorepo root package.json (for Nx/Turborepo, Lerna)
|-- tsconfig.base.json         # Base TypeScript config for the monorepo
|-- CODING_STANDARDS.md
|-- DIRECTORY_STRUCTURE.md
|-- PROJECT_PLAN.md
|-- README.md                  # Monorepo root README
# ... other monorepo config files (nx.json, turbo.json, etc.)
```

## 1. `apps/web/` (Next.js Frontend Application)

This directory will house the Next.js **frontend** application. It is responsible for the user interface and user experience. It will make API calls to the `apps/api-main/` NestJS backend for data and backend operations. The Next.js API routes (`src/app/api/`) within this app should be limited to frontend-specific concerns like authentication callbacks or BFF (Backend for Frontend) patterns that don't involve core business logic, rather than acting as the primary backend.

```
apps/web/
|-- public/                    # Static assets (images, fonts, etc.)
|-- src/
|   |-- app/                   # Next.js App Router
|   |   |-- (auth)/            # Route group for authentication pages
|   |   |   |-- login/
|   |   |   |   |-- page.tsx
|   |   |-- (main)/            # Route group for main authenticated app layout
|   |   |   |-- layout.tsx
|   |   |   |-- dashboard/
|   |   |   |   |-- page.tsx
|   |   |   |-- prompts/       # Prompt Repository (UI)
|   |   |   |   |-- page.tsx
|   |   |   |   |-- [promptId]/
|   |   |   |   |   |-- page.tsx
|   |   |   |-- settings/
|   |   |   |   |-- page.tsx
|   |   |   |-- chat/          # Full chat page (UI)
|   |   |   |   |-- page.tsx
|   |   |-- api/               # Next.js API Routes (BFF, auth callbacks)
|   |   |   |-- auth/
|   |   |   |   |-- [...nextauth]/ # e.g., NextAuth.js with Supabase adapter
|   |   |   |-- callback/    # e.g., OAuth callbacks
|   |   |-- health/        # Example health check for the frontend app itself
|   |   |   |-- route.ts
|   |   |-- favicon.ico
|   |   |-- globals.css        # Global styles (Tailwind base, etc.)
|   |   |-- layout.tsx         # Root layout
|   |   |-- page.tsx           # Root page (e.g., landing or redirect)
|   |-- components/            # UI components (from packages/ui or app-specific)
|   |   |-- auth/
|   |   |-- chat/
|   |   |-- layout/
|   |   |-- prompts/
|   |   |-- shared/            # General shared components
|   |-- config/                # App-specific configurations
|   |-- contexts/              # React Context API providers
|   |-- hooks/                 # Custom React hooks
|   |-- lib/                   # Utility functions, API client setup, etc.
|   |-- services/              # Functions for interacting with `apps/api-main/`
|   |-- styles/                # Additional global styles or theme files if needed
|   |-- types/                 # App-specific TypeScript types (consider moving to packages/types)
|-- .env.local.example         # Example environment variables for the web app
|-- .eslintrc.js
|-- .gitignore
|-- next.config.js
|-- package.json
|-- postcss.config.js
|-- tailwind.config.ts
|-- tsconfig.json
```

## 2. `apps/api-main/` (NestJS Primary Backend)

This directory will house the NestJS application, serving as the primary backend API for the platform. It will handle core business logic, data persistence, and orchestrate calls to other services like `apps/ai-chat-core/`.

```
apps/api-main/
|-- src/
|   |-- main.ts                # Application entry point (bootstrap, listen)
|   |-- app.module.ts          # Root module of the application
|   |-- app.controller.ts      # Example root controller (e.g., for health checks)
|   |-- app.service.ts         # Example root service
|   |-- config/                # Configuration files/modules (e.g., database, auth, env)
|   |   |-- app.config.ts      # General application configuration
|   |   |-- database.config.ts # Database connection configuration
|   |-- modules/               # Feature-specific modules
|   |   |-- auth/              # Authentication and authorization
|   |   |   |-- auth.module.ts
|   |   |   |-- auth.controller.ts
|   |   |   |-- auth.service.ts
|   |   |   |-- strategies/    # e.g., jwt.strategy.ts, local.strategy.ts
|   |   |   |   |-- jwt.strategy.ts
|   |   |   |-- guards/        # e.g., jwt-auth.guard.ts
|   |   |   |   |-- jwt-auth.guard.ts
|   |   |   |-- dto/           # Data Transfer Objects for auth
|   |   |-- users/             # User management
|   |   |   |-- users.module.ts
|   |   |   |-- users.controller.ts
|   |   |   |-- users.service.ts
|   |   |   |-- dto/
|   |   |   |   |-- create-user.dto.ts
|   |   |   |   |-- update-user.dto.ts
|   |   |   |-- entities/
|   |   |   |   |-- user.entity.ts # TypeORM/Prisma entity
|   |   |-- prompts/           # Prompt management
|   |   |   |-- prompts.module.ts
|   |   |   |-- prompts.controller.ts
|   |   |   |-- prompts.service.ts
|   |   |   |-- dto/
|   |   |   |   |-- create-prompt.dto.ts
|   |   |   |   |-- update-prompt.dto.ts
|   |   |   |-- entities/
|   |   |   |   |-- prompt.entity.ts
|-- test/                      # E2E and unit tests
|   |-- app.e2e-spec.ts        # Example E2E test for the main app module
|   |-- jest-e2e.json          # Jest config for E2E tests
|   |-- unit/                  # Unit tests for services, controllers, etc.
|   |   |-- users.service.spec.ts
|-- .env.example               # Example environment variables for the API server
|-- .eslintrc.js
|-- .gitignore
|-- nest-cli.json              # NestJS CLI configuration file
|-- package.json
|-- README.md                  # README for the NestJS application
|-- tsconfig.build.json        # TypeScript config for building the project
|-- tsconfig.json              # Base TypeScript config for the project
```

## 3. `apps/ai-chat-core/` (Python FastAPI AI Chat Core Service)

This directory will house the Python FastAPI service responsible for AI logic, OpenAI interactions, and potentially direct Supabase communication for chat history and AI-related settings (though this might be centralized via `api-main` in the future). It will be called by the `apps/api-main/` (NestJS) application when AI functionalities are required.

```
apps/ai-chat-core/
|-- app/
|   |-- api/                   # API routers/endpoints
|   |   |-- v1/
|   |   |   |-- chat.py        # Chat interaction endpoints
|   |   |   |-- prompts.py     # Prompt improvement endpoints
|   |   |   |-- user_settings.py # AI interaction with user settings
|   |-- core/                  # Core logic, configurations
|   |   |-- config.py          # Pydantic settings model for env vars
|   |-- crud/                  # CRUD operations for Supabase (chat_history, user_settings)
|   |   |-- crud_chat_history.py
|   |   |-- crud_user_settings.py
|   |-- db/                    # Database session management, Supabase client init
|   |   |-- supabase_client.py
|   |-- models/                # Pydantic models for request/response, data structures
|   |   |-- chat.py
|   |   |-- prompt.py
|   |   |-- user.py
|   |-- services/              # Business logic, OpenAI interaction services
|   |   |-- openai_service.py
|   |   |-- prompt_service.py
|   |-- main.py                # FastAPI application instance and startup events
|-- tests/                     # Pytest tests
|   |-- api/
|   |-- services/
|-- .env.example               # Example environment variables for AI Chat Core
|-- .gitignore
|-- Dockerfile                 # For containerizing the service
|-- poetry.lock                # Or requirements.txt / Pipfile.lock
|-- pyproject.toml             # Or requirements.txt / Pipfile
|-- README.md
```

## 4. `packages/`

This directory contains shared code and configurations used across different applications in the monorepo.

### 4.1. `packages/ui/`
Shared React components built with Shadcn UI/Radix UI and Tailwind CSS, intended for use in `apps/web` and potentially other future frontends.
```
packages/ui/
|-- src/
|   |-- components/            # Actual Shadcn UI components (e.g., Button, Card)
|   |   |-- button.tsx
|   |   |-- card.tsx
|   |-- index.ts               # Barrel file exporting all components
|-- package.json
|-- tsconfig.json
```

### 4.2. `packages/config/`
Shared configurations for tools like ESLint, Prettier, TypeScript.
```
packages/config/
|-- eslint/
|   |-- base.js
|   |-- nextjs.js
|   |-- react.js
|   |-- nestjs.js              # Added config for NestJS
|-- prettier/
|   |-- index.js
|-- tsconfig/
|   |-- base.json
|   |-- nextjs.json
|   |-- react-library.json
|   |-- nestjs.json            # Added tsconfig for NestJS apps/libs
```

### 4.3. `packages/types/`
Shared TypeScript type definitions and interfaces used across `apps/web`, `apps/api-main`, and potentially by `apps/ai-chat-core` if communication involves complex shared structures.
```
packages/types/
|-- src/
|   |-- index.ts
|   |-- user.ts
|   |-- prompt.ts
|   |-- api-response.ts        # Example for shared API response structures
|-- package.json
|-- tsconfig.json
```

This structure provides a good starting point for modularity and scalability. It will evolve as the project grows.

*Note on Future Evolution: As the advanced AI Productivity Suite features (detailed in the [PROJECT_PLAN.md](PROJECT_PLAN.md)) are designed and implemented, this directory structure, particularly within `apps/api-main/src/modules/` and `apps/ai-chat-core/app/`, is expected to evolve. New dedicated modules (e.g., `calendar_module`, `task_scheduling_module`, `meeting_processing_module`) or even new microservices under `apps/` might be introduced to support these capabilities. This document will be updated iteratively to reflect such changes.*