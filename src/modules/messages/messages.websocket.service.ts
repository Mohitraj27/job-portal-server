import MessageModel from '@modules/messages/messages.model';
import User from '@modules/user/user.model';
import WebSocket, { Server as WebSocketServer } from 'ws';

interface JoinUserEvent {
  event: 'joinUser';
  userId: string;
}

interface SendMessageEvent {
  event: 'sendMessage';
  senderId: string;
  receiverId: string;
  content: string;
  joinedRoomId: string;
}

interface GetChatHistoryEvent {
  event: 'getChatHistory';
  senderId: string;
  receiverId: string;
  joinedRoomId: string;
}

type ClientMessage = JoinUserEvent | SendMessageEvent | GetChatHistoryEvent;

export const socketService = (wss: WebSocketServer) => {
  wss.on('connection', (ws: WebSocket) => {
    console.log('🔗 New WebSocket connection established');

    // When a message is received from the client
    ws.on('message', async (message: string) => {
      try {
        const data: ClientMessage = JSON.parse(message);

        // Handle user join event
        if (data.event === 'joinUser') {
          const { userId } = data;
          if (!userId) {
            console.error('❌ joinUser error: Missing userId');
            return;
          }
          console.log(`👤 User ${userId} joined`);
          ws.send(
            JSON.stringify({ event: 'joinedRoom', userId, success: true }),
          );
        }

        // Handle sendMessage event
        if (data.event === 'sendMessage') {
          const { senderId, receiverId, content, joinedRoomId } = data;
          if (!senderId || !receiverId || !content || !joinedRoomId) {
            console.error('❌ sendMessage error: Missing fields');
            return;
          }

          // Log the message in the server
          console.log(
            `📩 Received message from ${senderId} to ${receiverId}: "${content}"`,
          );

          // Save the message to MongoDB
          try {
            const newMessage = new MessageModel({
              senderId,
              receiverId,
              content,
              joinedRoomId,
            });
            await newMessage.save();
            console.log('✅ Message saved to MongoDB');
          } catch (error) {
            console.error('❌ Error saving message to MongoDB:', error);
          }

          // Send message to receiver if they are connected
          wss.clients.forEach(async (client: WebSocket) => {
            if (true) {
              const userId = (client as any)?.userId; // Store userId on WebSocket client instance
              console.log('this is type ',typeof userId);
              // if (true) {
                const senderDetails = await User.findOne({ _id: senderId }).select('role personalDetails.firstName personalDetails.lastName');
                const receiverDetails = await User.findOne({ _id: receiverId }).select('role personalDetails.firstName personalDetails.lastName');
                 client.send(
                  JSON.stringify({
                    event: 'message',
                    senderId:senderDetails,
                    receiverId: receiverDetails,
                    content,
                  }),
                );
              // }
            }
          });

          // Also send back to sender
          // ws.send(
          //   JSON.stringify({ event: 'message', senderId, receiverId, content }),
          // );
          return;
        }

        // Handle getChatHistory event (fetch from MongoDB)
        if (data.event === 'getChatHistory') {
          const { senderId, receiverId , joinedRoomId} = data;
          if (!senderId || !receiverId|| !joinedRoomId) {
            console.error(
              '❌ getChatHistory error: Missing senderId or receiverId',
            );
            return;
          }

          // Fetch chat history from MongoDB
          try {
            const chatHistory = await MessageModel.find({
              $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId },
              ],
            }).sort({ timestamp: 1 }); // Sort by timestamp (ascending)

            console.log(
              `📜 Fetched chat history for ${senderId} & ${receiverId}`,
            );
            ws.send(JSON.stringify({ event: 'chatHistory', chatHistory }));
          } catch (error) {
            console.error(
              '❌ Error fetching chat history from MongoDB:',
              error,
            );
          }
        }
      } catch (error) {
        console.error('❌ Error:', error);
        ws.send(JSON.stringify({ event: 'error', message: 'Invalid request' }));
      }
    });

    // Handle WebSocket close event
    ws.on('close', () => {
      console.log('❌ WebSocket Disconnected');
    });
  });
};
