import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema(
  {
    sessionCode: { type: String, required: true, trim: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    evaluatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// One evaluation per user per session. evaluatedBy is optional (there is no
// login), so the index only covers documents that actually have one; otherwise
// every anonymous evaluation would index as null and only one per session could exist.
evaluationSchema.index(
  { sessionCode: 1, evaluatedBy: 1 },
  { unique: true, partialFilterExpression: { evaluatedBy: { $type: 'objectId' } } }
);

export const Evaluation = mongoose.model('Evaluation', evaluationSchema);
