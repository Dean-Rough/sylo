#!/bin/bash

# Wrapper script to start the Sylo UI from any directory
# This script changes to the sylo-monorepo directory and runs the start-ui.sh script

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Change to the sylo-monorepo directory
cd "$SCRIPT_DIR/sylo-monorepo" || {
  echo "Error: Could not change to sylo-monorepo directory"
  exit 1
}

# Run the start-ui.sh script
./start-ui.sh