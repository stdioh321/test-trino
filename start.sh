#!/bin/bash

set -e  # Stops the script if any command fails

echo "🔧 Starting services: MySQL, PostgreSQL, and Trino..."
docker-compose up -d
echo "✅ Services started successfully."

# Define function to stop containers upon receiving an interrupt signal
cleanup() {
  echo ""
  echo "🛑 Stopping Docker services..."
  docker-compose down
  echo "✅ Services stopped."
  exit 0
}

# Capture interrupt signals (Ctrl+C) or errors
trap cleanup INT TERM ERR

sleep 10  # Waits 10 seconds to ensure services start properly
# Start the Node application
echo "🚀 Starting Node.js application..."
echo "✅ Express server running at http://localhost:3000"
echo "📌 Use the following endpoints:"
echo "➡️  [GET] /generate - Generates leads and attendances"
echo "    Example: curl http://localhost:3000/generate"
echo "➡️  [GET] /result   - Returns combined data from PostgreSQL and MySQL via Trino"
echo "    Example: curl http://localhost:3000/result"

echo
{
  cd app
  npm install
  npm start
}
