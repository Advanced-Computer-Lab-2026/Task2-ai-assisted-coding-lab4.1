import mongoose from 'mongoose';

// TODO: define the Evaluation schema per README.md section 1.


const evaluationSchema = new mongoose.Schema(
  {
    sessionCode: { type: String, required: true, trim: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: false, default: '', trim: true },
    evaluatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },

    // TODO
  },
  { timestamps: true }
);

evaluationSchema.index({ sessionCode: 1, evaluatedBy: 1 }, { unique: true });

export const Evaluation = mongoose.model('Evaluation', evaluationSchema);
