import React from 'react';

const Footer = () => (
    <footer className="bg-brand-gray text-white">
        <div className="container mx-auto px-6 lg:px-8 py-16">
            <div className="grid md:grid-cols-2 gap-12">

                {/* Left Column: Contact and Info */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold font-serif mb-4">About Plant Joy</h3>
                    <p className="text-gray-300 leading-relaxed">
                        Use this website as a resource for plant-based food and health info. We love plants and sharing the benefits of a high-fiber, plant-heavy lifestyle. Eat the rainbow and choose plants to improve health, sustain optimal health, and protect the earth, animals, and our environment.
                    </p>
                    <p className="text-sm text-gray-400 italic pt-2">
                        *Please remember Plant Joy does not replace your doctor or medical team; we are simply sharing information.
                    </p>
                    <div className="pt-4 text-gray-200">
                        <p><a href="mailto:PlantJoyMKE@gmail.com" className="hover:text-brand-pink">PlantJoyMKE@gmail.com</a></p>
                        <p>414-301-7785 (text or call)</p>
                        <p>Milwaukee, WI</p>
                    </div>
                </div>

                {/* Right Column: Newsletter Signup */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold font-serif mb-4">Join the PlantJoy Family</h3>
                    <p className="text-gray-300">
                        Get weekly menu updates and special offers delivered to your inbox.
                    </p>
                    <form className="flex flex-col sm:flex-row max-w-md">
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="w-full flex-grow px-4 py-3 rounded-md sm:rounded-r-none text-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-green mb-2 sm:mb-0" 
                        />
                        <button 
                            type="submit" 
                            className="bg-brand-green text-white font-bold py-3 px-6 rounded-md sm:rounded-l-none hover:bg-opacity-90 transition-colors"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom Copyright Bar */}
            <div className="border-t border-gray-700 pt-8 mt-16 text-center">
                <p className="text-gray-400">&copy; {new Date().getFullYear()} PlantJoy MKE. All Rights Reserved.</p>
            </div>
        </div>
    </footer>
);

export default Footer;