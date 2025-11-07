import HeroCarousel from '../compoenents/HeroCarousel';

import About from '../compoenents/About';
import Gallery from '../compoenents/Gallery';
import Contact from '../compoenents/Contact';
import Navbar from '../compoenents/Navbar';
import LavenderFooter from '../compoenents/Footer';



export default function Home() {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
<Navbar />

      {/* Hero Section */}
      <HeroCarousel onViewProducts={scrollToProducts} />

      {/* Products Section */}
   

      {/* About Section */}
      <About />

      {/* Gallery Section */}
      <Gallery />

      {/* Contact Section */}
      <Contact />

    <LavenderFooter/>
    </div>
  );
}