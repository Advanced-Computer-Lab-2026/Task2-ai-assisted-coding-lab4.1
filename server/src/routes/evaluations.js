import { Router } from 'express';
import {
  getAllEvaluations,
  getEvaluation,
  createEvaluation,
  getEvaluationSummary
} from '../controllers/evaluationController.js';

const router = Router();

// Summary must come before /:id so "summary" is not treated as an id
router.get('/summary', getEvaluationSummary);

router.get('/', getAllEvaluations);
router.get('/:id', getEvaluation);
router.post('/', createEvaluation);

export default router;
