import { Evaluation } from '../models/Evaluation.js';

// GET /api/evaluations
export async function getAllEvaluations(req, res, next) {
  try {
    const evaluations = await Evaluation.find().sort({ createdAt: -1 });
    res.status(200).json({ evaluations });
  } catch (err) { next(err); }
}

// GET /api/evaluations/:id
export async function getEvaluation(req, res, next) {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) return res.status(404).json({ message: 'Evaluation not found' });
    res.status(200).json({ evaluation });
  } catch (err) { next(err); }
}

// POST /api/evaluations
export async function createEvaluation(req, res, next) {
  try {
    const evaluation = await Evaluation.create(req.body);
    res.status(201).json({ evaluation });
  } catch (err) { next(err); }
}

// GET /api/evaluations/summary?sessionCode=SS101
export async function getEvaluationSummary(req, res, next) {
  try {
    const sessionCode = Array.isArray(req.query.sessionCode)
      ? req.query.sessionCode[0]
      : req.query.sessionCode;

    if (!sessionCode) {
      return res.status(400).json({ message: 'sessionCode is required' });
    }

    const [result] = await Evaluation.aggregate([
      { $match: { sessionCode } },
      {
        $group: {
          _id: '$sessionCode',
          averageScore: { $avg: '$score' },
          evaluationCount: { $sum: 1 }
        }
      }
    ]);

    return res.status(200).json({
      sessionCode,
      averageScore: result ? Number(result.averageScore) : 0,
      evaluationCount: result ? result.evaluationCount : 0
    });
  } catch (err) { next(err); }
}
