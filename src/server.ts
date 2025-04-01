import app from './app';
import 'module-alias/register';
import '@config/auth/passport';
import { connectDB } from '@config/database';
import { config } from '@config/env';
import http from 'http';
import { WebSocketServer } from 'ws';
import { socketService } from '@modules/messages/messages.websocket.service';

// Initialize the app
const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: '/ws' }); 


socketService(wss)




// Start the server
server.listen(config.port, async () => {
  try {
    await connectDB();
    console.log(`🚀 Server running on http://localhost:${config.port}`);
    console.log(
      `✅ WebSocket server running at ws://localhost:${config.port}/ws`,
    );
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
    process.exit(1);
  }
});
