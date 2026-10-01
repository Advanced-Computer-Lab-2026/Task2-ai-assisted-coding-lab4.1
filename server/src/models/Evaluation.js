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

// One evaluation per user per session. Evaluations without an evaluatedBy are
// anonymous, so they are left out of the index instead of all colliding on null.
evaluationSchema.index(
  { sessionCode: 1, evaluatedBy: 1 },
  { unique: true, partialFilterExpression: { evaluatedBy: { $exists: true } } }
);

export const Evaluation = mongoose.model('Evaluation', evaluationSchema);
