# System Architecture

This document outlines the architecture of the Design Studio Productivity App, including the system components, their interactions, and the directory structure of the monorepo.

## 1. Conceptual Architecture

The system is built as a modern web application with a clear separation of concerns between frontend, backend, and AI services. The architecture is designed to be scalable, maintainable, and secure.

```mermaid
graph TD
    subgraph UserInteraction
        User([User])
    end

    subgraph Frontend_Vercel [Frontend (Next.js on Vercel)]
        F_AuthPage[Login Page]
        F_ChatUI[AI Chat UI]
        F_VoiceMode[Voice Mode UI]
        F_UserSettingsPage[User Settings Page]
        F_TeamSettingsPage[Team Settings Page]
        F_PromptRepoPage[Prompt Repository Page]
        F_ProjectManagement[Project Management UI]
        F_Dashboard[Dashboard UI]
        F_Whiteboard[Whiteboard/Quick Notes UI]
        F_GoogleWorkspace[Google Workspace UI]
        F_AppShell[App Shell/Nav]
    end

    subgraph Backend_NestJS [Backend (NestJS Application)]
        B_ApiEndpoints[API Endpoints]
        B_AuthHandler[Auth Handler]
        B_SupabaseClient[Supabase Interaction Logic]
        B_AIC_Orchestrator[AI Chat Core Orchestrator]
        B_GoogleAPI_Handler[Google API Interaction Logic]
        B_ProjectManager[Project Management Logic]
        B_TaskManager[Task Management Logic]
        B_WhiteboardManager[Whiteboard/Notes Manager]
        B_TeamSettingsManager[Team Settings Manager]
    end

    subgraph Supabase_PaaS [Supabase (DB, Auth, Storage)]
        S_Auth[Supabase Auth - Google OAuth]
        S_DB[(PostgreSQL Database: users, profiles, user_settings, chat_history, prompt_repository, teams, projects, tasks, task_dependencies, notes)]
        S_Storage[Supabase Storage]
    end

    subgraph AI_Chat_Core_Service [AI Chat Core (Python/FastAPI - Separate Service)]
        AIC_Engine[Conversational Engine]
        AIC_OpenAI_Integration[OpenAI Model Integration]
        AIC_Supabase_Comm[Communicator with Supabase DB]
        AIC_API_Endpoint[API for NestJS Backend]
    end

    subgraph ExternalServices
        Ext_GoogleAPIs[Google APIs]
        Ext_GoogleCalendar[Google Calendar]
        Ext_GoogleDrive[Google Drive]
        Ext_OpenAI_API[OpenAI API]
    end

    %% Connections
    User --> F_AppShell
    F_AppShell --> F_AuthPage
    F_AppShell --> F_ChatUI
    F_AppShell --> F_VoiceMode
    F_AppShell --> F_UserSettingsPage
    F_AppShell --> F_TeamSettingsPage
    F_AppShell --> F_PromptRepoPage
    F_AppShell --> F_ProjectManagement
    F_AppShell --> F_Dashboard
    F_AppShell --> F_Whiteboard
    F_AppShell --> F_GoogleWorkspace

    F_AuthPage --> S_Auth %% Initial Auth with Supabase
    F_AuthPage --> B_AuthHandler %% Token validation with NestJS

    F_ChatUI --> B_ApiEndpoints
    F_VoiceMode --> B_ApiEndpoints
    F_UserSettingsPage --> B_ApiEndpoints
    F_TeamSettingsPage --> B_ApiEndpoints
    F_PromptRepoPage --> B_ApiEndpoints
    F_ProjectManagement --> B_ApiEndpoints
    F_Dashboard --> B_ApiEndpoints
    F_Whiteboard --> B_ApiEndpoints
    F_GoogleWorkspace --> B_ApiEndpoints

    B_AuthHandler --> S_Auth %% NestJS validates token with Supabase

    B_SupabaseClient --> S_DB
    B_ApiEndpoints --> B_SupabaseClient
    B_ApiEndpoints --> B_AIC_Orchestrator
    B_ApiEndpoints --> B_GoogleAPI_Handler
    B_ApiEndpoints --> B_ProjectManager
    B_ApiEndpoints --> B_TaskManager
    B_ApiEndpoints --> B_WhiteboardManager
    B_ApiEndpoints --> B_TeamSettingsManager

    B_AIC_Orchestrator --> AIC_API_Endpoint
    B_GoogleAPI_Handler --> Ext_GoogleAPIs %% Via User's Google Token, proxied by NestJS
    B_GoogleAPI_Handler --> Ext_GoogleCalendar
    B_GoogleAPI_Handler --> Ext_GoogleDrive

    AIC_API_Endpoint --> AIC_Engine
    AIC_Engine --> AIC_OpenAI_Integration
    AIC_Engine --> AIC_Supabase_Comm

    AIC_OpenAI_Integration --> Ext_OpenAI_API
    AIC_Supabase_Comm --> S_DB
```

## 2. Key Components

### 2.1 Frontend (Next.js)
- **Technology**: Next.js (React) with TypeScript
- **Styling**: Shadcn UI / Radix UI + Tailwind CSS
- **Hosting**: Vercel
- **Key Features**:
  - Google OAuth authentication
  - AI chat interface
  - User settings management
  - Prompt repository management

### 2.2 Backend API (NestJS)
- **Technology**: NestJS (TypeScript)
- **Key Responsibilities**:
  - Handle authenticated requests from frontend
  - Orchestrate AI Chat Core interactions
  - Manage Supabase database operations
  - Handle Google API integrations

### 2.3 AI Chat Core (Python/FastAPI)
- **Technology**: Python with FastAPI
- **Key Responsibilities**:
  - Manage OpenAI model interactions
  - Handle chat memory and context
  - Process and improve prompts
  - Manage user AI preferences

### 2.4 Database & Authentication (Supabase)
- **Technology**: PostgreSQL via Supabase
- **Key Features**:
  - User authentication (Google OAuth)
  - Database for storing user data, chat history, prompts
  - Row Level Security (RLS) for data protection
  - Storage for project files and attachments

### 2.5 Project Management Module
- **Technology**: NestJS backend with React frontend
- **Key Components**:
  - Database tables for projects, tasks, and task dependencies
  - Backend API endpoints for CRUD operations
  - Frontend components for project visualization and management
  - Authorization system for project operations

### 2.6 Google Workspace Integration
- **Technology**: Google API client libraries with OAuth 2.0
- **Key Components**:
  - Calendar integration (read/write capabilities)
  - Drive interaction (list, upload, download, share)
  - Meeting scheduler with automatic calendar event creation
  - Frontend components for calendar view, Drive browser, and meeting scheduler

### 2.7 Additional Core Features
- **Whiteboard/Quick Notes**: Real-time note-taking and idea capture functionality
- **Team Settings for AI**: Centralized configuration for AI behavior across team members
- **Dashboard**: Quick access to key information, projects, and actions
- **Voice Mode**: Speech-to-text interaction with AI chat interface

## 3. Directory Structure

The project is organized as a monorepo managed by [Nx](https://nx.dev/).

### 3.1 Monorepo Root

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
|-- docs/                      # Project documentation
|-- .env.example               # Monorepo root example environment variables
|-- .eslintrc.js
|-- .gitignore
|-- .prettierrc.js
|-- package.json               # Monorepo root package.json
|-- tsconfig.base.json         # Base TypeScript config for the monorepo
|-- README.md                  # Monorepo root README
|-- nx.json                    # Nx configuration file
```

### 3.2 Frontend Application (`apps/web/`)

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
|   |   |-- globals.css        # Global styles (Tailwind base, etc.)
|   |   |-- layout.tsx         # Root layout
|   |   |-- page.tsx           # Root page (e.g., landing or redirect)
|   |-- components/            # UI components
|   |-- config/                # App-specific configurations
|   |-- contexts/              # React Context API providers
|   |-- hooks/                 # Custom React hooks
|   |-- lib/                   # Utility functions, API client setup, etc.
|   |-- services/              # Functions for interacting with `apps/api-main/`
|-- .env.local.example         # Example environment variables for the web app
|-- next.config.js
|-- package.json
|-- tailwind.config.ts
|-- tsconfig.json
```

### 3.3 Backend API (`apps/api-main/`)

```
apps/api-main/
|-- src/
|   |-- main.ts                # Application entry point
|   |-- app.module.ts          # Root module of the application
|   |-- app.controller.ts      # Root controller
|   |-- app.service.ts         # Root service
|   |-- config/                # Configuration files/modules
|   |-- modules/               # Feature-specific modules
|   |   |-- auth/              # Authentication and authorization
|   |   |-- users/             # User management
|   |   |-- prompts/           # Prompt management
|   |   |-- google/            # Google API integration
|-- test/                      # E2E and unit tests
|-- .env.example               # Example environment variables
|-- nest-cli.json              # NestJS CLI configuration file
|-- package.json
|-- tsconfig.json
```

### 3.4 AI Chat Core (`apps/ai-chat-core/`)

```
apps/ai-chat-core/
|-- app/
|   |-- api/                   # API routers/endpoints
|   |   |-- v1/
|   |   |   |-- chat.py        # Chat interaction endpoints
|   |   |   |-- prompts.py     # Prompt improvement endpoints
|   |   |   |-- user_settings.py # AI interaction with user settings
|   |-- core/                  # Core logic, configurations
|   |-- crud/                  # CRUD operations for Supabase
|   |-- db/                    # Database session management
|   |-- models/                # Pydantic models
|   |-- services/              # Business logic, OpenAI interaction services
|   |-- main.py                # FastAPI application instance
|-- scripts/                   # Utility scripts
|-- .env.example               # Example environment variables
|-- Dockerfile                 # For containerizing the service
|-- requirements.txt           # Python dependencies
```

## 4. Communication Flow

1. **User Authentication**:
   - User logs in via Google OAuth through the Next.js frontend
   - Authentication is handled by Supabase
   - JWT tokens are validated by the NestJS backend

2. **AI Chat Interaction**:
   - User sends a message through the chat interface (text or voice)
   - Frontend sends the message to the NestJS backend
   - NestJS backend forwards the message to the AI Chat Core
   - AI Chat Core processes the message with OpenAI
   - Response flows back through the same path

3. **Google API Integration**:
   - User authorizes access to Google services
   - NestJS backend exchanges the authorization code for tokens
   - Backend uses tokens to interact with Google APIs
   - Results are returned to the frontend

4. **Project Management Flow**:
   - User creates/updates projects and tasks via the frontend
   - Frontend sends requests to the NestJS backend
   - Backend performs CRUD operations on the database
   - Changes are reflected back to the frontend

5. **Whiteboard/Notes Flow**:
   - User creates or edits notes in the whiteboard interface
   - Changes are sent to the backend in real-time
   - Backend stores updates in the database
   - Other users can see changes if shared

6. **Team Settings Flow**:
   - Team administrators configure AI settings
   - Settings are stored in the database
   - AI Chat Core retrieves team settings when processing requests
   - AI behavior is customized based on team preferences

## 5. Deployment Architecture

- **Frontend**: Deployed on Vercel
- **Backend API**: Deployed on cloud environment (AWS ECS)
- **AI Chat Core**: Deployed on cloud environment (Google Cloud Run)
- **Database**: Hosted on Supabase

## 6. Security Considerations

- JWT-based authentication
- Row Level Security in Supabase
- Secure environment variable management
- HTTPS for all communications
- OAuth 2.0 for Google API access

## 7. Future Architecture Evolution

With the completion of Phase 1, the architecture now includes project management, enhanced Google Workspace integration, and additional core features. As we move into Phase 2 (Advanced AI Productivity Suite), the architecture will further evolve to include:

- Additional microservices for specialized AI features
- More complex integrations with external services
- Enhanced data processing pipelines
- Real-time collaboration features
- AI-driven automation for project management
- Advanced calendar and task management systems