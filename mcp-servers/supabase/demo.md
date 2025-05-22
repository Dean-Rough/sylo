# Supabase MCP Server Demonstration

This document demonstrates how to use the Supabase MCP server with an AI assistant once you've set up your personal access token.

## Prerequisites

Before running this demonstration:

1. You must have created a Supabase personal access token at https://supabase.com/dashboard/account/tokens
2. You must have updated the `cline_mcp_settings.json` file with your token
3. You should have run the `test-connection.sh` script to verify your connection

## Example Interactions

Here are some example interactions you can have with an AI assistant using the Supabase MCP server:

### 1. List Your Supabase Projects

**You:** "List all my Supabase projects."

**AI Assistant:** *The assistant will use the MCP tool to list your projects:*

```
<use_mcp_tool>
<server_name>github.com/supabase-community/supabase-mcp</server_name>
<tool_name>list_projects</tool_name>
<arguments>
{}
</arguments>
</use_mcp_tool>
```

**Result:** The assistant will display a list of all your Supabase projects, including their names, IDs, and status.

### 2. Get Information About a Specific Project

**You:** "Tell me about my project called 'my-app'."

**AI Assistant:** *The assistant will use the MCP tool to get details about your project:*

```
<use_mcp_tool>
<server_name>github.com/supabase-community/supabase-mcp</server_name>
<tool_name>get_project</tool_name>
<arguments>
{
  "project_ref": "your-project-ref"
}
</arguments>
</use_mcp_tool>
```

**Result:** The assistant will display detailed information about your project.

### 3. List Database Tables

**You:** "Show me the tables in my 'my-app' database."

**AI Assistant:** *The assistant will use the MCP tool to list tables:*

```
<use_mcp_tool>
<server_name>github.com/supabase-community/supabase-mcp</server_name>
<tool_name>list_tables</tool_name>
<arguments>
{
  "project_ref": "your-project-ref",
  "schemas": ["public"]
}
</arguments>
</use_mcp_tool>
```

**Result:** The assistant will display a list of tables in your database.

### 4. Execute a SQL Query

**You:** "Count the number of users in my database."

**AI Assistant:** *The assistant will use the MCP tool to execute SQL:*

```
<use_mcp_tool>
<server_name>github.com/supabase-community/supabase-mcp</server_name>
<tool_name>execute_sql</tool_name>
<arguments>
{
  "project_ref": "your-project-ref",
  "sql": "SELECT COUNT(*) FROM auth.users;"
}
</arguments>
</use_mcp_tool>
```

**Result:** The assistant will display the count of users in your database.

### 5. Generate TypeScript Types

**You:** "Generate TypeScript types for my database schema."

**AI Assistant:** *The assistant will use the MCP tool to generate types:*

```
<use_mcp_tool>
<server_name>github.com/supabase-community/supabase-mcp</server_name>
<tool_name>generate_typescript_types</tool_name>
<arguments>
{
  "project_ref": "your-project-ref"
}
</arguments>
</use_mcp_tool>
```

**Result:** The assistant will generate and display TypeScript types based on your database schema.

## Next Steps

After setting up your Supabase MCP server with a valid personal access token, you can interact with your Supabase projects through AI assistants that support the Model Context Protocol.

Remember to keep your personal access token secure and consider using project-scoped or read-only mode for additional security.