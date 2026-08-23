import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import SectionHeading from '../../molecules/SectionHeading/SectionHeading';
import { useAuth } from '../../../context/AuthContext';
import { getAllReviews, createReview } from '../../../api/reviewService';
import styles from './ReviewsGrid.module.css';

export default function ReviewsGrid({ productId, onReviewAdded }) {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // New Review Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllReviews();
      if (Array.isArray(data)) {
        setReviews(data.filter(r => r.productId === productId));
      }
    } catch (err) {
      console.warn('ReviewsGrid: Failed to load reviews from backend', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg(t('reviews.placeholder'));
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      await createReview({
        productId: productId || '00000000-0000-0000-0000-000000000000',
        rating,
        comment: comment.trim(),
      });
      setComment('');
      setRating(5);
      await fetchReviews();
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      const msg = err?.response?.data?.message || t('common.error');
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <section className={`section-pad reviews-grid ${styles.root}`}>
      <SectionHeading
        eyebrow={t('reviews.eyebrow')}
        title={
          reviews.length > 0
            ? t('reviews.titleVerified', { count: reviews.length })
            : t('reviews.titleGeneral')
        }
      />

      {/* Summary Score Bar */}
      <div className={styles['summary-bar']}>
        <div className={styles['score-box']}>
          <span className={styles['stars']}>★★★★★</span>
          <span className={styles['rating-num']}>{avgRating}</span>
          <span className={styles['reviews-total']}>
            {reviews.length > 0
              ? t('reviews.basedOn', { count: reviews.length })
              : t('reviews.noReviewsSummary')}
          </span>
        </div>
      </div>

      {/* Review Submission Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitReview} className={styles['review-form']}>
          <h3>{t('reviews.writeTitle')}</h3>
          
          <div className={styles['rating-selector']}>
            <span className={styles['label']}>{t('reviews.yourRating')}</span>
            <div className={styles['star-buttons']}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={styles['star-btn']}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={t('reviews.starAria', { star })}
                >
                  <span className={(hoverRating || rating) >= star ? styles['star-filled'] : styles['star-empty']}>
                    ★
                  </span>
                </button>
              ))}
              <span className={styles['rating-value']}>{rating} / 5</span>
            </div>
          </div>

          <div className={styles['form-group']}>
            <textarea
              placeholder={t('reviews.placeholder')}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              required
            />
          </div>

          {errorMsg && <div className={styles['error-banner']}>{errorMsg}</div>}

          <button type="submit" className={styles['submit-btn']} disabled={submitting}>
            {submitting ? t('reviews.submitting') : t('reviews.submit')}
          </button>
        </form>
      ) : (
        <div className={styles['login-prompt']}>
          <p>{t('reviews.loginPrompt')}</p>
        </div>
      )}

      {/* Reviews List */}
      <div className={styles['reviews-list']}>
        {loading ? (
          <p className={styles['loading-text']}>{t('reviews.loading')}</p>
        ) : reviews.length === 0 ? (
          <p className={styles['empty-text']}>{t('reviews.empty')}</p>
        ) : (
          reviews.map((rev, idx) => (
            <article key={rev.id || idx} className={styles['review-card']}>
              <div className={styles['card-header']}>
                <div className={styles['user-avatar']}>
                  {(rev.userName || 'A')[0].toUpperCase()}
                </div>
                <div className={styles['user-meta']}>
                  <strong className={styles['username']}>{rev.userName || t('reviews.verifiedBuyer')}</strong>
                  <div className={styles['stars-row']}>
                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                  </div>
                </div>
              </div>
              <p className={styles['comment']}>"{rev.comment}"</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
