(function() {
  const PRODUCTS = ['RD Marketing', 'RD Atendimento', 'RD Vendas'];
  const PRODUCT_LABELS = { vendas: 'RD Vendas', marketing: 'RD Marketing', conversas: 'RD Atendimento' };
  const CHECK_SVG = '<svg viewBox="4 3.73 16 16"><path d="M10.3964 15.3107L7.14644 12.0607C6.95119 11.8654 6.95119 11.5488 7.14644 11.3536L7.85353 10.6464C8.04879 10.4512 8.36539 10.4512 8.56064 10.6464L10.75 12.8358L15.4394 8.14644C15.6346 7.95119 15.9512 7.95119 16.1465 8.14644L16.8536 8.85355C17.0488 9.0488 17.0488 9.36539 16.8536 9.56066L11.1036 15.3107C10.9083 15.5059 10.5917 15.5059 10.3964 15.3107Z"/></svg>';
  const TAG_PLUS_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M3 11.8787V5.5C3 4.67156 3.67156 4 4.5 4H10.8787C11.2765 4 11.658 4.15804 11.9393 4.43934L16.6761 9.17605C15.7909 9.53478 15.1667 10.4028 15.1667 11.4167V13.1667H13.4167C12.0819 13.1667 11 14.2486 11 15.5833V16.4167C11 17.5931 11.8404 18.573 12.9536 18.789L12.182 19.5607C11.5962 20.1464 10.6464 20.1464 10.0607 19.5607L3.43934 12.9393C3.15804 12.658 3 12.2765 3 11.8787ZM6.5 6C5.67156 6 5 6.67156 5 7.5C5 8.32844 5.67156 9 6.5 9C7.32844 9 8 8.32844 8 7.5C8 6.67156 7.32844 6 6.5 6ZM18.8333 15.1667H22.5833C22.8135 15.1667 23 15.3531 23 15.5833V16.4167C23 16.6469 22.8135 16.8333 22.5833 16.8333H18.8333V20.5833C18.8333 20.8135 18.6469 21 18.4167 21H17.5833C17.3531 21 17.1667 20.8135 17.1667 20.5833V16.8333H13.4167C13.1865 16.8333 13 16.6469 13 16.4167V15.5833C13 15.3531 13.1865 15.1667 13.4167 15.1667H17.1667V11.4167C17.1667 11.1865 17.3531 11 17.5833 11H18.4167C18.6469 11 18.8333 11.1865 18.8333 11.4167V15.1667Z"/></svg>';

  function escHtml(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function normalizeLabel(label) {
    return String(label || '').trim().toLocaleLowerCase('pt-BR');
  }

  function inferProduct(label) {
    const normalized = normalizeLabel(label);
    if (['campeão', 'evento', 'nutrição', 'reativação', 'trial'].includes(normalized)) return 'RD Marketing';
    if (['churn', 'detrator'].includes(normalized)) return 'RD Atendimento';
    return 'RD Vendas';
  }

  function withProduct(tag) {
    return tag ? { ...tag, produto: tag.produto || inferProduct(tag.label) } : tag;
  }

  function getCurrentProduct() {
    const productId = document.getElementById('products-menu')?.dataset.currentProduct || 'vendas';
    return PRODUCT_LABELS[productId] || 'RD Vendas';
  }

  window.__tagPicker = {
    _db: null,
    _allTags: [],
    _selected: new Map(),
    _loaded: false,

    init(db) {
      this._db = db;
      if (this._bound) return;
      this._bound = true;
      this._bindEvents();
    },

    async ensureTagsLoaded() {
      if (this._loaded || !this._db) return;
      let { data, error } = await this._db
        .from('claude_tags')
        .select('id,label,color,produto')
        .order('produto')
        .order('label');
      if (error?.code === '42703') {
        const fallback = await this._db.from('claude_tags').select('id,label,color').order('label');
        data = fallback.data;
        error = fallback.error;
      }
      if (!error && data) {
        this._allTags = data.map(withProduct);
        this._loaded = true;
      }
    },

    reset() {
      this._selected.clear();
      this._renderChips();
      const input = document.getElementById('dc-tag-input');
      if (input) input.value = '';
      this._closeDropdown();
    },

    setSelected(tags) {
      this._selected.clear();
      (tags || []).forEach(tag => {
        if (tag && tag.id) {
          const id = String(tag.id);
          this._selected.set(id, { id, label: tag.label, color: tag.color, produto: tag.produto });
        }
      });
      this._renderChips();
    },

    getSelectedIds() {
      return [...this._selected.keys()];
    },

    getSelectedTags() {
      return [...this._selected.values()];
    },

    async loadForContact(contactId) {
      await this.ensureTagsLoaded();
      if (!contactId || !this._db) {
        this.reset();
        return;
      }
      let { data, error } = await this._db
        .from('claude_contato_tags')
        .select('tag_id, claude_tags(id, label, color, produto)')
        .eq('contato_id', contactId);
      if (error?.code === '42703') {
        const fallback = await this._db
          .from('claude_contato_tags')
          .select('tag_id, claude_tags(id, label, color)')
          .eq('contato_id', contactId);
        data = fallback.data;
        error = fallback.error;
      }
      if (error) {
        this.reset();
        return;
      }
      const tags = (data || []).map(row => withProduct(row.claude_tags)).filter(Boolean);
      this.setSelected(tags);
    },

    async saveForContact(contactId) {
      if (!contactId || !this._db) return null;
      const tagIds = this.getSelectedIds();
      const { error: delError } = await this._db.from('claude_contato_tags').delete().eq('contato_id', contactId);
      if (delError) return delError;
      if (!tagIds.length) return null;
      const { error: insError } = await this._db.from('claude_contato_tags').insert(
        tagIds.map(tag_id => ({ contato_id: contactId, tag_id }))
      );
      return insError;
    },

    _bindEvents() {
      const input = document.getElementById('dc-tag-input');
      const dropdown = document.getElementById('dc-tag-dropdown');
      if (!input || !dropdown) return;
      const caret = document.getElementById('dc-tag-caret');

      input.addEventListener('focus', async () => {
        await this.ensureTagsLoaded();
        this._openDropdown();
        this._renderDropdown();
      });

      input.addEventListener('input', () => {
        this._renderDropdown();
        this._openDropdown();
      });

      input.addEventListener('keydown', async e => {
        if (e.key === 'Escape') {
          this._closeDropdown();
          input.blur();
          return;
        }
        if (e.key !== 'Enter') return;
        e.preventDefault();
        const tags = this._filteredTags();
        if (tags.length === 1) {
          this._toggleTag(tags[0]);
        }
      });

      caret?.addEventListener('click', async e => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('open');
        if (isOpen) {
          this._closeDropdown();
          return;
        }
        await this.ensureTagsLoaded();
        input.focus();
        this._openDropdown();
        this._renderDropdown();
      });

      dropdown.addEventListener('click', async e => {
        const option = e.target.closest('.profile-tags-option');
        if (option) {
          e.preventDefault();
          e.stopPropagation();
          const tag = this._allTags.find(t => String(t.id) === String(option.dataset.tagId));
          if (tag) this._toggleTag(tag);
          return;
        }
        if (e.target.closest('[data-create-tag]')) {
          e.preventDefault();
          e.stopPropagation();
          this.openCreateForm(this._getQuery(), e.target.closest('[data-create-tag]').dataset.createProduct);
        }
      });

      document.addEventListener('click', e => {
        if (e.target.closest('#dc-tag-picker')) return;
        this._closeDropdown();
      });
    },

    _openDropdown() {
      const dropdown = document.getElementById('dc-tag-dropdown');
      const shell = document.getElementById('dc-tag-input-shell');
      const input = document.getElementById('dc-tag-input');
      if (dropdown) dropdown.classList.add('open');
      shell?.classList.add('is-open');
      input?.setAttribute('aria-expanded', 'true');
    },

    _closeDropdown() {
      const dropdown = document.getElementById('dc-tag-dropdown');
      const shell = document.getElementById('dc-tag-input-shell');
      const input = document.getElementById('dc-tag-input');
      if (dropdown) dropdown.classList.remove('open');
      shell?.classList.remove('is-open');
      input?.setAttribute('aria-expanded', 'false');
    },

    _getQuery() {
      return (document.getElementById('dc-tag-input')?.value || '').trim();
    },

    _filteredTags() {
      const q = normalizeLabel(this._getQuery());
      const currentProduct = getCurrentProduct();
      const productTags = this._allTags.filter(tag => tag.produto === currentProduct);
      if (!q) return productTags;
      return productTags.filter(t => normalizeLabel(t.label).includes(q));
    },

    _toggleTag(tag) {
      if (!tag || tag.produto !== getCurrentProduct()) return;
      const id = String(tag.id);
      if (this._selected.has(id)) this._selected.delete(id);
      else this._selected.set(id, { id, label: tag.label, color: tag.color, produto: tag.produto });
      this._renderChips();
      this._renderDropdown();
    },

    _renderChips() {
      const chipsEl = document.getElementById('dc-tag-chips');
      if (!chipsEl) return;
      if (!this._selected.size) {
        chipsEl.innerHTML = '';
        return;
      }
      const selected = [...this._selected.values()];
      chipsEl.innerHTML = PRODUCTS.map((product, index) => {
        const tags = selected.filter(tag => (tag.produto || 'RD Vendas') === product);
        const chips = tags.length
          ? tags.map(tag => `
              <span class="tag-picker-chip" data-edit-tag-id="${escHtml(tag.id)}" role="button" tabindex="0" title="Editar etiqueta">
                <span class="tag-picker-chip-dot" style="background:${escHtml(tag.color || '#405466')}"></span>
                <span>${escHtml(tag.label)}</span>
                <button type="button" class="tag-picker-chip-remove" data-tag-id="${tag.id}" title="Remover" aria-label="Remover etiqueta">&times;</button>
              </span>`).join('')
          : '<span class="tag-picker-product-empty">Nenhuma etiqueta selecionada</span>';
        return `
          <div class="tag-picker-product-group">
            <div class="tag-picker-product-title">${product}</div>
            <div class="tag-picker-product-tags">${chips}</div>
          </div>
          ${index < PRODUCTS.length - 1 ? '<div class="tag-picker-product-divider"></div>' : ''}`;
      }).join('');

      chipsEl.querySelectorAll('.tag-picker-chip-remove').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          this._selected.delete(String(btn.dataset.tagId || ''));
          this._renderChips();
          this._renderDropdown();
        });
      });
      chipsEl.querySelectorAll('[data-edit-tag-id]').forEach(chip => {
        const openEdit = () => {
          const tag = this._selected.get(String(chip.dataset.editTagId || ''))
            || this._allTags.find(item => String(item.id) === String(chip.dataset.editTagId));
          if (tag) this.openEditForm(tag);
        };
        chip.addEventListener('click', openEdit);
        chip.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openEdit();
          }
        });
      });
    },

    _renderDropdown() {
      const dropdown = document.getElementById('dc-tag-dropdown');
      if (!dropdown) return;

      const query = this._getQuery();
      const filtered = this._filteredTags();
      const currentProduct = getCurrentProduct();
      const hasExactMatch = filtered.some(tag => normalizeLabel(tag.label) === normalizeLabel(query));
      const options = filtered.length
        ? `
          <div class="tag-picker-dropdown-group">
            <div class="tag-picker-product-title">${currentProduct}</div>
            ${filtered.map(tag => {
              const selected = this._selected.has(String(tag.id));
              return `
                <button type="button" class="profile-tags-option${selected ? ' is-selected' : ''}" data-tag-id="${escHtml(tag.id)}" role="option" aria-selected="${selected}">
                  <span class="profile-tags-checkbox" aria-hidden="true">${CHECK_SVG}</span>
                  <span>${escHtml(tag.label)}</span>
                </button>`;
            }).join('')}
          </div>`
        : '';

      const empty = !filtered.length && !query
        ? '<div class="profile-tags-dropdown-empty">Nenhuma etiqueta disponível</div>'
        : '';

      const create = query && !hasExactMatch && !filtered.length
        ? `
          <div class="profile-tags-dropdown-empty">Nenhuma etiqueta encontrada. Tente outro termo ou crie uma nova etiqueta.</div>
          <div class="profile-tags-create-divider"></div>
          <div class="tag-picker-create-products">
            <button type="button" class="profile-tags-create" data-create-tag data-create-product="${currentProduct}">
              ${TAG_PLUS_SVG}
              <span>Criar "${escHtml(query)}" em ${currentProduct}</span>
            </button>
          </div>`
        : '';

      dropdown.innerHTML = options || empty;
      dropdown.insertAdjacentHTML('beforeend', create);
    },

    openCreateForm(name, product) {
      const currentProduct = getCurrentProduct();
      const label = String(name || this._getQuery() || '').trim();
      if (!label || (product && product !== currentProduct) || !window.__tagCreateForm) return;
      this._closeDropdown();
      window.__tagCreateForm.open({
        mode: 'create',
        name: label,
        product: currentProduct,
        onSave: payload => this._createWithColor(payload),
      });
    },

    openEditForm(tag) {
      if (!tag || !window.__tagCreateForm) return;
      this._closeDropdown();
      window.__tagCreateForm.open({
        mode: 'edit',
        id: tag.id,
        name: tag.label,
        color: tag.color,
        product: tag.produto || getCurrentProduct(),
        onSave: payload => this._updateTag(payload),
      });
    },

    async _createFromQuery(product) {
      this.openCreateForm(this._getQuery(), product);
    },

    async _createWithColor({ label, color, product }) {
      const currentProduct = getCurrentProduct();
      const name = String(label || '').trim();
      if (!name || !this._db || (product && product !== currentProduct)) return;

      await this.ensureTagsLoaded();

      const existing = this._allTags.find(t =>
        t.produto === currentProduct && normalizeLabel(t.label) === normalizeLabel(name)
      );
      if (existing) {
        this._selected.set(String(existing.id), { id: String(existing.id), label: existing.label, color: existing.color, produto: existing.produto });
        const input = document.getElementById('dc-tag-input');
        if (input) input.value = '';
        this._renderChips();
        this._renderDropdown();
        return;
      }

      let { data, error } = await this._db
        .from('claude_tags')
        .insert([{ label: name, color, produto: currentProduct }])
        .select('id, label, color, produto')
        .single();
      if (error?.code === '42703') {
        const fallback = await this._db
          .from('claude_tags')
          .insert([{ label: name, color }])
          .select('id, label, color')
          .single();
        data = fallback.data ? { ...fallback.data, produto: currentProduct } : null;
        error = fallback.error;
      }

      if (error || !data) throw error || new Error('Não foi possível criar a etiqueta');

      this._allTags.push(data);
      this._allTags.sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));
      this._selected.set(String(data.id), { id: String(data.id), label: data.label, color: data.color, produto: data.produto });
      const input = document.getElementById('dc-tag-input');
      if (input) input.value = '';
      this._renderChips();
      this._renderDropdown();
    },

    async _updateTag({ id, label, color, product }) {
      const name = String(label || '').trim();
      const tagId = String(id || '');
      if (!name || !tagId || !this._db) return;

      await this.ensureTagsLoaded();
      const current = this._allTags.find(t => String(t.id) === tagId);
      const tagProduct = current?.produto || product || getCurrentProduct();
      const duplicate = this._allTags.find(t =>
        String(t.id) !== tagId
        && t.produto === tagProduct
        && normalizeLabel(t.label) === normalizeLabel(name)
      );
      if (duplicate) throw new Error('Já existe uma etiqueta com esse nome');

      let { data, error } = await this._db
        .from('claude_tags')
        .update({ label: name, color })
        .eq('id', tagId)
        .select('id, label, color, produto')
        .single();
      if (error?.code === '42703') {
        const fallback = await this._db
          .from('claude_tags')
          .update({ label: name, color })
          .eq('id', tagId)
          .select('id, label, color')
          .single();
        data = fallback.data ? { ...fallback.data, produto: tagProduct } : null;
        error = fallback.error;
      }
      if (error || !data) throw error || new Error('Não foi possível salvar a etiqueta');

      const next = { id: String(data.id), label: data.label, color: data.color, produto: data.produto || tagProduct };
      this._allTags = this._allTags.map(tag => String(tag.id) === tagId ? next : tag);
      if (this._selected.has(tagId)) this._selected.set(tagId, next);
      this._renderChips();
      this._renderDropdown();
    },
  };
})();
