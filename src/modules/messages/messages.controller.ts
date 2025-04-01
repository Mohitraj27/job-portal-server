import { Request, Response, NextFunction } from 'express';
import {MessagesService} from './messages.service';
import {MESSAGES_WEB_SOCKETS } from './messages.enum';

export const MessagesController = {
  async getChatHistory(req: Request, res: Response, next: NextFunction) {
    const { senderId, receiverId } = req.body;
    try {
      const chatHistory = await MessagesService.getChatHistory(senderId, receiverId);
      res.sendResponse(200, chatHistory, MESSAGES_WEB_SOCKETS.MESSAGES_HISTORY_FETCHED);
    } catch (error) {
      next(error);
    }
  },
  async getMessagesByRoomId(req: Request, res: Response, next: NextFunction) {
    const { joinedRoomId } = req.body;
    try {
     const messages = await MessagesService.getMessagesByRoomId(joinedRoomId);
     res.sendResponse(200, messages, MESSAGES_WEB_SOCKETS.MESSAGES_BASED_ON_ROOMID);
    } catch (error) {
      next(error);
    }
  }
}

