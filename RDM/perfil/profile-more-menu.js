(function() {
  const scriptBase = (document.currentScript?.src || '').replace(/\/[^/]+$/, '/');
  const TRASH_ICON = `<img src="${scriptBase}icons/trash.svg" width="24" height="24" alt="" aria-hidden="true">`;

  const MENU_ITEMS = [
    { key: 'editar-dados', label: 'Editar dados' },
    { key: 'mover-funil', label: 'Mover estágio do funil' },
    { key: 'personalizar-cartao', label: 'Personalizar cartão' },
  ];

  const TRIGGER_IDS = [
    'page-header-more-btn',
    'profile-overview-more-btn',
    'profile-quick-more-btn',
    'detail-panel-more-btn',
  ];
  const TRIGGER_SELECTOR = TRIGGER_IDS.map(id => `#${id}`).join(', ');

  let activeMenu = null;

  function getContactId() {
    return window.__profileContactId || window.__selectedContactId || null;
  }

  function closeMenu() {
    if (!activeMenu) return;
    if (activeMenu._anchor) {
      activeMenu._anchor.setAttribute('aria-expanded', 'false');
    }
    activeMenu.remove();
    activeMenu = null;
  }

  function liveAnchor(anchor) {
    if (anchor?.id) {
      const byId = document.getElementById(anchor.id);
      if (byId) {
        const rect = byId.getBoundingClientRect();
        if (rect.width || rect.height) return byId;
      }
    }
    if (anchor?.isConnected) {
      const rect = anchor.getBoundingClientRect();
      if (rect.width || rect.height) return anchor;
    }
    return null;
  }

  function positionMenu() {
    if (!activeMenu) return;
    const anchor = liveAnchor(activeMenu._anchor) || activeMenu._anchor;
    if (!anchor) return;
    activeMenu._anchor = anchor;

    const rect = anchor.getBoundingClientRect();
    const menuW = activeMenu.offsetWidth || 220;
    const gap = 2;
    const top = (rect.height ? rect.bottom : 0) + gap;
    let left = rect.right - menuW;
    if (left + menuW > window.innerWidth - 8) {
      left = window.innerWidth - menuW - 8;
    }
    if (left < 8) left = 8;

    const maxH = Math.max(160, window.innerHeight - top - 8);
    activeMenu.style.top = `${Math.round(top)}px`;
    activeMenu.style.left = `${Math.round(left)}px`;
    activeMenu.style.maxHeight = `${Math.round(maxH)}px`;
  }

  function buildMenuHtml() {
    const items = MENU_ITEMS.map(item =>
      `<button type="button" class="profile-more-dropdown-item" role="menuitem" data-action="${item.key}">${item.label}</button>`
    ).join('');

    return `
      <div class="profile-more-dropdown-group">Opções</div>
      ${items}
      <div class="profile-more-dropdown-divider" role="separator"></div>
      <button type="button" class="profile-more-dropdown-item profile-more-dropdown-item--danger" role="menuitem" data-action="excluir-contato">
        ${TRASH_ICON}
        <span>Excluir contato</span>
      </button>
    `;
  }

  async function handleAction(key) {
    if (key === 'editar-dados') {
      document.getElementById('profile-open-contact-edit')?.click();
      window.__openProfileContactEdit?.();
      return;
    }

    if (key === 'excluir-contato') {
      const contactId = getContactId();
      if (!contactId || !window.__openDeleteContactModal) return;

      const onDetailPanel = typeof window.__closeDetailPanel === 'function';
      window.__openDeleteContactModal([contactId], {
        onSuccess: () => {
          if (onDetailPanel) {
            window.__closeDetailPanel();
            window.__contactsReload?.();
          } else {
            window.location.href = '../contatos/index.html';
          }
        },
      });
      return;
    }

    const labels = {
      'mover-funil': 'Mover estágio do funil',
      'personalizar-cartao': 'Personalizar cartão',
    };
    if (labels[key]) {
      window.alert(`${labels[key]} — em breve.`);
    }
  }

  function closeOtherMenus() {
    try {
      document.querySelectorAll('.profile-status-dropdown, .actions-options-dropdown, .status-dropdown').forEach(el => el.remove());
      window.__empresaAutocomplete?.close?.();
      window.__closeActionsOptionsDropdown?.();
    } catch (_) { /* ignore */ }
  }

  function openMenu(anchor) {
    closeOtherMenus();

    const live = liveAnchor(anchor) || anchor;
    if (activeMenu && activeMenu._anchor === live) {
      closeMenu();
      return;
    }

    closeMenu();

    const menu = document.createElement('div');
    menu.className = 'profile-more-dropdown';
    menu.setAttribute('role', 'menu');
    menu.innerHTML = buildMenuHtml();

    document.body.appendChild(menu);
    activeMenu = menu;
    activeMenu._anchor = live;
    live.setAttribute('aria-expanded', 'true');
    positionMenu();
    requestAnimationFrame(positionMenu);

    menu.addEventListener('click', async e => {
      const item = e.target.closest('[data-action]');
      if (!item) return;
      e.stopPropagation();
      const action = item.dataset.action;
      closeMenu();
      await handleAction(action);
    });
  }

  function bindTrigger(btn) {
    if (!btn) return;
    btn.dataset.moreMenuBound = '1';
    btn.setAttribute('aria-haspopup', 'menu');
    if (!btn.hasAttribute('aria-expanded')) {
      btn.setAttribute('aria-expanded', 'false');
    }
  }

  document.addEventListener('click', e => {
    const trigger = e.target.closest(TRIGGER_SELECTOR);
    if (!trigger) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    openMenu(trigger);
  }, true);

  document.addEventListener('click', e => {
    if (e.target.closest(TRIGGER_SELECTOR)) return;
    if (!e.target.closest('.profile-more-dropdown')) {
      closeMenu();
    }
  });

  window.addEventListener('scroll', positionMenu, true);
  window.addEventListener('resize', positionMenu);

  TRIGGER_IDS.forEach(id => bindTrigger(document.getElementById(id)));

  window.__contactMoreMenu = { open: openMenu, close: closeMenu, bindTrigger };
})();
