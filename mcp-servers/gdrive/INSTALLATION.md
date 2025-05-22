# Google Drive MCP Server Installation Guide

This guide provides detailed step-by-step instructions for installing and configuring the Google Drive MCP server.

## Prerequisites

- macOS Sequoia operating system
- Node.js and npm installed
- Google account with access to Google Cloud Console
- Basic familiarity with terminal commands

## Installation Steps

### Step 1: Create Directory Structure

The directory structure has already been created at:
```
/Users/deannewton/Documents/Sylo/mcp-servers/gdrive/
```

### Step 2: Configure Google Cloud Project

1. **Create a new Google Cloud project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/projectcreate)
   - Click "New Project"
   - Enter a project name (e.g., "Sylo-GDrive-MCP")
   - Click "Create"
   - Wait for the project to be created

2. **Enable the Google Drive API**:
   - Go to [API Library](https://console.cloud.google.com/apis/library)
   - Search for "Google Drive API"
   - Click on "Google Drive API"
   - Click "Enable"
   - Wait for the API to be enabled

3. **Configure OAuth consent screen**:
   - Go to [OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent)
   - Select "Internal" if you're using a Google Workspace account, or "External" if using a personal Google account
   - Click "Create"
   - Fill in the required fields:
     - App name: "Sylo GDrive MCP"
     - User support email: Your email address
     - Developer contact information: Your email address
   - Click "Save and Continue"

4. **Add OAuth scopes**:
   - In the "Scopes" section, click "Add or Remove Scopes"
   - Add the scope: `https://www.googleapis.com/auth/drive.readonly`
   - Click "Save and Continue"
   - In the "Test users" section, click "Add Users"
   - Add your email address
   - Click "Save and Continue"
   - Click "Back to Dashboard"

5. **Create OAuth client ID**:
   - Go to [Credentials](https://console.cloud.google.com/apis/credentials)
   - Click "Create Credentials"
   - Select "OAuth client ID"
   - Application type: "Desktop app"
   - Name: "Sylo GDrive MCP Client"
   - Click "Create"
   - Click "Download JSON" to download the client secret file
   - Rename the downloaded file to `gcp-oauth.keys.json`

### Step 3: Configure the MCP Server

1. **Place OAuth keys file**:
   - Move the `gcp-oauth.keys.json` file to:
     ```
     /Users/deannewton/Documents/Sylo/mcp-servers/gdrive/gcp-oauth.keys.json
     ```

2. **Make the test script executable**:
   ```bash
   chmod +x /Users/deannewton/Documents/Sylo/mcp-servers/gdrive/test-connection.sh
   ```

### Step 4: Authenticate the Server

1. **Run the authentication command**:
   ```bash
   cd /Users/deannewton/Documents/Sylo/mcp-servers/gdrive
   npx @modelcontextprotocol/server-gdrive auth
   ```

2. **Complete the authentication flow**:
   - A browser window will open
   - Sign in with your Google account
   - Grant the requested permissions
   - The authentication process will complete and save credentials to:
     ```
     /Users/deannewton/Documents/Sylo/mcp-servers/gdrive/.gdrive-server-credentials.json
     ```

### Step 5: Verify the Installation

1. **Run the test script**:
   ```bash
   cd /Users/deannewton/Documents/Sylo/mcp-servers/gdrive
   ./test-connection.sh
   ```

2. **Check for successful connection**:
   - If the server starts without errors, the installation is successful
   - Press Ctrl+C to stop the server after confirming it works

## Troubleshooting

### Common Issues and Solutions

1. **OAuth keys file not found**:
   - Ensure you've downloaded the OAuth keys file from Google Cloud Console
   - Verify the file is named `gcp-oauth.keys.json` and placed in the correct directory

2. **Authentication fails**:
   - Verify you've added your email as a test user in the OAuth consent screen
   - Check that you've enabled the Google Drive API
   - Ensure you've added the correct OAuth scope

3. **Server fails to start**:
   - Check that Node.js and npm are installed correctly
   - Verify the credentials path in `cline_mcp_settings.json` is correct
   - Ensure you've completed the authentication process

4. **Permission errors**:
   - Ensure you have write permissions to the mcp-servers directory
   - Use `sudo` if necessary for permission-related commands

## Next Steps

After successful installation:

1. Review the [demo.md](demo.md) file for practical usage examples
2. Explore the [example-usage.js](example-usage.js) file for code examples
3. Try using the Google Drive MCP server with your AI assistant

## Additional Resources

- [Google Drive API Documentation](https://developers.google.com/drive/api/guides/about-sdk)
- [OAuth 2.0 for Desktop Apps](https://developers.google.com/identity/protocols/oauth2/native-app)
- [Model Context Protocol Documentation](https://github.com/modelcontextprotocol/mcp)