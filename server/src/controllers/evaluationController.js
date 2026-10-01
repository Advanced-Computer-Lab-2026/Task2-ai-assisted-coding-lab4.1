import Joi from 'joi';
import { Evaluation } from '../models/Evaluation.js';

const createSchema = Joi.object({
  sessionCode: Joi.string().trim().required(),
  score: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().allow('').optional(),
  evaluatedBy: Joi.string().hex().length(24).optional()
});

// GET /api/evaluations
export async function getAllEvaluations(req, res, next) {
  try {
    const evaluations = await Evaluation.find().sort({ createdAt: -1 });
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
    const { value, error } = createSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ message: error.message });

    const evaluation = await Evaluation.create({
      sessionCode: value.sessionCode,
      score: value.score,
      ...(value.comment !== undefined ? { comment: value.comment } : {}),
      ...(value.evaluatedBy !== undefined ? { evaluatedBy: value.evaluatedBy } : {})
    });
    res.status(201).json({ evaluation });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: 'Evaluation already exists for this session and evaluator' });
    }
    next(err);
  }
}

// GET /api/evaluations/summary?sessionCode=SS101
export async function getEvaluationSummary(req, res, next) {
  try {
    const sessionCode = req.query.sessionCode;
    if (!sessionCode) return res.status(400).json({ message: 'sessionCode is required' });

    const result = await Evaluation.aggregate([
      { $match: { sessionCode } },
      {
        $group: {
          _id: '$sessionCode',
          averageScore: { $avg: '$score' },
          evaluationCount: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) {
      return res.json({ sessionCode, averageScore: 0, evaluationCount: 0 });
    }

    res.json({
      sessionCode,
      averageScore: result[0].averageScore,
      evaluationCount: result[0].evaluationCount
    });
  } catch (err) { next(err); }
}
