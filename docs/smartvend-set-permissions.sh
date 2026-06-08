#!/bin/bash
# Smart Vend NC Permission Setting Script
# Location: /var/www/shared/smartvend-set-permissions.sh
# Sets proper permissions for the Smart Vend NC static site

PROD_PATH="/var/www/smartvendnc"

# Set directories to 755 (rwxr-xr-x)
find "${PROD_PATH}" -type d -exec chmod 755 {} \;

# Set files to 644 (rw-r--r--)
find "${PROD_PATH}" -type f -exec chmod 644 {} \;

echo "Permissions set: directories=755, files=644"
