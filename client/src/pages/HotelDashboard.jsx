import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function HotelDashboard() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New Listing Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantityServings, setQuantityServings] = useState('');
  const [foodType, setFoodType] = useState('Veg');
  const [preparedTime, setPreparedTime] = useState('Freshly prepared today');
  const [expiryHours, setExpiryHours] = useState('4');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const fetchMyListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/listings/my-listings');
      setListings(res.data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load your listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleCreateListing = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError('');
    setFormSuccess('');

    try {
      await api.post('/listings', {
        title,
        description,
        quantityServings: Number(quantityServings),
        foodType,
        preparedTime,
        expiryHours: Number(expiryHours)
      });

      setFormSuccess('Surplus food listing published! Camps can now discover it.');
      setTitle('');
      setDescription('');
      setQuantityServings('');
      setShowAddForm(false);
      fetchMyListings();
    } catch (err) {
      setFormError(err.message || 'Failed to create listing');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Are you sure you want to remove this food listing?')) return;
    try {
      await api.delete(`/listings/${id}`);
      fetchMyListings();
    } catch (err) {
      alert(err.message || 'Failed to delete listing');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Hotel Surplus Management</h2>
          <p className="page-desc">
            Posting from <strong>{user?.organizationName}</strong>. List edible surplus food for nearby camps at ₹0 food cost.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setFormError('');
            setFormSuccess('');
          }}
        >
          {showAddForm ? '✕ Close Form' : '+ Post Surplus Food'}
        </button>
      </div>

      {formSuccess && <div className="alert-success">{formSuccess}</div>}

      {/* Add Listing Form */}
      {showAddForm && (
        <div className="form-card">
          <h3 style={{ marginBottom: '1rem', color: 'var(--dark)' }}>New Surplus Food Listing</h3>
          {formError && <div className="alert-error">{formError}</div>}

          <form onSubmit={handleCreateListing}>
            <div className="form-grid">
              <div className="form-group">
                <label>Food Title / Description of Items *</label>
                <input
                  type="text"
                  placeholder="e.g. 40 Plates Vegetable Pulao & Dal"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Quantity (Number of Servings / Plates) *</label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 40"
                  value={quantityServings}
                  onChange={(e) => setQuantityServings(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Food Category</label>
                <select
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value)}
                  className="select-input"
                >
                  <option value="Veg">🥬 Pure Vegetarian</option>
                  <option value="Non-Veg">🍗 Non-Vegetarian</option>
                  <option value="Mixed">🍲 Mixed Assortment</option>
                </select>
              </div>

              <div className="form-group">
                <label>Claim / Pickup Window</label>
                <select
                  value={expiryHours}
                  onChange={(e) => setExpiryHours(e.target.value)}
                  className="select-input"
                >
                  <option value="2">Within 2 Hours</option>
                  <option value="4">Within 4 Hours (Recommended)</option>
                  <option value="6">Within 6 Hours</option>
                  <option value="12">Within 12 Hours</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '0.75rem' }}>
              <label>Packaging / Extra Notes (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Packed in foil containers, needs to be consumed hot"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn-primary" disabled={formSubmitting}>
                {formSubmitting ? 'Publishing...' : 'Publish Surplus Listing'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Listings List */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--dark)' }}>Your Listed Surplus Food</h3>

        {loading && (
          <div className="state-box loading">
            <div className="spinner"></div>
            <p>Loading your food listings...</p>
          </div>
        )}

        {error && !loading && (
          <div className="state-box error">
            <p>⚠️ {error}</p>
            <button className="btn-retry" onClick={fetchMyListings}>Retry</button>
          </div>
        )}

        {!loading && !error && listings.length === 0 && (
          <div className="state-box empty">
            <p>You have not posted any surplus food yet.</p>
            <button
              className="btn-primary"
              style={{ marginTop: '0.75rem' }}
              onClick={() => setShowAddForm(true)}
            >
              Post First Leftover Food
            </button>
          </div>
        )}

        {!loading && !error && listings.length > 0 && (
          <div className="table-wrapper">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Food Details</th>
                  <th>Type</th>
                  <th>Servings</th>
                  <th>Status</th>
                  <th>Valid Until</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <strong>{item.title}</strong>
                      {item.description && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.description}</div>}
                    </td>
                    <td>
                      <span className={`tag-type ${item.foodType.toLowerCase()}`}>
                        {item.foodType}
                      </span>
                    </td>
                    <td>{item.quantityServings} plates</td>
                    <td>
                      <span className={`status-badge ${item.status}`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td>{new Date(item.expiryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>
                      {item.status === 'available' && (
                        <button
                          className="btn-danger-sm"
                          onClick={() => handleDeleteListing(item._id)}
                        >
                          Delete
                        </button>
                      )}
                      {item.status === 'claimed' && (
                        <span style={{ fontSize: '0.85rem', color: '#f97316', fontWeight: 600 }}>Claimed by Camp</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default HotelDashboard;
