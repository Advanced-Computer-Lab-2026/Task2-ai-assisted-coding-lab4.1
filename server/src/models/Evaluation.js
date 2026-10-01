import mongoose from 'mongoose';

// 1. We create a "Schema" which is like a blueprint for what data an evaluation should hold.
const evaluationSchema = new mongoose.Schema(
  {
    sessionCode: {
      type: String,
      required: true, // Must be provided
    },
    score: {
      type: Number,
      required: true,
      min: 1,  // The score cannot be lower than 1
      max: 5,  // The score cannot be higher than 5
    },
    comment: {
      type: String,
      required: false, // Optional
    },
    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId, // Links to a User's ID
      ref: 'User',
      required: false,
    },
  },
  { timestamps: true } // Automatically adds "createdAt" and "updatedAt" dates
);

// 2. We add a "Compound Unique Index". This guarantees that the combination 
// of a specific sessionCode and evaluatedBy (the user) is completely unique. 
// This prevents a user from rating the exact same session twice.
evaluationSchema.index({ sessionCode: 1, evaluatedBy: 1 }, { unique: true });

// 3. Export it so we can use it elsewhere.
export const Evaluation = mongoose.model('Evaluation', evaluationSchema);