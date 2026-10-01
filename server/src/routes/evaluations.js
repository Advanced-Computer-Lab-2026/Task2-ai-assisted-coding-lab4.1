import { Router } from 'express';
import {
  getAllEvaluations,
  getEvaluation,
  createEvaluation,
  getEvaluationSummary
} from '../controllers/evaluationController.js';

const router = Router();

router.get('/', getAllEvaluations);
router.post('/', createEvaluation);
router.get('/summary', getEvaluationSummary); // Must be defined before /:id
router.get('/:id', getEvaluation);

export default router;