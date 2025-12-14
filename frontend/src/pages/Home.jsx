import { useEffect, useState } from "react";
import api from "../lib/api";
import ProductCard from "../components/ProductCard";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = selectedCategory === 'all' 
          ? "/products" 
          : `/products?category=${selectedCategory}`;
        const res = await api.get(url);
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Hero />

      <div id="products" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-light mb-2 text-gray-900 dark:text-white">Latest Collection</h2>
          <p className="text-sm text-gray-500 font-light dark:text-gray-300">Timeless pieces for your space</p>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-gray-500 font-light tracking-wide dark:text-gray-300">CATEGORY:</span>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 sm:px-6 py-2 text-sm font-light border transition-colors touch-manipulation ${
                  selectedCategory === 'all'
                    ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-900 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:border-gray-700'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => setSelectedCategory(category._id)}
                  className={`px-4 sm:px-6 py-2 text-sm font-light border transition-colors touch-manipulation ${
                    selectedCategory === category._id
                      ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-900 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:border-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border border-gray-200 border-t-gray-900 dark:border-gray-800 dark:border-t-white"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-gray-500 font-light dark:text-gray-300">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
