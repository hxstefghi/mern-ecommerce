import { useState } from "react";
import Footer from "../components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Main Contact Section with Image and Form */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Left: Image */}
          <div className="w-full h-[500px] md:h-[700px] bg-gray-100 dark:bg-gray-900 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800&q=80"
              alt="Contact Us"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right: Form and Info */}
          <div className="flex flex-col justify-center space-y-12">
            <div>
              <h1 className="text-4xl md:text-6xl font-light text-gray-900 dark:text-white tracking-tight mb-6">
                Get in Touch
              </h1>
              <p className="text-lg md:text-xl font-light text-gray-500 dark:text-gray-400 leading-relaxed">
                We'd love to hear from you
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-light text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Email</h3>
                <a href="mailto:christiancatuday13@gmail.com" className="text-base font-light text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  christiancatuday13@gmail.com
                </a>
              </div>
              <div>
                <h3 className="text-sm font-light text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Phone</h3>
                <a href="tel:+1234567890" className="text-base font-light text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  +1 (234) 567-890
                </a>
              </div>
              <div>
                <h3 className="text-sm font-light text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Hours</h3>
                <p className="text-base font-light text-gray-900 dark:text-white">
                  Mon-Fri: 9AM-6PM
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              {submitted && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900">
                  <p className="text-sm font-light text-gray-900 dark:text-white">
                    Thank you for your message. We'll get back to you soon.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-0 py-4 border-b border-gray-200 dark:border-gray-700 focus:border-gray-900 dark:focus:border-gray-400 outline-none font-light text-base bg-transparent dark:bg-gray-950 dark:text-white dark:placeholder-gray-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-0 py-4 border-b border-gray-200 dark:border-gray-700 focus:border-gray-900 dark:focus:border-gray-400 outline-none font-light text-base bg-transparent dark:bg-gray-950 dark:text-white dark:placeholder-gray-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <textarea
                    placeholder="Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-0 py-4 border-b border-gray-200 dark:border-gray-700 focus:border-gray-900 dark:focus:border-gray-400 outline-none font-light text-base bg-transparent dark:bg-gray-950 dark:text-white dark:placeholder-gray-500 resize-none transition-colors"
                    rows="4"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-12 py-3 border border-gray-900 dark:border-gray-300 text-gray-900 dark:text-white font-light hover:bg-gray-900 dark:hover:bg-gray-300 hover:text-white dark:hover:text-gray-900 transition-all text-sm tracking-wide uppercase"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
