# Design Studio Productivity App

Welcome to the Design Studio Productivity App monorepo! This project aims to create a comprehensive, AI-powered productivity suite for design studios. It's architected around an intelligent AI chat interface that orchestrates a wide array of features to automate tasks, enhance project management, streamline communication, and boost overall efficiency.

## Documentation

All project documentation is now located in the `/docs` directory:

- [Architecture](./docs/ARCHITECTURE.md) - System architecture and directory structure
- [Changelog](./docs/CHANGELOG.md) - Record of all notable changes
- [Development Guide](./docs/DEVELOPMENT.md) - Development setup and guidelines
- [Product Requirements](./docs/PRD.md) - Product Requirements Document
- [Roadmap](./docs/ROADMAP.md) - Project roadmap with progress tracking

## Overview

This application leverages a modern technology stack to deliver a seamless and powerful user experience:

- **Frontend:** Next.js (React) with TypeScript, styled using Shadcn UI / Radix UI + Tailwind CSS, hosted on Vercel.
- **Backend API:** A dedicated NestJS application (TypeScript) handles the primary backend logic, including interactions with Supabase, orchestration of the AI Chat Core, and other API functionalities.
- **Database & Authentication:** Supabase (PostgreSQL) provides the database, user authentication (Google OAuth), and storage capabilities.
- **AI Chat Core:** A separate Python FastAPI service handles advanced AI logic, OpenAI model interactions, and manages persistent chat memory and user AI preferences via Supabase.

## Project Status

The project has completed Phase 0 (Foundational MVP - Core Architecture & AI Interaction) and is now preparing for Phase 1 (Core Feature Modules & Key Integrations).

### Completed Components

1. **AI Chat Core (Python/FastAPI)**
   - Full implementation with OpenAI integration
   - Database-backed chat memory using Supabase
   - User settings management
   - Prompt improvement and categorization functionality

2. **API Main (NestJS)**
   - Integration with the AI Chat Core service
   - Authentication with Supabase JWT
   - CRUD operations for the Prompt Repository
   - API endpoints for chat, user settings, and prompts
   - Google API integration

3. **Frontend (Next.js)**
   - Implementation of the user interface
   - Authentication flow
   - Chat interface
   - Prompt Repository UI
   - User Settings UI

## Getting Started

For detailed setup instructions, please refer to the [Development Guide](./docs/DEVELOPMENT.md).