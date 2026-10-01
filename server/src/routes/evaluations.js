import { Router } from 'express';
import {
  createEvaluation,
  getAllEvaluations,
  getEvaluation,
  getEvaluationSummary,
} from '../controllers/evaluationController.js';

const router = Router();

router.post('/', createEvaluation);
router.get('/', getAllEvaluations);
// Must be declared before '/:id' so "summary" isn't treated as an id
router.get('/summary', getEvaluationSummary);
router.get('/:id', getEvaluation);

export default router;