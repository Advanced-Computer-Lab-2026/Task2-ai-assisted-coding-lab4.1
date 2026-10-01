import { Router } from 'express';

import {
  createEvaluation,
  getAllEvaluations,
  getEvaluation,
  getEvaluationSummary
} from '../controllers/evaluationController.js';

const router = Router();


// POST /api/evaluations
router.post('/', createEvaluation);


// GET /api/evaluations
router.get('/', getAllEvaluations);


// GET /api/evaluations/summary?sessionCode=SS101
router.get('/summary', getEvaluationSummary);


// GET /api/evaluations/:id
router.get('/:id', getEvaluation);


export default router;