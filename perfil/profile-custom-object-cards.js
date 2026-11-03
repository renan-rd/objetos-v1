(function () {
  const GRID_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.569 2h4.138a2.07 2.07 0 0 1 2.069 2.069v4.138a2.07 2.07 0 0 1-2.07 2.069H3.57A2.07 2.07 0 0 1 1.5 8.206V4.07A2.07 2.07 0 0 1 3.569 2zm0 11.034h4.138a2.07 2.07 0 0 1 2.069 2.07v4.137a2.07 2.07 0 0 1-2.07 2.07H3.57A2.07 2.07 0 0 1 1.5 19.24v-4.138a2.07 2.07 0 0 1 2.069-2.069zm8.965-8.965A2.07 2.07 0 0 1 14.604 2h4.137a2.07 2.07 0 0 1 2.07 2.069v4.138a2.07 2.07 0 0 1-2.07 2.069h-4.138a2.07 2.07 0 0 1-2.069-2.07V4.07zm4.138 8.276c.574 0 1.035.461 1.035 1.034v2.759h2.758c.574 0 1.035.461 1.035 1.034 0 .574-.461 1.035-1.035 1.035h-2.758v2.758c0 .574-.461 1.035-1.035 1.035a1.032 1.032 0 0 1-1.034-1.035v-2.758h-2.759a1.032 1.032 0 0 1-1.034-1.035c0-.573.461-1.034 1.034-1.034h2.759v-2.759c0-.573.461-1.034 1.034-1.034z"/></svg>';
  const CHECK_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.1136 18.1592L3.26359 12.3092C2.91214 11.9577 2.91214 11.3879 3.26359 11.0364L4.53636 9.7636C4.88781 9.4121 5.4577 9.4121 5.80915 9.7636L9.75 13.7044L18.1908 5.26359C18.5423 4.91214 19.1122 4.91214 19.4636 5.26359L20.7364 6.53639C21.0879 6.88785 21.0879 7.4577 20.7364 7.80919L10.3864 18.1592C10.0349 18.5107 9.46506 18.5107 9.1136 18.1592Z"/></svg>';
  const ELLIPSIS_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.3226 9.67742C13.6065 9.67742 14.6452 10.7161 14.6452 12C14.6452 13.2839 13.6065 14.3226 12.3226 14.3226C11.0387 14.3226 10 13.2839 10 12C10 10.7161 11.0387 9.67742 12.3226 9.67742ZM10 6.32258C10 7.60645 11.0387 8.64516 12.3226 8.64516C13.6065 8.64516 14.6452 7.60645 14.6452 6.32258C14.6452 5.03871 13.6065 4 12.3226 4C11.0387 4 10 5.03871 10 6.32258ZM10 17.6774C10 18.9613 11.0387 20 12.3226 20C13.6065 20 14.6452 18.9613 14.6452 17.6774C14.6452 16.3935 13.6065 15.3548 12.3226 15.3548C11.0387 15.3548 10 16.3935 10 17.6774Z"/></svg>';
  const STAR_OUTLINE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.1806 9.11964L14.8114 8.48353L12.8588 4.53164C12.6833 4.17851 12.3409 4 11.9985 4C11.6583 4 11.3183 4.17612 11.1421 4.53164L9.18903 8.48323L4.81953 9.11875C4.03595 9.23218 3.72193 10.196 4.28998 10.7483L7.45084 13.8229L6.70279 18.1655C6.59652 18.7858 7.09174 19.2834 7.64636 19.2834C7.79352 19.2834 7.94486 19.2485 8.09023 19.1715L11.9991 17.1213L15.9078 19.1721C16.0528 19.2482 16.2039 19.2828 16.3504 19.2828C16.9057 19.2828 17.4018 18.787 17.2955 18.1664L16.5483 13.8235L19.7098 10.7495C20.2782 10.1972 19.9641 9.23307 19.1806 9.11964ZM15.5466 12.7972L15.0057 13.3232L15.1334 14.0659L15.7161 17.4524L12.6675 15.8527L11.9994 15.5023L11.3372 15.8527L8.28835 17.4524L8.87502 14.0659L8.99946 13.3244L8.45724 12.7972L5.99502 10.3978L9.40835 9.90142L10.1461 9.77778L10.4839 9.11725L12.0003 6.03401L13.5236 9.11725L13.8573 9.79277L14.6039 9.90142L18.0137 10.3978L15.5466 12.7972Z"/></svg>';
  const STAR_SOLID_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11.1417 4.52566L9.18879 8.43281L4.81945 9.06138C4.0359 9.17352 3.72188 10.1267 4.29011 10.6726L7.45122 13.7122L6.70356 18.0059C6.56898 18.7821 7.39739 19.3634 8.09122 19.0004L12 16.9731L15.9088 19.0004C16.6026 19.3605 17.431 18.7821 17.2964 18.0059L16.5488 13.7122L19.7099 10.6726C20.2781 10.1267 19.9641 9.17352 19.1805 9.06138L14.8112 8.43281L12.8583 4.52566C12.5084 3.82921 11.4946 3.82036 11.1417 4.52566Z"/></svg>';

  const column = document.querySelector('.profile-col');
  const companyCard = document.getElementById('profile-company-card');
  const drawer = document.getElementById('drawer-edit-custom-link');
  if (!column || !companyCard || !drawer) return;

  const host = document.createElement('div');
  host.id = 'profile-custom-object-cards';
  companyCard.after(host);

  const tip = document.createElement('div');
  tip.className = 'company-principal-tooltip';
  tip.id = 'custom-link-principal-tooltip';
  tip.setAttribute('role', 'tooltip');
  tip.textContent = 'Marcar como principal';
  tip.hidden = true;
  document.body.appendChild(tip);

  const entries = new Map();
  let order = [];
  let panel = null;
  let panelToken = 0;
  let openMenu = null;
  let started = false;

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
  }

  function fold(value) {
    return String(value || '').toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function contactId() {
    return window.__profileContactId || new URLSearchParams(location.search).get('id') || '';
  }

  function lowerWord(value) {
    const text = String(value || '').trim();
    if (!text) return '';
    return text.charAt(0).toLocaleLowerCase('pt-BR') + text.slice(1);
  }

  function singularOf(object) {
    return lowerWord(object.singular || object.name || 'registro');
  }

  function pluralOf(object, count) {
    const word = count > 1 ? (object.name || object.singular || 'registros') : (object.singular || object.name || 'registro');
    return lowerWord(word);
  }

  function initials(name) {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    const first = parts[0].charAt(0);
    const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return (first + last).toLocaleUpperCase('pt-BR');
  }

  function fieldOptions(field) {
    let options = field.options;
    if (typeof options === 'string') {
      try { options = JSON.parse(options); } catch (error) { options = []; }
    }
    return Array.isArray(options) ? options : [];
  }

  function describeRecord(fields, row) {
    const ordered = fields.slice().sort((a, b) => (a.position || 0) - (b.position || 0));
    const values = ordered.map(field => {
      const raw = row && row.data ? (row.data[field.id] ?? row.data[field.name]) : '';
      if (Array.isArray(raw)) return raw.filter(Boolean).join(', ');
      return raw ? String(raw) : '';
    }).filter(Boolean);
    return {
      id: String(row.id),
      name: values[0] || 'Registro',
      meta: values[1] || '',
      search: fold(values.join(' ')),
      data: { ...(row.data || {}) }
    };
  }

  function otherId(row, id) {
    return String(row.left_id) === String(id) ? String(row.right_id) : String(row.left_id);
  }

  function actionsHtml(item, principal) {
    return '<div class="company-selected-actions">'
      + '<button type="button" class="company-selected-principal' + (principal ? ' is-principal' : '') + '" data-id="' + escapeHtml(item.id) + '" aria-pressed="' + (principal ? 'true' : 'false') + '" aria-label="Marcar como principal" aria-describedby="custom-link-principal-tooltip">'
      + (principal ? STAR_SOLID_SVG : STAR_OUTLINE_SVG)
      + '</button>'
      + '<div class="company-selected-menu">'
      + '<button type="button" class="company-selected-menu-btn" data-id="' + escapeHtml(item.id) + '" aria-label="Mais opções de ' + escapeHtml(item.name) + '" aria-haspopup="menu" aria-expanded="false">' + ELLIPSIS_SVG + '</button>'
      + '<div class="company-selected-menu-list" role="menu" hidden>'
      + '<button type="button" class="company-selected-menu-item" role="menuitem" data-action="edit" data-id="' + escapeHtml(item.id) + '">Editar campos</button>'
      + '<button type="button" class="company-selected-menu-item" role="menuitem" data-action="remove" data-id="' + escapeHtml(item.id) + '">Remover associação</button>'
      + '</div></div></div>';
  }

  function rowHtml(item, principal) {
    return '<div class="company-selected-item" data-record-id="' + escapeHtml(item.id) + '">'
      + '<div class="company-selected-logo">' + escapeHtml(initials(item.name)) + '</div>'
      + '<div class="company-selected-info"><span class="company-selected-name">' + escapeHtml(item.name) + '</span>'
      + (item.meta ? '<span class="company-selected-meta">' + escapeHtml(item.meta) + '</span>' : '')
      + '</div>' + actionsHtml(item, principal) + '</div>';
  }

  function cardHtml(entry) {
    const items = entry.items;
    const empty = !items.length;
    const flagged = items.some(item => item.principal);
    const label = 'Editar ' + pluralOf(entry.object, items.length);
    const rows = items.map((item, index) => rowHtml(item, item.principal || (!flagged && index === 0))).join('');
    return '<section class="overview-card' + (empty ? ' is-card-empty is-collapsed' : '') + '" data-custom-object-card data-object-link="' + escapeHtml(entry.link.id) + '">'
      + '<button type="button" class="overview-accordion-head" aria-expanded="' + (empty ? 'false' : 'true') + '">'
      + '<span class="overview-accordion-icon" aria-hidden="true">' + GRID_ICON + '</span>'
      + '<span class="overview-accordion-title">' + escapeHtml(entry.object.name) + '</span>'
      + '<span class="overview-accordion-alert" aria-hidden="true"><img src="../shared/profile-empty-alert.svg" width="24" height="24" alt=""></span>'
      + '<img class="overview-accordion-chevron" src="../contatos/painel-visao/chevron-up.svg" width="24" height="24" alt="">'
      + '</button>'
      + '<div class="overview-card-body">'
      + '<div class="profile-card-empty"><div class="profile-card-empty-hero"><img class="profile-card-empty-art" src="../shared/profile-empty-illustration.svg" width="128" height="128" alt=""><div class="profile-card-empty-copy"><p class="profile-card-empty-title">Nenhuma informação disponível</p><p class="profile-card-empty-text">Não foram adicionados dados para exibição aqui.</p></div></div><button type="button" class="overview-btn-secondary" data-custom-edit>' + escapeHtml(label) + '</button></div>'
      + '<div class="company-selected-list assoc-record-list">' + rows + '</div>'
      + '<button type="button" class="overview-btn-secondary" data-custom-edit>' + escapeHtml(label) + '</button>'
      + '</div></section>';
  }

  function loadingHtml() {
    return '<section class="overview-card" data-custom-object-card>'
      + '<button type="button" class="overview-accordion-head" aria-expanded="true">'
      + '<span class="overview-accordion-icon" aria-hidden="true"><span class="skeleton" style="width:24px;height:24px;display:block"></span></span>'
      + '<span class="overview-accordion-title"><span class="skeleton" style="width:120px;height:16px;display:inline-block"></span></span>'
      + '</button>'
      + '<div class="overview-card-body"><div class="profile-company-skeleton"><div class="skeleton skeleton--circle profile-company-skeleton-logo"></div><div class="profile-company-skeleton-lines"><div class="skeleton profile-skeleton-line" style="width:55%"></div><div class="skeleton profile-skeleton-line" style="width:40%"></div></div></div></div>'
      + '</section>';
  }

  function renderCards() {
    closeMenu();
    hideTip();
    host.innerHTML = order.map(id => cardHtml(entries.get(id))).join('');
    host.querySelectorAll('[data-custom-object-card]').forEach(card => {
      const head = card.querySelector('.overview-accordion-head');
      head?.addEventListener('click', () => {
        const collapsed = card.classList.toggle('is-collapsed');
        head.setAttribute('aria-expanded', String(!collapsed));
      });
    });
    window.__bindAssocLists?.();
  }

  function showError(message) {
    const error = document.getElementById('custom-link-drawer-error');
    if (!error) return;
    error.textContent = message || '';
    error.style.display = message ? 'block' : 'none';
  }

  function hideTip() {
    tip.hidden = true;
  }

  function showTip(button) {
    tip.hidden = false;
    const rect = button.getBoundingClientRect();
    const gap = 18;
    tip.classList.remove('is-below');
    let top = rect.top - tip.offsetHeight - gap;
    if (top < 8) {
      top = rect.bottom + gap;
      tip.classList.add('is-below');
    }
    let left = rect.right - tip.offsetWidth;
    const maxLeft = window.innerWidth - tip.offsetWidth - 8;
    if (left < 8) left = 8;
    if (left > maxLeft) left = Math.max(8, maxLeft);
    tip.style.top = top + 'px';
    tip.style.left = left + 'px';
    const buttonCenter = rect.left + rect.width / 2 - left;
    tip.style.setProperty('--tip-arrow-left', Math.max(14, Math.min(buttonCenter, tip.offsetWidth - 14)) + 'px');
  }

  function closeMenu() {
    openMenu = null;
    host.querySelectorAll('.company-selected-menu-list, .company-selected-menu-btn').forEach(node => {
      if (node.classList.contains('company-selected-menu-list')) node.hidden = true;
      else node.setAttribute('aria-expanded', 'false');
    });
    document.getElementById('custom-link-selected-list')?.querySelectorAll('.company-selected-menu-list, .company-selected-menu-btn').forEach(node => {
      if (node.classList.contains('company-selected-menu-list')) node.hidden = true;
      else node.setAttribute('aria-expanded', 'false');
    });
  }

  function positionMenu(button, list) {
    const rect = button.getBoundingClientRect();
    list.style.top = '0px';
    list.style.left = '0px';
    const width = list.offsetWidth;
    const height = list.offsetHeight;
    const left = Math.max(8, rect.right - width);
    const below = rect.bottom + 4;
    const top = below + height + 8 > window.innerHeight ? Math.max(8, rect.top - 4 - height) : below;
    list.style.left = left + 'px';
    list.style.top = top + 'px';
  }

  function openMenuFor(button) {
    closeMenu();
    const list = button.parentElement?.querySelector('.company-selected-menu-list');
    if (!list) return;
    openMenu = button.dataset.id;
    list.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    positionMenu(button, list);
  }

  function updateChrome() {
    if (!panel || panel.editingId) return;
    const singular = singularOf(panel.object);
    const title = (panel.selected.size ? 'Editar ' : 'Adicionar ') + singular;
    document.getElementById('custom-link-drawer-title').textContent = title;
    drawer.setAttribute('aria-label', title);
    document.getElementById('custom-link-search-label').textContent = 'Buscar ' + singular;
    document.getElementById('custom-link-selected-heading').textContent = panel.object.name + ' selecionados';
    document.getElementById('custom-link-drawer-save').textContent = panel.tab === 'existing' ? 'Salvar' : 'Criar ' + singular;
  }

  function showSkeleton() {
    const list = document.getElementById('custom-link-selected-list');
    const search = document.getElementById('custom-link-search');
    list.classList.add('is-loading');
    list.setAttribute('aria-busy', 'true');
    const row = '<div class="company-selected-item" aria-hidden="true"><span class="skeleton custom-link-skeleton-mark"></span><div class="company-selected-info"><span class="skeleton" style="width:168px"></span><span class="skeleton" style="width:112px;height:12px"></span></div></div>';
    list.innerHTML = row + row;
    if (search) search.disabled = true;
  }

  function clearSkeleton() {
    const list = document.getElementById('custom-link-selected-list');
    const search = document.getElementById('custom-link-search');
    list?.classList.remove('is-loading');
    list?.removeAttribute('aria-busy');
    if (search) search.disabled = false;
  }

  function renderSelected() {
    if (!panel) return;
    clearSkeleton();
    closeMenu();
    const list = document.getElementById('custom-link-selected-list');
    const items = [...panel.selected.values()];
    list.innerHTML = items.map(item => rowHtml(item, item.id === panel.principalId)).join('');
    updateChrome();
  }

  function renderResults() {
    if (!panel) return;
    const list = document.getElementById('custom-link-search-list');
    const query = fold(document.getElementById('custom-link-search').value.trim());
    const rows = panel.records.filter(item => !query || item.search.includes(query)).slice(0, 30);
    list.innerHTML = rows.length
      ? rows.map(item => (
        '<button type="button" class="company-autocomplete-option' + (panel.selected.has(item.id) ? ' is-selected' : '') + '" role="option" data-id="' + escapeHtml(item.id) + '">'
        + '<span class="company-autocomplete-check">' + CHECK_SVG + '</span>'
        + '<span class="company-autocomplete-option-text"><span class="company-autocomplete-option-name">' + escapeHtml(item.name) + '</span>'
        + (item.meta ? '<span class="company-autocomplete-option-meta">' + escapeHtml(item.meta) + '</span>' : '')
        + '</span></button>'
      )).join('')
      : '<div class="company-autocomplete-empty">Nenhum registro encontrado</div>';
    list.hidden = false;
    document.getElementById('custom-link-search').setAttribute('aria-expanded', 'true');
    const clear = document.getElementById('custom-link-search-clear');
    if (clear) clear.hidden = !document.getElementById('custom-link-search').value;
  }

  function hideResults() {
    const list = document.getElementById('custom-link-search-list');
    if (list) list.hidden = true;
    document.getElementById('custom-link-search')?.setAttribute('aria-expanded', 'false');
  }

  function createControl(field) {
    const id = 'custom-field-' + field.id;
    if (field.field_type === 'date') {
      return '<input class="drawer-input" id="' + id + '" data-field-id="' + escapeHtml(field.id) + '" data-field-type="date" placeholder="DD/MM/AAAA" autocomplete="off">';
    }
    if (field.field_type === 'option') {
      const options = fieldOptions(field).map(option => (
        '<option value="' + escapeHtml(option) + '">' + escapeHtml(option) + '</option>'
      )).join('');
      return '<select class="drawer-select" id="' + id + '" data-field-id="' + escapeHtml(field.id) + '"><option value="">Selecione</option>' + options + '</select>';
    }
    if (field.field_type === 'multiple_choice') {
      const options = fieldOptions(field).map(option => (
        '<label class="custom-link-check"><input type="checkbox" value="' + escapeHtml(option) + '" data-field-id="' + escapeHtml(field.id) + '"><span>' + escapeHtml(option) + '</span></label>'
      )).join('');
      return '<div class="custom-link-checks">' + options + '</div>';
    }
    return '<input class="drawer-input" id="' + id + '" data-field-id="' + escapeHtml(field.id) + '" type="text" placeholder="Digite aqui" autocomplete="off">';
  }

  function paintCreateFields() {
    const ordered = panel.fields.slice().sort((a, b) => (a.position || 0) - (b.position || 0));
    const nameField = ordered.find(field => field.is_primary) || ordered[0];
    document.getElementById('custom-link-create-fields').innerHTML = ordered.length
      ? ordered.map(field => (
        '<div class="drawer-field"><label class="drawer-label" for="custom-field-' + escapeHtml(field.id) + '">' + escapeHtml(field.name) + ((field.is_required || (nameField && field.id === nameField.id)) ? ' <span class="custom-link-required">*</span>' : '') + '</label>' + createControl(field) + '</div>'
      )).join('')
      : '<p class="profile-empty">Este objeto não tem campos para cadastro.</p>';
  }

  function readCreateData() {
    const data = {};
    const missing = [];
    const ordered = panel.fields.slice().sort((a, b) => (a.position || 0) - (b.position || 0));
    const nameField = ordered.find(field => field.is_primary) || ordered[0];
    panel.fields.forEach(field => {
      let value = '';
      if (field.field_type === 'multiple_choice') {
        value = [...document.querySelectorAll('#custom-link-create-fields input[data-field-id="' + field.id + '"]:checked')].map(input => input.value);
      } else {
        const input = document.querySelector('#custom-link-create-fields [data-field-id="' + field.id + '"]');
        value = input ? String(input.value || '').trim() : '';
      }
      const empty = Array.isArray(value) ? !value.length : !value;
      if (empty && (field.is_required || (nameField && field.id === nameField.id))) missing.push(field.name);
      data[field.id] = value;
    });
    return { data, missing };
  }

  function clearCreateFields() {
    document.querySelectorAll('#custom-link-create-fields input, #custom-link-create-fields select').forEach(input => {
      if (input.type === 'checkbox') input.checked = false;
      else input.value = '';
    });
  }

  function fillCreateForm(item) {
    const data = item && item.data ? item.data : {};
    panel.fields.forEach(field => {
      const stored = data[field.id] ?? data[field.name] ?? '';
      if (field.field_type === 'multiple_choice') {
        const values = Array.isArray(stored) ? stored.map(String) : String(stored || '').split(',').map(part => part.trim()).filter(Boolean);
        document.querySelectorAll('#custom-link-create-fields input[data-field-id="' + field.id + '"]').forEach(input => {
          input.checked = values.includes(input.value);
        });
        return;
      }
      const input = document.querySelector('#custom-link-create-fields [data-field-id="' + field.id + '"]');
      if (input) input.value = Array.isArray(stored) ? stored.join(', ') : String(stored || '');
    });
  }

  function showTab(tab) {
    if (!panel) return;
    panel.tab = tab === 'create' ? 'create' : 'existing';
    panel.editingId = null;
    document.getElementById('custom-link-create-form').hidden = panel.tab !== 'create';
    document.getElementById('custom-link-existing-panel').hidden = panel.tab !== 'existing';
    document.getElementById('custom-link-drawer-tabs').hidden = false;
    document.querySelectorAll('[data-custom-link-tab]').forEach(button => {
      const active = button.dataset.customLinkTab === panel.tab;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    showError('');
    if (panel.tab === 'existing') hideResults();
    updateChrome();
  }

  function openEditor(id) {
    const item = panel.selected.get(id) || panel.records.find(record => record.id === id);
    if (!item) return;
    closeMenu();
    hideTip();
    panel.editingId = id;
    document.getElementById('custom-link-drawer-tabs').hidden = true;
    document.getElementById('custom-link-existing-panel').hidden = true;
    document.getElementById('custom-link-create-form').hidden = false;
    hideResults();
    fillCreateForm(item);
    const title = 'Editar ' + singularOf(panel.object);
    document.getElementById('custom-link-drawer-title').textContent = title;
    drawer.setAttribute('aria-label', title);
    document.getElementById('custom-link-drawer-save').textContent = 'Salvar ' + singularOf(panel.object);
    const first = document.querySelector('#custom-link-create-fields input, #custom-link-create-fields select');
    if (first) first.focus();
  }

  function leaveEditor() {
    if (!panel) return;
    panel.editingId = null;
    clearCreateFields();
    showTab('existing');
    renderSelected();
  }

  function closeSiblings() {
    ['drawer-edit-company', 'drawer-edit-responsible', 'drawer-edit-tags', 'drawer-add-contact'].forEach(id => {
      document.getElementById(id)?.classList.remove('open');
    });
  }

  function closePanel() {
    panelToken += 1;
    panel = null;
    closeMenu();
    hideTip();
    hideResults();
    clearSkeleton();
    drawer.classList.remove('open');
    const content = document.querySelector('main.content');
    const detail = document.getElementById('detail-panel');
    if (!detail?.querySelector('.drawer.open')) {
      content?.classList.remove('detail-open', 'detail-edit');
      detail?.setAttribute('aria-hidden', 'true');
    }
  }

  function replaceRecord(view, linkRowId) {
    const entry = entries.get(panel.linkId);
    const next = { ...view, linkRowId: linkRowId || view.linkRowId || '', principal: view.id === panel.principalId };
    const recordIndex = panel.records.findIndex(record => record.id === view.id);
    if (recordIndex >= 0) panel.records[recordIndex] = view;
    else panel.records.push(view);
    if (panel.selected.has(view.id)) panel.selected.set(view.id, view);
    if (entry) {
      const itemIndex = entry.items.findIndex(item => item.id === view.id);
      if (itemIndex >= 0) entry.items[itemIndex] = { ...entry.items[itemIndex], ...next };
      else entry.items.push(next);
      renderCards();
    }
  }

  async function persistSelection() {
    const api = window.__customObjectsDb;
    const id = contactId();
    const rows = await api.listLinksForRecord(id);
    const mine = rows.filter(row => String(row.object_link_id) === String(panel.linkId));
    const byRecord = new Map(mine.map(row => [otherId(row, id), row]));
    const remove = [];
    byRecord.forEach((row, recordId) => {
      if (!panel.selected.has(recordId)) remove.push(row.id);
    });
    if (remove.length) await api.deleteRecordLinks(remove);
    for (const item of panel.selected.values()) {
      if (byRecord.has(item.id)) continue;
      await api.createRecordLink({
        objectLinkId: panel.linkId,
        leftKind: 'contato',
        leftId: id,
        rightKind: 'custom_record',
        rightId: item.id,
        principal: item.id === panel.principalId
      });
    }
    if (panel.principalId && panel.selected.has(panel.principalId)) {
      const fresh = await api.listLinksForRecord(id);
      const row = fresh.find(item => String(item.object_link_id) === String(panel.linkId) && otherId(item, id) === String(panel.principalId));
      if (row) await api.setRecordLinkPrincipal(row.id, panel.linkId, id);
    }
  }

  async function refreshEntry(linkId) {
    const api = window.__customObjectsDb;
    const entry = entries.get(linkId);
    const id = contactId();
    if (!entry || !api || !id) return;
    const [fields, rows, links] = await Promise.all([
      api.listFields(entry.object.id),
      api.listRecords(entry.object.id),
      api.listLinksForRecord(id)
    ]);
    entry.fields = fields;
    entry.records = rows.map(row => describeRecord(fields, row));
    const byId = new Map(entry.records.map(record => [record.id, record]));
    entry.items = links.filter(row => String(row.object_link_id) === String(linkId)).map(row => {
      const recordId = otherId(row, id);
      const record = byId.get(recordId) || { id: recordId, name: 'Registro', meta: '', search: '', data: {} };
      return { ...record, linkRowId: row.id, principal: row.principal === true };
    });
    renderCards();
  }

  async function openPanel(linkId, editId) {
    const entry = entries.get(linkId);
    const api = window.__customObjectsDb;
    const id = contactId();
    if (!entry || !api || !id) return;
    const token = ++panelToken;
    closeSiblings();
    const content = document.querySelector('main.content');
    const detail = document.getElementById('detail-panel');
    detail.appendChild(drawer);
    content.classList.add('detail-open', 'detail-edit');
    detail.setAttribute('aria-hidden', 'false');
    drawer.classList.add('open');
    document.getElementById('custom-link-search').value = '';
    document.getElementById('custom-link-search-clear').hidden = true;
    hideResults();
    showError('');
    document.getElementById('custom-link-drawer-save').disabled = true;
    panel = {
      token,
      linkId,
      object: entry.object,
      fields: [],
      records: [],
      selected: new Map(),
      principalId: null,
      tab: 'existing',
      editingId: null
    };
    showTab('existing');
    showSkeleton();
    try {
      await refreshEntry(linkId);
      if (!panel || panel.token !== token) return;
      const current = entries.get(linkId);
      panel.fields = current.fields;
      panel.records = current.records;
      panel.selected = new Map(current.items.map(item => [item.id, item]));
      panel.principalId = current.items.find(item => item.principal)?.id || current.items[0]?.id || null;
      paintCreateFields();
      renderSelected();
      hideResults();
      document.getElementById('custom-link-drawer-save').disabled = false;
      if (editId) openEditor(editId);
    } catch (error) {
      if (!panel || panel.token !== token) return;
      clearSkeleton();
      document.getElementById('custom-link-selected-list').innerHTML = '';
      showError('Não foi possível carregar os registros.');
      document.getElementById('custom-link-drawer-save').disabled = false;
    }
  }

  async function savePanel() {
    if (!panel) return;
    const saveBtn = document.getElementById('custom-link-drawer-save');
    const api = window.__customObjectsDb;
    const { data, missing } = panel.tab === 'create' || panel.editingId ? readCreateData() : { data: null, missing: [] };
    if (missing.length) {
      showError('Preencha ' + missing.join(', ') + '.');
      return;
    }
    saveBtn.disabled = true;
    showError('');
    try {
      if (panel.editingId) {
        await api.updateRecord(panel.editingId, data);
        const view = describeRecord(panel.fields, { id: panel.editingId, data });
        const current = panel.selected.get(panel.editingId) || panel.records.find(record => record.id === panel.editingId);
        replaceRecord({ ...view, linkRowId: current && current.linkRowId });
        leaveEditor();
        window.__showToast?.(singularOf(panel.object).charAt(0).toLocaleUpperCase('pt-BR') + singularOf(panel.object).slice(1) + ' atualizado com sucesso');
        saveBtn.disabled = false;
        return;
      }
      if (panel.tab === 'create') {
        const row = await api.createRecord(panel.object.id, data);
        const view = describeRecord(panel.fields, row);
        panel.records.push(view);
        panel.selected.set(view.id, view);
        if (!panel.principalId) panel.principalId = view.id;
        panel.tab = 'existing';
        showTab('existing');
        renderSelected();
        await persistSelection();
        await refreshEntry(panel.linkId);
        closePanel();
        window.__showToast?.('Registro criado com sucesso');
        return;
      }
      await persistSelection();
      await refreshEntry(panel.linkId);
      closePanel();
      window.__showToast?.('Vínculo salvo com sucesso');
    } catch (error) {
      showError('Não foi possível salvar o vínculo.');
      saveBtn.disabled = false;
    }
  }

  async function markPrincipal(linkId, recordId, fromPanel) {
    const entry = entries.get(linkId);
    const item = entry?.items.find(row => row.id === recordId);
    const api = window.__customObjectsDb;
    if (fromPanel && panel) {
      panel.principalId = recordId;
      renderSelected();
      const selected = panel.selected.get(recordId);
      if (!selected || !item?.linkRowId) return;
    }
    if (!item?.linkRowId || !api) return;
    try {
      await api.setRecordLinkPrincipal(item.linkRowId, linkId, contactId());
      entry.items.forEach(row => { row.principal = row.id === recordId; });
      renderCards();
      if (panel && panel.linkId === linkId) {
        panel.principalId = recordId;
        renderSelected();
      }
    } catch (error) {
      window.__showToast?.('Não foi possível marcar como principal');
    }
  }

  async function removeFromCard(linkId, recordId) {
    const entry = entries.get(linkId);
    const item = entry?.items.find(row => row.id === recordId);
    const api = window.__customObjectsDb;
    if (!item?.linkRowId || !api) return;
    try {
      await api.deleteRecordLinks([item.linkRowId]);
      entry.items = entry.items.filter(row => row.id !== recordId);
      renderCards();
      if (panel && panel.linkId === linkId) {
        panel.selected.delete(recordId);
        if (panel.principalId === recordId) panel.principalId = panel.selected.keys().next().value || null;
        renderSelected();
        renderResults();
      }
    } catch (error) {
      window.__showToast?.('Não foi possível remover a associação');
    }
  }

  function entryFromNode(node) {
    return node?.closest('[data-object-link]')?.dataset.objectLink || (panel && panel.linkId) || '';
  }

  function handleRowClick(event, fromPanel) {
    const principalButton = event.target.closest('.company-selected-principal');
    if (principalButton) {
      const linkId = fromPanel ? panel?.linkId : entryFromNode(principalButton);
      if (linkId) markPrincipal(linkId, principalButton.dataset.id, fromPanel);
      return;
    }
    const item = event.target.closest('.company-selected-menu-item');
    if (item) {
      const linkId = fromPanel ? panel?.linkId : entryFromNode(item);
      closeMenu();
      if (!linkId) return;
      if (item.dataset.action === 'edit') {
        if (fromPanel) openEditor(item.dataset.id);
        else openPanel(linkId, item.dataset.id);
      }
      if (item.dataset.action === 'remove') {
        if (fromPanel && panel) {
          panel.selected.delete(item.dataset.id);
          if (panel.principalId === item.dataset.id) panel.principalId = panel.selected.keys().next().value || null;
          renderSelected();
          const list = document.getElementById('custom-link-search-list');
          if (list && !list.hidden) renderResults();
        } else {
          removeFromCard(linkId, item.dataset.id);
        }
      }
      return;
    }
    const button = event.target.closest('.company-selected-menu-btn');
    if (!button) return;
    if (button.getAttribute('aria-expanded') === 'true') closeMenu();
    else openMenuFor(button);
  }

  host.addEventListener('click', event => {
    if (event.target.closest('[data-custom-edit]')) {
      const linkId = entryFromNode(event.target);
      if (linkId) openPanel(linkId);
      return;
    }
    if (event.target.closest('.overview-accordion-head')) return;
    handleRowClick(event, false);
  });

  document.getElementById('custom-link-selected-list').addEventListener('click', event => handleRowClick(event, true));

  document.querySelectorAll('[data-custom-link-tab]').forEach(button => {
    button.addEventListener('click', () => {
      if (!panel || panel.editingId) return;
      clearCreateFields();
      showTab(button.dataset.customLinkTab);
    });
  });

  const search = document.getElementById('custom-link-search');
  search.addEventListener('focus', () => { if (panel && !search.disabled) renderResults(); });
  search.addEventListener('input', () => { if (panel && !search.disabled) renderResults(); });
  document.getElementById('custom-link-search-clear').addEventListener('click', () => {
    search.value = '';
    document.getElementById('custom-link-search-clear').hidden = true;
    if (panel) renderResults();
    search.focus();
  });

  const results = document.getElementById('custom-link-search-list');
  results.addEventListener('mousedown', event => {
    if (event.target.closest('.company-autocomplete-option')) event.preventDefault();
  });
  results.addEventListener('click', event => {
    const option = event.target.closest('.company-autocomplete-option');
    if (!option || !panel) return;
    event.stopPropagation();
    const record = panel.records.find(item => item.id === option.dataset.id);
    if (!record) return;
    if (panel.selected.has(record.id)) {
      panel.selected.delete(record.id);
      if (panel.principalId === record.id) panel.principalId = panel.selected.keys().next().value || null;
    } else {
      panel.selected.set(record.id, record);
      if (!panel.principalId) panel.principalId = record.id;
    }
    renderSelected();
    renderResults();
  });

  document.getElementById('custom-link-drawer-save').addEventListener('click', savePanel);
  document.getElementById('custom-link-drawer-close').addEventListener('click', closePanel);
  document.getElementById('custom-link-drawer-cancel').addEventListener('click', () => {
    if (panel && panel.editingId) leaveEditor();
    else closePanel();
  });

  document.addEventListener('mousedown', event => {
    if (openMenu && !event.target.closest('.company-selected-menu')) closeMenu();
    const box = document.getElementById('custom-link-search-box');
    const list = document.getElementById('custom-link-search-list');
    if (list && !list.hidden && box && !box.contains(event.target)) hideResults();
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (openMenu) {
      closeMenu();
      return;
    }
    const list = document.getElementById('custom-link-search-list');
    if (drawer.classList.contains('open') && list && !list.hidden) {
      hideResults();
      return;
    }
    if (panel && panel.editingId) {
      leaveEditor();
      return;
    }
    if (drawer.classList.contains('open')) closePanel();
  });

  host.addEventListener('mouseover', event => {
    const button = event.target.closest('.company-selected-principal');
    if (button && host.contains(button)) showTip(button);
  });
  host.addEventListener('mouseout', event => {
    const button = event.target.closest('.company-selected-principal');
    if (!button || button.contains(event.relatedTarget)) return;
    hideTip();
  });
  document.getElementById('custom-link-selected-list').addEventListener('mouseover', event => {
    const button = event.target.closest('.company-selected-principal');
    if (button) showTip(button);
  });
  document.getElementById('custom-link-selected-list').addEventListener('mouseout', event => {
    const button = event.target.closest('.company-selected-principal');
    if (!button || button.contains(event.relatedTarget)) return;
    hideTip();
  });
  window.addEventListener('scroll', () => { hideTip(); if (openMenu) closeMenu(); }, true);

  async function load() {
    const api = window.__customObjectsDb;
    const id = contactId();
    host.innerHTML = loadingHtml();
    const objects = await api.listObjects();
    const contato = objects.find(item => fold(item.name) === 'contato' || fold(item.singular) === 'contato');
    if (!contato) {
      host.innerHTML = '';
      return;
    }
    const links = await api.listObjectLinks(contato.id);
    const chosen = links.map(link => ({
      link,
      object: objects.find(item => item.id === link.objectId)
    })).filter(item => item.object && item.object.kind === 'personalizado' && (!item.object.status || item.object.status === 'ativo'));
    if (!chosen.length) {
      host.innerHTML = '';
      return;
    }
    const recordLinks = await api.listLinksForRecord(id);
    order = [];
    await Promise.all(chosen.map(async ({ link, object }) => {
      const fields = await api.listFields(object.id);
      const rows = await api.listRecords(object.id);
      const records = rows.map(row => describeRecord(fields, row));
      const byId = new Map(records.map(record => [record.id, record]));
      const items = recordLinks.filter(row => String(row.object_link_id) === String(link.id)).map(row => {
        const recordId = otherId(row, id);
        const record = byId.get(recordId) || { id: recordId, name: 'Registro', meta: '', search: '', data: {} };
        return { ...record, linkRowId: row.id, principal: row.principal === true };
      });
      entries.set(link.id, { link, object, fields, records, items });
    }));
    order = chosen.map(item => item.link.id);
    renderCards();
  }

  window.__closeCustomObjectPanel = closePanel;

  function boot() {
    if (started || !window.__customObjectsDb || !contactId()) return;
    started = true;
    load().catch(() => {
      host.innerHTML = '';
    });
  }

  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    boot();
    if (started || tries > 150) clearInterval(timer);
  }, 200);
  boot();
})();
