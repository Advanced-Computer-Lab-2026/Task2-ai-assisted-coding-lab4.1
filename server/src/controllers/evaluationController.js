import { Evaluation } from '../models/Evaluation.js';

// GET /api/evaluations
export async function getAllEvaluations(req, res, next) {
  try {
    const evaluations = await Evaluation.find();

    return res.status(200).json({
      evaluations
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/evaluations/:id
export async function getEvaluation(req, res, next) {
  try {
    const evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({
        message: 'Evaluation not found'
      });
    }

    return res.status(200).json({
      evaluation
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/evaluations
export async function createEvaluation(req, res, next) {
  try {
    const evaluation = await Evaluation.create(req.body);

    return res.status(201).json({
      evaluation
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/evaluations/summary?sessionCode=SS101
export async function getEvaluationSummary(req, res, next) {
  try {
    const { sessionCode } = req.query;

    if (!sessionCode) {
      return res.status(400).json({
        message: 'sessionCode is required'
      });
    }

    const result = await Evaluation.aggregate([
      {
        $match: { sessionCode: sessionCode }
      },
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$score' },
          evaluationCount: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        sessionCode: sessionCode,
        averageScore: 0,
        evaluationCount: 0
      });
    }

    return res.status(200).json({
      sessionCode: sessionCode,
      averageScore: result[0].averageScore,
      evaluationCount: result[0].evaluationCount
    });

  } catch (err) {
    next(err);
  }
}