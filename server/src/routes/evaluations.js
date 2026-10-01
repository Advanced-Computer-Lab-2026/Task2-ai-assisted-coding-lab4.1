import { Router } from "express";

import {
  getAllEvaluations,
  getEvaluation,
  createEvaluation,
} from "../controllers/evaluationController.js";

const router = Router();

router.post("/", createEvaluation);

router.get("/", getAllEvaluations);

router.get("/:id", getEvaluation);

export default router;
