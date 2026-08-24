import { useTranslation } from 'react-i18next';
import CommunityPost from '../../components/organisms/CommunityPost/CommunityPost';
import { communityPosts } from '../../data/communityPosts';
import styles from './CommunityPage.module.css';

export default function CommunityPage() {
  const { t } = useTranslation();
  return (
    <main className={`page-shell ${styles.root}`}>
      <section className="community-hero">
        <p className="eyebrow">{t('community.eyebrow', 'Community marketplace')}</p>
        <h1>{t('community.title', 'Publish, remix, and shop custom fashion.')}</h1>
      </section>
      <section className="community-feed">
        {communityPosts.map((post) => (
          <CommunityPost key={post.id} post={post} />
        ))}
      </section>
    </main>
  );
}
