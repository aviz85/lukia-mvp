#!/usr/bin/env bash
# Exit on error
set -o errexit

# Upgrade pip
pip install --upgrade pip

# Install Python dependencies
pip install -r requirements.txt