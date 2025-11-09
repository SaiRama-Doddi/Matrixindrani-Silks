import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./config/context/AuthContext";
import { ProtectedRoute } from "./compoenents/ProtectedRoute";
import { Dashboard } from "./compoenents/Dashboard";
import { Login } from "./pages/Login";
import Home from "./pages/Home";
import SareeDetails from "./pages/SareeDetails";
import Navbar from "./compoenents/Navbar";
import Footer from "./compoenents/Footer";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ✅ Public Routes */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            }
          />
          <Route path="/about" element={<Home />} />
          <Route path="/gallery" element={<Home />} />
          <Route path="/contact" element={<Home />} />
          <Route path="/products" element={<Home />} />
          <Route path="/saree/:id" element={<SareeDetails />} />
          <Route path="/login" element={<Login />} />

          {/* ✅ Admin Routes */}
          <Route
            path="/admin"
            element={
            
              <ProtectedRoute>
                  <Navbar/>
                <Dashboard />
                <Footer/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute>
                <Navbar/>
                <Dashboard/>
                <Footer/>
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
