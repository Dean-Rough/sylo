#!/bin/sh
# Script to kill processes on port 4000 and then start the server (placeholder)

PORT_TO_KILL=4000

echo "Attempting to kill any process on port $PORT_TO_KILL..."
# For macOS (as per system info). Use `|| true` to prevent script failure if no process is found.
lsof -ti:$PORT_TO_KILL | xargs kill -9 || true

echo "Processes on port $PORT_TO_KILL should now be terminated."
echo ""
echo "Starting the server (placeholder)..."
echo "TODO: Replace the line below with the actual command to start your server."
echo "Example: node server.js or python app.py"
# Placeholder for actual server start command:
# your-server-start-command-here