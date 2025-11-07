import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../config/context/AuthContext';
import { API_ENDPOINTS } from '../config/api';
import type { Saree } from '../types/saree';
import type { Category } from '../types/category';
import { Upload, X } from 'lucide-react';

interface SareeFormProps {
  saree?: Saree;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SareeForm({ saree, onClose, onSuccess }: SareeFormProps) {
  const [productName, setProductName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [rating, setRating] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchCategories();
    if (saree) {
      setProductName(saree.productName);
      setCategoryId(saree.categoryId);
      setPrice(saree.price.toString());
      setOfferPrice(saree.offerPrice?.toString() || '');
      setRating(saree.rating?.toString() || '');
      const imgs = [saree.image1, saree.image2, saree.image3].filter((img): img is string => !!img);
      setExistingImages(imgs);
    }
  }, [saree]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CATEGORIES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const categoriesArray = Array.isArray(data) ? data : [];
        setCategories(categoriesArray);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 3);
      setImages(filesArray);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('productName', productName);
      formData.append('categoryId', categoryId);
      formData.append('price', price);
      if (offerPrice) formData.append('offerPrice', offerPrice);
      if (rating) formData.append('rating', rating);

      images.forEach((image) => {
        formData.append('images', image);
      });

      const url = saree ? API_ENDPOINTS.SAREE_BY_ID(saree.id) : API_ENDPOINTS.SAREES;
      const method = saree ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Operation failed');
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold text-slate-900">
            {saree ? 'Edit Saree' : 'Add New Saree'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Product Name *</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
              placeholder="e.g., Banarasi Silk Saree"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Price *</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Offer Price</label>
              <input
                type="number"
                step="0.01"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
              placeholder="0.0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Images (up to 3)
            </label>

            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-2">Current Images:</p>
                <div className="grid grid-cols-3 gap-2">
                  {existingImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Existing ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-slate-200"
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">Upload new images to replace these</p>
              </div>
            )}

            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <label className="cursor-pointer">
                <span className="text-sm text-slate-600">
                  Click to upload or drag and drop
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {images.length > 0 && (
                <p className="text-sm text-slate-700 mt-2">
                  {images.length} file{images.length > 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : saree ? 'Update Saree' : 'Create Saree'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
