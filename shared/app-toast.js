(function() {
  if (window.__showToast) return;

  const TOAST_ICONS = {
    success: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
    error: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
  };

  const toastEl = document.createElement('div');
  toastEl.className = 'app-toast app-toast--success';
  toastEl.id = 'app-toast';
  toastEl.setAttribute('role', 'status');
  toastEl.setAttribute('aria-live', 'polite');
  toastEl.setAttribute('aria-atomic', 'true');
  toastEl.innerHTML = `
    <div class="app-toast__inner">
      <span class="app-toast__icon" id="app-toast-icon" aria-hidden="true">${TOAST_ICONS.success}</span>
      <div class="app-toast__content">
        <p class="app-toast__message" id="app-toast-message"></p>
        <button type="button" class="app-toast__action" id="app-toast-action" hidden>Tentar novamente</button>
      </div>
      <button type="button" class="app-toast__close" id="app-toast-close" aria-label="Fechar">
        <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </button>
    </div>`;
  document.body.appendChild(toastEl);

  const messageEl = toastEl.querySelector('#app-toast-message');
  const actionBtn = toastEl.querySelector('#app-toast-action');
  const iconEl = toastEl.querySelector('#app-toast-icon');
  const closeBtn = toastEl.querySelector('#app-toast-close');
  let hideTimer = null;
  let actionHandler = null;

  function hideToast() {
    toastEl.classList.remove('is-visible');
    if (hideTimer) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
    actionHandler = null;
    if (actionBtn) {
      actionBtn.hidden = true;
      actionBtn.onclick = null;
    }
  }

  window.__showToast = function(message, options) {
    if (!message) return;
    const kind = options?.kind === 'error' ? 'error' : 'success';
    const duration = options?.duration ?? (kind === 'error' && options?.action ? 0 : 5000);

    toastEl.classList.remove('is-visible', 'app-toast--success', 'app-toast--error');
    toastEl.classList.add(kind === 'error' ? 'app-toast--error' : 'app-toast--success');
    toastEl.setAttribute('role', kind === 'error' ? 'alert' : 'status');
    if (iconEl) iconEl.innerHTML = TOAST_ICONS[kind];
    messageEl.textContent = message;

    actionHandler = null;
    if (actionBtn) {
      if (options?.action) {
        actionBtn.textContent = options.action.label || 'Tentar novamente';
        actionHandler = options.action.onClick || null;
        actionBtn.hidden = false;
        actionBtn.onclick = () => {
          hideToast();
          if (actionHandler) actionHandler();
        };
      } else {
        actionBtn.hidden = true;
        actionBtn.onclick = null;
      }
    }

    void toastEl.offsetWidth;
    toastEl.classList.add('is-visible');
    if (hideTimer) clearTimeout(hideTimer);
    if (duration > 0) hideTimer = setTimeout(hideToast, duration);
  };

  closeBtn?.addEventListener('click', hideToast);
})();
