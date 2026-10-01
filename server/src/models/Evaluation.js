import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema(
  {
    sessionCode: { type: String, required: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    evaluatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// One evaluation per user per session.
// The partial filter lets anonymous evaluations (no evaluatedBy) coexist.
evaluationSchema.index(
  { sessionCode: 1, evaluatedBy: 1 },
  { unique: true, partialFilterExpression: { evaluatedBy: { $exists: true } } }
);

export const Evaluation = mongoose.model('Evaluation', evaluationSchema);