import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import GuardianModePage from './pages/GuardianModePage';
import DrivingLicensePage from './pages/DrivingLicensePage';
import DrivingLicenseWizardPage from './pages/DrivingLicenseWizardPage';
import ChallanPage from './pages/ChallanPage';
import ChallanLayout from './pages/ChallanLayout';
import ChallanUnderstandPage from './pages/ChallanUnderstandPage';
import ChallanHowToPayPage from './pages/ChallanHowToPayPage';
import ChallanDisagreePage from './pages/ChallanDisagreePage';
import AskMyVehiclePage from './pages/AskMyVehiclePage';
import VehicleRegistrationWizardPage from './pages/VehicleRegistrationWizardPage';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/layout/PrivateRoute';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Private Routes */}
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/guardian-mode" element={<PrivateRoute><GuardianModePage /></PrivateRoute>} />
            <Route path="/driving-license" element={<PrivateRoute><DrivingLicensePage /></PrivateRoute>} />
            <Route path="/driving-license/apply" element={<PrivateRoute><DrivingLicenseWizardPage /></PrivateRoute>} />
            
            <Route path="/challans" element={<PrivateRoute><ChallanLayout /></PrivateRoute>}>
              <Route index element={<ChallanPage />} />
            </Route>
            <Route path="/challan" element={<PrivateRoute><ChallanLayout /></PrivateRoute>}>
              <Route path="why-do-i-have-this-challan" element={<ChallanUnderstandPage />} />
              <Route path="how-to-pay" element={<ChallanHowToPayPage />} />
              <Route path="disagree" element={<ChallanDisagreePage />} />
            </Route>
            
            <Route path="/ask-my-vehicle" element={<PrivateRoute><AskMyVehiclePage /></PrivateRoute>} />
            <Route path="/register-vehicle" element={<PrivateRoute><VehicleRegistrationWizardPage /></PrivateRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App;