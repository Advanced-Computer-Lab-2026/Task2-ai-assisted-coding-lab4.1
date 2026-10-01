import mongoose from 'mongoose';
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
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid evaluation id' });
    }
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) return res.status(404).json({ message: 'Evaluation not found' });
    res.status(200).json({ evaluation });
  } catch (err) { next(err); }
}

// POST /api/evaluations
export async function createEvaluation(req, res, next) {
  try {
    const { sessionCode, score, comment, evaluatedBy } = req.body;
    const evaluation = await Evaluation.create({ sessionCode, score, comment, evaluatedBy });
    res.status(201).json({ evaluation });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    if (err.code === 11000) {
      return res.status(409).json({ message: 'You already evaluated this session' });
    }
    next(err);
  }
}

// GET /api/evaluations/summary?sessionCode=SS101
export async function getEvaluationSummary(req, res, next) {
  try {
    const { sessionCode } = req.query;
    if (!sessionCode || typeof sessionCode !== 'string') {
      return res.status(400).json({ message: 'sessionCode is required' });
    }

    const result = await Evaluation.aggregate([
      { $match: { sessionCode } },
      { $group: { _id: '$sessionCode', averageScore: { $avg: '$score' }, evaluationCount: { $sum: 1 } } }
    ]);

    if (result.length === 0) {
      return res.status(200).json({ sessionCode, averageScore: 0, evaluationCount: 0 });
    }

    res.status(200).json({
      sessionCode,
      averageScore: result[0].averageScore,
      evaluationCount: result[0].evaluationCount
    });
  } catch (err) { next(err); }
}