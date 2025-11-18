#!/bin/bash

# Auto-push script - monitors changes and pushes to GitHub
# Usage: ./auto-push.sh

echo "🚀 Auto-push script started..."
echo "Monitoring for changes every 30 seconds"
echo "Press Ctrl+C to stop"
echo ""

while true; do
    # Check if there are changes
    if [[ -n $(git status -s) ]]; then
        echo "📝 Changes detected at $(date '+%Y-%m-%d %H:%M:%S')"
        
        # Add all changes
        git add .
        
        # Commit with timestamp
        git commit -m "Auto-update: $(date '+%Y-%m-%d %H:%M:%S')"
        
        # Push to GitHub
        git push origin main
        
        echo "✅ Pushed successfully!"
        echo ""
    else
        echo "⏳ No changes detected at $(date '+%H:%M:%S')"
    fi
    
    # Wait 30 seconds before next check
    sleep 30
done