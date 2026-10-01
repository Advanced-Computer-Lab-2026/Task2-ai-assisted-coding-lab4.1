import { Evaluation } from "../models/Evaluation.js";
import mongoose from "mongoose";

// GET /api/evaluations
export async function getAllEvaluations(req, res, next) {
  try {
    const evaluations = await Evaluation.find();

    res.status(200).json({
      evaluations,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/evaluations/:id
export async function getEvaluation(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        message: "Evaluation not found",
      });
    }

    const evaluation = await Evaluation.findById(id);

    if (!evaluation) {
      return res.status(404).json({
        message: "Evaluation not found",
      });
    }

    res.status(200).json({
      evaluation,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/evaluations
export async function createEvaluation(req, res, next) {
  try {
    const evaluation = await Evaluation.create(req.body);

    res.status(201).json({
      evaluation,
    });
  } catch (err) {
    next(err);
  }
}
