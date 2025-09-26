import React from 'react';
import logo from '../assets/logo.webp'; // Assuming logo is in assets

// Reusable SVG Icons
const CalendarIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> );
const MouseClickIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg> );
const TruckIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h2a1 1 0 001-1V7a1 1 0 00-1-1h-2" /></svg> );
const LocationIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> );

const Hero = ({ onNavClick }) => (
  <section 
    className="relative bg-cover bg-center h-[60vh] md:h-[80vh] text-white flex items-center justify-center" 
    style={{backgroundImage: "url('https://images.unsplash.com/photo-1540914124281-342587941389?q=80&w=2940&auto=format&fit=crop')"}}
  >
    <div className="absolute inset-0 bg-black opacity-40"></div>
    <div className="relative z-10 text-center px-4">
      <img src={logo} alt="PlantJoy Logo" className="mx-auto mb-5 h-80 rounded-lg shadow-2xl" />
      <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight tracking-wide" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
        Deliciously Simple, Naturally Vegan.
      </h1>
      <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>
        Chef-crafted, plant-based meals delivered right to your door. Enjoy the taste of wholesome goodness without the hassle.
      </p>
      <button onClick={() => onNavClick('Menu')} className="bg-brand-green text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 text-lg">
        View This Week's Menu
      </button>
    </div>
  </section>
);

const AboutSection = () => (
    <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-brand-gray space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-brand-gray mb-6">What is Plant Joy?</h2>
                    <p className="text-lg leading-relaxed">
                        Plant Joy is a plant-based/vegan, <span className="font-bold">Meal Prep</span> and <span className="font-bold">Catering</span> service! Our meals are great-tasting, nutritionally balanced, made from scratch, and <span className="font-bold">100% DELICIOUS!</span> 
                    </p>
                    <h3 className="text-3xl font-bold text-brand-gray pt-4">What We're Cooking...</h3>
                    <p className="text-lg leading-relaxed">
                        Our meal prep service offers <span className="font-bold">family favorite meals, deli items, desserts, and frozen items</span>, all delivered right to you on Tuesdays. The menu changes each week and favorite items are rotated in.
                    </p>
                </div>
                <div>
                    <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2960&auto=format&fit=crop" alt="A colorful vegan bowl" className="rounded-lg shadow-2xl w-full h-full object-cover"/>
                </div>
            </div>
        </div>
    </section>
);

const HowItWorksSection = ({ onNavClick }) => {
    const steps = [
        { icon: <CalendarIcon />, title: "New Menu Weekly", description: "A new menu is released every Wednesday." },
        { icon: <MouseClickIcon />, title: "Order Online", description: "Place your pre-paid orders Wednesday through Sunday." },
        { icon: <TruckIcon />, title: "Deliveries", description: "Deliveries are on Tuesday throughout Milwaukee and Waukesha counties." },
        { icon: <LocationIcon />, title: "Pick Up Locations", description: "You can also choose to have your order delivered to a convenient pick up location." }
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6 lg:px-8 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-brand-gray mb-16">How It Works</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center">
                            {step.icon}
                            <h3 className="text-2xl font-bold text-brand-gray mt-6 mb-2">{step.title}</h3>
                            <p className="text-brand-gray leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-16">
                     <button onClick={() => onNavClick('Menu')} className="text-lg text-brand-pink font-bold hover:underline">
                        Click SHOP HERE to get started.
                     </button>
                </div>
            </div>
        </section>
    );
};



const LocationsSection = () => {
    const locations = [
        { name: "WI Cardiology Associates, Mequon", address: "11725 N. Port Washington Rd, Mequon, WI 53092" },
        { name: "Pop's Pantry, Muskego", address: "S75W17461 Janesville Road, Muskego, WI 53150" },
        { name: "Old Breed Strength Club", address: "2018 S 1st St #195, Bayview, WI 53207" },
        { name: "Kelly’s Greens", address: "8932 W North Ave, Wauwatosa, WI 53226" }
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6 lg:px-8 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-brand-gray mb-12">Our Pickup Locations</h2>
                <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
                    {locations.map((loc, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="font-bold text-2xl text-brand-gray">{loc.name}</h3>
                            <p className="text-brand-gray">{loc.address}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-12">
                    <p className="text-lg font-semibold">Want to be a pickup location?</p>
                    <a href="mailto:plantjoymke@gmail.com" className="text-brand-pink hover:underline">Email us for more information.</a>
                </div>
            </div>
        </section>
    );
};

const TestimonialsSection = () => {
    const testimonials = [
        { quote: "Thank you for feeding me power. Power I share with others!", author: "Anne R." },
        { quote: "Thank you for your amazing cooking, it is so wonderful to have a few extra meals which help me remain committed to a plant based lifestyle.", author: "Mina A." },
        { quote: "The burgers are absolutely delicious! Best ever, I will definitely need more!", author: "Jennifer S." },
        { quote: "It was so good. It smelled just like my Sicilian grandma’s kitchen! Thank you!", author: "Angela Q." }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 lg:px-8 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-brand-gray mb-16">What Our Customers Say</h2>
                <div className="grid md:grid-cols-2 gap-10">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-gray-50 p-8 rounded-lg shadow-lg">
                            <p className="text-brand-gray italic font-bold text-lg mb-6">"{testimonial.quote}"</p>
                            <p className="font-bold font-serif text-brand-pink">- {testimonial.author}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Home = ({ onNavClick }) => {
    return (
        <>
            <Hero onNavClick={onNavClick} />
            <AboutSection />
            <HowItWorksSection onNavClick={onNavClick} />
            <LocationsSection />
            <TestimonialsSection />
            
        </>
    );
};

export default Home;