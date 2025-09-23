import React from 'react';

const Hero = ({ onNavClick }) => (
  <section 
    className="relative bg-cover bg-center h-[60vh] md:h-[80vh] text-white flex items-center justify-center" 
    style={{backgroundImage: "url('https://images.unsplash.com/photo-1540914124281-342587941389?q=80&w=2940&auto=format&fit=crop')"}}
  >
    <div className="absolute inset-0 bg-black opacity-40"></div>
    <div className="relative z-10 text-center px-4">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight tracking-wide" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
        Deliciously Simple, Naturally Vegan.
      </h1>
      <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>
        Chef-crafted, plant-based meals delivered right to your door. Enjoy the taste of wholesome goodness without the hassle.
      </p>
      <button onClick={() => onNavClick('Menu')} className="bg-green-500 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 text-lg">
        View This Week's Menu
      </button>
    </div>
  </section>
);

const Home = ({ onNavClick }) => {
    return (
        <Hero onNavClick={onNavClick} />
    );
};

export default Home;