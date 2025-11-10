import { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, FolderTree } from "lucide-react";
import CategoryForm from "../pages/CategoryForm";

interface Category {
  id?: number;
  name: string;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await axios.delete(`${API_URL}/api/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="flex items-center gap-2 mb-3 sm:mb-0">
          <FolderTree className="text-blue-600 w-6 h-6" />
          <h1 className="text-2xl font-semibold text-gray-800">Category Manager</h1>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl hover:scale-105 transform transition-all duration-300 shadow-md"
        >
          <Plus className="w-5 h-5" /> Add Category
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200">
        {loading ? (
          <p className="p-4 text-center text-gray-500">Loading categories...</p>
        ) : categories.length > 0 ? (
          <table className="w-full min-w-[400px]">
            <thead>
              <tr className="bg-gray-50 text-gray-700 text-sm uppercase tracking-wide">
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Category Name</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="p-3">{cat.id}</td>
                  <td className="p-3 font-medium text-gray-800">{cat.name}</td>
                  <td className="p-3 text-center flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(cat)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition"
                      title="Edit Category"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition"
                      title="Delete Category"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-4 text-center text-gray-500">No categories found.</p>
        )}
      </div>

      {/* Modal Form */}
      {isFormOpen && (
        <CategoryForm
          category={selectedCategory}
          onClose={() => setIsFormOpen(false)}
          onSave={fetchCategories}
        />
      )}
    </div>
  );
}
