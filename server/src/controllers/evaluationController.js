import { Evaluation } from '../models/Evaluation.js';
import Joi from 'joi';

const createSchema = Joi.object({
  sessionCode: Joi.string().required(),
  score: Joi.number().required(),
  comment: Joi.string(),
  evaluatedBy: Joi.string().required()
});


function publicSession(session) {
  return { id: session._id.toString(), sessionCode: session.sessionCode, score: session.score, comment: session.comment, evaluatedBy: session.evaluatedBy };
}
// GET /api/evaluations
// TODO: implement per README.md section 2.
export async function getAllEvaluations(req, res, next) {
  try {
        const evaluations = await Evaluation.find().sort({ createdAt: -1 }).lean();
        res.json({ evaluations: evaluations.map(publicSession) });
  } catch (err) { next(err); }
}

// GET /api/evaluations/:id
// TODO: implement per README.md section 2.
export async function getEvaluation(req, res, next) {
  try {
    const evaluation = await Evaluation.findById(req.params.id).lean();
    if (!evaluation) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }
    res.json(publicSession(evaluation));
  } catch (err) { next(err); }
}

// POST /api/evaluations
// TODO: implement per README.md section 2.
export async function createEvaluation(req, res, next) {
  try {
    const { error } = createSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const evaluation = new Evaluation(req.body);
    await evaluation.save();
    res.status(201).json(publicSession(evaluation));
  } catch (err) { next(err); }
}

// GET /api/evaluations/summary?sessionCode=SS101
// TODO: implement per README.md section 3.
export async function getEvaluationSummary(req, res, next) {
  try {
    const { sessionCode } = req.query;
    if (!sessionCode) {
      return res.status(400).json({ error: 'sessionCode query parameter is required' });
    }

    const evaluations = await Evaluation.find({ sessionCode });
    const evaluationCount = evaluations.length;
    const averageScore = evaluationCount
      ? evaluations.reduce((sum, e) => sum + e.score, 0) / evaluationCount
      : 0;

    res.json({ sessionCode, count: evaluationCount, averageScore });
  } catch (err) { next(err); }
}
