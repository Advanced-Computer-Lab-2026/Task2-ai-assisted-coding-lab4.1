import { Router } from 'express';
import {
  getAllEvaluations,
  getEvaluation,
  createEvaluation,
  getEvaluationSummary
} from '../controllers/evaluationController.js';

const router = Router();

// TODO: wire up the three routes in README.md section 2 and the summary route in section 3.

router.get('/', getAllEvaluations);
router.post('/', createEvaluation);
 
// Must come before '/:id' so "summary" isn't captured as an id
router.get('/summary', getEvaluationSummary);
 
router.get('/:id', getEvaluation);

export default router;
