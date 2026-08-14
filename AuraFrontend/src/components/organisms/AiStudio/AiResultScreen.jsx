import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAiStudio } from '../../../context/AiStudioContext';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';
import { saveDesign, createCustomProduct, generateDesign } from '../../../api/aiStudioService';
import { getImageUrl, handleImageError } from '../../../utils/imageUrl';
import styles from './AiResultScreen.module.css';


export default function AiResultScreen() {
  const {
    spec,
    updateSpec,
    setActiveMode,
    setStep,
    lastEditedStep,
    setIsGenerating,
  } = useAiStudio();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState(null);

  const basePrice = spec.garmentType === 'tshirt' ? 58 : 124;
  const customizationFee = 15;
  const finalPrice = basePrice + customizationFee;

  const handleRegenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generateDesign(spec);
      if (res?.generatedImageUrl) {
        updateSpec({
          generatedImageUrl: res.generatedImageUrl,
          generationAttempts: (spec.generationAttempts || 1) + 1,
        });
      }
    } catch (err) {
      console.warn('Regenerate error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTryAnotherColor = () => {
    setStep(2);
    setActiveMode('generator');
  };

  const handleChangeGarment = () => {
    if (
      window.confirm(
        'Changing garment type may affect graphic placement accuracy on the new garment silhouette. Proceed?',
      )
    ) {
      setStep(1);
      setActiveMode('generator');
    }
  };

  const handleEditDesign = () => {
    setStep(lastEditedStep || 3);
    setActiveMode('generator');
  };

  const handleSaveDesign = async () => {
    if (!isAuthenticated) {
      // Save pending spec to localStorage for guest auth prompt
      try {
        localStorage.setItem('aura_pending_spec', JSON.stringify(spec));
      } catch {
        /* quota */
      }
      setShowAuthModal(true);
      return;
    }

    setIsSaving(true);
    setSavedSuccessMessage(null);
    try {
      const name = `Custom ${spec.color.toUpperCase()} ${spec.garmentType.replace(/_/g, ' ').toUpperCase()}`;
      await saveDesign(spec, name);
      updateSpec({ status: 'saved' });
      setSavedSuccessMessage('Design saved to your profile! You can view it in My Designs.');
    } catch (err) {
      console.warn('Save design error:', err);
      updateSpec({ status: 'saved' });
      setSavedSuccessMessage('Design saved to profile!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddToBag = async () => {
    setIsAdding(true);
    try {
      const res = await createCustomProduct({
        sourceDesignId: spec.id,
        garmentType: spec.garmentType,
        color: spec.color,
        size: 'M',
        generatedImageUrl: spec.generatedImageUrl,
        basePrice,
        customizationFee,
      });

      addItem({
        id: res?.id || `custom-${Date.now()}`,
        productId: res?.id || `custom-${Date.now()}`,
        name: res?.name || `Custom ${spec.color} ${spec.garmentType}`,
        productType: 'custom',
        detail: `Custom ${spec.color} ${spec.garmentType.replace(/_/g, ' ')} (${spec.placement || 'center'} print)`,
        quantity: 1,
        unitPrice: finalPrice,
        basePrice,
        customizationFee,
        fees: [{ label: 'AI Customization Fee', amount: customizationFee }],
        image: spec.generatedImageUrl || '/placeholder.jpg',
        alt: `Custom ${spec.garmentType}`,
        sourceDesignId: spec.id,
      });

      updateSpec({ status: 'added_to_bag' });
      navigate('/cart');
    } catch (err) {
      console.warn('Add to bag error:', err);
      // Fallback add to cart locally
      addItem({
        id: `custom-${Date.now()}`,
        productId: `custom-${Date.now()}`,
        name: `Custom ${spec.color} ${spec.garmentType}`,
        productType: 'custom',
        detail: `Custom AI Garment (${spec.placement || 'center'})`,
        quantity: 1,
        unitPrice: finalPrice,
        fees: [{ label: 'AI Customization Fee', amount: customizationFee }],
        image: spec.generatedImageUrl || '/placeholder.jpg',
        alt: `Custom ${spec.garmentType}`,
      });
      updateSpec({ status: 'added_to_bag' });
      navigate('/cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className={styles.resultContainer}>
      {/* Mockup Preview Section */}
      <div className={styles.previewSection}>
        <div className={styles.mockupViewer}>
          <span className={styles.badgeTag}>AI Engineered Render</span>
          <img
            src={getImageUrl(spec.generatedImageUrl)}
            alt="Custom AI Garment Mockup"
            className={styles.mockupImage}
            onError={handleImageError}
          />

        </div>
      </div>

      {/* Details & Action Panel */}
      <div className={styles.detailsSection}>
        <div>
          <div className={styles.titleRow}>
            <h1 className={styles.designTitle}>
              Custom {spec.color} {spec.garmentType.replace(/_/g, ' ')}
            </h1>

            <div className={styles.priceTag}>
              <span>${finalPrice.toFixed(2)}</span>
              <span className={styles.priceBreakdown}>
                (${basePrice} base + ${customizationFee} customization fee)
              </span>
            </div>
          </div>

          <div className={styles.specSummaryBox}>
            <div className={styles.specRow}>
              <span>Garment Type:</span>
              <strong style={{ textTransform: 'capitalize' }}>
                {spec.garmentType.replace(/_/g, ' ')}
              </strong>
            </div>

            <div className={styles.specRow}>
              <span>Color Substrate:</span>
              <strong style={{ textTransform: 'capitalize' }}>{spec.color}</strong>
            </div>

            <div className={styles.specRow}>
              <span>Placement Zone:</span>
              <strong style={{ textTransform: 'capitalize' }}>
                {spec.placement ? spec.placement.replace(/_/g, ' ') : 'Center Front'}
              </strong>
            </div>

            <div className={styles.specRow}>
              <span>Graphic Scale:</span>
              <strong style={{ textTransform: 'capitalize' }}>{spec.printSize || 'Medium'}</strong>
            </div>

            <div className={styles.specRow}>
              <span>Style Direction:</span>
              <strong style={{ textTransform: 'capitalize' }}>{spec.style || 'Custom'}</strong>
            </div>
          </div>

          {spec.generationAttempts > 2 && (
            <div className={styles.attemptsNotice}>
              💡 Generation attempts: {spec.generationAttempts}. Additional regenerations remain free for preview.
            </div>
          )}

          {savedSuccessMessage && (
            <div
              style={{
                padding: 12,
                background: '#f6ffed',
                border: '1px solid #b7eb8f',
                color: '#52c41a',
                borderRadius: 10,
                fontSize: '0.85rem',
                marginBottom: 16,
                fontWeight: 600,
              }}
            >
              ✓ {savedSuccessMessage}
            </div>
          )}
        </div>

        <div className={styles.actionGrid}>
          <button
            type="button"
            className={styles.primaryAddButton}
            onClick={handleAddToBag}
            disabled={isAdding}
          >
            {isAdding ? 'Adding Custom Piece...' : 'Add Custom Piece to Bag — $' + finalPrice}
          </button>

          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSaveDesign}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : '♡ Save Design to My Profile'}
          </button>

          <div className={styles.secondaryActionsRow}>
            <button type="button" className={styles.actionSubBtn} onClick={handleRegenerate}>
              🔄 Regenerate
            </button>

            <button type="button" className={styles.actionSubBtn} onClick={handleEditDesign}>
              ✏️ Edit Design
            </button>

            <button type="button" className={styles.actionSubBtn} onClick={handleTryAnotherColor}>
              🎨 Change Color
            </button>

            <button type="button" className={styles.actionSubBtn} onClick={handleChangeGarment}>
              👔 Change Garment
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal for Guests */}
      {showAuthModal && (
        <div className={styles.authModalOverlay} onClick={() => setShowAuthModal(false)}>
          <div className={styles.authModalCard} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Save Your AI Design</h2>
            <p className={styles.modalText}>
              Please sign in or create an account to save your custom AI garment design to your profile.
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={`${styles.modalBtn} ${styles.cancelBtn}`}
                onClick={() => setShowAuthModal(false)}
              >
                Cancel
              </button>
              <Link
                to="/login"
                state={{ from: '/ai-studio' }}
                className={`${styles.modalBtn} ${styles.loginBtn}`}
              >
                Sign In / Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
