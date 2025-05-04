import mongoose, { Schema } from 'mongoose';

const JobBookmarkedSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  jobIds: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('BookmarkJobs', JobBookmarkedSchema);