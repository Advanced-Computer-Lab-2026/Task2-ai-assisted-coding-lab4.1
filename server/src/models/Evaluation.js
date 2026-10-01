import mongoose from 'mongoose';

const mongoose = require("mongoose");

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
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same user from evaluating the same session more than once
evaluationSchema.index(
  { sessionCode: 1, evaluatedBy: 1 },
  { unique: true }
);

module.exports = mongoose.model("Evaluation", evaluationSchema);