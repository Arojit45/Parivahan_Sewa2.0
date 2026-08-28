import React from 'react';
import { useKeepAlive } from './utils/useKeepAlive';
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
import CitizenGuidePage from './pages/CitizenGuidePage';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/layout/PrivateRoute';
import NativeDomTranslator from './components/NativeDomTranslator';
import MyDocumentsPage from './pages/MyDocumentsPage';
import TrackReviewPage from './pages/TrackReviewPage';
import CorrectionsPage from './pages/CorrectionsPage';
import AddVehiclePage from './pages/AddVehiclePage';
import FleetGatewayPage from './pages/FleetGatewayPage';
import FleetRegistrationPage from './pages/FleetRegistrationPage';
import FleetDashboardPage from './pages/FleetDashboardPage';
import HelpSupportPage from './pages/HelpSupportPage';

// Mounts the keep-alive scheduler once for the entire app session
const KeepAlive = () => { useKeepAlive(); return null; };

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <KeepAlive />
          <NativeDomTranslator />
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
            <Route path="/add-vehicle" element={<PrivateRoute><AddVehiclePage /></PrivateRoute>} />
            <Route path="/my-documents" element={<PrivateRoute><MyDocumentsPage /></PrivateRoute>} />
            <Route path="/track-review" element={<PrivateRoute><TrackReviewPage /></PrivateRoute>} />
            <Route path="/corrections" element={<PrivateRoute><CorrectionsPage /></PrivateRoute>} />
            <Route path="/help-support" element={<PrivateRoute><HelpSupportPage /></PrivateRoute>} />
            <Route path="/citizen-guide" element={<PrivateRoute><CitizenGuidePage /></PrivateRoute>} />
            <Route path="/citizen-guide/:guideId" element={<PrivateRoute><CitizenGuidePage /></PrivateRoute>} />
            {/* Fleet Routes */}
            <Route path="/fleet" element={<PrivateRoute><FleetGatewayPage /></PrivateRoute>} />
            <Route path="/fleet/register" element={<PrivateRoute><FleetRegistrationPage /></PrivateRoute>} />
            <Route path="/fleet/dashboard/:fleetId" element={<PrivateRoute><FleetDashboardPage /></PrivateRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App;
