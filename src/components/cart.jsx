import React from 'react';
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);

const Cart = ({ cartItems, onCartClick, onRemoveFromCart }) => {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
            <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col animate-slide-in">
                <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h2 className="text-2xl font-bold">Your Cart</h2>
                    <button onClick={onCartClick} className="text-gray-500 hover:text-gray-800"><CloseIcon/></button>
                </div>
                {cartItems.length === 0 ? (
                    <p className="text-center text-gray-500 flex-grow flex items-center justify-center">Your cart is empty.</p>
                ) : (
                    <div className="flex-grow overflow-y-auto">
                        {cartItems.map((item, index) => (
                            <div key={index} className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="font-bold">{item.name}</p>
                                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                                </div>
                                <button onClick={() => onRemoveFromCart(index)} className="text-red-500 hover:text-red-700 font-bold">Remove</button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-xl mb-4">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors duration-300 disabled:bg-gray-400" disabled={cartItems.length === 0}>
                        Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;