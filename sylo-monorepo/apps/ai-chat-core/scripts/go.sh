#!/bin/bash
# Script to kill any process on port 4000 and then start the AI Chat Core service

# Navigate to the script's directory to ensure relative paths are correct
cd "$(dirname "$0")"

PORT_TO_KILL=4000

echo "Attempting to kill any process running on port ${PORT_TO_KILL}..."

# Try to find and kill the process. lsof is common on macOS/Linux.
# The command might differ or fail on other OSes (e.g., Windows).
PID=$(lsof -t -i:${PORT_TO_KILL})

if [ -n "$PID" ]; then
  echo "Process found on port ${PORT_TO_KILL} with PID: ${PID}. Killing it..."
  kill -9 "$PID"
  # Wait a moment for the port to be released
  sleep 2
  echo "Process killed."
else
  echo "No process found running on port ${PORT_TO_KILL}."
fi

echo "Starting the development server..."
./start-dev.sh

echo "Go script finished."