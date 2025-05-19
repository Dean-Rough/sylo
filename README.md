# Design Studio Productivity App

Welcome to the Design Studio Productivity App monorepo! This project aims to create a comprehensive productivity tool for design studios, centered around an intelligent AI chat interface.

## Overview

This application leverages a modern technology stack to deliver a seamless and powerful user experience:

*   **Frontend:** Next.js (React) with TypeScript, styled using Shadcn UI / Radix UI + Tailwind CSS, hosted on Vercel.
*   **Backend (BFF & API):** Next.js API Routes handle user-facing backend logic and orchestrate calls to specialized services.
*   **Database & Authentication:** Supabase (PostgreSQL) provides the database, user authentication (Google OAuth), and storage capabilities.
*   **AI Chat Core:** A separate Python FastAPI service handles advanced AI logic, OpenAI model interactions, and manages persistent chat memory and user AI preferences via Supabase.

## Key Documents

For detailed information about the project, please refer to the following documents:

*   **[PROJECT_PLAN.md](PROJECT_PLAN.md):** Outlines the overall project vision, MVP scope, phased rollout, and technology choices.
*   **[CODING_STANDARDS.md](CODING_STANDARDS.md):** Details the coding conventions, linting, formatting, and best practices to be followed.
*   **[DIRECTORY_STRUCTURE.md](DIRECTORY_STRUCTURE.md):** Describes the organization of this monorepo and the structure of individual applications and packages.

## Monorepo Structure

This repository is a monorepo managed by [Nx/Turborepo - *Specify Chosen Tool Here*].

*   `apps/`: Contains the individual applications:
    *   `web/`: The Next.js frontend and API routes.
    *   `ai-chat-core/`: The Python FastAPI AI Chat Core service.
*   `packages/`: Contains shared code and configurations:
    *   `ui/`: Shared React UI components.
    *   `config/`: Shared ESLint, Prettier, TypeScript configurations.
    *   `types/`: Shared TypeScript types and interfaces.

## Getting Started

The initial directory structure has been established. Detailed instructions for setting up the development environment, installing dependencies using the chosen monorepo tool, and running the applications will be added as these components are further developed.

### Prerequisites

*   Node.js (specify version)
*   npm/yarn/pnpm (specify preferred package manager)
*   Python (specify version for AI Chat Core)
*   Poetry (or pip for Python package management)
*   Docker (for running local instances of Supabase or other services if needed)
*   Access to Supabase project credentials.
*   OpenAI API key.
*   Google Cloud Platform project for OAuth credentials.

### Setup

1.  **Initial Directory Structure:** The foundational directory structure as defined in [`DIRECTORY_STRUCTURE.md`](DIRECTORY_STRUCTURE.md:20) has been created. This includes the main `apps/`, `packages/`, and `.github/WORKFLOWS/` directories, along with their initial subdirectories ([`apps/web/`](apps/web/), [`apps/ai-chat-core/`](apps/ai-chat-core/), [`packages/ui/`](packages/ui/), etc.) and placeholder `.env.example` files in [`apps/web/.env.example`](apps/web/.env.example:0) and [`apps/ai-chat-core/.env.example`](apps/ai-chat-core/.env.example:0).
2.  Clone the repository (if you haven't already).
3.  Install root dependencies: `[npm/yarn/pnpm] install` (Note: Monorepo tooling like Nx or Turborepo setup is pending).
4.  Set up environment variables:
    *   Copy the `.env.example` files located in [`apps/web/`](apps/web/) and [`apps/ai-chat-core/`](apps/ai-chat-core/) to `.env` (or `.env.local` for Next.js within `apps/web/`).
    *   Fill in the required credentials and configuration values.
5.  *(Further setup instructions for each app/package and monorepo tooling will be added here.)*

## Development

*(Commands for running each application in development mode, running tests, linting, etc.)*

## Contributing

Please read [CODING_STANDARDS.md](CODING_STANDARDS.md) before contributing. All changes should be submitted via Pull Requests.

---

This README will be expanded as the project develops.