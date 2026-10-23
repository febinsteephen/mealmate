import { useState, useEffect } from 'react';
import api from '../services/api';

function DirectoryPage() {
  const [hotels, setHotels] = useState([]);
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewTab, setViewTab] = useState('all'); // 'all' | 'hotels' | 'camps'
  const [search, setSearch] = useState('');

  const fetchDirectory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/auth/directory');
      setHotels(res.data.data.hotels || []);
      setCamps(res.data.data.camps || []);
    } catch (err) {
      setError(err.message || 'Failed to load community directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectory();
  }, []);

  const filteredHotels = hotels.filter((h) =>
    h.organizationName.toLowerCase().includes(search.toLowerCase()) ||
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCamps = camps.filter((c) =>
    c.organizationName.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const getCampCategory = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('orphan') || lower.includes('bala') || lower.includes('children')) {
      return { label: '👶 Children & Orphanage', color: '#8b5cf6', bg: '#f5f3ff' };
    }
    if (lower.includes('old age') || lower.includes('vridha') || lower.includes('senior')) {
      return { label: '👵 Old Age / Senior Care', color: '#d97706', bg: '#fffbeb' };
    }
    return { label: '⛺ Disaster & Relief Camp', color: '#0284c7', bg: '#f0f9ff' };
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Verified Community Directory</h2>
          <p className="page-desc">
            Browse all verified restaurants donating food and welfare organizations receiving aid.
          </p>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search hotel, orphanage, or camp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Directory Filter Chips */}
      <div className="filter-chips">
        <button
          className={`chip-btn ${viewTab === 'all' ? 'active' : ''}`}
          onClick={() => setViewTab('all')}
        >
          🌐 All Registered ({hotels.length + camps.length})
        </button>
        <button
          className={`chip-btn ${viewTab === 'hotels' ? 'active' : ''}`}
          onClick={() => setViewTab('hotels')}
        >
          🏨 Hotels & Restaurants ({hotels.length})
        </button>
        <button
          className={`chip-btn ${viewTab === 'camps' ? 'active' : ''}`}
          onClick={() => setViewTab('camps')}
        >
          ⛺ Relief Camps & Homes ({camps.length})
        </button>
      </div>

      {loading && (
        <div className="state-box loading">
          <div className="spinner"></div>
          <p>Loading community directory...</p>
        </div>
      )}

      {error && !loading && (
        <div className="state-box error">
          <p>⚠️ {error}</p>
          <button className="btn-retry" onClick={fetchDirectory}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <div className="directory-content">
          {/* Hotels Section */}
          {(viewTab === 'all' || viewTab === 'hotels') && (
            <section style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.4rem' }}>🏨</span>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--dark)' }}>
                  Registered Hotels & Eateries ({filteredHotels.length})
                </h3>
              </div>

              {filteredHotels.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No hotels matching your search.</p>
              ) : (
                <div className="directory-grid">
                  {filteredHotels.map((hotel) => (
                    <div key={hotel._id} className="directory-card hotel-border">
                      <div className="dir-card-header">
                        <span className="dir-badge hotel">🏨 Food Donor</span>
                        <span className="verified-pill">✅ Verified Partner</span>
                      </div>
                      <h4 className="dir-org-name">{hotel.organizationName}</h4>
                      <div className="dir-meta-row">
                        <span>👤 In-charge:</span>
                        <strong>{hotel.name}</strong>
                      </div>
                      <div className="dir-meta-row">
                        <span>📞 Phone:</span>
                        <strong>{hotel.phone}</strong>
                      </div>
                      <div className="dir-meta-row">
                        <span>✉️ Email:</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{hotel.email}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Camps, Orphanages & Old Age Homes Section */}
          {(viewTab === 'all' || viewTab === 'camps') && (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.4rem' }}>⛺</span>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--dark)' }}>
                  Registered Relief Camps, Orphanages & Senior Homes ({filteredCamps.length})
                </h3>
              </div>

              {filteredCamps.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No camps or shelters matching your search.</p>
              ) : (
                <div className="directory-grid">
                  {filteredCamps.map((camp) => {
                    const category = getCampCategory(camp.organizationName);
                    return (
                      <div key={camp._id} className="directory-card camp-border">
                        <div className="dir-card-header">
                          <span
                            className="dir-badge"
                            style={{ color: category.color, background: category.bg }}
                          >
                            {category.label}
                          </span>
                          <span className="verified-pill">✅ Verified Center</span>
                        </div>
                        <h4 className="dir-org-name">{camp.organizationName}</h4>
                        <div className="dir-meta-row">
                          <span>👤 Representative:</span>
                          <strong>{camp.name}</strong>
                        </div>
                        <div className="dir-meta-row">
                          <span>📞 Contact:</span>
                          <strong>{camp.phone}</strong>
                        </div>
                        <div className="dir-meta-row">
                          <span>✉️ Email:</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{camp.email}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default DirectoryPage;
