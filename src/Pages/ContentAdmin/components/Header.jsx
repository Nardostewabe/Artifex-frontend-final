export default function Header() {
  return (
    <div className="flex justify-between items-center bg-white/80 backdrop-blur-lg px-8 py-4 shadow-md rounded-2xl mx-6 mt-4 mb-6">

      <input
        type="text"
        placeholder="Search..."
        className="px-4 py-2 w-1/2 border rounded-xl bg-[#F8F8FF] shadow-sm
        focus:ring-2 focus:ring-[#A6C7FF] outline-none transition"
      />

      <div className="flex items-center gap-6">
        <div className="relative text-2xl cursor-pointer text-[#A6C7FF]">
          🔔
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
            3
          </span>
        </div>

        <div className="w-10 h-10 bg-gray-200 rounded-full shadow"></div>
      </div>
    </div>
  );
}
