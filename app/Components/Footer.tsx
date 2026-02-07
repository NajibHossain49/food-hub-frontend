"use client";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-dark)] text-white px-6 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="font-[family-name:var(--font-family-serif)] text-2xl text-[var(--color-orange-primary)] mb-6">
              FoodHub
            </h3>
            <p className="text-white/70 leading-relaxed">
              Delivering happiness, one meal at a time. Fresh food, fast
              delivery, fantastic experience.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-[family-name:var(--font-family-serif)] text-xl text-[var(--color-orange-primary)] mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("home")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-white/70 hover:text-[var(--color-orange-primary)] transition-colors duration-300"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-white/70 hover:text-[var(--color-orange-primary)] transition-colors duration-300"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("featured-meals")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-white/70 hover:text-[var(--color-orange-primary)] transition-colors duration-300"
                >
                  Featured Meals
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    document
                      .getElementById("top-providers")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-white/70 hover:text-[var(--color-orange-primary)] transition-colors duration-300"
                >
                  Providers
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-[family-name:var(--font-family-serif)] text-xl text-[var(--color-orange-primary)] mb-6">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-[var(--color-orange-primary)] transition-colors duration-300"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-[var(--color-orange-primary)] transition-colors duration-300"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-[var(--color-orange-primary)] transition-colors duration-300"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-[var(--color-orange-primary)] transition-colors duration-300"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-[family-name:var(--font-family-serif)] text-xl text-[var(--color-orange-primary)] mb-6">
              Connect
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-[var(--color-orange-primary)] transition-colors duration-300"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-[var(--color-orange-primary)] transition-colors duration-300"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-[var(--color-orange-primary)] transition-colors duration-300"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/70 hover:text-[var(--color-orange-primary)] transition-colors duration-300"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-white/10 text-center text-white/50">
          <p>&copy; 2026 FoodHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
