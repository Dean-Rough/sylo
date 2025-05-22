#!/bin/bash

# Wrapper script to start the AI Chat Core service from any directory
# This script changes to the sylo-monorepo/apps/ai-chat-core directory and runs the go.sh script

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Change to the ai-chat-core directory
cd "$SCRIPT_DIR/sylo-monorepo/apps/ai-chat-core" || {
  echo "Error: Could not change to ai-chat-core directory"
  exit 1
}

# Run the go.sh script
./scripts/go.sh