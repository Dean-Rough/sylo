# Design Studio Productivity App

Welcome to the Design Studio Productivity App monorepo! This project aims to create a comprehensive, AI-powered productivity suite for design studios. It's architected around an intelligent AI chat interface that orchestrates a wide array of features to automate tasks, enhance project management, streamline communication, and boost overall efficiency.

## Overview

This application leverages a modern technology stack to deliver a seamless and powerful user experience, evolving from a core AI chat and prompt management system into a full-fledged productivity platform:

*   **Frontend:** Next.js (React) with TypeScript, styled using Shadcn UI / Radix UI + Tailwind CSS, hosted on Vercel.
*   **Backend API:** A dedicated NestJS application (TypeScript) handles the primary backend logic, including interactions with Supabase, orchestration of the AI Chat Core, and other API functionalities.
*   **Database & Authentication:** Supabase (PostgreSQL) provides the database, user authentication (Google OAuth), and storage capabilities.
*   **AI Chat Core:** A separate Python FastAPI service handles advanced AI logic, OpenAI model interactions, and manages persistent chat memory and user AI preferences via Supabase.

## Key Documents

For detailed information about the project, please refer to the following documents:

*   **[PROJECT_PLAN.md](PROJECT_PLAN.md):** Outlines the overall project vision, MVP scope, phased rollout, and technology choices.
*   **[CODING_STANDARDS.md](CODING_STANDARDS.md):** Details the coding conventions, linting, formatting, and best practices to be followed.
*   **[DIRECTORY_STRUCTURE.md](DIRECTORY_STRUCTURE.md):** Describes the organization of this monorepo and the structure of individual applications and packages.

## Key AI-Powered Features

Sylo is being developed to offer a suite of intelligent tools to streamline your workflow:

*   **🧠 AI Project Manager:** Automates project progression, predicts delays, and provides real-time visibility.
*   **📅 AI Calendar:** Intelligently schedules your tasks, meetings, and to-dos into an optimized daily plan.
*   **✅ AI Task Manager:** Auto-schedules tasks based on deadlines and priorities, adjusting in real-time.
*   **📝 AI Meeting Notetaker:** Automatically records, transcribes, and summarizes meetings, converting action items into tasks.
*   **🔄 AI Workflows:** Transforms ideas into structured projects and automates routine task assignments and reminders.
*   **📊 AI Gantt Chart:** Maintains accurate, real-time project timelines with easy drag-and-drop adjustments.
*   **🤝 AI Meeting Assistant:** Simplifies meeting scheduling with personalized booking pages and templates.

## Monorepo Structure

This repository is a monorepo managed by [Nx](https://nx.dev/).

*   `apps/`: Contains the individual applications:
    *   `web/`: The Next.js frontend.
    *   `api-main/`: The NestJS backend application.
    *   `ai-chat-core/`: The Python FastAPI AI Chat Core service.
*   `packages/`: Contains shared code and configurations:
    *   `ui/`: Shared React UI components.
    *   `config/`: Shared ESLint, Prettier, TypeScript configurations.
    *   `types/`: Shared TypeScript types and interfaces.

## Getting Started

The initial directory structure has been established and key components have been implemented. Below are instructions for setting up the development environment, installing dependencies, and running the applications.

### Prerequisites

*   Node.js v20.19.x (recommended for Nx compatibility)
*   npm (preferred package manager)
*   Python 3.10+ (for AI Chat Core)
*   pip (for Python package management)
*   Docker (for running local instances of Supabase or other services if needed)
*   Access to Supabase project credentials.
*   OpenAI API key.
*   Google Cloud Platform project for OAuth credentials.

### Setup

1.  **Initial Directory Structure:** The foundational directory structure as defined in [`DIRECTORY_STRUCTURE.md`](DIRECTORY_STRUCTURE.md:20) has been created. This includes the main `apps/`, `packages/`, and `.github/WORKFLOWS/` directories, along with their initial subdirectories ([`apps/web/`](apps/web/), [`apps/api-main/`](apps/api-main/), [`apps/ai-chat-core/`](apps/ai-chat-core/), [`packages/ui/`](packages/ui/), etc.) and placeholder `.env.example` files in [`apps/web/.env.example`](apps/web/.env.example:0) and [`apps/ai-chat-core/.env.example`](apps/ai-chat-core/.env.example:0).
2.  Clone the repository (if you haven't already).
3.  Install root dependencies: `npm install` in the `sylo-monorepo` directory.
4.  Set up environment variables:
    *   Copy the `.env.example` files located in [`apps/web/`](apps/web/) and [`apps/ai-chat-core/`](apps/ai-chat-core/) to `.env` (or `.env.local` for Next.js within `apps/web/`).
    *   Fill in the required credentials and configuration values.
5.  *(Further setup instructions for each app/package and monorepo tooling will be added here.)*

## Development

### AI Chat Core (`apps/ai-chat-core/`)

To start the AI Chat Core service in development mode:

Navigate to the service directory and run the startup script:
```bash
cd apps/ai-chat-core
./scripts/go.sh
```
Alternatively, you can use the `start-dev.sh` script directly:
```bash
cd apps/ai-chat-core
./scripts/start-dev.sh
```
The service will be available at `http://0.0.0.0:4000`.

### API Main (`apps/api-main/`)

To build the API Main service:
```bash
cd sylo-monorepo
npx nx build api-main
```

To start the API Main service in development mode:
```bash
cd sylo-monorepo
npx nx serve api-main
```

The service will be available at `http://localhost:3000`.

*(Instructions for other applications, tests, linting, etc., will be added as they are developed.)*

## Implementation Status (May 2025)

The project is currently in Phase 0 of our development roadmap. For a detailed view of our progress and future plans, please refer to the [PROJECT_PLAN.md](PROJECT_PLAN.md) document, which contains our comprehensive roadmap with task tracking.

### Completed Components

1. **AI Chat Core (Python/FastAPI)**
   - Full implementation of the AI Chat Core service with OpenAI integration
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

### Next Steps

Our immediate focus is on completing the frontend implementation and Google API integration to deliver a fully functional MVP. After that, we'll move on to Phase 1 of our roadmap, which includes core feature modules and key integrations.

## Contributing

Please read [CODING_STANDARDS.md](CODING_STANDARDS.md) before contributing. All changes should be submitted via Pull Requests.

---

This README will be updated as the project develops further.