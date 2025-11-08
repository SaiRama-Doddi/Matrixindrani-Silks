import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../config/context/AuthContext';
import { ShoppingBag } from 'lucide-react';
import Navbar from '../compoenents/Navbar';
import LavenderFooter from '../compoenents/Footer'; // ✅ Keep same footer

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ✅ Navbar */}
      <Navbar />
      

      {/* ✅ Add top padding so content starts below navbar */}
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-lavender-200 flex items-center justify-center p-4 pt-24">
        <div className="max-w-md w-full">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-purple-100 p-10 transition-all hover:shadow-purple-200/50">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-4 rounded-full shadow-md">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-2">
              Welcome Back
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Sign in to your <span className="text-purple-600 font-semibold">Admin Dashboard</span>
            </p>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 shadow-sm">
                {error}
              </div>
            )}

            {/* Form */}
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

              <div>
                <label className="block text-sm font-medium text-purple-800 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all outline-none placeholder-purple-300"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="text-center text-gray-600 mt-6 text-sm">
            <span className="text-purple-700 font-semibold">MatrixIndrani Silks</span> Admin Dashboard
          </p>
        </div>
      </div>

      {/* ✅ Footer */}
      <LavenderFooter />
    </>
  );
}
