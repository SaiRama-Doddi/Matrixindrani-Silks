import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";

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

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchData();
  }, []);
const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const [catRes, sareeRes] = await Promise.all([
        axios.get(`${API_URL}/api/categories`),
        axios.get(`${API_URL}/api/sarees`),
      ]);

      const categoriesData: Category[] = Array.isArray(catRes.data)
        ? catRes.data
        : catRes.data?.categories || [];

      const sareesData: Saree[] = Array.isArray(sareeRes.data.sarees)
        ? sareeRes.data.sarees
        : [];

      setCategories(categoriesData);
      setSarees(sareesData);
    } catch (err) {
      console.error(err);
      setError("Failed to load data from server.");
    } finally {
      setLoading(false);
    }
  };

  const filteredSarees =
    selectedCategoryId === "All"
      ? sarees
      : sarees.filter((s) => s.categoryId === selectedCategoryId);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;

  return (
    <div className="mt-20 p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10 text-purple-600">
        Matrix Indrani Saree Collection
      </h1>

      {/* Mobile toggle button */}
      <div className="md:hidden flex justify-center mb-4">
        <button
          onClick={() => setShowCategories(!showCategories)}
          className="bg-purple-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-purple-600 transition"
        >
          {showCategories ? "Hide Categories" : "Show Categories"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {/* Sidebar Categories */}
        <div
          className={`${showCategories ? "block" : "hidden"
            } md:block md:col-span-1 bg-white shadow-lg rounded-2xl p-6 h-fit border border-purple-100 transition-all duration-300`}
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-purple-600 mb-4 text-center border-b pb-3">
            Categories
          </h2>

          <div className="flex flex-col gap-3">
            {/* All Sarees Button */}
            <button
              key="All"
              onClick={() => {
                setSelectedCategoryId("All");
                setShowCategories(false); // hide menu on mobile
              }}
              className={`w-full text-left px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${selectedCategoryId === "All"
                  ? "bg-purple-400 text-white shadow-md scale-[1.02]"
                  : "text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200"
                }`}
            >
              All Sarees ({sarees.length})
            </button>

            {/* Dynamic Categories */}
            {categories.map((cat) => {
              const count = sarees.filter((s) => s.categoryId === cat.id).length;
              const isActive = selectedCategoryId === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategoryId(cat.id);
                    setShowCategories(false); // close on mobile
                  }}
                  className={`w-full text-left px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                      ? "bg-purple-400 text-white shadow-md scale-[1.02]"
                      : "text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200"
                    }`}
                >
                  {cat.name}
                  <span
                    className={`ml-2 text-xs ${isActive ? "text-white" : "text-purple-500"
                      }`}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Saree Collection Grid */}
        <div
          className={`${showCategories ? "hidden md:block" : "block"
            } md:col-span-3 lg:col-span-4 transition-all duration-300`}
        >
          {filteredSarees.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSarees.map((s) => {
                const category = categories.find(
                  (c) => c.id === s.categoryId
                );
                const images = [s.image1, s.image2, s.image3].filter(Boolean);

                return (
                  <div
                    key={s.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition transform hover:scale-105"
                  >
                    {/* Image Section */}
                    <div className="relative">
                      <Swiper
                        modules={[Pagination, Autoplay]}
                        spaceBetween={10}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        loop
                        className="h-56 w-full"
                      >
                        {images.length > 0 ? (
                          images.map((img, index) => (
                            <SwiperSlide key={index}>
                              <img
                                src={img || "/no-image.jpg"}
                                alt={`${s.productName} ${index + 1}`}
                                className="w-full h-56 object-cover"
                                onError={(e) =>
                                ((e.target as HTMLImageElement).src =
                                  "/no-image.jpg")
                                }
                              />
                            </SwiperSlide>
                          ))
                        ) : (
                          <SwiperSlide>
                            <img
                              src="/no-image.jpg"
                              alt="No Image"
                              className="w-full h-56 object-cover"
                            />
                          </SwiperSlide>
                        )}
                      </Swiper>

                      {s.offerPrice &&
                        s.price &&
                        s.offerPrice < s.price && (
                          <span className="absolute top-3 right-3 bg-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                            {Math.round(
                              ((s.price - s.offerPrice) / s.price) * 100
                            )}
                            % OFF
                          </span>
                        )}
                    </div>

                    {/* Details */}
                    <div className="p-4 text-center">
                      <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
                        {s.productName}
                      </h2>
                      <p className="text-sm text-gray-500 mb-2">
                        {category?.name ?? "Uncategorized"}
                      </p>

                      <div className="flex justify-center gap-2 items-center mb-2">
                        {s.offerPrice && s.price && s.offerPrice < s.price ? (
                          <>
                            <span className="text-purple-500 font-bold">
                              ₹{s.offerPrice.toLocaleString("en-IN")}
                            </span>
                            <span className="line-through text-gray-500 text-xs sm:text-sm">
                              ₹{s.price.toLocaleString("en-IN")}
                            </span>
                          </>
                        ) : (
                          <span className="text-purple-500 font-bold">
                            ₹{s.price?.toLocaleString("en-IN") ?? "N/A"}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => navigate(`/saree/${s.id}`)}
                        className="mt-2 bg-purple-500 text-white font-semibold px-3 sm:px-4 py-2 rounded-lg hover:bg-purple-600 transition text-sm sm:text-base"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-10">
              No sarees available in this category.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}