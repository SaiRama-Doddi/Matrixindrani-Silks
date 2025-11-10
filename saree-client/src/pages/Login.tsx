import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../config/context/AuthContext";
import { Eye, EyeOff, ShoppingBag } from "lucide-react";
import Navbar from "../compoenents/Navbar";
import LavenderFooter from "../compoenents/Footer";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);

      // ✅ Store admin login info in localStorage
      localStorage.setItem("admin", email);

      // ✅ Dispatch custom event so Navbar updates immediately
      window.dispatchEvent(new Event("authChange"));

      navigate("/admin");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-lavender-200 flex items-center justify-center p-4 pt-24">
        <div className="max-w-md w-full">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-purple-100 p-10 transition-all hover:shadow-purple-200/50">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-4 rounded-full shadow-md">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
            </div>

            <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-2">
              Welcome Back
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Sign in to your{" "}
              <span className="text-purple-600 font-semibold">Admin Dashboard</span><br/>
               <span className="text-red-500 font-semibold">Only Admin Login</span>

            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all outline-none placeholder-purple-300"
                  placeholder="admin@example.com"
                  required
                />
              </div>

              <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all outline-none placeholder-purple-300"
        placeholder="••••••••"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
      >
        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>

          {/* <p className="text-center text-gray-600 mt-6 text-sm">
            <span className="text-purple-700 font-semibold">MatrixIndrani Silks</span> Admin Dashboard
          </p> */}
        </div>
      </div>

      <LavenderFooter />
    </>
  );
}