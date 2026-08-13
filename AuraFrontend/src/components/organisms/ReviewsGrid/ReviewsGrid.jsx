import { useState, useEffect, useCallback } from 'react';
import SectionHeading from '../../molecules/SectionHeading/SectionHeading';
import { useAuth } from '../../../context/AuthContext';
import { getAllReviews, createReview } from '../../../api/reviewService';
import styles from './ReviewsGrid.module.css';

export default function ReviewsGrid({ productId, onReviewAdded }) {
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
        setReviews(data);
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
      setErrorMsg('Please write a review comment.');
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
      const msg = err?.response?.data?.message || 'Failed to post review. Please try again.';
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
        eyebrow="Customer Feedback"
        title={reviews.length > 0 ? `Verified Reviews (${reviews.length})` : 'Customer Reviews'}
      />

      {/* Summary Score Bar */}
      <div className={styles['summary-bar']}>
        <div className={styles['score-box']}>
          <span className={styles['stars']}>★★★★★</span>
          <span className={styles['rating-num']}>{avgRating}</span>
          <span className={styles['reviews-total']}>
            {reviews.length > 0 ? `based on ${reviews.length} reviews` : 'No reviews yet'}
          </span>
        </div>
      </div>

      {/* Review Submission Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitReview} className={styles['review-form']}>
          <h3>Write a Product Review</h3>
          
          <div className={styles['rating-selector']}>
            <span className={styles['label']}>Your Rating:</span>
            <div className={styles['star-buttons']}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={styles['star-btn']}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`${star} star`}
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
              placeholder="Share details of your experience, fit, fabric quality, and AI customization..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              required
            />
          </div>

          {errorMsg && <div className={styles['error-banner']}>{errorMsg}</div>}

          <button type="submit" className={styles['submit-btn']} disabled={submitting}>
            {submitting ? 'Submitting Review...' : 'Submit Review'}
          </button>
        </form>
      ) : (
        <div className={styles['login-prompt']}>
          <p>Want to write a review? Please sign in to share your thoughts.</p>
        </div>
      )}

      {/* Reviews List */}
      <div className={styles['reviews-list']}>
        {loading ? (
          <p className={styles['loading-text']}>Loading verified reviews...</p>
        ) : reviews.length === 0 ? (
          <p className={styles['empty-text']}>No reviews written yet. Be the first to review!</p>
        ) : (
          reviews.map((rev, idx) => (
            <article key={rev.id || idx} className={styles['review-card']}>
              <div className={styles['card-header']}>
                <div className={styles['user-avatar']}>
                  {(rev.userName || 'A')[0].toUpperCase()}
                </div>
                <div className={styles['user-meta']}>
                  <strong className={styles['username']}>{rev.userName || 'Verified Buyer'}</strong>
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
