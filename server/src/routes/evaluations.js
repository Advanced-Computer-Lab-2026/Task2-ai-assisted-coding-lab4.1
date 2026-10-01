import express from 'express';
import { 
  getAllEvaluations, 
  getEvaluation, 
  createEvaluation, 
  getEvaluationSummary 
} from '../controllers/evaluationController.js';

const router = express.Router();

// CRITICAL: /summary must come BEFORE /:id
// If it goes after, Express will think "summary" is an :id parameter.
router.get('/summary', getEvaluationSummary);

router.post('/', createEvaluation);
router.get('/', getAllEvaluations);
router.get('/:id', getEvaluation);

export default router;