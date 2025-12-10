export default function Header() {
  return (
    <header className="w-full bg-white/60 backdrop-blur-lg shadow-lg rounded-2xl px-6 py-4 flex justify-between items-center border border-white/40">
      <h1 className="text-2xl font-bold text-[#2A2A4A] tracking-wide">
        Platform Admin Dashboard
      </h1>

      <div className="flex items-center gap-5">
        {/* Notification */}
        <div className="relative">
          <svg className="w-7 h-7 text-[#A6C7FF]" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1"></path>
          </svg>
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#FF3B3B] rounded-full shadow-md"></span>
        </div>

        {/* Profile */}
        <div className="w-11 h-11 rounded-full bg-[#C2A8FF] flex items-center justify-center text-white font-semibold shadow-md">
          A
        </div>
      </div>
    </header>
  );
}