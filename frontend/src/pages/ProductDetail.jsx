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

  const handleAddToCart = () => {
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border border-gray-200 border-t-gray-900"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-light mb-4 text-gray-900">Product not found</h2>
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-900">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link to="/products" className="text-sm text-gray-500 hover:text-gray-900 mb-8 inline-block font-light">
          ← Back
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-8">
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full aspect-square object-cover bg-gray-50"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-light mb-4 text-gray-900">{product.name}</h1>
            <p className="text-xl font-light text-gray-900 mb-8">
              ${product.price.toFixed(2)}
            </p>

            <div className="mb-8">
              <h3 className="text-xs text-gray-500 mb-3 font-light tracking-wide">DESCRIPTION</h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                {product.description || "A carefully curated product for modern living."}
              </p>
            </div>

            <div className="mb-8">
              <span className="inline-block text-xs text-gray-500 font-light tracking-wide">
                IN STOCK
              </span>
            </div>

            <div className="flex items-center gap-6 mb-12">
              <span className="text-xs text-gray-500 font-light tracking-wide">QUANTITY</span>
              <div className="flex items-center border border-gray-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 hover:bg-gray-50 transition-colors text-sm"
                >
                  -
                </button>
                <span className="w-12 h-10 flex items-center justify-center text-sm font-light border-l border-r border-gray-200">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 hover:bg-gray-50 transition-colors text-sm"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-gray-900 text-white py-4 hover:bg-gray-800 transition-colors text-sm font-light tracking-wide"
            >
              ADD TO CART
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl font-light">REVIEWS</h2>
            {product.numReviews > 0 && (
              <span className="text-sm text-gray-500 font-light">
                {product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'} • ★ {product.rating?.toFixed(1)}
              </span>
            )}
          </div>

          {/* Review Form */}
          {user ? (
            !product.reviews?.some((review) => review.user === user._id) ? (
              <div className="mb-12 p-8 border border-gray-200 bg-gray-50">
                <h3 className="text-sm font-light mb-6 tracking-wide">WRITE A REVIEW</h3>
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div>
                    <label className="block text-xs text-gray-500 mb-2 font-light tracking-wide">RATING</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full border border-gray-300 px-4 py-3 font-light text-sm focus:outline-none focus:border-gray-400"
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Good</option>
                      <option value={3}>3 - Average</option>
                      <option value={2}>2 - Poor</option>
                      <option value={1}>1 - Terrible</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-2 font-light tracking-wide">COMMENT</label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 px-4 py-3 font-light text-sm focus:outline-none focus:border-gray-400"
                      placeholder="Share your thoughts about this product..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 bg-gray-900 text-white font-light text-sm tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="mb-12 p-8 border border-gray-200 bg-gray-50">
                <p className="text-gray-600 font-light text-sm">You have already reviewed this product.</p>
              </div>
            )
          ) : (
            <div className="mb-12 p-8 border border-gray-200 bg-gray-50">
              <p className="text-gray-600 font-light text-sm">
                Please{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="underline hover:text-gray-900"
                >
                  login
                </button>{' '}
                to leave a review.
              </p>
            </div>
          )}

          {/* Reviews List */}
          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-8">
              {product.reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-200 pb-8 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-sm font-light">{review.name}</span>
                      <div className="text-yellow-500 text-sm mt-1">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-light">
                      {new Date(review.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-light leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 font-light text-sm">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </div>
    </div>
  );
}
