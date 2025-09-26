import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import SupperClub from './pages/SupperClub';
import Reheat from './pages/Reheat';
import DeliInfo from './pages/DeliInfo';
import Classes from './pages/Classes';
import OurStory from './pages/OurStory';

import Contact from './pages/Contact';
import CartPage from './pages/CartPage';
import OrderCompletePage from './pages/OrderCompletePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminMenuPage from './pages/AdminMenuPage';
import AdminReheatPage from './pages/AdminReheatPage';
import AdminOrdersPage from './pages/AdminOrdersPage';

// Component to protect routes that require a user to be logged in.
const PrivateRoute = ({ children }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return user ? children : <Navigate to="/login" />;
};

// Component to protect admin routes
const AdminRoute = ({ children }) => {
    const { user, isAdmin, isLoading } = useAuth();
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return user && isAdmin ? children : <Navigate to="/" />;
};

function App() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const handleAddToCart = (item) => {
    setCartItems(prevItems => [...prevItems, item]);
    alert(`${item.name} has been added to your cart!`);
  };
  
  const clearCart = () => setCartItems([]);

  const handleUpdateCart = (newCartItems) => {
    setCartItems(newCartItems);
  };

  const handleNavClick = (page) => {
    const route = `/${page.toLowerCase().replace(/\s+/g, '-')}`;
    navigate(route);
  };

  return (
    <div className="bg-white text-gray-800 font-sans">
      <Header
        onNavClick={handleNavClick}
        cartCount={cartItems.length}
      />
      <main>
        <Routes>
          <Route path="/" element={<Home onNavClick={handleNavClick} />} />
          <Route path="/menu" element={<Menu onAddToCart={handleAddToCart} />} />

          <Route path="/our-story" element={<OurStory />} />

          <Route path="/contact" element={<Contact />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/reheat" element={<Reheat />} />
          <Route path="/deli-info" element={<DeliInfo onNavClick={handleNavClick} />} />
          <Route path="/supper-club" element={<SupperClub />} />
          <Route path="/cart" element={<CartPage cartItems={cartItems} onUpdateCart={handleUpdateCart} />} />
          <Route path="/order-complete" element={<OrderCompletePage onClearCart={clearCart} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/menu" element={<AdminRoute><AdminMenuPage /></AdminRoute>} />
          <Route path="/admin/reheat" element={<AdminRoute><AdminReheatPage /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;