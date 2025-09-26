import React from 'react';

// --- Hero Section for the Supper Club Page ---
const SupperClubHero = () => (
    <section 
      className="relative bg-cover bg-center h-[50vh] text-white flex items-center justify-center" 
      style={{backgroundImage: "url('https://images.unsplash.com/photo-1505275350441-83dcda8eeef5?q=80&w=2874&auto=format&fit=crop')"}}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight tracking-wide" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
          The Plant Joy Supper Club
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>
          A one-of-a-kind, plant-based dining experience in Milwaukee.
        </p>
      </div>
    </section>
);

// --- Main Supper Club Page Component ---
const SupperClub = () => {
  return (
    <>
      <SupperClubHero />
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          
          {/* Main Content Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-brand-gray">Join an Exclusive Vegan Dining Experience</h2>
            <p className="text-lg leading-relaxed text-brand-gray">
              Join Chefs Amberlea Childs (Plant Joy) and Melanie Manuel (previously Celesta’s Owner) for Milwaukee’s only Vegan Supper Club. This one of a kind plant-based dining experience is sure to enhance your taste buds, expand your vegan palate and leave you wanting the next event date.
            </p>
            <p className="text-md text-gray-500">
              Supper Club events are private with limited seating, pre-sold tickets and held at various rotating locations.
            </p>
          </div>
          
          {/* Next Event Section */}
          <div className="mt-16 p-8 bg-brand-green/10 border-2 border-brand-green rounded-lg text-center">
            <h3 className="text-3xl font-bold text-brand-green mb-2">🎉 NEXT UP 🎉</h3>
            <p className="text-2xl font-semibold text-brand-gray">WE’RE UNDERWAY PLANNING THE NEXT … SUMMER FUN SUPPER CLUB.</p>
            <p className="text-xl font-bold text-brand-gray mt-2">DATE T.B.A</p>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">✺</span>
              <h4 className="text-xl font-bold text-brand-gray">Re-Imagined Ambiance</h4>
              <p>Classic Supper Club Ambiance, Re-Imagined Brunch, Plant Based/Vegan.</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">✺</span>
              <h4 className="text-xl font-bold text-brand-gray">Gourmet Seasonal Menu</h4>
              <p>Chef-crafted Gourmet 5-course Menu in celebration of the season. 100% gluten free menu.</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">✺</span>
              <h4 className="text-xl font-bold text-brand-gray">Unique Locations</h4>
              <p>Held at one-of-a-kind Milwaukee homes and historic places with limited seating for fellowship.</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <button className="bg-brand-pink text-white font-bold py-4 px-10 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 text-lg">
                Buy Tickets (Coming Soon)
            </button>
          </div>

        </div>
      </section>
      
      {/* Hosting Section */}
      <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-8 max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-brand-gray mb-4">Interested in Hosting a Supper Club?</h2>
            <p className="text-lg leading-relaxed text-brand-gray max-w-2xl mx-auto mb-6">
                If you are interested in hosting an event at your location or residence, we want to partner with you. We're seeking locations to host 20+ for a seated dinner experience. Hosts receive 2 complimentary tickets to the event!
            </p>
            <a href="mailto:plantjoymke@gmail.com" className="text-lg text-brand-pink font-bold hover:underline">
                Interested in hosting - click here!
            </a>
          </div>
      </section>
    </>
  );
};

export default SupperClub;