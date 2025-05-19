# Directory Structure

This document outlines the proposed initial directory structure for the Design Studio Productivity App monorepo. The monorepo will be managed using a tool like Nx or Turborepo.

## Monorepo Root

```
/
|-- apps/
|   |-- web/                   # Next.js frontend and API routes
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

## 1. `apps/web/` (Next.js Frontend & API Routes)

This directory will house the Next.js application, including the frontend UI and Next.js API routes that act as the primary backend for user-facing operations.

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
|   |   |   |-- prompts/       # Prompt Repository
|   |   |   |   |-- page.tsx
|   |   |   |   |-- [promptId]/
|   |   |   |   |   |-- page.tsx
|   |   |   |-- settings/
|   |   |   |   |-- page.tsx
|   |   |   |-- chat/          # Full chat page
|   |   |   |   |-- page.tsx
|   |   |-- api/               # Next.js API Routes (Backend for Frontend)
|   |   |   |-- auth/
|   |   |   |   |-- [...nextauth]/ # If using NextAuth.js with Supabase adapter
|   |   |   |   |-- callback/    # Or custom Supabase auth callbacks
|   |   |   |-- user-settings/
|   |   |   |   |-- route.ts
|   |   |   |-- prompts/
|   |   |   |   |-- route.ts     # For CRUD on prompts
|   |   |   |   |-- improve/
|   |   |   |   |   |-- route.ts # For improving prompts via AI Core
|   |   |   |-- ai-chat/
|   |   |   |   |-- route.ts     # To proxy/orchestrate calls to AI Chat Core
|   |   |   |-- google/
|   |   |   |   |-- calendar/
|   |   |   |   |   |-- route.ts # Example Google Calendar API interaction
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
|   |-- lib/                   # Utility functions, Supabase client instance, etc.
|   |-- services/              # Functions for interacting with API routes
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

## 2. `apps/ai-chat-core/` (Python FastAPI AI Chat Core)

This directory will house the Python FastAPI service responsible for AI logic, OpenAI interactions, and direct Supabase communication for chat history and AI-related settings.

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

## 3. `packages/`

This directory contains shared code and configurations used across different applications in the monorepo.

### 3.1. `packages/ui/`
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

### 3.2. `packages/config/`
Shared configurations for tools like ESLint, Prettier, TypeScript.
```
packages/config/
|-- eslint/
|   |-- base.js
|   |-- nextjs.js
|   |-- react.js
|-- prettier/
|   |-- index.js
|-- tsconfig/
|   |-- base.json
|   |-- nextjs.json
|   |-- react-library.json
```

### 3.3. `packages/types/`
Shared TypeScript type definitions and interfaces used across `apps/web` and potentially by `apps/ai-chat-core` if communication involves complex shared structures (though direct DB types might be more relevant for AI Core).
```
packages/types/
|-- src/
|   |-- index.ts
|   |-- user.ts
|   |-- prompt.ts
|-- package.json
|-- tsconfig.json
```

This structure provides a good starting point for modularity and scalability. It will evolve as the project grows.