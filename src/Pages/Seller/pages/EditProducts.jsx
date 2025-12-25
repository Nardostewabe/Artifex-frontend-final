import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { API_BASE_URL } from "../../../config.js"; 

import { 
  Upload, X, Image as ImageIcon, DollarSign, Layers, ArrowLeft, 
  Tag, Package, Loader2, AlertCircle, Check 
} from 'lucide-react';

const EditProduct = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: 1,
    stockStatus: 'In Stock',
    tags: '',
    tutorialLink: ''
  });

  // ✅ Category State
  const [availableCategories, setAvailableCategories] = useState([]); 
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]); 

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]); 
  const stockStatuses = ["In Stock", "Out of Stock", "Made to Order"];

  // 1. Fetch Categories AND Product Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch All Categories first
        const catRes = await fetch(`${API_BASE_URL}/api/Categories`);
        if (catRes.ok) setAvailableCategories(await catRes.json());

        // Fetch Product
        const prodRes = await fetch(`${API_BASE_URL}/api/Products/${id}`);
        if (!prodRes.ok) throw new Error('Product not found');
        
        const data = await prodRes.json();
        
        setFormData({
          name: data.name,
          description: data.description || '',
          price: data.price,
          stockQuantity: data.stockQuantity,
          stockStatus: data.stockStatus || 'In Stock',
          tags: data.tags || '',
          tutorialLink: data.tutorialLink || ''
        });

        const loadedCategories = data.categories || data.Categories || [];
        if (loadedCategories.length > 0) {
            setSelectedCategoryIds(loadedCategories.map(c => c.id));
        }
        setExistingImages(data.images || []);
        
      } catch (err) {
        setError('Could not load data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Toggle Category
  const toggleCategory = (categoryId) => {
    setSelectedCategoryIds(prev => {
        if (prev.includes(categoryId)) return prev.filter(id => id !== categoryId);
        return [...prev, categoryId];
    });
  };

  const handleImageUpload = (e) => {
    if (existingImages.length + newImages.length >= 5) return;
    const files = Array.from(e.target.files || e.dataTransfer.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      file: file,
      url: URL.createObjectURL(file)
    }));
    setNewImages(prev => [...prev, ...newFiles].slice(0, 5 - existingImages.length));
  };

  const removeExistingImage = (imgId) => {
    setExistingImages(prev => prev.filter(img => img.id !== imgId));
  };

  const removeNewImage = (tempId) => {
    setNewImages(prev => prev.filter(img => img.id !== tempId));
  };

  // --- SUBMIT ---
  const handleSubmit = async () => {
    const actualToken = token || localStorage.getItem("token");
    if (!actualToken) return setError("Please log in.");

    setIsSubmitting(true);
    
    try {
      const data = new FormData();
      
      data.append('Name', formData.name);
      data.append('Description', formData.description);
      data.append('Price', formData.price);
      data.append('StockQuantity', formData.stockQuantity);
      data.append('StockStatus', formData.stockStatus);
      data.append('Tags', formData.tags);
      data.append('TutorialLink', formData.tutorialLink);

      // ✅ 1. Append Categories List
      selectedCategoryIds.forEach(id => {
        data.append('CategoryIds', id);
      })

      // 2. Keep Images
      existingImages.forEach(img => {
        data.append('KeepImageIds', img.id);
      });

      // 3. New Images
      newImages.forEach(img => {
        data.append('NewImages', img.file);
      });

      const response = await fetch(`${API_BASE_URL}/api/Products/${id}`, { 
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${actualToken}` },
        body: data
      });

      if (!response.ok) throw new Error('Failed to update product');

      navigate('/seller-shop'); 

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-purple-600"/></div>;

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] pt-24 pb-12 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header (Same as before) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full text-gray-500 hover:text-gray-900 shadow-sm">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          </div>
          <button onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 shadow-lg disabled:opacity-70 flex items-center gap-2">
             {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : 'Save Changes'}
          </button>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2"><AlertCircle size={18}/>{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* General Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-5">
              <h2 className="text-lg font-bold text-gray-900">General Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={6} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none resize-none focus:border-purple-500" />
              </div>
            </div>

            {/* Images (Same as before) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
               <div className="flex justify-between items-center mb-4">
                 <h2 className="text-lg font-bold text-gray-900">Images</h2>
                 <span className="text-xs text-gray-500">{existingImages.length + newImages.length} / 5</span>
               </div>
               
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 {/* Existing Images */}
                 {existingImages.map((img) => (
                   <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-purple-200">
                     <img src={img.url} alt="Existing" className="w-full h-full object-cover" />
                     <button onClick={() => removeExistingImage(img.id)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600">
                       <X size={12} />
                     </button>
                   </div>
                 ))}
                 {/* New Images */}
                 {newImages.map((img) => (
                   <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-green-200">
                      <img src={img.url} alt="New" className="w-full h-full object-cover opacity-80" />
                      <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-[10px] text-center py-0.5">NEW</div>
                      <button onClick={() => removeNewImage(img.id)} className="absolute top-1 right-1 p-1 bg-gray-500 text-white rounded-full shadow-md hover:bg-gray-600">
                       <X size={12} />
                     </button>
                   </div>
                 ))}
                 {/* Upload Button */}
                 {(existingImages.length + newImages.length < 5) && (
                   <label className="aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-all">
                     <Upload size={20} className="text-gray-400 mb-1" />
                     <span className="text-xs text-gray-500">Upload</span>
                     <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                   </label>
                 )}
               </div>
            </div>
            
            {/* Tutorial */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                 <label className="block text-sm font-medium text-gray-700 mb-1">DIY Tutorial Link</label>
                 <div className="flex gap-2">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Layers size={20}/></div>
                    <input name="tutorialLink" value={formData.tutorialLink} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-purple-500" />
                 </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Settings</h2>
                
                {/* Price */}
                <div>
                   <label className="block text-xs font-medium text-gray-700 mb-1">Price</label>
                   <div className="relative">
                      <DollarSign size={14} className="absolute left-3 top-3 text-gray-400"/>
                      <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 outline-none focus:border-purple-500" />
                   </div>
                </div>

                {/* ✅ Multi-Select Categories */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">Categories</label>
                    <div className="flex flex-wrap gap-2">
                        {availableCategories.map(cat => {
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
                        })}
                    </div>
                </div>

                {/* Stock Status & Qty (Same as before) */}
                <div>
                   <label className="block text-xs font-medium text-gray-700 mb-1">Stock Status</label>
                   <select name="stockStatus" value={formData.stockStatus} onChange={handleInputChange} className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white outline-none">
                     {stockStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                   <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleInputChange} className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;