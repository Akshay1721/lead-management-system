import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null; // Don't show header if not authenticated
  }

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/leads" className="logo">
            <h1>Lead Management</h1>
          </Link>
        </div>
        
        <nav className="header-nav">
          <Link 
            to="/leads" 
            className={location.pathname === '/leads' ? 'nav-link active' : 'nav-link'}
          >
            Leads
          </Link>
        </nav>

        <div className="header-right">
          <div className="user-info">
            <span className="user-name">Welcome, {user?.name}</span>
            <span className="user-email">({user?.email})</span>
          </div>
          <button onClick={handleLogout} className="btn btn-outline">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;