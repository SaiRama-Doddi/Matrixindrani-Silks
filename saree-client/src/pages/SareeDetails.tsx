import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../compoenents/Navbar';
import Footer from '../compoenents/Footer';
import {
  ArrowLeft,
  Package,
  Tag,
  MessageCircle,
  X,
  User,
  Phone,
  MapPin,
  Send,
} from 'lucide-react';

interface Saree {
  id: string;
  productName: string;
  description?: string;
  price?: number;
  offerPrice?: number;
  image1?: string | null;
  image2?: string | null;
  image3?: string | null;
  category?: { name: string };
}

export default function SareeDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [saree, setSaree] = useState<Saree | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [userDetails, setUserDetails] = useState({
    name: '',
    address: '',
    mobile: '',
  });
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    axios
      .get(`${API_URL}/api/sarees/${id}`)
      .then((res) => setSaree(res.data.saree || res.data))
      .catch(() => setSaree(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-rose-500 border-t-transparent mb-4"></div>
          <p className="text-slate-700 text-lg font-medium">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!saree) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <p className="text-red-600 font-semibold text-lg mb-4">
            Saree not found or deleted.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-rose-500 to-amber-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
          >
            Back to Collections
          </button>
        </div>
      </div>
    );
  }

  const images = [saree.image1, saree.image2, saree.image3].filter(Boolean);
  const discount =
    saree.price && saree.offerPrice
      ? Math.round(((saree.price - saree.offerPrice) / saree.price) * 100)
      : 0;

  const handleWhatsAppSend = () => {
    if (!userDetails.name || !userDetails.mobile || !userDetails.address) {
      setError('Please fill all fields before sending.');
      return;
    }
    if (!/^\d{10}$/.test(userDetails.mobile)) {
      setError('Mobile number must be 10 digits only.');
      return;
    }

    const message = `
👗 Product Enquiry - Matrix Indrani Silks 👗
---------------------------------
Product Name: ${saree.productName}
Category: ${saree.category?.name ?? 'N/A'}
Original Price: ₹${saree.price?.toLocaleString('en-IN')}
Offer Price: ₹${saree.offerPrice?.toLocaleString('en-IN')}
Discount: ${discount}% OFF

---------------------------------
Customer Details:
👤 Name: ${userDetails.name}
📞 Mobile: ${userDetails.mobile}
🏠 Address: ${userDetails.address}
---------------------------------
Please share more info / availability.
`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/918500734632?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
    setShowContact(false);
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setUserDetails({ ...userDetails, mobile: value });
      setError('');
    } else {
      setError('Only numbers allowed, max 10 digits.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-amber-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-white text-slate-700 px-5 py-2.5 rounded-full shadow-md hover:shadow-xl transition-all duration-300 mb-8 font-semibold border border-slate-200"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 group">
              <img
                src={images[selectedImage] || '/no-image.jpg'}
                alt={saree.productName}
                className="w-full h-[500px] lg:h-[600px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-400 to-purple-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  {discount}% OFF
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative bg-white rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index
                        ? 'border-rose-500 shadow-lg scale-105'
                        : 'border-slate-200 hover:border-rose-300'
                    }`}
                  >
                    <img
                      src={img || '/no-image.jpg'}
                      alt={`${saree.productName} ${index + 1}`}
                      className="w-full h-28 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 border border-slate-200">
              <div className="mb-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-600 text-sm font-semibold rounded-full">
                  <Package className="w-4 h-4" />
                  {saree.category?.name ?? 'Uncategorized'}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4 leading-tight">
                {saree.productName}
              </h1>

              {saree.description && (
                <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                  {saree.description}
                </p>
              )}

              <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-5 h-5 text-rose-600" />
                  <span className="text-slate-700 font-semibold">Price Details</span>
                </div>
                <div className="flex items-baseline gap-3 flex-wrap">
                  {saree.offerPrice &&
                  saree.price &&
                  saree.offerPrice < saree.price ? (
                    <>
                      <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                        ₹{saree.offerPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="line-through text-slate-400 text-2xl">
                        ₹{saree.price.toLocaleString('en-IN')}
                      </span>
                      <span className="bg-gradient-to-r from-purple-400 to-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                        Save {discount}%
                      </span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                      ₹{saree.price?.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setShowContact(true)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 text-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Contact Us
              </button>

              <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                <div className="bg-slate-50 rounded-lg p-4 text-center border border-slate-200">
                  <p className="text-slate-600 mb-1">Authentic</p>
                  <p className="font-bold text-slate-800">100% Original</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 text-center border border-slate-200">
                  <p className="text-slate-600 mb-1">Quality</p>
                  <p className="font-bold text-slate-800">Premium Silk</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showContact && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl w-full max-w-md relative animate-fadeIn border border-slate-200">
            <button
              onClick={() => setShowContact(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Connect With Us
              </h3>
              <p className="text-slate-600 text-sm">
                Share your details to inquire about this saree
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <User className="w-4 h-4 text-rose-500" />
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={userDetails.name}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, name: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Phone className="w-4 h-4 text-rose-500" />
                  Mobile Number
                </label>
                <input
                  type="text"
                  placeholder="10-digit mobile number"
                  value={userDetails.mobile}
                  onChange={handleMobileChange}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  Your Address
                </label>
                <textarea
                  placeholder="Enter your delivery address"
                  value={userDetails.address}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, address: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all resize-none"
                  rows={3}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleWhatsAppSend}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold"
                >
                  <Send className="w-4 h-4" />
                  Send via WhatsApp
                </button>
                <button
                  onClick={() => setShowContact(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
