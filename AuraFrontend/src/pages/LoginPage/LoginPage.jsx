import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import styles from './LoginPage.module.css';

// Standard RFC email validation regex ensuring non-empty username, valid domain name, and valid TLD
const EMAIL_REGEX = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/;

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/profile';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function parseErrorMessage(err) {
    if (!err?.response) return t('common.error');
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

    if (status === 401) return 'Invalid email or password.';
    if (status === 400) return 'Invalid input provided. Please verify your details.';
    if (status === 409) return 'User account conflict.';

    return data?.title || 'Invalid email or password.';
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed || !formData.password) {
      setError(t('auth.requiredFields'));
      return;
    }

    if (!EMAIL_REGEX.test(emailTrimmed)) {
      setError(t('auth.invalidEmail'));
      return;
    }

    setLoading(true);

    try {
      await login(emailTrimmed, formData.password);
      navigate(from, { replace: true });
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
          <h1>{t('auth.signInTitle')}</h1>
          <p>{t('auth.signInSubtitle')}</p>
        </div>

        {error && <div className={styles['error-banner']}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles['form-group']}>
            <label htmlFor="email">{t('auth.email')}</label>
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
            <label htmlFor="password">{t('auth.password')}</label>
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
            {loading ? t('auth.signingIn') : t('auth.signInBtn')}
          </button>
        </form>

        <div className={styles.footer}>
          <span>{t('auth.noAccount')}</span>
          <Link to="/register">{t('auth.createAccountLink')}</Link>
        </div>
      </div>
    </main>
  );
}
