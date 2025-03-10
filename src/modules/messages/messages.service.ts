import MessageModel from './messages.model';

class MessagesService {
  async saveMessage(senderId: string, receiverId: string, content: string) {
    const message = new MessageModel({
      senderId,
      receiverId,
      content,
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
