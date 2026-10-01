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

// IMPORTANT: summary must come before /:id
router.get('/summary', getEvaluationSummary);

// GET /api/evaluations/:id
router.get('/:id', getEvaluation);

export default router;