import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Filter,
  X,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import Navbar from "../compoenents/Navbar";

interface Category {
  id: string;
  name: string;
}

interface Saree {
  id: string;
  productName: string;
  description?: string;
  price?: number;
  offerPrice?: number;
  rating?: number;
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
  categoryId: string;
  category?: Category | null;
}

export default function FrontendSarees() {
  const [sarees, setSarees] = useState<Saree[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(false);
  //const [showOverlay, setShowOverlay] = useState<string | null>(null); // for mobile click/tap
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [cartItems, setCartItems] = useState<string[]>([]); // Track items added to cart

  useEffect(() => {
    fetchData();
    // Load cart items on mount
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const ids = existingCart.map((item: any) => item.id);
    setCartItems(ids);
  }, []);

  // ✅ Updated Add to Cart Function



  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, sareeRes] = await Promise.all([
        axios.get(`${API_URL}/api/categories`),
        axios.get(`${API_URL}/api/sarees`),
      ]);

      const categoriesData: Category[] = Array.isArray(catRes.data)
        ? catRes.data
        : catRes.data?.categories || catRes.data?.data || [];

      const sareesData: Saree[] = Array.isArray(sareeRes.data)
        ? sareeRes.data
        : sareeRes.data?.sarees || sareeRes.data?.data || [];

      setCategories(categoriesData);
      setSarees(sareesData);
    } catch {
      setError("Failed to load data from server.");
    } finally {
      setLoading(false);
    }
  };

  const filteredSarees =
    selectedCategoryId === "All"
      ? sarees
      : sarees.filter((s) => s.categoryId === selectedCategoryId);
const handleAddToCart = (s: Saree) => {
  const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
  const existingIndex = existingCart.findIndex((item: any) => item.id === s.id);

  if (existingIndex > -1) {
    existingCart[existingIndex].quantity += 1;
  } else {
    existingCart.push({
      id: s.id,
      name: s.productName,
      price: s.offerPrice || s.price,
      image: s.image1,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(existingCart));

  // ✅ Update state immediately so UI changes instantly
  setCartItems(existingCart.map((item: any) => item.id));

  // Optional: trigger global cart update (if used elsewhere)
  window.dispatchEvent(new Event("cartUpdated"));
};


  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent mb-4"></div>
          <p className="text-slate-700 font-medium">Loading our collection...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-7 h-7 text-amber-500" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Our Saree Collection
            </h1>
            <Sparkles className="w-7 h-7 text-amber-500" />
          </div>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
            Explore our handpicked selection of exquisite sarees, blending tradition with modern luxury.
          </p>
        </div>

        {/* Filter Button (Mobile) */}
        <button
          onClick={() => setShowCategories(!showCategories)}
          className="lg:hidden flex items-center justify-center gap-2 bg-white text-slate-700 px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all mb-6 mx-auto font-semibold border border-slate-200"
        >
          {showCategories ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
          {showCategories ? "Hide Filters" : "Show Filters"}
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          {showCategories && (
            <div className="lg:hidden bg-white rounded-2xl shadow-xl p-6 border border-slate-200 mb-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Filter className="w-5 h-5 text-rose-500" />
                Categories
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedCategoryId("All");
                    setShowCategories(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-between ${selectedCategoryId === "All"
                    ? "bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-md"
                    : "text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200"
                    }`}
                >
                  All Sarees
                </button>
                {categories.map((cat) => {
                  const count = sarees.filter((s) => s.categoryId === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                     onClick={() => {
  setSelectedCategoryId(cat.id);
  setShowCategories(false);
  setTimeout(() => {
    window.scrollTo({
      top: document.getElementById("productGrid")?.offsetTop || 0,
      behavior: "smooth",
    });
  }, 200);
}}

                      className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-between ${selectedCategoryId === cat.id
                        ? "bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-md"
                        : "text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200"
                        }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 sticky top-24">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200">
                <Filter className="w-5 h-5 text-rose-500" />
                <h2 className="text-xl font-bold text-slate-800">Categories</h2>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategoryId("All")}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-between ${selectedCategoryId === "All"
                    ? "bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-md"
                    : "text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200"
                    }`}
                >
                  <span>All Sarees</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                {categories.map((cat) => {
                  const count = sarees.filter((s) => s.categoryId === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
  setSelectedCategoryId(cat.id);
  setTimeout(() => {
    window.scrollTo({
      top: document.getElementById("productGrid")?.offsetTop || 0,
      behavior: "smooth",
    });
  }, 200);
}}

                      className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-between ${selectedCategoryId === cat.id
                        ? "bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-md"
                        : "text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200"
                        }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            {filteredSarees.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSarees.map((s) => {
                  const category = categories.find((c) => c.id === s.categoryId);
                  const images = [s.image1, s.image2, s.image3].filter(Boolean);

                  return (
                    <div
                      key={s.id}
                      className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 group transition-all duration-500 hover:-translate-y-2"
                    >
                      {/* --- Image Carousel --- */}
                      <Swiper
                        modules={[Pagination, Autoplay]}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        loop
                        className="h-[320px] sm:h-[360px] md:h-[400px]"
                      >
                        {images.length > 0 ? (
                          images.map((img, index) => (
                            <SwiperSlide key={index}>
                              <img
                                src={img || "/no-image.jpg"}
                                alt={`${s.productName} ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                            </SwiperSlide>
                          ))
                        ) : (
                          <SwiperSlide>
                            <img
                              src="/no-image.jpg"
                              alt="No Image"
                              className="w-full h-full object-cover"
                            />
                          </SwiperSlide>
                        )}
                      </Swiper>

                      {/* --- Hover Overlay (Desktop Only) --- */}
                      <div
                        className={`absolute inset-0 bg-black/40 hidden lg:flex flex-col items-center justify-end pb-5 
              opacity-0 group-hover:opacity-100 transition-all duration-500`}
                      >
                        <div className="flex items-center gap-4 flex-wrap justify-center transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => navigate(`/saree/${s.id}`)}
                            className="bg-white text-purple-700 font-semibold px-4 py-2 rounded-full shadow hover:bg-purple-700 hover:text-white transition-transform hover:scale-105 text-sm sm:text-base"
                          >
                            View Details
                          </button>

                          {/* --- Desktop Hover Cart Button --- */}
                          {/* --- Desktop Hover Cart Button --- */}
                          <button
                            onClick={() => handleAddToCart(s)}
                            disabled={cartItems.includes(s.id)}
                            className={`p-3 rounded-full shadow transition ${cartItems.includes(s.id)
                                ? "bg-red-500 cursor-not-allowed" // 🔴 Red when added
                                : "bg-gradient-to-r from-purple-500 to-purple-700 hover:scale-110"
                              } text-white`}
                          >
                            <ShoppingCart size={20} />
                          </button>


                        </div>
                      </div>

                      {/* --- Product Info (Always Visible) --- */}
                      <div className="p-4 text-center bg-white">
                        <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-1 line-clamp-2">
                          {s.productName}
                        </h2>

                        <p className="text-xs sm:text-sm text-slate-500 mb-2">
                          {category?.name ?? "Uncategorized"}
                        </p>

                        {/* --- Price Section --- */}
                        <div className="flex justify-center items-center gap-2 text-purple-700 mb-3">
                          {s.offerPrice ? (
                            <>
                              <span className="text-lg sm:text-xl font-semibold">
                                ₹{s.offerPrice.toLocaleString("en-IN")}
                              </span>
                              <span className="text-sm sm:text-base text-slate-400 line-through">
                                ₹{s.price?.toLocaleString("en-IN")}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg sm:text-xl font-semibold">
                              ₹{s.price?.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>

                        {/* --- Buttons (Visible Only on Mobile/Tablet) --- */}
                        {/* --- Buttons (Visible Only on Mobile/Tablet) --- */}
                        {/* --- Buttons (Visible Only on Mobile/Tablet) --- */}
                        <div className="flex justify-center items-center gap-3 lg:hidden">
                          <button
                            onClick={() => navigate(`/saree/${s.id}`)}
                            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-full shadow hover:scale-105 transition-transform text-sm sm:text-base"
                          >
                            View Details
                          </button>

                          <button
                            onClick={() => handleAddToCart(s)}
                            disabled={cartItems.includes(s.id)}
                            className={`p-3 rounded-full shadow transition ${cartItems.includes(s.id)
                                ? "bg-red-500 cursor-not-allowed" // 🔴 Red after added
                                : "bg-gradient-to-r from-purple-500 to-purple-700 hover:scale-105"
                              } text-white`}
                          >
                            <ShoppingCart size={18} />
                          </button>
                        </div>


                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <p className="text-slate-500 text-lg font-medium">
                  No sarees available in this category.
                </p>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}