import { useState } from 'react';
import { AuthProvider, useAuth } from './config/context/AuthContext';
import Login from './pages/Login';
import SareeList from './pages/SareeList';
import SareeForm from './pages/SareeForm';
import DashboardLayout from './compoenents/DashboardLayout';
import type { Saree } from './types/saree';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingSaree, setEditingSaree] = useState<Saree | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

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

  const handleSuccess = () => {
    setShowForm(false);
    setEditingSaree(undefined);
    setRefreshKey((prev) => prev + 1);
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <DashboardLayout>
      <SareeList key={refreshKey} onEdit={handleEdit} onCreate={handleCreate} />
      {showForm && (
        <SareeForm saree={editingSaree} onClose={handleClose} onSuccess={handleSuccess} />
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
