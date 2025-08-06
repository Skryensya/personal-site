// Vanilla Button Component
class ShowcaseButton {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      variant: 'primary',
      size: 'medium',
      onClick: () => {},
      ...options
    };
    
    this.init();
  }
  
  init() {
    this.element.className = `showcase-button ${this.getVariantClass()} ${this.getSizeClass()}`;
    this.element.addEventListener('click', this.handleClick.bind(this));
  }
  
  getVariantClass() {
    return this.options.variant === 'secondary' ? 'showcase-button--secondary' : '';
  }
  
  getSizeClass() {
    switch (this.options.size) {
      case 'large': return 'showcase-button--large';
      case 'small': return 'showcase-button--small';
      default: return '';
    }
  }
  
  handleClick(event) {
    // Add click effect
    this.element.style.transform = 'scale(0.98)';
    setTimeout(() => {
      this.element.style.transform = 'scale(1)';
    }, 100);
    
    this.options.onClick(event);
  }
}

// Auto-initialize buttons (only on client side)
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-showcase-button]').forEach(button => {
      const options = {
        variant: button.dataset.variant || 'primary',
        size: button.dataset.size || 'medium',
        onClick: () => {
          if (button.dataset.action) {
            console.log(`Button clicked: ${button.dataset.action}`);
          }
        }
      };
      
      new ShowcaseButton(button, options);
    });
  });
}