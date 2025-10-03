import * as React from 'react';

type TextGenerateProps = {
    words: string;
    speed?: number;
    cursorCharacter?: string;
    onAnimationComplete?: () => void;
};

/**
 * Componente que emula el tecleo de texto en una terminal, carácter por carácter.
 * Modificado para reservar el espacio final del texto y prevenir CLS.
 * @param {TextGenerateProps} props - Las props del componente.
 * @returns {React.ReactElement}
 */
const TextGenerate: React.FC<TextGenerateProps> = ({ words, speed = 20, cursorCharacter = '_', onAnimationComplete }) => {
    const [displayedText, setDisplayedText] = React.useState<string>('');
    const [currentIndex, setCurrentIndex] = React.useState<number>(0);
    const [isCursorVisible, setIsCursorVisible] = React.useState<boolean>(true);

    const handleAnimationComplete = React.useCallback(() => {
        if (onAnimationComplete && typeof onAnimationComplete === 'function') {
            onAnimationComplete();
        }
    }, [onAnimationComplete]);

    // Lógica de los hooks (sin cambios)
    React.useEffect(() => {
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

    React.useEffect(() => {
        const cursorTimer = setInterval(() => {
            setIsCursorVisible((prev) => !prev);
        }, 400);
        return () => clearInterval(cursorTimer);
    }, []);

    const isTyping = currentIndex <= words.length;

    return (
        <div className="relative text-base md:text-lg text-main/70 max-w-2xl">
            {/* 1. Capa Fantasma: Reserva el espacio. Es invisible pero ocupa su altura y anchura. */}
            <span className="opacity-0" aria-hidden="true">
                {words}
            </span>

            {/* 2. Capa Visible: Se superpone de forma absoluta sobre la capa fantasma. */}
            <div className="absolute top-0 left-0 w-full h-full">
                <span>{displayedText}</span>
                {isTyping && <span className={'select-none pointer-events-none ' + (isCursorVisible ? 'opacity-100' : 'opacity-0')}>{cursorCharacter}</span>}
            </div>
        </div>
    );
};

export default TextGenerate;
