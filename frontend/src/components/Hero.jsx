import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-32">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-light mb-6 text-gray-900 tracking-tight">
            Curated for
            <br />
            Modern Living
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-12 font-light leading-relaxed">
            Discover thoughtfully designed products for your everyday life
          </p>
          <Link
            to="#products"
            className="inline-block text-sm border border-gray-900 text-gray-900 px-8 py-3 hover:bg-gray-900 hover:text-white transition-all font-light tracking-wide"
          >
            EXPLORE COLLECTION
          </Link>
        </div>
      </div>
    </div>
  );
}
