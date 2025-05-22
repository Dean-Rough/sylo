# Google Drive MCP Server Demo

This demo walks through practical examples of using the Google Drive MCP server with an AI assistant.

## Prerequisites

Before starting this demo:
1. Complete the setup steps in the README.md file
2. Ensure you have authenticated the server
3. Verify the server is properly configured in cline_mcp_settings.json

## Demo Scenarios

### Scenario 1: Finding and Analyzing a Spreadsheet

**User Request:**
> "Can you find my budget spreadsheet in Google Drive and tell me what my total expenses are for Q1?"

**AI Assistant Actions:**

1. Search for budget-related files:
   ```
   <use_mcp_tool>
   <server_name>github.com/modelcontextprotocol/servers/tree/main/src/gdrive</server_name>
   <tool_name>search</tool_name>
   <arguments>
   {
     "query": "budget spreadsheet"
   }
   </arguments>
   </use_mcp_tool>
   ```

2. Access the spreadsheet content:
   ```
   <access_mcp_resource>
   <server_name>github.com/modelcontextprotocol/servers/tree/main/src/gdrive</server_name>
   <uri>gdrive:///FILE_ID_FROM_SEARCH</uri>
   </access_mcp_resource>
   ```

3. Analyze the CSV data to calculate total Q1 expenses
4. Present the findings to the user

### Scenario 2: Summarizing a Document

**User Request:**
> "Find my project proposal document and give me a summary of the key points."

**AI Assistant Actions:**

1. Search for the project proposal:
   ```
   <use_mcp_tool>
   <server_name>github.com/modelcontextprotocol/servers/tree/main/src/gdrive</server_name>
   <tool_name>search</tool_name>
   <arguments>
   {
     "query": "project proposal"
   }
   </arguments>
   </use_mcp_tool>
   ```

2. Access the document content:
   ```
   <access_mcp_resource>
   <server_name>github.com/modelcontextprotocol/servers/tree/main/src/gdrive</server_name>
   <uri>gdrive:///FILE_ID_FROM_SEARCH</uri>
   </access_mcp_resource>
   ```

3. Generate a concise summary of the key points
4. Present the summary to the user

### Scenario 3: Finding Recent Presentations

**User Request:**
> "What presentations have I created in the last month? Can you list them for me?"

**AI Assistant Actions:**

1. Search for recent presentations:
   ```
   <use_mcp_tool>
   <server_name>github.com/modelcontextprotocol/servers/tree/main/src/gdrive</server_name>
   <tool_name>search</tool_name>
   <arguments>
   {
     "query": "after:2025-04-21 type:presentation"
   }
   </arguments>
   </use_mcp_tool>
   ```

2. Format the results into a readable list
3. Present the list to the user

### Scenario 4: Extracting Data from Multiple Files

**User Request:**
> "I need to compile all the sales figures from my quarterly reports for 2024. Can you help me with that?"

**AI Assistant Actions:**

1. Search for quarterly reports:
   ```
   <use_mcp_tool>
   <server_name>github.com/modelcontextprotocol/servers/tree/main/src/gdrive</server_name>
   <tool_name>search</tool_name>
   <arguments>
   {
     "query": "2024 quarterly report sales"
   }
   </arguments>
   </use_mcp_tool>
   ```

2. For each report found, access its content:
   ```
   <access_mcp_resource>
   <server_name>github.com/modelcontextprotocol/servers/tree/main/src/gdrive</server_name>
   <uri>gdrive:///FILE_ID</uri>
   </access_mcp_resource>
   ```

3. Extract sales figures from each document
4. Compile the data into a comprehensive report
5. Present the compiled data to the user

## Advanced Search Queries

The Google Drive API supports advanced search queries. Here are some examples:

- `type:spreadsheet` - Find only spreadsheets
- `type:document` - Find only documents
- `type:presentation` - Find only presentations
- `after:2025-01-01` - Find files created after January 1, 2025
- `before:2025-04-01` - Find files created before April 1, 2025
- `owner:me` - Find files owned by you
- `starred` - Find starred files
- `trashed` - Find files in the trash

You can combine these operators for more specific searches:
- `type:spreadsheet after:2025-01-01 budget` - Find budget spreadsheets created after January 1, 2025

## Tips for Effective Use

1. **Be specific in search queries** - The more specific your search query, the more relevant the results will be.

2. **Handle different file types appropriately** - Remember that different Google Workspace files are exported in different formats:
   - Docs → Markdown
   - Sheets → CSV
   - Presentations → Plain text
   - Drawings → PNG

3. **Consider file size limits** - Very large files may take longer to process or may be truncated.

4. **Respect privacy and permissions** - The AI assistant can only access files that you have permission to access.

5. **Use file IDs when possible** - If you already know the file ID, accessing it directly is more efficient than searching.