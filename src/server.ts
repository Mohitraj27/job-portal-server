import app from './app';
import 'module-alias/register';
import '@config/auth/passport';
import { connectDB } from '@config/database';
import { config } from '@config/env';
import { Server } from 'socket.io';
import http from 'http';
import WebSocketService from '@modules/messages/messages.websocket.service';


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    // methods: ['GET', 'POST'],
  },
  path: '/socket/messages',
});

const webSocketService = new WebSocketService(io);
webSocketService.initialize();

server.listen(config.port, async () => {
  try {
    await connectDB();
    console.log(`Server running on http://localhost:${config.port}`);
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
});
