import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import BrowseFoodPage from './pages/BrowseFoodPage';
import HotelDashboard from './pages/HotelDashboard';
import HotelOrdersPage from './pages/HotelOrdersPage';
import CampOrdersPage from './pages/CampOrdersPage';
import './App.css';

function MainLayout() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="app-layout">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <main className="main-content">
        {activeTab === 'browse' && (
          <BrowseFoodPage
            onOpenAuth={() => setIsAuthOpen(true)}
            onClaimSuccess={() => setActiveTab('camp-orders')}
          />
        )}

        {activeTab === 'hotel-dashboard' && user?.role === 'hotel' && (
          <HotelDashboard />
        )}

        {activeTab === 'hotel-orders' && user?.role === 'hotel' && (
          <HotelOrdersPage />
        )}

        {activeTab === 'camp-orders' && user?.role === 'camp' && (
          <CampOrdersPage />
        )}
      </main>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;
