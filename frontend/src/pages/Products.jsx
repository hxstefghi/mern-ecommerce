import { useEffect, useState, useMemo } from "react";
import api from "../lib/api";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedRating, setSelectedRating] = useState('all');
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Rating filter
    if (selectedRating !== 'all') {
      filtered = filtered.filter((p) => p.rating >= selectedRating);
    }

    // Sort
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [searchQuery, priceRange, selectedRating, sortBy, products]);

  const resetFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 500]);
    setSelectedRating('all');
    setSortBy("default");
  };

  return (
    <div>
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="mb-8 sm:mb-12 flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-light text-gray-900 mb-2 dark:text-white">
                All Products
              </h1>
              <p className="text-sm text-gray-500 font-light dark:text-gray-300">
                {filteredProducts.length} items
              </p>
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden border border-gray-200 px-4 py-2 text-sm font-light hover:border-gray-900 transition-colors dark:border-gray-800 dark:text-gray-300 dark:hover:border-gray-600"
            >
              Filters
            </button>
          </div>

          <div className="flex gap-8 lg:gap-12">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24">
                {/* Search Bar */}
                <div className="mb-8">
                  <h3 className="text-sm font-light mb-4 text-gray-900 tracking-wide dark:text-white">
                    SEARCH
                  </h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full border border-gray-200 px-3 py-2 text-sm font-light focus:outline-none focus:border-gray-900 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:focus:border-gray-600 dark:placeholder-gray-400"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-300"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-sm font-light mb-4 text-gray-900 tracking-wide dark:text-white">
                    SORT BY
                  </h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full border border-gray-200 px-3 py-2 text-sm font-light focus:outline-none focus:border-gray-900 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:focus:border-gray-600"
                  >
                    <option value="default">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>

                <div className="mb-8">
                  <h3 className="text-sm font-light mb-4 text-gray-900 tracking-wide dark:text-white">
                    PRICE RANGE
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-full accent-gray-900 dark:accent-white"
                    />
                    <div className="flex justify-between text-sm text-gray-600 font-light dark:text-gray-300">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-sm font-light mb-4 text-gray-900 tracking-wide dark:text-white">
                    RATING
                  </h3>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="w-full border border-gray-200 px-3 py-2 text-sm font-light focus:outline-none focus:border-gray-900 bg-white appearance-auto dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:focus:border-gray-600"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">★★★★★ (5 stars & up)</option>
                    <option value="4">★★★★☆ (4 stars & up)</option>
                    <option value="3">★★★☆☆ (3 stars & up)</option>
                    <option value="2">★★☆☆☆ (2 stars & up)</option>
                    <option value="1">★☆☆☆☆ (1 star & up)</option>
                  </select>
                </div>

                <button
                  onClick={resetFilters}
                  className="text-sm text-gray-600 hover:text-gray-900 font-light underline dark:text-gray-300 dark:hover:text-white"
                >
                  Reset Filters
                </button>
              </div>
            </aside>

            {/* Mobile Sidebar */}
            {isSidebarOpen && (
              <div className="lg:hidden fixed inset-0 bg-black/50 z-40 dark:bg-black/70" onClick={() => setIsSidebarOpen(false)}>
                <div
                  className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto dark:bg-gray-900 dark:border-l dark:border-gray-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-lg font-light text-gray-900 dark:text-white">Filters</h2>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Search Bar - Mobile */}
                  <div className="mb-8">
                    <h3 className="text-sm font-light mb-4 text-gray-900 tracking-wide dark:text-white">
                      SEARCH
                    </h3>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border border-gray-200 px-3 py-2 text-sm font-light focus:outline-none focus:border-gray-900 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:focus:border-gray-600 dark:placeholder-gray-400"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-sm font-light mb-4 text-gray-900 tracking-wide dark:text-white">
                      SORT BY
                    </h3>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full border border-gray-200 px-3 py-2 text-sm font-light focus:outline-none focus:border-gray-900 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:focus:border-gray-600"
                    >
                      <option value="default">Default</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-sm font-light mb-4 text-gray-900 tracking-wide dark:text-white">
                      PRICE RANGE
                    </h3>
                    <div className="space-y-4">
                      <input
                        type="range"
                        min="0"
                        max="500"
                        step="10"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([priceRange[0], Number(e.target.value)])
                        }
                        className="w-full accent-gray-900 dark:accent-white"
                      />
                      <div className="flex justify-between text-sm text-gray-600 font-light dark:text-gray-300">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-sm font-light mb-4 text-gray-900 tracking-wide dark:text-white">
                      RATING
                    </h3>
                    <select
                      value={selectedRating}
                      onChange={(e) => setSelectedRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                      className="w-full border border-gray-200 px-3 py-2 text-sm font-light focus:outline-none focus:border-gray-900 bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700 dark:focus:border-gray-600"
                    >
                      <option value="all">All Ratings</option>
                      <option value="5">★★★★★ (5 stars & up)</option>
                      <option value="4">★★★★☆ (4 stars & up)</option>
                      <option value="3">★★★☆☆ (3 stars & up)</option>
                      <option value="2">★★☆☆☆ (2 stars & up)</option>
                      <option value="1">★☆☆☆☆ (1 star & up)</option>
                    </select>
                  </div>

                  <button
                    onClick={resetFilters}
                    className="text-sm text-gray-600 hover:text-gray-900 font-light underline dark:text-gray-300 dark:hover:text-white"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border border-gray-200 border-t-gray-900 dark:border-gray-800 dark:border-t-white"></div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-sm text-gray-500 font-light dark:text-gray-300">
                    No products found
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-12">
                  {filteredProducts.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
