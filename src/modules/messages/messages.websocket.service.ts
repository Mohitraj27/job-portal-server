import { Server, Socket } from 'socket.io';
import messagesService from './messages.service';

class WebSocketService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  initialize() {
    console.log('Initializing WebSocket Service...');

    this.io.on('connection', (socket: Socket) => {
      console.log(`✅ New client connected: ${socket.id}`);

      // Have users join their own user ID as a room
      socket.on('joinUser', (userId: string) => {
        if (!userId) {
          console.error('❌ joinUser error: Missing userId');
          return;
        }

        // Leave any previous rooms (optional)
        socket.rooms.forEach((room) => {
          if (room !== socket.id) {
            socket.leave(room);
          }
        });

        // Join a room with the user's ID
        socket.join(userId);
        console.log(`👤 User ${userId} joined their personal room`);

        // Confirm to the client
        socket.emit('joinedRoom', { userId, success: true });
      });

      // Handle sending messages
      socket.on('sendMessage', async (data) => {
        console.log(`📩 Received 'sendMessage' event from ${socket.id}:`, data);

        const { senderId, receiverId, content } = data;

        if (!senderId || !receiverId || !content) {
          console.error(
            '❌ sendMessage error: Missing senderId, receiverId, or content',
            data,
          );
          return;
        }

        try {
          console.log(
            `💾 Saving message from ${senderId} to ${receiverId}: "${content}"`,
          );
          const savedMessage = await messagesService.saveMessage(
            senderId,
            receiverId,
            content,
          );
          console.log('✅ Message saved successfully:', savedMessage);

          // Emit message to receiver and sender
          console.log(
            `📡 Emitting message to receiver ${receiverId} and sender ${senderId}`,
          );
          // Use the io instance to emit to specific rooms
          this.io.to(receiverId).emit('message', savedMessage);
          // Also send back to sender
          this.io.to(senderId).emit('message', savedMessage);
        } catch (error) {
          console.error('❌ Error saving message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Handle chat history retrieval
      socket.on('getChatHistory', async ({ senderId, receiverId }) => {
        console.log(
          `📜 Received 'getChatHistory' event for ${senderId} and ${receiverId}`,
        );

        if (!senderId || !receiverId) {
          console.error(
            '❌ getChatHistory error: Missing senderId or receiverId',
          );
          return;
        }

        try {
          console.log(
            `🔍 Fetching chat history between ${senderId} and ${receiverId}`,
          );
          const chatHistory = await messagesService.getChatHistory(
            senderId,
            receiverId,
          );
          console.log('✅ Chat history retrieved successfully');

          socket.emit('chatHistory', chatHistory);
        } catch (error) {
          console.error('❌ Error fetching chat history:', error);
          socket.emit('error', { message: 'Failed to fetch chat history' });
        }
      });

      // Handle client disconnect
      socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
      });

      // Log if any unexpected errors occur
      socket.on('error', (error) => {
        console.error(`🚨 Socket error from ${socket.id}:`, error);
      });
    });
  }
}

export default WebSocketService;
