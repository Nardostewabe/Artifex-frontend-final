export default function Card({ title, number, icon }) {
  return (
    <div className="relative p-6 rounded-2xl shadow-lg bg-white border border-[#E9E9FF] text-[#2A2A4A] transition transform hover:scale-[1.03]">
      {icon && (
        <div className="absolute top-4 right-4 text-[#A6C7FF] opacity-40 text-4xl">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-4xl mt-3 font-bold">{number}</p>
    </div>
  );
}