import { useState, useEffect } from 'react';
import { useAuth } from '../config/context/AuthContext';
import type { Saree } from '../types/saree';
import { API_ENDPOINTS } from '../config/api';
import { Plus, Edit, Trash2, Star, Package } from 'lucide-react';

interface SareeListProps {
  sarees: Saree[];
  setSarees: React.Dispatch<React.SetStateAction<Saree[]>>;
  onEdit: (saree: Saree) => void;
  onCreate: () => void;
}


export default function SareeList({ onEdit, onCreate }: SareeListProps) {
  const [sarees, setSarees] = useState<Saree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const fetchSarees = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.SAREES, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch sarees');

      const data = await response.json();
      const sareesArray = Array.isArray(data) ? data : Array.isArray(data.sarees) ? data.sarees : [];
      setSarees(sareesArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sarees');
      setSarees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSarees();
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saree?')) return;

    try {
      const response = await fetch(API_ENDPOINTS.SAREE_BY_ID(id), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete saree');

      setSarees(sarees.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete saree');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Saree Inventory</h2>
          <p className="text-slate-600 mt-1">{sarees.length} products available</p>
        </div>
        <button
          onClick={onCreate}
          className="bg-slate-900 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition"
        >
          <Plus className="w-5 h-5" />
          Add New Saree
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {sarees.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-300">
          <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No sarees found</h3>
          <p className="text-slate-600 mb-6">Start by adding your first saree to the inventory</p>
          <button
            onClick={onCreate}
            className="bg-slate-900 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 hover:bg-slate-800 transition"
          >
            <Plus className="w-5 h-5" />
            Add First Saree
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sarees.map((saree) => (
            <div
              key={saree.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition"
            >
              <div className="aspect-square bg-slate-100 relative">
                {saree.image1 ? (
                  <img
                    src={saree.image1}
                    alt={saree.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-16 h-16 text-slate-300" />
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {saree.productName}
                </h3>
                <p className="text-sm text-slate-600 mb-3">
                  {saree.category?.name || 'No Category'}
                </p>

                <div className="flex items-center gap-2 mb-3">
                  {saree.offerPrice ? (
                    <>
                      <span className="text-2xl font-bold text-slate-900">
                        ₹{saree.offerPrice.toFixed(2)}
                      </span>
                      <span className="text-sm text-slate-500 line-through">
                        ₹{saree.price.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-slate-900">
                      ₹{saree.price.toFixed(2)}
                    </span>
                  )}
                </div>

                {saree.rating && (
                  <div className="flex items-center gap-1 mb-4">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-slate-700">{saree.rating}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(saree)}
                    className="flex-1 bg-slate-100 text-slate-900 py-2 rounded-lg hover:bg-slate-200 transition flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(saree.id)}
                    className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
