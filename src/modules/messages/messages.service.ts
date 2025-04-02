import MessageModel from './messages.model';
import User from '@modules/user/user.model';
export const  MessagesService = {
    async getMessagesByRoomId(joinedRoomId: string) {
      const messages = await MessageModel.find({ joinedRoomId: joinedRoomId }).sort({ createdAt: 1 }).lean();
      const userIds = new Set();
      messages.forEach(message => {
        userIds.add(message.senderId.toString());
        userIds.add(message.receiverId.toString());
      });
      
      // Fetch all user details in one query
      const users = await User.find({
        _id: { $in: Array.from(userIds) }
      }).populate('personalDetails').lean();
      
      // Create a map for quick lookup
      const userMap: { [x: string]: any }= {};
      users.forEach(user => {
        userMap[user._id.toString()] = user;
      });
      
      // Embed user details in each message
      const enrichedMessages = messages.map(message => {
        const senderIdStr = message.senderId.toString();
        const receiverIdStr = message.receiverId.toString();
        
      return {
          ...message,
          senderId: userMap[senderIdStr] || message.senderId,
          receiverId: userMap[receiverIdStr] || message.receiverId
        };
      });
      
      return { data: enrichedMessages };
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

