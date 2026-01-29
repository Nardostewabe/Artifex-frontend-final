import { useState, useEffect } from "react";
import { Plus, Trash2, Tag, List, Loader2, Image as ImageIcon } from "lucide-react";
import { API_BASE_URL } from "../../../config"; // Adjust path as needed
import { useAuth } from "../../../context/AuthContext";

export default function CategoryManagement({ showToast }) {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState("");
  const [catImage, setCatImage] = useState(null); // State for image upload
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch Categories from API
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/Categories`);
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Add Category (with Image)
  const handleAdd = async () => {
    if (!newCat.trim()) return;
    setSubmitting(true);

    try {
      // Use FormData because your Controller expects [FromForm] (implied by file upload)
      const formData = new FormData();
      formData.append("Name", newCat);
      if (catImage) {
        formData.append("Image", catImage); // Must match DTO property name
      }

      const res = await fetch(`${API_BASE_URL}/api/Categories`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
          // NO Content-Type header here!
        },
        body: formData
      });

      if (res.ok) {
        if (showToast) showToast(`Category "${newCat}" added!`, "success");
        setNewCat("");
        setCatImage(null);
        fetchCategories(); // Refresh list
      } else {
        const errorText = await res.text();
        if (showToast) showToast(errorText || "Failed to add category", "error");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Delete Category
  const handleDelete = async (id) => {
    if(!window.confirm("Delete this category?")) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/Categories/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== id));
        if (showToast) showToast("Category removed", "success");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#3A3A6C]">Category Management</h2>
          <p className="text-slate-500 mt-2">Manage product categories.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-sm font-bold text-[#6C63FF]">
          Total: {categories.length}
        </div>
      </div>

      {/* INPUT SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="bg-[#F8F8FF] p-3 rounded-xl text-[#6C63FF]">
              <Tag size={24} />
            </div>
            
            <div className="flex-1 w-full space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Name</label>
              <input
                type="text"
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                placeholder="e.g. Leather Goods"
                className="w-full bg-transparent outline-none font-bold text-xl placeholder-slate-300 border-b-2 border-slate-100 focus:border-[#6C63FF] py-2 transition-colors"
              />
            </div>

            {/* Image Input */}
            <div className="w-full md:w-auto">
               <label className="cursor-pointer flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#6C63FF] transition">
                  <ImageIcon size={20} />
                  {catImage ? "Image Selected" : "Upload Image"}
                  <input type="file" className="hidden" onChange={e => setCatImage(e.target.files[0])} accept="image/*" />
               </label>
            </div>

            <button
              onClick={handleAdd}
              disabled={submitting}
              className="w-full md:w-auto bg-[#3A3A6C] text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#2D2D55] transition-colors disabled:opacity-50"
            >
              {submitting ? <Loader2 className="animate-spin"/> : <Plus />} Add
            </button>
        </div>
      </div>

      {/* LIST SECTION */}
      {loading ? (
        <div className="text-center p-10"><Loader2 className="animate-spin inline text-[#3A3A6C]"/></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center hover:border-[#6C63FF] hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                {cat.imageUrl ? (
                    <img src={cat.imageUrl} className="w-10 h-10 rounded-lg object-cover" alt={cat.name} />
                ) : (
                    <div className="bg-slate-50 p-2 rounded-lg text-slate-400">
                      <List />
                    </div>
                )}
                <div>
                  <h3 className="font-bold text-[#3A3A6C] text-lg">{cat.name}</h3>
                  <p className="text-xs font-bold text-slate-400">ID: {cat.id}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(cat.id)}
                className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}