// src/components/Footer.jsx
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-neutral-900 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-neutral-200 mb-4">
          &copy; {new Date().getFullYear()} Stay Finder. All rights reserved.
        </p>
        <div className="flex justify-center gap-6">
          <Link to="/" className="text-neutral-400 hover:text-primary-500 transition-colors duration-300">
            Home
          </Link>
          <Link to="/listings" className="text-neutral-400 hover:text-primary-500 transition-colors duration-300">
            Listings
          </Link>
          <Link to="/owner-dashboard" className="text-neutral-400 hover:text-primary-500 transition-colors duration-300">
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
export default Footer;