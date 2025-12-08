import { useEffect, useState } from "react";
import api from "../lib/api";
import ProductCard from "../components/ProductCard";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <Hero />

      <div id="products" className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-16">
          <h2 className="text-3xl font-light mb-2 text-gray-900">Latest Collection</h2>
          <p className="text-sm text-gray-500 font-light">Timeless pieces for your space</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border border-gray-200 border-t-gray-900"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-gray-500 font-light">No products available</p>
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
