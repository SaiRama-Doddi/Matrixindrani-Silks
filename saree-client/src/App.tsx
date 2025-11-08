import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./config/context/AuthContext";
import { ProtectedRoute } from "./compoenents/ProtectedRoute";
import { Layout } from "./compoenents/DashboardLayout";
import { Login } from "./pages/Login";
import { Sarees } from "./pages/SareeList";
import CategoryForm from "./pages/CategoryList";
import Home from "./pages/Home";
import SareeDetails from "./pages/SareeDetails";

function App() {
  return (
    <BrowserRouter>
    
      <AuthProvider>
        <Routes>
          {/* ✅ All routes handled inside Home */}
          <Route path="/" element={<Home />} />
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
                <Layout>
                  <Sarees />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute>
                <Layout>
                  <CategoryForm />
                </Layout>
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
