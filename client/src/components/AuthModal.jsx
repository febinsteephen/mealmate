import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form states
  const [role, setRole] = useState('hotel');
  const [name, setName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (isLoginMode) {
        const result = await login(email, password);
        if (result.success) {
          onClose();
        } else {
          setErrorMessage(result.message || 'Login failed');
        }
      } else {
        if (!name || !organizationName || !phone || !email || !password) {
          setErrorMessage('Please fill in all required fields');
          setLoading(false);
          return;
        }

        const result = await register({
          name,
          email,
          password,
          role,
          organizationName,
          phone
        });

        if (result.success) {
          onClose();
        } else {
          setErrorMessage(result.message || 'Registration failed');
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isLoginMode ? 'Sign In to MealMate' : 'Join MealMate Platform'}</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        {errorMessage && <div className="alert-error">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLoginMode && (
            <>
              <div className="form-group">
                <label>I am registering as a:</label>
                <div className="role-selector-pills">
                  <button
                    type="button"
                    className={`role-pill ${role === 'hotel' ? 'active' : ''}`}
                    onClick={() => setRole('hotel')}
                  >
                    🏨 Hotel / Food Shop
                  </button>
                  <button
                    type="button"
                    className={`role-pill ${role === 'camp' ? 'active' : ''}`}
                    onClick={() => setRole('camp')}
                  >
                    ⛺ Relief / Donation Camp
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Contact Person Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  {role === 'hotel' ? 'Hotel / Restaurant Name' : 'Camp / Shelter Name'}
                </label>
                <input
                  type="text"
                  placeholder={role === 'hotel' ? 'e.g. Hotel Grand Malabar' : 'e.g. Wayanad Relief Camp #2'}
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Contact Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn-submit-auth" disabled={loading}>
            {loading ? 'Please wait...' : isLoginMode ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="modal-footer-switch">
          {isLoginMode ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                className="btn-text-link"
                onClick={() => {
                  setIsLoginMode(false);
                  setErrorMessage('');
                }}
              >
                Register your Hotel or Camp
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                className="btn-text-link"
                onClick={() => {
                  setIsLoginMode(true);
                  setErrorMessage('');
                }}
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
