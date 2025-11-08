import { useState, useEffect } from "react";
import axios from "axios";

interface Category {
  id?: number;
  name: string;
}

interface CategoryFormProps {
  category?: Category | null;
  onClose: () => void;
  onSave: () => void;
}

export default function CategoryForm({ category, onClose, onSave }: CategoryFormProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  // Load existing category for edit
  useEffect(() => {
    if (category) setName(category.name);
    else setName("");
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Category name is required");

    setLoading(true);
    try {
      if (category) {
        // Update
        await axios.put(`${API_URL}/api/categories/${category.id}`, { name });
      } else {
        // Add
        await axios.post(`${API_URL}/api/categories`, { name });
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl w-[400px] max-w-full p-6 transform transition-transform duration-300 scale-100 hover:scale-105">
        <h2 className="text-2xl font-bold text-gray-800 mb-5 text-center">
          {category ? "Edit Category" : "Add Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gradient-to-r focus:ring-purple-500/70 shadow-sm transition"
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition font-medium shadow-md disabled:opacity-70"
            >
              {loading ? "Saving..." : category ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}