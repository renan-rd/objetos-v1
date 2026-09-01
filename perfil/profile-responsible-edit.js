(function() {
  try {
    const ROLE = 'Responsável de Vendas';
    const PEOPLE = [
      { id: 'guilherme-bossa', name: 'Guilherme Bossa', email: 'guilherme.bossa@rdstation.com', avatar: 'Avatar-Guilherme.png', color: '#0088CC', role: 'Responsável de Vendas' },
      { id: 'ana-mendes', name: 'Ana Paula Mendes', email: 'ana.mendes@rdstation.com', color: '#00ACC1' },
      { id: 'bruno-carvalho', name: 'Bruno Carvalho', email: 'bruno.carvalho@rdstation.com', color: '#6F00C7' },
      { id: 'camila-ferreira', name: 'Camila Ferreira', email: 'camila.ferreira@rdstation.com', color: '#E60F57' },
      { id: 'diego-souza', name: 'Diego Souza', email: 'diego.souza@rdstation.com', color: '#08783E' },
      { id: 'fernanda-lima', name: 'Fernanda Lima', email: 'fernanda.lima@rdstation.com', color: '#FF8A00' },
      { id: 'henrique-costa', name: 'Henrique Costa', email: 'henrique.costa@rdstation.com', color: '#0077B2' },
      { id: 'juliana-rocha', name: 'Juliana Rocha', email: 'juliana.rocha@rdstation.com', color: '#9C27B0' },
      { id: 'lucas-martins', name: 'Lucas Martins', email: 'lucas.martins@rdstation.com', color: '#00897B' },
      { id: 'marina-oliveira', name: 'Marina Oliveira', email: 'marina.oliveira@rdstation.com', color: '#D32F2F' },
      { id: 'pedro-alves', name: 'Pedro Henrique Alves', email: 'pedro.alves@rdstation.com', color: '#3F51B5' },
      { id: 'renata-alves', name: 'Renata Alves', email: 'renata.alves@rdstation.com', avatar: 'Avatar-Renata.png', color: '#E60F57', role: 'Responsável de Marketing' },
      { id: 'victor-felipe', name: 'Victor Felipe', email: 'victor.felipe@rdstation.com', avatar: 'Avatar-Victor.png', color: '#08783E', role: 'Responsável por Atendimento' },
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
    if (!drawer || !content || !detailPanel || !searchInput || !dropdown || !selectedEl || !cardListEl) return;

    const REMOVE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2745 12L17.686 8.58852C18.1047 8.16989 18.1047 7.49114 17.686 7.07216L16.9278 6.31398C16.5092 5.89534 15.8305 5.89534 15.4115 6.31398L12 9.72545L8.58852 6.31398C8.16989 5.89534 7.49114 5.89534 7.07216 6.31398L6.31398 7.07216C5.89534 7.4908 5.89534 8.16955 6.31398 8.58852L9.72545 12L6.31398 15.4115C5.89534 15.8301 5.89534 16.5089 6.31398 16.9278L7.07216 17.686C7.4908 18.1047 8.16989 18.1047 8.58852 17.686L12 14.2745L15.4115 17.686C15.8301 18.1047 16.5092 18.1047 16.9278 17.686L17.686 16.9278C18.1047 16.5092 18.1047 15.8305 17.686 15.4115L14.2745 12Z"/></svg>';

    let saved = new Map([[PEOPLE[0].id, PEOPLE[0]]]);
    let draft = new Map();
    let highlight = -1;

    function hydrateFromCard() {
      const items = [...cardListEl.querySelectorAll('.profile-responsible-item')];
      if (!items.length) return;
      const next = new Map();
      items.forEach((item, index) => {
        const name = item.querySelector('.profile-resp-name')?.textContent.trim() || '';
        const role = item.querySelector('.profile-resp-role')?.textContent.trim() || ROLE;
        const img = item.querySelector('img')?.getAttribute('src') || '';
        const known = PEOPLE.find(person => normalize(person.name) === normalize(name));
        const person = known
          ? { ...known, role, avatar: img || known.avatar }
          : { id: `dom-${index}`, name, email: '', role, avatar: img, color: '#405466' };
        next.set(person.id, person);
      });
      if (next.size) saved = next;
    }

    drawer.classList.remove('open');
    detailPanel.appendChild(drawer);

    const esc = value => String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    const normalize = value => String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase('pt-BR');

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

    function renderCard() {
      const people = [...saved.values()];
      cardListEl.innerHTML = people.map(person => `
        <div class="profile-responsible-item">
          <div class="profile-resp-avatar"${avatarStyle(person)}>${avatarHtml(person)}</div>
          <div class="profile-resp-info">
            <span class="profile-resp-role">${esc(person.role || ROLE)}</span>
            <span class="profile-resp-name">${esc(person.name)}</span>
          </div>
        </div>
      `).join('');
    }

    function renderSelected() {
      const people = [...draft.values()];
      selectedEl.innerHTML = people.map(person => `
        <div class="resp-selected-item">
          <div class="profile-resp-avatar"${avatarStyle(person)}>${avatarHtml(person)}</div>
          <div class="profile-resp-info">
            <span class="profile-resp-name">${esc(person.name)}</span>
            <span class="profile-resp-role">${esc(person.email)}</span>
          </div>
          <button type="button" class="resp-selected-remove" data-id="${esc(person.id)}" aria-label="Remover ${esc(person.name)}">
            ${REMOVE_SVG}
          </button>
        </div>
      `).join('');
    }

    function filteredPeople() {
      const query = normalize(searchInput.value);
      return PEOPLE.filter(person => {
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
            <div class="profile-resp-avatar"${avatarStyle(person)}>${avatarHtml(person)}</div>
            <span class="resp-autocomplete-item-text">
              <span class="resp-autocomplete-item-main">${esc(person.name)}</span>
              <span class="resp-autocomplete-item-sub">${esc(person.email)}</span>
            </span>
          </button>`;
      }).join('');
    }

    function togglePerson(id) {
      const person = PEOPLE.find(item => item.id === id);
      if (!person) return;
      if (draft.has(id)) draft.delete(id);
      else draft.set(id, person);
      renderSelected();
      renderDropdown();
    }

    function closeSiblingDrawers() {
      document.getElementById('drawer-edit-tags')?.classList.remove('open');
      document.getElementById('drawer-edit-company')?.classList.remove('open');
      document.getElementById('drawer-add-contact')?.classList.remove('open');
      content.classList.remove('detail-open', 'detail-edit');
    }

    function openPanel() {
      closeSiblingDrawers();
      draft = new Map(saved);
      searchInput.value = '';
      highlight = -1;
      renderSelected();
      renderDropdown();
      setOpen(false);
      detailPanel.appendChild(drawer);
      content.classList.add('detail-open', 'detail-edit');
      detailPanel.setAttribute('aria-hidden', 'false');
      drawer.classList.add('open');
    }

    function closePanel() {
      content.classList.remove('detail-open', 'detail-edit');
      detailPanel.setAttribute('aria-hidden', 'true');
      drawer.classList.remove('open');
      setOpen(false);
      searchInput.value = '';
      draft = new Map(saved);
    }

    function save() {
      saved = new Map(draft);
      renderCard();
      closePanel();
      window.__showToast?.('Responsável atualizado com sucesso');
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

    selectedEl.addEventListener('click', e => {
      const btn = e.target.closest('[data-id]');
      if (!btn) return;
      draft.delete(btn.dataset.id);
      renderSelected();
      if (!dropdown.hidden) renderDropdown();
    });

    document.addEventListener('mousedown', e => {
      if (!drawer.classList.contains('open')) return;
      if (searchInput.contains(e.target) || dropdown.contains(e.target)) return;
      setOpen(false);
    });

    document.getElementById('profile-edit-responsible-btn')?.addEventListener('click', openPanel);
    closeBtn?.addEventListener('click', closePanel);
    cancelBtn?.addEventListener('click', closePanel);
    saveBtn?.addEventListener('click', save);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.classList.contains('open') && dropdown.hidden) closePanel();
    });

    window.__openProfileResponsibleEdit = openPanel;
    hydrateFromCard();
    renderCard();
  } catch (e) {
    console.error('[Profile responsible edit]', e.message, e.stack);
  }
})();
