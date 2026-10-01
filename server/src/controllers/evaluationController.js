import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { Evaluation } from '../models/Evaluation.js';


const createSchema = Joi.object({
  sessionCode: Joi.string().required(),
  score: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow(''),
  evaluatedBy: Joi.string().hex().length(24)
});

function publicEvaluation(e) {
  return {
    _id: e._id.toString(),
    id: e._id.toString(),
    sessionCode: e.sessionCode,
    score: e.score,
    comment: e.comment,
    evaluatedBy: e.evaluatedBy ? e.evaluatedBy.toString() : undefined,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt
  };
}
// GET /api/evaluations
// TODO: implement per README.md section 2.
export async function getAllEvaluations(req, res, next) {
  try {
    // TODO
    const evaluations = await Evaluation.find().sort({ createdAt: -1 }).lean();
    res.json({ evaluations: evaluations.map(publicEvaluation) });
  } catch (err) { next(err); }
}

// GET /api/evaluations/:id
// TODO: implement per README.md section 2.
export async function getEvaluation(req, res, next) {
  try {
    // TODO
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) return res.status(404).json({ message: 'Evaluation not found' });
    res.json({ evaluation: publicEvaluation(evaluation) });
  } catch (err) { next(err); }
}

// POST /api/evaluations
// TODO: implement per README.md section 2.
export async function createEvaluation(req, res, next) {
  try {
    // TODO
     const { sessionCode, score, comment, evaluatedBy } = req.body;
    const evaluation = await Evaluation.create({ sessionCode, score, comment, evaluatedBy });
    res.status(201).json({ evaluation });
  } catch (err) { next(err); }
}

// GET /api/evaluations/summary?sessionCode=SS101
// TODO: implement per README.md section 3.
export async function getEvaluationSummary(req, res, next) {
  try {
    // TODO
     const { sessionCode } = req.query;
    if (!sessionCode) return res.status(400).json({ message: 'sessionCode is required' });

    const [result] = await Evaluation.aggregate([
      { $match: { sessionCode } },
      { $group: { _id: '$sessionCode', averageScore: { $avg: '$score' }, evaluationCount: { $sum: 1 } } },
    ]);

    res.json({
      sessionCode,
      averageScore: result ? result.averageScore : 0,
      evaluationCount: result ? result.evaluationCount : 0,
    });
  } catch (err) { next(err); }
}
