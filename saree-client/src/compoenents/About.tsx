import { Award, Heart, Users, Sparkles } from "lucide-react";

export default function About() {
  return (
    <div className="bg-gradient-to-b from-[#E6E6FA] to-[#D8BFD8] text-gray-800 py-16 px-6 md:px-12">
      {/* 🌸 Title Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-700 to-purple-400 bg-clip-text text-transparent mb-4">
          About Matrixindarani Silks
        </h1>
        <p className="text-lg text-purple-700 max-w-2xl mx-auto">
          Where tradition meets elegance — curating timeless handwoven sarees crafted by India’s finest artisans.
        </p>
      </div>

      {/* 🌷 Our Story */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="flex justify-center">
          <img
            src="https://images.pexels.com/photos/3738087/pexels-photo-3738087.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Matrixindarani Silks Story"
            className="rounded-3xl shadow-2xl border-4 border-purple-200 w-[450px] h-[550px] object-cover hover:scale-[1.02] transition-transform duration-500"
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-purple-800">Our Story</h2>
          <p className="leading-relaxed text-gray-700">
            Matrixindarani Silks began its journey with a deep-rooted passion for preserving the art of silk weaving. 
            What started as a small family initiative has grown into a beloved brand that celebrates India's craftsmanship.
          </p>
          <p className="leading-relaxed text-gray-700">
            We work directly with artisans and weavers to bring authentic designs to life — ensuring fair trade, 
            ethical practices, and sustainable fashion choices for our customers.
          </p>
        </div>
      </div>

      {/* 💠 Stats Section */}
      <div className="grid md:grid-cols-4 gap-8 mb-20">
        {[
          { icon: Award, number: "35+", label: "Years of Heritage" },
          { icon: Users, number: "60K+", label: "Happy Customers" },
          { icon: Heart, number: "800+", label: "Artisan Partners" },
          { icon: Sparkles, number: "1500+", label: "Unique Designs" },
        ].map(({ icon: Icon, number, label }, index) => (
          <div
            key={index}
            className="text-center bg-white/60 backdrop-blur-md border border-purple-200 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-500"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-purple-800">{number}</h3>
            <p className="text-gray-600">{label}</p>
          </div>
        ))}
      </div>

      {/* 🌿 Our Philosophy Section */}
      <div className="bg-white/60 border border-purple-200 backdrop-blur-md rounded-3xl p-10 md:p-16 shadow-xl">
        <h2 className="text-3xl font-bold text-center text-purple-800 mb-10">
          Our Values
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-50 to-purple-100 hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-purple-700 mb-3">
              ✨ Quality & Craft
            </h3>
            <p className="text-gray-700">
              Each saree is carefully crafted and inspected for quality, ensuring
              you receive only the finest silk artistry.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-50 to-purple-100 hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-purple-700 mb-3">
              💜 Authenticity
            </h3>
            <p className="text-gray-700">
              Our collections are exclusively handwoven, preserving authentic
              Indian weaving traditions across generations.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-50 to-purple-100 hover:shadow-md transition">
            <h3 className="text-xl font-semibold text-purple-700 mb-3">
              🌱 Sustainability
            </h3>
            <p className="text-gray-700">
              We embrace eco-friendly production, ethical sourcing, and fair
              wages for artisans — fashion that cares for the planet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}