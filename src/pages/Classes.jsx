import React from 'react';
import smallcooking from '../assets/smallcooking.jpg';
import cookingclass from '../assets/cookingclass.jpg';
// --- Reusable SVG Icons for this page ---
const GiftIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>);
const UsersIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a3.001 3.001 0 015.688 0M12 12a3 3 0 100-6 3 3 0 000 6z" /></svg>);


// --- Hero Section ---
const ClassesHero = () => (
    <section 
      className="relative bg-cover bg-center h-[70vh] text-white flex items-center justify-center" 
      style={{backgroundImage: `url(${cookingclass})`}}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight tracking-wide" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
          Unlock Your Kitchen Potential
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>
          Learn to create healthy, delicious, plant-based meals with expert guidance.
        </p>
      </div>
    </section>
);

// --- Main Page Component ---
const Classes = () => {
  return (
    <>
      <ClassesHero />

      {/* --- Introduction Section --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <img src={smallcooking} alt="Chef preparing fresh vegetables" className="rounded-xl shadow-2xl w-full h-full object-cover"/>
                </div>
                <div className="text-brand-gray space-y-4">
                    <h2 className="text-4xl font-bold text-brand-gray mb-6">Invest in You</h2>
                    <p className="text-lg leading-relaxed">
                      Cooking classes are one of the best ways to improve your game in the kitchen. If you want to get healthy, eat better and make yummy meals, you have to get in the kitchen! <span className="font-bold text-brand-green">#EatMorePlants</span>
                    </p>
                    <p className="text-lg leading-relaxed">
                      All classes are taught by a breast cancer survivor turned plant-based chef who revamped and flipped her entire kitchen from “Standard American” into “Stand out and healthy.” Plants only please!
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* --- Offerings Section (Gift Certificates & Private Classes) --- */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Gift Certificate Card */}
            <div className="bg-white p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
              <GiftIcon />
              <h3 className="text-3xl font-bold text-brand-pink mt-4 mb-2">Gift Certificates</h3>
              <p className="text-brand-gray mb-6">Give the gift of health and flavor! Perfect for any occasion. 🕎💗❄️🎄</p>
              <button className="mt-auto bg-brand-pink text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-colors">Contact Us</button>
            </div>
            {/* Private Class Card */}
            <div className="bg-white p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
              <UsersIcon />
              <h3 className="text-3xl font-bold text-brand-green mt-4 mb-2">Private Classes</h3>
              <p className="text-brand-gray mb-6">Have a specific skill you want to learn? We can tailor a private class just for you or your group.</p>
              <p className="text-4xl font-bold text-brand-green">$250</p>
              <p className="text-md text-gray-500 mb-6">for a 2-hour class</p>
              <button className="mt-auto bg-brand-green text-white font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-colors">Request Info</button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Class Schedule Section --- */}
      <section className="relative py-24 bg-cover bg-center text-white" style={{backgroundImage: "url('https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2868&auto=format&fit=crop')"}}>
        <div className="absolute inset-0 bg-brand-gray opacity-70"></div>
        <div className="relative z-10 container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">2025 Cooking Classes</h2>
          <p className="text-lg leading-relaxed max-w-3xl mx-auto mb-8">
              Join us to learn about food as medicine and how to cook plants. These classes discuss the power of plant foods in preventing disease and helping the body heal.
          </p>
          <div className="bg-white/20 border-2 border-white text-white p-6 rounded-lg max-w-2xl mx-auto" role="alert">
              <p className="font-bold text-xl">NO SCHEDULED CLASSES</p>
              <p>We will resume hosting classes when our new space opens. Stay tuned!</p>
          </div>
        </div>
      </section>

      {/* --- Quote Section --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <blockquote className="text-xl italic text-brand-gray border-l-4 border-brand-green pl-6">
              <p>“I know of nothing else in medicine that can come close to what a plant-based diet can do... it all comes from understanding nutrition, applying nutrition, and just watching the results."</p>
              <footer className="mt-4 font-bold not-italic">- T. Colin Campbell, MD</footer>
          </blockquote>
        </div>
      </section>
    </>
  );
};

export default Classes;