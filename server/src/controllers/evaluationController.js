import Joi from 'joi';
import { Evaluation } from '../models/Evaluation.js';

const createSchema = Joi.object({
  sessionCode: Joi.string().required(),
  score: Joi.number().min(1).max(5).required(),
  comment: Joi.string(),
  evaluatedBy: Joi.string().hex().length(24)
}).unknown(false);

export async function getAllEvaluations(req, res, next) {
  try {
    const evaluations = await Evaluation.find();
    res.json({ evaluations });
  } catch (err) { next(err); }
}

export async function getEvaluation(req, res, next) {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) return res.status(404).json({ message: 'Evaluation not found' });
    res.json({ evaluation });
  } catch (err) { next(err); }
}

export async function createEvaluation(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const evaluation = await Evaluation.create(value);
    res.status(201).json({ evaluation });
  } catch (err) { next(err); }
}

export async function getEvaluationSummary(req, res, next) {
  try {
    const { sessionCode } = req.query;
    if (!sessionCode) return res.status(400).json({ message: 'sessionCode is required' });

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

    res.json({
      sessionCode,
      averageScore: summary?.averageScore ?? 0,
      evaluationCount: summary?.evaluationCount ?? 0
    });
  } catch (err) { next(err); }
}
