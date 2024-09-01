#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install Python dependencies
pip install -r requirements.txt

# Navigate to the frontend directory
cd lukia-frontend

# Install npm dependencies
npm install

# Build the React app
npm run build

# Navigate back to the root directory
cd ..

# Create a static folder if it doesn't exist
mkdir -p static

# Move the build to the static folder
mv lukia-frontend/build/* static/