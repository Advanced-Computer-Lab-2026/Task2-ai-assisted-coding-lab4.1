import Joi from 'joi';
import mongoose from 'mongoose';
import { Evaluation } from '../models/Evaluation.js';

const createSchema = Joi.object({
  sessionCode: Joi.string().required(),
  score: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow('').optional(),
  evaluatedBy: Joi.string().length(24).hex().optional()
}).unknown(false);

// GET /api/evaluations
export async function getAllEvaluations(req, res, next) {
  try {
    const evaluations = await Evaluation.find().sort({ createdAt: -1 }).lean();
    res.json({ evaluations });
  } catch (err) { next(err); }
}

// GET /api/evaluations/:id
export async function getEvaluation(req, res, next) {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) return res.status(404).json({ message: 'Evaluation not found' });
    res.json({ evaluation });
  } catch (err) { next(err); }
}

// POST /api/evaluations
export async function createEvaluation(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });

    const payload = { ...value };
    if (payload.evaluatedBy) {
      payload.evaluatedBy = new mongoose.Types.ObjectId(payload.evaluatedBy);
    }

    const evaluation = await Evaluation.create(payload);
    res.status(201).json({ evaluation });
  } catch (err) { next(err); }
}

// GET /api/evaluations/summary?sessionCode=SS101
export async function getEvaluationSummary(req, res, next) {
  try {
    const sessionCode = req.query.sessionCode;
    if (!sessionCode) {
      return res.status(400).json({ message: 'sessionCode is required' });
    }

    const [summary] = await Evaluation.aggregate([
      { $match: { sessionCode } },
      {
        $group: {
          _id: '$sessionCode',
          averageScore: { $avg: '$score' },
          evaluationCount: { $sum: 1 }
        }
      }
    ]);

    return res.json({
      sessionCode,
      averageScore: summary ? Number(summary.averageScore) : 0,
      evaluationCount: summary ? Number(summary.evaluationCount) : 0
    });
  } catch (err) { next(err); }
}
