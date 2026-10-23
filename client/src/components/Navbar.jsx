import { useAuth } from '../context/AuthContext';

function Navbar({ activeTab, setActiveTab, onOpenAuth }) {
  const { user, logout } = useAuth();

  return (
    <header className="navbar-container">
      <div className="nav-brand" onClick={() => setActiveTab('browse')} style={{ cursor: 'pointer' }}>
        <span className="brand-icon">🍲</span>
        <div>
          <span className="brand-name">MealMate</span>
          <span className="brand-sub">Food Rescue & Camp Redistribution</span>
        </div>
      </div>

      <div className="nav-actions">
        <button
          className={`nav-link ${activeTab === 'browse' ? 'active' : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          🔍 Browse Available Food
        </button>

        <button
          className={`nav-link ${activeTab === 'directory' ? 'active' : ''}`}
          onClick={() => setActiveTab('directory')}
        >
          🏢 Community Directory
        </button>

        {user?.role === 'hotel' && (
          <>
            <button
              className={`nav-link ${activeTab === 'hotel-dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('hotel-dashboard')}
            >
              📋 My Hotel Listings
            </button>
            <button
              className={`nav-link ${activeTab === 'hotel-orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('hotel-orders')}
            >
              📦 Incoming Claims
            </button>
          </>
        )}

        {user?.role === 'camp' && (
          <button
            className={`nav-link ${activeTab === 'camp-orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('camp-orders')}
          >
            ⛺ Our Claimed Orders
          </button>
        )}

        <div className="nav-user-section">
          {user ? (
            <div className="user-profile-badge">
              <span className="role-tag">
                {user.role === 'hotel' ? '🏨 Hotel' : '⛺ Camp'}: <strong>{user.organizationName}</strong>
              </span>
              <button className="btn-logout" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="btn-login-modal" onClick={onOpenAuth}>
              Sign In / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
