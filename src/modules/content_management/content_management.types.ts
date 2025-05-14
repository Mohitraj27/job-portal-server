
import { Document } from 'mongoose';

export interface IContent_management extends Document {
  title : string;
  contentType : string;
  description : string;
  category : string;
  imageUrl : string;
  tags : string[];
  status : Status;
  views?: number;
}
  
export type Status = 'draft' | 'published' | 'unpublished' | 'archived';