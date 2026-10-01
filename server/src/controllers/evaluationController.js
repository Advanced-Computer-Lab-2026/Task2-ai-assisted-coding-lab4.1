import { Evaluation } from '../models/Evaluation.js';

// CREATE AN EVALUATION
export const createEvaluation = async (req, res, next) => {
  try {
    // req.body contains the JSON data sent by the user. 
    // Evaluation.create saves it to the database.
    const evaluation = await Evaluation.create(req.body);
    res.status(201).json({ evaluation }); // 201 means "Created successfully"
  } catch (err) {
    next(err); // If something goes wrong (like a missing score), forward it to the error handler.
  }
};

// GET ALL EVALUATIONS
export const getAllEvaluations = async (req, res, next) => {
  try {
    // Evaluation.find() gets every single evaluation in the database
    const evaluations = await Evaluation.find();
    res.status(200).json({ evaluations }); // 200 means "OK"
  } catch (err) {
    next(err);
  }
};

// GET ONE EVALUATION BY ITS ID
export const getEvaluation = async (req, res, next) => {
  try {
    // We look up the evaluation by the ID provided in the URL (req.params.id)
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }
    res.status(200).json({ evaluation });
  } catch (err) {
    next(err);
  }
};

// GET A SUMMARY OF A SPECIFIC SESSION (Calculates the average)
export const getEvaluationSummary = async (req, res, next) => {
  try {
    const { sessionCode } = req.query; // Extracts ?sessionCode=... from the URL
    
    if (!sessionCode) {
      return res.status(400).json({ message: 'sessionCode is required' });
    }

    // 1. MongoDB Aggregation: This is an advanced query that calculates math on the database server.
    const summary = await Evaluation.aggregate([
      // Step A: Find all evaluations that match the requested sessionCode
      { $match: { sessionCode } }, 
      // Step B: Group them all together (since _id is null), and calculate the math
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$score' }, // Averages the 'score' field
          evaluationCount: { $sum: 1 },     // Adds +1 for every evaluation found
        },
      },
    ]);

    // 2. If the aggregation comes back empty, it means nobody has rated this session yet.
    // So we return zeros.
    if (summary.length === 0) {
      return res.status(200).json({
        sessionCode,
        averageScore: 0,
        evaluationCount: 0,
      });
    }

    // 3. If ratings exist, return the calculated average and count!
    res.status(200).json({
      sessionCode,
      averageScore: summary[0].averageScore,
      evaluationCount: summary[0].evaluationCount,
    });
  } catch (err) {
    next(err);
  }
};