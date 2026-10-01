import { Evaluation } from '../models/Evaluation.js';

// GET /api/evaluations
export async function getAllEvaluations(req, res, next) {
  try {
    const evaluations = await Evaluation.find().lean();
    res.json({ evaluations });
  } catch (err) {
    next(err);
  }
}

// GET /api/evaluations/:id
export async function getEvaluation(req, res, next) {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }
    res.json({ evaluation });
  } catch (err) {
    next(err);
  }
}

// POST /api/evaluations
export async function createEvaluation(req, res, next) {
  try {
    const evaluation = await Evaluation.create(req.body);
    res.status(201).json({ evaluation });
  } catch (err) {
    next(err);
  }
}

// GET /api/evaluations/summary?sessionCode=...
export async function getEvaluationSummary(req, res, next) {
  try {
    const { sessionCode } = req.query;
    if (!sessionCode) {
      return res.status(400).json({ message: 'sessionCode is required' });
    }

    const summary = await Evaluation.aggregate([
      { $match: { sessionCode } },
      {
        $group: {
          _id: '$sessionCode',
          averageScore: { $avg: '$score' },
          evaluationCount: { $sum: 1 },
        },
      },
    ]);

    if (summary.length === 0) {
      return res.json({
        sessionCode,
        averageScore: 0,
        evaluationCount: 0,
      });
    }

    const result = summary[0];
    res.json({
      sessionCode: result._id,
      averageScore: result.averageScore,
      evaluationCount: result.evaluationCount,
    });
  } catch (err) {
    next(err);
  }
}
