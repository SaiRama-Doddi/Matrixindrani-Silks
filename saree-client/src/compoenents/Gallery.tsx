import { X } from "lucide-react";
import { useState } from "react";

export default function Gallery() {
  // 🔹 Paste your image URLs here
  const images = [
    "https://res.cloudinary.com/dt2byhqyh/image/upload/v1762434354/Saree4_cpmhbz.jpg",
    "https://res.cloudinary.com/dt2byhqyh/image/upload/v1762434354/Saree3_bb6o67.jpg",
    "https://res.cloudinary.com/dt2byhqyh/image/upload/v1762434354/Saree3_bb6o67.jpg",
    "https://res.cloudinary.com/dt2byhqyh/image/upload/v1762434354/Saree2_curetd.jpg",
    "https://kalamandir.com/media/km/Banarasi01.jpg",
    "https://kalamandir.com/media/km/Banarasi01.jpg",
  ];

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#E6E6FA] to-[#D8BFD8] py-12 px-6 md:px-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-800 mb-4">
            Image Gallery
          </h1>
          <p className="text-purple-600 text-lg max-w-2xl mx-auto">
            Discover elegant saree inspirations in our gallery — each design tells its own story.
          </p>
        </div>

        {/* 🌸 Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(image)}
              className="relative group overflow-hidden rounded-2xl bg-white/60 backdrop-blur-sm border border-purple-200 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-700/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-500">
                <p className="text-lg font-semibold">Lavender Dreams</p>
                <p className="text-sm text-purple-100">
                  Elegance, tradition & modern artistry.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🌙 Lightbox (Popup) */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 bg-purple-500/30 hover:bg-purple-500/50 text-white p-3 rounded-full transition-all z-10"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <img
            src={selectedImage}
            alt="Full view"
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}