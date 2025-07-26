import React, { useState, useEffect, useCallback } from 'react';

// Definición de tipos para las props del componente. Reemplaza a PropTypes.
type TextGenerateProps = {
  words: string;
  speed?: number;
  cursorCharacter?: string;
  onAnimationComplete?: () => void;
};

/**
 * Componente que emula el tecleo de texto en una terminal, carácter por carácter,
 * con un cursor parpadeante. Tipado con TypeScript para robustez.
 * @param {TextGenerateProps} props - Las props del componente.
 * @returns {React.ReactElement}
 */
const TextGenerate: React.FC<TextGenerateProps> = ({
  words,
  speed = 50,
  cursorCharacter = '_',
  onAnimationComplete,
}) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isCursorVisible, setIsCursorVisible] = useState<boolean>(true);

  const handleAnimationComplete = useCallback(() => {
    if (onAnimationComplete && typeof onAnimationComplete === 'function') {
      onAnimationComplete();
    }
  }, [onAnimationComplete]);

  // Efecto para el tecleo del texto
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);

    if (!words) return;

    const typingTimer = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex > words.length) {
          clearInterval(typingTimer);
          handleAnimationComplete();
          return prevIndex;
        }
        setDisplayedText(words.substring(0, nextIndex));
        return nextIndex;
      });
    }, speed);

    return () => clearInterval(typingTimer);
  }, [words, speed, handleAnimationComplete]);

  // Efecto para el parpadeo del cursor
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setIsCursorVisible((prev) => !prev);
    }, 400);

    return () => clearInterval(cursorTimer);
  }, []);

  const isTyping = currentIndex <= words.length;

  return (
    <div className="text-lg text-main/70 max-w-2xl">
      <span>{displayedText}</span>
      {isTyping && (
        <span className={isCursorVisible ? 'opacity-100' : 'opacity-0'}>
          {cursorCharacter}
        </span>
      )}
    </div>
  );
};

export default TextGenerate;