import React from 'react';
import delipic from '../assets/pjdeli.webp';
// --- Hero Section for the Deli Page ---
const DeliHero = () => (
    <section 
      className="relative bg-cover bg-center h-[50vh] text-white flex items-center justify-center" 
      style={{backgroundImage: `url(${delipic})`}}
    >
    
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center px-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-widest uppercase text-brand-green" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>
          Opening Fall 2025
        </h2>
        <h1 className="text-4xl md:text-6xl font-bold mt-2 leading-tight tracking-wide" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
          The Plant Joy Deli
        </h1>
      </div>
    </section>
);

// --- Main Deli Info Page Component ---
const DeliInfo = () => {
  return (
    <>
      <DeliHero />
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center">
          
          {/* Main Content Section */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-brand-gray">
              Milwaukee’s First Vegan Deli
            </h2>
            <p className="text-xl leading-relaxed text-brand-gray">
              The Plant Joy Deli is a plant-based marketplace offering deli favorites, artesian cheeses, and quick grab-n-go eats.
            </p>
          </div>

          {/* Quote Section */}
          <div className="mt-20 border-t pt-12">
            <blockquote className="text-2xl italic text-brand-gray border-l-4 border-brand-green pl-8 text-left">
                <p>“The most ethical diet just so happens to be the most environmentally sound diet and just so happens to be the healthiest.”</p>
                <footer className="mt-4 font-bold not-italic">- Dr. Michael Greger, M.D.</footer>
            </blockquote>
          </div>
          
        </div>
      </section>
    </>
  );
};

export default DeliInfo;