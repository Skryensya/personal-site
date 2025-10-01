// Konami Code detector
// Sequence: ↑ ↑ ↓ ↓ ← → ← → B A
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Kbd } from '../components/ui/Kbd.tsx';

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
        this.keyElements = []; // Store the visual key elements and their React roots
        this.lockoutUntil = 0; // Timestamp when lockout ends
    }

    // Convert key codes to visual symbols (now handled by Kbd component)
    getKeySymbol(keyCode) {
        return keyCode; // Kbd component will handle the visual representation
    }

    // Create and show a visual key element using React Kbd component
    showKeyElement(keyCode, index) {
        // Create container div
        const container = document.createElement('div');
        
        // Calculate centered Y position
        const totalHeight = (10 - 1) * 28; // 10 keys max, 28px spacing
        const startY = (window.innerHeight - totalHeight) / 2;
        
        // Position the container
        container.style.cssText = `
            position: fixed;
            top: ${startY + (index * 28)}px;
            left: -40px;
            transition: left 0.3s ease-out, transform 0.3s ease;
            z-index: 10000;
        `;
        
        document.body.appendChild(container);
        
        // Create React root and render Kbd component
        const root = createRoot(container);
        root.render(React.createElement(Kbd, { keyCode }));
        
        // Store both container and root for cleanup
        this.keyElements.push({ container, root });
        
        // Animate in from left
        setTimeout(() => {
            container.style.left = '20px';
        }, 50);
        
        return container;
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
        this.keyElements.forEach(({ container }) => {
            container.classList.add('konami-shake');
        });

        // Remove shake class and hide elements after animation
        setTimeout(() => {
            this.hideAllKeys();
        }, 600);
    }

    // Hide all key elements
    hideAllKeys() {
        this.keyElements.forEach(({ container, root }) => {
            container.classList.remove('konami-shake');
            container.style.left = '-40px';
            setTimeout(() => {
                // Unmount React component and remove container
                root.unmount();
                if (container.parentNode) {
                    container.parentNode.removeChild(container);
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
        if (this.isListening) return;
        
        this.isListening = true;
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    // Stop listening
    stop() {
        this.isListening = false;
        document.removeEventListener('keydown', this.handleKeyDown.bind(this));
        this.reset();
    }

    // Handle keydown events
    handleKeyDown(event) {
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
            this.showKeyElement(event.code, this.sequence.length - 1);
            
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
        console.log('🎮 Konami Code activated!');
        
        // Call all callbacks
        this.callbacks.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('Error in Konami callback:', error);
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