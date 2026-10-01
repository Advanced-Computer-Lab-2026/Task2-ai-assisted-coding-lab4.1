import { Router } from 'express';
import {
  getAllEvaluations,
  getEvaluation,
  createEvaluation,
  getEvaluationSummary
} from '../controllers/evaluationController.js';

const router = Router();

// TODO: wire up the three routes in README.md section 2 and the summary route
// router.post('/', createEvaluation);
router.post('/', createEvaluation);
router.get('/', getAllEvaluations);
router.get('/summary', getEvaluationSummary);
router.get('/:id', getEvaluation);

export default router;
