import Evaluation from '../models/Evaluation.js';

// POST /api/evaluations
export const createEvaluation = async (req, res, next) => {
  try {
    const evaluation = await Evaluation.create(req.body);
    return res.status(201).json({ evaluation });
  } catch (err) {
    return next(err);
  }
};

// GET /api/evaluations
export const getAllEvaluations = async (req, res, next) => {
  try {
    const evaluations = await Evaluation.find();
    return res.status(200).json({ evaluations });
  } catch (err) {
    return next(err);
  }
};

// GET /api/evaluations/summary?sessionCode=SS101
export const getEvaluationSummary = async (req, res, next) => {
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
      return res.status(200).json({
        sessionCode,
        averageScore: 0,
        evaluationCount: 0,
      });
    }

    return res.status(200).json({
      sessionCode,
      averageScore: summary[0].averageScore,
      evaluationCount: summary[0].evaluationCount,
    });
  } catch (err) {
    return next(err);
  }
};

// GET /api/evaluations/:id
export const getEvaluation = async (req, res, next) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    return res.status(200).json({ evaluation });
  } catch (err) {
    return next(err);
  }
};