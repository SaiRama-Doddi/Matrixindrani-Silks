import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../config/context/AuthContext';
import type { Saree } from '../types/saree';
import { API_ENDPOINTS } from '../config/api';
import { X, Upload} from 'lucide-react';
 
interface SareeFormProps {
  saree?: Saree;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SareeForm({ saree, onClose, onSuccess }: SareeFormProps) {
const [formData, setFormData] = useState({
  productName: '',
  categoryId: '',
  price: '',
  offerPrice: '',
  rating: '',
});

  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();
const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.CATEGORIES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const catArray = Array.isArray(data) ? data : data.categories || [];
      setCategories(catArray);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  fetchCategories();
}, [token]);

  useEffect(() => {
    if (saree) {
      setFormData({
        productName: saree.productName,
     categoryId: saree.categoryId || '',

        price: saree.price.toString(),
        offerPrice: saree.offerPrice?.toString() || '',
        rating: saree.rating?.toString() || '',
      });

      const existingImages = [saree.image1, saree.image2, saree.image3].filter(
        (url): url is string => !!url
      );
      setPreviewUrls(existingImages);
    }
  }, [saree]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 3) {
      alert('You can only upload up to 3 images');
      return;
    }

    setImages([...images, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);

    if (previewUrls[index].startsWith('blob:')) {
      URL.revokeObjectURL(previewUrls[index]);
    }

    setImages(newImages);
    setPreviewUrls(newPreviews);
  };

 const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const formDataToSend = new FormData();
    formDataToSend.append('productName', formData.productName);
    formDataToSend.append('category', formData.categoryId);

    // Convert to numbers
  formDataToSend.append('price', Number(formData.price).toString());
if (formData.offerPrice) formDataToSend.append('offerPrice', Number(formData.offerPrice).toString());
if (formData.rating) formDataToSend.append('rating', formData.rating); 



    images.forEach((image) => {
      formDataToSend.append('images', image);
    });

    const url = saree ? API_ENDPOINTS.SAREE_BY_ID(saree.id) : API_ENDPOINTS.SAREES;
    const method = saree ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formDataToSend,
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">
            {saree ? 'Edit Saree' : 'Add New Saree'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
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
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
              placeholder="e.g., Silk Saree with Golden Border"
            />
          </div>

          <div>
            <select
  value={formData.categoryId}
  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Offer Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.offerPrice}
                onChange={(e) => setFormData({ ...formData, offerPrice: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Rating
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
              placeholder="0.0 - 5.0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Images (up to 3)
            </label>

            {previewUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border border-slate-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {previewUrls.length < 3 && (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-8 cursor-pointer hover:border-slate-400 transition">
                <Upload className="w-12 h-12 text-slate-400 mb-2" />
                <span className="text-sm text-slate-600 mb-1">Click to upload images</span>
                <span className="text-xs text-slate-500">PNG, JPG up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
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
