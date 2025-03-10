
import { Router } from 'express';
import messagesController from './messages.controller';

const router = Router();

router.get('/history/:senderId/:receiverId', messagesController.getChatHistory);

export default router;
