import { useState } from 'react';
import { AuthProvider, useAuth } from './config/context/AuthContext';
import Login from './pages/Login';
import SareeList from './pages/SareeList';
import SareeForm from './pages/SareeForm';
import DashboardLayout from './compoenents/DashboardLayout';
import type { Saree } from './types/saree';
import type { Category } from './types/category'; // create a type for Category
import CategoryList from './pages/CategoryList';
import CategoryForm from './pages/CategoryForm';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingSaree, setEditingSaree] = useState<Saree | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);
const [showCategoryForm, setShowCategoryForm] = useState(false);
const [editingCategory, setEditingCategory] = useState<Category | undefined>();
const [refreshCategoryKey, setRefreshCategoryKey] = useState(0);

const [sarees, setSarees] = useState<Saree[]>([]);
const handleEditCategory = (category: any) => {
  setEditingCategory(category as Category);
  setShowCategoryForm(true);
};

const handleCreateCategory = () => {
  setEditingCategory(undefined);
  setShowCategoryForm(true);
};

const handleCloseCategoryForm = () => {
  setShowCategoryForm(false);
  setEditingCategory(undefined);
};

const handleCategorySuccess = () => {
  setShowCategoryForm(false);
  setEditingCategory(undefined);
  setRefreshCategoryKey((prev) => prev + 1);
};

const handleEdit = (saree: Saree) => {
  setEditingSaree(saree);
  setShowForm(true);
};

const handleCreate = () => {
  setEditingSaree(undefined);
  setShowForm(true);
};

const handleClose = () => {
  setShowForm(false);
  setEditingSaree(undefined);
};

// 🔥 New handleSuccess function — updates only edited or newly added saree
const handleSuccess = (updatedSaree?: Saree) => {
  setShowForm(false);
  setEditingSaree(undefined);

  if (updatedSaree) {
    setSarees((prev) => {
      const exists = prev.find((s) => s.id === updatedSaree.id);
      if (exists) {
        // Update existing saree
        return prev.map((s) => (s.id === updatedSaree.id ? updatedSaree : s));
      } else {
        // Add new saree
        return [updatedSaree, ...prev];
      }
    });
  }
};

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
  <DashboardLayout>
  {/* Sarees */}
<SareeList
  sarees={sarees}
  setSarees={setSarees}
  onEdit={handleEdit}
  onCreate={handleCreate}
/>
{showForm && (
  <SareeForm
    saree={editingSaree}
    onClose={handleClose}
    onSuccess={handleSuccess}
  />
)}


  {/* Categories */}
  <CategoryList
    key={refreshCategoryKey}
    onEdit={handleEditCategory}
    onCreate={handleCreateCategory}
  />
  {showCategoryForm && (
    <CategoryForm
      category={editingCategory}
      onClose={handleCloseCategoryForm}
      onSuccess={handleCategorySuccess}
    />
  )}
</DashboardLayout>

  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
