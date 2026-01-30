import React from 'react';
// 👇 1. Import the new component (Adjust the path if needed)
import TrendingSection from './TrendingSection';

const Home = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen w-screen bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff] dark:from-slate-900 dark:to-purple-900 flex items-center justify-center transition-colors duration-500">
        <div className="text-center px-4">
          <h1 className="font-serif text-5xl md:text-7xl text-gray-800 dark:text-white mb-6 transition-colors">
            Handcrafted <br /> with Soul.
          </h1>
          <p className="text-gray-700 dark:text-gray-200 text-lg md:text-xl tracking-wide max-w-lg mx-auto mb-8 transition-colors">
            Artifex brings you unique, handmade items that tell a story.
          </p>
          <button
            onClick={() => scrollToSection('trending-section')}
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-full hover:bg-gray-700 dark:hover:bg-gray-200 transition duration-300 uppercase text-xs tracking-widest font-bold"
          >
            Explore Collection
          </button>
        </div>
      </section>

      {/* 👇 2. Add the Trending Section Here */}
      <TrendingSection id="trending-section" />

      {/* Dummy Content (You can keep or remove this) */}
      <section className="h-[50vh] bg-white dark:bg-slate-950 flex items-center justify-center transition-colors">
        <h2 className="text-2xl font-serif dark:text-gray-200">Featured Collection</h2>
      </section>
    </div>
  );
};

export default Home;