import { Server, Socket } from 'socket.io';
import messagesService from './messages.service';

class WebSocketService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  initialize() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`New client connected: ${socket.id}`);

      socket.on('sendMessage', async (data) => {
        const { senderId, receiverId, content } = data;
        console.log(`Received message from ${senderId} to ${receiverId}: ${content}`);

        const savedMessage = await messagesService.saveMessage(senderId, receiverId, content);

        socket.to(receiverId).emit('message', savedMessage); 
        socket.emit('message', savedMessage);
      });

      socket.on('getChatHistory', async ({ senderId, receiverId }) => {
        console.log(`Fetching chat history between ${senderId} and ${receiverId}`);

        const chatHistory = await messagesService.getChatHistory(senderId, receiverId);

        socket.emit('chatHistory', chatHistory);
      });

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }
}

export default WebSocketService;
