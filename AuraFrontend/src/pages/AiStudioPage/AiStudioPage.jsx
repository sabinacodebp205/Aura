import { useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { AiStudioProvider, useAiStudio } from '../../context/AiStudioContext';
import AiDesignAssistant from '../../components/organisms/AiStudio/AiDesignAssistant';
import AiClothingDesigner from '../../components/organisms/AiStudio/AiClothingDesigner';
import AiResultScreen from '../../components/organisms/AiStudio/AiResultScreen';
import styles from './AiStudioPage.module.css';

function AiStudioContent() {
  const { activeMode, setActiveMode, updateSpec, setStep } = useAiStudio();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    // Check URL search params for pre-filling garment spec from product or home page CTAs
    const garmentType = searchParams.get('garmentType') || location.state?.garmentType;
    const color = searchParams.get('color') || location.state?.color;
    const mode = searchParams.get('mode');

    if (garmentType || color) {
      updateSpec({
        ...(garmentType && { garmentType }),
        ...(color && { color }),
      });

      if (mode === 'generator') {
        setStep(3); // Jump straight to artwork step
        setActiveMode('generator');
      }
    }
  }, [searchParams, location.state, updateSpec, setStep, setActiveMode]);

  return (
    <main className={styles.studioPage}>
      <header className={styles.topBarBanner}>
        <h1 className={styles.bannerTitle}>AURA AI Studio</h1>
        <p className={styles.bannerSubtext}>
          Co-create high-end custom garments powered by conversational AI & visual design engineering.
        </p>

        {/* Mode Navigation Bar */}
        <div className={styles.modeBar}>
          <button
            type="button"
            className={`${styles.modeButton} ${activeMode === 'chat' ? styles.active : ''}`}
            onClick={() => setActiveMode('chat')}
          >
            💬 AI Assistant Chat
          </button>
          <button
            type="button"
            className={`${styles.modeButton} ${activeMode === 'generator' ? styles.active : ''}`}
            onClick={() => setActiveMode('generator')}
          >
            ✨ Step Garment Designer
          </button>
          {activeMode === 'result' && (
            <button
              type="button"
              className={`${styles.modeButton} ${styles.active}`}
              onClick={() => setActiveMode('result')}
            >
              🖼️ Generated Render
            </button>
          )}
        </div>
      </header>

      {/* Main View Mode rendering */}
      {activeMode === 'chat' && <AiDesignAssistant />}
      {activeMode === 'generator' && <AiClothingDesigner />}
      {activeMode === 'result' && <AiResultScreen />}
    </main>
  );
}

export default function AiStudioPage() {
  return (
    <AiStudioProvider>
      <AiStudioContent />
    </AiStudioProvider>
  );
}
