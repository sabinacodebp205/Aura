import { useLocation, useSearchParams } from 'react-router-dom';
import StudioToolPanel from '../../components/organisms/StudioToolPanel/StudioToolPanel';
import GarmentCanvas from '../../components/organisms/GarmentCanvas/GarmentCanvas';
import ConceptIdeasPanel from '../../components/organisms/ConceptIdeasPanel/ConceptIdeasPanel';
import { StudioProvider } from '../../context/StudioContext';
import { useStudioDesign } from '../../hooks/useStudioDesign';
import styles from './StudioPage.module.css';

export default function StudioPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const productId = location.state?.productId || searchParams.get('productId');

  const design = useStudioDesign(productId);

  return (
    <StudioProvider value={design}>
      <main className={`studio-layout ${styles.root}`}>
        <StudioToolPanel design={design} />
        <GarmentCanvas design={design} />
        <ConceptIdeasPanel design={design} />
      </main>
    </StudioProvider>
  );
}
