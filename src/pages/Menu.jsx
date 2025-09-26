import React, { useState, useEffect } from 'react';

const Menu = ({ onAddToCart }) => {
    const [menuItems, setMenuItems] = useState([]);
    const [menuType, setMenuType] = useState('fresh'); // 'fresh' or 'frozen'
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('https://adenneal.com/plantjoy/api/menu.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setMenuItems(data))
            .catch(error => {
                console.error("Error fetching menu:", error);
                setError("Could not load menu items. Please try again later.");
            });
    }, []);

    // Filter items based on the current menuType state
    const displayedItems = menuItems.filter(item => item.type === menuType);

    if (error) {
        return <div className="text-center py-20 text-red-500">{error}</div>;
    }

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl md:text-5xl font-bold text-center text-brand-gray mb-8">This Week's Menu</h2>
                
                {/* --- Selector Buttons --- */}
                <div className="text-center mb-12">
                    <button 
                        onClick={() => setMenuType('fresh')} 
                        className={`px-8 py-3 font-bold text-lg rounded-l-lg transition-colors duration-300 ${menuType === 'fresh' ? 'bg-brand-green text-white' : 'bg-gray-200 text-brand-gray'}`}
                    >
                        Fresh
                    </button>
                    <button 
                        onClick={() => setMenuType('frozen')} 
                        className={`px-8 py-3 font-bold text-lg rounded-r-lg transition-colors duration-300 ${menuType === 'frozen' ? 'bg-brand-blue text-white' : 'bg-gray-200 text-brand-gray'}`}
                    >
                        Frozen
                    </button>
                </div>

                {/* --- Conditionally Rendered Menu Section --- */}
                <div>
                    {menuType === 'fresh' ? (
                        <p className="text-center text-lg text-gray-500 mb-12">Available for order Wednesday through Sunday for Tuesday delivery.</p>
                    ) : (
                        <p className="text-center text-lg text-gray-500 mb-12">Available anytime. Perfect for stocking up!</p>
                    )}
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {displayedItems.map(item => (
                            <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
                                <div className="relative">
                                    <img src={item.image} alt={item.name} className="w-full h-56 object-cover" />
                                    <span className={`absolute top-0 right-0 text-white text-xs font-bold px-3 py-1 rounded-bl-lg ${item.type === 'fresh' ? 'bg-brand-green' : 'bg-brand-blue'}`}>
                                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                                    </span>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                                    <p className={`text-lg font-semibold mb-4 ${item.type === 'fresh' ? 'text-brand-green' : 'text-brand-blue'}`}>
                                        ${parseFloat(item.price).toFixed(2)}
                                    </p>
                                    <button 
                                        onClick={() => onAddToCart(item)} 
                                        className={`mt-auto w-full text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors duration-300 ${item.type === 'fresh' ? 'bg-brand-green' : 'bg-brand-blue'}`}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Menu;