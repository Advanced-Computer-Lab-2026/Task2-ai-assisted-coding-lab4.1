import mongoose from 'mongoose';

// TODO: define the Evaluation schema per README.md section 1.

const evaluationSchema = new mongoose.Schema(
  {
    sessionCode: {
      type: String,
      required: true
    },

    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    comment: {
      type: String,
      required: false
    },

    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }
  },
  { timestamps: true }
);

// TODO: add the compound uniqueness constraint described in README.md section 1.

export const Evaluation = mongoose.model('Evaluation', evaluationSchema);
