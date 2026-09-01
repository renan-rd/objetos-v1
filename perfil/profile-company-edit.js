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
        .select('id, cnpj, segmento, site, telefone, telefone_tipo')
        .ilike('nome', escapeLike(nome))
        .limit(1)
        .maybeSingle();

      empresaId = empresa?.id || null;
      if (cnpjInput.value.trim() === loaded.cnpj) cnpjInput.value = empresa?.cnpj || '';
      fillCompanyFields(empresa);
      loaded = { nome, cnpj: cnpjInput.value.trim() };
    }

    nomeInput.addEventListener('blur', () => {
      pendingSync = syncByName().finally(() => { pendingSync = null; });
    });

    function showError(message, focusEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
      focusEl?.focus();
    }

    function closeCompanyPanel() {
      content.classList.remove('detail-open', 'detail-edit');
      detailPanel.setAttribute('aria-hidden', 'true');
      drawer.classList.remove('open');
      editContactId = null;
      empresaId = null;
      loaded = { nome: '', cnpj: '' };
      phoneApi.closeDropdown();
      window.__empresaAutocomplete?.close();
    }

    async function loadCompany(contactId) {
      errorEl.style.display = 'none';
      saveBtn.disabled = true;
      nomeInput.disabled = true;
      nomeInput.placeholder = 'Carregando...';

      const { data: contato, error } = await db
        .from('claude_contatos')
        .select('empresa_id, empresa_nome, empresa_cnpj')
        .eq('id', contactId)
        .single();

      nomeInput.disabled = false;
      nomeInput.placeholder = 'Digite o nome da empresa';
      saveBtn.disabled = false;

      if (error || !contato) {
        showError('Erro ao carregar empresa: ' + (error?.message || 'contato não encontrado'));
        return;
      }

      empresaId = contato.empresa_id || null;
      nomeInput.value = contato.empresa_nome || '';
      cnpjInput.value = contato.empresa_cnpj || '';
      fillCompanyFields(null);
      loaded = { nome: nomeInput.value.trim(), cnpj: cnpjInput.value.trim() };
      updateTitle();

      if (!empresaId) return;

      const { data: empresa, error: empresaError } = await db
        .from('claude_empresas')
        .select('nome, cnpj, segmento, site, telefone, telefone_tipo')
        .eq('id', empresaId)
        .maybeSingle();

      if (empresaError) {
        showError('Erro ao carregar empresa: ' + empresaError.message);
        return;
      }
      if (!empresa) return;

      nomeInput.value = contato.empresa_nome || empresa.nome || '';
      cnpjInput.value = contato.empresa_cnpj || empresa.cnpj || '';
      fillCompanyFields(empresa);
      loaded = { nome: nomeInput.value.trim(), cnpj: cnpjInput.value.trim() };
      updateTitle();
    }

    function updateTitle() {
      if (titleEl) titleEl.textContent = loaded.nome ? 'Editar empresa' : 'Adicionar empresa';
    }

    async function openCompanyPanel(contactId) {
      if (!contactId) return;
      const tagsDrawer = document.getElementById('drawer-edit-tags');
      if (tagsDrawer?.classList.contains('open')) {
        content.classList.remove('detail-open');
        tagsDrawer.classList.remove('open');
      }
      const contactDrawer = document.getElementById('drawer-add-contact');
      if (contactDrawer?.classList.contains('open')) contactDrawer.classList.remove('open');
      document.getElementById('drawer-edit-responsible')?.classList.remove('open');

      editContactId = contactId;
      detailPanel.appendChild(drawer);
      content.classList.add('detail-open', 'detail-edit');
      detailPanel.setAttribute('aria-hidden', 'false');
      drawer.classList.add('open');

      await loadCompany(contactId);
      nomeInput.focus();
    }

    async function save() {
      if (!editContactId) return;
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

      const empresaPayload = {
        nome,
        cnpj: cnpj || null,
        segmento: segmento || null,
        site: site || null,
        telefone: telefone || null,
        telefone_tipo: telefone ? tipo : null,
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
        saveBtn.textContent = 'Salvar empresa';
        showError('Erro ao salvar: ' + empresaError.message);
        return;
      }

      const { error: contatoError } = await db
        .from('claude_contatos')
        .update({ empresa_id: targetId, empresa_nome: nome, empresa_cnpj: cnpj || null })
        .eq('id', editContactId);

      saveBtn.disabled = false;
      saveBtn.textContent = 'Salvar empresa';

      if (contatoError) {
        showError('Erro ao salvar: ' + contatoError.message);
        return;
      }

      const raw = window.__profileFieldRaw || (window.__profileFieldRaw = {});
      raw.empresa_id            = targetId;
      raw.empresa_nome          = nome;
      raw.empresa_cnpj          = cnpj;
      raw.empresa_site          = site;
      raw.empresa_telefone      = telefone;
      raw.empresa_telefone_tipo = telefone ? tipo : '';
      window.__profileIdentRaw = raw;
      window.__renderProfileCompanies?.({ ...raw });

      closeCompanyPanel();
      window.__showToast?.('Empresa atualizada com sucesso');
    }

    window.__openProfileCompanyEdit = openCompanyPanel;

    saveBtn.addEventListener('click', save);
    closeBtn?.addEventListener('click', closeCompanyPanel);
    cancelBtn?.addEventListener('click', closeCompanyPanel);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) closeCompanyPanel();
    });

    document.getElementById('profile-add-company-btn')?.addEventListener('click', () => {
      const id = window.__profileContactId || new URLSearchParams(window.location.search).get('id');
      openCompanyPanel(id);
    });
  } catch (e) {
    console.error('[Profile company edit]', e.message, e.stack);
  }
})();
