# Project Plan: Design Studio Productivity App

## 1. Project Goal

To build a "Design Studio Productivity App" with a central AI chat orchestrating internal data management and external service integrations, leveraging Vercel and Supabase for core infrastructure, and designed for a sophisticated, multi-model OpenAI-powered chat experience with persistent memory and a user-managed prompt repository.

## 2. Phase 0: Foundational MVP - Core Architecture, User-Centric AI Interaction & Prompt Management

### 2.1. Primary Objective

Establish a stable, scalable architecture using Vercel for the frontend, a dedicated NestJS application for the backend, and Supabase for the database and authentication. Demonstrate secure user authentication via Google (managed by Supabase Auth). Implement an AI Chat Core (Python/FastAPI) capable of basic OpenAI interaction, managing chat history in Supabase, and interacting with user-specific settings. Implement a Prompt Repository for users to save, manage, and get AI assistance to refine prompts. Demonstrate an authenticated call to a Google service via the NestJS backend.

### 2.2. Technology Stack & Services

*   **Frontend:** React with Next.js (TypeScript) hosted on **Vercel**. UI built with **Shadcn UI / Radix UI + Tailwind CSS**. The Next.js application will be primarily responsible for the user interface and client-side logic, making requests to the NestJS backend.
*   **Backend:** Dedicated **NestJS application (TypeScript)**. This will handle primary backend logic, authenticated requests, interaction with Supabase, orchestration of the AI Chat Core, and Google API interactions. It will be deployed to a suitable cloud environment (e.g., Vercel serverless functions, Google Cloud Run, AWS Lambda).
*   **Database, Authentication & Storage:** **Supabase** (PostgreSQL database, Supabase Auth for Google OAuth, Supabase Storage for future file uploads).
*   **AI Chat Core:** Python with FastAPI (hosted as a separate service, e.g., Google Cloud Run, AWS Fargate, DigitalOcean App Platform).
*   **Key Libraries/Tools:** Docker (for local AI Core development).

### 2.3. Key Components & Tasks

#### 2.3.1. Project Setup & DevOps
- [ ] Monorepo (e.g., Nx or Turborepo).
- [ ] CI/CD: GitHub Actions deploying Next.js frontend to Vercel, NestJS backend to its environment, and AI Chat Core to its hosting.
- [ ] Secure environment variable management (Vercel, Supabase, NestJS backend, AI Core hosting).

#### 2.3.2. Supabase Setup
- [ ] Initialize Supabase project.
*   **Database Schema in Supabase:**
    - [ ] `users` (via Supabase Auth) & related `profiles` table for app-specific public user data.
    - [ ] `user_settings` (user-specific app settings, AI preferences). Linked to `users`.
    - [ ] `chat_history` (conversation turns, model used, timestamp, user_id, session_id/thread_id).
    - [ ] `prompt_repository` (`prompt_id`, `user_id`, `title`, `prompt_text`, `description`, `category`, `created_at`, `updated_at`).
    - [ ] `teams` (Basic structure for future use).
    - [ ] All tables with appropriate Row Level Security (RLS) enforced.
- [ ] Enable and configure **Supabase Auth for Google OAuth 2.0**.

#### 2.3.3. Backend Logic (Dedicated NestJS Application)
- [ ] Handle authenticated requests from the Next.js frontend (using Supabase Auth session/JWT, validated by NestJS).
- [ ] Interact with Supabase (e.g., using TypeORM, Prisma, or `supabase-js` within NestJS) for database operations, including **CRUD for `prompt_repository`**.
- [ ] Securely orchestrate calls to the AI Chat Core, passing authenticated user context.
- [ ] Handle direct interactions with Google APIs (e.g., Google Calendar) using user's Google OAuth tokens, managed and proxied by NestJS.
- [ ] API endpoint for "improve prompt" functionality (calls AI Chat Core/OpenAI).
- [ ] (Optional MVP) API endpoint for "auto-categorize prompt".

#### 2.3.4. AI Chat Core (Python/FastAPI - Separate Service)
- The basic FastAPI service structure for `ai-chat-core` has been established, and the service is now runnable. Further MVP features (OpenAI integration, chat memory, etc.) are pending.
*   **Core Design Principles:**
    - [ ] OpenAI Model Integration: Designed to use various OpenAI models (text, image generation).
    - [ ] Multi-model Orchestration Logic: (Future enhancement) Logic to select the best model for a given query.
    *   Database-backed Chat Memory:
        - [ ] Persists conversation history to the `chat_history` table in Supabase.
        - [ ] Retrieves relevant context from `chat_history` to inform OpenAI model responses.
    - [ ] Natural Interaction: Emphasize flexible prompt engineering and OpenAI's function/tool calling.
*   **MVP Implementation:**
    - [ ] Integrate with one primary OpenAI chat model.
    - [ ] Basic chat memory: store and retrieve the last N conversation turns from/to Supabase's `chat_history` table for the current user.
    - [ ] Function calling to retrieve/update the logged-in user's `user_settings` from Supabase.
    - [ ] Receive context/data from the **NestJS application** (e.g., Google Calendar events) to incorporate into responses.
    - [ ] Provide an endpoint/function that the **NestJS application** can call to "improve a given prompt" using OpenAI.
    - [ ] (Optional MVP) Provide an endpoint/function for "suggesting categories for a prompt".
*   **Integration:**
    - [ ] Receives requests from the **NestJS application** (including authenticated user ID).
    - [ ] Interacts directly with Supabase (`supabase-py`) for `chat_history` and `user_settings`.
    - [ ] Interacts directly with OpenAI APIs.

#### 2.3.5. Frontend (React/Next.js on Vercel with Shadcn UI / Radix UI + Tailwind CSS)
- [ ] Basic application shell and navigation.
- [ ] Google login/authentication flow using Supabase Auth (client-side) and session validation with the NestJS backend.
- [ ] A central AI chat interface that communicates with the **NestJS application** (which then calls the AI Chat Core).
- [ ] A simple "User Settings" page (data via the **NestJS application** from Supabase).
- [ ] A "Prompt Repository" page: View, search, filter, create, edit, delete prompts. Interface to "improve prompt". Display auto-suggested categories (if implemented). (All interactions via the **NestJS application**).

### 2.4. MVP Outcome
- [ ] Users can log in with their Google account via Supabase Auth, with sessions managed and validated by the NestJS backend.
- [ ] The AI chat has basic memory (recalling recent turns of conversation for the user from Supabase, via NestJS and AI Chat Core).
- [ ] The AI chat can read/update the user's settings in Supabase (via NestJS and AI Chat Core).
- [ ] The AI chat can present information from a Google service (e.g., calendar events fetched by the **NestJS application**).
- [ ] Users can save, manage, and get AI assistance to improve prompts in a dedicated Prompt Repository (interactions via the NestJS backend).
- [ ] The core architecture (Next.js/Vercel for frontend, dedicated NestJS application for backend, Supabase for DB/Auth, separate Python AI Core with OpenAI integration and DB-backed memory) is validated and ready for iterative feature development. The Next.js frontend will be hosted on Vercel. The NestJS backend will be deployed to a suitable cloud environment (e.g., Vercel, Google Cloud Run, AWS Lambda).

## 3. Conceptual Architecture Diagram (MVP)

```mermaid
graph TD
    subgraph UserInteraction
        User([User])
    end

    subgraph Frontend_Vercel [Frontend (Next.js on Vercel)]
        F_AuthPage[Login Page]
        F_ChatUI[AI Chat UI]
        F_UserSettingsPage[User Settings Page]
        F_PromptRepoPage[Prompt Repository Page]
        F_AppShell[App Shell/Nav]
    end

    subgraph Backend_NestJS [Backend (NestJS Application)]
        B_ApiEndpoints[API Endpoints]
        B_AuthHandler[Auth Handler]
        B_SupabaseClient[Supabase Interaction Logic]
        B_AIC_Orchestrator[AI Chat Core Orchestrator]
        B_GoogleAPI_Handler[Google API Interaction Logic]
    end

    subgraph Supabase_PaaS [Supabase (DB, Auth, Storage)]
        S_Auth[Supabase Auth - Google OAuth]
        S_DB[(PostgreSQL Database: users, profiles, user_settings, chat_history, prompt_repository, teams)]
        S_Storage[Supabase Storage (Future)]
    end

    subgraph AI_Chat_Core_Service [AI Chat Core (Python/FastAPI - Separate Service)]
        AIC_Engine[Conversational Engine]
        AIC_OpenAI_Integration[OpenAI Model Integration]
        AIC_Supabase_Comm[Communicator with Supabase DB]
        AIC_API_Endpoint[API for NestJS Backend]
    end

    subgraph ExternalServices
        Ext_GoogleAPIs[Google APIs (Calendar, etc.)]
        Ext_OpenAI_API[OpenAI API]
    end

    %% Connections
    User --> F_AppShell
    F_AppShell --> F_AuthPage
    F_AppShell --> F_ChatUI
    F_AppShell --> F_UserSettingsPage
    F_AppShell --> F_PromptRepoPage

    F_AuthPage --> S_Auth %% Initial Auth with Supabase
    F_AuthPage --> B_AuthHandler %% Token validation with NestJS

    F_ChatUI --> B_ApiEndpoints
    F_UserSettingsPage --> B_ApiEndpoints
    F_PromptRepoPage --> B_ApiEndpoints

    B_AuthHandler --> S_Auth %% NestJS validates token with Supabase

    B_SupabaseClient --> S_DB
    B_ApiEndpoints --> B_SupabaseClient
    B_ApiEndpoints --> B_AIC_Orchestrator
    B_ApiEndpoints --> B_GoogleAPI_Handler

    B_AIC_Orchestrator --> AIC_API_Endpoint
    B_GoogleAPI_Handler --> Ext_GoogleAPIs %% Via User's Google Token, proxied by NestJS

    AIC_API_Endpoint --> AIC_Engine
    AIC_Engine --> AIC_OpenAI_Integration
    AIC_Engine --> AIC_Supabase_Comm

    AIC_OpenAI_Integration --> Ext_OpenAI_API
    AIC_Supabase_Comm --> S_DB
```

## 4. Future Phases & Considerations

### 4.1. Phase 1: Core Feature Modules & Key Integrations
- [ ] Asana-style project manager (tasks, assignments, deadlines).
- [ ] Basic Google Workspace integration (e.g., Calendar read/write, basic Drive interaction) via NestJS backend.
- [ ] Whiteboard/Quick Notes page.
- [ ] Team settings for AI configuration.
- [ ] Enhanced UI/UX: Dashboard with quick starts, key info, mini-modules.
- [ ] Full voice mode for AI chat interaction.

### 4.2. Phase 2: Advanced Integrations & Specialized Features
- [ ] Full Google Workspace CRUD (Docs, Meets, Contacts, Email, Drive) via NestJS backend.
- [ ] Xero integration via NestJS backend.
- [ ] Client Portal.
- [ ] AI-Assisted Proposal Generation.
- [ ] Advanced FFE Database & Management.
- [ ] Digital Asset Management (DAM) Integration.
- [ ] Enhanced Moodboarding/Pinning platform (Milanote/Pinterest style).
- [ ] Supplier database.
- [ ] CAD/Sketchup MCP integration.
- [ ] Adobe Creative Cloud integration.
- [ ] AI-Powered Image Tagging/Search.

### 4.3. Future MCP Integrations (Examples from mcpmarket.com)
*   [`anthropic-cookbook`](https://mcpmarket.com/server/anthropic-cookbook)
*   [`cad-1`](https://mcpmarket.com/server/cad-1) & [`sketchup-1`](https://mcpmarket.com/server/sketchup-1)
*   [`desktop-commander-1`](https://mcpmarket.com/server/desktop-commander-1)
*   [`inbox-zero`](https://mcpmarket.com/server/inbox-zero)
*   [`supermemory`](https://mcpmarket.com/server/supermemory)
*   [`karakeep`](https://mcpmarket.com/server/karakeep)
*   [`mastra`](https://mcpmarket.com/server/mastra)
*   [`skyvern`](https://mcpmarket.com/server/skyvern)
*   [`apple`](https://mcpmarket.com/server/apple)
*   [`whatsapp-3`](https://mcpmarket.com/server/whatsapp-3)

### 4.4. UI/UX Philosophy
*   The application will be built with a "slick, minimal, negative space, minimal instruction" design philosophy, using **Shadcn UI / Radix UI + Tailwind CSS**.
*   The goal is a "fucking beautiful" UI that is intuitive for savvy users.