import MessageModel from './messages.model';

class MessagesService {
    async getMessagesByRoomId(joinedRoomId: string) {
      return MessageModel.find({ joinedRoomId })
        .sort({ createdAt: 1 })
        .lean();
    }
  
  
  async saveMessage(senderId: string, receiverId: string, content: string, joinedRoomId: string) {
    const message = new MessageModel({
      senderId,
      receiverId,
      content,
      joinedRoomId,
    });

    await message.save();
    return message;
  }

  async getChatHistory(senderId: string, receiverId: string) {
    return MessageModel.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();
  }
}

const messagesService = new MessagesService();
export default messagesService;
