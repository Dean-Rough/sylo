#!/bin/bash

# Test script for Google Drive MCP server connection
echo "Testing Google Drive MCP server connection..."

# Check if the OAuth keys file exists
if [ ! -f "gcp-oauth.keys.json" ]; then
  echo "Error: gcp-oauth.keys.json not found!"
  echo "Please follow the setup instructions in README.md to create and download your OAuth keys."
  exit 1
fi

# Check if the credentials file exists
if [ ! -f ".gdrive-server-credentials.json" ]; then
  echo "Warning: .gdrive-server-credentials.json not found!"
  echo "You may need to authenticate first by running: npx @modelcontextprotocol/server-gdrive auth"
fi

# Try to start the server temporarily to test connection
echo "Starting Google Drive MCP server temporarily..."
echo "Press Ctrl+C after a few seconds to stop the server if it starts successfully."

# Run the server
npx -y @modelcontextprotocol/server-gdrive

# Note: The script will continue running until the server is stopped manually