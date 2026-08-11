import TextLink from '../../atoms/TextLink/TextLink';
import Eyebrow from '../../atoms/Eyebrow/Eyebrow';
import styles from './SectionHeading.module.css';

export default function SectionHeading({ eyebrow, title, linkText, linkTo, className = '' }) {
  return (
    <div className={`${styles['section-heading']} ${className}`.trim()}>
      <div>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2>{title}</h2>
      </div>
      {linkText && linkTo && <TextLink to={linkTo}>{linkText}</TextLink>}
    </div>
  );
}
