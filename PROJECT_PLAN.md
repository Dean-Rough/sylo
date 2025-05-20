# Project Roadmap: Design Studio Productivity App

## 1. Project Goal

To build a "Design Studio Productivity App" evolving into a comprehensive AI-powered suite that automates and intelligently assists with project management, scheduling, task execution, meetings, and workflows, leveraging Vercel and Supabase for core infrastructure, and designed for a sophisticated, multi-model OpenAI-powered chat experience with persistent memory and a user-managed prompt repository.

## 2. Development Roadmap

### Phase 0: Foundational MVP - Core Architecture & AI Interaction (May 2025)
*Current Phase - Partially Completed*

#### 2.1 Project Setup & DevOps
- [x] Initialize monorepo structure with Nx
- [ ] Set up CI/CD with GitHub Actions
  - [ ] Deploy Next.js frontend to Vercel
  - [ ] Deploy NestJS backend to cloud environment
  - [ ] Deploy AI Chat Core to cloud environment
- [ ] Configure secure environment variable management

#### 2.2 Supabase Setup
- [x] Initialize Supabase project
- [x] Set up database schema
  - [x] `users` & `profiles` tables
  - [x] `user_settings` table
  - [x] `chat_history` table
  - [x] `prompt_repository` table
  - [x] `teams` table (basic structure)
- [x] Configure Row Level Security (RLS)
- [x] Enable Google OAuth 2.0 authentication

#### 2.3 Backend Logic (NestJS)
- [x] Handle authenticated requests from frontend
- [x] Implement Supabase integration
- [x] Create CRUD operations for Prompt Repository
- [x] Build AI Chat Core orchestration
- [x] Develop API endpoints for prompt improvement
- [x] Implement auto-categorize prompt functionality
- [ ] Integrate with Google APIs (Calendar, etc.)
  - [ ] Set up OAuth token management
  - [ ] Create API endpoints for Google service interactions

#### 2.4 AI Chat Core (Python/FastAPI)
- [x] Set up FastAPI service structure
- [x] Implement OpenAI model integration (GPT-4o)
- [x] Create database-backed chat memory
- [x] Build user settings management
- [x] Develop prompt improvement functionality
- [x] Implement prompt categorization
- [ ] Add multi-model orchestration logic (Future enhancement)

#### 2.5 Frontend (Next.js)
- [ ] Create application shell and navigation
- [ ] Implement Google login/authentication flow
- [ ] Build AI chat interface
- [ ] Develop User Settings page
- [ ] Create Prompt Repository page
  - [ ] View, search, filter prompts
  - [ ] Create, edit, delete prompts
  - [ ] Prompt improvement interface
  - [ ] Category management

### Phase 1: Core Feature Modules & Key Integrations (Q3 2025)
*Planned - Not Started*

#### 3.1 Project Management
- [ ] Implement Asana-style project manager
  - [ ] Task creation and assignment
  - [ ] Deadline management
  - [ ] Project visualization
  - [ ] Task dependencies

#### 3.2 Google Workspace Integration
- [ ] Calendar integration (read/write)
- [ ] Basic Drive interaction
- [ ] Meeting scheduling

#### 3.3 Additional Core Features
- [ ] Whiteboard/Quick Notes functionality
- [ ] Team settings for AI configuration
- [ ] Dashboard with quick starts and key information
- [ ] Voice mode for AI chat interaction

### Phase 2: Advanced AI Productivity Suite (Q4 2025)
*Planned - Not Started*

#### 4.1 AI Project Manager
- [ ] Automated project progression
- [ ] Delay prediction and alerts
- [ ] Real-time visibility into project timelines
- [ ] Team workload management

#### 4.2 AI Calendar
- [ ] Intelligent task and meeting scheduling
- [ ] Multiple calendar integration (Gmail, iCloud)
- [ ] Automatic time-blocking for deep work
- [ ] Overcommitment detection and alerts

#### 4.3 AI Task Manager
- [ ] Auto-scheduling based on deadlines and priorities
- [ ] Real-time schedule adjustments
- [ ] Priority highlighting
- [ ] At-risk task flagging

#### 4.4 AI Meeting Notetaker
- [ ] Automatic recording and transcription
- [ ] Meeting summarization
- [ ] Action item extraction and task creation
- [ ] Transcript search and retrieval

#### 4.5 AI Workflows
- [ ] Idea-to-project transformation
- [ ] Automated task assignment
- [ ] Workflow gap detection
- [ ] Routine task automation

#### 4.6 AI Gantt Chart
- [ ] Real-time timeline updates
- [ ] Drag-and-drop timeline adjustments
- [ ] Task grouping and color-coding
- [ ] Multiple time view options

#### 4.7 AI Meeting Assistant
- [ ] Meeting preference customization
- [ ] Personalized booking pages
- [ ] Meeting templates
- [ ] Integrated reminders and links

### Phase 3: Advanced Integrations & Specialized Features (2026)
*Planned - Not Started*

#### 5.1 Extended Google Workspace Integration
- [ ] Full Google Docs CRUD operations
- [ ] Google Meet integration
- [ ] Contacts and Email integration
- [ ] Advanced Drive management

#### 5.2 Additional Integrations
- [ ] Xero integration
- [ ] Digital Asset Management (DAM)
- [ ] Adobe Creative Cloud integration
- [ ] CAD/Sketchup integration

#### 5.3 Specialized Features
- [ ] Client Portal
- [ ] AI-Assisted Proposal Generation
- [ ] Advanced FFE Database & Management
- [ ] Enhanced Moodboarding/Pinning platform
- [ ] Supplier database
- [ ] AI-Powered Image Tagging/Search

## 3. Current Progress (May 2025)

### Completed Components
1. **AI Chat Core (Python/FastAPI)**
   - Full implementation with OpenAI integration
   - Database-backed chat memory using Supabase
   - User settings management
   - Prompt improvement and categorization functionality
   - RESTful API with comprehensive documentation

2. **API Main (NestJS)**
   - Integration with the AI Chat Core service
   - Authentication with Supabase JWT
   - CRUD operations for the Prompt Repository
   - API endpoints for chat, user settings, and prompts

### In Progress
1. **Google API Integration**
   - Integration with Google Calendar and other Google services

2. **Frontend (Next.js)**
   - Implementation of the user interface
   - Authentication flow
   - Chat interface
   - Prompt Repository UI
   - User Settings UI

## 4. Conceptual Architecture Diagram (MVP)

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

*Note: This diagram represents the MVP architecture. As the advanced AI Productivity Suite features are developed, this diagram will likely be extended to include new services or more complex interactions between existing components.*

## 5. Future MCP Integrations

Potential MCP integrations to consider for future phases:

- [`anthropic-cookbook`](https://mcpmarket.com/server/anthropic-cookbook)
- [`cad-1`](https://mcpmarket.com/server/cad-1) & [`sketchup-1`](https://mcpmarket.com/server/sketchup-1)
- [`desktop-commander-1`](https://mcpmarket.com/server/desktop-commander-1)
- [`inbox-zero`](https://mcpmarket.com/server/inbox-zero)
- [`supermemory`](https://mcpmarket.com/server/supermemory)
- [`karakeep`](https://mcpmarket.com/server/karakeep)
- [`mastra`](https://mcpmarket.com/server/mastra)
- [`skyvern`](https://mcpmarket.com/server/skyvern)
- [`apple`](https://mcpmarket.com/server/apple)
- [`whatsapp-3`](https://mcpmarket.com/server/whatsapp-3)

## 6. UI/UX Philosophy

- The application will be built with a "slick, minimal, negative space, minimal instruction" design philosophy, using **Shadcn UI / Radix UI + Tailwind CSS**.
- The goal is a "fucking beautiful" UI that is intuitive for savvy users.