import { Server } from 'ws';

export function setupWebSocket(server: any) {
  const wss = new Server({ server });

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
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });
}
