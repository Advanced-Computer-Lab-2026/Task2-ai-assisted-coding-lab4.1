import mongoose from 'mongoose';
import Joi from 'joi';
import { Evaluation } from '../models/Evaluation.js';

const createSchema = Joi.object({
  sessionCode: Joi.string().required(),
  score: Joi.number().min(1).max(5).required(),
  comment: Joi.string().optional(),
  evaluatedBy: Joi.string().hex().length(24).optional()
});

// GET /api/evaluations
export async function getAllEvaluations(req, res, next) {
  try {
    const evaluations = await Evaluation.find().lean();
    res.status(200).json({ evaluations });
  } catch (err) { next(err); }
}

// GET /api/evaluations/:id
export async function getEvaluation(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const evaluation = await Evaluation.findById(id).lean();
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }
    res.status(200).json({ evaluation });
  } catch (err) { next(err); }
}

// POST /api/evaluations
export async function createEvaluation(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const evaluation = await Evaluation.create(value);
    res.status(201).json({ evaluation });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'This user has already evaluated this session' });
    }
    next(err);
  }
}

// GET /api/evaluations/summary?sessionCode=SS101
export async function getEvaluationSummary(req, res, next) {
  try {
    const { sessionCode } = req.query;
    if (!sessionCode || typeof sessionCode !== 'string') {
      return res.status(400).json({ message: 'sessionCode is required' });
    }

    const result = await Evaluation.aggregate([
      { $match: { sessionCode } },
      {
        $group: {
          _id: '$sessionCode',
          averageScore: { $avg: '$score' },
          evaluationCount: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(200).json({ sessionCode, averageScore: 0, evaluationCount: 0 });
    }

    res.status(200).json({
      sessionCode,
      averageScore: result[0].averageScore,
      evaluationCount: result[0].evaluationCount,
    });
  } catch (err) { next(err); }
}
