import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Heart, ShoppingCart, ArrowLeft, Trash2, Edit2, Check, X } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useProduct } from "../context/ProductContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const { addToCart } = useProduct();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // New review form
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Editing review
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
      document.title = `Cartora | ${res.data.name}`;
    } catch (err) {
      setError(err.response?.data?.message || "Product is no longer available.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      const res = await api.get(`/reviews/product/${id}`);
      setReviews(res.data.reviews || []);
      setReviewCount(res.data.reviewCount || 0);
      setAverageRating(res.data.averageRating || 0);
    } catch (err) {
      console.error("Error loading reviews", err);
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [fetchProduct, fetchReviews]);

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    addToCart(product, quantity);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to submit a review.");
      return;
    }
    if (!newComment.trim()) {
      toast.error("Please enter a review comment.");
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await api.post(`/reviews/product/${id}`, {
        rating: newRating,
        comment: newComment.trim(),
      });
      toast.success(res.data.message || "Review added successfully.");
      setNewComment("");
      setNewRating(5);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleStartEdit = (rev) => {
    setEditingReviewId(rev._id);
    setEditRating(rev.rating);
    setEditComment(rev.comment);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditRating(5);
    setEditComment("");
  };

  const handleSaveEdit = async (reviewId) => {
    if (!editComment.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }
    try {
      await api.put(`/reviews/${reviewId}`, {
        rating: editRating,
        comment: editComment.trim(),
      });
      toast.success("Review updated successfully.");
      setEditingReviewId(null);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to update review.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success("Review deleted successfully.");
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to delete review.");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 h-5 w-24 animate-pulse rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="h-96 w-full animate-pulse rounded-3xl bg-gray-200" />
          <div className="space-y-4">
            <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
            <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
            <div className="h-24 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-12 w-48 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-lg font-medium text-gray-900">{error || "Product is no longer available."}</p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <ArrowLeft size={16} />
          Back to Products
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const inWishlist = isInWishlist(product._id);
  const userHasReviewed = user && reviews.some((r) => r.user?._id === user._id || r.user === user._id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-950"
      >
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      {/* Main product presentation */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-14">
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 shadow-sm">
          <img
            src={product.image}
            alt={product.name}
            className="h-full max-h-[520px] w-full object-cover"
          />

          {/* Stock Badge */}
          <div className="absolute left-4 top-4">
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-md ${
                isOutOfStock
                  ? "bg-red-50/95 text-red-600 border border-red-200"
                  : isLowStock
                    ? "bg-amber-50/95 text-amber-700 border border-amber-200"
                    : "bg-emerald-50/95 text-emerald-700 border border-emerald-200"
              }`}
            >
              {isOutOfStock ? "Out of stock" : isLowStock ? `Only ${product.stock} left` : "In stock"}
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product)}
            title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-md transition-all duration-200 ${
              inWishlist
                ? "border-rose-200 bg-white text-rose-500 shadow"
                : "border-gray-200/80 bg-white/90 text-gray-600 hover:text-gray-950 hover:scale-105"
            }`}
          >
            <Heart size={18} className={inWishlist ? "fill-rose-500" : ""} />
          </button>
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            {product.category && (
              <span className="inline-block text-xs font-semibold tracking-wider text-gray-400 uppercase">
                {product.category}
              </span>
            )}

            <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
              {product.name}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-3">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={
                      star <= Math.round(averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {averageRating > 0 ? averageRating.toFixed(1) : "No ratings yet"}
              </span>
              <span className="text-sm text-gray-400">
                ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
              </span>
            </div>

            {/* Price */}
            <div className="pt-2">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-medium">Price</p>
              <p className="text-3xl font-extrabold text-gray-950">₹{product.price}</p>
            </div>

            {/* Description */}
            <div className="pt-2">
              <h3 className="text-xs uppercase tracking-wider text-gray-400 font-medium">About this item</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                {product.description}
              </p>
            </div>
          </div>

          {/* Actions: Quantity + Add to Cart */}
          <div className="mt-8 space-y-4 border-t border-gray-100 pt-6">
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">Quantity</span>
                <div className="flex items-center rounded-xl border border-gray-200">
                  <button
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-9 w-9 items-center justify-center text-gray-500 hover:text-gray-950 disabled:opacity-30 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-medium text-gray-900">
                    {quantity}
                  </span>
                  <button
                    disabled={quantity >= product.stock}
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="flex h-9 w-9 items-center justify-center text-gray-500 hover:text-gray-950 disabled:opacity-30 cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  {product.stock} available
                </span>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-medium transition duration-200 ${
                  isOutOfStock
                    ? "cursor-not-allowed bg-gray-100 text-gray-400 border border-gray-200"
                    : "bg-gray-950 text-white hover:bg-gray-800 active:scale-[0.99] cursor-pointer"
                }`}
              >
                <ShoppingCart size={18} />
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`flex items-center justify-center gap-2 rounded-xl border px-5 py-3.5 text-sm font-medium transition duration-200 cursor-pointer ${
                  inWishlist
                    ? "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Heart size={18} className={inWishlist ? "fill-rose-600" : ""} />
                {inWishlist ? "In Wishlist" : "Wishlist"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================= */}
      {/* REVIEWS & RATINGS */}
      {/* ======================= */}
      <section className="mt-16 border-t border-gray-200 pt-10">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-950">Customer Reviews</h2>
            <p className="mt-1 text-sm text-gray-500">
              {reviewCount > 0
                ? `Rated ${averageRating.toFixed(1)} out of 5 across ${reviewCount} reviews`
                : "No reviews yet. Be the first to review!"}
            </p>
          </div>
        </div>

        {/* Add Review Form */}
        {user ? (
          !userHasReviewed ? (
            <div className="mb-10 rounded-2xl border border-gray-200 bg-gray-50/50 p-5 sm:p-6">
              <h3 className="text-base font-semibold text-gray-900">Leave a Review</h3>
              <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-medium">Rating</label>
                  <div className="mt-1 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 focus:outline-none cursor-pointer"
                      >
                        <Star
                          size={22}
                          className={
                            star <= newRating
                              ? "fill-amber-400 text-amber-400 transition hover:scale-110"
                              : "text-gray-300 transition hover:scale-110"
                          }
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-medium text-gray-600">{newRating} / 5</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="comment" className="block text-xs uppercase tracking-wider text-gray-400 font-medium">
                    Review
                  </label>
                  <textarea
                    id="comment"
                    rows={3}
                    placeholder="Share your experience with this product..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-900 outline-none transition focus:border-gray-950"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="rounded-xl bg-gray-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50 cursor-pointer"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          ) : null
        ) : (
          <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
            Please{" "}
            <Link to="/login" className="font-semibold text-gray-950 underline">
              log in
            </Link>{" "}
            to leave a review.
          </div>
        )}

        {/* Reviews List */}
        {reviewsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-24 w-full animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center text-sm text-gray-500">
            No reviews yet.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => {
              const isOwner = user && (rev.user?._id === user._id || rev.user === user._id);
              const isAdmin = user && user.role === "admin";
              const isEditing = editingReviewId === rev._id;

              return (
                <div
                  key={rev._id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition hover:border-gray-300"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setEditRating(star)}
                            className="p-1 cursor-pointer"
                          >
                            <Star
                              size={18}
                              className={
                                star <= editRating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300"
                              }
                            />
                          </button>
                        ))}
                      </div>
                      <textarea
                        rows={2}
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 p-2.5 text-sm outline-none focus:border-gray-950"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveEdit(rev._id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-gray-950 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 cursor-pointer"
                        >
                          <Check size={14} /> Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
                        >
                          <X size={14} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-sm text-gray-900">
                            {rev.user?.username || "Verified Customer"}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {(isOwner || isAdmin) && (
                          <div className="flex items-center gap-2">
                            {isOwner && (
                              <button
                                onClick={() => handleStartEdit(rev)}
                                title="Edit review"
                                className="text-gray-400 hover:text-gray-900 cursor-pointer"
                              >
                                <Edit2 size={15} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteReview(rev._id)}
                              title="Delete review"
                              className="text-gray-400 hover:text-red-600 cursor-pointer"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Stars */}
                      <div className="mt-1 flex items-center gap-0.5 text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={
                              star <= rev.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>

                      {/* Comment text */}
                      <p className="mt-2 text-sm leading-relaxed text-gray-700">
                        {rev.comment}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
export default ProductDetailsPage;
