import mongoose from 'mongoose';
import { Evaluation } from '../models/Evaluation.js';

// GET /api/evaluations
// TODO: implement per README.md section 2.
export async function getAllEvaluations(req, res, next) {
  try {
    const evaluations = await Evaluation.find();
    return res.status(200).json({ evaluations });
  } catch (err) { 
    next(err); 
  }
}

// GET /api/evaluations/:id
// TODO: implement per README.md section 2.
export async function getEvaluation(req, res, next) {
  try {
    const { id } = req.params;

    // Check if the ID is a valid MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    const evaluation = await Evaluation.findById(id);

    // Check if the document actually exists in the database
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    return res.status(200).json({ evaluation });
  } catch (err) { 
    next(err); 
  }
}

// POST /api/evaluations
// TODO: implement per README.md section 2.
export async function createEvaluation(req, res, next) {
  try {
    const evaluation = await Evaluation.create(req.body);
    return res.status(201).json({ evaluation });
  } catch (err) { 
    next(err); 
  }
}

// GET /api/evaluations/summary?sessionCode=SS101
// TODO: implement per README.md section 3.
// GET /api/evaluations/summary?sessionCode=SS101
export async function getEvaluationSummary(req, res, next) {
  try {
    const { sessionCode } = req.query;

    // 1. Check if sessionCode is missing
    if (!sessionCode) {
      return res.status(400).json({ message: 'sessionCode is required' });
    }

    // 2. Compute using aggregate (matching the exact requirements)
    const summary = await Evaluation.aggregate([
      { $match: { sessionCode: sessionCode } },
      {
        $group: {
          _id: '$sessionCode',
          averageScore: { $avg: '$score' },
          evaluationCount: { $sum: 1 }
        }
      }
    ]);

    // 3. If nothing matches, return 0s
    if (summary.length === 0) {
      return res.status(200).json({
        sessionCode: sessionCode,
        averageScore: 0,
        evaluationCount: 0
      });
    }

    // 4. Return the calculated summary
    return res.status(200).json({
      sessionCode: summary[0]._id,
      averageScore: summary[0].averageScore,
      evaluationCount: summary[0].evaluationCount
    });
  } catch (err) { 
    next(err); 
  }
}
