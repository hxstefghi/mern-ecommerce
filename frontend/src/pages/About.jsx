import Footer from "../components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section with Image and Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left: Image */}
          <div className="w-full h-[400px] md:h-[600px] bg-gray-100 dark:bg-gray-900 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
              alt="About Us"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right: Content */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-light text-gray-900 dark:text-white tracking-tight">
              About Us
            </h1>
            <p className="text-lg md:text-xl font-light text-gray-600 dark:text-gray-300 leading-relaxed">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur debitis accusamus dolorum ex optio est. In obcaecati ab omnis cum.
            </p>
            <p className="text-base md:text-lg font-light text-gray-500 dark:text-gray-400 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit architecto animi in nulla quaerat eaque quos accusamus atque molestias, ipsam accusantium. Temporibus ducimus laboriosam suscipit non numquam esse qui at!
            </p>
            
            {/* Values */}
            <div className="space-y-6 pt-8">
              <div>
                <h3 className="text-sm font-light text-gray-900 dark:text-white uppercase tracking-wide mb-2">Quality</h3>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400 leading-relaxed">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptas, id.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-light text-gray-900 dark:text-white uppercase tracking-wide mb-2">Design</h3>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400 leading-relaxed">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, sit?
                </p>
              </div>
              <div>
                <h3 className="text-sm font-light text-gray-900 dark:text-white uppercase tracking-wide mb-2">Service</h3>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400 leading-relaxed">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Blanditiis, repudiandae?
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
