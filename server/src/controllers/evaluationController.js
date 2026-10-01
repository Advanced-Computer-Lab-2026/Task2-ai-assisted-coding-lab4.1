import { Evaluation } from '../models/Evaluation.js';

// GET /api/evaluations
// TODO: implement per README.md section 2.
export async function getAllEvaluations(req, res, next) {
  try {
    // TODO
    const evaluations = await Evaluation.find();
    res.json({ evaluations });
  } catch (err) { next(err); }
}

// GET /api/evaluations/:id
// TODO: implement per README.md section 2.
export async function getEvaluation(req, res, next) {
  try {
    // TODO
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }
    res.json({ evaluation });
  } catch (err) { next(err); }
}

// POST /api/evaluations
// TODO: implement per README.md section 2.
export async function createEvaluation(req, res, next) {
  try {
    // TODO
    const evaluation = await Evaluation.create(req.body);
    res.status(201).json({ evaluation });
  } catch (err) { next(err); }
}

// GET /api/evaluations/summary?sessionCode=SS101
// TODO: implement per README.md section 3.
export async function getEvaluationSummary(req, res, next) {
  try {
    // TODO
       const { sessionCode } = req.query;
    if (!sessionCode) {
      return res.status(400).json({ message: 'sessionCode is required' });
    }
    const results = await Evaluation.aggregate([
      { $match: { sessionCode } },
      {
        $group: {
          _id: '$sessionCode',
          averageScore: { $avg: '$score' },
          evaluationCount: { $sum: 1 }
        }
      }
    ]);
    if (results.length > 0) {
      return res.json({
        sessionCode,
        averageScore: results[0].averageScore,
        evaluationCount: results[0].evaluationCount
      });
    }
    return res.json({
      sessionCode,
      averageScore: 0,
      evaluationCount: 0
    });
  } catch (err) { next(err); }
}
