import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../lib/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all'); // all, 5, 4, 3, 2, 1
  const { addToCart } = useCart();

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (product?.name) {
      document.title = `${product.name}`;
    }
  }, [product]);

  const isOutOfStock = !product?.stock || product.stock === 0;
  const hasInsufficientStock = product?.stock && quantity > product.stock;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error('This product is out of stock');
      return;
    }
    if (hasInsufficientStock) {
      toast.error(`Only ${product.stock} items available in stock`);
      return;
    }
    addToCart(product, quantity);
    toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart!`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to leave a review');
      navigate('/login');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      setSubmitting(true);
      await api.post(`/products/${id}/reviews`, { rating, comment });
      toast.success('Review submitted successfully');
      setComment('');
      setRating(5);
      fetchProduct();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border border-gray-200 dark:border-gray-800 border-t-gray-900 dark:border-t-gray-100"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-light mb-4 text-gray-900 dark:text-gray-100">Product not found</h2>
          <Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link to="/products" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-8 inline-block font-light">
          ← Back
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-8">
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full aspect-square object-cover bg-gray-50 dark:bg-gray-900"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-light mb-4 text-gray-900 dark:text-gray-100">{product.name}</h1>
            <p className="text-xl font-light text-gray-900 dark:text-gray-100 mb-8">
              ₱{product.price.toFixed(2)}
            </p>

            <div className="mb-8">
              <h3 className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-light tracking-wide">DESCRIPTION</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                {product.description || "A carefully curated product for modern living."}
              </p>
            </div>

            {/* Stock Information */}
            <div className="mb-8">
              <h3 className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-light tracking-wide">AVAILABILITY</h3>
              {isOutOfStock ? (
                <div className="flex items-center gap-2">
                  <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-light">
                    OUT OF STOCK
                  </span>
                </div>
              ) : product.stock <= 5 ? (
                <div className="flex items-center gap-2">
                  <span className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-light">
                    ONLY {product.stock} LEFT IN STOCK
                  </span>
                </div>
              ) : (
                <span className="inline-block text-sm text-green-600 dark:text-green-400 font-light">
                  {product.stock} items available
                </span>
              )}
            </div>

            <div className="flex items-center gap-6 mb-12">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-light tracking-wide">QUANTITY</span>
              <div className="flex items-center border border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isOutOfStock}
                  className="w-10 h-10 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="w-12 h-10 flex items-center justify-center text-sm font-light border-l border-r border-gray-200 dark:border-gray-800 dark:text-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                  disabled={isOutOfStock}
                  className="w-10 h-10 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
              {hasInsufficientStock && (
                <span className="text-xs text-orange-600 dark:text-orange-400 font-light">
                  Only {product.stock} available
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full py-4 transition-colors text-sm font-light tracking-wide ${
                isOutOfStock
                  ? 'bg-gray-400 dark:bg-gray-700 text-gray-200 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200'
              }`}
            >
              ADD TO CART
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 pt-16 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-light dark:text-gray-100">REVIEWS</h2>
              {product.numReviews > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400 font-light">
                  {product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'} • ★ {product.rating?.toFixed(1)}
                </span>
              )}
            </div>
            
            {/* Review Filter */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-light tracking-wide">FILTER:</span>
                <select
                  value={reviewFilter}
                  onChange={(e) => setReviewFilter(e.target.value)}
                  className="border border-gray-200 dark:border-gray-800 px-3 py-2 text-sm font-light focus:outline-none focus:border-gray-900 dark:focus:border-gray-100 bg-white dark:bg-gray-900 dark:text-gray-300"
                >
                  <option value="all">All Reviews</option>
                  <option value="5">★★★★★ (5 stars)</option>
                  <option value="4">★★★★☆ (4 stars)</option>
                  <option value="3">★★★☆☆ (3 stars)</option>
                  <option value="2">★★☆☆☆ (2 stars)</option>
                  <option value="1">★☆☆☆☆ (1 star)</option>
                </select>
              </div>
            )}
          </div>

          {/* Review Form */}
          {user ? (
            !product.reviews?.some((review) => review.user === user._id) ? (
              <div className="mb-12 p-8 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <h3 className="text-sm font-light mb-6 tracking-wide dark:text-gray-100">WRITE A REVIEW</h3>
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2 font-light tracking-wide">RATING</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full border border-gray-300 dark:border-gray-700 px-4 py-3 font-light text-sm focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 bg-white dark:bg-gray-800 dark:text-gray-300"
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Good</option>
                      <option value={3}>3 - Average</option>
                      <option value={2}>2 - Poor</option>
                      <option value={1}>1 - Terrible</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2 font-light tracking-wide">COMMENT</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 dark:border-gray-700 px-4 py-3 font-light text-sm focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 bg-white dark:bg-gray-800 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="Share your thoughts about this product..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-light text-sm tracking-wide hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="mb-12 p-8 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-600 dark:text-gray-300 font-light text-sm">You have already reviewed this product.</p>
              </div>
            )
          ) : (
            <div className="mb-12 p-8 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <p className="text-gray-600 dark:text-gray-300 font-light text-sm">
                Please{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="underline hover:text-gray-900 dark:hover:text-gray-100 dark:text-gray-300"
                >
                  login
                </button>{' '}
                to leave a review.
              </p>
            </div>
          )}

          {/* Reviews List */}
          {product.reviews && product.reviews.length > 0 ? (
            (() => {
              const filteredReviews = product.reviews.filter(review => 
                reviewFilter === 'all' || review.rating === parseInt(reviewFilter)
              );
              
              return filteredReviews.length > 0 ? (
                <div className="space-y-8">
                  {filteredReviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-gray-800 pb-8 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <span className="text-sm font-light dark:text-gray-300">{review.name}</span>
                          <div className="text-yellow-500 dark:text-yellow-400 text-sm mt-1">
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400 dark:text-gray-500 font-light">
                            {new Date(review.createdAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </span>
                          {user?.role === 'admin' && (
                            <button
                              onClick={async () => {
                                if (confirm('Are you sure you want to delete this review?')) {
                                  try {
                                    await api.delete(`/products/${product._id}/reviews/${review._id}`);
                                    toast.success('Review deleted successfully');
                                    fetchProduct();
                                } catch {
                                    toast.error('Failed to delete review');
                                  }
                                }
                              }}
                              className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-light"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-light leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 dark:text-gray-500 font-light text-sm">No reviews match this filter.</p>
              );
            })()
          ) : (
            <p className="text-gray-400 dark:text-gray-500 font-light text-sm">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </div>
    </div>
  );
}
