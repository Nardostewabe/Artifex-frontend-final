import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { API_BASE_URL } from "../../../config.js";

import { 
  Upload, X, Image as ImageIcon, DollarSign, Layers, ArrowLeft, 
  Tag, Package, Loader2, AlertCircle, Check 
} from 'lucide-react';

const AddProduct = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 1. Form Data (Removed 'category' string)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: 1,
    stockStatus: 'In Stock',
    tags: '',
    tutorialLink: ''
  });

  // 2. New State for Categories
  const [availableCategories, setAvailableCategories] = useState([]); // From DB
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]); // User selection (IDs)
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  // 3. Images State
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const stockStatuses = ["In Stock", "Out of Stock", "Made to Order"];

  // --- EFFECT: Fetch Categories from Backend ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // You need to create this endpoint in your backend (CategoriesController)
        const response = await fetch(`${API_BASE_URL}/api/Categories`);
        if (response.ok) {
          const data = await response.json();
          setAvailableCategories(data); // Expecting [{ id: 1, name: "Ceramics" }, ...]
        } else {
            // Fallback for testing if backend endpoint isn't ready yet
            console.warn("Could not fetch Categories. Ensure GET /api/Categories exists.");
        }
      } catch (err) {
        console.error("Error fetching Categories:", err);
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Toggle Category Selection
  const toggleCategory = (categoryId) => {
    setSelectedCategoryIds(prev => {
        if (prev.includes(categoryId)) {
            return prev.filter(id => id !== categoryId); // Remove
        } else {
            return [...prev, categoryId]; // Add
        }
    });
  };

  const handleImageUpload = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.target.files ? Array.from(e.target.files) : Array.from(e.dataTransfer.files);
    
    
    const validFiles = files.filter(file => {
        if (file.size > 4 * 1024 * 1024) { 
            alert(`File ${file.name} is too big! Max 4MB.`);
            return false;
        }
        return true;
    });

    const newImages = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      url: URL.createObjectURL(file),
      name: file.name
    }));

    setImages(prev => [...prev, ...newImages].slice(0, 5));
  };

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => { e.preventDefault(); handleImageUpload(e); };

  // --- SUBMISSION ---
  const handleSubmit = async () => {
    if (!formData.name || !formData.price) {
      setError('Please fill in required fields (Name, Price).');
      return;
    }

    if (selectedCategoryIds.length === 0) {
        setError('Please select at least one category.');
        return;
    }

    if (images.length === 0) {
        setError('Please upload at least one image.');
        return;
    }

    const actualToken = token || localStorage.getItem("token");
    if (!actualToken) return setError("Session expired. Please log in again.");

    setIsSubmitting(true);
    setError('');

    try {
      const submissionData = new FormData(); // Renamed to avoid confusion with state

        // Access values from formData state
        submissionData.append('Name', formData.name);
        submissionData.append('Description', formData.description);
        submissionData.append('Price', formData.price);
        submissionData.append('StockQuantity', formData.stockQuantity);
        submissionData.append('StockStatus', formData.stockStatus);
        
        if (formData.tags) submissionData.append('Tags', formData.tags);
        if (formData.tutorialLink) submissionData.append('TutorialLink', formData.tutorialLink);

        // Append Categories
        selectedCategoryIds.forEach(id => {
            submissionData.append('CategoryIds', id);
        });

        // Append Images
        images.forEach(img => {
            submissionData.append('Images', img.file);
        });

        const response = await fetch(`${API_BASE_URL}/api/Products/new-product`, { 
            method: 'POST',
            headers: { 'Authorization': `Bearer ${actualToken}` },
            body: submissionData // Use the FormData object here
        });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.title || "Failed to upload product");
      }

      navigate('/seller-shop'); 

    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] pt-24 pb-12 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        
        {/* Header ... (Same as before) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-gray-900">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-sm text-gray-500">Create a listing for your shop</p>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
             <button 
               onClick={handleSubmit} 
               disabled={isSubmitting} 
               className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 text-sm tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
             >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : 'Publish Product'}
            </button>
          </div>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle size={18} />
                <span>{error}</span>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* General Info */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">General Information</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input name="name" value={formData.name} onChange={handleInputChange} type="text" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-purple-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} rows={6} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none resize-none focus:border-purple-500 transition-colors" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <input name="tags" value={formData.tags} onChange={handleInputChange} type="text" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-purple-500" placeholder="Ceramics, Gift, Blue" />
                </div>
              </div>
            </div>

            {/* Images Section (Same as before) ... */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                {/* ... (Keep your existing Image Upload code here) ... */}
                 <div 
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}
                    onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                  >
                    <input type="file" multiple accept="image/*" className="hidden" id="image-upload" onChange={handleImageUpload} />
                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                      <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                        <Upload size={24} className="text-purple-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                    </label>
                  </div>
                  {/* Previews */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                      {images.map((img) => (
                        <div key={img.id} className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                          <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                          <button onClick={() => removeImage(img.id)} className="absolute top-2 right-2 p-1 bg-white text-red-500 rounded-lg opacity-0 group-hover:opacity-100 shadow-md transition-opacity">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
            </div>
            
            {/* Tutorial Link (Same as before) */}
             <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                 <div className="flex items-start gap-4">
                     <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Layers size={20} /></div>
                     <div className="flex-1">
                          <h2 className="text-base font-bold text-gray-900">DIY Tutorial Link</h2>
                          <input name="tutorialLink" value={formData.tutorialLink} onChange={handleInputChange} type="text" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm focus:border-purple-500" />
                     </div>
                 </div>
             </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Pricing & Inventory</h2>
              <div className="space-y-4">
                
                {/* Price */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Base Price *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><DollarSign size={14} className="text-gray-400" /></div>
                    <input name="price" value={formData.price} onChange={handleInputChange} type="number" min="0" step="0.01" className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-purple-500" />
                  </div>
                </div>

                {/* ✅ UPDATED: Multi-Select Categories */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Categories *</label>
                    <div className="flex flex-wrap gap-2">
                        {isCategoriesLoading ? (
                            <span className="text-xs text-gray-400">Loading Categories...</span>
                        ) : availableCategories.length > 0 ? (
                            availableCategories.map(cat => {
                                const isSelected = selectedCategoryIds.includes(cat.id);
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => toggleCategory(cat.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                                            isSelected 
                                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm' 
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                                        }`}
                                    >
                                        {isSelected && <Check size={12} />}
                                        {cat.name}
                                    </button>
                                );
                            })
                        ) : (
                            <p className="text-xs text-red-400">No Categories found in DB.</p>
                        )}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">Select all that apply.</p>
                </div>

                {/* Stock Quantity & Status (Same as before) */}
                <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Stock Quantity</label>
                      <input name="stockQuantity" value={formData.stockQuantity} onChange={handleInputChange} type="number" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-purple-500" />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Stock Status</label>
                    <select name="stockStatus" value={formData.stockStatus} onChange={handleInputChange} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none bg-white">
                        {stockStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddProduct;