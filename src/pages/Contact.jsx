import React from 'react';

const Contact = () => (
    <section className="py-20 bg-gray-50 min-h-[50vh]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">Contact Us</h2>
            <div className="max-w-3xl mx-auto text-center text-gray-600 leading-relaxed">
                <p className="mb-4">
                    Use this website a resource for plant based food and health info, we love plants and sharing about the benefits of a high fiber plant heavy lifestyle. Eat the rainbow and choose plants to improve health, sustain optimal health and to and to protect the earth, animals and our environment.
                </p>
                <p className="mb-8 text-sm italic">
                    *Please remember Plant Joy does not replace your doctor or medical team, we are simply sharing information.
                </p>
                <div className="bg-white p-6 rounded-lg shadow-md inline-block">
                    <p className="text-lg font-semibold">
                        <a href="mailto:PlantJoyMKE@gmail.com" className="text-green-600 hover:underline">PlantJoyMKE@gmail.com</a>
                    </p>
                    <p className="text-lg font-semibold my-2">•</p>
                    <p className="text-lg font-semibold">
                        414 301-7785 (text or call)
                    </p>
                     <p className="text-lg font-semibold mt-2">
                        Milwaukee, WI
                    </p>
                </div>
            </div>
        </div>
    </section>
);

export default Contact;