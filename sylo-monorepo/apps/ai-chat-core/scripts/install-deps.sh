#!/bin/bash
# Script to install Python dependencies for the AI Chat Core service

# Navigate to the script's directory to ensure relative paths are correct
cd "$(dirname "$0")"

echo "Installing Python dependencies from ../requirements.txt..."
pip install -r ../requirements.txt

echo "Dependencies installation complete."