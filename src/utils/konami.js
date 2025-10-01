// Konami Code detector
// Sequence: ↑ ↑ ↓ ↓ ← → ← → B A

const KONAMI_SEQUENCE = [
    'ArrowUp', 'ArrowUp', 
    'ArrowDown', 'ArrowDown', 
    'ArrowLeft', 'ArrowRight', 
    'ArrowLeft', 'ArrowRight', 
    'KeyB', 'KeyA'
];

console.log('🎮 Konami.js loading... Expected sequence:', KONAMI_SEQUENCE);

class KonamiCode {
    constructor() {
        this.sequence = [];
        this.isListening = false;
        this.callbacks = [];
        this.timeout = null;
        this.keyElements = []; // Store the visual key elements
        this.lockoutUntil = 0; // Timestamp when lockout ends
        console.log('🎮 KonamiCode instance created');
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
        const symbol = symbols[keyCode] || keyCode;
        console.log('🎮 Key symbol:', keyCode, '->', symbol);
        return symbol;
    }

    // Create and show a visual key element
    showKeyElement(keySymbol, index) {
        console.log('🎮 Showing key element:', keySymbol, 'at index:', index);
        
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
            border: none;
            padding: 0;
            font-family: monospace;
            font-weight: bold;
            font-size: 12px;
            z-index: 10000;
            border-radius: 3px;
            transition: left 0.3s ease-out, transform 0.3s ease;
            pointer-events: none;
            width: 22px;
            height: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            aspect-ratio: 1;
            box-shadow: 
                2px 2px 0px var(--color-main),
                3px 3px 0px rgba(0,0,0,0.2),
                inset -1px -1px 0px rgba(0,0,0,0.3),
                inset 1px 1px 0px rgba(255,255,255,0.1);
            text-shadow: 0px 1px 0px rgba(0,0,0,0.5);
        `;
        
        console.log('🎮 Appending kbd element to body...');
        document.body.appendChild(kbd);
        this.keyElements.push(kbd);
        
        // Animate in from left
        setTimeout(() => {
            console.log('🎮 Animating kbd element to position...');
            kbd.style.left = '20px';
        }, 50);
        
        return kbd;
    }

    // Shake all visible keys
    shakeKeys() {
        console.log('🎮 Shaking keys, current elements:', this.keyElements.length);
        
        // Add shake animation CSS if not already present
        if (!document.getElementById('konami-shake-style')) {
            console.log('🎮 Adding shake CSS animation');
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
        console.log('🎮 Hiding all keys, current count:', this.keyElements.length);
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
        console.log('🎮 Adding activation callback');
        this.callbacks.push(callback);
    }

    // Start listening for the Konami code
    start() {
        if (this.isListening) {
            console.log('🎮 Already listening, skipping start');
            return;
        }
        
        console.log('🎮 Starting Konami code detection');
        this.isListening = true;
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    // Stop listening
    stop() {
        console.log('🎮 Stopping Konami code detection');
        this.isListening = false;
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
        this.reset();
    }

    // Handle keydown events
    handleKeyDown(event) {
        console.log('🎮 Key pressed:', event.code, 'Current sequence:', this.sequence);
        
        // Check if we're in lockout period
        const now = Date.now();
        if (now < this.lockoutUntil) {
            console.log('🎮 In lockout period, ignoring input');
            return; // Ignore all inputs during lockout
        }

        // Clear timeout if exists
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        // Check if this key matches the expected next key in sequence
        const expectedKey = KONAMI_SEQUENCE[this.sequence.length];
        console.log('🎮 Expected key:', expectedKey, 'Pressed key:', event.code);
        
        if (event.code === expectedKey) {
            console.log('🎮 Correct key! Sequence progress:', this.sequence.length + 1, '/', KONAMI_SEQUENCE.length);
            // Correct key! Add to sequence and show visual feedback
            this.sequence.push(event.code);
            const keySymbol = this.getKeySymbol(event.code);
            this.showKeyElement(keySymbol, this.sequence.length - 1);
            
            // Check if sequence is complete
            if (this.sequenceMatches()) {
                console.log('🎮 KONAMI CODE COMPLETED! Activating...');
                // Hide keys before activating
                setTimeout(() => {
                    this.hideAllKeys();
                    this.activate();
                }, 500);
                return;
            }
        } else {
            console.log('🎮 Wrong key! Resetting sequence. Had', this.keyElements.length, 'elements');
            // Wrong key! Shake and hide all keys, then lockout
            if (this.keyElements.length > 0) {
                this.shakeKeys();
                // Set lockout period for 2 seconds
                this.lockoutUntil = Date.now() + 2000;
                console.log('🎮 Setting lockout for 2 seconds');
            }
            this.sequence = [];
        }

        // Reset sequence after 3 seconds of no input
        this.timeout = setTimeout(() => {
            console.log('🎮 Timeout reached, resetting sequence');
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
        console.log('🎮 Activating Konami code! Callbacks count:', this.callbacks.length);
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
        console.log('🎮 Resetting sequence');
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