import CommunityPost from '../../components/organisms/CommunityPost/CommunityPost';
import { communityPosts } from '../../data/communityPosts';
import styles from './CommunityPage.module.css';

export default function CommunityPage() {
  return (
    <main className={`page-shell ${styles.root}`}>
      <section className="community-hero">
        <p className="eyebrow">Community marketplace</p>
        <h1>Publish, remix, and shop custom fashion.</h1>
      </section>
      <section className="community-feed">
        {communityPosts.map((post) => (
          <CommunityPost key={post.id} post={post} />
        ))}
      </section>
    </main>
  );
}
