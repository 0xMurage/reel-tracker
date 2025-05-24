#!/bin/sh

# Check for exactly two arguments
if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <target-stage> <image-tag>"
  exit 1
fi

TARGET_STAGE=$1
IMAGE_TAG=$2

# Resolve the directory of this script
SCRIPT_PATH="$0"
# If relative, convert to absolute
case "$SCRIPT_PATH" in
  /*) ;;
  *) SCRIPT_PATH="$(pwd)/$SCRIPT_PATH" ;;
esac

SCRIPT_DIR=$(dirname "$SCRIPT_PATH")
CONTEXT_DIR=$(dirname "$SCRIPT_DIR")

# Run docker build
docker build --target "$TARGET_STAGE" -t "$IMAGE_TAG" "$CONTEXT_DIR"
