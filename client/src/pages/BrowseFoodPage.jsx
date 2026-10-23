import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function BrowseFoodPage({ onOpenAuth, onClaimSuccess }) {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('All');
  const [search, setSearch] = useState('');

  // Claim modal state
  const [selectedListing, setSelectedListing] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [specialNotes, setSpecialNotes] = useState('');
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimSuccessMessage, setClaimSuccessMessage] = useState('');
  const [claimErrorMessage, setClaimErrorMessage] = useState('');

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filterType !== 'All') params.foodType = filterType;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/listings', { params });
      setListings(res.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load surplus food listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [filterType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const handleResetDemo = async () => {
    setLoading(true);
    try {
      await api.post('/listings/reset-demo');
      fetchListings();
    } catch (err) {
      alert(err.message || 'Failed to refresh demo listings');
      setLoading(false);
    }
  };

  const handleOpenClaim = (listing) => {
    if (!user) {
      onOpenAuth();
      return;
    }
    if (user.role !== 'camp') {
      alert('Only registered Camps / Donation Shelters can claim food. Please login with a Camp account.');
      return;
    }
    setSelectedListing(listing);
    setClaimSuccessMessage('');
    setClaimErrorMessage('');
  };

  const handleConfirmClaim = async () => {
    if (!selectedListing) return;
    setClaimLoading(true);
    setClaimErrorMessage('');
    try {
      await api.post('/orders', {
        foodListingId: selectedListing._id,
        paymentMethod,
        specialNotes
      });

      setClaimSuccessMessage(`Successfully claimed! Flat delivery fee of ₹200 has been recorded for ${selectedListing.hotelName}.`);
      // Refresh listings
      fetchListings();
      setTimeout(() => {
        setSelectedListing(null);
        if (onClaimSuccess) onClaimSuccess();
      }, 1800);
    } catch (err) {
      setClaimErrorMessage(err.message || 'Failed to claim food listing');
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Available Leftover & Surplus Food</h2>
          <p className="page-desc">
            Directly from verified restaurants and shops. Food is <strong>100% free</strong> — camps only pay the fixed <strong>₹200 delivery fee</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <form onSubmit={handleSearchSubmit} className="search-box">
            <input
              type="text"
              placeholder="Search food or hotel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="btn-search">Search</button>
          </form>
          <button
            type="button"
            className="btn-secondary"
            title="Refresh demo batch with active expiry times"
            onClick={handleResetDemo}
            style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}
          >
            🔄 Refresh Demo Food
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="filter-chips">
        {['All', 'Veg', 'Non-Veg', 'Mixed'].map((type) => (
          <button
            key={type}
            className={`chip-btn ${filterType === type ? 'active' : ''}`}
            onClick={() => setFilterType(type)}
          >
            {type === 'Veg' ? '🥬 Veg Only' : type === 'Non-Veg' ? '🍗 Non-Veg' : type}
          </button>
        ))}
      </div>

      {/* ICTAK 4-States implementation */}
      {loading && (
        <div className="state-box loading">
          <div className="spinner"></div>
          <p>Finding available food donations...</p>
        </div>
      )}

      {error && !loading && (
        <div className="state-box error">
          <p>⚠️ {error}</p>
          <button className="btn-retry" onClick={fetchListings}>Try Again</button>
        </div>
      )}

      {!loading && !error && listings.length === 0 && (
        <div className="state-box empty">
          <span style={{ fontSize: '2.5rem' }}>🍽️</span>
          <h3>All Food Currently Claimed or Expired</h3>
          <p>You can refresh the active demo food listings anytime to test or evaluate!</p>
          <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={handleResetDemo}>
            🔄 Restore Active Food Listings
          </button>
        </div>
      )}

      {!loading && !error && listings.length > 0 && (
        <div className="listings-grid">
          {listings.map((item) => (
            <div key={item._id} className="food-card">
              <div className="card-top">
                <span className={`tag-type ${item.foodType.toLowerCase()}`}>
                  {item.foodType === 'Veg' ? '🥬 Veg' : '🍗 Non-Veg'}
                </span>
                <span className="servings-badge">{item.quantityServings} Servings</span>
              </div>

              <h3 className="food-title">{item.title}</h3>

              <div className="hotel-meta">
                <span>🏨 Offered by: <strong>{item.hotelName}</strong></span>
              </div>

              {item.description && <p className="food-desc">{item.description}</p>}

              <div className="pricing-box">
                <div className="price-item">
                  <span className="price-label">Food Cost:</span>
                  <span className="price-val free">₹0 (Free)</span>
                </div>
                <div className="price-item">
                  <span className="price-label">Delivery Fee:</span>
                  <span className="price-val fee">₹200 Flat</span>
                </div>
              </div>

              <div className="time-info">
                <small>⏰ Pickup Deadline: {new Date(item.expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
              </div>

              <button
                className="btn-claim-food"
                onClick={() => handleOpenClaim(item)}
              >
                Claim for Camp (₹200 Delivery)
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Claim Modal */}
      {selectedListing && (
        <div className="modal-backdrop" onClick={() => setSelectedListing(null)}>
          <div className="modal-card claim-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Food Claim</h3>
              <button className="btn-close" onClick={() => setSelectedListing(null)}>✕</button>
            </div>

            {claimSuccessMessage ? (
              <div className="alert-success">{claimSuccessMessage}</div>
            ) : (
              <>
                {claimErrorMessage && <div className="alert-error">{claimErrorMessage}</div>}

                <div className="claim-summary">
                  <div className="summary-row">
                    <span>Food Item:</span>
                    <strong>{selectedListing.title} ({selectedListing.quantityServings} servings)</strong>
                  </div>
                  <div className="summary-row">
                    <span>Donor Hotel:</span>
                    <strong>{selectedListing.hotelName}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Receiving Camp:</span>
                    <strong>{user?.organizationName}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Camp Phone:</span>
                    <strong>{user?.phone}</strong>
                  </div>
                  <hr style={{ margin: '0.75rem 0', borderColor: 'var(--border)' }} />
                  <div className="summary-row">
                    <span>Food Cost:</span>
                    <strong style={{ color: '#10b981' }}>₹0 (Donation)</strong>
                  </div>
                  <div className="summary-row total-row">
                    <span>Delivery Fee:</span>
                    <strong style={{ color: '#f97316', fontSize: '1.25rem' }}>₹200 Only</strong>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label>Payment Mode for ₹200 Delivery Fee:</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="select-input"
                  >
                    <option value="online">Online Payment (Mock UPI / Card)</option>
                    <option value="cash_on_delivery">Cash on Delivery (Pay to Rider)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Special Instructions / Gate Landmark for Camp:</label>
                  <input
                    type="text"
                    placeholder="e.g. Near main community hall tent"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                  />
                </div>

                <button
                  className="btn-confirm-claim"
                  onClick={handleConfirmClaim}
                  disabled={claimLoading}
                >
                  {claimLoading ? 'Processing Claim...' : 'Confirm Order & Pay ₹200 Delivery'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BrowseFoodPage;
