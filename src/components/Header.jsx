import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import tinylogo from '../assets/logo.png';

// Icon Components
const MenuIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>);
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);

const Header = ({ onNavClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth(); // Get user state and admin status from AuthContext
  const navLinks = ["Bookings", "Sales Leads", "Budget Tracker", "Task Board", "Goal Tracker"];

  const handleNav = (page) => {
    onNavClick(page);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  }

  return (
    <header className="bg-gray shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex-shrink-0">
            <img src={tinylogo} alt="The Booth MKE Logo" className="h-12 m-2"/>  
          </Link>
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map(link => (
              <a key={link} href="#" onClick={() => handleNav(link)} className="text-brand-gray hover:text-brand-pink transition-colors duration-300 font-medium">
                {link}
              </a>
            ))}
            {/* Show Admin link only if user is an admin */}
            {isAdmin && (
                <Link to="/admin" className="font-bold text-brand-pink hover:underline">Admin</Link>
            )}
          </nav>
          <div className="flex items-center space-x-4">
            
            {/* Conditional rendering for Login/Profile/Logout */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                  <>
                      <Link to="/profile" className="text-sm font-medium text-brand-gray hover:text-brand-pink">My Account</Link>
                      <button onClick={logout} className="text-brand-gray hover:text-brand-pink font-medium text-sm">Logout</button>
                  </>
              ) : (
                  <Link to="/login" className="text-brand-gray hover:text-brand-pink font-medium">Login</Link>
              )}
            </div>

            <div className="lg:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-brand-gray hover:text-brand-pink focus:outline-none">
                  {isOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-gray border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => (
              <a key={link} href="#" onClick={() => handleNav(link)} className="block px-3 py-2 rounded-md text-base font-medium text-brand-gray hover:text-brand-pink hover:bg-gray-50">
                {link}
              </a>
            ))}
            {/* Admin link for mobile */}
            {isAdmin && (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-brand-pink hover:bg-gray-50">Admin Dashboard</Link>
            )}
            <div className="border-t pt-4 px-3">
              {user ? (
                  <div className="space-y-2">
                      <Link to="/profile" onClick={() => setIsOpen(false)} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-brand-gray hover:text-brand-pink hover:bg-gray-50">My Account</Link>
                      <a href="#" onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-brand-gray hover:text-brand-pink hover:bg-gray-50">Logout</a>
                  </div>
              ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-brand-gray hover:text-brand-pink hover:bg-gray-50">Login / Register</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;