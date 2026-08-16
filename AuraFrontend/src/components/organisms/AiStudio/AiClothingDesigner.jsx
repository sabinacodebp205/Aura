import { useState } from 'react';
import { useAiStudio } from '../../../context/AiStudioContext';
import { generateDesign, uploadPattern } from '../../../api/aiStudioService';
import { getImageUrl, handleImageError } from '../../../utils/imageUrl';
import styles from './AiClothingDesigner.module.css';


const GARMENT_OPTIONS = [
  { id: 'hoodie', name: 'Oversized Hoodie', icon: '🧥', price: 124 },
  { id: 'tshirt', name: 'Standard Tee', icon: '👕', price: 58 },
  { id: 'oversized_tshirt', name: 'Oversized Tee', icon: '👕', price: 68 },
  { id: 'fitted_tshirt', name: 'Fitted Tee', icon: '👚', price: 52 },
  { id: 'long_sleeve', name: 'Long Sleeve Tee', icon: '👕', price: 74 },
  { id: 'sweatshirt', name: 'Crewneck Sweatshirt', icon: '👔', price: 108 },
  { id: 'quarter_zip', name: 'Quarter Zip Fleece', icon: '🧥', price: 118 },
  { id: 'zip_hoodie', name: 'Zip Hoodie', icon: '🧥', price: 128 },
  { id: 'tank_top', name: 'Ribbed Tank Top', icon: '🎽', price: 44 },
  { id: 'crop_top', name: 'Cropped Top', icon: '👚', price: 48 },
  { id: 'blouse', name: 'Silk Blouse', icon: '👔', price: 138 },
];

const COLOR_OPTIONS = [
  { id: 'black', name: 'Deep Black', hex: '#000000' },
  { id: 'white', name: 'Pure White', hex: '#ffffff' },
  { id: 'grey', name: 'Heather Grey', hex: '#808080' },
  { id: 'beige', name: 'Natural Beige', hex: '#f5f5dc' },
  { id: 'charcoal', name: 'Charcoal', hex: '#36454f' },
  { id: 'navy', name: 'Midnight Navy', hex: '#000080' },
  { id: 'olive', name: 'Muted Olive', hex: '#556b2f' },
  { id: 'cream', name: 'Vanilla Cream', hex: '#fffdd0' },
];

const PLACEMENT_OPTIONS = [
  { id: 'center', label: 'Center Front', desc: 'Bold chest placement' },
  { id: 'left_chest', label: 'Left Chest', desc: 'Discreet brand logo style' },
  { id: 'right_chest', label: 'Right Chest', desc: 'Modern asymmetric placement' },
  { id: 'back', label: 'Full Back', desc: 'Statement back artwork' },
  { id: 'sleeve', label: 'Sleeve Print', desc: 'Unique sleeve accent' },
];

const PRINT_SIZE_OPTIONS = [
  { id: 'small', name: 'Small', scaleClass: styles.scaleSmall, desc: 'Compact & discreet mark' },
  { id: 'medium', name: 'Medium', scaleClass: styles.scaleMedium, desc: 'Standard balanced artwork' },
  { id: 'large', name: 'Large', scaleClass: styles.scaleLarge, desc: 'Oversized statement graphic' },
];

export default function AiClothingDesigner() {
  const {
    spec,
    updateSpec,
    step,
    setStep,
    lastEditedStep,
    setLastEditedStep,
    setActiveMode,
    isGenerating,
    setIsGenerating,
    generationError,
    setGenerationError,
  } = useAiStudio();

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10 MB limit.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(30);

    try {
      setUploadProgress(70);
      const res = await uploadPattern(file);
      setUploadProgress(100);

      if (res?.url) {
        updateSpec({ uploadedPatternUrl: res.url });
      }
    } catch (err) {
      console.warn('FileUpload error:', err);
      const localUrl = URL.createObjectURL(file);
      updateSpec({ uploadedPatternUrl: localUrl });
      setUploadProgress(100);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 400);
    }
  };

  const handleGenerate = async () => {
    if (!spec.garmentType || !spec.color) {
      setGenerationError('Garment type and color are required.');
      return;
    }
    if (!spec.prompt?.trim() && !spec.uploadedPatternUrl) {
      setGenerationError('Please provide a text prompt or upload an artwork pattern before generating.');
      return;
    }

    setGenerationError(null);
    setIsGenerating(true);

    try {
      const res = await generateDesign(spec);
      if (res?.status === 'success' && res.generatedImageUrl) {
        updateSpec({
          generatedImageUrl: res.generatedImageUrl,
          status: 'generated',
          generationAttempts: (spec.generationAttempts || 0) + 1,
        });
        setActiveMode('result');
      } else {
        setGenerationError(res?.errorReason || 'Failed to generate design mockup. Please try again.');
      }
    } catch (err) {
      console.warn('Generate error:', err);
      // Fallback preview render
      const fallbackUrl =
        spec.uploadedPatternUrl ||
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85';
      updateSpec({
        generatedImageUrl: fallbackUrl,
        status: 'generated',
        generationAttempts: (spec.generationAttempts || 0) + 1,
      });
      setActiveMode('result');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNextStep = () => {
    setLastEditedStep(step);
    if (step < 6) {
      setStep(step + 1);
    } else {
      handleGenerate();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      setActiveMode('chat');
    }
  };

  return (
    <div className={styles.designerContainer}>
      {/* 6 Step Progress Navigation Bar */}
      <nav className={styles.stepNav} aria-label="Generator steps">
        {[
          { num: 1, label: 'Garment' },
          { num: 2, label: 'Color' },
          { num: 3, label: 'Artwork' },
          { num: 4, label: 'Placement' },
          { num: 5, label: 'Size' },
          { num: 6, label: 'Review' },
        ].map((s) => (
          <button
            key={s.num}
            type="button"
            className={`${styles.stepItem} ${step === s.num ? styles.active : ''} ${
              step > s.num ? styles.completed : ''
            }`}
            onClick={() => {
              setLastEditedStep(step);
              setStep(s.num);
            }}
          >
            <div className={styles.stepNumber}>{step > s.num ? '✓' : s.num}</div>
            <span className={styles.stepLabel}>{s.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Step Card Container */}
      <main className={styles.stepCard}>
        {isGenerating ? (
          <div className={styles.generatingOverlay}>
            <div className={styles.spinner} />
            <h2>Synthesizing High-Resolution Garment Mockup...</h2>
            <p>Compositing placement, color substrate, and custom graphic artwork.</p>
          </div>
        ) : (
          <>
            {/* STEP 1: Garment Picker */}
            {step === 1 && (
              <section>
                <h2 className={styles.stepTitle}>Step 1 — Choose Garment Base</h2>
                <p className={styles.stepSubtitle}>
                  Select the structural base piece for your custom design.
                </p>

                <div className={styles.garmentGrid}>
                  {GARMENT_OPTIONS.map((g) => (
                    <div
                      key={g.id}
                      className={`${styles.garmentCard} ${
                        spec.garmentType === g.id ? styles.selected : ''
                      }`}
                      onClick={() => updateSpec({ garmentType: g.id })}
                    >
                      <span className={styles.garmentIcon}>{g.icon}</span>
                      <span className={styles.garmentName}>{g.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* STEP 2: Color Picker */}
            {step === 2 && (
              <section>
                <h2 className={styles.stepTitle}>Step 2 — Select Color Palette</h2>
                <p className={styles.stepSubtitle}>
                  Choose the primary base color from AURA's curated fabric palette.
                </p>

                <div className={styles.colorGrid}>
                  {COLOR_OPTIONS.map((c) => (
                    <div
                      key={c.id}
                      className={`${styles.colorCard} ${
                        spec.color === c.id ? styles.selected : ''
                      }`}
                      onClick={() => updateSpec({ color: c.id })}
                    >
                      <div
                        className={styles.colorSwatchCircle}
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className={styles.colorName}>{c.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* STEP 3: Prompt & Dropzone */}
            {step === 3 && (
              <section>
                <h2 className={styles.stepTitle}>Step 3 — Artwork & Concept Description</h2>
                <p className={styles.stepSubtitle}>
                  Enter a detailed prompt description or upload your high-resolution PNG artwork file.
                </p>

                <div className={styles.promptContainer}>
                  <div>
                    <label style={{ fontWeight: 700, display: 'block', marginBottom: 8 }}>
                      Text Prompt Description:
                    </label>
                    <textarea
                      placeholder="E.g., Minimalist monochrome butterfly graphic with subtle geometric lines..."
                      value={spec.prompt || ''}
                      onChange={(e) => updateSpec({ prompt: e.target.value })}
                      className={styles.promptTextarea}
                    />
                  </div>

                  <div>
                    <label style={{ fontWeight: 700, display: 'block', marginBottom: 8 }}>
                      Upload Custom Graphic Pattern (.PNG / Max 10MB):
                    </label>

                    <label className={styles.dropzone}>
                      {getImageUrl(spec.uploadedPatternUrl) ? (
                        <>
                          <img
                            src={getImageUrl(spec.uploadedPatternUrl)}
                            alt="Uploaded graphic pattern preview"
                            className={styles.patternPreview}
                            onError={handleImageError}
                          />

                          <span className={styles.dropzoneText}>Pattern Uploaded! Click to replace.</span>
                        </>
                      ) : (
                        <>
                          <span className={styles.dropzoneIcon}>📁</span>
                          <span className={styles.dropzoneText}>
                            Drag & drop PNG pattern file here, or browse
                          </span>
                          <span className={styles.dropzoneSubtext}>
                            Transparent PNG recommended (Max file size: 10MB)
                          </span>
                        </>
                      )}

                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg,.webp"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                    </label>

                    {isUploading && (
                      <div className={styles.uploadProgress}>
                        <div
                          className={styles.progressBar}
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* STEP 4: Interactive Placement Diagram */}
            {step === 4 && (
              <section>
                <h2 className={styles.stepTitle}>Step 4 — Select Artwork Placement Zone</h2>
                <p className={styles.stepSubtitle}>
                  Tap any zone on the visual garment diagram or select from placement options below.
                </p>

                <div className={styles.placementContainer}>
                  {/* Interactive Visual Garment Diagram */}
                  <div className={styles.garmentDiagram}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      className={styles.garmentOutlineSvg}
                    >
                      <path d="M20.38 3.46L16 2 12 4 8 2 3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a2 2 0 0 0 1.25 1.55L6 11.5V21a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9.5l1.89-.79a2 2 0 0 0 1.25-1.55l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                    </svg>

                    <button
                      type="button"
                      className={`${styles.placementZone} ${styles.zoneCenter} ${
                        spec.placement === 'center' ? styles.selected : ''
                      }`}
                      onClick={() => updateSpec({ placement: 'center' })}
                    >
                      Center Front
                    </button>

                    <button
                      type="button"
                      className={`${styles.placementZone} ${styles.zoneLeftChest} ${
                        spec.placement === 'left_chest' ? styles.selected : ''
                      }`}
                      onClick={() => updateSpec({ placement: 'left_chest' })}
                    >
                      Left Chest
                    </button>

                    <button
                      type="button"
                      className={`${styles.placementZone} ${styles.zoneRightChest} ${
                        spec.placement === 'right_chest' ? styles.selected : ''
                      }`}
                      onClick={() => updateSpec({ placement: 'right_chest' })}
                    >
                      Right Chest
                    </button>

                    <button
                      type="button"
                      className={`${styles.placementZone} ${styles.zoneSleeve} ${
                        spec.placement === 'sleeve' ? styles.selected : ''
                      }`}
                      onClick={() => updateSpec({ placement: 'sleeve' })}
                    >
                      Sleeve
                    </button>
                  </div>

                  {/* Placement Option Buttons */}
                  <div className={styles.placementOptionsGrid}>
                    {PLACEMENT_OPTIONS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className={`${styles.placementButton} ${
                          spec.placement === p.id ? styles.selected : ''
                        }`}
                        onClick={() => updateSpec({ placement: p.id })}
                      >
                        <div>
                          <div>{p.label}</div>
                          <small style={{ opacity: 0.75, fontSize: '0.75rem' }}>{p.desc}</small>
                        </div>
                        {spec.placement === p.id && <span>✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* STEP 5: Print Size Picker */}
            {step === 5 && (
              <section>
                <h2 className={styles.stepTitle}>Step 5 — Select Print Scale & Size</h2>
                <p className={styles.stepSubtitle}>
                  Choose the relative dimensions of your printed graphic on the garment substrate.
                </p>

                <div className={styles.sizeGrid}>
                  {PRINT_SIZE_OPTIONS.map((ps) => (
                    <div
                      key={ps.id}
                      className={`${styles.sizeCard} ${
                        spec.printSize === ps.id ? styles.selected : ''
                      }`}
                      onClick={() => updateSpec({ printSize: ps.id })}
                    >
                      <div className={`${styles.scaleVisualizer} ${ps.scaleClass}`}>
                        {ps.name[0]}
                      </div>
                      <span style={{ fontWeight: 700 }}>{ps.name} Print</span>
                      <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{ps.desc}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* STEP 6: Review Spec */}
            {step === 6 && (
              <section>
                <h2 className={styles.stepTitle}>Step 6 — Final Spec Verification</h2>
                <p className={styles.stepSubtitle}>
                  Review your design parameters before initiating high-resolution AI render.
                </p>

                <div className={styles.reviewGrid}>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>Garment Type:</span>
                    <span className={styles.reviewValue}>
                      {spec.garmentType ? spec.garmentType.replace(/_/g, ' ') : 'Hoodie'}
                    </span>
                  </div>

                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>Base Color:</span>
                    <span className={styles.reviewValue}>{spec.color || 'Black'}</span>
                  </div>

                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>Graphic Placement:</span>
                    <span className={styles.reviewValue}>
                      {spec.placement ? spec.placement.replace(/_/g, ' ') : 'Center Front'}
                    </span>
                  </div>

                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>Print Size:</span>
                    <span className={styles.reviewValue}>{spec.printSize || 'Medium'}</span>
                  </div>

                  <div className={styles.reviewItem} style={{ gridColumn: '1 / -1' }}>
                    <span className={styles.reviewLabel}>Artwork Description / Pattern:</span>
                    <span className={styles.reviewValue}>
                      {spec.uploadedPatternUrl
                        ? 'Custom PNG Graphic Uploaded'
                        : spec.prompt || 'No custom prompt provided'}
                    </span>
                  </div>
                </div>

                {generationError && (
                  <div
                    style={{
                      padding: 16,
                      background: '#fff2f0',
                      border: '1px solid #ffccc7',
                      color: '#ff4d4f',
                      borderRadius: 12,
                      marginBottom: 20,
                      fontWeight: 600,
                    }}
                  >
                    ⚠️ {generationError}
                  </div>
                )}
              </section>
            )}

            {/* Action Bar */}
            <div className={styles.actionRow}>
              <button type="button" className={styles.backButton} onClick={handlePrevStep}>
                ← {step === 1 ? 'Assistant Chat' : 'Previous'}
              </button>

              {step < 6 ? (
                <button type="button" className={styles.nextButton} onClick={handleNextStep}>
                  Next Step →
                </button>
              ) : (
                <button type="button" className={styles.generateButton} onClick={handleGenerate}>
                  ✨ GENERATE DESIGN
                </button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
