// src/components/Header.jsx
import React, { useState } from 'react';

// You can create a separate Icon file or keep them here
const MenuIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>);
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);
const ShoppingCartIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>);
const LeafIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-green-600"><path d="M17.61,3.43a1,1,0,0,0-1.1,0,7,7,0,0,0-3,5.78,7.29,7.29,0,0,0,1.8,5.1,1,1,0,0,0,.7.31,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.42,5.33,5.33,0,0,1-1.29-3.71,5,5,0,0,1,2.12-4.13A1,1,0,0,0,17.61,3.43Z"/><path d="M11.09,12.19a1,1,0,0,0-1.42,0,5.17,5.17,0,0,1-3.4,1.5,5.26,5.26,0,0,1-4-2,1,1,0,0,0-1.42,1.42,7.25,7.25,0,0,0,5.46,2.78,7.06,7.06,0,0,0,5.1-1.8A1,1,0,0,0,11.09,12.19Z"/></svg>);


const Header = ({ onNavClick, cartCount, onCartClick, isLoggedIn, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = ["Menu", "How It Works", "Our Story", "Catering", "Contact", "Classes", "Reheat", "Meal Prep", "Deli Info", "Supper Club"];

  const handleNav = (page) => {
      onNavClick(page);
      setIsOpen(false); // Close mobile menu on navigation
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#" onClick={() => handleNav('Home')} className="flex-shrink-0 flex items-center space-x-2">
            <LeafIcon />
            <span className="text-2xl font-bold text-gray-800 tracking-wider">PlantJoy</span>
          </a>
          <nav className="hidden md:flex space-x-8">
            {navLinks.map(link => (
              <a key={link} href="#" onClick={() => handleNav(link)} className="text-gray-600 hover:text-green-600 transition-colors duration-300 font-medium">
                {link}
              </a>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
              <button onClick={() => handleNav('Menu')} className="hidden md:inline-block bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition-all duration-300 transform hover:scale-105">
                Order Now
              </button>
              <button onClick={onCartClick} className="relative text-gray-600 hover:text-green-600">
                <ShoppingCartIcon />
                {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartCount}</span>
                )}
              </button>
              {isLoggedIn ? (
                <button onClick={onLogout} className="text-gray-600 hover:text-green-600">Logout</button>
              ) : (
                <button onClick={() => handleNav('Login')} className="text-gray-600 hover:text-green-600">Login</button>
              )}
              <div className="md:hidden">
                <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-green-600 focus:outline-none">
                    {isOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
              </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => (
              <a key={link} href="#" onClick={() => handleNav(link)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                {link}
              </a>
            ))}
          </div>
          <div className="p-4">
              <button onClick={() => handleNav('Menu')} className="w-full block text-center bg-green-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-green-600 transition-all duration-300">
                Order Now
              </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;