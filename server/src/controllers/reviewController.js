import { Review } from '../models/Review.js';

// GET /api/reviews
export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find();
    res.status(200).json({ reviews });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/:id
export async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.status(200).json({ review });
  } catch (err) {
    next(err);
  }
}

// POST /api/reviews
export async function createReview(req, res, next) {
  try {
    const { facilityCode, rating, comment, reviewedBy } = req.body;

    if (!facilityCode || rating === undefined) {
      return res
        .status(400)
        .json({ message: 'facilityCode and rating are required' });
    }

    const review = await Review.create({
      facilityCode,
      rating,
      comment,
      reviewedBy
    });

    res.status(201).json({ review });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/summary?facilityCode=FC101
export async function getReviewSummary(req, res, next) {
  try {
    const { facilityCode } = req.query;

    if (!facilityCode) {
      return res.status(400).json({ message: 'facilityCode is required' });
    }

    const result = await Review.aggregate([
      {
        $match: { facilityCode }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) {
      return res.status(200).json({
        facilityCode,
        averageRating: 0,
        reviewCount: 0
      });
    }

    res.status(200).json({
      facilityCode,
      averageRating: result[0].averageRating,
      reviewCount: result[0].reviewCount
    });
  } catch (err) {
    next(err);
  }
}