# AI Chat Core - Development Guide

This document provides instructions for common development tasks related to the AI Chat Core service.

## Tech Stack

*   **Language/Framework:** Python with FastAPI
*   **Dependency Management:** (To be specified - e.g., pip with `requirements.txt`, Poetry, PDM)
*   **Development Server:** Uvicorn

## Common Development Scripts

The following scripts are located in the `apps/ai-chat-core/scripts/` directory.

### 1. Install Dependencies

*   **Script:** [`./scripts/install-deps.sh`](./scripts/install-deps.sh)
*   **Purpose:** Installs Python packages from `apps/ai-chat-core/requirements.txt` using `pip install -r ../requirements.txt`.
*   **Note:** Ensure you are in the `apps/ai-chat-core/scripts/` directory when running this script, or adjust the path to `requirements.txt` accordingly.

    ```bash
    ./scripts/install-deps.sh
    ```

### 2. Start Development Server

*   **Script:** [`./scripts/start-dev.sh`](./scripts/start-dev.sh)
*   **Purpose:** Starts the FastAPI application in development mode using `uvicorn app.main:app --reload --host 0.0.0.0 --port 4000`.
*   **Note:** This script should be run from the `apps/ai-chat-core/` directory.

    ```bash
    ./scripts/start-dev.sh
    ```

## Environment Variables

Ensure you have a `.env` file in the `apps/ai-chat-core/` directory, based on the [`apps/ai-chat-core/.env.example`](./.env.example) template. This file should contain necessary configurations such as API keys and database connection strings.

## Running Tests

(Instructions for running tests will be added here once a testing framework is set up.)

## Building for Production

#### `api-main` (NestJS Backend)

To build the `api-main` application for production, navigate to its directory and run the build script:

```bash
cd apps/api-main
npm run build
```

This will compile the TypeScript code and place the output in the `dist` folder within `apps/api-main`.

To run the production build:

```bash
npm run start:prod
```
### 3. Kill Port 4000 and Start Server (Go Script)

*   **Script:** [`./scripts/go.sh`](./scripts/go.sh)
*   **Purpose:** This script first attempts to kill any process running on port 4000 and then starts the main application server by calling `./scripts/start-dev.sh`.
*   **How to Run:**
    *   Directly from the `apps/ai-chat-core/scripts/` directory:
        ```bash
        ./scripts/go.sh
        ```
    *   Ensure the script is executable (`chmod +x ./scripts/go.sh`).
## Nx Monorepo Setup & Debugging Log (as of 2025-05-20)

This section details the investigation into issues with Nx target execution in the `sylo-monorepo/`.

**Primary Problems Addressed:**
1.  **`api-main` Build Failure:** `npx nx build api-main` failing with `"The "@nx/nest" package does not support Nx executors."`
2.  **`ai-chat-core` Target Issue:** `npx nx run ai-chat-core:install-deps` (lower priority for this debugging session).

**Debugging Steps & Findings for `api-main` Build Failure:**

*   **Initial State (2025-05-20):**
    *   `@nx/nest` was installed (v21.0.3).
    *   `npx nx build api-main` failed with the executor support error.

*   **Investigation & Actions:**
    1.  **Package Version Check ([`sylo-monorepo/package.json`](sylo-monorepo/package.json:1)):**
        *   `nx`: `21.0.3`
        *   `@nx/nest`: `^21.0.3`
        *   `@nx/js`: `21.0.3`
        *   `@nx/workspace`: `^21.0.3`
        *   `typescript`: `~5.7.2`
        *   Versions seemed consistent, and `@nx/nest` was a devDependency.
    2.  **Nx Configuration ([`sylo-monorepo/nx.json`](sylo-monorepo/nx.json:1)):**
        *   Initially, `@nx/nest/plugin` was not registered.
        *   Attempt 1: Added `{ "plugin": "@nx/nest/plugin" }`. Build failed: `Unable to resolve local plugin with import path @nx/nest/plugin`.
        *   Attempt 2: Changed plugin to `{ "plugin": "@nx/nest" }`. Build failed with the original executor support error.
        *   Attempt 3: Removed the `@nx/nest` plugin entry entirely, relying on auto-discovery. Build still failed with the original error.
        *   Current state (as of end of debugging session): `@nx/nest` plugin is registered as `{ "plugin": "@nx/nest" }` in [`sylo-monorepo/nx.json`](sylo-monorepo/nx.json:1).
    3.  **Project Configuration ([`sylo-monorepo/apps/api-main/project.json`](sylo-monorepo/apps/api-main/project.json:1)):**
        *   Executor confirmed as `@nx/nest:build`, which is standard. No issues found here.
    4.  **Node.js Version:**
        *   Identified an `EBADENGINE` warning during `npm install`: Current Node.js `v23.7.0` was not supported by `nx@21.0.3` (requires `^20.19.0 || ^22.12.0`).
        *   Action: Switched local environment to Node.js `v20.19.2` using `nvm`.
    5.  **Cache & Dependency Cleaning:**
        *   Cleared Nx cache: `npx nx reset`.
        *   Removed `node_modules` and `package-lock.json` from `sylo-monorepo/`.
        *   User ran `npm cache clean --force`.
        *   User re-ran `npm install` in `sylo-monorepo/` with Node.js `v20.19.2`.
        *   Despite these steps, the `api-main` build error persisted.
    6.  **Deep Dive into `@nx/nest` Installation:**
        *   Listed files in `sylo-monorepo/node_modules/@nx/nest/`: Noticed `generators.json` was present, but `executors.json` was missing.
        *   Read `sylo-monorepo/node_modules/@nx/nest/package.json`: Confirmed it was **missing the `"executors": "./executors.json"` field**.
        *   Compared with `sylo-monorepo/node_modules/@nx/js/package.json` (same version `21.0.3`), which *does* have the `executors` field and an `executors.json` file.
        *   **Current Leading Theory:** The installed `@nx/nest` package is incomplete or corrupted, specifically lacking the executor definitions. This is why Nx cannot find/use its executors.

**Status for `ai-chat-core` Target Issue:**
*   Briefly reviewed [`sylo-monorepo/apps/ai-chat-core/project.json`](sylo-monorepo/apps/ai-chat-core/project.json:1). The `install-deps` target using `nx:run-commands` with `cwd: "apps/ai-chat-core"` and command `sh ./scripts/install-deps.sh` appears correctly configured. This issue was not further pursued pending resolution of the `api-main` problem, as environment instability (like Node version or Nx core issues) could also affect this.

**Current Status (RESOLVED - 2025-05-20):**
*   The `api-main` build issue has been successfully resolved!
*   **Root Cause:** The `@nx/nest` package (versions 21.0.0 through 21.0.3) does not include an `executors.json` file or an `"executors"` field in its `package.json`, which explains why Nx couldn't find any executors in it.
*   **Solution Implemented:**
    1. We simplified the build configuration in `project.json` to use `nx:run-commands` with a direct call to NestJS's own build system (`npx nest build`).
    2. We changed the output path format to use `{projectRoot}/dist`, which correctly resolves to NestJS's default output location.
    3. This approach bypasses the complex Nx webpack configuration while still allowing Nx to track the outputs for caching purposes.

**Current Configuration:**
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

**Benefits of This Approach:**
1. **Simplicity:** The configuration is much simpler and easier to understand.
2. **Reliability:** We're using NestJS's native build system, which is well-tested for NestJS applications.
3. **Compatibility:** We avoid the issues with the `@nx/nest` package's missing executors.
4. **Maintainability:** The configuration is less likely to break with future updates to Nx or NestJS.

**Handover Notes:**
* The build now works correctly with `npx nx build api-main`
* The output is generated in `apps/api-main/dist` (NestJS's default location)
* The `serve` target is already configured correctly to use `nx:run-commands` with `npx nest start`
* If you encounter similar issues with other NestJS applications in the monorepo, consider applying the same approach

---

## AI Chat Core - NestJS Integration

The AI Chat Core service has been integrated with the NestJS backend to provide AI-powered features to the frontend. This section describes how to use this integration.

### Overview

The NestJS backend communicates with the AI Chat Core service via HTTP requests. The `AiChatCoreModule` in the NestJS backend provides a service and controller for this communication:

- `AiChatCoreService`: Makes HTTP requests to the AI Chat Core API
- `AiChatCoreController`: Exposes endpoints for the frontend to use

### Environment Configuration

To configure the NestJS backend to communicate with the AI Chat Core service, add the following to your `.env` file:

```
AI_CHAT_CORE_URL=http://localhost:4000
```

### Available Endpoints

The following endpoints are available in the NestJS backend for interacting with the AI Chat Core:

- `POST /ai-chat/completion`: Generate a chat completion
- `POST /ai-chat/sessions`: Create a new chat session
- `DELETE /ai-chat/sessions/:sessionId`: Delete a chat session
- `GET /ai-chat/settings`: Get user settings
- `PUT /ai-chat/settings`: Update user settings
- `POST /ai-chat/prompts/improve`: Improve a prompt
- `POST /ai-chat/prompts/categorize`: Suggest categories for a prompt

All endpoints require authentication using the JWT strategy.

## Development Roadmap and Process

The project follows a structured development roadmap outlined in [PROJECT_PLAN.md](PROJECT_PLAN.md). This roadmap is organized into phases with clear milestones and task tracking to help coordinate development efforts.

### Development Process

1. **Task Selection**: Select tasks from the current phase in the roadmap
2. **Implementation**: Follow the coding standards in [CODING_STANDARDS.md](CODING_STANDARDS.md)
3. **Testing**: Write appropriate tests for your implementation
4. **Code Review**: Submit a PR for review by at least one team member
5. **Deployment**: Once approved, changes will be deployed via CI/CD

### Tracking Progress

- Use the checkboxes in the roadmap to track completed tasks
- Update the "Current Progress" section in the roadmap when significant milestones are reached
- Keep the README.md "Implementation Status" section in sync with the roadmap

## Future Development for AI Productivity Suite

As the advanced AI Productivity Suite features (e.g., AI Calendar, AI Task Manager, AI Meeting Notetaker, etc., as detailed in the [PROJECT_PLAN.md](PROJECT_PLAN.md)) are developed, this document will be updated. Specific sections will be added to cover:

*   Setup instructions for any new services or components (e.g., transcription services, advanced scheduling engines)
*   Development workflows unique to these new features
*   Testing strategies and tools for AI-specific functionalities
*   Configuration details for new integrations or AI models
*   Performance optimization guidelines for AI-powered features

The aim is to keep this development guide comprehensive and up-to-date as the project expands its capabilities.