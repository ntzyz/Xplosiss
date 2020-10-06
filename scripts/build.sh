#!/bin/bash

set -e

# Clean up old directory
rm -rf .ts
mkdir -p .ts

# Make it with love xD
echo "Running 'tsc' ..."
tsc

# Copy other files (frontend codes, assets, blabla)
rsync -rqad --exclude "node_modules" \
            --exclude ".git" \
            --exclude ".ts" \
            --exclude "static" \
            --exclude "uploads" \
            --exclude "*.ts" \
            . .ts/

# Create some symlinks for directories like static files
ln -s $(pwd)/static .ts/static
ln -s $(pwd)/uploads .ts/uploads

# Step into the JS directory
cd .ts

echo "Running 'webpack' (1/2) ..."

# Build clinet bundle (for browser)
NODE_ENV=production webpack --config build/webpack.client.config.js --progress --hide-modules --display=errors-only

echo "Running 'webpack' (2/2) ..."

# Build server bundle (for server-side rendering)
NODE_ENV=production webpack --config build/webpack.server.config.js --progress --hide-modules --display=errors-only

# Done!
exit 0
