import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative flex justify-between items-center h-16 md:h-20">
          {/* Left: Logo */}
          <Link to="/" className="text-lg md:text-xl font-light tracking-wider text-gray-900 hover:text-gray-600 transition-colors z-10">
            STORE
          </Link>

          {/* Center: Main Navigation (Desktop) - Absolutely positioned */}
          <div className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light"
            >
              Products
            </Link>
            <Link
              to="/about"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light"
            >
              Contact
            </Link>
          </div>

          {/* Right: Cart & Auth (Desktop) */}
          <div className="hidden md:flex items-center gap-6 z-10">
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
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-gray-600 hover:text-gray-900 transition-colors focus:outline-none flex items-center"
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500 font-light">Signed in as</p>
                        <p className="text-sm text-gray-900 font-light truncate">{user.name}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-light transition-colors"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/my-orders"
                        onClick={() => setIsDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-light transition-colors"
                      >
                        My Orders
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setIsDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-light transition-colors"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-light transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
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
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light"
              >
                Products
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light"
              >
                Contact
              </Link>

              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light"
                  >
                    Profile ({user.name})
                  </Link>
                  <Link
                    to="/my-orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light"
                  >
                    My Orders
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-light"
                    >
                      Admin Dashboard
                    </Link>
                  )}
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
