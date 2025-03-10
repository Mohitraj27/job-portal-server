
import { Router } from 'express';
import messagesController from './messages.controller';

const messagesRouter = Router();

messagesRouter.get('/history/:senderId/:receiverId', messagesController.getChatHistory);

export default messagesRouter;
