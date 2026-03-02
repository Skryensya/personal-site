type ToastOptions = {
  message: string;
  duration?: number;
  kind?: 'default' | 'success' | 'warning';
  id?: string;
};

const CONTAINER_ID = 'app-toast-stack';
const STYLE_ID = 'app-toast-style';
let escapeCloseBound = false;

function ensureStyle() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    #${CONTAINER_ID} {
      position: fixed;
      top: 104px;
      right: 14px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: min(92vw, 348px);
      pointer-events: none;
    }

    .app-toast {
      pointer-events: auto;
      position: relative;
      overflow: hidden;
      border: 2px solid var(--color-secondary);
      background: var(--color-main);
      color: var(--color-secondary);
      font-family: var(--font-mono), monospace;
      font-size: 13px;
      font-weight: 700;
      line-height: 1.36;
      letter-spacing: 0.01em;
      padding: 11px 12px 13px;
      box-shadow: 4px 4px 0 var(--color-secondary);
      transform: translateX(16px) scale(0.985);
      opacity: 0;
      transition: transform 190ms cubic-bezier(0.22, 1, 0.36, 1), opacity 190ms ease;
    }

    .app-toast[data-open='true'] {
      transform: translateX(0) scale(1);
      opacity: 1;
    }

    .app-toast__row {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }

    .app-toast__dot {
      width: 7px;
      height: 7px;
      border-radius: 999px;
      margin-top: 5px;
      background: currentColor;
      flex-shrink: 0;
      opacity: 0.9;
    }

    .app-toast[data-kind='success'] .app-toast__dot {
      background: color-mix(in srgb, #7CFC9A 72%, var(--color-secondary) 28%);
    }

    .app-toast[data-kind='warning'] .app-toast__dot {
      background: color-mix(in srgb, #FFD86A 72%, var(--color-secondary) 28%);
    }

    .app-toast__text {
      flex: 1;
      white-space: normal;
      text-wrap: pretty;
    }

    .app-toast__close {
      border: 1px solid currentColor;
      background: transparent;
      color: inherit;
      font: inherit;
      font-size: 11px;
      line-height: 1;
      width: 17px;
      height: 17px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      margin-left: 6px;
      cursor: pointer;
      opacity: 0.76;
    }

    .app-toast__close:hover,
    .app-toast__close:focus-visible {
      opacity: 1;
      outline: none;
      background: var(--color-secondary);
      color: var(--color-main);
    }

    .app-toast__progress {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 3px;
      background: currentColor;
      transform-origin: left center;
      transform: scaleX(1);
      opacity: 0.95;
    }

    @media (min-width: 1024px) {
      #${CONTAINER_ID} {
        top: 94px;
        right: 22px;
        width: min(32vw, 396px);
        gap: 12px;
      }

      .app-toast {
        font-size: 14px;
        line-height: 1.4;
        padding: 12px 14px 14px;
        box-shadow: 5px 5px 0 var(--color-secondary);
      }

      .app-toast__dot {
        width: 8px;
        height: 8px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .app-toast {
        transition: none;
      }
      .app-toast__progress {
        transition: none !important;
        transform: scaleX(0);
      }
    }
  `;

  document.head.appendChild(style);
}

function ensureContainer() {
  let container = document.getElementById(CONTAINER_ID);
  if (!container) {
    container = document.createElement('div');
    container.id = CONTAINER_ID;
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);
  }
  return container;
}

export function showToast({ message, duration = 4200, kind = 'default', id }: ToastOptions) {
  if (typeof document === 'undefined') return;

  ensureStyle();
  const container = ensureContainer();

  if (id) {
    const prev = container.querySelector(`[data-toast-id="${id}"]`);
    if (prev) prev.remove();
  }

  if (!escapeCloseBound) {
    escapeCloseBound = true;
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const latest = document.querySelector(`#${CONTAINER_ID} .app-toast:first-child`) as HTMLElement | null;
      const closeBtn = latest?.querySelector('.app-toast__close') as HTMLButtonElement | null;
      closeBtn?.click();
    });
  }

  const toast = document.createElement('div');
  toast.className = 'app-toast';
  toast.dataset.kind = kind;
  if (id) toast.dataset.toastId = id;
  toast.setAttribute('role', 'status');

  toast.innerHTML = `
    <div class="app-toast__row">
      <span class="app-toast__dot" aria-hidden="true"></span>
      <span class="app-toast__text"></span>
      <button class="app-toast__close" type="button" aria-label="Dismiss notification">×</button>
    </div>
    <div class="app-toast__progress" aria-hidden="true"></div>
  `;

  const textEl = toast.querySelector('.app-toast__text') as HTMLElement;
  const closeBtn = toast.querySelector('.app-toast__close') as HTMLButtonElement;
  const progressEl = toast.querySelector('.app-toast__progress') as HTMLElement;

  textEl.textContent = message;
  container.prepend(toast);

  requestAnimationFrame(() => {
    toast.dataset.open = 'true';
    progressEl.style.transition = `transform ${duration}ms linear`;
    progressEl.style.transform = 'scaleX(0)';
  });

  let closed = false;
  let startedAt = performance.now();
  let remaining = duration;
  let timer = window.setTimeout(close, duration);

  function close() {
    if (closed) return;
    closed = true;
    toast.dataset.open = 'false';
    window.clearTimeout(timer);
    window.setTimeout(() => toast.remove(), 180);
  }

  closeBtn.addEventListener('click', close);

  toast.addEventListener('mouseenter', () => {
    if (closed) return;
    const elapsed = performance.now() - startedAt;
    remaining = Math.max(0, remaining - elapsed);
    window.clearTimeout(timer);
    const ratio = duration > 0 ? remaining / duration : 0;
    progressEl.style.transition = 'none';
    progressEl.style.transform = `scaleX(${Math.max(0, Math.min(1, ratio))})`;
  });

  toast.addEventListener('mouseleave', () => {
    if (closed) return;
    startedAt = performance.now();
    progressEl.style.transition = `transform ${remaining}ms linear`;
    progressEl.style.transform = 'scaleX(0)';
    window.clearTimeout(timer);
    timer = window.setTimeout(close, remaining);
  });

  return close;
}
