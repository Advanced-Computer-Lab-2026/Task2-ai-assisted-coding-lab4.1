import { Router } from 'express';
import {
  getAllEvaluations,
  getEvaluation,
  createEvaluation,
  getEvaluationSummary
} from '../controllers/evaluationController.js';

const router = Router();

// TODO: wire up the three routes in README.md section 2 and the summary route in section 3.
router.post('/', createEvaluation);
router.get('/', getAllEvaluations);

// CRITICAL: /summary must come BEFORE /:id, otherwise Express will treat "summary" as an ID
router.get('/summary', getEvaluationSummary);

// Single item route
router.get('/:id', getEvaluation);
export default router;
