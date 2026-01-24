import { Link } from "react-router-dom";

const RoleSelection = () => {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-purple-200 via-blue-100 to-purple-200 flex flex-col items-center justify-center overflow-hidden relative">
      
      {/* Custom CSS for the floating animation */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 6s ease-in-out infinite;
          animation-delay: 3s; /* Offsets the second image so they don't move in sync */
        }
      `}</style>

        <h1 className="hidden md:flex md:text-5xl font-serif text-slate-700 mb-12 text-center z-10">
        How will you use our platform?
        </h1>

      <div className="flex flex-col md:flex-row gap-12 md:gap-24 z-10">

        {/* Customer Option */}
        <Link to="/setup-customer" className="group">
          <div className="animate-float transition-transform duration-500 ease-in-out transform group-hover:scale-110 cursor-pointer text-center">
            <div className="w-52 h-52 md:w-64 md:h-64 bg-white/40 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center border-4 border-white/50 mb-6 overflow-hidden">
              {/* Replace src with your own 'Shopper' image */}
              <img 
                src="https://img.freepik.com/free-vector/shopping-bag-basket-isometric-composition-with-isolated-image-plastic-bag-products-vector-illustration_1284-80721.jpg?semt=ais_hybrid" 
                alt="Customer" 
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <h2 className="text-3xl font-serif text-purple-800 tracking-wide group-hover:text-purple-600">
              I want to Buy
            </h2>
            <p className="text-slate-600 mt-2 font-light">Browse unique items</p>
          </div>
        </Link>

        {/* Seller Option */}
        <Link to="/setup-seller" className="group">
          <div className="animate-float-delay transition-transform duration-500 ease-in-out transform group-hover:scale-110 cursor-pointer text-center">
            <div className="w-52 h-52 md:w-64 md:h-64  bg-white/40 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center border-4 border-white/50 mb-6 overflow-hidden">
               {/* Replace src with your own 'Shop' image */}
              <img 
                src="https://img.freepik.com/free-vector/shop-with-sign-we-are-open_23-2148547718.jpg?semt=ais_hybrid" 
                alt="Seller" 
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <h2 className="text-3xl font-serif text-blue-800 tracking-wide group-hover:text-blue-600">
              I want to Sell
            </h2>
            <p className="text-slate-600 mt-2 font-light">Open your shop</p>
          </div>
        </Link>

      </div>
      
      {/* Decorative background circles */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
    </div>
  );
};

export default RoleSelection;