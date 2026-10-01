import { Router } from 'express';

import {
  getAllEvaluations,
  getEvaluation,
  createEvaluation,
  getEvaluationSummary
} from '../controllers/evaluationController.js';

const router = Router();

// POST /api/evaluations
router.post('/', createEvaluation);

// GET /api/evaluations
router.get('/', getAllEvaluations);

// GET /api/evaluations/:id
router.get('/:id', getEvaluation);

// GET /api/evaluations/summary
router.get('/summary', getEvaluationSummary);

export default router;