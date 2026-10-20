(function() {
  try {
    const drawer      = document.getElementById('drawer-edit-company');
    const content     = document.querySelector('.content');
    const detailPanel = document.getElementById('detail-panel');
    const titleEl     = document.getElementById('company-drawer-title');
    const closeBtn    = document.getElementById('company-drawer-close-btn');
    const cancelBtn   = document.getElementById('company-drawer-cancel-btn');
    const saveBtn     = document.getElementById('company-drawer-save-btn');
    const errorEl     = document.getElementById('company-drawer-form-error');
    const nomeInput      = document.getElementById('ce-nome');
    const cnpjInput      = document.getElementById('ce-cnpj');
    const segmentoInput  = document.getElementById('ce-segmento');
    const siteInput      = document.getElementById('ce-site');
    const tipoSelect     = document.getElementById('ce-telefone-tipo');
    const phoneRoot      = document.getElementById('ce-phone-field');
    if (!drawer || !content || !detailPanel || !saveBtn || !errorEl || !nomeInput || !phoneRoot) return;

    const db = window.__sbClient;
    if (!db) return;

    window.__empresaAutocomplete?.ensureDb(db);
    window.__empresaAutocomplete?.bindPair({
      nomeInputId: 'ce-nome',
      cnpjInputId: 'ce-cnpj',
      nomeDropdownId: 'ce-nome-dropdown',
      cnpjDropdownId: 'ce-cnpj-dropdown',
    });

    drawer.classList.remove('open');
    detailPanel.appendChild(drawer);

    // ── Phone field ───────────────────────────────────────
    function applyMask(value, mask) {
      const digits = String(value || '').replace(/\D/g, '');
      let result = '';
      let di = 0;
      for (let i = 0; i < mask.length && di < digits.length; i++) {
        result += mask[i] === '#' ? digits[di++] : mask[i];
      }
      return result;
    }

    function initPhoneField(root) {
      const list = window.__countries || [];
      const trigger     = root.querySelector('.phone-country-trigger');
      const flagEl      = root.querySelector('.phone-flag');
      const codeEl      = root.querySelector('.phone-calling-code');
      const dropdown    = root.querySelector('.phone-dropdown');
      const searchInput = root.querySelector('.phone-dropdown-search input');
      const listEl      = root.querySelector('.phone-country-list');
      const input       = root.querySelector('.phone-input');
      let selected = list[0];
      let open = false;

      function closeDropdown() {
        open = false;
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }

      function selectCountry(country) {
        if (!country) return;
        selected = country;
        flagEl.innerHTML = country.flag;
        codeEl.textContent = country.dial;
        input.value = applyMask(input.value, country.mask);
        input.placeholder = country.mask.replace(/#/g, '9');
        closeDropdown();
      }

      function renderList(filter) {
        const q = (filter || '').toLowerCase();
        const filtered = list.filter(c =>
          c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.code.toLowerCase().includes(q)
        );
        if (!filtered.length) {
          listEl.innerHTML = '<div class="phone-dropdown-empty">Nenhum país encontrado</div>';
          return;
        }
        listEl.innerHTML = filtered.map(c =>
          `<div class="phone-dropdown-item${c.code === selected?.code ? ' active' : ''}" data-code="${c.code}">
            <div class="item-flag">${c.flag}</div>
            <span class="item-name">${c.name}</span>
            <span class="item-code">${c.dial}</span>
          </div>`
        ).join('');
        listEl.querySelectorAll('.phone-dropdown-item').forEach(item => {
          item.addEventListener('mousedown', e => {
            e.preventDefault();
            selectCountry(list.find(c => c.code === item.dataset.code));
            input.focus();
          });
        });
      }

      trigger.addEventListener('click', e => {
        e.stopPropagation();
        if (open) { closeDropdown(); return; }
        open = true;
        dropdown.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        searchInput.value = '';
        renderList('');
        searchInput.focus();
      });

      searchInput.addEventListener('input', () => renderList(searchInput.value));
      input.addEventListener('input', () => { input.value = applyMask(input.value, selected?.mask || '(##) #####-####'); });
      document.addEventListener('click', e => { if (!root.contains(e.target)) closeDropdown(); });

      selectCountry(list[0]);

      return {
        closeDropdown,
        focus: () => input.focus(),
        setValue(raw) {
          if (!raw) {
            selectCountry(list[0]);
            input.value = '';
            return;
          }
          const byDial = [...list].sort((a, b) => b.dial.length - a.dial.length)
            .find(c => String(raw).startsWith(c.dial));
          const country = byDial || list[0];
          selectCountry(country);
          input.value = applyMask(String(raw).replace(country.dial, ''), country.mask);
        },
        getValue() {
          const digits = input.value.replace(/\D/g, '');
          if (!digits) return '';
          return (selected?.dial || '') + digits;
        },
      };
    }

    const phoneApi = initPhoneField(phoneRoot);

    const tabsEl = document.getElementById('company-drawer-tabs');
    const createPanel = document.getElementById('edit-company-form');
    const existingPanel = document.getElementById('company-panel-existing');
    const existingSearch = document.getElementById('ce-existing-search');
    const existingList = document.getElementById('ce-existing-list');
    const existingClear = document.getElementById('ce-existing-clear');
    const existingRoot = document.getElementById('ce-existing-autocomplete');
    const selectedEl = document.getElementById('ce-selected-list');
    const profileList = document.getElementById('profile-companies-list');
    const CHECK_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.1136 18.1592L3.26359 12.3092C2.91214 11.9577 2.91214 11.3879 3.26359 11.0364L4.53636 9.7636C4.88781 9.4121 5.4577 9.4121 5.80915 9.7636L9.75 13.7044L18.1908 5.26359C18.5423 4.91214 19.1122 4.91214 19.4636 5.26359L20.7364 6.53639C21.0879 6.88785 21.0879 7.4577 20.7364 7.80919L10.3864 18.1592C10.0349 18.5107 9.46506 18.5107 9.1136 18.1592Z"/></svg>';
    const ELLIPSIS_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.3226 9.67742C13.6065 9.67742 14.6452 10.7161 14.6452 12C14.6452 13.2839 13.6065 14.3226 12.3226 14.3226C11.0387 14.3226 10 13.2839 10 12C10 10.7161 11.0387 9.67742 12.3226 9.67742ZM10 6.32258C10 7.60645 11.0387 8.64516 12.3226 8.64516C13.6065 8.64516 14.6452 7.60645 14.6452 6.32258C14.6452 5.03871 13.6065 4 12.3226 4C11.0387 4 10 5.03871 10 6.32258ZM10 17.6774C10 18.9613 11.0387 20 12.3226 20C13.6065 20 14.6452 18.9613 14.6452 17.6774C14.6452 16.3935 13.6065 15.3548 12.3226 15.3548C11.0387 15.3548 10 16.3935 10 17.6774Z"/></svg>';
    const STAR_OUTLINE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.1806 9.11964L14.8114 8.48353L12.8588 4.53164C12.6833 4.17851 12.3409 4 11.9985 4C11.6583 4 11.3183 4.17612 11.1421 4.53164L9.18903 8.48323L4.81953 9.11875C4.03595 9.23218 3.72193 10.196 4.28998 10.7483L7.45084 13.8229L6.70279 18.1655C6.59652 18.7858 7.09174 19.2834 7.64636 19.2834C7.79352 19.2834 7.94486 19.2485 8.09023 19.1715L11.9991 17.1213L15.9078 19.1721C16.0528 19.2482 16.2039 19.2828 16.3504 19.2828C16.9057 19.2828 17.4018 18.787 17.2955 18.1664L16.5483 13.8235L19.7098 10.7495C20.2782 10.1972 19.9641 9.23307 19.1806 9.11964ZM15.5466 12.7972L15.0057 13.3232L15.1334 14.0659L15.7161 17.4524L12.6675 15.8527L11.9994 15.5023L11.3372 15.8527L8.28835 17.4524L8.87502 14.0659L8.99946 13.3244L8.45724 12.7972L5.99502 10.3978L9.40835 9.90142L10.1461 9.77778L10.4839 9.11725L12.0003 6.03401L13.5236 9.11725L13.8573 9.79277L14.6039 9.90142L18.0137 10.3978L15.5466 12.7972Z"/></svg>';
    const STAR_SOLID_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11.1417 4.52566L9.18879 8.43281L4.81945 9.06138C4.0359 9.17352 3.72188 10.1267 4.29011 10.6726L7.45122 13.7122L6.70356 18.0059C6.56898 18.7821 7.39739 19.3634 8.09122 19.0004L12 16.9731L15.9088 19.0004C16.6026 19.3605 17.431 18.7821 17.2964 18.0059L16.5488 13.7122L19.7099 10.6726C20.2781 10.1267 19.9641 9.17352 19.1805 9.06138L14.8112 8.43281L12.8583 4.52566C12.5084 3.82921 11.4946 3.82036 11.1417 4.52566Z"/></svg>';
    const principalTip = document.createElement('div');
    principalTip.className = 'company-principal-tooltip';
    principalTip.id = 'company-principal-tooltip';
    principalTip.setAttribute('role', 'tooltip');
    principalTip.textContent = 'Marcar como principal';
    principalTip.hidden = true;
    document.body.appendChild(principalTip);
    let tab = 'existing';
    let adding = false;
    let selectedCompanies = new Map();
    let principalId = null;
    let openMenuId = null;
    let editingCompanyId = null;
    let editOrigin = null;
    let editorSnapshot = null;
    let contactEmpresaId = null;
    let existingRows = [];
    let searchTimer = null;
    let searchSeq = 0;
    let listOpen = false;
    let activeIndex = -1;

    let editContactId = null;
    let empresaId = null;
    let loaded = { nome: '', cnpj: '' };
    let pendingSync = null;

    function sameName(a, b) {
      return String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();
    }

    function escapeLike(value) {
      return String(value).replace(/[\\%_]/g, m => '\\' + m);
    }

    function fillCompanyFields(empresa) {
      segmentoInput.value = empresa?.segmento || '';
      siteInput.value = empresa?.site || '';
      tipoSelect.value = empresa?.telefone_tipo || 'Comercial';
      phoneApi.setValue(empresa?.telefone || '');
    }

    // Ao trocar o nome, os demais campos passam a se referir a outra empresa.
    async function syncByName() {
      const nome = nomeInput.value.trim();
      if (!nome || sameName(nome, loaded.nome)) return;

      const { data: empresa } = await db
        .from('claude_empresas')
        .select('id, cnpj, segmento, site, telefone, telefone_tipo, telefones')
        .ilike('nome', escapeLike(nome))
        .limit(1)
        .maybeSingle();

      empresaId = empresa?.id || null;
      if (cnpjInput.value.trim() === loaded.cnpj) cnpjInput.value = empresa?.cnpj || '';
      fillCompanyFields(empresa);
      loaded = { nome, cnpj: cnpjInput.value.trim() };
    }

    nomeInput.addEventListener('blur', () => {
      if (editingCompanyId) return;
      pendingSync = syncByName().finally(() => { pendingSync = null; });
    });

    function showError(message, focusEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
      focusEl?.focus();
    }

    function escHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function saveLabel() {
      if (!adding) return 'Salvar empresa';
      return tab === 'existing' ? 'Salvar' : 'Criar empresa';
    }

    function applyTab(next) {
      tab = next === 'existing' ? 'existing' : 'create';
      const showExisting = adding && tab === 'existing';
      if (createPanel) createPanel.hidden = showExisting;
      if (existingPanel) existingPanel.hidden = !showExisting;
      tabsEl?.querySelectorAll('[data-company-tab]').forEach(button => {
        const active = button.dataset.companyTab === tab;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      saveBtn.textContent = saveLabel();
    }

    function showTab(next) {
      applyTab(next);
      errorEl.style.display = 'none';
      if (tab !== 'existing') {
        setListOpen(false);
        return;
      }
      existingSearch?.focus();
    }

    function resetAddState() {
      tab = 'existing';
      adding = false;
      editingCompanyId = null;
      editOrigin = null;
      editorSnapshot = null;
      contactEmpresaId = null;
      principalId = null;
      selectedCompanies = new Map();
      existingRows = [];
      searchSeq += 1;
      clearTimeout(searchTimer);
      if (existingSearch) existingSearch.value = '';
      if (existingClear) existingClear.hidden = true;
      if (existingList) existingList.innerHTML = '';
      renderSelected();
      setListOpen(false);
      if (tabsEl) tabsEl.hidden = true;
      if (createPanel) createPanel.hidden = false;
      if (existingPanel) existingPanel.hidden = true;
      saveBtn.textContent = 'Salvar empresa';
    }

    function setListOpen(open) {
      listOpen = open;
      if (!open) activeIndex = -1;
      if (existingList) existingList.hidden = !open;
      existingSearch?.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (!open) existingSearch?.removeAttribute('aria-activedescendant');
    }

    function syncClear() {
      if (!existingClear || !existingSearch) return;
      existingClear.hidden = existingSearch.value === '';
    }

    function showListMessage(text) {
      if (!existingList) return;
      existingRows = [];
      activeIndex = -1;
      existingList.innerHTML = `<div class="company-autocomplete-empty">${escHtml(text)}</div>`;
      setListOpen(true);
    }

    function renderExisting(rows) {
      if (!existingList) return;
      if (!rows.length) {
        showListMessage('Nenhuma empresa encontrada');
        return;
      }
      existingList.innerHTML = rows.map((company, index) => {
        const selected = selectedCompanies.has(company.id);
        const meta = [company.cnpj, company.segmento].filter(Boolean).join(' · ');
        return `<button type="button" class="company-autocomplete-option${selected ? ' is-selected' : ''}${index === activeIndex ? ' is-active' : ''}" role="option" aria-selected="${selected}" data-id="${escHtml(company.id)}" id="ce-existing-option-${index}">
          <span class="company-autocomplete-check">${CHECK_SVG}</span>
          <span class="company-autocomplete-option-text">
            <span class="company-autocomplete-option-name">${escHtml(company.nome)}</span>
            ${meta ? `<span class="company-autocomplete-option-meta">${escHtml(meta)}</span>` : ''}
          </span>
        </button>`;
      }).join('');
      setListOpen(true);
      const active = existingList.querySelector('.is-active');
      if (active) existingSearch?.setAttribute('aria-activedescendant', active.id);
      else existingSearch?.removeAttribute('aria-activedescendant');
      active?.scrollIntoView({ block: 'nearest' });
    }

    function companyInitials(nome) {
      return String(nome || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(part => part[0])
        .join('')
        .toUpperCase();
    }

    function closeActionMenu() {
      openMenuId = null;
      document.querySelectorAll('.company-selected-menu-list').forEach(list => {
        list.hidden = true;
      });
      document.querySelectorAll('.company-selected-menu-btn').forEach(button => {
        button.setAttribute('aria-expanded', 'false');
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

    function companyPhones(company) {
      return Array.isArray(company?.telefones) && company.telefones.length
        ? company.telefones
        : (company?.telefone ? [{ numero: company.telefone, tipo: company.telefone_tipo || 'Comercial' }] : []);
    }

    function applyPrincipalToProfile(company) {
      if (!company?.id) return;
      const raw = window.__profileFieldRaw || (window.__profileFieldRaw = {});
      const telefones = companyPhones(company);
      const empresas = (Array.isArray(raw.empresas) ? raw.empresas : [...selectedCompanies.values()])
        .map(item => ({ ...item, principal: item.id === company.id }));
      const index = empresas.findIndex(item => item.id === company.id);
      const next = { ...(index >= 0 ? empresas[index] : {}), ...company, principal: true };
      if (index >= 0) empresas.splice(index, 1);
      empresas.unshift(next);
      raw.empresas = empresas;
      raw.empresa_id = company.id;
      raw.empresa_nome = company.nome;
      raw.empresa_cnpj = company.cnpj || '';
      raw.empresa_site = company.site || '';
      raw.empresa_telefone = telefones[0]?.numero || '';
      raw.empresa_telefone_tipo = telefones[0]?.tipo || '';
      raw.empresa_telefones = telefones;
      window.__profileIdentRaw = raw;
      window.__renderProfileCompanies?.({ ...raw, empresas });
    }

    function companyRowHtml(company, principal) {
      const actions = company.id ? `
          <div class="company-selected-actions">
            <button type="button" class="company-selected-principal${principal ? ' is-principal' : ''}" data-id="${escHtml(company.id)}" aria-pressed="${principal ? 'true' : 'false'}" aria-label="Marcar como principal" aria-describedby="company-principal-tooltip">
              ${principal ? STAR_SOLID_SVG : STAR_OUTLINE_SVG}
            </button>
            <div class="company-selected-menu">
              <button type="button" class="company-selected-menu-btn" data-id="${escHtml(company.id)}" aria-label="Mais opções de ${escHtml(company.nome)}" aria-haspopup="menu" aria-expanded="false">
                ${ELLIPSIS_SVG}
              </button>
              <div class="company-selected-menu-list" role="menu" hidden>
                <button type="button" class="company-selected-menu-item" role="menuitem" data-action="edit" data-id="${escHtml(company.id)}">Editar campos</button>
                <button type="button" class="company-selected-menu-item" role="menuitem" data-action="remove" data-id="${escHtml(company.id)}">Remover associação</button>
              </div>
            </div>
          </div>` : '';
      return `
        <div class="company-selected-item">
          <div class="company-selected-logo">${escHtml(companyInitials(company.nome))}</div>
          <div class="company-selected-info">
            <span class="company-selected-name">${escHtml(company.nome)}</span>
            ${company.cnpj ? `<span class="company-selected-meta">${escHtml(company.cnpj)}</span>` : ''}
          </div>
          ${actions}
        </div>`;
    }

    window.__profileCompanyRowHtml = companyRowHtml;

    function findProfileCompany(id) {
      const raw = window.__profileFieldRaw || {};
      return (Array.isArray(raw.empresas) ? raw.empresas : []).find(company => company?.id === id) || null;
    }

    async function writePrincipal(contactId, company) {
      const cleared = await db
        .from('claude_contato_empresas')
        .update({ principal: false })
        .eq('contato_id', contactId);
      if (cleared.error) return cleared.error;
      const saved = await db
        .from('claude_contato_empresas')
        .upsert({ contato_id: contactId, empresa_id: company.id, principal: true }, { onConflict: 'contato_id,empresa_id' });
      if (saved.error) return saved.error;
      const updated = await db
        .from('claude_contatos')
        .update({
          empresa_id: company.id,
          empresa_nome: company.nome,
          empresa_cnpj: company.cnpj || null,
        })
        .eq('id', contactId);
      return updated.error;
    }

    async function markPrincipal(id) {
      const contactId = editContactId || window.__profileContactId;
      const company = selectedCompanies.get(id) || findProfileCompany(id);
      if (!contactId || !company) return;
      const already = selectedCompanies.has(id)
        ? principalId === id
        : company.principal === true || window.__profileFieldRaw?.empresa_id === id;
      if (already) return;
      const previous = principalId;
      if (selectedCompanies.has(id)) {
        principalId = id;
        renderSelected();
      }
      const error = await writePrincipal(contactId, company);
      if (error) {
        if (selectedCompanies.has(id)) {
          principalId = previous;
          renderSelected();
        }
        if (drawer.classList.contains('open')) showError('Erro ao salvar: ' + error.message);
        else window.__showToast?.('Não foi possível marcar como principal');
        return;
      }
      contactEmpresaId = id;
      principalId = selectedCompanies.has(id) ? id : principalId;
      applyPrincipalToProfile(company);
      if (selectedCompanies.has(id)) renderSelected();
    }

    async function removeProfileAssociation(id) {
      const contactId = window.__profileContactId || editContactId;
      if (!contactId) return;
      const raw = window.__profileFieldRaw || (window.__profileFieldRaw = {});
      const current = Array.isArray(raw.empresas) ? raw.empresas.filter(company => company?.id) : [];
      const removed = current.find(company => company.id === id);
      const companies = current.filter(company => company.id !== id);
      const wasPrincipal = removed?.principal === true || raw.empresa_id === id;
      const { error } = await db
        .from('claude_contato_empresas')
        .delete()
        .eq('contato_id', contactId)
        .eq('empresa_id', id);
      if (error) {
        window.__showToast?.('Não foi possível remover a empresa');
        return;
      }
      let next = companies.find(company => company.principal) || null;
      if (wasPrincipal) next = companies[0] || null;
      if (wasPrincipal && next) {
        await db.from('claude_contato_empresas').update({ principal: false }).eq('contato_id', contactId);
        await db.from('claude_contato_empresas').update({ principal: true }).eq('contato_id', contactId).eq('empresa_id', next.id);
        await db.from('claude_contatos').update({
          empresa_id: next.id,
          empresa_nome: next.nome,
          empresa_cnpj: next.cnpj || null,
        }).eq('id', contactId);
        companies.forEach(company => { company.principal = company.id === next.id; });
        raw.empresa_id = next.id;
        raw.empresa_nome = next.nome;
        raw.empresa_cnpj = next.cnpj || '';
        raw.empresa_site = next.site || '';
        const telefones = companyPhones(next);
        raw.empresa_telefone = telefones[0]?.numero || '';
        raw.empresa_telefone_tipo = telefones[0]?.tipo || '';
        raw.empresa_telefones = telefones;
      } else if (!companies.length) {
        await db.from('claude_contatos').update({
          empresa_id: null,
          empresa_nome: null,
          empresa_cnpj: null,
        }).eq('id', contactId);
        raw.empresa_id = '';
        raw.empresa_nome = '';
        raw.empresa_cnpj = '';
        raw.empresa_site = '';
        raw.empresa_telefone = '';
        raw.empresa_telefone_tipo = '';
        raw.empresa_telefones = [];
      }
      raw.empresas = companies;
      window.__profileIdentRaw = raw;
      if (selectedCompanies.has(id)) {
        selectedCompanies.delete(id);
        if (principalId === id) principalId = next?.id || selectedCompanies.keys().next().value || null;
        renderSelected();
        if (listOpen && existingRows.length) renderExisting(existingRows);
      }
      window.__renderProfileCompanies?.({ ...raw, empresas: companies });
    }

    function revealCompanyDrawer(contactId) {
      const tagsDrawer = document.getElementById('drawer-edit-tags');
      if (tagsDrawer?.classList.contains('open')) {
        content.classList.remove('detail-open');
        tagsDrawer.classList.remove('open');
      }
      document.getElementById('drawer-add-contact')?.classList.remove('open');
      document.getElementById('drawer-edit-responsible')?.classList.remove('open');
      editContactId = contactId;
      detailPanel.appendChild(drawer);
      content.classList.add('detail-open', 'detail-edit');
      detailPanel.setAttribute('aria-hidden', 'false');
      drawer.classList.add('open');
    }

    async function editProfileCompany(id) {
      const contactId = window.__profileContactId || editContactId;
      if (!contactId || !id) return;
      revealCompanyDrawer(contactId);
      editOrigin = 'profile';
      setListOpen(false);
      if (tabsEl) tabsEl.hidden = true;
      if (existingPanel) existingPanel.hidden = true;
      if (createPanel) createPanel.hidden = true;
      if (titleEl) titleEl.textContent = 'Editar empresa';
      drawer.setAttribute('aria-label', 'Editar empresa');
      saveBtn.disabled = true;

      const { data, error } = await db
        .from('claude_empresas')
        .select('id, nome, cnpj, segmento, site, telefone, telefone_tipo, telefones')
        .eq('id', id)
        .maybeSingle();
      if (!drawer.classList.contains('open') || editOrigin !== 'profile') return;
      saveBtn.disabled = false;
      const company = data || findProfileCompany(id);
      if (error || !company?.id) {
        if (createPanel) createPanel.hidden = false;
        showError('Erro ao carregar empresa: ' + (error?.message || 'empresa não encontrada'));
        return;
      }
      openCompanyEditor(company, 'profile');
    }

    function renderSelected() {
      if (!selectedEl) return;
      closeActionMenu();
      hidePrincipalTip();
      selectedEl.innerHTML = [...selectedCompanies.values()]
        .map(company => companyRowHtml(company, company.id === principalId))
        .join('');
    }

    function toggleCompany(company) {
      if (!company?.id) return;
      if (selectedCompanies.has(company.id)) {
        selectedCompanies.delete(company.id);
        if (principalId === company.id) principalId = selectedCompanies.keys().next().value || null;
      } else {
        selectedCompanies.set(company.id, company);
        if (!principalId || !selectedCompanies.has(principalId)) principalId = company.id;
      }
      renderSelected();
      if (existingRows.length) renderExisting(existingRows);
      errorEl.style.display = 'none';
    }

    function clearCreateForm() {
      empresaId = null;
      nomeInput.value = '';
      cnpjInput.value = '';
      if (segmentoInput) segmentoInput.value = '';
      if (siteInput) siteInput.value = '';
      if (tipoSelect) tipoSelect.value = 'Comercial';
      phoneApi.setValue('');
    }

    function readEditorFields() {
      return {
        nome: nomeInput.value.trim(),
        cnpj: cnpjInput.value.trim(),
        segmento: segmentoInput.value.trim(),
        site: siteInput.value.trim(),
        telefone: phoneApi.getValue(),
        tipo: tipoSelect.value,
      };
    }

    function editorChanged() {
      if (!editorSnapshot) return true;
      const current = readEditorFields();
      return Object.keys(editorSnapshot).some(key => editorSnapshot[key] !== current[key]);
    }

    function leaveCompanyEditor() {
      const origin = editOrigin;
      editOrigin = null;
      editorSnapshot = null;
      if (origin === 'profile') closeCompanyPanel();
      else returnToExisting();
    }

    function returnToExisting() {
      editingCompanyId = null;
      editOrigin = null;
      editorSnapshot = null;
      clearCreateForm();
      tab = 'existing';
      adding = true;
      if (tabsEl) tabsEl.hidden = false;
      const hasCompany = selectedCompanies.size > 0 || Boolean(String(loaded.nome || '').trim());
      if (titleEl) titleEl.textContent = hasCompany ? 'Editar empresa' : 'Adicionar empresa';
      drawer.setAttribute('aria-label', hasCompany ? 'Editar empresa' : 'Adicionar empresa');
      showTab('existing');
      if (listOpen && existingRows.length) renderExisting(existingRows);
    }

    function openCompanyEditor(company, origin) {
      if (!company?.id) return;
      editOrigin = origin === 'profile' ? 'profile' : 'association';
      editingCompanyId = company.id;
      empresaId = company.id;
      setListOpen(false);
      nomeInput.value = company.nome || '';
      cnpjInput.value = company.cnpj || '';
      segmentoInput.value = company.segmento || '';
      siteInput.value = company.site || '';
      const phones = Array.isArray(company.telefones) && company.telefones.length
        ? company.telefones
        : (company.telefone ? [{ numero: company.telefone, tipo: company.telefone_tipo || 'Comercial' }] : []);
      tipoSelect.value = phones[0]?.tipo || company.telefone_tipo || 'Comercial';
      phoneApi.setValue(phones[0]?.numero || '');
      errorEl.style.display = 'none';
      if (tabsEl) tabsEl.hidden = true;
      if (existingPanel) existingPanel.hidden = true;
      if (createPanel) createPanel.hidden = false;
      if (titleEl) titleEl.textContent = 'Editar empresa';
      drawer.setAttribute('aria-label', 'Editar empresa');
      saveBtn.textContent = 'Salvar empresa';
      editorSnapshot = readEditorFields();
      nomeInput.focus();
    }

    function commitExistingField() {
      setListOpen(false);
    }

    async function searchExisting(query) {
      const seq = ++searchSeq;
      const q = String(query || '').trim();
      let builder = db
        .from('claude_empresas')
        .select('id, nome, cnpj, segmento, site, telefone, telefone_tipo, telefones')
        .order('nome')
        .limit(30);
      if (q) {
        const digits = q.replace(/\D/g, '');
        const filters = [`nome.ilike.%${escapeLike(q)}%`];
        if (digits) filters.push(`cnpj.ilike.%${escapeLike(digits)}%`);
        builder = builder.or(filters.join(','));
      }
      const { data, error } = await builder;
      if (seq !== searchSeq) return;
      if (error) {
        showListMessage('Não foi possível buscar as empresas');
        return;
      }
      activeIndex = -1;
      existingRows = data || [];
      renderExisting(existingRows);
    }

    function closeCompanyPanel() {
      content.classList.remove('detail-open', 'detail-edit');
      detailPanel.setAttribute('aria-hidden', 'true');
      drawer.classList.remove('open');
      editContactId = null;
      empresaId = null;
      loaded = { nome: '', cnpj: '' };
      resetAddState();
      phoneApi.closeDropdown();
      window.__empresaAutocomplete?.close();
    }

    async function loadCompany(contactId) {
      errorEl.style.display = 'none';
      const { data: contato, error } = await db
        .from('claude_contatos')
        .select('empresa_id, empresa_nome, empresa_cnpj')
        .eq('id', contactId)
        .single();

      if (error || !contato) {
        showError('Erro ao carregar empresa: ' + (error?.message || 'contato não encontrado'));
        return;
      }

      contactEmpresaId = contato.empresa_id || null;
      loaded = { nome: (contato.empresa_nome || '').trim(), cnpj: (contato.empresa_cnpj || '').trim() };
      clearCreateForm();
      updateTitle();
    }

    function updateTitle() {
      const hasCompany = selectedCompanies.size > 0 || Boolean(String(loaded.nome || '').trim());
      adding = true;
      if (titleEl) titleEl.textContent = hasCompany ? 'Editar empresa' : 'Adicionar empresa';
      drawer.setAttribute('aria-label', hasCompany ? 'Editar empresa' : 'Adicionar empresa');
      if (tabsEl) tabsEl.hidden = false;
      showTab(tab || 'existing');
    }

    async function openCompanyPanel(contactId) {
      if (!contactId) return;
      revealCompanyDrawer(contactId);
      editOrigin = null;
      editorSnapshot = null;

      tab = 'existing';
      adding = true;
      selectedCompanies = new Map();
      principalId = null;
      if (tabsEl) tabsEl.hidden = false;
      showTab('existing');

      await loadCompany(contactId);
      await preloadSelected(contactId);
      showTab('existing');
      if (listOpen && existingRows.length) renderExisting(existingRows);
      if (!(adding && tab === 'existing')) nomeInput.focus();
    }

    async function preloadSelected(contactId) {
      const { data, error } = await db
        .from('claude_contato_empresas')
        .select('principal, claude_empresas(id, nome, cnpj, segmento, site, telefone, telefone_tipo, telefones)')
        .eq('contato_id', contactId);
      const companies = !error && data
        ? data
          .map(row => {
            const company = Array.isArray(row.claude_empresas) ? row.claude_empresas[0] : row.claude_empresas;
            return company?.id ? { ...company, principal: row.principal === true } : null;
          })
          .filter(company => company?.id && company.nome)
        : [];
      if (!companies.length && contactEmpresaId && loaded.nome) {
        const { data: empresa } = await db
          .from('claude_empresas')
          .select('id, nome, cnpj, segmento, site, telefone, telefone_tipo, telefones')
          .eq('id', contactEmpresaId)
          .maybeSingle();
        if (empresa?.id) companies.push({ ...empresa, nome: empresa.nome || loaded.nome, cnpj: empresa.cnpj || loaded.cnpj, principal: true });
      }
      selectedCompanies = new Map(companies.map(company => [company.id, company]));
      principalId = companies.find(company => company.principal)?.id
        || (companies.some(company => company.id === contactEmpresaId) ? contactEmpresaId : null)
        || companies[0]?.id
        || null;
      renderSelected();
      const hasCompany = selectedCompanies.size > 0 || Boolean(String(loaded.nome || '').trim());
      if (titleEl) titleEl.textContent = hasCompany ? 'Editar empresa' : 'Adicionar empresa';
      drawer.setAttribute('aria-label', hasCompany ? 'Editar empresa' : 'Adicionar empresa');
    }

    async function saveExisting() {
      if (!editContactId) return;
      errorEl.style.display = 'none';
      const companies = [...selectedCompanies.values()];
      if (!companies.length) {
        showError('Selecione uma empresa.', existingSearch);
        return;
      }
      if (!principalId || !selectedCompanies.has(principalId)) principalId = companies[0].id;
      const principal = selectedCompanies.get(principalId);

      saveBtn.disabled = true;
      saveBtn.textContent = 'Salvando...';

      const cleared = await db
        .from('claude_contato_empresas')
        .update({ principal: false })
        .eq('contato_id', editContactId);
      let error = cleared.error;
      if (!error) {
        const rows = companies.map(company => ({
          contato_id: editContactId,
          empresa_id: company.id,
          principal: company.id === principalId,
        }));
        const upserted = await db
          .from('claude_contato_empresas')
          .upsert(rows, { onConflict: 'contato_id,empresa_id' });
        error = upserted.error;
      }
      if (!error) {
        let deletion = db.from('claude_contato_empresas').delete().eq('contato_id', editContactId);
        const ids = companies.map(company => company.id);
        if (ids.length) deletion = deletion.not('empresa_id', 'in', `(${ids.join(',')})`);
        const deleted = await deletion;
        error = deleted.error;
      }

      if (!error) {
        const updated = await db
          .from('claude_contatos')
          .update({
            empresa_id: principal.id,
            empresa_nome: principal.nome,
            empresa_cnpj: principal.cnpj || null,
          })
          .eq('id', editContactId);
        error = updated.error;
      }

      saveBtn.disabled = false;
      saveBtn.textContent = saveLabel();

      if (error) {
        showError('Erro ao salvar: ' + error.message);
        return;
      }

      const ordered = [
        principal,
        ...companies.filter(company => company.id !== principal.id),
      ];
      applyPrincipalToProfile(principal);
      const raw = window.__profileFieldRaw;
      if (raw) raw.empresas = ordered.map(company => ({ ...company, principal: company.id === principal.id }));
      window.__renderProfileCompanies?.({ ...raw, empresas: raw?.empresas });

      closeCompanyPanel();
      window.__showToast?.(companies.length > 1 ? 'Empresas adicionadas com sucesso' : 'Empresa adicionada com sucesso');
    }

    async function saveEditedCompany() {
      if (!editContactId || !editingCompanyId) return;
      errorEl.style.display = 'none';

      const fields = readEditorFields();
      if (!fields.nome) {
        showError('O nome da empresa é obrigatório.', nomeInput);
        return;
      }
      if (!editorChanged()) {
        leaveCompanyEditor();
        return;
      }

      const { nome, cnpj, segmento, site, telefone, tipo } = fields;
      const current = selectedCompanies.get(editingCompanyId) || {};
      const extras = (Array.isArray(current.telefones) ? current.telefones : []).slice(1).filter(phone => phone && phone.numero);
      const telefones = telefone ? [{ numero: telefone, tipo }, ...extras] : extras;
      const empresaPayload = {
        nome,
        cnpj: cnpj || null,
        segmento: segmento || null,
        site: site || null,
        telefone: telefones[0]?.numero || null,
        telefone_tipo: telefones[0]?.tipo || null,
        telefones,
      };

      saveBtn.disabled = true;
      saveBtn.textContent = 'Salvando...';
      const { error } = await db.from('claude_empresas').update(empresaPayload).eq('id', editingCompanyId);
      saveBtn.disabled = false;
      saveBtn.textContent = 'Salvar empresa';
      if (error) {
        showError('Erro ao salvar: ' + error.message);
        return;
      }

      const updated = {
        ...current,
        id: editingCompanyId,
        nome,
        cnpj,
        segmento,
        site,
        telefone: telefones[0]?.numero || '',
        telefone_tipo: telefones[0]?.tipo || '',
        telefones,
      };
      selectedCompanies.set(editingCompanyId, updated);
      existingRows = existingRows.map(row => (row.id === editingCompanyId ? { ...row, ...updated } : row));
      renderSelected();

      const raw = window.__profileFieldRaw || (window.__profileFieldRaw = {});
      if (Array.isArray(raw.empresas)) {
        const index = raw.empresas.findIndex(item => item.id === editingCompanyId);
        if (index >= 0) raw.empresas[index] = { ...raw.empresas[index], ...updated };
      }
      if (raw.empresa_id === editingCompanyId || contactEmpresaId === editingCompanyId) {
        raw.empresa_nome = nome;
        raw.empresa_cnpj = cnpj;
        raw.empresa_site = site;
        raw.empresa_telefone = telefones[0]?.numero || '';
        raw.empresa_telefone_tipo = telefones[0]?.tipo || '';
        raw.empresa_telefones = telefones;
        loaded = { nome, cnpj };
        await db.from('claude_contatos').update({
          empresa_nome: nome,
          empresa_cnpj: cnpj || null,
        }).eq('id', editContactId);
      }
      window.__profileIdentRaw = raw;
      window.__renderProfileCompanies?.({ ...raw });

      const changed = editorChanged();
      leaveCompanyEditor();
      if (changed) window.__showToast?.('Empresa atualizada com sucesso');
    }

    async function save() {
      if (!editContactId) return;
      if (editingCompanyId) {
        await saveEditedCompany();
        return;
      }
      if (adding && tab === 'existing') {
        await saveExisting();
        return;
      }
      errorEl.style.display = 'none';
      if (pendingSync) await pendingSync;

      const nome = nomeInput.value.trim();
      if (!nome) {
        showError('O nome da empresa é obrigatório.', nomeInput);
        return;
      }

      const cnpj      = cnpjInput.value.trim();
      const segmento  = segmentoInput.value.trim();
      const site      = siteInput.value.trim();
      const telefone  = phoneApi.getValue();
      const tipo      = tipoSelect.value;

      saveBtn.disabled = true;
      saveBtn.textContent = 'Salvando...';

      const extras = (Array.isArray(window.__profileFieldRaw?.empresa_telefones)
        ? window.__profileFieldRaw.empresa_telefones
        : []).slice(1).filter(phone => phone && phone.numero);
      const telefones = telefone ? [{ numero: telefone, tipo }, ...extras] : extras;

      const empresaPayload = {
        nome,
        cnpj: cnpj || null,
        segmento: segmento || null,
        site: site || null,
        telefone: telefones[0]?.numero || null,
        telefone_tipo: telefones[0]?.tipo || null,
        telefones,
      };

      let targetId = empresaId;

      // Sem vínculo ainda: reaproveita uma empresa de mesmo nome antes de criar outra.
      if (!targetId) {
        const { data: existing } = await db
          .from('claude_empresas')
          .select('id')
          .ilike('nome', escapeLike(nome))
          .limit(1)
          .maybeSingle();
        targetId = existing?.id || null;
      }

      let empresaError = null;
      if (targetId) {
        ({ error: empresaError } = await db.from('claude_empresas').update(empresaPayload).eq('id', targetId));
      } else {
        const { data: inserted, error } = await db
          .from('claude_empresas')
          .insert([empresaPayload])
          .select('id')
          .single();
        empresaError = error;
        targetId = inserted?.id || null;
      }

      if (empresaError) {
        saveBtn.disabled = false;
        saveBtn.textContent = saveLabel();
        showError('Erro ao salvar: ' + empresaError.message);
        return;
      }

      const { error: contatoError } = await db
        .from('claude_contatos')
        .update({ empresa_id: targetId, empresa_nome: nome, empresa_cnpj: cnpj || null })
        .eq('id', editContactId);

      saveBtn.disabled = false;
      saveBtn.textContent = saveLabel();

      if (contatoError) {
        showError('Erro ao salvar: ' + contatoError.message);
        return;
      }

      const raw = window.__profileFieldRaw || (window.__profileFieldRaw = {});
      raw.empresa_id            = targetId;
      raw.empresa_nome          = nome;
      raw.empresa_cnpj          = cnpj;
      raw.empresa_site          = site;
      raw.empresa_telefone      = telefones[0]?.numero || '';
      raw.empresa_telefone_tipo = telefones[0]?.tipo || '';
      raw.empresa_telefones     = telefones;
      window.__profileIdentRaw = raw;
      window.__renderProfileCompanies?.({ ...raw });

      closeCompanyPanel();
      window.__showToast?.('Empresa atualizada com sucesso');
    }

    window.__openProfileCompanyEdit = openCompanyPanel;

    saveBtn.addEventListener('click', save);
    closeBtn?.addEventListener('click', closeCompanyPanel);
    cancelBtn?.addEventListener('click', () => {
      if (editingCompanyId) {
        leaveCompanyEditor();
        return;
      }
      closeCompanyPanel();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && openMenuId) {
        closeActionMenu();
        return;
      }
      if (e.key === 'Escape' && listOpen) return;
      if (e.key === 'Escape' && editingCompanyId) {
        leaveCompanyEditor();
        return;
      }
      if (e.key === 'Escape' && drawer.classList.contains('open')) closeCompanyPanel();
    });

    document.getElementById('profile-add-company-btn')?.addEventListener('click', () => {
      const id = window.__profileContactId || new URLSearchParams(window.location.search).get('id');
      openCompanyPanel(id);
    });

    tabsEl?.querySelectorAll('[data-company-tab]').forEach(button => {
      button.addEventListener('click', () => {
        if (!adding || button.dataset.companyTab === tab) return;
        showTab(button.dataset.companyTab);
      });
    });

    existingList?.addEventListener('mousedown', event => {
      if (event.target.closest('.company-autocomplete-option')) event.preventDefault();
    });

    existingList?.addEventListener('click', event => {
      const option = event.target.closest('.company-autocomplete-option');
      if (!option) return;
      toggleCompany(existingRows.find(row => row.id === option.dataset.id) || null);
    });

    existingSearch?.addEventListener('mousedown', () => {
      searchExisting(existingSearch.value);
    });

    existingSearch?.addEventListener('input', () => {
      syncClear();
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => searchExisting(existingSearch.value), 300);
    });

    existingSearch?.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        if (!listOpen || !existingRows.length) {
          searchExisting(existingSearch.value);
          return;
        }
        const last = existingRows.length - 1;
        activeIndex = event.key === 'ArrowDown'
          ? Math.min(last, activeIndex + 1)
          : Math.max(0, activeIndex - 1);
        renderExisting(existingRows);
        return;
      }
      if (event.key === 'Enter' && listOpen && activeIndex >= 0) {
        event.preventDefault();
        toggleCompany(existingRows[activeIndex]);
        return;
      }
      if (event.key === 'Escape' && listOpen) {
        event.stopPropagation();
        commitExistingField();
      }
    });

    existingClear?.addEventListener('mousedown', event => event.preventDefault());
    existingClear?.addEventListener('click', () => {
      searchSeq += 1;
      if (existingSearch) existingSearch.value = '';
      syncClear();
      existingSearch?.focus();
      searchExisting('');
    });

    function bindCompanyRows(root, handlers) {
      if (!root) return;
      root.addEventListener('click', event => {
        const principalButton = event.target.closest('.company-selected-principal');
        if (principalButton) {
          handlers.onPrincipal(principalButton.dataset.id);
          return;
        }
        const item = event.target.closest('.company-selected-menu-item');
        if (item) {
          const id = item.dataset.id;
          closeActionMenu();
          if (item.dataset.action === 'edit') handlers.onEdit(id);
          if (item.dataset.action === 'remove') handlers.onRemove(id);
          return;
        }
        const button = event.target.closest('.company-selected-menu-btn');
        if (!button || !root.contains(button)) return;
        if (button.getAttribute('aria-expanded') === 'true') closeActionMenu();
        else openActionMenu(button);
      });
      root.addEventListener('mouseover', event => {
        const button = event.target.closest('.company-selected-principal');
        if (button) showPrincipalTip(button);
      });
      root.addEventListener('mouseout', event => {
        const button = event.target.closest('.company-selected-principal');
        if (!button || button.contains(event.relatedTarget)) return;
        hidePrincipalTip();
      });
      root.addEventListener('focusin', event => {
        const button = event.target.closest('.company-selected-principal');
        if (button) showPrincipalTip(button);
      });
      root.addEventListener('focusout', event => {
        const button = event.target.closest('.company-selected-principal');
        if (!button || button.contains(event.relatedTarget)) return;
        hidePrincipalTip();
      });
    }

    bindCompanyRows(selectedEl, {
      onPrincipal: markPrincipal,
      onEdit: id => openCompanyEditor(selectedCompanies.get(id), 'association'),
      onRemove: id => {
        selectedCompanies.delete(id);
        if (principalId === id) principalId = selectedCompanies.keys().next().value || null;
        renderSelected();
        if (listOpen && existingRows.length) renderExisting(existingRows);
      },
    });

    bindCompanyRows(profileList, {
      onPrincipal: markPrincipal,
      onEdit: editProfileCompany,
      onRemove: removeProfileAssociation,
    });

    drawer.querySelector('.drawer-body')?.addEventListener('scroll', () => {
      hidePrincipalTip();
      if (openMenuId) closeActionMenu();
    });
    window.addEventListener('scroll', () => {
      hidePrincipalTip();
      if (openMenuId) closeActionMenu();
    }, true);

    document.addEventListener('mousedown', event => {
      if (openMenuId && !event.target.closest('.company-selected-menu')) closeActionMenu();
      if (!listOpen || existingRoot?.contains(event.target)) return;
      commitExistingField();
    });
  } catch (e) {
    console.error('[Profile company edit]', e.message, e.stack);
  }
})();
