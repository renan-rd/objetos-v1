(function() {
  const TAG_COLORS = ['#E60F57','#0077B2','#FF9800','#6C63FF','#00897B','#9C27B0','#D32F2F','#43A047','#00ACC1','#FFB300','#795548','#3F51B5','#607D8B'];
  const PRODUCTS = ['RD Marketing', 'RD Atendimento', 'RD Vendas'];
  const PRODUCT_LABELS = { vendas: 'RD Vendas', marketing: 'RD Marketing', conversas: 'RD Atendimento' };

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
      const createBtn = document.getElementById('dc-tag-create-btn');
      const optionsEl = document.getElementById('dc-tag-options');
      if (!input || !dropdown || !createBtn || !optionsEl) return;

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
        if (e.key === 'Enter') {
          e.preventDefault();
          this.openCreateForm(this._getQuery());
        }
      });

      createBtn.addEventListener('click', async e => {
        e.preventDefault();
        this.openCreateForm(this._getQuery());
      });

      optionsEl.addEventListener('change', e => {
        const inputEl = e.target.closest('.tag-picker-check');
        if (!inputEl) return;
        const id = String(inputEl.dataset.tagId || '');
        const tag = this._allTags.find(t => String(t.id) === id);
        if (!tag || tag.produto !== getCurrentProduct()) return;
        if (inputEl.checked) this._selected.set(id, { id, label: tag.label, color: tag.color, produto: tag.produto });
        else this._selected.delete(id);
        this._renderChips();
      });

      optionsEl.addEventListener('click', e => {
        if (e.target.closest('.tag-picker-check')) return;
        const label = e.target.closest('.tg-checkbox-label');
        if (!label) return;
        const cb = label.querySelector('.tag-picker-check');
        if (!cb || e.target.closest('.tg-checkbox-box')) return;
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
      });

      document.addEventListener('click', e => {
        if (e.target.closest('#dc-tag-picker')) return;
        this._closeDropdown();
      });
    },

    _openDropdown() {
      const dropdown = document.getElementById('dc-tag-dropdown');
      if (dropdown) dropdown.classList.add('open');
    },

    _closeDropdown() {
      const dropdown = document.getElementById('dc-tag-dropdown');
      if (dropdown) dropdown.classList.remove('open');
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

    _renderChips() {
      const chipsEl = document.getElementById('dc-tag-chips');
      if (!chipsEl) return;
      if (!this._selected.size) {
        chipsEl.innerHTML = '';
        return;
      }
      const selected = [...this._selected.values()];
      chipsEl.innerHTML = PRODUCTS.map((product, index) => {
        const tags = selected.filter(tag => tag.produto === product);
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
      const createBtn = document.getElementById('dc-tag-create-btn');
      const optionsEl = document.getElementById('dc-tag-options');
      if (!createBtn || !optionsEl) return;

      const query = this._getQuery();
      const filtered = this._filteredTags();
      const currentProduct = getCurrentProduct();

      createBtn.disabled = !query;
      createBtn.innerHTML = query
        ? `Criar nova etiqueta <span class="tag-picker-create-label">"${escHtml(query)}" em ${currentProduct}</span>`
        : `Criar nova etiqueta em ${currentProduct}`;

      if (!filtered.length) {
        optionsEl.innerHTML = `<div class="tag-picker-empty">Nenhuma tag encontrada</div>`;
        return;
      }

      optionsEl.innerHTML = filtered.map(tag => {
        const checked = this._selected.has(String(tag.id)) ? ' checked' : '';
        const uid = `tag-pick-${tag.id}`;
        return `
          <label class="tg-checkbox-label tag-picker-option" for="${uid}">
            <input class="tg-checkbox-input tag-picker-check" type="checkbox" id="${uid}" data-tag-id="${tag.id}"${checked}>
            <span class="tg-checkbox-box">
              <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.114 18.16l-5.85-5.85a.9.9 0 010-1.274l1.272-1.272a.9.9 0 011.273 0l3.941 3.94 8.44-8.44a.9.9 0 011.274 0l1.272 1.272a.9.9 0 010 1.273L9.752 18.16a.9.9 0 01-1.273 0z"/>
              </svg>
            </span>
            <span class="tg-checkbox-text tag-picker-option-text">
              <span class="tag-picker-option-dot" style="background:${escHtml(tag.color || '#405466')}"></span>
              ${escHtml(tag.label)}
            </span>
          </label>`;
      }).join('');
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

    async _createFromQuery() {
      this.openCreateForm(this._getQuery());
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
        this._renderChips();
        this._renderDropdown();
        const input = document.getElementById('dc-tag-input');
        if (input) input.value = '';
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
