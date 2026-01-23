#!/bin/bash
# Sync content and images from repo to data volumes
# Run this after deploying new changes

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "Syncing content from repo to data volumes..."

# Create directories if they don't exist
mkdir -p "$PROJECT_DIR/data/content/testimonials"
mkdir -p "$PROJECT_DIR/data/content/gallery"
mkdir -p "$PROJECT_DIR/data/content/services"
mkdir -p "$PROJECT_DIR/data/content/settings"
mkdir -p "$PROJECT_DIR/data/images"

# Sync content collections (don't overwrite existing CMS edits)
for collection in testimonials gallery services; do
  if [ -d "$PROJECT_DIR/src/content/$collection" ]; then
    for file in "$PROJECT_DIR/src/content/$collection"/*; do
      if [ -f "$file" ]; then
        filename=$(basename "$file")
        if [ ! -f "$PROJECT_DIR/data/content/$collection/$filename" ]; then
          echo "  Adding $collection/$filename"
          cp "$file" "$PROJECT_DIR/data/content/$collection/"
        fi
      fi
    done
  fi
done

# Sync images (don't overwrite existing)
if [ -d "$PROJECT_DIR/public/images" ]; then
  for img in "$PROJECT_DIR/public/images"/*; do
    if [ -f "$img" ]; then
      filename=$(basename "$img")
      if [ ! -f "$PROJECT_DIR/data/images/$filename" ]; then
        echo "  Adding image: $filename"
        cp "$img" "$PROJECT_DIR/data/images/"
      fi
    fi
  done
fi

echo "Sync complete!"
echo ""
echo "To force-update all content (overwriting CMS changes):"
echo "  cp -r src/content/* data/content/"
echo "  cp -r public/images/* data/images/"
