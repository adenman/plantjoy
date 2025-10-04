import React from 'react';
import logo from '../assets/logo.png'; // Assuming logo is in assets

const Home = ({ onNavClick }) => {
    return (
        <>
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 lg:px-8 text-center">
                    <img src={logo} alt="The Booth MKE Logo" className="mx-auto mb-5 h-80 rounded-lg shadow-2xl" />
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight tracking-wide" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                        The Booth MKE Admin Portal
                    </h1>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                        Welcome to the admin portal for The Booth MKE.
                    </p>
                    <button onClick={() => onNavClick('Bookings')} className="bg-brand-green text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 text-lg">
                        View Bookings
                    </button>
                </div>
            </section>
        </>
    );
};

export default Home;