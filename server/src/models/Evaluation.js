import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema(
  {
    sessionCode: { type: String, required: true, trim: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    evaluatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// One evaluation per user per session. The partial filter means anonymous
// evaluations (no evaluatedBy) are not constrained, since anyone may submit
// without logging in and a plain unique index would treat missing values as
// equal (null) and reject a second anonymous evaluation of the same session.
evaluationSchema.index(
  { sessionCode: 1, evaluatedBy: 1 },
  { unique: true, partialFilterExpression: { evaluatedBy: { $type: 'objectId' } } }
);

export const Evaluation = mongoose.model('Evaluation', evaluationSchema);