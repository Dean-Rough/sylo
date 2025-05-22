# Supabase MCP Server Installation Guide

This guide provides step-by-step instructions for setting up the Supabase MCP server to connect your Supabase projects with AI assistants.

## Prerequisites

- Node.js installed (v16 or later)
- A Supabase account
- Access to create personal access tokens in your Supabase account

## Installation Steps

### 1. Create a Personal Access Token (PAT)

1. Go to your [Supabase settings](https://supabase.com/dashboard/account/tokens)
2. Click "Generate New Token"
3. Give it a descriptive name (e.g., "Sylo MCP Server")
4. Copy the token - you won't be able to see it again

### 2. Update MCP Configuration

1. Open the `cline_mcp_settings.json` file in the root directory
2. Replace `YOUR_SUPABASE_ACCESS_TOKEN` with your actual personal access token:

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

### 3. Test the Connection

Run the test script to verify your connection:

```bash
cd mcp-servers/supabase
./test-connection.sh
```

If successful, you'll see a confirmation message.

### 4. Optional Configuration

You can add these optional parameters to the args array in `cline_mcp_settings.json`:

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

## Troubleshooting

If you encounter issues:

1. Verify your personal access token is correct
2. Check that Node.js is installed and in your PATH
3. Ensure you have an active internet connection
4. Verify your Supabase account is active

## Next Steps

After installation:

1. Review the `demo.md` file for example interactions
2. Try using the MCP server with an AI assistant
3. Explore the available tools in the `README.md` file

## Security Considerations

- Keep your personal access token secure
- Consider using project-scoped or read-only mode for additional security
- Regularly rotate your personal access tokens