import Eyebrow from '../../atoms/Eyebrow/Eyebrow';
import SocialRow from '../../molecules/SocialRow/SocialRow';
import styles from './CommunityPost.module.css';

export default function CommunityPost({ post }) {
  return (
    <article className={`community-post ${styles.root}`}>
      <img src={post.image} alt={post.alt} />
      <div>
        <Eyebrow>{post.author}</Eyebrow>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
        <SocialRow likes={post.likes} comments={post.comments} />
      </div>
    </article>
  );
}
