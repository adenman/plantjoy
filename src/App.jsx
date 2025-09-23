// src/App.jsx
import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './components/Cart';

// Import all the page components
import Home from './pages/Home';
import Menu from './pages/Menu';
import HowItWorks from './pages/HowItWorks';
import OurStory from './pages/OurStory';
import Catering from './pages/Catering';
import Contact from './pages/Contact';
import Classes from './pages/Classes';
import Reheat from './pages/Reheat';
import MealPrep from './pages/MealPrep';
import DeliInfo from './pages/DeliInfo.jsx';
import SupperClub from './pages/SupperClub';
import Login from './pages/Login';

function App() {
  const [currentPage, setCurrentPage] = useState('Home');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAddToCart = (item) => {
    setCartItems(prevItems => [...prevItems, item]);
    alert(`${item.name} added to cart!`);
  };

  const handleRemoveFromCart = (indexToRemove) => {
    setCartItems(prevItems => prevItems.filter((_, index) => index !== indexToRemove));
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'Home':
        return <Home onNavClick={setCurrentPage} />;
      case 'Menu':
        return <Menu onAddToCart={handleAddToCart} />;
      case 'How It Works':
        return <HowItWorks />;
      case 'Our Story':
        return <OurStory />;
      case 'Catering':
        return <Catering />;
      case 'Contact':
        return <Contact />;
      case 'Classes':
        return <Classes />;
      case 'Reheat':
        return <Reheat />;
      case 'Meal Prep':
        return <MealPrep />;
      case 'Deli Info':
          return <DeliInfo />;
      case 'Supper Club':
          return <SupperClub />;
      case 'Login':
        return <Login onLogin={() => setIsLoggedIn(true)} />;
      default:
        return <Home onNavClick={setCurrentPage} />;
    }
  };

  return (
    <div className="bg-white text-gray-800 font-sans">
      <Header
        onNavClick={setCurrentPage}
        cartCount={cartItems.length}
        onCartClick={() => setIsCartOpen(!isCartOpen)}
        isLoggedIn={isLoggedIn}
        onLogout={() => setIsLoggedIn(false)}
      />
      <main>
        {renderPage()}
      </main>
      {isCartOpen && <Cart cartItems={cartItems} onCartClick={() => setIsCartOpen(false)} onRemoveFromCart={handleRemoveFromCart} />}
      <Footer />
    </div>
  );
}

export default App;