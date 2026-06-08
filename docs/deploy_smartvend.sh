#!/bin/bash
# Smart Vend NC Production Deployment Script
# Description: Deploys Smart Vend NC static website
# Usage: ./deploy_smartvend.sh --deploy-from-github
# Place this file in /var/www/shared folder
#
# Setup commands:
# 1. Create the script file:
#    sudo nano /var/www/shared/deploy_smartvend.sh
# 2. Paste this content and save
# 3. Make it executable:
#    sudo chmod +x /var/www/shared/deploy_smartvend.sh
# 4. Run the script (from GitHub Actions or manually):
#    sudo /var/www/shared/deploy_smartvend.sh --deploy-from-github

set -e  # Exit immediately if a command exits with a non-zero status

# Configuration
PROD_PATH="/var/www/smartvendnc"
DEPLOY_USER="smbds-deploy"
DEPLOY_GROUP="smbds-deploy"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DEPLOY_SOURCE="/tmp/smartvend-deploy"

usage() {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  --help                    - Show this help message"
    echo "  --deploy-from-github      - Deploy files uploaded from GitHub Actions"
    exit 1
}

deploy_from_github() {
    echo "Starting Smart Vend NC production deployment from GitHub Actions..."
    echo "Timestamp: ${TIMESTAMP}"

    # Check if source files exist
    if [ ! -d "${DEPLOY_SOURCE}" ] || [ -z "$(ls -A ${DEPLOY_SOURCE})" ]; then
        echo "ERROR: No files found in ${DEPLOY_SOURCE}"
        return 1
    fi

    # Ensure production directory exists
    echo "Ensuring production directory exists..."
    sudo /bin/mkdir -p "${PROD_PATH}"

    # Clear existing files
    echo "Clearing existing files..."
    sudo /bin/rm -rf "${PROD_PATH}"/*

    # Move new files
    echo "Moving new files to production..."
    sudo /bin/mv ${DEPLOY_SOURCE}/* "${PROD_PATH}/"

    # Set proper ownership
    echo "Setting ownership to ${DEPLOY_USER}:${DEPLOY_GROUP}..."
    sudo /bin/chown -R ${DEPLOY_USER}:${DEPLOY_GROUP} "${PROD_PATH}"

    # Set proper permissions (uses helper script for find commands)
    echo "Setting permissions..."
    sudo /var/www/shared/smartvend-set-permissions.sh

    echo ""
    echo "============================================"
    echo "Smart Vend NC deployment completed successfully!"
    echo "Site: https://smartvendnc.com"
    echo "Timestamp: ${TIMESTAMP}"
    echo "============================================"
    return 0
}

# Parse command line arguments
COMMAND=""
for arg in "$@"; do
    case $arg in
        --help)
            usage
            ;;
        --deploy-from-github)
            COMMAND="deploy_from_github"
            ;;
        *)
            echo "Unknown option: $arg"
            usage
            ;;
    esac
done

if [ -z "$COMMAND" ]; then
    usage
fi

case "$COMMAND" in
    deploy_from_github)
        deploy_from_github
        ;;
    *)
        usage
        ;;
esac

exit 0
