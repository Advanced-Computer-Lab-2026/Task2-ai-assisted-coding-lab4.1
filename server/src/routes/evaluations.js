import express from 'express';
import {
  createEvaluation,
  getAllEvaluations,
  getEvaluation,
  getEvaluationSummary
} from '../controllers/evaluationController.js';

const router = express.Router();

router.get('/summary', getEvaluationSummary);
router.post('/', createEvaluation);
router.get('/', getAllEvaluations);
router.get('/:id', getEvaluation);

export default router;