import { X } from "lucide-react";
import { useState } from "react";

export default function Gallery() {
  // 🌸 Image pairs for flip/fade effect
  const images = [
    {
      front: "https://res.cloudinary.com/dd4oiwnep/image/upload/v1766155188/WhatsApp_Image_2025-12-10_at_19.30.54_ed25ed03_l5c9ew.jpg",
      back: "https://res.cloudinary.com/dd4oiwnep/image/upload/v1766155191/WhatsApp_Image_2025-12-10_at_19.28.37_be77d900_ascvsk.jpg",
      name: "Lavender Silk Saree",
    },
    {
      front: "https://res.cloudinary.com/dd4oiwnep/image/upload/v1766155190/WhatsApp_Image_2025-12-10_at_19.28.37_d882b6c6_kvaft0.jpg",
      back: "https://res.cloudinary.com/dd4oiwnep/image/upload/v1766155190/WhatsApp_Image_2025-12-10_at_19.28.37_ba01f494_x2gdg5.jpg",
      name: "Royal Banarasi Saree",
    },
    {
      front: "https://res.cloudinary.com/dd4oiwnep/image/upload/v1766155190/WhatsApp_Image_2025-12-10_at_19.28.36_0f9d669e_gli8mi.jpg",
      back: "https://res.cloudinary.com/dd4oiwnep/image/upload/v1766155189/WhatsApp_Image_2025-12-10_at_19.28.38_0573c742_vswyrx.jpg",
      name: "Golden Glow Saree",
    },
    {
      front: "https://res.cloudinary.com/dd4oiwnep/image/upload/v1766155171/WhatsApp_Image_2025-12-10_at_19.28.39_0850aee2_royrsr.jpg",
      back: "https://res.cloudinary.com/dt2byhqyh/image/upload/v1762434354/Saree2_curetd.jpg",
      name: "Velvet Elegance Saree",
    },
    {
      front: "https://res.cloudinary.com/dd4oiwnep/image/upload/v1766155186/WhatsApp_Image_2025-12-10_at_19.28.40_c957cb4a_ltfgdh.jpg",
      back: "https://res.cloudinary.com/dt2byhqyh/image/upload/v1762434354/Saree3_bb6o67.jpg",
      name: "Lavender Silk Saree",
    },
    {
      front: "https://res.cloudinary.com/dd4oiwnep/image/upload/v1766155188/WhatsApp_Image_2025-12-10_at_19.28.38_a414e355_uq8pv1.jpg",
      back: "https://res.cloudinary.com/dd4oiwnep/image/upload/v1766155188/WhatsApp_Image_2025-12-10_at_19.28.38_eaee624f_d5bxxp.jpg",
      name: "Royal Banarasi Saree",
    },
    {
      front: "https://res.cloudinary.com/dd4oiwnep/image/upload/v1766155188/WhatsApp_Image_2025-12-10_at_19.32.58_9808884e_pytvzl.jpg",
      back: "https://res.cloudinary.com/dd4oiwnep/image/upload/v1766155187/WhatsApp_Image_2025-12-10_at_19.28.38_8e5f37fb_msegvd.jpg",
      name: "Golden Glow Saree",
    },
    {
      front: "https://res.cloudinary.com/dd4oiwnep/image/upload/v1766155188/WhatsApp_Image_2025-12-10_at_19.28.39_817bb3ba_izursv.jpg",
      back: "https://res.cloudinary.com/dd4oiwnep/image/upload/v1766155183/WhatsApp_Image_2025-12-10_at_19.28.39_814020c2_zfvykw.jpg",
      name: "Velvet Elegance Saree",
    },
  ];

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="w-full min-h-screen bg-gradient-to-b from-[#f8f5ff] to-[#e7defa] py-20 px-4 sm:px-8">
        <div className="text-center mb-16">
           <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-700 to-purple-400 bg-clip-text text-transparent mb-4">
          Collection
        </h1>
          <p className="text-purple-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover the elegance of tradition reimagined — where every saree tells a story of grace and artistry.
          </p>
        </div>

        {/* 🌸 Premium Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {images.map((img, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(img.front)}
              className="relative group overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 cursor-pointer"
            >
              {/* Front Image */}
              <img
                src={img.front}
                alt={img.name}
                className="w-full h-[480px] object-cover rounded-3xl transition-opacity duration-700 group-hover:opacity-0"
              />

              {/* Back Image (shows on hover) */}
              <img
                src={img.back}
                alt={`${img.name} alternate`}
                className="absolute inset-0 w-full h-full object-cover rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              />

              {/* Bottom Label */}
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-r from-purple-800 to-purple-600/90 text-white text-center py-4 text-lg font-semibold tracking-wide">
                {img.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🌙 Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 bg-purple-500/40 hover:bg-purple-600 text-white p-3 rounded-full transition-all z-10"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <img
            src={selectedImage}
            alt="Full view"
            className="max-w-[90vw] max-h-[90vh] rounded-3xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}