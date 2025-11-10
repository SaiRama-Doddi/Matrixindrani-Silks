import { Facebook, Instagram, Youtube, Phone, Mail, Heart } from "lucide-react";

export default function LavenderFooter() {
  return (
    <footer className="bg-gradient-to-br from-purple-100 via-purple-200 to-purple-50 text-gray-800 border-t border-purple-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section */}
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          {/* Contact Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="https://res.cloudinary.com/dt2byhqyh/image/upload/v1762434788/Matrix_logo_qnor8g.jpg"
                alt="Matrixindarani Silks"
                className="w-28 h-16 object-contain"
              />
            </div>
            <div className="flex items-center space-x-2 text-purple-700 mb-2">
              <Phone className="w-5 h-5" />
              <p className="text-lg font-semibold">+91 91217855422</p>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <Mail className="w-5 h-5 text-purple-700" />
              <p className="text-sm">matrixindaranisilks@gmail.com</p>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 mb-3">
              <li><a href="#" className="hover:text-purple-700">Track Your Order</a></li>
              <li><a href="#" className="hover:text-purple-700">Stores</a></li>
            </ul>

            <div className="flex space-x-3 mt-4">
              <a href="#" className="bg-purple-200 p-2 rounded-full hover:bg-purple-400 transition">
                <Facebook className="w-4 h-4 text-purple-800" />
              </a>
              <a href="#" className="bg-purple-200 p-2 rounded-full hover:bg-purple-400 transition">
                <Instagram className="w-4 h-4 text-purple-800" />
              </a>
              <a href="#" className="bg-purple-200 p-2 rounded-full hover:bg-purple-400 transition">
                <Youtube className="w-4 h-4 text-purple-800" />
              </a>
            </div>
          </div>

          {/* Shop Section */}
          <div>
            <h3 className="font-semibold text-lg text-purple-800 border-b-2 border-purple-400 inline-block mb-3">
              Shop
            </h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="#" className="hover:text-purple-700">Festive</a></li>
              <li><a href="#" className="hover:text-purple-700">Wedding</a></li>
              <li><a href="#" className="hover:text-purple-700">Party</a></li>
              <li><a href="#" className="hover:text-purple-700">Video Call Shopping</a></li>
            </ul>
          </div>

          {/* Info Section */}
          <div>
            <h3 className="font-semibold text-lg text-purple-800 border-b-2 border-purple-400 inline-block mb-3">
              Get to Know Us
            </h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="#" className="hover:text-purple-700">FAQ</a></li>
              <li><a href="#" className="hover:text-purple-700">Blog</a></li>
              <li><a href="#" className="hover:text-purple-700">Awards</a></li>
              <li><a href="#" className="hover:text-purple-700">Media</a></li>
              <li><a href="#" className="hover:text-purple-700">Virtual Tour</a></li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
  <h3 className="font-semibold text-lg text-purple-800 border-b-2 border-purple-400 inline-block mb-3">
    Our Address
  </h3>
  <p className="text-gray-600 text-sm mb-3">
    Visit us at our store for the latest saree collections and special offers.
  </p>
  <div className=" p-4 text-gray-700">
    <p className="font-medium">Matrix Indrani Silks</p>
    <p>Exclusive Kanchivaram Sarees</p>
    <p>12/1,5th Floor,Hannurappa Lane,Siddanna Lane,Bangalore - 560002</p>
    <p className="mt-2 text-purple-700 font-semibold">📞 +91 9121785422</p>
  </div>
</div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-purple-200 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2025 Matrixindarani Silks. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-2 md:mt-0">
            <a href="#" className="hover:text-purple-700">Privacy Policy</a>
            <a href="#" className="hover:text-purple-700">Terms & Conditions</a>
            <a href="#" className="hover:text-purple-700">Return Policy</a>
          </div>
        </div>

        {/* StaffArc Credit Section */}
        <div className="border-t border-purple-300 mt-8 pt-6 text-center text-sm text-gray-600">
          <div className="flex justify-center items-center gap-2">
            Made with <Heart className="inline h-4 w-4 text-red-500 mx-1" /> by
            <a
              href="https://staffarc.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-orange-600 hover:underline"
            >
              <img
                src="https://www.staffarc.in/images/Staffarc-logo.png"
                alt="StaffArc logo"
                className="h-5 w-5 object-contain"
              />
              <span className="font-semibold">StaffArc</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}