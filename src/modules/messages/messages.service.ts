import MessageModel from './messages.model';

export const  MessagesService = {
    async getMessagesByRoomId(joinedRoomId: string) {
      const data = await MessageModel.find({ joinedRoomId: joinedRoomId });
      return data;
    },
  
  
  async saveMessage(senderId: string, receiverId: string, content: string, joinedRoomId: string) {
    const message = new MessageModel({
      senderId,
      receiverId,
      content,
      joinedRoomId,
    });

    await message.save();
    return message;
  },

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

