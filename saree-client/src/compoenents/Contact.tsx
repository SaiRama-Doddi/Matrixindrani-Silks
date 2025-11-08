import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState, type FormEvent, type ChangeEvent } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // 💜 Validation
  const validateForm = () => {
    const newErrors = { name: "", email: "", phone: "", message: "" };

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  // 📱 Only allow digits for phone number
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setFormData({ ...formData, phone: value });
    }
  };

  // 💬 Send WhatsApp Message on Submit
   const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const whatsappMessage = `Hello Matrixindarani Silks 👋\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nMessage: ${formData.message}`;
      const whatsappURL = `https://wa.me/916303130025?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappURL, "_blank");
      setFormData({ name: "", email: "", phone: "", message: "" });
    }
  };

  return (
    <div className="mt-10 mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-[#E6E6FA] to-[#D8BFD8]">
      {/* 🌸 Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#9370DB] to-[#BA55D3] bg-clip-text text-transparent">
          Get in Touch
        </h1>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto">
          Have questions? We'd love to hear from you — reach us directly through
          WhatsApp or the form below.
        </p>
      </div>

      {/* 💠 Main Grid */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Left Info Section */}
        <div className="space-y-8">
          <div className="bg-[#F3E8FF] rounded-2xl p-8 shadow-md border border-[#E6E6FA]">
            <h2 className="text-2xl font-bold text-[#4B0082] mb-6">
              Contact Information
            </h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#9370DB] rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#4B0082] mb-1">Phone</h3>
                  <p className="text-gray-700">+91 63031 30025</p>
                  <p className="text-gray-700">+91 98765 43211</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#9370DB] rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#4B0082] mb-1">Email</h3>
                  <p className="text-gray-700">info@matrixindaranisilks.com</p>
                  <p className="text-gray-700">support@matrixindaranisilks.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#9370DB] rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#4B0082] mb-1">Address</h3>
                  <p className="text-gray-700">
                    Matrixindarani Silks Store<br />
                    Silk Market Street, Hyderabad<br />
                    Telangana, India - 500001
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-[#E6E6FA] rounded-2xl h-64 flex items-center justify-center text-gray-500 text-sm border border-[#D8BFD8]">
            Map Location Placeholder
          </div>
        </div>

        {/* Right Contact Form */}
        <div>
          <form
            onSubmit={handleSubmit}
            className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-8 space-y-6 border border-[#E6E6FA]"
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-[#4B0082] mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#C3B1E1] focus:ring-[#9370DB]"
                }`}
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#4B0082] mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#C3B1E1] focus:ring-[#9370DB]"
                }`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-[#4B0082] mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={handlePhoneChange}
                maxLength={10}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  errors.phone
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#C3B1E1] focus:ring-[#9370DB]"
                }`}
                placeholder="9876543210"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-[#4B0082] mb-2">
                Message *
              </label>
              <textarea
                rows={5}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
                  errors.message
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[#C3B1E1] focus:ring-[#9370DB]"
                }`}
                placeholder="Tell us how we can help you..."
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#9370DB] to-[#BA55D3] text-white rounded-xl font-semibold text-lg hover:from-[#836FFF] hover:to-[#C07DFF] transition-all duration-200 shadow-md hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>Send on WhatsApp</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}