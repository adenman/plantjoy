import React from 'react';

const HowItWorks = () => {
    const pickupLocations = [
        { name: "Riverwest Coop, Milwaukee", address: "733 E Clarke St, Milwaukee, WI" },
        { name: "WI Cardiology Associates, Mequon", address: "11725 N. Port Washington Rd, Mequon, WI 53092" },
        { name: "Pop's Pantry, Muskego", address: "S75W17461 Janesville Road, Muskego, WI 53150" },
        { name: "Old Breed Strength Club", address: "2018 S 1st St #105, Bayview, WI 53207" },
        { name: "Kelly's Greens", address: "8932 W North Ave, Wauwatosa, WI 53226" },
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">How It Works</h2>
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    
                    {/* Ordering and Delivery Info */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Ordering & Delivery</h3>
                        <ul className="space-y-4 text-gray-700">
                            <li className="flex items-start">
                                <span className="bg-green-500 text-white rounded-full h-8 w-8 text-center leading-8 font-bold mr-4">1</span>
                                <div><strong>NEW Menu:</strong> Released every Wednesday each week.</div>
                            </li>
                            <li className="flex items-start">
                                <span className="bg-green-500 text-white rounded-full h-8 w-8 text-center leading-8 font-bold mr-4">2</span>
                                <div><strong>Place Orders:</strong> Wednesday through end of day Sunday. (All orders are pre-paid for the following week.)</div>
                            </li>
                            <li className="flex items-start">
                                <span className="bg-green-500 text-white rounded-full h-8 w-8 text-center leading-8 font-bold mr-4">3</span>
                                <div><strong>Deliveries:</strong> All orders are delivered fresh on Tuesday throughout Milwaukee and Waukesha Counties, and some parts of Ozaukee County.</div>
                            </li>
                        </ul>
                        <div className="mt-8 pt-6 border-t">
                            <h4 className="text-xl font-bold text-center mb-4">Delivery Fees</h4>
                            <ul className="text-center space-y-2 text-gray-700">
                                <li>Zone 1 - <strong>$5</strong> Delivery Fee</li>
                                <li>Zone 2 - <strong>$10</strong> Delivery Fee</li>
                                <li className="font-bold text-green-600 mt-2">*Orders over $100 earn $5 delivery credit!*</li>
                                <li className="text-sm text-gray-500">(Discount applied manually after order is complete)</li>
                            </ul>
                        </div>
                    </div>

                    {/* Pickup Locations */}
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Pick Up Locations</h3>
                        <div className="space-y-4">
                            {pickupLocations.map(location => (
                                <div key={location.name} className="p-4 border rounded-md">
                                    <p className="font-bold text-gray-800">{location.name}</p>
                                    <p className="text-sm text-gray-600">{location.address}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 text-center">
                            <p className="font-bold">Want to be a pick up location?</p>
                            <a href="mailto:plantjoymke@gmail.com" className="text-green-600 hover:underline">Email us for more information.</a>
                        </div>
                    </div>
                </div>
                 <div className="text-center mt-12">
                    <a href="https://www.plantjoy.net/s/shop" target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 text-lg">
                        Click Here to Start Your Order
                    </a>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;