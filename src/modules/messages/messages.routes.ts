
import { Router } from 'express';
import { MessagesController } from './messages.controller';
import { validategetMessagesByRoomId,validatechatHistorySchema } from './messages.validation';
const messagesRouter = Router();
messagesRouter.route('/get-messages-by-roomid').get(validategetMessagesByRoomId, MessagesController.getMessagesByRoomId);
messagesRouter.route('/history-messages').get(validatechatHistorySchema,MessagesController.getChatHistory);

export default messagesRouter;
