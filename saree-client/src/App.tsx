import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './config/context/AuthContext';
import { ProtectedRoute } from './compoenents/ProtectedRoute';
import { Layout } from './compoenents/DashboardLayout';
import { Login } from './pages/Login';
import { Sarees } from './pages/SareeList';
import CategoryForm from './pages/CategoryList';
import Navbar from './compoenents/Navbar';
import HeroCarousel from './compoenents/HeroCarousel';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hero" element={<HeroCarousel onViewProducts={function (): void {
            throw new Error('Function not implemented.');
          } } />} />

        
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Sarees />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Layout>
                  <CategoryForm />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
