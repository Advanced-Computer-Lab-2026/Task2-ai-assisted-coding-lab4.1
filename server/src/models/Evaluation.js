import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema(
  {
    sessionCode: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: false,
    },

    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  { timestamps: true }
);

evaluationSchema.index(
  { sessionCode: 1, evaluatedBy: 1 },
  { unique: true }
);

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

export default Evaluation;