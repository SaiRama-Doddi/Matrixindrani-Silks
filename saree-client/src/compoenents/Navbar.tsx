import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, LayoutDashboard, ShoppingCart } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Check login status whenever route changes
  useEffect(() => {
    const admin = localStorage.getItem("admin");
    setIsLoggedIn(Boolean(admin));
  }, [location]);

  // Sync cart count with localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const count = Array.isArray(cart)
        ? cart.reduce((acc, item: any) => acc + (item.quantity || 1), 0)
        : 0;
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    setIsLoggedIn(false);
    navigate("/login");
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Products" },
    { path: "/gallery", label: "Gallery" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  // Hide cart and dashboard on admin page
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <nav className="w-full border-b border-purple-200 bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center whitespace-nowrap"
        >
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
            <button
              key={link.path}
              onClick={() => handleNavigate(link.path)}
              className={`cursor-pointer text-sm font-medium tracking-wide transition-all duration-200 ${
                location.pathname === link.path
                  ? "text-purple-700 border-b-2 border-purple-600 pb-1"
                  : "text-gray-700 hover:text-purple-700"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right Side Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {!isAdminPage && (
            <button
              onClick={() => handleNavigate("/cart")}
              className="relative flex items-center justify-center bg-white border border-purple-300 text-purple-700 rounded-full w-11 h-11 shadow hover:bg-purple-50 transition"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {isLoggedIn ? (
            <>
              {!isAdminPage && (
                <button
                  onClick={() => handleNavigate("/admin")}
                  className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-md"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="text-sm font-medium">Dashboard</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-full hover:from-red-500 hover:to-red-700 transition-all duration-300 shadow-md"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => handleNavigate("/login")}
              className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-full hover:from-purple-500 hover:to-purple-700 transition-all duration-300 shadow-md"
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Login</span>
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-purple-700 focus:outline-none cursor-pointer"
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-inner border-t border-purple-100 animate-slide-down">
          <div className="flex flex-col px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavigate(link.path)}
                className={`text-left text-base font-medium ${
                  location.pathname === link.path
                    ? "text-purple-700 font-semibold"
                    : "text-gray-700 hover:text-purple-700"
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="border-t border-gray-200 my-2"></div>

            {!isAdminPage && (
              <button
                onClick={() => handleNavigate("/cart")}
                className="flex items-center gap-2 text-purple-700 font-medium"
              >
                <ShoppingCart className="w-5 h-5" />
                Cart ({cartCount})
              </button>
            )}

            {isLoggedIn ? (
              <>
                {!isAdminPage && (
                  <button
                    onClick={() => handleNavigate("/admin")}
                    className="flex items-center gap-2 text-purple-700 font-medium"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavigate("/login")}
                className="flex items-center gap-2 text-purple-700 font-medium"
              >
                <User className="w-5 h-5" />
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}