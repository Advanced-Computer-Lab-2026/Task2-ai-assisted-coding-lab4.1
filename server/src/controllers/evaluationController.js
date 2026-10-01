import mongoose from 'mongoose';
import { Evaluation } from '../models/Evaluation.js';

export const createEvaluation = async (req, res, next) => {
  try {
    const { sessionCode, score, comment, evaluatedBy } = req.body;
    const evaluation = await Evaluation.create({ sessionCode, score, comment, evaluatedBy });
    res.status(201).json({ evaluation });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Evaluation already exists for this session and user' });
    }
    next(err);
  }
};

export const getAllEvaluations = async (req, res, next) => {
  try {
    const evaluations = await Evaluation.find();
    res.status(200).json({ evaluations });
  } catch (err) {
    next(err);
  }
};

export const getEvaluation = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    const evaluation = await Evaluation.findById(id);
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }
    res.status(200).json({ evaluation });
  } catch (err) {
    next(err);
  }
};

export const getEvaluationSummary = async (req, res, next) => {
  try {
    const { sessionCode } = req.query;
    if (!sessionCode || typeof sessionCode !== 'string') {
      return res.status(400).json({ message: 'sessionCode is required' });
    }

    const result = await Evaluation.aggregate([
      { $match: { sessionCode } },
      {
        $group: {
          _id: '$sessionCode',
          averageScore: { $avg: '$score' },
          evaluationCount: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) {
      return res.status(200).json({ sessionCode, averageScore: 0, evaluationCount: 0 });
    }

    res.status(200).json({
      sessionCode,
      averageScore: result[0].averageScore,
      evaluationCount: result[0].evaluationCount
    });
  } catch (err) {
    next(err);
  }
};