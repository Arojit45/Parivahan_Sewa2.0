import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import GuardianModePage from './pages/GuardianModePage';
import DrivingLicensePage from './pages/DrivingLicensePage';
import DrivingLicenseWizardPage from './pages/DrivingLicenseWizardPage';
import ChallanPage from './pages/ChallanPage';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/guardian-mode" element={<GuardianModePage />} />
          <Route path="/driving-license" element={<DrivingLicensePage />} />
          <Route path="/driving-license/apply" element={<DrivingLicenseWizardPage />} />
          <Route path="/challans" element={<ChallanPage />} />
        </Routes>
      </Router>
    </LanguageProvider>
  )
}

export default App;