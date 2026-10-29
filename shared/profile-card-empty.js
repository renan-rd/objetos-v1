(function () {
  const assetBase = new URL('./', document.currentScript.src);
  const illustrationUrl = new URL('profile-empty-illustration.svg', assetBase).href;
  const alertIconUrl = new URL('profile-empty-alert.svg', assetBase).href;

  const CARDS = [
    { id: 'profile-more-info-card', label: 'Editar contato', action: '#profile-open-contact-edit' },
    { id: 'profile-company-card', label: 'Editar empresa', action: '#profile-add-company-btn' },
    { id: 'profile-responsible-card', label: 'Editar responsável', action: '#profile-edit-responsible-btn' },
    { id: 'profile-tags-card', label: 'Editar etiquetas', action: '#profile-tags-view-all' },
  ];

  function isFilled(el) {
    if (!el || el.closest('.profile-card-empty')) return false;
    if (el.classList.contains('is-empty') || el.classList.contains('skeleton')) return false;
    const text = el.textContent.trim();
    if (!text || text === '—' || text === '-' || text === '--/--/----') return false;
    const placeholder = el.dataset.placeholder;
    if (placeholder && text === placeholder) return false;
    return true;
  }

  function isUnsettled(card) {
    return !!card.querySelector('.skeleton, .is-loading, [data-skeleton-placeholder], .profile-company-skeleton');
  }

  function cardState(card) {
    if (card.id === 'profile-tags-card') {
      if (card.dataset.emptyReady !== '1') return 'unknown';
      return card.querySelector('#profile-tags-selected .profile-tags-chip') ? 'filled' : 'empty';
    }

    if (card.id === 'profile-company-card') {
      const list = card.querySelector('#profile-companies-list');
      if (!list) return 'unknown';
      if (list.querySelector('[data-skeleton-placeholder], .skeleton, .profile-company-skeleton')) {
        card.dataset.sawLoading = '1';
        return 'unknown';
      }
      if (list.querySelector('.profile-company-item, .company-selected-item')) return 'filled';
      return card.dataset.sawLoading === '1' ? 'empty' : 'unknown';
    }

    if (card.id === 'profile-responsible-card') {
      if (card.dataset.emptyReady !== '1') return 'unknown';
      const list = card.querySelector('#profile-responsible-list');
      if (!list) return 'unknown';
      return list.querySelector('.profile-responsible-item') ? 'filled' : 'empty';
    }

    if (isUnsettled(card)) return 'unknown';
    const values = card.querySelectorAll('.profile-detail-value, .profile-privacy-value, .inline-field__value');
    for (const value of values) {
      if (isFilled(value)) return 'filled';
    }
    if (card.querySelector('.profile-privacy-item')) return 'filled';
    return 'empty';
  }

  function ensureChrome(card, config) {
    const head = card.querySelector('.overview-accordion-head');
    if (head && !head.querySelector('.overview-accordion-alert')) {
      const alert = document.createElement('span');
      alert.className = 'overview-accordion-alert';
      alert.setAttribute('aria-hidden', 'true');
      const icon = document.createElement('img');
      icon.src = alertIconUrl;
      icon.width = 24;
      icon.height = 24;
      icon.alt = '';
      alert.appendChild(icon);
      const chevron = head.querySelector('.overview-accordion-chevron');
      if (chevron) head.insertBefore(alert, chevron);
      else head.appendChild(alert);
    }

    const body = card.querySelector('.overview-card-body');
    if (!body || body.querySelector('.profile-card-empty')) return;

    const empty = document.createElement('div');
    empty.className = 'profile-card-empty';
    empty.innerHTML = `
      <div class="profile-card-empty-hero">
        <img class="profile-card-empty-art" src="${illustrationUrl}" width="128" height="128" alt="">
        <div class="profile-card-empty-copy">
          <p class="profile-card-empty-title">Nenhuma informação disponível</p>
          <p class="profile-card-empty-text">Não foram adicionados dados para exibição aqui.</p>
        </div>
      </div>
      <button type="button" class="overview-btn-secondary profile-card-empty-action">${config.label}</button>`;
    empty.querySelector('.profile-card-empty-action').addEventListener('click', () => {
      card.querySelector(config.action)?.click();
    });
    body.appendChild(empty);
  }

  function setCollapsed(card, collapsed) {
    card.classList.toggle('is-collapsed', collapsed);
    card.querySelector('.overview-accordion-head')?.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  }

  function rememberUserToggle(card) {
    card.querySelector('.overview-accordion-head')?.addEventListener('click', () => {
      card.dataset.accordionUser = '1';
    });
  }

  function syncCard(card, config) {
    ensureChrome(card, config);
    const state = cardState(card);
    if (state === 'unknown') {
      card.classList.remove('is-card-empty');
      return;
    }
    const isEmpty = state === 'empty';
    const becameEmpty = isEmpty && !card.classList.contains('is-card-empty');
    card.classList.toggle('is-card-empty', isEmpty);
    if (becameEmpty && card.dataset.accordionUser !== '1') setCollapsed(card, true);
  }

  function sync() {
    CARDS.forEach(config => {
      const card = document.getElementById(config.id);
      if (card) syncCard(card, config);
    });
  }

  let frame = 0;
  function schedule() {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      sync();
    });
  }

  function watch() {
    const observer = new MutationObserver(schedule);
    CARDS.forEach(config => {
      const card = document.getElementById(config.id);
      if (!card) return;
      rememberUserToggle(card);
      observer.observe(card, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class'],
      });
    });
    sync();
  }

  window.__syncProfileCardEmpty = sync;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watch);
  } else {
    watch();
  }
})();
