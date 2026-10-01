import { Evaluation } from '../models/Evaluation.js';

// GET /api/evaluations
// TODO: implement per README.md section 2.
export async function getAllEvaluations(req, res, next) {
  try {
    const evaluations = await Evaluation.find()
      .populate('evaluatedBy', 'name email');

    return res.status(200).json({ evaluations });
  } catch (err) {
    next(err);
  }
}

// GET /api/evaluations/:id
// TODO: implement per README.md section 2.
export async function getEvaluation(req, res, next) {
  try {
    const evaluation = await Evaluation.findById(req.params.id)
      .populate('evaluatedBy', 'name email');

    if (!evaluation) {
      return res.status(404).json({
  message: 'Evaluation not found'
});
    }

    return res.status(200).json({ evaluation });
  } catch (err) {
    next(err);
  }
}

// POST /api/evaluations
// TODO: implement per README.md section 2.
export async function createEvaluation(req, res, next) {
  try {
    const { sessionCode, score, comment, evaluatedBy } = req.body;

    if (!sessionCode || score === undefined || !evaluatedBy) {
      return res.status(400).json({
        error: 'sessionCode, score, and evaluatedBy are required'
      });
    }

    if (score < 1 || score > 5) {
      return res.status(400).json({
        error: 'score must be between 1 and 5'
      });
    }

    const evaluation = await Evaluation.create({
      sessionCode,
      score,
      comment,
      evaluatedBy
    });

    
    return res.status(201).json({ evaluation });
  } catch (err) {
    next(err);
  }
}

// GET /api/evaluations/summary?sessionCode=SS101
// TODO: implement per README.md section 3.
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
        $match: {
          sessionCode
        }
      },
      {
        $group: {
          _id: '$sessionCode',
          averageScore: { $avg: '$score' },
         evaluationCount: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) {
  return res.status(200).json({
    sessionCode,
    averageScore: 0,
    evaluationCount: 0
  });
}

    return res.status(200).json({
  sessionCode,
  averageScore: result[0].averageScore,
  evaluationCount: result[0].evaluationCount
});
  } catch (err) {
    next(err);
  }
}
