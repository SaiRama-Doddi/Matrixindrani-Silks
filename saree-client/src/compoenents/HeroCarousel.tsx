import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroCarouselProps {
  onViewProducts: () => void;
}

export default function HeroCarousel({ onViewProducts }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image:
        "https://res.cloudinary.com/dt2byhqyh/image/upload/v1762434354/Saree4_cpmhbz.jpg",
      title: "Exquisite Silk Sarees",
      subtitle: "Timeless Elegance for Every Occasion",
      gradient: "from-purple-900/70 via-purple-800/60 to-transparent",
    },
    {
      image:
        "https://res.cloudinary.com/dt2byhqyh/image/upload/v1762434354/Saree3_bb6o67.jpg",
      title: "Designer Collection",
      subtitle: "Modern Designs, Traditional Craftsmanship",
      gradient: "from-pink-900/70 via-pink-800/60 to-transparent",
    },
    {
      image:
        "https://res.cloudinary.com/dt2byhqyh/image/upload/v1762434354/Saree1_daloqi.jpg",
      title: "Wedding Specials",
      subtitle: "Make Your Special Day Unforgettable",
      gradient: "from-rose-900/70 via-rose-800/60 to-transparent",
    },
    {
      image:
        "https://res.cloudinary.com/dt2byhqyh/image/upload/v1762434354/Saree2_curetd.jpg",
      title: "Royal Heritage Collection",
      subtitle: "Experience the Luxury of Pure Silk",
      gradient: "from-fuchsia-900/70 via-fuchsia-800/60 to-transparent",
    },
  ];

  // Auto scroll every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div
      className="
      relative w-full 
      h-[80vh] sm:h-[85vh] md:h-[90vh] lg:h-screen 
      overflow-hidden bg-black mt-16"
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* ✅ Full image visible (no crop) */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-contain bg-black"
          />

          {/* Gradient overlay for better text contrast */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`}
          ></div>

          {/* Text content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg mb-3 sm:mb-4 animate-fade-in-up">
              {slide.title}
            </h1>
            <p className="text-base sm:text-lg md:text-2xl text-gray-200 mb-6 sm:mb-8 max-w-2xl animate-fade-in">
              {slide.subtitle}
            </p>
            <button
              onClick={onViewProducts}
              className="px-6 sm:px-8 py-3 bg-white/90 text-purple-700 rounded-full font-semibold text-base sm:text-lg hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Explore Collection
            </button>
          </div>
        </div>
      ))}

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 z-20"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 z-20"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white w-6 sm:w-8"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
}