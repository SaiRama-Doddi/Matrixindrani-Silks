import { useState, useEffect } from 'react';
import { useAuth } from '../config/context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import { Plus, Edit, Trash2 } from 'lucide-react';
import type { Category } from '../types/category';

interface CategoryListProps {
  onEdit: (category: Category) => void;
  onCreate: () => void;
}

export default function CategoryList({ onEdit, onCreate }: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.CATEGORIES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      const categoriesArray = Array.isArray(data) ? data : [];
      setCategories(categoriesArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(API_ENDPOINTS.CATEGORY_BY_ID(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete category');
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

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
        <h2 className="text-2xl font-bold text-slate-900">Categories</h2>
        <button
          onClick={onCreate}
          className="bg-slate-900 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">{error}</div>
      )}

      {categories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-300">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No categories found</h3>
          <p className="text-slate-600 mb-6">Start by adding your first category</p>
          <button
            onClick={onCreate}
            className="bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition"
          >
            Add First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white border border-slate-200 rounded-xl p-4 flex justify-between items-center hover:shadow-md transition">
              <span className="text-slate-900 font-medium">{cat.name}</span>
              <div className="flex gap-2">
                <button onClick={() => onEdit(cat)} className="p-2 bg-slate-100 rounded hover:bg-slate-200 transition">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
