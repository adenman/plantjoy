import React, { useEffect } from 'react'; // Import useEffect
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Bookings from './pages/Bookings';
import SalesLeads from './pages/SalesLeads';
import BudgetTracker from './pages/BudgetTracker';
import TaskBoard from './pages/TaskBoard';
import GoalTracker from './pages/GoalTracker';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';


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
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the current user

  // --- NEW: POOR MAN'S CRON TRIGGER ---
  // This useEffect runs once when the app component mounts.
  useEffect(() => {
    // We only want to trigger this if a user is logged in.
    if (user) {
      console.log("App loaded, triggering cron check...");
      // We use fetch but don't need to process the response.
      // This is a "fire and forget" request.
      fetch('/BoothPortal/api/cron_trigger.php', { method: 'POST' })
        .then(res => res.json())
        .then(data => {
            // Log the result for debugging purposes.
            console.log('Cron trigger result:', data.status, data.message);
        })
        .catch(error => {
            console.error('Cron trigger failed:', error);
        });
    }
  }, [user]); // The effect depends on the user object. It will run when the user logs in.

  const handleNavClick = (page) => {
    const route = `/${page.toLowerCase().replace(/\s+/g, '-')}`;
    navigate(route);
  };

  return (
    <div className="bg-white text-gray-800 font-sans">
      <Header
        onNavClick={handleNavClick}
      />
      <main>
        <Routes>
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/bookings" element={<PrivateRoute><Bookings /></PrivateRoute>} />
          <Route path="/sales-leads" element={<PrivateRoute><SalesLeads /></PrivateRoute>} />
          <Route path="/budget-tracker" element={<PrivateRoute><BudgetTracker /></PrivateRoute>} />
          <Route path="/goal-tracker" element={<PrivateRoute><GoalTracker /></PrivateRoute>} />
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
          
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;