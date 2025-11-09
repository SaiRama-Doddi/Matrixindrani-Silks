import { useEffect, useState } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Filter, X, ChevronRight } from 'lucide-react';
import Navbar from '../compoenents/Navbar';
import Footer from '../compoenents/Footer';

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
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchData();
  }, []);

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
      setError('Failed to load data from server.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSarees =
    selectedCategoryId === 'All'
      ? sarees
      : sarees.filter((s) => s.categoryId === selectedCategoryId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent mb-4"></div>
          <p className="text-slate-700 text-lg font-medium">Loading our collection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <p className="text-red-600 font-semibold text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-amber-500" />
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-600  bg-clip-text text-transparent">
              Our Saree Collection
            </h1>
            <Sparkles className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Explore our handpicked selection of exquisite sarees, blending tradition with contemporary elegance
          </p>
        </div>

        <button
          onClick={() => setShowCategories(!showCategories)}
          className="lg:hidden flex items-center gap-2 bg-white text-slate-700 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 mb-6 mx-auto font-semibold border border-slate-200"
        >
          {showCategories ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
          {showCategories ? 'Hide Filters' : 'Show Filters'}
        </button>

        <div className="flex gap-8">
          <aside
            className={`${
              showCategories ? 'block' : 'hidden'
            } lg:block w-full lg:w-72 flex-shrink-0`}
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 sticky top-24">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200">
                <Filter className="w-5 h-5 text-rose-500" />
                <h2 className="text-xl font-bold text-slate-800">Categories</h2>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedCategoryId('All');
                    setShowCategories(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-between group ${
                    selectedCategoryId === 'All'
                      ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-md'
                      : 'text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>All Sarees</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        selectedCategoryId === 'All'
                          ? 'bg-white/20 text-white'
                          : 'bg-gradient-to-r from-purple-400 to-purple-600'
                      }`}
                    >
                      {sarees.length}
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      selectedCategoryId === 'All' ? 'text-white' : 'text-slate-400 group-hover:translate-x-1'
                    }`} />
                  </div>
                </button>

                {categories.map((cat) => {
                  const count = sarees.filter((s) => s.categoryId === cat.id).length;
                  const isActive = selectedCategoryId === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategoryId(cat.id);
                        setShowCategories(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-between group ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-md'
                          : 'text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-gradient-to-r from-purple-400 to-purple-600'
                          }`}
                        >
                          {count}
                        </span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:translate-x-1'
                        }`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {filteredSarees.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSarees.map((s) => {
                  const category = categories.find((c) => c.id === s.categoryId);
                  const images = [s.image1, s.image2, s.image3].filter(Boolean);
                  const discount =
                    s.price && s.offerPrice && s.offerPrice < s.price
                      ? Math.round(((s.price - s.offerPrice) / s.price) * 100)
                      : 0;

                  return (
                    <div
                      key={s.id}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 border border-slate-200 group"
                    >
                      <div className="relative overflow-hidden">
                        <Swiper
                          modules={[Pagination, Autoplay]}
                          spaceBetween={0}
                          slidesPerView={1}
                          pagination={{ clickable: true }}
                          autoplay={{ delay: 3000, disableOnInteraction: false }}
                          loop
                          className="h-80"
                        >
                          {images.length > 0 ? (
                            images.map((img, index) => (
                              <SwiperSlide key={index}>
                                <img
                                  src={img || '/no-image.jpg'}
                                  alt={`${s.productName} ${index + 1}`}
                                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                                  onError={(e) =>
                                    ((e.target as HTMLImageElement).src =
                                      '/no-image.jpg')
                                  }
                                />
                              </SwiperSlide>
                            ))
                          ) : (
                            <SwiperSlide>
                              <img
                                src="/no-image.jpg"
                                alt="No Image"
                                className="w-full h-80 object-cover"
                              />
                            </SwiperSlide>
                          )}
                        </Swiper>

                        {discount > 0 && (
                          <div className="absolute top-3 right-3 z-10">
                            <div className="bg-gradient-to-r from-purple-400 to-purple-600 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg">
                              {discount}% OFF
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="mb-2">
                          <span className="inline-block px-3 py-1 bg-gradient-to-r from-rose-100 to-amber-100 text-rose-700 text-xs font-semibold rounded-full">
                            {category?.name ?? 'Uncategorized'}
                          </span>
                        </div>

                        <h2 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 min-h-[3.5rem]">
                          {s.productName}
                        </h2>

                        <div className="flex items-center gap-2 mb-4">
                          {s.offerPrice && s.price && s.offerPrice < s.price ? (
                            <>
                              <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
                                ₹{s.offerPrice.toLocaleString('en-IN')}
                              </span>
                              <span className="line-through text-slate-400 text-sm">
                                ₹{s.price.toLocaleString('en-IN')}
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent">
                              ₹{s.price?.toLocaleString('en-IN') ?? 'N/A'}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => navigate(`/saree/${s.id}`)}
                          className="w-full bg-gradient-to-r from-purple-400 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
                        >
                          View Details
                        </button>
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

      <Footer />
    </div>
  );
}
