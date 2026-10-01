import { Router } from 'express';
import {
  getAllEvaluations,
  getEvaluation,
  createEvaluation,
  getEvaluationSummary
} from '../controllers/evaluationController.js';

const router = Router();

router.get('/', getAllEvaluations);
router.get('/summary', getEvaluationSummary); // must come before '/:id'
router.get('/:id', getEvaluation);
router.post('/', createEvaluation);

export default router;