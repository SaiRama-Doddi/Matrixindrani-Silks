import HeroCarousel from '../compoenents/HeroCarousel';
import About from '../compoenents/About';
import Gallery from '../compoenents/Gallery';
import Contact from '../compoenents/Contact';
import Navbar from '../compoenents/Navbar';
import LavenderFooter from '../compoenents/Footer';
import { useLocation } from "react-router-dom";
import Products from './Products';

export default function Home() {
  const location = useLocation();

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <Navbar />

      {location.pathname === "/" && (
        <>
          {/* ✅ Hero Section */}
          <div id="hero-section">
            <HeroCarousel onViewProducts={scrollToProducts} />
          </div>

          {/* ✅ Products Section */}
          <div id="products-section">
            <Products />
          </div>

          {/* ✅ About Section */}
          <div id="about-section">
            <About />
          </div>

          {/* ✅ Gallery Section */}
          <div id="gallery-section">
            <Gallery />
          </div>

          {/* ✅ Contact Section */}
          <div id="contact-section">
            <Contact />
          </div>
        </>
      )}

      {/* ✅ Individual Pages */}
      {location.pathname === "/about" && <About />}
      {location.pathname === "/products" && <Products />}
      {location.pathname === "/gallery" && <Gallery />}
      {location.pathname === "/contact" && <Contact />}

      {/* ✅ Single footer for all pages */}
      <LavenderFooter />
    </div>
  );
}