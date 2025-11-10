import { useEffect, useState } from "react";
import { Trash2, ArrowLeft, Plus, Minus } from "lucide-react";
import Navbar from "../compoenents/Navbar";
import LavenderFooter from "../compoenents/Footer";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", address: "" });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
  }, []);

  const removeItem = (id: string) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQuantity = (id: string, type: "inc" | "dec") => {
    const updated = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity:
              type === "inc" ? item.quantity + 1 : Math.max(1, item.quantity - 1),
          }
        : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleBookNow = () => {
    setShowPopup(true);
  };

  const handleSendWhatsApp = () => {
    if (!form.name || !form.contact || !form.address) {
      alert("Please fill all fields before sending!");
      return;
    }

    if (!/^\d{10}$/.test(form.contact)) {
      alert("Please enter a valid 10-digit mobile number!");
      return;
    }

    const message = `🛍 New Order from Retro Ruchulu\n\n👤 Name: ${form.name}\n📞 Contact: ${form.contact}\n🏠 Address: ${form.address}\n\n🧾 Order Details:\n${cart
      .map(
        (i) =>
          `• ${i.name} - ₹${i.price.toLocaleString("en-IN")} × ${i.quantity} = ₹${
            i.price * i.quantity
          }`
      )
      .join("\n")}\n\n💰 Total: ₹${total.toLocaleString("en-IN")}`;

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/916303130025?text=${encoded}`;
    window.open(url, "_blank");
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex flex-col">
      {/* 🌸 Navbar */}
      <Navbar />

      {/* 🛒 Cart Section */}
      <main className="flex-grow pt-28 px-6 mb-10">
        {/* 🔙 Back Button */}
        <div className="max-w-4xl mx-auto mb-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium transition-all"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>

        <h1 className="text-3xl font-bold text-purple-700 mb-8 text-center">
          Your Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">Your cart is empty.</p>
        ) : (
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-gray-100 py-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      ₹{item.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, "dec")}
                    className="bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, "inc")}
                    className="bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full w-8 h-8 flex items-center justify-center"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}

            <div className="text-right mt-6 text-xl font-semibold text-purple-700">
              Total: ₹{total.toLocaleString("en-IN")}
            </div>

            <div className="text-center mt-6">
              <button
                onClick={handleBookNow}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl shadow-md font-semibold transition-all"
              >
                Book Now
              </button>
            </div>
          </div>
        )}
      </main>

      <LavenderFooter />

      {/* 💬 Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-80 relative animate-fadeIn">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold text-purple-700 mb-4 text-center">
              Enter Details
            </h2>
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-lg p-2 mb-3 focus:ring-2 focus:ring-purple-300"
            />
            <input
              type="tel"
              placeholder="Contact Number"
              maxLength={10}
              value={form.contact}
              onChange={(e) =>
                setForm({ ...form, contact: e.target.value.replace(/\D/g, "") })
              }
              className="w-full border rounded-lg p-2 mb-3 focus:ring-2 focus:ring-purple-300"
            />
            <textarea
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border rounded-lg p-2 mb-4 h-20 focus:ring-2 focus:ring-purple-300"
            />
            <button
              onClick={handleSendWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium"
            >
              Send via WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}