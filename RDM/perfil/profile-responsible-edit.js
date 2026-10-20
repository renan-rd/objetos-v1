(function() {
  try {
    const ROLE = 'Responsável de Vendas';
    const FALLBACK = [
      { id: 'guilherme-bossa', name: 'Guilherme Bossa', email: 'guilherme.bossa@rdstation.com', avatar: 'Avatar-Guilherme.png', color: '#0088CC', role: 'Responsável de Vendas', order: 1 },
      { id: 'ana-mendes', name: 'Ana Paula Mendes', email: 'ana.mendes@rdstation.com', color: '#00ACC1', role: ROLE, order: 4 },
      { id: 'bruno-carvalho', name: 'Bruno Carvalho', email: 'bruno.carvalho@rdstation.com', color: '#6F00C7', role: ROLE, order: 5 },
      { id: 'camila-ferreira', name: 'Camila Ferreira', email: 'camila.ferreira@rdstation.com', color: '#E60F57', role: ROLE, order: 6 },
      { id: 'diego-souza', name: 'Diego Souza', email: 'diego.souza@rdstation.com', color: '#08783E', role: ROLE, order: 7 },
      { id: 'fernanda-lima', name: 'Fernanda Lima', email: 'fernanda.lima@rdstation.com', color: '#FF8A00', role: ROLE, order: 8 },
      { id: 'henrique-costa', name: 'Henrique Costa', email: 'henrique.costa@rdstation.com', color: '#0077B2', role: ROLE, order: 9 },
      { id: 'juliana-rocha', name: 'Juliana Rocha', email: 'juliana.rocha@rdstation.com', color: '#9C27B0', role: ROLE, order: 10 },
      { id: 'lucas-martins', name: 'Lucas Martins', email: 'lucas.martins@rdstation.com', color: '#00897B', role: ROLE, order: 11 },
      { id: 'marina-oliveira', name: 'Marina Oliveira', email: 'marina.oliveira@rdstation.com', color: '#D32F2F', role: ROLE, order: 12 },
      { id: 'pedro-alves', name: 'Pedro Henrique Alves', email: 'pedro.alves@rdstation.com', color: '#3F51B5', role: ROLE, order: 13 },
      { id: 'renata-alves', name: 'Renata Alves', email: 'renata.alves@rdstation.com', avatar: 'Avatar-Renata.png', color: '#E60F57', role: 'Responsável de Marketing', order: 2 },
      { id: 'victor-felipe', name: 'Victor Felipe', email: 'victor.felipe@rdstation.com', avatar: 'Avatar-Victor.png', color: '#08783E', role: 'Responsável por Atendimento', order: 3 },
    ];

    const drawer      = document.getElementById('drawer-edit-responsible');
    const content     = document.querySelector('.content');
    const detailPanel = document.getElementById('detail-panel');
    const closeBtn    = document.getElementById('responsible-drawer-close-btn');
    const cancelBtn   = document.getElementById('responsible-drawer-cancel-btn');
    const saveBtn     = document.getElementById('responsible-drawer-save-btn');
    const searchInput = document.getElementById('re-search');
    const dropdown    = document.getElementById('re-search-dropdown');
    const selectedEl  = document.getElementById('re-selected-list');
    const cardListEl  = document.getElementById('profile-responsible-list');
    const cardEl      = document.getElementById('profile-responsible-card');
    const tabsEl      = document.getElementById('responsible-drawer-tabs');
    const associationEl = document.getElementById('responsible-panel-existing');
    const formEl      = document.getElementById('edit-responsible-form');
    const nomeInput   = document.getElementById('re-nome');
    const emailInput  = document.getElementById('re-email');
    const papelInput  = document.getElementById('re-papel');
    const formError   = document.getElementById('responsible-drawer-form-error');
    const nomeError   = document.getElementById('re-nome-error');
    const emailError  = document.getElementById('re-email-error');
    if (!drawer || !content || !detailPanel || !searchInput || !dropdown || !selectedEl || !cardListEl) return;

    const CHECK_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.1136 18.1592L3.26359 12.3092C2.91214 11.9577 2.91214 11.3879 3.26359 11.0364L4.53636 9.7636C4.88781 9.4121 5.4577 9.4121 5.80915 9.7636L9.75 13.7044L18.1908 5.26359C18.5423 4.91214 19.1122 4.91214 19.4636 5.26359L20.7364 6.53639C21.0879 6.88785 21.0879 7.4577 20.7364 7.80919L10.3864 18.1592C10.0349 18.5107 9.46506 18.5107 9.1136 18.1592Z"/></svg>';
    const ELLIPSIS_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.3226 9.67742C13.6065 9.67742 14.6452 10.7161 14.6452 12C14.6452 13.2839 13.6065 14.3226 12.3226 14.3226C11.0387 14.3226 10 13.2839 10 12C10 10.7161 11.0387 9.67742 12.3226 9.67742ZM10 6.32258C10 7.60645 11.0387 8.64516 12.3226 8.64516C13.6065 8.64516 14.6452 7.60645 14.6452 6.32258C14.6452 5.03871 13.6065 4 12.3226 4C11.0387 4 10 5.03871 10 6.32258ZM10 17.6774C10 18.9613 11.0387 20 12.3226 20C13.6065 20 14.6452 18.9613 14.6452 17.6774C14.6452 16.3935 13.6065 15.3548 12.3226 15.3548C11.0387 15.3548 10 16.3935 10 17.6774Z"/></svg>';
    const STAR_OUTLINE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.1806 9.11964L14.8114 8.48353L12.8588 4.53164C12.6833 4.17851 12.3409 4 11.9985 4C11.6583 4 11.3183 4.17612 11.1421 4.53164L9.18903 8.48323L4.81953 9.11875C4.03595 9.23218 3.72193 10.196 4.28998 10.7483L7.45084 13.8229L6.70279 18.1655C6.59652 18.7858 7.09174 19.2834 7.64636 19.2834C7.79352 19.2834 7.94486 19.2485 8.09023 19.1715L11.9991 17.1213L15.9078 19.1721C16.0528 19.2482 16.2039 19.2828 16.3504 19.2828C16.9057 19.2828 17.4018 18.787 17.2955 18.1664L16.5483 13.8235L19.7098 10.7495C20.2782 10.1972 19.9641 9.23307 19.1806 9.11964ZM15.5466 12.7972L15.0057 13.3232L15.1334 14.0659L15.7161 17.4524L12.6675 15.8527L11.9994 15.5023L11.3372 15.8527L8.28835 17.4524L8.87502 14.0659L8.99946 13.3244L8.45724 12.7972L5.99502 10.3978L9.40835 9.90142L10.1461 9.77778L10.4839 9.11725L12.0003 6.03401L13.5236 9.11725L13.8573 9.79277L14.6039 9.90142L18.0137 10.3978L15.5466 12.7972Z"/></svg>';
    const STAR_SOLID_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11.1417 4.52566L9.18879 8.43281L4.81945 9.06138C4.0359 9.17352 3.72188 10.1267 4.29011 10.6726L7.45122 13.7122L6.70356 18.0059C6.56898 18.7821 7.39739 19.3634 8.09122 19.0004L12 16.9731L15.9088 19.0004C16.6026 19.3605 17.431 18.7821 17.2964 18.0059L16.5488 13.7122L19.7099 10.6726C20.2781 10.1267 19.9641 9.17352 19.1805 9.06138L14.8112 8.43281L12.8583 4.52566C12.5084 3.82921 11.4946 3.82036 11.1417 4.52566Z"/></svg>';

    let principalTip = document.querySelector('.company-principal-tooltip');
    if (!principalTip) {
      principalTip = document.createElement('div');
      principalTip.className = 'company-principal-tooltip';
      principalTip.setAttribute('role', 'tooltip');
      principalTip.textContent = 'Marcar como principal';
      principalTip.hidden = true;
      document.body.appendChild(principalTip);
    }

    let catalog = FALLBACK.slice();
    let saved = new Map();
    let draft = new Map();
    let principalId = null;
    let highlight = -1;
    let saving = false;
    let tab = 'existing';
    let editingId = null;
    let editOrigin = 'association';
    let editorSnapshot = null;
    let openMenuId = null;

    drawer.classList.remove('open');
    detailPanel.appendChild(drawer);
    cardListEl.classList.add('company-selected-list');

    const esc = value => String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    const normalize = value => String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('pt-BR');

    function getContactId() {
      return window.__profileContactId
        || new URLSearchParams(window.location.search).get('id')
        || null;
    }

    function initials(name) {
      return String(name || '')
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0])
        .join('')
        .toUpperCase();
    }

    function avatarHtml(person, alt) {
      if (person.avatar) {
        return `<img src="${esc(person.avatar)}" alt="${esc(alt || person.name)}">`;
      }
      return esc(initials(person.name));
    }

    function avatarStyle(person) {
      return person.avatar ? '' : ` style="background:${esc(person.color || '#405466')}"`;
    }

    function orderedPeople(people) {
      return [...people].sort((a, b) => {
        const aPrincipal = a.id === principalId;
        const bPrincipal = b.id === principalId;
        if (aPrincipal !== bPrincipal) return aPrincipal ? -1 : 1;
        return (a.order || 0) - (b.order || 0) || a.name.localeCompare(b.name, 'pt-BR');
      });
    }

    function showFormError(message, field) {
      const slots = { nome: nomeError, email: emailError };
      const inputs = { nome: nomeInput, email: emailInput };
      [formError, nomeError, emailError].forEach(el => {
        if (!el) return;
        el.style.display = 'none';
        el.textContent = '';
      });
      Object.values(inputs).forEach(input => input?.removeAttribute('aria-invalid'));
      if (!message) return;
      const target = slots[field] || formError;
      if (!target) return;
      target.textContent = message;
      target.style.display = '';
      inputs[field]?.setAttribute('aria-invalid', 'true');
    }

    function saveLabel() {
      if (editingId) return 'Salvar responsável';
      return tab === 'existing' ? 'Salvar' : 'Criar responsável';
    }

    function clearCreateForm() {
      if (nomeInput) nomeInput.value = '';
      if (emailInput) emailInput.value = '';
      if (papelInput) papelInput.value = '';
    }

    function applyTab(next) {
      tab = next === 'create' ? 'create' : 'existing';
      if (associationEl) associationEl.hidden = tab !== 'existing';
      if (formEl) formEl.hidden = tab !== 'create';
      tabsEl?.querySelectorAll('[data-responsible-tab]').forEach(button => {
        const active = button.dataset.responsibleTab === tab;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      if (saveBtn) saveBtn.textContent = saveLabel();
    }

    function showTab(next) {
      closeActionMenu();
      hidePrincipalTip();
      setOpen(false);
      showFormError('');
      applyTab(next);
      if (tab === 'create') nomeInput?.focus();
      else searchInput.focus();
    }

    function showAssociation() {
      editingId = null;
      editorSnapshot = null;
      clearCreateForm();
      showFormError('');
      if (tabsEl) tabsEl.hidden = false;
      applyTab('existing');
    }

    function personRow(person) {
      const principal = person.id === principalId;
      return `
        <div class="company-selected-item profile-responsible-item" data-id="${esc(person.id)}">
          <div class="profile-resp-avatar"${avatarStyle(person)}>${avatarHtml(person)}</div>
          <div class="company-selected-info">
            <span class="company-selected-name">${esc(person.name)}</span>
            ${person.email ? `<span class="company-selected-meta">${esc(person.email)}</span>` : ''}
          </div>
          <div class="company-selected-actions">
            <button type="button" class="company-selected-principal${principal ? ' is-principal' : ''}" data-id="${esc(person.id)}" aria-pressed="${principal}" aria-label="Marcar como principal">
              ${principal ? STAR_SOLID_SVG : STAR_OUTLINE_SVG}
            </button>
            <div class="company-selected-menu">
              <button type="button" class="company-selected-menu-btn" data-id="${esc(person.id)}" aria-haspopup="menu" aria-expanded="false" aria-label="Mais opções de ${esc(person.name)}">
                ${ELLIPSIS_SVG}
              </button>
              <div class="company-selected-menu-list" role="menu" hidden>
                <button type="button" class="company-selected-menu-item" role="menuitem" data-action="edit">Editar campos</button>
                <button type="button" class="company-selected-menu-item" role="menuitem" data-action="remove">Remover associação</button>
              </div>
            </div>
          </div>
        </div>`;
    }

    function renderCard() {
      const people = orderedPeople(saved.values());
      const editBtn = document.getElementById('profile-edit-responsible-btn');
      if (editBtn) editBtn.textContent = people.length > 1 ? 'Editar responsáveis' : 'Editar responsável';
      cardListEl.innerHTML = people.map(personRow).join('');
    }

    function markReady() {
      cardEl?.setAttribute('data-empty-ready', '1');
      window.__syncProfileCardEmpty?.();
    }

    function renderSelected() {
      selectedEl.innerHTML = orderedPeople(draft.values()).map(personRow).join('');
    }

    function closeActionMenu() {
      openMenuId = null;
      selectedEl.querySelectorAll('.company-selected-menu-list, .company-selected-menu-btn').forEach(node => {
        if (node.classList.contains('company-selected-menu-list')) node.hidden = true;
        else node.setAttribute('aria-expanded', 'false');
      });
      cardListEl.querySelectorAll('.company-selected-menu-list, .company-selected-menu-btn').forEach(node => {
        if (node.classList.contains('company-selected-menu-list')) node.hidden = true;
        else node.setAttribute('aria-expanded', 'false');
      });
    }

    function positionActionMenu(button, list) {
      const rect = button.getBoundingClientRect();
      list.style.top = '0px';
      list.style.left = '0px';
      const width = list.offsetWidth;
      const height = list.offsetHeight;
      const left = Math.max(8, rect.right - width);
      const below = rect.bottom + 4;
      const top = below + height + 8 > window.innerHeight
        ? Math.max(8, rect.top - 4 - height)
        : below;
      list.style.left = `${left}px`;
      list.style.top = `${top}px`;
    }

    function openActionMenu(button) {
      closeActionMenu();
      const list = button.parentElement?.querySelector('.company-selected-menu-list');
      if (!list) return;
      openMenuId = button.dataset.id;
      list.hidden = false;
      button.setAttribute('aria-expanded', 'true');
      positionActionMenu(button, list);
    }

    function hidePrincipalTip() {
      principalTip.hidden = true;
    }

    function showPrincipalTip(button) {
      principalTip.hidden = false;
      principalTip.textContent = 'Marcar como principal';
      const rect = button.getBoundingClientRect();
      const gap = 18;
      principalTip.classList.remove('is-below');
      let top = rect.top - principalTip.offsetHeight - gap;
      if (top < 8) {
        top = rect.bottom + gap;
        principalTip.classList.add('is-below');
      }
      let left = rect.right - principalTip.offsetWidth;
      const maxLeft = window.innerWidth - principalTip.offsetWidth - 8;
      if (left < 8) left = 8;
      if (left > maxLeft) left = Math.max(8, maxLeft);
      principalTip.style.top = `${top}px`;
      principalTip.style.left = `${left}px`;
      const arrowHalf = 6;
      const buttonCenter = rect.left + rect.width / 2 - left;
      const minCenter = 8 + arrowHalf;
      const maxCenter = Math.max(minCenter, principalTip.offsetWidth - 8 - arrowHalf);
      principalTip.style.setProperty('--tip-arrow-left', `${Math.max(minCenter, Math.min(buttonCenter, maxCenter))}px`);
    }

    function filteredPeople() {
      const query = normalize(searchInput.value);
      return catalog.filter(person => {
        if (!query) return true;
        return normalize(person.name).includes(query) || normalize(person.email).includes(query);
      });
    }

    function setOpen(open) {
      dropdown.hidden = !open;
      searchInput.setAttribute('aria-expanded', String(open));
      if (!open) highlight = -1;
    }

    function renderDropdown() {
      const people = filteredPeople();
      if (!people.length) {
        dropdown.innerHTML = '<div class="resp-autocomplete-empty">Nenhum responsável encontrado</div>';
        highlight = -1;
        return;
      }
      dropdown.innerHTML = people.map((person, index) => {
        const selected = draft.has(person.id);
        const active = index === highlight;
        return `
          <button type="button" class="resp-autocomplete-item${selected ? ' is-selected' : ''}${active ? ' is-active' : ''}" data-id="${esc(person.id)}" role="option" aria-selected="${selected}">
            <span class="company-autocomplete-check">${CHECK_SVG}</span>
            <div class="profile-resp-avatar"${avatarStyle(person)}>${avatarHtml(person)}</div>
            <span class="resp-autocomplete-item-text">
              <span class="resp-autocomplete-item-main">${esc(person.name)}</span>
              <span class="resp-autocomplete-item-sub">${esc(person.email)}</span>
            </span>
          </button>`;
      }).join('');
    }

    function syncPrincipalFlag() {
      const mark = person => { person.principal = person.id === principalId; };
      saved.forEach(mark);
      draft.forEach(mark);
      catalog.forEach(mark);
    }

    function choosePrincipal(people) {
      const list = [...people];
      if (principalId && list.some(person => person.id === principalId)) return principalId;
      return list[0]?.id || null;
    }

    function togglePerson(id) {
      const person = catalog.find(item => item.id === id) || saved.get(id) || draft.get(id);
      if (!person) return;
      if (draft.has(id)) {
        draft.delete(id);
        if (principalId === id) principalId = choosePrincipal(draft.values());
      } else {
        draft.set(id, person);
        if (!principalId) principalId = id;
      }
      syncPrincipalFlag();
      renderSelected();
      renderDropdown();
    }

    function closeSiblingDrawers() {
      document.getElementById('drawer-edit-tags')?.classList.remove('open');
      document.getElementById('drawer-edit-company')?.classList.remove('open');
      document.getElementById('drawer-add-contact')?.classList.remove('open');
      content.classList.remove('detail-open', 'detail-edit');
    }

    function revealDrawer() {
      closeSiblingDrawers();
      detailPanel.appendChild(drawer);
      content.classList.add('detail-open', 'detail-edit');
      detailPanel.setAttribute('aria-hidden', 'false');
      drawer.classList.add('open');
    }

    function openPanel() {
      closeActionMenu();
      hidePrincipalTip();
      showAssociation();
      draft = new Map(saved);
      principalId = choosePrincipal(saved.values());
      syncPrincipalFlag();
      searchInput.value = '';
      highlight = -1;
      renderSelected();
      renderDropdown();
      setOpen(false);
      revealDrawer();
    }

    function closePanel() {
      closeActionMenu();
      hidePrincipalTip();
      showAssociation();
      content.classList.remove('detail-open', 'detail-edit');
      detailPanel.setAttribute('aria-hidden', 'true');
      drawer.classList.remove('open');
      setOpen(false);
      searchInput.value = '';
      draft = new Map(saved);
      principalId = choosePrincipal(saved.values());
      syncPrincipalFlag();
    }

    function catalogPerson(row) {
      return {
        id: row.id,
        name: row.nome,
        email: row.email,
        role: row.papel || ROLE,
        avatar: row.avatar || '',
        color: row.cor || '#405466',
        order: Number(row.ordem) || 0,
      };
    }

    function assignedPerson(row) {
      const related = Array.isArray(row.claude_responsaveis) ? row.claude_responsaveis[0] : row.claude_responsaveis;
      if (!related?.id) return null;
      return {
        ...catalogPerson(related),
        role: row.papel || related.papel || ROLE,
        principal: row.principal === true,
      };
    }

    async function loadCatalog(db) {
      const { data, error } = await db
        .from('claude_responsaveis')
        .select('id, nome, email, papel, avatar, cor, ordem')
        .order('ordem');
      if (error || !data?.length) {
        if (error) console.error('[Profile responsible edit] Catálogo:', error.message);
        catalog = FALLBACK.slice();
        return;
      }
      catalog = data.map(catalogPerson);
    }

    async function persist(contactId, people) {
      const db = window.__sbClient;
      const list = [...people];
      principalId = list.length ? choosePrincipal(list) : null;
      syncPrincipalFlag();
      const cleared = await db
        .from('claude_contato_responsaveis')
        .update({ principal: false })
        .eq('contato_id', contactId);
      if (cleared.error) return cleared.error;
      const rows = list.map(person => ({
        contato_id: contactId,
        responsavel_id: person.id,
        papel: person.role || ROLE,
        principal: person.id === principalId,
      }));
      if (rows.length) {
        const upserted = await db
          .from('claude_contato_responsaveis')
          .upsert(rows, { onConflict: 'contato_id,responsavel_id' });
        if (upserted.error) return upserted.error;
      }
      let deletion = db.from('claude_contato_responsaveis').delete().eq('contato_id', contactId);
      const ids = rows.map(row => row.responsavel_id);
      if (ids.length) deletion = deletion.not('responsavel_id', 'in', `(${ids.join(',')})`);
      const deleted = await deletion;
      return deleted.error;
    }

    function slugify(name) {
      return normalize(name)
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        || 'responsavel';
    }

    function uniqueId(name) {
      const base = slugify(name);
      const taken = new Set(catalog.map(person => person.id));
      if (!taken.has(base)) return base;
      let index = 2;
      while (taken.has(`${base}-${index}`)) index += 1;
      return `${base}-${index}`;
    }

    async function saveCreated() {
      if (saving) return;
      const fields = readEditorFields();
      if (!fields.name) {
        showFormError('Informe o nome do responsável.', 'nome');
        nomeInput?.focus();
        return;
      }
      if (!fields.email || !fields.email.includes('@')) {
        showFormError('Informe um e-mail válido.', 'email');
        emailInput?.focus();
        return;
      }
      const emailKey = fields.email.toLocaleLowerCase('pt-BR');
      if (catalog.some(person => String(person.email || '').toLocaleLowerCase('pt-BR') === emailKey)) {
        showFormError('Já existe um responsável com esse e-mail. Use a guia Adicionar existente.', 'email');
        emailInput?.focus();
        return;
      }
      const colors = FALLBACK.map(person => person.color);
      const person = {
        id: uniqueId(fields.name),
        name: fields.name,
        email: fields.email,
        role: fields.role,
        avatar: '',
        color: colors[catalog.length % colors.length],
        order: Math.max(0, ...catalog.map(item => item.order || 0)) + 1,
      };
      const makePrincipal = !principalId || !saved.has(principalId);
      const contactId = getContactId();
      const db = window.__sbClient;
      if (db) {
        saving = true;
        saveBtn.disabled = true;
        saveBtn.textContent = 'Salvando...';
        const inserted = await db
          .from('claude_responsaveis')
          .insert({
            id: person.id,
            nome: person.name,
            email: person.email,
            papel: person.role,
            cor: person.color,
            ordem: person.order,
          });
        let linkError = null;
        if (!inserted.error && contactId) {
          const linked = await db
            .from('claude_contato_responsaveis')
            .upsert({
              contato_id: contactId,
              responsavel_id: person.id,
              papel: person.role,
              principal: makePrincipal,
            }, { onConflict: 'contato_id,responsavel_id' });
          linkError = linked.error;
        }
        saving = false;
        saveBtn.disabled = false;
        saveBtn.textContent = saveLabel();
        const error = inserted.error || linkError;
        if (error) {
          console.error('[Profile responsible edit]', error.message);
          showFormError(error.code === '23505'
            ? 'Já existe um responsável com esse e-mail.'
            : 'Não foi possível criar o responsável.', error.code === '23505' ? 'email' : undefined);
          return;
        }
      }
      catalog.push(person);
      saved.set(person.id, person);
      if (makePrincipal) principalId = person.id;
      syncPrincipalFlag();
      renderCard();
      markReady();
      closePanel();
      window.__showToast?.('Responsável adicionado com sucesso');
    }

    async function save() {
      if (saving || editingId) return;
      if (tab === 'create') {
        await saveCreated();
        return;
      }
      const next = new Map(draft);
      const contactId = getContactId();
      const db = window.__sbClient;
      if (contactId && db) {
        saving = true;
        saveBtn.disabled = true;
        const label = saveBtn.textContent;
        saveBtn.textContent = 'Salvando...';
        const error = await persist(contactId, [...next.values()]);
        saving = false;
        saveBtn.disabled = false;
        saveBtn.textContent = label;
        if (error) {
          console.error('[Profile responsible edit]', error.message);
          window.__showToast?.('Não foi possível salvar o responsável');
          return;
        }
      }
      saved = next;
      syncPrincipalFlag();
      renderCard();
      markReady();
      closePanel();
      window.__showToast?.('Responsável atualizado com sucesso');
    }

    function readEditorFields() {
      return {
        name: nomeInput?.value.trim() || '',
        email: emailInput?.value.trim() || '',
        role: papelInput?.value.trim() || ROLE,
      };
    }

    function editorChanged() {
      if (!editorSnapshot) return false;
      const now = readEditorFields();
      return now.name !== editorSnapshot.name
        || now.email !== editorSnapshot.email
        || now.role !== editorSnapshot.role;
    }

    function applyPersonFields(person, fields) {
      if (!person) return;
      person.name = fields.name;
      person.email = fields.email;
      person.role = fields.role;
    }

    function openEditor(person, origin) {
      if (!person || !formEl || !nomeInput || !emailInput || !papelInput) return;
      closeActionMenu();
      hidePrincipalTip();
      setOpen(false);
      editingId = person.id;
      editOrigin = origin;
      if (tabsEl) tabsEl.hidden = true;
      if (associationEl) associationEl.hidden = true;
      formEl.hidden = false;
      nomeInput.value = person.name || '';
      emailInput.value = person.email || '';
      papelInput.value = person.role || ROLE;
      editorSnapshot = readEditorFields();
      showFormError('');
      if (saveBtn) saveBtn.textContent = saveLabel();
      nomeInput.focus();
    }

    function editFromCard(id) {
      const person = saved.get(id);
      if (!person) return;
      revealDrawer();
      openEditor(person, 'profile');
    }

    function leaveEditor() {
      const origin = editOrigin;
      showAssociation();
      if (origin === 'profile') closePanel();
      else renderSelected();
    }

    async function saveEdited() {
      if (saving || !editingId) return;
      const fields = readEditorFields();
      if (!fields.name) {
        showFormError('Informe o nome do responsável.', 'nome');
        nomeInput?.focus();
        return;
      }
      if (!fields.email || !fields.email.includes('@')) {
        showFormError('Informe um e-mail válido.', 'email');
        emailInput?.focus();
        return;
      }
      if (!editorChanged()) {
        leaveEditor();
        return;
      }
      const personId = editingId;
      const contactId = getContactId();
      const db = window.__sbClient;
      if (db) {
        saving = true;
        saveBtn.disabled = true;
        const label = saveBtn.textContent;
        saveBtn.textContent = 'Salvando...';
        const updated = await db
          .from('claude_responsaveis')
          .update({ nome: fields.name, email: fields.email, papel: fields.role })
          .eq('id', personId);
        let linkError = null;
        if (!updated.error && contactId) {
          const linked = await db
            .from('claude_contato_responsaveis')
            .update({ papel: fields.role })
            .eq('contato_id', contactId)
            .eq('responsavel_id', personId);
          linkError = linked.error;
        }
        saving = false;
        saveBtn.disabled = false;
        saveBtn.textContent = label;
        if (updated.error || linkError) {
          const error = updated.error || linkError;
          console.error('[Profile responsible edit]', error.message);
          showFormError(error.code === '23505'
            ? 'Já existe um responsável com esse e-mail.'
            : 'Não foi possível salvar o responsável.', error.code === '23505' ? 'email' : undefined);
          return;
        }
      }
      applyPersonFields(catalog.find(person => person.id === personId), fields);
      applyPersonFields(saved.get(personId), fields);
      applyPersonFields(draft.get(personId), fields);
      renderCard();
      renderSelected();
      markReady();
      leaveEditor();
      window.__showToast?.('Responsável atualizado com sucesso');
    }

    async function markPrincipal(id) {
      if (!id || id === principalId) return;
      const person = draft.get(id) || saved.get(id) || catalog.find(item => item.id === id);
      if (!person) return;
      const previous = principalId;
      principalId = id;
      syncPrincipalFlag();
      renderCard();
      if (drawer.classList.contains('open') && !editingId) renderSelected();
      const db = window.__sbClient;
      const contactId = getContactId();
      if (!db || !contactId) return;
      const cleared = await db
        .from('claude_contato_responsaveis')
        .update({ principal: false })
        .eq('contato_id', contactId);
      const written = cleared.error ? cleared : await db
        .from('claude_contato_responsaveis')
        .upsert({
          contato_id: contactId,
          responsavel_id: id,
          papel: person.role || ROLE,
          principal: true,
        }, { onConflict: 'contato_id,responsavel_id' });
      if (written.error || cleared.error) {
        console.error('[Profile responsible edit]', (written.error || cleared.error).message);
        principalId = previous;
        syncPrincipalFlag();
        renderCard();
        if (drawer.classList.contains('open') && !editingId) renderSelected();
        window.__showToast?.('Não foi possível salvar o responsável');
      }
    }

    async function removeSaved(id) {
      const person = saved.get(id);
      if (!person) return;
      saved.delete(id);
      draft.delete(id);
      if (principalId === id) principalId = choosePrincipal(saved.values());
      syncPrincipalFlag();
      renderCard();
      markReady();
      if (drawer.classList.contains('open') && !editingId) renderSelected();
      const db = window.__sbClient;
      const contactId = getContactId();
      if (!db || !contactId) return;
      const removed = await db
        .from('claude_contato_responsaveis')
        .delete()
        .eq('contato_id', contactId)
        .eq('responsavel_id', id);
      if (removed.error) {
        console.error('[Profile responsible edit]', removed.error.message);
        saved.set(id, person);
        if (!principalId) principalId = id;
        syncPrincipalFlag();
        renderCard();
        return;
      }
      const next = saved.get(principalId);
      if (next) {
        await db
          .from('claude_contato_responsaveis')
          .update({ principal: true })
          .eq('contato_id', contactId)
          .eq('responsavel_id', next.id);
      }
    }

    function onRowClick(event, source) {
      const menuBtn = event.target.closest('.company-selected-menu-btn');
      if (menuBtn) {
        event.preventDefault();
        if (openMenuId === menuBtn.dataset.id && menuBtn.getAttribute('aria-expanded') === 'true') closeActionMenu();
        else openActionMenu(menuBtn);
        return;
      }
      const star = event.target.closest('.company-selected-principal');
      if (star) {
        event.preventDefault();
        closeActionMenu();
        markPrincipal(star.dataset.id);
        return;
      }
      const action = event.target.closest('[data-action]');
      if (!action) return;
      const id = action.closest('.company-selected-item')?.dataset.id;
      closeActionMenu();
      if (!id) return;
      if (action.dataset.action === 'edit') {
        const person = (source === 'card' ? saved : draft).get(id);
        if (!person) return;
        if (source === 'card') editFromCard(id);
        else openEditor(person, 'association');
        return;
      }
      if (source === 'card') removeSaved(id);
      else togglePerson(id);
    }

    async function loadAssignments() {
      const db = window.__sbClient;
      const contactId = getContactId();
      if (!db || !contactId) {
        renderCard();
        markReady();
        return;
      }
      const { data: sessionData } = await db.auth.getSession();
      if (!sessionData?.session) return;

      await loadCatalog(db);
      const { data, error } = await db
        .from('claude_contato_responsaveis')
        .select('papel, principal, claude_responsaveis(id, nome, email, papel, avatar, cor, ordem)')
        .eq('contato_id', contactId);
      if (error) {
        console.error('[Profile responsible edit] Atribuições:', error.message);
        renderCard();
        markReady();
        return;
      }
      const people = (data || []).map(assignedPerson).filter(Boolean);
      principalId = people.find(person => person.principal)?.id || people[0]?.id || null;
      saved = new Map(people.map(person => [person.id, person]));
      syncPrincipalFlag();
      renderCard();
      markReady();
    }

    searchInput.addEventListener('focus', () => {
      renderDropdown();
      setOpen(true);
    });

    searchInput.addEventListener('input', () => {
      highlight = -1;
      renderDropdown();
      setOpen(true);
    });

    searchInput.addEventListener('keydown', e => {
      const people = filteredPeople();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (dropdown.hidden) { renderDropdown(); setOpen(true); }
        highlight = people.length ? (highlight + 1) % people.length : -1;
        renderDropdown();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (dropdown.hidden) { renderDropdown(); setOpen(true); }
        highlight = people.length ? (highlight <= 0 ? people.length - 1 : highlight - 1) : -1;
        renderDropdown();
      } else if (e.key === 'Enter') {
        if (dropdown.hidden || highlight < 0 || !people[highlight]) return;
        e.preventDefault();
        togglePerson(people[highlight].id);
      } else if (e.key === 'Escape' && !dropdown.hidden) {
        e.stopPropagation();
        setOpen(false);
      }
    });

    dropdown.addEventListener('mousedown', e => {
      const item = e.target.closest('[data-id]');
      if (!item) return;
      e.preventDefault();
      togglePerson(item.dataset.id);
      searchInput.focus();
    });

    tabsEl?.querySelectorAll('[data-responsible-tab]').forEach(button => {
      button.addEventListener('click', () => {
        if (editingId || button.dataset.responsibleTab === tab) return;
        showTab(button.dataset.responsibleTab);
      });
    });

    selectedEl.addEventListener('click', e => onRowClick(e, 'association'));
    cardListEl.addEventListener('click', e => onRowClick(e, 'card'));

    [selectedEl, cardListEl].forEach(root => {
      root.addEventListener('mouseover', e => {
        const button = e.target.closest('.company-selected-principal');
        if (button && root.contains(button)) showPrincipalTip(button);
      });
      root.addEventListener('mouseout', e => {
        const button = e.target.closest('.company-selected-principal');
        if (!button) return;
        const next = e.relatedTarget;
        if (next && button.contains(next)) return;
        hidePrincipalTip();
      });
      root.addEventListener('focusin', e => {
        const button = e.target.closest('.company-selected-principal');
        if (button) showPrincipalTip(button);
      });
      root.addEventListener('focusout', e => {
        const button = e.target.closest('.company-selected-principal');
        if (button) hidePrincipalTip();
      });
    });

    document.addEventListener('mousedown', e => {
      if (openMenuId && !e.target.closest('.company-selected-menu')) closeActionMenu();
      if (!drawer.classList.contains('open')) return;
      if (searchInput.contains(e.target) || dropdown.contains(e.target)) return;
      setOpen(false);
    });

    document.getElementById('profile-edit-responsible-btn')?.addEventListener('click', openPanel);
    closeBtn?.addEventListener('click', closePanel);
    cancelBtn?.addEventListener('click', () => {
      if (editingId) leaveEditor();
      else closePanel();
    });
    saveBtn?.addEventListener('click', () => {
      if (editingId) saveEdited();
      else save();
    });
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape' || !drawer.classList.contains('open')) return;
      if (!dropdown.hidden) return;
      if (openMenuId) {
        closeActionMenu();
        return;
      }
      if (editingId) {
        leaveEditor();
        return;
      }
      closePanel();
    });

    window.__openProfileResponsibleEdit = openPanel;
    loadAssignments();
  } catch (e) {
    console.error('[Profile responsible edit]', e.message, e.stack);
  }
})();
