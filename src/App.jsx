import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Bookings from './pages/Bookings';
import SalesLeads from './pages/SalesLeads';
import BudgetTracker from './pages/BudgetTracker';
import GoalTracker from './pages/GoalTracker';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import TaskBoard from './pages/TaskBoard';


// Component to protect routes that require a user to be logged in.
const PrivateRoute = ({ children }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) {
        return <div className="p-8 text-center">Loading...</div>;
    }
    return user ? children : <Navigate to="/login" />;
};

// Component to protect admin routes
const AdminRoute = ({ children }) => {
    const { user, isAdmin, isLoading } = useAuth();
    if (isLoading) {
        return <div className="p-8 text-center">Loading...</div>;
    }
    return user && isAdmin ? children : <Navigate to="/" />;
};

function App() {
  const navigate = useNavigate();

  const handleNavClick = (page) => {
    const route = `/${page.toLowerCase().replace(/\s+/g, '-')}`;
    navigate(route);
  };

  return (
    <div className="text-gray-800 font-sans">
      <Header onNavClick={handleNavClick} />
      <main>
        <Routes>
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/bookings" element={<PrivateRoute><Bookings /></PrivateRoute>} />
          <Route path="/sales-leads" element={<PrivateRoute><SalesLeads /></PrivateRoute>} />
          <Route path="/budget-tracker" element={<PrivateRoute><BudgetTracker /></PrivateRoute>} />
          <Route path="/goal-tracker" element={<PrivateRoute><GoalTracker /></PrivateRoute>} />
          <Route path="/task-board" element={<PrivateRoute><TaskBoard /></PrivateRoute>} />
          
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
    </div>
  );
}

export default App;