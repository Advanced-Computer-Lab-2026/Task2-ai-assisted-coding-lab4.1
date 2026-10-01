import express from 'express';
import {
  createEvaluation,
  getAllEvaluations,
  getEvaluation,
  getEvaluationSummary,
} from '../controllers/evaluationController.js';

const router = express.Router();

// summary must be before :id
router.get('/summary', getEvaluationSummary);

router.route('/')
  .get(getAllEvaluations)
  .post(createEvaluation);

router.get('/:id', getEvaluation);

export default router;
