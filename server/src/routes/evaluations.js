import express from 'express';
import {
  createEvaluation,
  getAllEvaluations,
  getEvaluation,
  getEvaluationSummary,
} from '../controllers/evaluationController.js';

const router = express.Router();

// The /summary route MUST be defined at the very top. 
// If it was at the bottom, Express would think the word "summary" is actually an ID!
router.get('/summary', getEvaluationSummary);

// Map the HTTP methods (POST, GET) and URLs to their matching brain functions
router.post('/', createEvaluation);
router.get('/', getAllEvaluations);
router.get('/:id', getEvaluation);

export default router;