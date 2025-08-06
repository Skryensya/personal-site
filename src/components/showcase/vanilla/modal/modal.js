// Vanilla Modal Component
class ShowcaseModal {
  constructor(options = {}) {
    this.options = {
      title: 'Modal Title',
      content: 'Modal content goes here.',
      showCloseButton: true,
      showFooter: true,
      buttons: [
        { text: 'Cancel', action: 'close' },
        { text: 'Confirm', action: 'confirm', primary: true }
      ],
      onOpen: () => {},
      onClose: () => {},
      onConfirm: () => {},
      ...options
    };
    
    this.isOpen = false;
    this.overlay = null;
    this.modal = null;
  }
  
  create() {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'showcase-modal-overlay';
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });
    
    // Create modal
    this.modal = document.createElement('div');
    this.modal.className = 'showcase-modal';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'showcase-modal__header';
    
    const title = document.createElement('h3');
    title.className = 'showcase-modal__title';
    title.textContent = this.options.title;
    header.appendChild(title);
    
    if (this.options.showCloseButton) {
      const closeButton = document.createElement('button');
      closeButton.className = 'showcase-modal__close';
      closeButton.innerHTML = '×';
      closeButton.addEventListener('click', () => this.close());
      header.appendChild(closeButton);
    }
    
    this.modal.appendChild(header);
    
    // Create body
    const body = document.createElement('div');
    body.className = 'showcase-modal__body';
    
    if (typeof this.options.content === 'string') {
      body.innerHTML = this.options.content;
    } else {
      body.appendChild(this.options.content);
    }
    
    this.modal.appendChild(body);
    
    // Create footer
    if (this.options.showFooter && this.options.buttons.length > 0) {
      const footer = document.createElement('div');
      footer.className = 'showcase-modal__footer';
      
      this.options.buttons.forEach(buttonConfig => {
        const button = document.createElement('button');
        button.className = buttonConfig.primary 
          ? 'showcase-modal__button showcase-modal__button--primary'
          : 'showcase-modal__button';
        button.textContent = buttonConfig.text;
        
        button.addEventListener('click', () => {
          if (buttonConfig.action === 'close') {
            this.close();
          } else if (buttonConfig.action === 'confirm') {
            this.options.onConfirm();
            this.close();
          } else if (typeof buttonConfig.action === 'function') {
            buttonConfig.action();
          }
        });
        
        footer.appendChild(button);
      });
      
      this.modal.appendChild(footer);
    }
    
    this.overlay.appendChild(this.modal);
  }
  
  open() {
    if (this.isOpen) return;
    
    this.create();
    document.body.appendChild(this.overlay);
    this.isOpen = true;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    this.options.onOpen();
  }
  
  close() {
    if (!this.isOpen) return;
    
    document.body.removeChild(this.overlay);
    this.isOpen = false;
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    this.options.onClose();
  }
  
  updateContent(content) {
    if (this.modal) {
      const body = this.modal.querySelector('.showcase-modal__body');
      if (typeof content === 'string') {
        body.innerHTML = content;
      } else {
        body.innerHTML = '';
        body.appendChild(content);
      }
    }
  }
}

// Auto-initialize modal triggers (only on client side)
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-showcase-modal]').forEach(trigger => {
      const modalConfig = {
        title: trigger.dataset.title || 'Modal',
        content: trigger.dataset.content || 'Modal content',
        onConfirm: () => {
          if (trigger.dataset.onConfirm) {
            console.log(`Modal confirmed: ${trigger.dataset.onConfirm}`);
          }
        }
      };
      
      const modal = new ShowcaseModal(modalConfig);
      
      trigger.addEventListener('click', () => {
        modal.open();
      });
    });
  });
}