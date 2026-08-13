import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './RegisterPage.module.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/;

function parseErrorMessage(err) {
  if (!err?.response) return 'Unable to connect to server. Please check your backend connection.';
  const status = err.response.status;
  const data = err.response.data;

  if (data?.message) {
    if (data.errors && typeof data.errors === 'object') {
      const fieldMsgs = Object.values(data.errors).flat().filter(Boolean);
      if (fieldMsgs.length > 0 && fieldMsgs.join(' ') !== data.message) {
        return `${data.message} ${fieldMsgs.join(' ')}`;
      }
    }
    return data.message;
  }

  if (data?.errors && typeof data.errors === 'object') {
    const messages = Object.values(data.errors).flat().filter(Boolean);
    if (messages.length > 0) return messages.join(' ');
  }

  if (typeof data === 'string' && !data.includes('System.Exception') && !data.includes('at Aura.')) {
    return data;
  }

  if (status === 409) return 'This email or username is already registered.';
  if (status === 400) return 'Invalid registration data. Please verify all fields.';
  if (status === 401) return 'Unauthorized request.';

  return data?.title || 'Registration failed. Please check your information.';
}

export default function RegisterPage() {
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const emailTrimmed = formData.email.trim();
    if (!formData.name || !formData.surname || !formData.userName || !emailTrimmed || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!EMAIL_REGEX.test(emailTrimmed)) {
      setError('Please enter a valid email address (e.g. user@example.com).');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await register({ ...formData, email: emailTrimmed });
      // Auto-login after successful registration
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
          <h1>Create Account</h1>
          <p>Join AURA to design, save favorites, and track orders</p>
        </div>

        {error && <div className={styles['error-banner']}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles['form-group']}>
            <label htmlFor="reg-name">First Name</label>
            <input
              id="reg-name"
              type="text"
              placeholder="Jane"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="reg-surname">Last Name</label>
            <input
              id="reg-surname"
              type="text"
              placeholder="Doe"
              value={formData.surname}
              onChange={(e) => handleInputChange('surname', e.target.value)}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="reg-username">Username</label>
            <input
              id="reg-username"
              type="text"
              placeholder="janedoe"
              value={formData.userName}
              onChange={(e) => handleInputChange('userName', e.target.value)}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="reg-confirm">Confirm Password</label>
            <input
              id="reg-confirm"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles['submit-btn']} disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className={styles.footer}>
          <span>Already have an account? </span>
          <Link to="/login">Sign In</Link>
        </div>
      </div>
    </main>
  );
}
