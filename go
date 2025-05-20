#!/usr/bin/env bash

# Attempt to find and kill any process currently using TCP port 4000
echo "Attempting to free port 4000..."
PID_ON_PORT_4000=$(lsof -ti :4000)

if [ -n "$PID_ON_PORT_4000" ]; then
  echo "Process(es) found on port 4000: $PID_ON_PORT_4000. Attempting to kill..."
  if lsof -ti :4000 | xargs kill -9; then
    echo "Successfully killed process(es) on port 4000."
    echo "Waiting for port to free up..."
    sleep 1
  else
    echo "Failed to kill process(es) on port 4000. Manual intervention may be required."
  fi
else
  echo "No process found on port 4000."
fi

echo "" # Newline for better readability

# Execute the existing script
echo "Starting the ai-chat-core server..."
sh ./apps/ai-chat-core/scripts/go.sh