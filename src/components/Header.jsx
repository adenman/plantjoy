import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import tinylogo from '../assets/logo.png';

const MenuIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>);
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const navLinks = ["Bookings", "Sales Leads", "Budget Tracker", "Goal Tracker"];

  const handleNav = (page) => {
    const route = `/${page.toLowerCase().replace(/\s+/g, '-')}`;
    navigate(route);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  }

  return (
    <header className="bg-black shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex-shrink-0">
            <img src={tinylogo} alt="The Booth MKE Logo" className="h-12 m-2"/>  
          </Link>
          {user && (
            <nav className="hidden lg:flex items-center space-x-6">
              {navLinks.map(link => (
                <Link key={link} to={`/${link.toLowerCase().replace(/\s+/g, '-')}`} className="text-gray-300 hover:text-white transition-colors duration-300 font-medium">
                  {link}
                </Link>
              ))}
              {isAdmin && (
                  <Link to="/admin" className="font-bold text-pink-500 hover:underline">Admin</Link>
              )}
            </nav>
          )}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                  <>
                      <Link to="/profile" className="text-sm font-medium text-gray-300 hover:text-white">My Account</Link>
                      <button onClick={handleLogout} className="text-gray-300 hover:text-white font-medium text-sm">Logout</button>
                  </>
              ) : (
                  <Link to="/login" className="text-gray-300 hover:text-white font-medium">Login</Link>
              )}
            </div>

            {user && (
              <div className="lg:hidden">
                <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white focus:outline-none">
                    {isOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-black border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => (
              <Link key={link} to={`/${link.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">
                {link}
              </Link>
            ))}
            {isAdmin && (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-pink-500 hover:bg-gray-800">Admin Dashboard</Link>
            )}
            <div className="border-t border-gray-700 pt-4 px-3">
              {user ? (
                  <div className="space-y-2">
                      <Link to="/profile" onClick={() => setIsOpen(false)} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">My Account</Link>
                      <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Logout</button>
                  </div>
              ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Login / Register</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;