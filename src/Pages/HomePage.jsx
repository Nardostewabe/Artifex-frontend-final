import React from 'react';
// 👇 1. Import the new component (Adjust the path if needed)
import TrendingSection from '../Pages/TrendingSection'; 

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen artifex_webiste\src\Pages\Customer\pages\views\CustomerCollection.jsx flex items-center justify-center">
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

      {/* 👇 2. Add the Trending Section Here */}
      <TrendingSection />

      {/* Dummy Content (You can keep or remove this) */}
      <section className="h-[50vh] bg-white flex items-center justify-center">
        <h2 className="text-2xl font-serif">Featured Collection</h2>
      </section>
    </div>
  );
};

export default Home;