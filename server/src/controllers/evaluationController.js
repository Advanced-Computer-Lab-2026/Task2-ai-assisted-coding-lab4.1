import { Evaluation } from '../models/Evaluation.js';

// GET /api/evaluations
// TODO: implement per README.md section 2.
export async function getAllEvaluations(req, res, next) {
  try {
    // TODO
    const evaluations = await Evaluation.find();
    res.status(200).json({ evaluations });
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
    res.status(200).json({ evaluation });
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
 
    const [result] = await Evaluation.aggregate([
      { $match: { sessionCode } },
      {
        $group: {
          _id: '$sessionCode',
          averageScore: { $avg: '$score' },
          evaluationCount: { $sum: 1 },
        },
      },
    ]);
 
    res.status(200).json({
      sessionCode,
      averageScore: result ? result.averageScore : 0,
      evaluationCount: result ? result.evaluationCount : 0,
    });
  } catch (err) { next(err); }
}
