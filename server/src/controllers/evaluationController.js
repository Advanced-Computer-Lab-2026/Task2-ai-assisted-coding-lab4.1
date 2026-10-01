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
    const evaluations = await Evaluation.find();
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
    const { value, error } = createSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    if (error) return res.status(400).json({ message: error.message });

    const evaluation = await Evaluation.create(value);
    res.status(201).json({ evaluation });
  } catch (err) { next(err); }
}

// GET /api/evaluations/summary?sessionCode=SS101
export async function getEvaluationSummary(req, res, next) {
  try {
    const { sessionCode } = req.query;
    if (!sessionCode) return res.status(400).json({ message: 'sessionCode is required' });

    const [summary] = await Evaluation.aggregate([
      { $match: { sessionCode } },
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$score' },
          evaluationCount: { $sum: 1 }
        }
      }
    ]);

    res.json({
      sessionCode,
      averageScore: summary?.averageScore ?? 0,
      evaluationCount: summary?.evaluationCount ?? 0
    });
  } catch (err) { next(err); }
}
