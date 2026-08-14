/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const AiStudioContext = createContext(null);

const SPEC_STORAGE_KEY = 'aura_design_spec';
const CHAT_STORAGE_KEY = 'aura_chat_history';

export const initialSpec = {
  id: '',
  garmentType: 'hoodie',
  color: 'black',
  prompt: null,
  uploadedPatternUrl: null,
  style: null,
  placement: null,
  printSize: null,
  status: 'draft',
  generatedImageUrl: null,
  generationAttempts: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  userId: null,
};

function loadStoredSpec() {
  try {
    const raw = localStorage.getItem(SPEC_STORAGE_KEY);
    if (raw) return { ...initialSpec, ...JSON.parse(raw) };
  } catch {
    /* quota/parse error */
  }
  return { ...initialSpec, id: `spec-${Date.now()}` };
}

function loadStoredChat() {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* quota/parse error */
  }
  return [
    {
      id: 'init-msg',
      sender: 'assistant',
      text: "Welcome to AURA AI Studio. I'm your AI Design Assistant. Tell me what custom garment you'd like to create today!",
      options: ['Oversized Black Hoodie', 'Minimalist White Tee', 'Vintage Grunge Sweatshirt', 'Gothic Long Sleeve'],
      timestamp: new Date().toISOString(),
    },
  ];
}

export function AiStudioProvider({ children }) {
  const [spec, setSpec] = useState(loadStoredSpec);
  const [chatMessages, setChatMessages] = useState(loadStoredChat);
  const [activeMode, setActiveMode] = useState('chat'); // 'chat' | 'generator' | 'result'
  const [step, setStep] = useState(1);
  const [lastEditedStep, setLastEditedStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);

  // Persist spec & chat history
  useEffect(() => {
    try {
      localStorage.setItem(SPEC_STORAGE_KEY, JSON.stringify(spec));
    } catch {
      /* quota */
    }
  }, [spec]);

  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatMessages));
    } catch {
      /* quota */
    }
  }, [chatMessages]);

  const updateSpec = useCallback((delta) => {
    setSpec((curr) => ({
      ...curr,
      ...delta,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  const resetSpec = useCallback(() => {
    const fresh = { ...initialSpec, id: `spec-${Date.now()}` };
    setSpec(fresh);
    setStep(1);
    setLastEditedStep(1);
    setGenerationError(null);
    setChatMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: "Design spec reset. Let's build a new custom piece! What garment are we designing?",
        options: ['Oversized Black Hoodie', 'Minimalist White Tee', 'Vintage Grunge Sweatshirt'],
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  const addChatMessage = useCallback((msg) => {
    setChatMessages((curr) => [
      ...curr,
      {
        id: msg.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toISOString(),
        ...msg,
      },
    ]);
  }, []);

  // Minimum spec check to unlock generator step flow
  const isMinimumSpecMet = useMemo(() => {
    const hasGarment = Boolean(spec.garmentType);
    const hasGraphic = Boolean(spec.prompt?.trim() || spec.uploadedPatternUrl);
    return hasGarment && hasGraphic;
  }, [spec.garmentType, spec.prompt, spec.uploadedPatternUrl]);

  const value = useMemo(
    () => ({
      spec,
      updateSpec,
      resetSpec,
      chatMessages,
      setChatMessages,
      addChatMessage,
      activeMode,
      setActiveMode,
      step,
      setStep,
      lastEditedStep,
      setLastEditedStep,
      isGenerating,
      setIsGenerating,
      generationError,
      setGenerationError,
      isMinimumSpecMet,
    }),
    [
      spec,
      updateSpec,
      resetSpec,
      chatMessages,
      addChatMessage,
      activeMode,
      setActiveMode,
      step,
      setStep,
      lastEditedStep,
      isGenerating,
      generationError,
      isMinimumSpecMet,
    ],
  );

  return <AiStudioContext.Provider value={value}>{children}</AiStudioContext.Provider>;
}

export function useAiStudio() {
  const context = useContext(AiStudioContext);
  if (!context) {
    throw new Error('useAiStudio must be used within an AiStudioProvider');
  }
  return context;
}
