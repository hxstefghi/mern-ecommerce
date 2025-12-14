import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="relative bg-gray-900 dark:bg-gray-950 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=800&fit=crop"
          alt="Modern retail store"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 to-black/40 dark:from-black/80 dark:to-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-6 py-32 md:py-40">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-light mb-6 text-white dark:text-white tracking-tight">
            Curated for
            <br />
            Modern Living
          </h1>
          <p className="text-lg md:text-xl text-gray-200 dark:text-gray-300 mb-12 font-light leading-relaxed">
            Discover thoughtfully designed products for your everyday life
          </p>
          <Link
            to="/products"
            className="inline-block text-sm border border-white dark:border-gray-300 text-white dark:text-white px-8 py-3 hover:bg-white dark:hover:bg-gray-300 hover:text-gray-900 dark:hover:text-gray-950 transition-all font-light tracking-wide"
          >
            EXPLORE COLLECTION
          </Link>
        </div>
      </div>
    </div>
  );
}
