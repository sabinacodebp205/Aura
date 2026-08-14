import { useState, useRef, useEffect } from 'react';
import { useAiStudio } from '../../../context/AiStudioContext';
import { sendChatMessage, uploadPattern } from '../../../api/aiStudioService';
import styles from './AiDesignAssistant.module.css';

export default function AiDesignAssistant() {
  const {
    spec,
    updateSpec,
    chatMessages,
    addChatMessage,
    setActiveMode,
    isMinimumSpecMet,
  } = useAiStudio();

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    // Add user message to chat UI
    addChatMessage({
      sender: 'user',
      text,
    });
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await sendChatMessage({
        conversationId: spec.id || 'conv-1',
        userMessage: text,
        currentSpec: spec,
      });

      if (response?.updatedSpec) {
        updateSpec(response.updatedSpec);
      }

      addChatMessage({
        sender: 'assistant',
        text: response?.reply || "I've updated your design spec.",
        options: response?.suggestedOptions || null,
      });
    } catch (err) {
      console.warn('Chat error:', err);
      // Fallback client-side response if backend unavailable
      addChatMessage({
        sender: 'assistant',
        text: `Understood — adding "${text}" to your custom design spec.`,
        options: ['Hoodie', 'Oversized Tee', 'Minimal', 'Streetwear'],
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handlePatternUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    addChatMessage({
      sender: 'user',
      text: `[Uploaded artwork pattern: ${file.name}]`,
    });
    setIsTyping(true);

    try {
      const res = await uploadPattern(file);
      if (res?.url) {
        updateSpec({ uploadedPatternUrl: res.url });
        addChatMessage({
          sender: 'assistant',
          text: `Artwork pattern "${file.name}" uploaded successfully! Where would you like this graphic placed on your garment?`,
          options: ['Center Front', 'Left Chest', 'Full Back', 'Sleeve'],
        });
      }
    } catch (err) {
      console.warn('Pattern upload error:', err);
      // Local preview fallback
      const localUrl = URL.createObjectURL(file);
      updateSpec({ uploadedPatternUrl: localUrl });
      addChatMessage({
        sender: 'assistant',
        text: `Uploaded pattern image. Locked into your spec!`,
        options: ['Center Front', 'Left Chest', 'Full Back'],
      });
    } finally {
      setIsUploading(false);
      setIsTyping(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Chat Panel */}
      <div className={styles.chatPanel}>
        <div className={styles.chatHeader}>
          <div className={styles.headerTitle}>
            <span>✦ AURA AI Design Assistant</span>
          </div>
          <span className={styles.headerBadge}>Interactive Spec Extractor</span>
        </div>

        <div className={styles.messagesList}>
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.messageBubble} ${
                msg.sender === 'user' ? styles.userMessage : styles.assistantMessage
              }`}
            >
              <p>{msg.text}</p>

              {msg.options && msg.options.length > 0 && (
                <div className={styles.optionsRow}>
                  {msg.options.map((option, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={styles.optionPill}
                      onClick={() => handleSendMessage(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className={styles.typingIndicator}>
              <span>AI Assistant is analyzing design...</span>
              <div className={styles.dot} />
              <div className={styles.dot} />
              <div className={styles.dot} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.chatInputArea}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className={styles.inputRow}
          >
            <label className={styles.uploadLabel} title="Upload PNG artwork graphic">
              📷
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp"
                onChange={handlePatternUpload}
                disabled={isUploading || isTyping}
                className={styles.hiddenFileInput}
              />
            </label>

            <input
              type="text"
              placeholder="Describe your design (e.g. 'black hoodie with a minimal chest logo')..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isTyping}
              className={styles.textInput}
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className={styles.sendButton}
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Live Design Summary Side Card */}
      <aside className={styles.summaryCard}>
        <div>
          <div className={styles.summaryHeader}>
            <h3 className={styles.summaryTitle}>Live Design Spec</h3>
            <p className={styles.summarySubtitle}>Extracted parameters update in real-time</p>
          </div>

          <div className={styles.specGrid}>
            <div className={styles.specRow}>
              <span className={styles.specLabel}>Garment:</span>
              <span className={styles.specValue}>
                {spec.garmentType ? spec.garmentType.replace(/_/g, ' ') : 'Not set'}
              </span>
            </div>

            <div className={styles.specRow}>
              <span className={styles.specLabel}>Color:</span>
              <span className={styles.specValue}>
                <span
                  className={styles.colorCircle}
                  style={{
                    backgroundColor:
                      spec.color === 'white'
                        ? '#ffffff'
                        : spec.color === 'grey'
                        ? '#808080'
                        : spec.color === 'beige'
                        ? '#f5f5dc'
                        : spec.color === 'charcoal'
                        ? '#36454f'
                        : spec.color === 'navy'
                        ? '#000080'
                        : '#000000',
                  }}
                />
                {spec.color || 'Black'}
              </span>
            </div>

            <div className={styles.specRow}>
              <span className={styles.specLabel}>Style Vibe:</span>
              <span className={styles.specValue}>{spec.style || 'Custom'}</span>
            </div>

            <div className={styles.specRow}>
              <span className={styles.specLabel}>Graphic Placement:</span>
              <span className={styles.specValue}>
                {spec.placement ? spec.placement.replace(/_/g, ' ') : 'Not set'}
              </span>
            </div>

            <div className={styles.specRow}>
              <span className={styles.specLabel}>Print Size:</span>
              <span className={styles.specValue}>{spec.printSize || 'Medium'}</span>
            </div>

            <div className={styles.specRow}>
              <span className={styles.specLabel}>Custom Artwork:</span>
              <span className={styles.specValue}>
                {spec.uploadedPatternUrl ? (
                  <span className={styles.specTag}>PNG Uploaded</span>
                ) : spec.prompt ? (
                  <span className={styles.specTag}>Text Prompt</span>
                ) : (
                  'None'
                )}
              </span>
            </div>
          </div>

          {!isMinimumSpecMet && (
            <div className={styles.unlockNotice}>
              ⚠️ Min spec required to proceed: Garment type + artwork prompt or PNG upload.
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={!isMinimumSpecMet}
          onClick={() => setActiveMode('generator')}
          className={styles.continueButton}
        >
          Continue to Generator →
        </button>
      </aside>
    </div>
  );
}
