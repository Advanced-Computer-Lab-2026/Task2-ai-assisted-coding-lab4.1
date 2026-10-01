import mongoose from 'mongoose';

// TODO: define the Evaluation schema per README.md section 1.

const evaluationSchema = new mongoose.Schema(
  {
    // TODO
    sessionCode: { type: String, required: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    evaluatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
evaluationSchema.index({ sessionCode: 1, evaluatedBy: 1 }, { unique: true });
// TODO: add the compound uniqueness constraint described in README.md section 1.

export const Evaluation = mongoose.model('Evaluation', evaluationSchema);
