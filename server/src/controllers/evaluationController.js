import Evaluation from '../models/Evaluation.js';

const createEvaluation = async (req, res, next) => {
  try {
    const evaluation = await Evaluation.create(req.body);

    res.status(201).json({
      evaluation,
    });
  } catch (err) {
    next(err);
  }
};

const getAllEvaluations = async (req, res, next) => {
  try {
    const evaluations = await Evaluation.find();

    res.status(200).json({
      evaluations,
    });
  } catch (err) {
    next(err);
  }
};

const getEvaluation = async (req, res, next) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({
        message: 'Evaluation not found',
      });
    }

    res.status(200).json({
      evaluation,
    });
  } catch (err) {
    next(err);
  }
};

const getEvaluationSummary = async (req, res, next) => {
  try {
    const { sessionCode } = req.query;

    if (!sessionCode) {
      return res.status(400).json({
        message: 'sessionCode is required',
      });
    }

    const result = await Evaluation.aggregate([
      {
        $match: {
          sessionCode,
        },
      },
      {
        $group: {
          _id: null,
          averageScore: {
            $avg: '$score',
          },
          evaluationCount: {
            $sum: 1,
          },
        },
      },
    ]);

    let averageScore = 0;
    let evaluationCount = 0;

    if (result.length > 0) {
      averageScore = result[0].averageScore;
      evaluationCount = result[0].evaluationCount;
    }

    res.status(200).json({
      sessionCode,
      averageScore,
      evaluationCount,
    });
  } catch (err) {
    next(err);
  }
};

export {
  createEvaluation,
  getAllEvaluations,
  getEvaluation,
  getEvaluationSummary,
};