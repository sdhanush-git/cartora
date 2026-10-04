import ReviewModel from "../models/ReviewModel.js";
import ProductModel from "../models/ProductModel.js";

// GET /api/reviews/product/:productId
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await ReviewModel.find({ product: productId })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    const reviewCount = reviews.length;
    const averageRating =
      reviewCount > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1))
        : 0;

    res.json({
      reviews,
      reviewCount,
      averageRating,
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to load reviews." });
  }
};

// POST /api/reviews/product/:productId
export const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ message: "Comment is required." });
    }

    const product = await ProductModel.findById(productId);
    if (!product || product.isActive === false) {
      return res.status(404).json({ message: "Product is no longer available." });
    }

    // Check if user already reviewed this product
    const existingReview = await ReviewModel.findOne({
      product: productId,
      user: req.user.id,
    });

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product." });
    }

    const review = await ReviewModel.create({
      product: productId,
      user: req.user.id,
      rating: numRating,
      comment: comment.trim(),
    });

    const populated = await ReviewModel.findById(review._id).populate("user", "username");

    res.status(201).json({
      message: "Review added successfully.",
      review: populated,
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to submit review." });
  }
};

// PUT /api/reviews/:id
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await ReviewModel.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    // Verify ownership
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied. You cannot edit this review." });
    }

    if (rating !== undefined) {
      const numRating = Number(rating);
      if (!numRating || numRating < 1 || numRating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5." });
      }
      review.rating = numRating;
    }

    if (comment !== undefined) {
      if (!comment.trim()) {
        return res.status(400).json({ message: "Comment cannot be empty." });
      }
      review.comment = comment.trim();
    }

    await review.save();
    const populated = await ReviewModel.findById(review._id).populate("user", "username");

    res.json({ message: "Review updated successfully.", review: populated });
  } catch (error) {
    res.status(500).json({ message: "Unable to update review." });
  }
};

// DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    const review = await ReviewModel.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    // Owner or admin can delete
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied." });
    }

    await ReviewModel.findByIdAndDelete(req.params.id);

    res.json({ message: "Review deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete review." });
  }
};
