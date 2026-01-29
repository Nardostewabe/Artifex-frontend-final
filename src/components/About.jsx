import React from 'react';
import { Heart, PenTool, ShieldCheck, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen w-full pt-28 pb-12 px-6 bg-gradient-to-br from-[#bfdbfe] to-[#e9d5ff]">
      
      {/* 1. HERO SECTION */}
      <div className="max-w-4xl mx-auto text-center mb-16 space-y-6 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight">
          Crafting Connections, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            One Stitch at a Time.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
          Welcome to <span className="font-bold">Artifex</span>. We aren't just a store; we are a movement dedicated to preserving the human touch in a digital world.
        </p>
      </div>

      {/* 2. VALUES GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {/* Card 1 */}
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-white hover:shadow-lg transition-all duration-300">
          <div className="bg-purple-100 w-14 h-14 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
            <PenTool size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Curated Quality</h3>
          <p className="text-gray-600">
            Unlike mass marketplaces, we specialize in fiber arts, ceramics, and handmade treasures. Every item has a soul.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-white hover:shadow-lg transition-all duration-300">
          <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
            <Users size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Learn & Create</h3>
          <p className="text-gray-600">
            We don't just sell products; we teach skills. Our Tutorial section allows masters to pass on their knowledge to you.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-white hover:shadow-lg transition-all duration-300">
          <div className="bg-indigo-100 w-14 h-14 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
            <ShieldCheck size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Safe Community</h3>
          <p className="text-gray-600">
            With dedicated seller verification and active moderation, we ensure a marketplace built on trust and authenticity.
          </p>
        </div>
      </div>

      {/* 3. STORY SECTION */}
      <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-purple-900/5 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-2 text-purple-600 font-bold uppercase tracking-widest text-xs">
            <Heart size={16} /> Our Story
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Born from a love of the handmade.</h2>
          <p className="text-gray-600 leading-relaxed">
            Artifex was created to solve a simple problem: talented creators were getting lost in the noise of generic e-commerce. 
            <br /><br />
            We wanted to build a space where the <em>process</em> is valued just as much as the <em>product</em>. Whether you are looking for a hand-knitted scarf, a crochet plushie, or the tutorial to make it yourself, you’ve found your home here.
          </p>
        </div>
        {/* Placeholder Image */}
        <div className="flex-1 w-full h-80 bg-gray-100 rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
                Team / Workshop Image
            </div>
        </div>
      </div>

    </div>
  );
};

export default About;