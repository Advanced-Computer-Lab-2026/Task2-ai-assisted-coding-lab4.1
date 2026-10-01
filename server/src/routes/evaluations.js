import express from 'express';
import {
  createEvaluation,
  getAllEvaluations,
  getEvaluationSummary,
  getEvaluation,
} from '../controllers/evaluationController.js';

const router = express.Router();

router.post('/', createEvaluation);
router.get('/', getAllEvaluations);
router.get('/summary', getEvaluationSummary);
router.get('/:id', getEvaluation);

export default router;