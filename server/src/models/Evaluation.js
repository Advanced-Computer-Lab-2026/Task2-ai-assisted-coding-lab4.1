import mongoose from 'mongoose';

// TODO: define the Evaluation schema per README.md section 1.

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
    },
    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Each user can evaluate a session only once
evaluationSchema.index(
  { sessionCode: 1, evaluatedBy: 1 },
  { unique: true }
);

module.exports = mongoose.model("Evaluation", evaluationSchema);