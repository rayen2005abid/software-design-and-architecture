// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import { authService } from './services/authService';

function PrivateRoute({ children }) {
  const user = authService.getCurrentUser();
  return user ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/patient-dashboard" 
          element={
            <PrivateRoute>
              <PatientDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/doctor-dashboard" 
          element={
            <PrivateRoute>
              <DoctorDashboard />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;