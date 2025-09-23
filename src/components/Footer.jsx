import React from 'react';

const Footer = () => (
    <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Join the PlantJoy Family</h3>
                <p className="text-gray-400 mb-6">Get weekly menu updates and special offers delivered to your inbox.</p>
                <form className="flex flex-col sm:flex-row justify-center max-w-md mx-auto">
                    <input type="email" placeholder="Enter your email" className="w-full sm:w-auto flex-grow px-4 py-3 rounded-md sm:rounded-r-none text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 mb-2 sm:mb-0" />
                    <button type="submit" className="bg-green-500 text-white font-bold py-3 px-6 rounded-md sm:rounded-l-none hover:bg-green-600 transition-colors duration-300">Subscribe</button>
                </form>
            </div>
            <div className="border-t border-gray-700 pt-8 text-center">
                <p className="text-gray-400">&copy; {new Date().getFullYear()} PlantJoy MKE. All Rights Reserved.</p>
            </div>
        </div>
    </footer>
);

export default Footer;