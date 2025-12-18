import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { API_BASE_URL } from "../../../config.js"; 

import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  DollarSign, 
  Layers, 
  ArrowLeft, 
  Info,
  Loader2 
} from 'lucide-react';
 // Assuming you have this from your Navbar

const AddProduct = () => {
  const navigate = useNavigate();
  const { token } = useAuth(); // Get auth token for the API request
  
  // 1. Loading & Error States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 2. Form Data State (Text Fields)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stockQuantity: 1,
    stockStatus: 'In Stock',
    tags: '',
    tutorialLink: ''
  });

  // 3. Images State (Stores both Preview URL and actual File object)
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Categories match your Backend Enum
  const categories = ["Ceramics", "Textiles", "Woodwork", "Jewelry", "Art Prints", "Leather", "DIY Kits"];

  // --- HANDLERS ---

  // Handle Text Inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Image Selection
  const handleImageUpload = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.target.files ? Array.from(e.target.files) : Array.from(e.dataTransfer.files);
    
    // Process new files
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(), // Unique ID for UI key
      file: file, // The actual File object for Backend
      url: URL.createObjectURL(file), // The preview URL for UI
      name: file.name
    }));

    // Limit to 5 images total
    setImages(prev => [...prev, ...newImages].slice(0, 5));
  };

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  // Drag & Drop Visuals
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => { e.preventDefault(); handleImageUpload(e); };

  // --- SUBMISSION LOGIC ---
  const handleSubmit = async () => {
    // Basic Validation
    if (!formData.name || !formData.price || !formData.category) {
      setError('Please fill in all required fields (Name, Price, Category).');
      return;
    }

    const actualToken = token || localStorage.getItem("token");

    if (!actualToken) {
        setError("Authentication session expired. Please log in again.");
        // Optional: Redirect to login
        // navigate('/login');
        return;
    }
    console.log("Sending Token:", actualToken);

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Construct FormData (Required for ASP.NET [FromForm])
      const data = new FormData();
      data.append('Name', formData.name);
      data.append('Description', formData.description);
      data.append('Price', formData.price);
      data.append('Category', formData.category);
      data.append('StockQuantity', formData.stockQuantity);
      data.append('StockStatus', formData.stockStatus);
      data.append('Tags', formData.tags);
      data.append('TutorialLink', formData.tutorialLink);

      // 2. Append Images
      images.forEach((img) => {
        // 'Images' matches the property name in your C# DTO: List<IFormFile> Images
        data.append('Images', img.file);
      });

      // 3. Send Request
      const response = await fetch(`${API_BASE_URL}/api/products/new-product`, { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (!response.ok) {
        // If 401, it means the token is invalid or the Role ID is wrong
        if (response.status === 401 || response.status === 403) {
            throw new Error("Unauthorized: You do not have permission (Check Role ID).");
        }
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to upload product');
      }

      // 4. Success
      navigate('/seller-home'); // Redirect to dashboard

    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] pt-24 pb-12 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        
        {/* --- HEADER ACTIONS --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 hover:bg-white rounded-full transition-colors text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
              <p className="text-sm text-gray-500">New arrival for your shop</p>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm">
              Save Draft
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 text-sm tracking-wide disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
              {isSubmitting ? 'Publishing...' : 'Publish Product'}
            </button>
          </div>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN (2/3 width): Main Info & Images --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. General Info Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">General Information</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="e.g. Handcrafted Ceramic Mug" 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-gray-400 text-gray-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={6}
                    placeholder="Describe your craft, materials used, and the story behind it..." 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all placeholder:text-gray-400 text-gray-900 text-sm resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-2 text-right">{formData.description.length} / 2000 characters</p>
                </div>
              </div>
            </div>

            {/* 2. Media Upload Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">Product Images</h2>
                <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-lg">Max 5 photos</span>
              </div>

              {/* Drag & Drop Zone */}
              <div 
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ease-in-out cursor-pointer
                  ${isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  id="image-upload" 
                  onChange={handleImageUpload}
                />
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                  <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                    <Upload size={24} className="text-purple-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                </label>
              </div>

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  {images.map((img) => (
                    <div key={img.id} className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                      <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeImage(img.id)}
                        className="absolute top-2 right-2 p-1 bg-white/90 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:text-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                      <div className="aspect-square bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-gray-300">
                        <ImageIcon size={20} />
                        <span className="text-[10px] mt-1 font-medium">Slot Available</span>
                      </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. DIY Tutorial Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <Layers size={20} />
                    </div>
                    <div className="flex-1">
                         <h2 className="text-lg font-bold text-gray-900">DIY Tutorial</h2>
                         <p className="text-sm text-gray-500 mb-4">Link a video tutorial to show how this item is made.</p>
                         <input 
                            name="tutorialLink"
                            value={formData.tutorialLink}
                            onChange={handleInputChange}
                            type="text" 
                            placeholder="Paste YouTube or Vimeo URL" 
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
                        />
                    </div>
                </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN (1/3 width): Organization --- */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* 4. Pricing Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Pricing</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Base Price *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={14} className="text-gray-400" />
                    </div>
                    <input 
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      type="number" 
                      placeholder="0.00" 
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-medium text-gray-700">Stock Status</label>
                        <Info size={12} className="text-gray-400" />
                    </div>
                    <select 
                      name="stockStatus"
                      value={formData.stockStatus}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-purple-500 outline-none text-sm bg-white"
                    >
                        <option>In Stock</option>
                        <option>Low Stock</option>
                        <option>Made to Order</option>
                    </select>
                </div>
                
                <div>
                     <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                     <input 
                      name="stockQuantity"
                      value={formData.stockQuantity}
                      onChange={handleInputChange}
                      type="number" 
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
                    />
                </div>
              </div>
            </div>

            {/* 5. Organization / Categories Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Organization</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-purple-500 outline-none text-sm bg-white cursor-pointer hover:border-gray-300 transition-colors"
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tags (Optional)</label>
                  <input 
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="e.g. vintage, summer, clay" 
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Separate tags with commas.</p>
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