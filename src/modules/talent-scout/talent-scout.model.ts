import mongoose, { Schema } from 'mongoose';
import { ITalentScout } from './talent-scout.types';

const talentScountSchema: Schema = new Schema({
  jobId :{ type: Schema.Types.ObjectId, ref: 'Job', required: true },
  candidateId :[{ type: Schema.Types.ObjectId, ref: 'User' }],
  matchCount : { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const TalentScountSchema = mongoose.model<ITalentScout>('TalentScout', talentScountSchema);
export default TalentScountSchema;