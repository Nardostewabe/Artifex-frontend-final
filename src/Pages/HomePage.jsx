import React from 'react';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen w-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="font-serif text-5xl md:text-7xl text-gray-800 mb-6">
            Handcrafted <br /> with Soul.
          </h1>
          <p className="text-gray-700 text-lg md:text-xl tracking-wide max-w-lg mx-auto mb-8">
            Artifex brings you unique, handmade items that tell a story.
          </p>
          <button className="bg-gray-900 text-white px-8 py-3 rounded-full hover:bg-gray-700 transition duration-300 uppercase text-xs tracking-widest">
            Explore Collection
          </button>
        </div>
      </section>

      {/* Dummy Content for scroll testing */}
      <section className="h-[50vh] bg-white flex items-center justify-center">
        <h2 className="text-2xl font-serif">Featured Collection</h2>
      </section>
    </div>
  );
};

export default Home;