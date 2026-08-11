import Button from '../../atoms/Button/Button';
import styles from './SocialRow.module.css';

export default function SocialRow({ likes, comments }) {
  return (
    <div className={styles['social-row']}>
      <button type="button">♡ {likes}</button>
      <button type="button">☆ Save</button>
      <button type="button">Comments {comments}</button>
      <Button to="/product/studio-oversized-hoodie">Buy design</Button>
    </div>
  );
}
