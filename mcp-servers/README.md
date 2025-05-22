# MCP Servers Guide

This document provides an overview of popular Model Context Protocol (MCP) servers that you can connect to enhance your AI assistant capabilities.

## Currently Connected MCP Servers

1. **Google Drive MCP Server**
   - Server Name: `github.com/modelcontextprotocol/servers/tree/main/src/gdrive`
   - Package: `@modelcontextprotocol/server-gdrive`
   - Purpose: Allows AI assistants to interact with Google Drive files and folders
   - Status: ✅ Connected

2. **Supabase MCP Server**
   - Server Name: `github.com/supabase-community/supabase-mcp`
   - Package: `@supabase/mcp-server-supabase@latest`
   - Purpose: Allows AI assistants to interact with Supabase projects, databases, and edge functions
   - Status: ✅ Connected

## Recommended MCP Servers to Connect

Here are some popular MCP servers you might want to consider adding:

1. **GitHub MCP Server**
   - Server Name: `github.com/modelcontextprotocol/servers/tree/main/src/github`
   - Package: `@modelcontextprotocol/server-github`
   - Purpose: Allows AI assistants to interact with GitHub repositories, issues, and pull requests
   - Installation: 
     ```json
     "github.com/modelcontextprotocol/servers/tree/main/src/github": {
       "command": "npx",
       "args": [
         "-y",
         "@modelcontextprotocol/server-github"
       ],
       "env": {
         "GITHUB_TOKEN": "your-github-token"
       }
     }
     ```

2. **Jira MCP Server**
   - Server Name: `github.com/modelcontextprotocol/servers/tree/main/src/jira`
   - Package: `@modelcontextprotocol/server-jira`
   - Purpose: Allows AI assistants to interact with Jira projects, issues, and workflows
   - Installation:
     ```json
     "github.com/modelcontextprotocol/servers/tree/main/src/jira": {
       "command": "npx",
       "args": [
         "-y",
         "@modelcontextprotocol/server-jira"
       ],
       "env": {
         "JIRA_API_TOKEN": "your-jira-api-token",
         "JIRA_EMAIL": "your-jira-email",
         "JIRA_HOST": "your-jira-host"
       }
     }
     ```

3. **Slack MCP Server**
   - Server Name: `github.com/modelcontextprotocol/servers/tree/main/src/slack`
   - Package: `@modelcontextprotocol/server-slack`
   - Purpose: Allows AI assistants to interact with Slack channels, messages, and users
   - Installation:
     ```json
     "github.com/modelcontextprotocol/servers/tree/main/src/slack": {
       "command": "npx",
       "args": [
         "-y",
         "@modelcontextprotocol/server-slack"
       ],
       "env": {
         "SLACK_TOKEN": "your-slack-token"
       }
     }
     ```

4. **PostgREST MCP Server**
   - Server Name: `github.com/supabase/mcp-server-postgrest`
   - Package: `@supabase/mcp-server-postgrest`
   - Purpose: Allows AI assistants to connect to any PostgreSQL database via REST API
   - Installation:
     ```json
     "github.com/supabase/mcp-server-postgrest": {
       "command": "npx",
       "args": [
         "-y",
         "@supabase/mcp-server-postgrest"
       ],
       "env": {
         "POSTGREST_URL": "your-postgrest-url",
         "POSTGREST_API_KEY": "your-api-key"
       }
     }
     ```

5. **Notion MCP Server**
   - Server Name: `github.com/modelcontextprotocol/servers/tree/main/src/notion`
   - Package: `@modelcontextprotocol/server-notion`
   - Purpose: Allows AI assistants to interact with Notion pages, databases, and blocks
   - Installation:
     ```json
     "github.com/modelcontextprotocol/servers/tree/main/src/notion": {
       "command": "npx",
       "args": [
         "-y",
         "@modelcontextprotocol/server-notion"
       ],
       "env": {
         "NOTION_TOKEN": "your-notion-token"
       }
     }
     ```

## How to Add a New MCP Server

To add a new MCP server:

1. Create a directory for the server in the `mcp-servers` directory
2. Update the `cline_mcp_settings.json` file to include the server configuration
3. Create documentation for the server in the server's directory
4. Test the connection to ensure it's working properly

## Best Practices for MCP Servers

1. **Security**: Store sensitive tokens and credentials securely
2. **Documentation**: Keep documentation up-to-date with available tools and resources
3. **Testing**: Regularly test connections to ensure servers are working properly
4. **Updates**: Keep server packages updated to the latest versions
5. **Scoping**: Use scoped access when possible to limit permissions

## Troubleshooting

If you encounter issues with an MCP server:

1. Verify your access tokens are valid and have the necessary permissions
2. Check that the server package is installed correctly
3. Ensure you have an active internet connection
4. Look for error messages in the server logs
5. Consult the server's documentation for specific troubleshooting steps