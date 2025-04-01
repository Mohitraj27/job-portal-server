
import { Router } from 'express';
import {MessagesController} from './messages.controller';

const messagesRouter = Router();
messagesRouter.route('/get-messages').get(MessagesController.getMessagesByRoomId);
messagesRouter.route('/history/:senderId/:receiverId').get(MessagesController.getChatHistory);

export default messagesRouter;
