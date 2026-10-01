import { Evaluation } from '../models/Evaluation.js';

export async function createEvaluation(req, res, next) {
  try {
    const evaluation = new Evaluation(req.body);
    await evaluation.save();
    res.status(201).json({ evaluation }); // Returns 201 with nested object
  } catch (err) { next(err); }
}

export async function getAllEvaluations(req, res, next) {
  try {
    const evaluations = await Evaluation.find();
    res.status(200).json({ evaluations });
  } catch (err) { next(err); }
}

export async function getEvaluation(req, res, next) {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) return res.status(404).json({ message: 'Evaluation not found' }); // Handles invalid IDs[cite: 20]
    res.status(200).json({ evaluation });
  } catch (err) { next(err); }
}

export async function getEvaluationSummary(req, res, next) {
  try {
    const { sessionCode } = req.query;
    
    // Validates the presence of the query parameter[cite: 20]
    if (!sessionCode) {
      return res.status(400).json({ message: 'sessionCode is required' });
    }

    // Uses MongoDB aggregation framework instead of standard find()[cite: 20]
    const result = await Evaluation.aggregate([
      { $match: { sessionCode: sessionCode } },
      { $group: {
          _id: null,
          averageScore: { $avg: '$score' },
          evaluationCount: { $sum: 1 }
      }}
    ]);

    // Handles the edge case where no evaluations exist for the session[cite: 20]
    if (result.length === 0) {
      return res.status(200).json({
        sessionCode: sessionCode,
        averageScore: 0,
        evaluationCount: 0
      });
    }

    res.status(200).json({
      sessionCode: sessionCode,
      averageScore: result[0].averageScore,
      evaluationCount: result[0].evaluationCount
    });
  } catch (err) { next(err); }
}