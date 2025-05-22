# Supabase MCP Server Setup

This directory contains configuration for the Supabase MCP server that allows AI assistants to interact with your Supabase projects.

## Setup Instructions

### 1. Create a Personal Access Token (PAT)

1. Go to your [Supabase settings](https://supabase.com/dashboard/account/tokens) and create a personal access token
2. Give it a descriptive name (e.g., "Sylo MCP Server")
3. Copy the token - you won't be able to see it again

### 2. Update the MCP Configuration

1. Open the `cline_mcp_settings.json` file in the root directory
2. Replace `YOUR_SUPABASE_ACCESS_TOKEN` with your actual personal access token

```json
"github.com/supabase-community/supabase-mcp": {
  "command": "npx",
  "args": [
    "-y",
    "@supabase/mcp-server-supabase@latest",
    "--access-token",
    "your-actual-token-here"
  ]
}
```

### 3. Optional Configuration

You can add these optional parameters to the args array:

- `--project-ref`: To scope the server to a specific project
- `--read-only`: To restrict the server to read-only queries

Example with optional parameters:

```json
"args": [
  "-y",
  "@supabase/mcp-server-supabase@latest",
  "--access-token",
  "your-actual-token-here",
  "--project-ref",
  "your-project-ref",
  "--read-only"
]
```

## Available Tools

Once configured, the Supabase MCP server provides the following tools:

### Project Management
- `list_projects`: Lists all Supabase projects for the user
- `get_project`: Gets details for a project
- `create_project`: Creates a new Supabase project
- `pause_project`: Pauses a project
- `restore_project`: Restores a project
- `list_organizations`: Lists all organizations that the user is a member of
- `get_organization`: Gets details for an organization

### Database Operations
- `list_tables`: Lists all tables within the specified schemas
- `list_extensions`: Lists all extensions in the database
- `list_migrations`: Lists all migrations in the database
- `apply_migration`: Applies a SQL migration to the database
- `execute_sql`: Executes raw SQL in the database
- `get_logs`: Gets logs for a Supabase project by service type

### Edge Function Management
- `list_edge_functions`: Lists all Edge Functions in a Supabase project
- `deploy_edge_function`: Deploys a new Edge Function to a Supabase project

### Project Configuration
- `get_project_url`: Gets the API URL for a project
- `get_anon_key`: Gets the anonymous API key for a project

### Development Tools
- `generate_typescript_types`: Generates TypeScript types based on the database schema

## Usage Example

After setting up the MCP server with your personal access token, you can use it with AI assistants that support the Model Context Protocol (MCP).