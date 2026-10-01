import mongoose from 'mongoose';
import Evaluation from '../models/Evaluation.js';

export const createEvaluation = async (req, res, next) => {
  try {
    const evaluation = await Evaluation.create(req.body);

    res.status(201).json({
      evaluation,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEvaluations = async (req, res, next) => {
  try {
    const evaluations = await Evaluation.find();

    res.status(200).json({
      evaluations,
    });
  } catch (error) {
    next(error);
  }
};

export const getEvaluation = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({
        message: 'Evaluation not found',
      });
    }

    const evaluation = await Evaluation.findById(req.params.id);

    if (!evaluation) {
      return res.status(404).json({
        message: 'Evaluation not found',
      });
    }

    res.status(200).json({
      evaluation,
    });
  } catch (error) {
    next(error);
  }
};

export const getEvaluationSummary = async (req, res, next) => {
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
          _id: '$sessionCode',
          averageScore: {
            $avg: '$score',
          },
          evaluationCount: {
            $sum: 1,
          },
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        sessionCode,
        averageScore: 0,
        evaluationCount: 0,
      });
    }

    res.status(200).json({
      sessionCode,
      averageScore: result[0].averageScore,
      evaluationCount: result[0].evaluationCount,
    });
  } catch (error) {
    next(error);
  }
};
