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