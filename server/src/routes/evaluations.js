import { Router } from 'express';

import {
  getAllEvaluations,
  getEvaluation,
  createEvaluation,
  getEvaluationSummary
} from '../controllers/evaluationController.js';

const router = Router();

// GET /api/evaluations/summary?sessionCode=SS101
router.get('/summary', getEvaluationSummary);

// GET /api/evaluations
router.get('/', getAllEvaluations);

// GET /api/evaluations/:id
router.get('/:id', getEvaluation);

// POST /api/evaluations
router.post('/', createEvaluation);

export default router;