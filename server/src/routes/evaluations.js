
import express from 'express';

import {
  getAllEvaluations,
  getEvaluation,
  createEvaluation,
  getEvaluationSummary,
} from '../controllers/evaluationController.js';

const router = express.Router();

// IMPORTANT: summary must come before /:id
router.get('/summary', getEvaluationSummary);

router.get('/', getAllEvaluations);

router.get('/:id', getEvaluation);

router.post('/', createEvaluation);

export default router;

