import mongoose from 'mongoose';

// TODO: define the Evaluation schema per README.md section 1.

const evaluationSchema = new mongoose.Schema(
  {
    sessionCode: { type: String, required: true },
    score: { type: Number, required: true },
    comment:{ type: String, required: false },
    evaluatedBy: { type: String, required: true }
  },
  { timestamps: true }
);

// TODO: add the compound uniqueness constraint described in README.md section 1.
evaluationSchema.index({ sessionCode: 1, evaluatedBy: 1 }, { unique: true });

export const Evaluation = mongoose.model('Evaluation', evaluationSchema);
