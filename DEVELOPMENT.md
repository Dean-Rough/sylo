# AI Chat Core - Development Guide

This document provides instructions for common development tasks related to the AI Chat Core service.

## Tech Stack

*   **Language/Framework:** Python with FastAPI
*   **Dependency Management:** (To be specified - e.g., pip with `requirements.txt`, Poetry, PDM)
*   **Development Server:** (To be specified - likely Uvicorn)

## Common Development Scripts

The following scripts are located in the `apps/ai-chat-core/scripts/` directory.

### 1. Install Dependencies

*   **Script:** [`./scripts/install-deps.sh`](./scripts/install-deps.sh)
*   **Purpose:** Installs the necessary Python packages and dependencies for the AI Chat Core.
*   **Note:** This is currently a placeholder script. You will need to edit it to include the actual commands based on the chosen dependency manager (e.g., `pip install -r requirements.txt` or `poetry install`).

    ```bash
    cd apps/ai-chat-core
    bash ./scripts/install-deps.sh
    ```

### 2. Start Development Server

*   **Script:** [`./scripts/start-dev.sh`](./scripts/start-dev.sh)
*   **Purpose:** Starts the FastAPI application in development mode, typically with auto-reloading.
*   **Note:** This is currently a placeholder script. You will need to edit it to include the actual command to run the development server (e.g., `uvicorn main:app --reload`).

    ```bash
    cd apps/ai-chat-core
    bash ./scripts/start-dev.sh
    ```

## Environment Variables

Ensure you have a `.env` file in the `apps/ai-chat-core/` directory, based on the [`apps/ai-chat-core/.env.example`](./.env.example) template. This file should contain necessary configurations such as API keys and database connection strings.

## Running Tests

(Instructions for running tests will be added here once a testing framework is set up.)

## Building for Production

(Instructions for building/packaging the application for production will be added here.)
### 3. Kill Port 4000 and Start Server (Go Script)

*   **Script:** [`./scripts/go.sh`](./scripts/go.sh)
*   **Purpose:** This script first attempts to kill any process running on port 4000. It then includes a placeholder to start the main application server.
*   **How to Run:**
    *   From the `apps/ai-chat-core` directory (or the project root if your `package.json` scripts are configured to be run from there):
        ```bash
        npm run go
        ```
    *   Directly from the `apps/ai-chat-core` directory:
        ```bash
        ./scripts/go.sh
        ```
*   **Note on Direct Execution:** To run the script directly using `./scripts/go.sh`, you might first need to make it executable. You can do this with the command:
    ```bash
    chmod +x apps/ai-chat-core/scripts/go.sh
    ```
*   **Important Reminder:** The command to start the server within [`go.sh`](./scripts/go.sh) is currently a placeholder. You will need to edit the script and replace `# your-server-start-command-here` with the actual command to start your application.