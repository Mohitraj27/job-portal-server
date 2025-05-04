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
    const { joinedRoomId } = req.query;
    try {
     const messages = await MessagesService.getMessagesByRoomId(joinedRoomId as string);
     res.sendResponse(200, messages, MESSAGES_WEB_SOCKETS.MESSAGES_BASED_ON_ROOMID);
    } catch (error) {
      next(error);
    }
  },
  async getMessageCountforJobSeeker(req:Request, res:Response, next: NextFunction){
    const { userId } = req.query;
    try{
      const countData = await MessagesService.MessageCountforJobSeeker(userId as string);
      res.sendResponse(200,countData, MESSAGES_WEB_SOCKETS.MESSAGE_COUNT);
    }catch(error){
      next(error);
    }
  }
}

