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

// IMPORTANT: summary must come before /:id
router.get('/summary', getEvaluationSummary);

router.get('/:id', getEvaluation);

export default router;