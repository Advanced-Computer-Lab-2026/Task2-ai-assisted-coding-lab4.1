const express = require('express');

const {
  createEvaluation,
  getAllEvaluations,
  getEvaluation,
  getEvaluationSummary,
} = require('../controllers/evaluationController');

const router = express.Router();

router.post('/', createEvaluation);

router.get('/', getAllEvaluations);

router.get('/summary', getEvaluationSummary);

router.get('/:id', getEvaluation);

module.exports = router;