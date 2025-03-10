// In your main server file (e.g., index.ts or server.ts)
import app from './app';
import 'module-alias/register';
import '@config/auth/passport';
import { connectDB } from '@config/database';
import { config } from '@config/env';
import http from 'http';
import { Server } from 'socket.io';
import WebSocketService from '@modules/messages/messages.websocket.service';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin:  '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

const webSocketService = new WebSocketService(io);
webSocketService.initialize();

server.listen(config.port, async () => {
  try {
    await connectDB();
    console.log(`Server running on http://localhost:${config.port}`);
    console.log(`Socket.IO server initialized`);
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
});
