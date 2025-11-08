import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../compoenents/Navbar";
import Footer from "../compoenents/Footer";

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
  const [userDetails, setUserDetails] = useState({
    name: "",
    address: "",
    mobile: "",
  });
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    axios
      .get(`${API_URL}/api/sarees/${id}`)
      .then((res) => setSaree(res.data.saree || res.data))
      .catch(() => setSaree(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <p className="text-center py-10 text-gray-600">Loading...</p>;
  if (!saree)
    return (
      <p className="text-center py-10 text-red-600">
        Saree not found or deleted.
      </p>
    );

  const images = [saree.image1, saree.image2, saree.image3].filter(Boolean);
  const discount =
    saree.price && saree.offerPrice
      ? Math.round(((saree.price - saree.offerPrice) / saree.price) * 100)
      : 0;

  // ✅ WhatsApp Message
  const handleWhatsAppSend = () => {
    if (!userDetails.name || !userDetails.mobile || !userDetails.address) {
      setError("Please fill all fields before sending.");
      return;
    }
    if (!/^\d{10}$/.test(userDetails.mobile)) {
      setError("Mobile number must be 10 digits only.");
      return;
    }

    const message = `
👗 Product Enquiry - Matrix Indrani Silks 👗
---------------------------------
Product Name: ${saree.productName}
Category: ${saree.category?.name ?? "N/A"}
Original Price: ₹${saree.price?.toLocaleString("en-IN")}
Offer Price: ₹${saree.offerPrice?.toLocaleString("en-IN")}
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
    window.open(whatsappURL, "_blank");
  };

  // ✅ Mobile Input Validation
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setUserDetails({ ...userDetails, mobile: value });
      setError("");
    } else {
      setError("Only numbers allowed, max 10 digits.");
    }
  };

  return (
    <div className="mt-14 bg-gray-50 min-h-screen flex flex-col">
      <Navbar />

      {/* ✅ Saree Details */}
      <main className="flex-grow p-4 sm:p-8 max-w-5xl mx-auto w-full">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          ← Back
        </button>

        {/* ✅ Images Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {images.length > 0 ? (
            images.map((img, index) => (
              <img
                key={index}
                src={img || "/no-image.jpg"}
                alt={`Saree ${index + 1}`}
                className="w-full h-72 object-cover rounded-xl shadow-md"
              />
            ))
          ) : (
            <img
              src="/no-image.jpg"
              alt="No image"
              className="w-full h-72 object-cover rounded-xl shadow-md"
            />
          )}
        </div>

        {/* ✅ Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-purple-600 mb-2">
            {saree.productName}
          </h2>
          <p className="text-gray-600 mb-4">
            {saree.category?.name ?? "Uncategorized"}
          </p>

          <div className="flex justify-center gap-3 items-center mb-3">
            {saree.offerPrice && saree.price && saree.offerPrice < saree.price ? (
              <>
                <span className="text-purple-600 text-xl font-bold">
                  ₹{saree.offerPrice.toLocaleString("en-IN")}
                </span>
                <span className="line-through text-gray-500">
                  ₹{saree.price.toLocaleString("en-IN")}
                </span>
                <span className="bg-purple-100 text-purple-600 text-sm font-semibold px-2 py-1 rounded">
                  {discount}% OFF
                </span>
              </>
            ) : (
              <span className="text-purple-600 text-xl font-bold">
                ₹{saree.price?.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {saree.description && (
            <p className="text-gray-600 mb-4">{saree.description}</p>
          )}

          <button
            onClick={() => setShowContact(true)}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Contact
          </button>
        </div>
      </main>

      {/* ✅ Popup Contact Form */}
      {showContact && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-80 sm:w-96 relative animate-fadeIn">
            <button
              onClick={() => setShowContact(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-purple-600 text-xl font-bold"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold text-purple-600 mb-4 text-center">
              Connect With Us
            </h3>

            <input
              type="text"
              placeholder="Your Name"
              value={userDetails.name}
              onChange={(e) =>
                setUserDetails({ ...userDetails, name: e.target.value })
              }
              className="w-full border border-purple-300 rounded-lg p-2 mb-3 focus:ring-2 focus:ring-purple-500 outline-none"
            />

            <input
              type="text"
              placeholder="Mobile Number"
              value={userDetails.mobile}
              onChange={handleMobileChange}
              className="w-full border border-purple-300 rounded-lg p-2 mb-3 focus:ring-2 focus:ring-purple-500 outline-none"
            />

            <textarea
              placeholder="Your Address"
              value={userDetails.address}
              onChange={(e) =>
                setUserDetails({ ...userDetails, address: e.target.value })
              }
              className="w-full border border-purple-300 rounded-lg p-2 mb-4 focus:ring-2 focus:ring-purple-500 outline-none"
              rows={3}
            />

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <div className="flex justify-between">
              <button
                onClick={handleWhatsAppSend}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                WhatsApp
              </button>
              <button
                onClick={() => setShowContact(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}