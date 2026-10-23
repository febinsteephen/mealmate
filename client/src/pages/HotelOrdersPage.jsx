import { useState, useEffect } from 'react';
import api from '../services/api';

function HotelOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/orders/my-hotel-orders');
      setOrders(res.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load incoming claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Incoming Camp Claims & Pickups</h2>
          <p className="page-desc">
            Track donation camps that claimed your surplus food. Delivery charge (₹200) is paid directly by the camp.
          </p>
        </div>
        <button className="btn-secondary" onClick={fetchOrders}>Refresh Claims</button>
      </div>

      {loading && (
        <div className="state-box loading">
          <div className="spinner"></div>
          <p>Loading incoming orders...</p>
        </div>
      )}

      {error && !loading && (
        <div className="state-box error">
          <p>⚠️ {error}</p>
          <button className="btn-retry" onClick={fetchOrders}>Retry</button>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="state-box empty">
          <span style={{ fontSize: '2.5rem' }}>📦</span>
          <h3>No Claims Yet</h3>
          <p>When a relief or donation camp claims your food listing, it will appear here for pickup.</p>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Receiving Camp</th>
                <th>Camp Contact</th>
                <th>Food Item</th>
                <th>Delivery Fee</th>
                <th>Order Status</th>
                <th>Update Progress</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord._id}>
                  <td>
                    <strong>⛺ {ord.campName}</strong>
                    {ord.specialNotes && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Note: {ord.specialNotes}
                      </div>
                    )}
                  </td>
                  <td>📞 {ord.campPhone}</td>
                  <td>
                    <strong>{ord.foodListing?.title || 'Food Package'}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {ord.foodListing?.quantityServings} servings
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#f97316' }}>₹{ord.deliveryFee}</span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({ord.paymentStatus.toUpperCase()})</div>
                  </td>
                  <td>
                    <span className={`status-badge ${ord.orderStatus}`}>
                      {ord.orderStatus.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {ord.orderStatus === 'placed' && (
                        <button
                          className="btn-status-action"
                          onClick={() => handleUpdateStatus(ord._id, 'picked_up')}
                        >
                          Mark Picked Up
                        </button>
                      )}
                      {ord.orderStatus === 'picked_up' && (
                        <button
                          className="btn-status-action success"
                          onClick={() => handleUpdateStatus(ord._id, 'delivered')}
                        >
                          Mark Delivered
                        </button>
                      )}
                      {ord.orderStatus === 'delivered' && (
                        <span style={{ color: '#059669', fontWeight: 600, fontSize: '0.85rem' }}>✅ Delivered</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HotelOrdersPage;
