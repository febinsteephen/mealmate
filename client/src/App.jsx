import { useState, useEffect } from 'react';
import api from './services/api';
import './App.css';

function App() {
  const [apiStatus, setApiStatus] = useState({
    state: 'loading', // 'loading' | 'success' | 'error'
    message: 'Connecting to MealMate backend API...',
    timestamp: null
  });

  const checkBackendHealth = async () => {
    setApiStatus({ state: 'loading', message: 'Checking API health...', timestamp: null });
    try {
      const response = await api.get('/health');
      setApiStatus({
        state: 'success',
        message: response.data.message || 'API connection active!',
        timestamp: response.data.timestamp
      });
    } catch (err) {
      setApiStatus({
        state: 'error',
        message: err.message || 'Unable to reach MealMate backend. Make sure the server is running on port 5000.',
        timestamp: null
      });
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-group">
          <span style={{ fontSize: '1.8rem' }}>🍲</span>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--dark)' }}>MealMate</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>MERN Stack Food Rescue Platform</p>
          </div>
        </div>
        <span className="brand-badge">ICTAK Project</span>
      </header>

      <main>
        <section className="hero-section">
          <h2 className="hero-title">Bridging Surplus Food & Camp Need</h2>
          <p className="hero-subtitle">
            Shops and restaurants list leftover edible food for free. Verified donation camps and shelter homes claim it, paying only the fair delivery fee.
          </p>

          <div className={`status-card ${apiStatus.state}`}>
            <span>
              {apiStatus.state === 'loading' && '⏳ '}
              {apiStatus.state === 'success' && '🟢 '}
              {apiStatus.state === 'error' && '🔴 '}
              <strong>Backend Status:</strong> {apiStatus.message}
            </span>
            {apiStatus.timestamp && (
              <small style={{ marginLeft: '0.5rem', opacity: 0.8 }}>
                ({new Date(apiStatus.timestamp).toLocaleTimeString()})
              </small>
            )}
          </div>

          <div>
            <button className="btn-primary" onClick={checkBackendHealth} disabled={apiStatus.state === 'loading'}>
              {apiStatus.state === 'loading' ? 'Checking...' : 'Re-check API Status'}
            </button>
          </div>
        </section>

        <section>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--dark)' }}>Core Platform Roles</h3>
          <div className="roles-grid">
            <div className="role-card">
              <h3>🏪 Food Donors (Shops)</h3>
              <p>Restaurants, bakeries, and caterers list surplus packaged and prepared food with freshness & pickup windows.</p>
              <span className="badge-tag" style={{ background: '#ecfdf5', color: '#065f46' }}>Food Cost: ₹0 / Free</span>
            </div>

            <div className="role-card">
              <h3>⛺ Relief Camps & Shelters</h3>
              <p>Community kitchens, flood relief camps, and orphanages browse verified listings nearby and claim meals for residents.</p>
              <span className="badge-tag" style={{ background: '#fff7ed', color: '#c2410c' }}>Only Pay Delivery Charge</span>
            </div>

            <div className="role-card">
              <h3>🚴 Logistics & Admin</h3>
              <p>Riders handle quick pickup and drop-off before food expiry. Admins verify legitimate camps and eateries.</p>
              <span className="badge-tag" style={{ background: '#eff6ff', color: '#1d4ed8' }}>Quality & Safety Guard</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
