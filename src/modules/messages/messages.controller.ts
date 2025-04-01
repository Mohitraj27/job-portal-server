import { Request, Response, NextFunction } from 'express';
import messagesService from './messages.service';

export const MessagesController = {
  async getChatHistory(req: Request, res: Response, next: NextFunction) {
    const { senderId, receiverId } = req.params;
    try {
      const chatHistory = await messagesService.getChatHistory(senderId, receiverId);
      res.sendResponse(200, chatHistory, 'Chat history fetched successfully');
    } catch (error) {
      next(error);
    }
  },
  async getMessagesByRoomId(req: Request, res: Response, next: NextFunction) {
    const { joinedRoomId } = req.params;
    try {
    if (!joinedRoomId) {
      return res.status(400).json({ message: 'Missing joinedRoomId' });
    }
     const messages = await messagesService.getMessagesByRoomId(joinedRoomId);
      res.status(200).json({ success: true, data: messages });
    } catch (error) {
      next(error);
    }
  }
}

