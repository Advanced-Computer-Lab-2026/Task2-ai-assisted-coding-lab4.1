import mongoose from 'mongoose';
import { Evaluation } from '../models/Evaluation.js';

// GET /api/evaluations
// TODO: implement per README.md section 2.
export async function getAllEvaluations(req, res, next) {
  try {
    const evaluations = await Evaluation.find();
    res.status(200).json({ evaluations });
  } catch (err) {
    next(err);
  }
}

// GET /api/evaluations/:id
// TODO: implement per README.md section 2.
export async function getEvaluation(req, res, next) {
  try {
    const { id } = req.params;

    // Reject non-ObjectId strings immediately to avoid CastError and return 404
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    const evaluation = await Evaluation.findById(id);
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    res.status(200).json({ evaluation });
  } catch (err) {
    next(err);
  }
}

// POST /api/evaluations
// TODO: implement per README.md section 2.
export async function createEvaluation(req, res, next) {
  try {
    const { sessionCode, score, comment, evaluatedBy } = req.body;

    const evaluation = await Evaluation.create({
      sessionCode,
      score,
      comment,
      evaluatedBy,
    });

    res.status(201).json({ evaluation });
  } catch (err) {
    next(err);
  }
}

// GET /api/evaluations/summary?sessionCode=SS101
// TODO: implement per README.md section 3.
export async function getEvaluationSummary(req, res, next) {
  try {
    const { sessionCode } = req.query;

    if (!sessionCode) {
      return res.status(400).json({ message: 'sessionCode is required' });
    }

    const results = await Evaluation.aggregate([
      {
        $match: { sessionCode },
      },
      {
        $group: {
          _id: '$sessionCode',
          averageScore: { $avg: '$score' },
          evaluationCount: { $sum: 1 },
        },
      },
    ]);

    // Fallback if no evaluations match the given sessionCode
    if (results.length === 0) {
      return res.status(200).json({
        sessionCode,
        averageScore: 0,
        evaluationCount: 0,
      });
    }

    res.status(200).json({
      sessionCode,
      averageScore: results[0].averageScore,
      evaluationCount: results[0].evaluationCount,
    });
  } catch (err) {
    next(err);
  }
}