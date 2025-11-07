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
  const API_URL = import.meta.env.VITE_API_URL ;

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
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[350px] p-6">
        <h2 className="text-xl font-semibold mb-4">
          {category ? "Edit Category" : "Add Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-70"
            >
              {loading ? "Saving..." : category ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
