import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function CampOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCampOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/orders/my-camp-orders');
      setOrders(res.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load your claimed orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampOrders();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Our Camp Claims & Delivery Trackers</h2>
          <p className="page-desc">
            Showing all surplus meals claimed for <strong>{user?.organizationName}</strong>.
          </p>
        </div>
        <button className="btn-secondary" onClick={fetchCampOrders}>Refresh Status</button>
      </div>

      {loading && (
        <div className="state-box loading">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      )}

      {error && !loading && (
        <div className="state-box error">
          <p>⚠️ {error}</p>
          <button className="btn-retry" onClick={fetchCampOrders}>Retry</button>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="state-box empty">
          <span style={{ fontSize: '2.5rem' }}>⛺</span>
          <h3>No Food Claims Yet</h3>
          <p>Browse available food listings from local hotels and claim surplus meals for your camp!</p>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="orders-cards-list">
          {orders.map((ord) => (
            <div key={ord._id} className="order-summary-card">
              <div className="order-header-row">
                <div>
                  <span className="order-id-label">CLAIM #{ord._id.slice(-6).toUpperCase()}</span>
                  <h3 style={{ marginTop: '0.25rem', color: 'var(--dark)' }}>
                    {ord.foodListing?.title || 'Surplus Meal Package'}
                  </h3>
                </div>
                <span className={`status-badge ${ord.orderStatus}`}>
                  {ord.orderStatus === 'placed' && '⏳ Order Placed'}
                  {ord.orderStatus === 'picked_up' && '🚴 Out for Delivery'}
                  {ord.orderStatus === 'delivered' && '✅ Delivered to Camp'}
                  {ord.orderStatus === 'cancelled' && '❌ Cancelled'}
                </span>
              </div>

              <div className="order-meta-grid">
                <div>
                  <small style={{ color: 'var(--text-muted)' }}>Donor Hotel / Restaurant</small>
                  <p style={{ fontWeight: 600 }}>🏨 {ord.hotelName}</p>
                  {ord.hotelPhone && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📞 {ord.hotelPhone}</p>}
                </div>

                <div>
                  <small style={{ color: 'var(--text-muted)' }}>Receiving Camp</small>
                  <p style={{ fontWeight: 600 }}>⛺ {ord.campName}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📞 {ord.campPhone}</p>
                </div>

                <div>
                  <small style={{ color: 'var(--text-muted)' }}>Food Charge</small>
                  <p style={{ fontWeight: 700, color: '#10b981' }}>₹0 (Free Donation)</p>
                </div>

                <div>
                  <small style={{ color: 'var(--text-muted)' }}>Delivery Charge</small>
                  <p style={{ fontWeight: 700, color: '#f97316' }}>₹{ord.deliveryFee} Flat</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({ord.paymentStatus.toUpperCase()})</span>
                </div>
              </div>

              {ord.specialNotes && (
                <div className="order-note-box">
                  <strong>Camp Note:</strong> {ord.specialNotes}
                </div>
              )}

              <div className="order-footer-row">
                <small style={{ color: 'var(--text-muted)' }}>
                  Claimed on: {new Date(ord.createdAt).toLocaleString()}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CampOrdersPage;
