(function() {
  const TAG_COLORS = ['#E60F57','#00ACC1','#FF8A00','#6F00C7','#08783E','#9C27B0','#D32F2F','#43A047','#0077B2','#FFB300'];
  const PRODUCTS = ['RD Marketing', 'RD Atendimento', 'RD Vendas'];
  const PRODUCT_LABELS = { vendas: 'RD Vendas', marketing: 'RD Marketing', conversas: 'RD Atendimento' };
  const VISIBLE_PER_PRODUCT = 3;

  function initTagsCard() {
    const root = document.getElementById('profile-tags-autocomplete');
    const input = document.getElementById('profile-tags-input');
    const inputShell = document.getElementById('profile-tags-input-shell');
    const caret = document.getElementById('profile-tags-caret');
    const dropdown = document.getElementById('profile-tags-dropdown');
    const selectedEl = document.getElementById('profile-tags-selected');
    const viewAllBtn = document.getElementById('profile-tags-view-all');
    if (!root || !input || !dropdown || !selectedEl) return;

    const db = window.__sbClient;
    function getContactId() {
      return window.__selectedContactId
        || window.__profileContactId
        || new URLSearchParams(window.location.search).get('id')
        || null;
    }
    const productId = document.getElementById('products-menu')?.dataset.currentProduct || 'vendas';
    const currentProduct = PRODUCT_LABELS[productId] || 'RD Vendas';
    const state = { all: [], selected: new Map(), open: false, busy: false };

    const esc = value => String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    const normalize = value => String(value || '').trim().toLocaleLowerCase('pt-BR');
    const inferProduct = label => {
      const normalized = normalize(label);
      if (['campeão', 'evento', 'nutrição', 'reativação', 'trial'].includes(normalized)) return 'RD Marketing';
      if (['churn', 'detrator'].includes(normalized)) return 'RD Atendimento';
      return 'RD Vendas';
    };
    const withProduct = tag => tag ? { ...tag, produto: tag.produto || inferProduct(tag.label) } : tag;

    function setOpen(open) {
      state.open = open;
      dropdown.classList.toggle('open', open);
      inputShell?.classList.toggle('is-open', open);
      input.setAttribute('aria-expanded', String(open));
    }

    function filteredTags() {
      const query = normalize(input.value);
      const productTags = state.all.filter(tag => tag.produto === currentProduct);
      if (!query) return productTags;
      return productTags.filter(tag => normalize(tag.label).includes(query));
    }

    function renderChip(tag) {
      return `
        <span class="profile-tags-chip">
          <svg class="profile-tag-color" viewBox="0 0 24 24" style="--tag-color:${esc(tag.color || '#405466')}" aria-hidden="true"><path d="M19.071 3.5H4.93A1.93 1.93 0 0 0 3 5.429V19.57A1.93 1.93 0 0 0 4.929 21.5H19.07A1.929 1.929 0 0 0 21 19.571V5.43A1.93 1.93 0 0 0 19.071 3.5Z"/></svg>
          <span>${esc(tag.label)}</span>
          <button type="button" class="profile-tag-remove" data-tag-id="${esc(tag.id)}" aria-label="Remover etiqueta ${esc(tag.label)}" title="Remover">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.2745 12L17.686 8.58852C18.1047 8.16989 18.1047 7.49114 17.686 7.07216L16.9278 6.31398C16.5092 5.89534 15.8305 5.89534 15.4115 6.31398L12 9.72545L8.58852 6.31398C8.16989 5.89534 7.49114 5.89534 7.07216 6.31398L6.31398 7.07216C5.89534 7.4908 5.89534 8.16955 6.31398 8.58852L9.72545 12L6.31398 15.4115C5.89534 15.8301 5.89534 16.5089 6.31398 16.9278L7.07216 17.686C7.4908 18.1047 8.16989 18.1047 8.58852 17.686L12 14.2745L15.4115 17.686C15.8301 18.1047 16.5092 18.1047 16.9278 17.686L17.686 16.9278C18.1047 16.5092 18.1047 15.8305 17.686 15.4115L14.2745 12Z"/></svg>
          </button>
        </span>`;
    }

    function renderSelected() {
      const selected = [...state.selected.values()];
      if (!selected.length) {
        selectedEl.innerHTML = '';
        return;
      }
      selectedEl.innerHTML = PRODUCTS.map((product, index) => {
        const tags = selected.filter(tag => tag.produto === product);
        const visible = tags.slice(-VISIBLE_PER_PRODUCT);
        const hidden = Math.max(tags.length - visible.length, 0);
        const chips = visible.map(renderChip).join('') + (hidden
          ? `<span class="profile-tags-count" aria-label="${hidden} etiquetas não exibidas">+${hidden}</span>`
          : '');
        return `
          <div class="profile-tags-product-group">
            <div class="tag-picker-product-title">${product}</div>
            <div class="profile-tags-product-chips">${chips}</div>
          </div>
          ${index < PRODUCTS.length - 1 ? '<div class="tag-picker-product-divider profile-tags-group-divider"></div>' : ''}`;
      }).join('');
    }

    function renderDropdown() {
      const tags = filteredTags();
      const query = input.value.trim();
      const hasExactMatch = tags.some(tag => normalize(tag.label) === normalize(query));
      const options = tags.length
        ? `
          <div class="tag-picker-dropdown-group">
            <div class="tag-picker-product-title">${currentProduct}</div>
            ${tags.map(tag => {
              const selected = state.selected.has(String(tag.id));
              return `
                <button type="button" class="profile-tags-option${selected ? ' is-selected' : ''}" data-tag-id="${esc(tag.id)}" role="option" aria-selected="${selected}">
                  <span class="profile-tags-checkbox" aria-hidden="true">
                    <svg viewBox="4 3.73 16 16"><path d="M10.3964 15.3107L7.14644 12.0607C6.95119 11.8654 6.95119 11.5488 7.14644 11.3536L7.85353 10.6464C8.04879 10.4512 8.36539 10.4512 8.56064 10.6464L10.75 12.8358L15.4394 8.14644C15.6346 7.95119 15.9512 7.95119 16.1465 8.14644L16.8536 8.85355C17.0488 9.0488 17.0488 9.36539 16.8536 9.56066L11.1036 15.3107C10.9083 15.5059 10.5917 15.5059 10.3964 15.3107Z"/></svg>
                  </span>
                  <span>${esc(tag.label)}</span>
                </button>`;
            }).join('')}
          </div>`
        : '';
      const empty = !tags.length && !query
        ? '<div class="profile-tags-dropdown-empty">Nenhuma etiqueta disponível</div>'
        : '';
      const create = query && !hasExactMatch && !tags.length
        ? `
          <div class="profile-tags-dropdown-empty">Nenhuma etiqueta encontrada. Tente outro termo ou crie uma nova etiqueta.</div>
          <div class="profile-tags-create-divider"></div>
          <div class="tag-picker-create-products">
            <button type="button" class="profile-tags-create" data-create-tag data-create-product="${currentProduct}">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 11.8787V5.5C3 4.67156 3.67156 4 4.5 4H10.8787C11.2765 4 11.658 4.15804 11.9393 4.43934L16.6761 9.17605C15.7909 9.53478 15.1667 10.4028 15.1667 11.4167V13.1667H13.4167C12.0819 13.1667 11 14.2486 11 15.5833V16.4167C11 17.5931 11.8404 18.573 12.9536 18.789L12.182 19.5607C11.5962 20.1464 10.6464 20.1464 10.0607 19.5607L3.43934 12.9393C3.15804 12.658 3 12.2765 3 11.8787ZM6.5 6C5.67156 6 5 6.67156 5 7.5C5 8.32844 5.67156 9 6.5 9C7.32844 9 8 8.32844 8 7.5C8 6.67156 7.32844 6 6.5 6ZM18.8333 15.1667H22.5833C22.8135 15.1667 23 15.3531 23 15.5833V16.4167C23 16.6469 22.8135 16.8333 22.5833 16.8333H18.8333V20.5833C18.8333 20.8135 18.6469 21 18.4167 21H17.5833C17.3531 21 17.1667 20.8135 17.1667 20.5833V16.8333H13.4167C13.1865 16.8333 13 16.6469 13 16.4167V15.5833C13 15.3531 13.1865 15.1667 13.4167 15.1667H17.1667V11.4167C17.1667 11.1865 17.3531 11 17.5833 11H18.4167C18.6469 11 18.8333 11.1865 18.8333 11.4167V15.1667Z"/></svg>
              <span>Criar "${esc(query)}" em ${currentProduct}</span>
            </button>
          </div>`
        : '';
      dropdown.innerHTML = options || empty;
      dropdown.insertAdjacentHTML('beforeend', create);
    }

    async function persistSelection(tag, shouldSelect) {
      const contactId = getContactId();
      if (!contactId || !db || state.busy) return;
      if (shouldSelect && tag.produto !== currentProduct) return;
      state.busy = true;
      const id = String(tag.id);
      if (shouldSelect) state.selected.set(id, tag);
      else state.selected.delete(id);
      renderSelected();
      renderDropdown();

      const query = db.from('claude_contato_tags');
      const { error } = shouldSelect
        ? await query.insert([{ contato_id: contactId, tag_id: tag.id }])
        : await query.delete().eq('contato_id', contactId).eq('tag_id', tag.id);

      if (error) {
        if (shouldSelect) state.selected.delete(id);
        else state.selected.set(id, tag);
        renderSelected();
        renderDropdown();
        console.error('[Card de etiquetas] Erro ao atualizar etiqueta:', error.message);
      }
      state.busy = false;
    }

    async function createTag(product) {
      const label = input.value.trim();
      if (!label || product !== currentProduct) return;
      if (window.__openContactEditTags && window.__tagPicker?.openCreateForm) {
        window.__openContactEditTags(getContactId());
        window.__tagPicker.openCreateForm(label, product);
        return;
      }
      if (window.__tagCreateForm) {
        window.__tagCreateForm.open({
          name: label,
          product,
          onSave: payload => createTagWithColor(payload),
        });
        return;
      }
      const color = TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)];
      await createTagWithColor({ label, color, product });
    }

    async function createTagWithColor({ label, color, product }) {
      const name = String(label || '').trim();
      if (!name || !db || state.busy || (product && product !== currentProduct)) return;
      const exact = state.all.find(tag =>
        tag.produto === currentProduct && normalize(tag.label) === normalize(name)
      );
      if (exact) {
        if (!state.selected.has(String(exact.id))) await persistSelection(exact, true);
        input.value = '';
        renderDropdown();
        return;
      }

      state.busy = true;
      let { data, error } = await db
        .from('claude_tags')
        .insert([{ label: name, color, produto: currentProduct }])
        .select('id,label,color,produto')
        .single();
      if (error?.code === '42703') {
        const fallback = await db
          .from('claude_tags')
          .insert([{ label: name, color }])
          .select('id,label,color')
          .single();
        data = fallback.data ? { ...fallback.data, produto: currentProduct } : null;
        error = fallback.error;
      }
      state.busy = false;
      if (error || !data) {
        console.error('[Card de etiquetas] Erro ao criar etiqueta:', error?.message);
        throw error || new Error('Não foi possível criar a etiqueta');
      }
      state.all.push(data);
      state.all.sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));
      input.value = '';
      await persistSelection(data, true);
    }

    async function load() {
      const contactId = getContactId();
      if (!contactId || !db) {
        state.selected.clear();
        renderSelected();
        renderDropdown();
        return;
      }
      let [{ data: allTags, error: tagsError }, { data: links, error: linksError }] = await Promise.all([
        db.from('claude_tags').select('id,label,color,produto').order('produto').order('label'),
        db.from('claude_contato_tags').select('tag_id, claude_tags(id,label,color,produto)').eq('contato_id', contactId),
      ]);
      if (tagsError?.code === '42703') {
        const fallback = await db.from('claude_tags').select('id,label,color').order('label');
        allTags = fallback.data;
        tagsError = fallback.error;
      }
      if (linksError?.code === '42703') {
        const fallback = await db
          .from('claude_contato_tags')
          .select('tag_id, claude_tags(id,label,color)')
          .eq('contato_id', contactId);
        links = fallback.data;
        linksError = fallback.error;
      }
      if (tagsError || linksError) {
        console.error('[Card de etiquetas] Erro ao carregar:', tagsError?.message || linksError?.message);
        return;
      }
      state.all = (allTags || []).map(withProduct);
      state.selected.clear();
      (links || []).map(row => withProduct(row.claude_tags)).filter(Boolean).forEach(tag => state.selected.set(String(tag.id), tag));
      renderSelected();
      renderDropdown();
    }

    input.addEventListener('focus', () => {
      renderDropdown();
      setOpen(true);
    });
    input.addEventListener('input', () => {
      renderDropdown();
      setOpen(true);
    });
    input.addEventListener('keydown', async event => {
      if (event.key === 'Escape') {
        setOpen(false);
        input.blur();
      } else if (event.key === 'Enter') {
        const tags = filteredTags();
        if (tags.length === 1) {
          event.preventDefault();
          const tag = tags[0];
          await persistSelection(tag, !state.selected.has(String(tag.id)));
        }
      }
    });
    caret?.addEventListener('click', event => {
      event.stopPropagation();
      if (state.open) setOpen(false);
      else {
        input.focus();
        setOpen(true);
      }
    });
    dropdown.addEventListener('click', async event => {
      const option = event.target.closest('.profile-tags-option');
      if (option) {
        event.stopPropagation();
        const tag = state.all.find(item => String(item.id) === String(option.dataset.tagId));
        if (tag) await persistSelection(tag, !state.selected.has(String(tag.id)));
        return;
      }
      if (event.target.closest('[data-create-tag]')) {
        event.stopPropagation();
        const product = event.target.closest('[data-create-tag]').dataset.createProduct;
        const name = input.value.trim();
        setOpen(false);
        if (window.__openContactEditTags && window.__tagPicker?.openCreateForm) {
          window.__openContactEditTags(getContactId());
          window.__tagPicker.openCreateForm(name, product);
          return;
        }
        if (!window.__tagCreateForm) {
          await createTag(product);
          return;
        }
        window.__tagCreateForm.open({
          name,
          product,
          onSave: payload => createTagWithColor(payload),
        });
      }
    });
    selectedEl.addEventListener('click', async event => {
      const remove = event.target.closest('.profile-tag-remove');
      if (!remove) return;
      const tag = state.selected.get(String(remove.dataset.tagId));
      if (tag) await persistSelection(tag, false);
    });
    document.addEventListener('click', event => {
      if (!event.target.closest('#profile-tags-autocomplete')) setOpen(false);
    });
    viewAllBtn?.addEventListener('click', () => window.__openContactEditTags?.(getContactId()));

    window.__refreshProfileTagCard = load;
    load();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTagsCard);
  } else {
    initTagsCard();
  }
})();
