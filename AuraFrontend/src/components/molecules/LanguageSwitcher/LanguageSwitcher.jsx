import { useTranslation } from 'react-i18next';
import styles from './LanguageSwitcher.module.css';

const LANGUAGES = [
  { code: 'az', label: 'AZ' },
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = (i18n.resolvedLanguage || i18n.language || 'az').slice(0, 2).toLowerCase();

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
  };

  return (
    <div className={styles.container} role="group" aria-label="Language selection">
      {LANGUAGES.map((lang) => {
        const isActive = currentLang === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            className={`${styles.langBtn} ${isActive ? styles.active : ''}`}
            onClick={() => handleLanguageChange(lang.code)}
            aria-pressed={isActive}
            title={`Switch to ${lang.label}`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
