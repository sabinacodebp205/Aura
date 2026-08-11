import { useEffect, useMemo, useState } from 'react';
import { garmentSuggestions } from '../data/garments';
import { studioConcepts } from '../data/studioConcepts';
import { getProductById } from '../api/productService';
import { createDesign } from '../api/designService';

const modeSuggestions = {
  print: 'This artwork reads best oversized across the back with a small chest mark.',
  embroidery: 'Black hoodie matches best with gold embroidery centered high on the chest.',
};

export function useStudioDesign(initialProductId = null) {
  const [productId, setProductId] = useState(initialProductId);
  const [product, setProduct] = useState(null);
  const [mode, setMode] = useState('print');
  const [text, setText] = useState('AURA');
  const [color, setColor] = useState('#d8c26a');
  const [scale, setScale] = useState(100);
  const [rotation, setRotation] = useState(-4);
  const [garment, setGarment] = useState('black');
  const [activeConceptId, setActiveConceptId] = useState('luxe');
  const [suggestion, setSuggestion] = useState(garmentSuggestions.black);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialProductId) {
      setProductId(initialProductId);
    }
  }, [initialProductId]);

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;

    getProductById(productId)
      .then((data) => {
        if (!cancelled && data) {
          setProduct(data);
          // Pre-select garment mode/color based on backend product if matched
          const category = (data.category || data.categoryName || '').toLowerCase();
          const colorName = (data.color || '').toLowerCase();
          if (category.includes('hoodie')) setGarment('black');
          else if (category.includes('shirt') || category.includes('tee')) setGarment('white');
          else if (category.includes('dress')) setGarment('dress');
          else if (category.includes('skirt')) setGarment('skirt');
          else if (category.includes('jacket')) setGarment('jacket');
          else if (colorName.includes('white')) setGarment('white');
          else if (colorName.includes('grey')) setGarment('grey');
        }
      })
      .catch((err) => {
        console.warn('StudioDesign: Could not fetch product info for id:', productId, err);
      });

    return () => { cancelled = true; };
  }, [productId]);

  const previewText = text.slice(0, 12).toUpperCase() || 'AURA';
  const transform = `translateX(-50%) rotate(${Number(rotation)}deg) scale(${Number(scale) / 100})`;

  const saveDesignToBackend = async (promptText) => {
    if (!productId) return null;
    setSaving(true);
    try {
      const res = await createDesign({ prompt: promptText || text, productId });
      return res;
    } catch (err) {
      console.warn('StudioDesign: failed to create design on backend', err);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const actions = useMemo(
    () => ({
      setMode(nextMode) {
        setMode(nextMode);
        setSuggestion(modeSuggestions[nextMode]);
      },
      setGarment(nextGarment) {
        setGarment(nextGarment);
        setSuggestion(garmentSuggestions[nextGarment] || garmentSuggestions.black);
      },
      applyConcept(concept) {
        setActiveConceptId(concept.id);
        setText(concept.text);
        setColor(concept.color);
        setSuggestion(concept.suggestion);
      },
      generateConcept() {
        const concept = studioConcepts[Math.floor(Math.random() * studioConcepts.length)];
        setActiveConceptId(concept.id);
        setText(concept.text);
        setColor(concept.color);
        setSuggestion(concept.suggestion);
      },
    }),
    [],
  );

  return {
    productId,
    product,
    mode,
    text,
    color,
    scale,
    rotation,
    garment,
    activeConceptId,
    suggestion,
    previewText,
    transform,
    saving,
    setText,
    setColor,
    setScale,
    setRotation,
    saveDesignToBackend,
    ...actions,
  };
}
