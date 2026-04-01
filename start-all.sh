#!/bin/bash
# Starts both the backend API server and the Vite frontend
export PATH="/Users/parasgarg/.local/node/bin:$PATH"
cd /Users/parasgarg/Claude_code/birdeye-social-prototype

# Start backend API server in background
node --env-file=server/.env server/index.js &
SERVER_PID=$!

# Start Vite frontend
npx vite --port 5173 --host

# Cleanup: kill server when Vite exits
kill $SERVER_PID 2>/dev/null
