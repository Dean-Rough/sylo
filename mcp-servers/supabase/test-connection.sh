#!/bin/bash

# Test script for Supabase MCP server configuration
echo "Testing Supabase MCP server configuration..."

# Path to the settings file
SETTINGS_FILE="/Users/deannewton/Documents/Sylo/cline_mcp_settings.json"

# Check if the settings file exists
if [ ! -f "$SETTINGS_FILE" ]; then
  echo "Error: cline_mcp_settings.json file not found at $SETTINGS_FILE"
  exit 1
fi

# Check if access token is set in cline_mcp_settings.json
if grep -q "YOUR_SUPABASE_ACCESS_TOKEN" "$SETTINGS_FILE"; then
  echo "Error: You need to replace 'YOUR_SUPABASE_ACCESS_TOKEN' in cline_mcp_settings.json with your actual Supabase access token."
  echo "Please follow the instructions in README.md to create and set up your personal access token."
  exit 1
fi

# Extract the access token
ACCESS_TOKEN=$(grep -A 1 '"--access-token"' "$SETTINGS_FILE" | grep -v '"--access-token"' | grep -o '"[^"]*"' | sed 's/"//g')

# Check if we got a token
if [ -z "$ACCESS_TOKEN" ]; then
  echo "Error: Could not extract access token from $SETTINGS_FILE"
  echo "Please make sure the token is properly configured."
  exit 1
fi

# Display token info
echo "Found Supabase access token in configuration file."
echo "Token starts with: ${ACCESS_TOKEN:0:5}... and ends with ...${ACCESS_TOKEN: -5}"

echo "Supabase MCP server is configured correctly!"
echo "You can now use it with AI assistants that support the Model Context Protocol."

# Provide instructions for using the server
echo ""
echo "To use the Supabase MCP server with an AI assistant, ask it to:"
echo "1. List your Supabase projects"
echo "2. Execute SQL queries on your database"
echo "3. Generate TypeScript types from your schema"
echo "4. And more!"
echo ""
echo "See the demo.md file for example interactions."