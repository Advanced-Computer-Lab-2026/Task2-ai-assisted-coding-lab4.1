import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema(
  {
    sessionCode: { type: String, required: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    evaluatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// Unique per (session, user). The partial filter applies the rule only when
// evaluatedBy exists, so anonymous evaluations don't collide with each other.
evaluationSchema.index(
  { sessionCode: 1, evaluatedBy: 1 },
  { unique: true, partialFilterExpression: { evaluatedBy: { $type: 'objectId' } } }
);

export const Evaluation = mongoose.model('Evaluation', evaluationSchema);
export default Evaluation;