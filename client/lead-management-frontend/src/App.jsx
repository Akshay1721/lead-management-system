import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout.jsx';
import ProtectedRoute from './components/Common/ProtectedRoute.jsx';
import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';
import LeadsList from './components/Leads/LeadsList.jsx';
import LeadForm from './components/Leads/LeadForm.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route 
              path="/leads" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <LeadsList />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leads/new" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <LeadForm />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leads/edit/:id" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <LeadForm />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            {/* Root route - simpler redirect logic */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>

          {/* Toast notifications */}
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;