const mongoose = require('mongoose');

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
    },

    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

evaluationSchema.index(
  { sessionCode: 1, evaluatedBy: 1 },
  { unique: true, sparse: true }
);

module.exports = mongoose.model('Evaluation', evaluationSchema);