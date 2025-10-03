// Konami Code detector
// Sequence: ↑ ↑ ↓ ↓ ← → ← → B A

const KONAMI_SEQUENCE = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

class KonamiCode {
    constructor() {
        this.sequence = [];
        this.isListening = false;
        this.callbacks = [];
        this.timeout = null;
        this.keyElements = []; // Store the visual key elements
        this.lockoutUntil = 0; // Timestamp when lockout ends
        this.boundHandler = null; // Store bound handler
    }

    // Convert key codes to visual symbols
    getKeySymbol(keyCode) {
        const symbols = {
            'ArrowUp': '↑',
            'ArrowDown': '↓',
            'ArrowLeft': '←',
            'ArrowRight': '→',
            'KeyB': 'B',
            'KeyA': 'A'
        };
        return symbols[keyCode] || keyCode;
    }

    // Create and show a visual key element
    showKeyElement(keySymbol, index) {

        const kbd = document.createElement('kbd');
        kbd.textContent = keySymbol;

        // Calculate centered Y position
        const totalHeight = (10 - 1) * 28; // 10 keys max, 28px spacing
        const startY = (window.innerHeight - totalHeight) / 2;

        kbd.style.cssText = `
            position: fixed;
            top: ${startY + (index * 28)}px;
            left: -40px;
            background: var(--color-secondary);
            color: var(--color-main);
            border: 2px solid var(--color-main);
            padding: 0;
            font-family: monospace;
            font-weight: bold;
            font-size: 14px;
            z-index: 10000;
            border-radius: 3px;
            transition: left 0.3s ease-out, transform 0.3s ease;
            pointer-events: none;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            aspect-ratio: 1;
            box-shadow: 2px 2px 0px var(--color-main);
        `;

        document.body.appendChild(kbd);
        this.keyElements.push(kbd);

        // Animate in from left
        setTimeout(() => {
            kbd.style.left = '20px';
        }, 50);

        return kbd;
    }

    // Shake all visible keys
    shakeKeys() {
        // Add shake animation CSS if not already present
        if (!document.getElementById('konami-shake-style')) {
            const style = document.createElement('style');
            style.id = 'konami-shake-style';
            style.textContent = `
                @keyframes konami-shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
                    20%, 40%, 60%, 80% { transform: translateX(8px); }
                }
                .konami-shake {
                    animation: konami-shake 0.6s ease-in-out;
                }
            `;
            document.head.appendChild(style);
        }

        // Apply shake to all visible elements
        this.keyElements.forEach(element => {
            element.classList.add('konami-shake');
        });

        // Remove shake class and hide elements after animation
        setTimeout(() => {
            this.hideAllKeys();
        }, 600);
    }

    // Hide all key elements
    hideAllKeys() {
        this.keyElements.forEach(element => {
            element.classList.remove('konami-shake');
            element.style.left = '-40px';
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 300);
        });
        this.keyElements = [];
    }

    // Add callback for when Konami code is entered
    onActivate(callback) {
        this.callbacks.push(callback);
    }

    // Start listening for the Konami code
    start() {
        if (this.isListening) {
            return;
        }

        this.isListening = true;

        // Store bound handler so we can remove it later
        this.boundHandler = this.handleKeyDown.bind(this);
        document.addEventListener('keydown', this.boundHandler);
    }

    // Stop listening
    stop() {
        this.isListening = false;

        if (this.boundHandler) {
            document.removeEventListener('keydown', this.boundHandler);
        }

        this.reset();
    }

    // Handle keydown events
    handleKeyDown(event) {
        // Ignore if user is typing in an input, textarea, or contenteditable element
        const activeElement = document.activeElement;
        if (activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable
        )) {
            return;
        }

        // Check if we're in lockout period
        const now = Date.now();
        if (now < this.lockoutUntil) {
            return; // Ignore all inputs during lockout
        }

        // Clear timeout if exists
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        // Check if this key matches the expected next key in sequence
        const expectedKey = KONAMI_SEQUENCE[this.sequence.length];

        if (event.code === expectedKey) {
            // Correct key! Add to sequence and show visual feedback
            this.sequence.push(event.code);
            const keySymbol = this.getKeySymbol(event.code);
            this.showKeyElement(keySymbol, this.sequence.length - 1);

            // Check if sequence is complete
            if (this.sequenceMatches()) {
                // Hide keys before activating
                setTimeout(() => {
                    this.hideAllKeys();
                    this.activate();
                }, 500);
                return;
            }
        } else {
            // Wrong key! Shake and hide all keys, then lockout
            if (this.keyElements.length > 0) {
                this.shakeKeys();
                // Set lockout period for 2 seconds
                this.lockoutUntil = Date.now() + 2000;
            }
            this.sequence = [];
        }

        // Reset sequence after 3 seconds of no input
        this.timeout = setTimeout(() => {
            this.reset();
        }, 3000);
    }

    // Check if current sequence matches Konami code
    sequenceMatches() {
        if (this.sequence.length !== KONAMI_SEQUENCE.length) {
            return false;
        }

        return this.sequence.every((key, index) => key === KONAMI_SEQUENCE[index]);
    }

    // Activate callbacks
    activate() {
        // Call all callbacks
        this.callbacks.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('🎮 Error in Konami callback:', error);
            }
        });

        // Reset sequence
        this.reset();
    }

    // Reset the sequence
    reset() {
        this.sequence = [];
        this.hideAllKeys();
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        // Don't reset lockout here - let it expire naturally
    }
}

// Create singleton instance
const konami = new KonamiCode();

export default konami;