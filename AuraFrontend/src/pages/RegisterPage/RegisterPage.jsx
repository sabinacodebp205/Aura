import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import styles from './RegisterPage.module.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/;

export default function RegisterPage() {
  const { t } = useTranslation();
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

    if (status === 409) return 'This email or username is already registered.';
    if (status === 400) return 'Invalid registration data. Please verify all fields.';
    if (status === 401) return 'Unauthorized request.';

    return data?.title || 'Registration failed. Please check your information.';
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const emailTrimmed = formData.email.trim();
    if (!formData.name || !formData.surname || !formData.userName || !emailTrimmed || !formData.password) {
      setError(t('auth.requiredFields'));
      return;
    }

    if (!EMAIL_REGEX.test(emailTrimmed)) {
      setError(t('auth.invalidEmail'));
      return;
    }

    if (formData.password.length < 8) {
      setError(t('auth.passwordLength'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordMismatch'));
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
          <h1>{t('auth.createAccountTitle')}</h1>
          <p>{t('auth.createAccountSubtitle')}</p>
        </div>

        {error && <div className={styles['error-banner']}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles['form-group']}>
            <label htmlFor="reg-name">{t('auth.firstName')}</label>
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
            <label htmlFor="reg-surname">{t('auth.lastName')}</label>
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
            <label htmlFor="reg-username">{t('auth.username')}</label>
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
            <label htmlFor="reg-email">{t('auth.email')}</label>
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
            <label htmlFor="reg-password">{t('auth.password')}</label>
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
            <label htmlFor="reg-confirm">{t('auth.confirmPassword')}</label>
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
            {loading ? t('auth.registering') : t('auth.registerBtn')}
          </button>
        </form>

        <div className={styles.footer}>
          <span>{t('auth.haveAccount')}</span>
          <Link to="/login">{t('auth.signInLink')}</Link>
        </div>
      </div>
    </main>
  );
}
