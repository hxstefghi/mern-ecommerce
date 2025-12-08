import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-xl font-light tracking-wider mb-4 text-gray-900">STORE</h3>
            <p className="text-sm text-gray-500 font-light leading-relaxed">
              Quality products for modern living
            </p>
          </div>
          <div>
            <h4 className="text-sm font-light mb-4 text-gray-900 tracking-wide">SHOP</h4>
            <ul className="space-y-3 text-sm text-gray-500 font-light">
              <li>
                <Link to="/" className="hover:text-gray-900 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-gray-900 transition-colors">
                  Featured
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-gray-900 transition-colors">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-light mb-4 text-gray-900 tracking-wide">ACCOUNT</h4>
            <ul className="space-y-3 text-sm text-gray-500 font-light">
              <li>
                <Link to="/login" className="hover:text-gray-900 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-gray-900 transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-gray-900 transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-light mb-4 text-gray-900 tracking-wide">SUPPORT</h4>
            <ul className="space-y-3 text-sm text-gray-500 font-light">
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Shipping
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 mt-12 pt-8 text-center">
          <p className="text-xs text-gray-400 font-light tracking-wide">&copy; 2025 STORE. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
}
