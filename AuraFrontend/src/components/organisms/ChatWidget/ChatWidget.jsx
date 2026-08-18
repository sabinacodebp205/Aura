import { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { sendChatMessage } from '../../../api/chatService';
import styles from './ChatWidget.module.css';

export default function ChatWidget() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const initialWelcomeMessage = useMemo(() => [
    {
      id: 'welcome-1',
      role: 'assistant',
      content: t('chat.welcomeMsg'),
      timestamp: new Date().toISOString(),
    },
  ], [t]);

  const defaultPrompts = useMemo(() => [
    t('chat.promptSizing'),
    t('chat.promptShipping'),
    t('chat.promptReturns'),
    t('chat.promptFabrics'),
    t('chat.promptHoodies'),
  ], [t]);

  const [messages, setMessages] = useState(initialWelcomeMessage);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(() => `conv-${Date.now()}`);
  const [followUps, setFollowUps] = useState(defaultPrompts);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Update initial message / prompts if language changes and chat hasn't started
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'welcome-1') {
      setMessages(initialWelcomeMessage);
      setFollowUps(defaultPrompts);
    }
  }, [initialWelcomeMessage, defaultPrompts, messages.length, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      // Autofocus input
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build history for backend API (user/assistant content list)
      const apiHistory = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await sendChatMessage({
        message: text,
        history: apiHistory,
        conversationId,
      });

      if (res?.reply) {
        const assistantMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: res.reply,
          timestamp: res.timestamp || new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        if (res.conversationId) {
          setConversationId(res.conversationId);
        }

        if (res.suggestedFollowUps && res.suggestedFollowUps.length > 0) {
          setFollowUps(res.suggestedFollowUps);
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: t('chat.errorMsg'),
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages(initialWelcomeMessage);
    setFollowUps(defaultPrompts);
    setConversationId(`conv-${Date.now()}`);
  };

  const renderFormattedContent = (content) => {
    if (!content) return null;

    // Basic markdown parsing for bold, headers, bullet points, and links
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      let trimmed = line.trim();

      // Heading 3 ###
      if (trimmed.startsWith('### ')) {
        return <h4 key={idx} className={styles.heading}>{trimmed.replace(/^###\s+/, '')}</h4>;
      }
      // Heading 2 ##
      if (trimmed.startsWith('## ')) {
        return <h3 key={idx} className={styles.heading}>{trimmed.replace(/^##\s+/, '')}</h3>;
      }
      // Bullet list item
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const itemText = trimmed.substring(2);
        return (
          <div key={idx} className={styles.bulletItem}>
            <span className={styles.bulletDot}>•</span>
            <span>{renderInlineFormatting(itemText)}</span>
          </div>
        );
      }
      // Numbered list item
      if (/^\d+\.\s+/.test(trimmed)) {
        const itemText = trimmed.replace(/^\d+\.\s+/, '');
        return (
          <div key={idx} className={styles.bulletItem}>
            <span className={styles.listNum}>{trimmed.match(/^\d+\./)[0]}</span>
            <span>{renderInlineFormatting(itemText)}</span>
          </div>
        );
      }
      // Empty line
      if (!trimmed) {
        return <div key={idx} className={styles.spacer} />;
      }
      // Regular paragraph
      return <p key={idx} className={styles.paragraph}>{renderInlineFormatting(line)}</p>;
    });
  };

  const renderInlineFormatting = (text) => {
    // Replace **bold** with <strong>
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <aside className={styles.widgetContainer} aria-label={t('chat.headerTitle')}>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          className={styles.launcherBtn}
          onClick={() => setIsOpen(true)}
          title={t('chat.launcher')}
          aria-expanded={isOpen}
        >
          <div className={styles.launcherIconWrapper}>
            <span className={styles.sparkleIcon}>✦</span>
          </div>
          <span className={styles.launcherLabel}>{t('chat.launcher')}</span>
          {hasUnread && <span className={styles.unreadBadge} />}
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className={styles.chatWindow}>
          {/* Header */}
          <header className={styles.chatHeader}>
            <div className={styles.headerInfo}>
              <div className={styles.avatar}>
                <span>✦</span>
              </div>
              <div>
                <h3 className={styles.headerTitle}>{t('chat.headerTitle')}</h3>
                <div className={styles.statusIndicator}>
                  <span className={styles.onlineDot} />
                  <span>{t('chat.status')}</span>
                </div>
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={handleResetChat}
                title={t('chat.restart')}
              >
                ↺
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => setIsOpen(false)}
                title={t('chat.close')}
              >
                ✕
              </button>
            </div>
          </header>

          {/* Messages Container */}
          <div className={styles.messagesContainer}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageRow} ${
                  msg.role === 'user' ? styles.userRow : styles.assistantRow
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className={styles.msgAvatar}>
                    <span>✦</span>
                  </div>
                )}
                <div
                  className={`${styles.bubble} ${
                    msg.role === 'user' ? styles.userBubble : styles.assistantBubble
                  }`}
                >
                  {renderFormattedContent(msg.content)}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className={`${styles.messageRow} ${styles.assistantRow}`}>
                <div className={styles.msgAvatar}>
                  <span>✦</span>
                </div>
                <div className={`${styles.bubble} ${styles.assistantBubble} ${styles.typingBubble}`}>
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompts */}
          {followUps && followUps.length > 0 && !isLoading && (
            <div className={styles.suggestionsBar}>
              {followUps.map((prompt, index) => (
                <button
                  key={index}
                  type="button"
                  className={styles.suggestionChip}
                  onClick={() => handleSendMessage(prompt.replace(/^[^\w\s]+\s*/, ''))}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <footer className={styles.chatFooter}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className={styles.inputForm}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('chat.inputPlaceholder')}
                className={styles.chatInput}
                disabled={isLoading}
              />
              <button
                type="submit"
                className={styles.sendBtn}
                disabled={!inputValue.trim() || isLoading}
                aria-label={t('chat.send')}
              >
                →
              </button>
            </form>
          </footer>
        </div>
      )}
    </aside>
  );
}
