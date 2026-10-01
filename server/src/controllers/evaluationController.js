import { Evaluation } from '../models/Evaluation.js';

// GET /api/evaluations
// TODO: implement per README.md section 2.
export async function getAllEvaluations(req, res, next) {
  try {
    const evaluations= await Evaluation.find().lean();
    res.json({Evaluations:evaluations.map(publicEvaluation)})
  } catch (err) { next(err); }
}

// GET /api/evaluations/:id
// TODO: implement per README.md section 2.
export async function getEvaluation(req, res, next) {
  try {
    const evaluation =await Evaluation.findById(req.params.id)
    res.json({Evaluation: publicEvaluation(evaluation)})
  } catch (err) { next(err); }
}

// POST /api/evaluations
// TODO: implement per README.md section 2.
export async function createEvaluation(req, res, next) {
  try {
    const { value, error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const evaluation = await Evaluation.create({ sessionCode: value.sessionCode, score: value.score, comment: value.comment, evaluatedBy: value.evaluatedBy });
    res.status(201).json({ evaluation: publicEvaluation(evaluation) });
  } catch (err) { next(err); }
}

// GET /api/evaluations/summary?sessionCode=SS101
// TODO: implement per README.md section 3.
export async function getEvaluationSummary(req, res, next) {
  const { sessionCode } = req.query;

  if (!sessionCode) {
    return res.status(400).json({ message: "sessionCode is required" });
  }

  try {
    const result = await Evaluation.aggregate([
      { $match: { sessionCode } },
      {
        $group: {
          _id: "$sessionCode",
          averageScore: { $avg: "$score" },
          evaluationCount: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.json({ sessionCode, averageScore: 0, evaluationCount: 0 });
    }

    res.json({
      sessionCode,
      averageScore: result[0].averageScore,
      evaluationCount: result[0].evaluationCount,
    });
  } catch (err) {
    next(err);
  }
}
