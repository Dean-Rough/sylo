#!/bin/bash

# Script to start the Supabase MCP server manually
echo "Starting Supabase MCP server..."

# Path to the settings file
SETTINGS_FILE="/Users/deannewton/Documents/Sylo/cline_mcp_settings.json"

# Check if the settings file exists
if [ ! -f "$SETTINGS_FILE" ]; then
  echo "Error: cline_mcp_settings.json file not found at $SETTINGS_FILE"
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
echo "Using Supabase access token: ${ACCESS_TOKEN:0:5}...${ACCESS_TOKEN: -5}"

# Start the server
echo "Starting the Supabase MCP server..."
echo "Press Ctrl+C to stop the server when you're done."
echo ""

# Run the server
npx -y @supabase/mcp-server-supabase@latest --access-token="$ACCESS_TOKEN"