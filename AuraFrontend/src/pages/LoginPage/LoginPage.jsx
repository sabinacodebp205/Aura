import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './LoginPage.module.css';

// Standard RFC email validation regex ensuring non-empty username, valid domain name, and valid TLD
const EMAIL_REGEX = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/;

function parseErrorMessage(err) {
  if (!err?.response) return 'Unable to connect to server. Please check your backend connection.';
  const data = err.response.data;
  if (data?.message) return data.message;
  if (data?.errors && typeof data.errors === 'object') {
    const messages = Object.values(data.errors).flat().filter(Boolean);
    if (messages.length > 0) return messages.join(' ');
  }
  if (typeof data === 'string' && !data.includes('System.Exception') && !data.includes('at Aura.')) {
    return data;
  }
  if (data?.title) return data.title;
  return 'Invalid email or password.';
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Automatically clear errors as soon as user modifies input fields
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }

    if (!EMAIL_REGEX.test(emailTrimmed)) {
      setError('Please enter a valid email address (e.g. user@example.com).');
      return;
    }

    setLoading(true);

    try {
      await login(emailTrimmed, formData.password);
      navigate('/profile');
    } catch (err) {
      setError(parseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`page-shell ${styles.container}`}>
      <div className={styles['auth-card']}>
        <div className={styles.header}>
          <h1>Sign In</h1>
          <p>Access your personal AURA account & custom studio</p>
        </div>

        {error && <div className={styles['error-banner']}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles['form-group']}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles['submit-btn']} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.footer}>
          <span>Don't have an account yet? </span>
          <Link to="/register">Create an Account</Link>
        </div>
      </div>
    </main>
  );
}
