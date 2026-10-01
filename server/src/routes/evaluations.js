import { Router } from 'express';
import {
  getAllEvaluations,
  getEvaluation,
  createEvaluation,
  getEvaluationSummary
} from '../controllers/evaluationController.js';

const router = Router();

// TODO: wire up the three routes in README.md section 2 and the summary route in section 3.
// POST	/api/evaluations	createEvaluation	201 { evaluation: <document> }
// GET	/api/evaluations	getAllEvaluations	200 { evaluations: [...] }
// GET	/api/evaluations/:id	getEvaluation	200 { evaluation: <document> }

router.post('/', createEvaluation);
router.get('/', getAllEvaluations);
router.get('/summary', getEvaluationSummary);
router.get('/:id', getEvaluation);




export default router;
