import mongoose, { Schema } from 'mongoose';
import { IContent_management } from './content_management.types';

const Content_managementSchema: Schema<IContent_management> = new Schema(
  {
    title: { type: String, required: true },
    contentType: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    tags: { type: [String], required: true },
    status: {
      type: String,
      enum: ['draft', 'published', 'unpublished', 'archived'],
      default: 'draft',
    },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model<IContent_management>(
  'content_management',
  Content_managementSchema,
);
