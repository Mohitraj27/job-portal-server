import { Request, Response, NextFunction } from 'express';
import messagesService from './messages.service';

class MessagesController {
  async getChatHistory(req: Request, res: Response, next: NextFunction) {
    const { senderId, receiverId } = req.params;
    try {
      const chatHistory = await messagesService.getChatHistory(senderId, receiverId);
      res.sendResponse(200, chatHistory, 'Chat history fetched successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new MessagesController();
