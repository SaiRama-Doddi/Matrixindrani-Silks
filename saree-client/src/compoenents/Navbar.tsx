import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";

export default function Navbar() {
   const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Homesss" },
    { path: "/products", label: "Products" },
    { path: "/gallery", label: "Gallery" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="w-full border-b border-purple-200 bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo + Name */}
        <Link to="/" className="flex items-center whitespace-nowrap">
          <img
            src="https://res.cloudinary.com/dt2byhqyh/image/upload/v1762434788/Matrix_logo_qnor8g.jpg"
            alt="Matrixindarani Silks"
            className="w-20 h-12 sm:w-24 sm:h-14 object-contain mr-2"
          />
          <span className="text-xl sm:text-2xl font-semibold tracking-wide text-purple-700 font-playfair">
            Matrixindarani Silks
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium tracking-wide transition-all duration-200 ${
                location.pathname === link.path
                  ? "text-purple-700 border-b-2 border-purple-600 pb-1"
                  : "text-gray-700 hover:text-purple-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Login Button (Desktop) */}
        <div className="hidden md:flex">
      <button
        onClick={() => navigate("/login")} // 👈 Add this line for navigation
        className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-full hover:from-purple-500 hover:to-purple-700 transition-all duration-300 shadow-md"
      >
        <User className="w-4 h-4" />
        <span className="text-sm font-medium">Login</span>
      </button>
    </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-purple-700 focus:outline-none"
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-purple-100 shadow-sm">
          <div className="flex flex-col items-center py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`text-base font-medium ${
                  location.pathname === link.path
                    ? "text-purple-700 border-b-2 border-purple-600 pb-1"
                    : "text-gray-700 hover:text-purple-700"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <button className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-full hover:from-purple-500 hover:to-purple-700 transition-all duration-300 shadow-md">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Login</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}