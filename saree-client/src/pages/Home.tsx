import HeroCarousel from '../compoenents/HeroCarousel';

import About from '../compoenents/About';
import Gallery from '../compoenents/Gallery';
import Contact from '../compoenents/Contact';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <HeroCarousel onViewProducts={scrollToProducts} />

      {/* Products Section */}
   

      {/* About Section */}
      <About />

      {/* Gallery Section */}
      <Gallery />

      {/* Contact Section */}
      <Contact />
    </div>
  );
}