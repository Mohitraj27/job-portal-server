import mongoose, { Schema } from 'mongoose';
import { IMessage } from './messages.types';

const MessageSchema: Schema = new Schema(
  {
    senderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    receiverId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    joinedRoomId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true 
  }
);

const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);
export default MessageModel;
