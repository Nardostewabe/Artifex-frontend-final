import { useState } from "react";
import { FiPlus, FiTrash2, FiTag, FiList } from "react-icons/fi";

// DUMMY DATA: This represents the current database state
const INITIAL_CATEGORIES = [
  { id: 1, name: "Knitwear", count: 120 },
  { id: 2, name: "Ceramics", count: 45 },
  { id: 3, name: "Jewelry", count: 89 },
  { id: 4, name: "Digital Art", count: 12 },
  { id: 5, name: "Woodwork", count: 34 },
];

export default function CategoryManagement({ showToast }) {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [newCat, setNewCat] = useState("");

  const handleAdd = () => {
    if (!newCat.trim()) return;
    
    // Check for duplicates (Case insensitive)
    if (categories.some(c => c.name.toLowerCase() === newCat.toLowerCase())) {
        if(showToast) showToast("Category already exists", "error");
        return;
    }

    const newEntry = { id: Date.now(), name: newCat, count: 0 };
    setCategories([...categories, newEntry]);
    setNewCat("");
    if(showToast) showToast(`Category "${newEntry.name}" added successfully`, "success");
  };

  const handleDelete = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
    if(showToast) showToast("Category removed", "error");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
            <h2 className="text-3xl font-bold text-[#3A3A6C]">Category Management</h2>
            <p className="text-slate-500 mt-2">Manage the product categories available to Sellers during listing creation.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-sm font-bold text-[#6C63FF]">
            Total Categories: {categories.length}
        </div>
      </div>

      {/* INPUT SECTION */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
        <div className="bg-[#F8F8FF] p-3 rounded-xl text-[#6C63FF]">
          <FiTag size={24} />
        </div>
        <div className="flex-1 w-full">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Add New Category</label>
            <input 
            type="text" 
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="e.g. Leather Goods" 
            className="w-full bg-transparent outline-none font-bold text-xl placeholder-slate-300 border-b-2 border-slate-100 focus:border-[#6C63FF] py-2 transition-colors"
            />
        </div>
        <button 
          onClick={handleAdd}
          className="w-full md:w-auto bg-[#3A3A6C] text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#2D2D55] transition-colors"
        >
          <FiPlus /> Add Category
        </button>
      </div>

      {/* LIST SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center hover:border-[#6C63FF] hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
                <div className="bg-slate-50 p-2 rounded-lg text-slate-400 group-hover:text-[#6C63FF] transition-colors">
                    <FiList />
                </div>
                <div>
                    <h3 className="font-bold text-[#3A3A6C] text-lg">{cat.name}</h3>
                    <p className="text-xs font-bold text-slate-400">{cat.count} Listings linked</p>
                </div>
            </div>
            <button 
              onClick={() => handleDelete(cat.id)}
              className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
              title="Remove Category"
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}