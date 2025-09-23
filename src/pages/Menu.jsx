// src/pages/Menu.jsx
import React, { useState, useEffect } from 'react';

const Menu = ({ onAddToCart }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [menuType, setMenuType] = useState('fresh'); // 'fresh' or 'frozen'

    useEffect(() => {
        // Replace with your actual API endpoint
        fetch('https://adenneal.com/plantjoy/api/menu.php')
            .then(response => response.json())
            .then(data => setMenuItems(data))
            .catch(error => console.error("Error fetching menu:", error));
    }, []);

    const filteredItems = menuItems.filter(item => item.type === menuType);

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">This Week's Menu</h2>
                <div className="text-center mb-12">
                    <button onClick={() => setMenuType('fresh')} className={`px-6 py-2 rounded-l-lg ${menuType === 'fresh' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>Fresh</button>
                    <button onClick={() => setMenuType('frozen')} className={`px-6 py-2 rounded-r-lg ${menuType === 'frozen' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>Frozen</button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredItems.map(item => (
                        <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
                            <img src={item.image} alt={item.name} className="w-full h-56 object-cover" />
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                                <p className="text-lg font-semibold text-green-600 mb-4">${parseFloat(item.price).toFixed(2)}</p>
                                <button onClick={() => onAddToCart(item)} className="mt-auto w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Menu;