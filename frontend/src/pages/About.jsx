import Footer from "../components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Image and Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left: Image */}
          <div className="w-full h-[400px] md:h-[600px] bg-gray-100 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
              alt="About Us"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right: Content */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-light text-gray-900 tracking-tight">
              About Us
            </h1>
            <p className="text-lg md:text-xl font-light text-gray-600 leading-relaxed">
              We are passionate about curating the finest selection of products that enhance your everyday living experience.
            </p>
            <p className="text-base md:text-lg font-light text-gray-500 leading-relaxed">
              Every item is thoughtfully selected to ensure it meets our standards of design, functionality, and sustainability. Our mission is to provide exceptional products that inspire and elevate modern living.
            </p>
            
            {/* Values */}
            <div className="space-y-6 pt-8">
              <div>
                <h3 className="text-sm font-light text-gray-900 uppercase tracking-wide mb-2">Quality</h3>
                <p className="text-sm font-light text-gray-500 leading-relaxed">
                  Every product is carefully selected for excellence
                </p>
              </div>
              <div>
                <h3 className="text-sm font-light text-gray-900 uppercase tracking-wide mb-2">Design</h3>
                <p className="text-sm font-light text-gray-500 leading-relaxed">
                  Beautiful and functional pieces for modern living
                </p>
              </div>
              <div>
                <h3 className="text-sm font-light text-gray-900 uppercase tracking-wide mb-2">Service</h3>
                <p className="text-sm font-light text-gray-500 leading-relaxed">
                  Dedicated support for an exceptional experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
