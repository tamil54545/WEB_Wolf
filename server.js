// server.js
const WebSocket = require('ws');
const express = require('express');
const path = require('path');

const app = express();
const port = 8080;

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Start the HTTP server
const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });
const callCounts = {};

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        const mobileNumber = message.toString();

        // Increment call count
        if (!callCounts[mobileNumber]) {
            callCounts[mobileNumber] = 0;
        }
        callCounts[mobileNumber]++;

        // Send updated call counts to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(callCounts));
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
