import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link to="/" className="text-lg md:text-xl font-light tracking-wider text-gray-900 hover:text-gray-600 transition-colors">
            STORE
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light"
            >
              Products
            </Link>

            <Link
              to="/cart"
              className="relative text-sm text-gray-600 hover:text-gray-900 transition-colors font-light flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-gray-900 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-light">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-6">
                <span className="text-sm text-gray-600 font-light">
                  {user.name}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm bg-gray-900 text-white px-6 py-2 hover:bg-gray-800 transition-colors font-light"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-4">
            <Link to="/cart" className="relative">
              <svg
                className="w-5 h-5 text-gray-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-gray-900 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-light">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light"
              >
                Products
              </Link>

              {user ? (
                <>
                  <span className="text-sm text-gray-600 font-light">
                    {user.name}
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm bg-gray-900 text-white px-6 py-2 hover:bg-gray-800 transition-colors font-light text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
