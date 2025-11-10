import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface Saree {
  id: string;
  productName: string;
  price: number;
  offerPrice: number | null;
  rating: number | null;
  image1: string | null;
  image2: string | null;
  image3: string | null;
  category: Category | null;
  categoryId: string | null;
  createdAt: string;
}

export function Sarees() {
  const [sarees, setSarees] = useState<Saree[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSaree, setEditingSaree] = useState<Saree | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    productName: '',
    categoryId: '',
    price: '',
    offerPrice: '',
    rating: '',
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<(string | null)[]>([]);



    const API_URL = import.meta.env.VITE_API_URL ;
  useEffect(() => {
    fetchSarees();
    fetchCategories();
  }, []);

  const fetchSarees = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/sarees`);
      setSarees(response.data.sarees);
    } catch (err) {
      console.error('Error fetching sarees:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };


/*
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('productName', formData.productName);
      data.append('categoryId', formData.categoryId);
      data.append('price', formData.price);
      if (formData.offerPrice) data.append('offerPrice', formData.offerPrice);
      if (formData.rating) data.append('rating', formData.rating);

      imageFiles.forEach((file) => {
        data.append('images', file);
      });

      if (editingSaree) {
        await axios.put(`${API_URL}/api/sarees/${editingSaree.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post(`${API_URL}/api/sarees`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      fetchSarees();
      closeModal();
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
*/


  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saree?')) return;

    try {
      await axios.delete(`${API_URL}/api/sarees/${id}`);
      fetchSarees();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete saree');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imagePreviews.length > 3) {
      alert('Maximum 3 images allowed');
      return;
    }

    setImageFiles([...imageFiles, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    imagePreviews[index] && URL.revokeObjectURL(imagePreviews[index]);

    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const removeExistingImage = (index: number) => {
    const newExisting = [...existingImages];
    newExisting[index] = null;
    setExistingImages(newExisting);
  };

  const openModal = (saree?: Saree) => {
    if (saree) {
      setEditingSaree(saree);
      setFormData({
        productName: saree.productName,
        categoryId: saree.categoryId || '',
        price: saree.price.toString(),
        offerPrice: saree.offerPrice?.toString() || '',
        rating: saree.rating?.toString() || '',
      });
      setExistingImages([saree.image1, saree.image2, saree.image3]);
    } else {
      setEditingSaree(null);
      setFormData({
        productName: '',
        categoryId: '',
        price: '',
        offerPrice: '',
        rating: '',
      });
      setExistingImages([]);
    }
    setImageFiles([]);
    setImagePreviews([]);
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSaree(null);
    setFormData({
      productName: '',
      categoryId: '',
      price: '',
      offerPrice: '',
      rating: '',
    });
    setImageFiles([]);
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setImagePreviews([]);
    setExistingImages([]);
    setError('');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Sarees</h1>
          <p className="text-gray-600 mt-1">Manage your saree products</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Saree
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sarees.map((saree) => (
          <div
            key={saree.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48 bg-gray-100">
              {saree.image1 ? (
                <img
                  src={saree.image1}
                  alt={saree.productName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              {saree.offerPrice && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
                  Sale
                </div>
              )}
            </div>

            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {saree.productName}
              </h3>

              {saree.category && (
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium mb-3">
                  {saree.category.name}
                </span>
              )}

              <div className="flex items-center mb-3">
                {saree.rating && (
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm font-medium text-gray-700">
                      {saree.rating}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-baseline space-x-2 mb-4">
                {saree.offerPrice ? (
                  <>
                    <span className="text-2xl font-bold text-gray-800">
                      ₹{saree.offerPrice}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{saree.price}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-gray-800">
                    ₹{saree.price}
                  </span>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => openModal(saree)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(saree.id)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sarees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No sarees found</p>
          <p className="text-gray-400 mt-2">Create your first saree to get started</p>
        </div>
      )}

{isModalOpen && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-full sm:max-w-xl md:max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">
      
      {/* Header (Sticky) */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl flex justify-between items-center z-10 shadow-sm">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          {editingSaree ? "Edit Saree" : "Add Saree"}
        </h2>
        <button
          onClick={closeModal}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="overflow-y-auto px-6 py-6 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Product Name + Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={formData.productName}
              onChange={(e) =>
                setFormData({ ...formData, productName: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price + Offer Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Offer Price (Optional)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.offerPrice}
              onChange={(e) =>
                setFormData({ ...formData, offerPrice: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating (Optional)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={formData.rating}
            onChange={(e) =>
              setFormData({ ...formData, rating: e.target.value })
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="0.0 - 5.0"
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images (Max 3)
          </label>

          {editingSaree && existingImages.some((img) => img) && (
            <div className="mb-4">
              <p className="text-xs text-gray-600 mb-2">Current Images:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {existingImages.map(
                  (img, index) =>
                    img && (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Existing ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg shadow-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )
                )}
              </div>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex flex-col md:flex-row gap-3 rounded-b-2xl shadow-inner">
        <button
          type="button"
          onClick={closeModal}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : editingSaree ? "Update" : "Create"}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
