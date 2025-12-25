import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "../../../config.js"; 

import { 
  ArrowLeft, 
  ShoppingBag, 
  Heart, 
  Share2, 
  Layers, 
  Package, 
  Tag, 
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/Products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        
        const data = await response.json();
        setProduct(data);
        
        // Set the first image as the selected main image
        if (data.images && data.images.length > 0) {
            setSelectedImage(data.images[0].url);
        }
      } catch (err) {
        setError('Could not load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-purple-600" size={40} />
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <div className="p-4 bg-red-50 text-red-600 rounded-full"><AlertCircle size={32} /></div>
        <h2 className="text-xl font-bold text-gray-900">Product Not Found</h2>
        <button onClick={() => navigate(-1)} className="text-purple-600 hover:underline">Go Back</button>
    </div>
  );

  // Parse tags if they are a comma-separated string
  const tagsList = product.tags ? product.tags.split(',').map(t => t.trim()) : [];

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] pt-24 pb-12 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        
        {/* Breadcrumb / Back */}
        <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors mb-8 group"
        >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/>
            <span className="font-medium">Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* LEFT: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative group">
                {selectedImage ? (
                     <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <Package size={64} />
                    </div>
                )}
                <div className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full cursor-pointer hover:bg-red-50 hover:text-red-500 transition-colors">
                    <Heart size={20} />
                </div>
            </div>

            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {product.images.map((img) => (
                        <button 
                            key={img.id} 
                            onClick={() => setSelectedImage(img.url)}
                            className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === img.url ? 'border-purple-600 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                        >
                            <img src={img.url} alt="Thumbnail" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex flex-col">
             <div className="mb-4 flex flex-wrap gap-2">
                {(product.categories || product.Categories || []).map((cat) => (
                    <span key={cat.id} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full uppercase tracking-wider">
                        {cat.name}
                    </span>
                ))}
            </div>

             <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                {product.name}
             </h1>

             {/* Price & Stock */}
             <div className="flex items-center gap-6 mb-8">
                <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                <div className="h-8 w-[1px] bg-gray-200"></div>
                <div className="flex items-center gap-2">
                    {product.stockStatus === 'In Stock' ? (
                        <CheckCircle size={18} className="text-green-500" />
                    ) : (
                        <AlertCircle size={18} className="text-orange-500" />
                    )}
                    <span className={`text-sm font-medium ${product.stockStatus === 'In Stock' ? 'text-green-600' : 'text-orange-600'}`}>
                        {product.stockStatus} ({product.stockQuantity} available)
                    </span>
                </div>
             </div>

             {/* Description */}
             <div className="prose prose-sm text-gray-600 mb-8 leading-relaxed">
                <p>{product.description}</p>
             </div>

             {/* Tags */}
             {tagsList.length > 0 && (
                 <div className="flex flex-wrap gap-2 mb-8">
                    {tagsList.map((tag, idx) => (
                        <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                            <Tag size={12} /> {tag}
                        </span>
                    ))}
                 </div>
             )}

             {/* Tutorial Section */}
             {product.tutorialLink && (
                 <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-100 mb-8 flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg text-purple-600 shadow-sm mt-0.5">
                        <Layers size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-sm">Includes DIY Tutorial</h3>
                        <p className="text-xs text-gray-500 mb-2">Learn how this item was crafted or how to use it.</p>
                        <a 
                            href={product.tutorialLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-purple-700 hover:text-purple-900 hover:underline"
                        >
                            Watch Tutorial &rarr;
                        </a>
                    </div>
                 </div>
             )}

             {/* Action Buttons */}
             <div className="mt-auto pt-6 border-t border-gray-100 flex gap-4">
                <button className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 hover:shadow-gray-300">
                    <ShoppingBag size={20} />
                    Add to Cart
                </button>
                <button className="p-4 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    <Share2 size={20} />
                </button>
             </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;