# Google Drive MCP Server Setup Guide

This guide will help you set up the Google Drive MCP server to allow your AI assistant to interact with Google Drive files and folders.

## Prerequisites

- Google account with access to Google Cloud Console
- Node.js and npm installed

## Setup Steps

### 1. Google Cloud Project Setup

1. [Create a new Google Cloud project](https://console.cloud.google.com/projectcreate)
   - Give your project a name (e.g., "Sylo-GDrive-MCP")

2. [Enable the Google Drive API](https://console.cloud.google.com/workspace-api/products)
   - Search for "Google Drive API"
   - Click on it and press "Enable"

3. [Configure an OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent)
   - Choose "Internal" for testing purposes (or "External" if needed)
   - Fill in the required information:
     - App name (e.g., "Sylo GDrive MCP")
     - User support email
     - Developer contact information
   - Click "Save and Continue"

4. Add OAuth Scope
   - In the "Scopes" section, click "Add or Remove Scopes"
   - Add the scope: `https://www.googleapis.com/auth/drive.readonly`
   - Click "Save and Continue"
   - Complete the remaining steps in the consent screen setup

5. [Create an OAuth Client ID](https://console.cloud.google.com/apis/credentials/oauthclient)
   - Choose "Desktop App" as the application type
   - Give it a name (e.g., "Sylo GDrive MCP Client")
   - Click "Create"

6. Download OAuth Keys
   - After creating the client ID, download the JSON file
   - Rename the downloaded file to `gcp-oauth.keys.json`
   - Place the file in this directory (`mcp-servers/gdrive/`)

### 2. Server Authentication

Once you have the OAuth keys file in place, you need to authenticate the server:

1. Run the authentication command:

```bash
npx @modelcontextprotocol/server-gdrive auth
```

2. This will open an authentication flow in your system browser
3. Complete the authentication process by logging in with your Google account
4. Grant the requested permissions
5. The credentials will be saved as `.gdrive-server-credentials.json` in this directory

### 3. Verify Configuration

The MCP server is already configured in `cline_mcp_settings.json` with:

```json
"github.com/modelcontextprotocol/servers/tree/main/src/gdrive": {
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-gdrive"
  ],
  "env": {
    "GDRIVE_CREDENTIALS_PATH": "/Users/deannewton/Documents/Sylo/mcp-servers/gdrive/.gdrive-server-credentials.json"
  }
}
```

## Testing the Connection

After completing the setup, you can test the connection by:

1. Creating a test script:

```javascript
// test-gdrive.js
const { exec } = require('child_process');

exec('npx @modelcontextprotocol/server-gdrive', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`Server output: ${stdout}`);
});
```

2. Running the test script:

```bash
node test-gdrive.js
```

## Using the Google Drive MCP Server

Once set up, the AI assistant can use the server to:

1. **Search for files** using the `search` tool:
   - Input: `query` (string): Search query
   - Returns file names and MIME types of matching files

2. **Access file content** using the resource URI format:
   - URI format: `gdrive:///<file_id>`
   - Supports all file types
   - Google Workspace files are automatically exported:
     - Docs → Markdown
     - Sheets → CSV
     - Presentations → Plain text
     - Drawings → PNG
   - Other files are provided in their native format

## Troubleshooting

If you encounter issues:

1. Verify your OAuth credentials are valid
2. Check that the credentials path in `cline_mcp_settings.json` is correct
3. Ensure you have completed the authentication process
4. Check for any error messages during server startup

## Additional Resources

- [Model Context Protocol Documentation](https://github.com/modelcontextprotocol/mcp)
- [Google Drive API Documentation](https://developers.google.com/drive/api/guides/about-sdk)