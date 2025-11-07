import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./config/context/AuthContext";
import { ProtectedRoute } from "./compoenents/ProtectedRoute";
import { Layout } from "./compoenents/DashboardLayout";
import { Login } from "./pages/Login";
import { Sarees } from "./pages/SareeList";
import CategoryForm from "./pages/CategoryList";
import Home from "./pages/Home"; // ✅ Import your Home page

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ✅ Public Routes */}
          
          <Route path="/" element={<Home  />} />
          <Route path="/login" element={<Login />} />


          {/* ✅ Protected Admin Routes */}
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

          {/* ✅ Redirect unknown paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
