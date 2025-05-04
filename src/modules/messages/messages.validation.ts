import { validateSchema } from '@middlewares/validation.middleware';
import { z } from 'zod';
const chatHistorySchema = z.object({
    senderId: z.string().min(1, 'Sender ID is required'),
    receiverId: z.string().min(1, 'Receiver ID is required'),
    
})
const messageSchemaByRoomId = z.object({
    joinedRoomId: z.string().min(1, 'Joined ID is required')
})
const MessageCountforJobSeeker = z.object({
    userId: z.string().min(1, 'User ID is required')
})
export const validategetMessagesByRoomId  = validateSchema(messageSchemaByRoomId, 'query');
export const validatechatHistorySchema = validateSchema(chatHistorySchema, 'body');
export const validateMessageCountforJobSeeker = validateSchema(MessageCountforJobSeeker, 'query');