"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebSocket = void 0;
const ws_1 = require("ws");
function setupWebSocket(server) {
    const wss = new ws_1.Server({ server });
    wss.on('connection', (ws) => {
        console.log('Client connected');
        ws.on('message', (message) => {
            console.log('Received:', message);
            try {
                const parsedMessage = JSON.parse(message.toString());
                // Broadcast message to all clients
                wss.clients.forEach((client) => {
                    if (client !== ws && client.readyState === ws.OPEN) {
                        client.send(JSON.stringify(parsedMessage));
                    }
                });
            }
            catch (error) {
                console.error('Error parsing message:', error);
            }
        });
        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });
}
exports.setupWebSocket = setupWebSocket;
