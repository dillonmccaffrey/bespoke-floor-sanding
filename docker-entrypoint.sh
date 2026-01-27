#!/bin/sh
set -e

# Sync initial content to data volume if empty
if [ -d "/app/src/content" ] && [ -d "/data/content" ]; then
  # Check if data/content is empty or missing collections
  for collection in testimonials gallery services settings; do
    if [ ! -d "/data/content/$collection" ] || [ -z "$(ls -A /data/content/$collection 2>/dev/null)" ]; then
      echo "Syncing initial $collection content..."
      mkdir -p "/data/content/$collection"
      if [ -d "/app/src/content/$collection" ]; then
        cp -r /app/src/content/$collection/* /data/content/$collection/ 2>/dev/null || true
      fi
    fi
  done
fi

# Sync initial images to data volume
if [ -d "/app/dist/client/images" ] && [ -d "/data/images" ]; then
  # Copy any missing images
  for img in /app/dist/client/images/*; do
    if [ -f "$img" ]; then
      filename=$(basename "$img")
      if [ ! -f "/data/images/$filename" ]; then
        echo "Copying image: $filename"
        cp "$img" "/data/images/" 2>/dev/null || true
      fi
    fi
  done
fi

echo "Starting server..."
exec node dist/server/entry.mjs
