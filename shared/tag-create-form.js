(function() {
  const DEFAULT_SHADE = 2;
  const COLOR_GROUPS = [
    { id: 'amarelo', shades: ['#E8E2CA', '#ECDCA1', '#F5D55E', '#E0C048'] },
    { id: 'laranja', shades: ['#EACFBF', '#F2AD87', '#FF7629', '#E46016'] },
    { id: 'marrom', shades: ['#E6C8C3', '#E89C91', '#ED553E', '#BA412E'] },
    { id: 'rosa', shades: ['#E4BACC', '#E178A7', '#DF0D6A', '#BA0C59'] },
    { id: 'roxo', shades: ['#D3B9CF', '#B876AD', '#8B0976', '#59074C'] },
    { id: 'verde', shades: ['#B8DFB7', '#74D572', '#04C600', '#088306'] },
    { id: 'turquesa', shades: ['#C3DAD8', '#91C8C5', '#3EADA6', '#318580'] },
    { id: 'ciano', shades: ['#B7D3E1', '#72B9DA', '#008ED0', '#026897'] },
    { id: 'marinho', shades: ['#BCC4CA', '#7D92A2', '#174060', '#0B2132'] },
    { id: 'cinza', shades: ['#D5D5D5', '#BEBDBD', '#989797', '#767474'] },
  ];

  const ARROW_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.366 11.153a1.167 1.167 0 0 0 0 1.698l5 4.798a1.29 1.29 0 0 0 1.77 0 1.167 1.167 0 0 0 0-1.698L6.27 13.199h14.48C21.442 13.2 22 12.663 22 12s-.559-1.2-1.25-1.2H6.269l2.867-2.75a1.167 1.167 0 0 0 0-1.699 1.29 1.29 0 0 0-1.77 0l-5 4.798v.004Z"/></svg>';
  const CHECK_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.1136 18.1592L3.26359 12.3092C2.91214 11.9577 2.91214 11.3879 3.26359 11.0364L4.53636 9.7636C4.88781 9.4121 5.4577 9.4121 5.80915 9.7636L9.75 13.7044L18.1908 5.26359C18.5423 4.91214 19.1122 4.91214 19.4636 5.26359L20.7364 6.53639C21.0879 6.88785 21.0879 7.4577 20.7364 7.80919L10.3864 18.1592C10.0349 18.5107 9.46506 18.5107 9.1136 18.1592Z"/></svg>';
  const TAG_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.071 3.5H4.93A1.93 1.93 0 0 0 3 5.429V19.57A1.93 1.93 0 0 0 4.929 21.5H19.07A1.929 1.929 0 0 0 21 19.571V5.43A1.93 1.93 0 0 0 19.071 3.5Z"/></svg>';

  const STYLE_ID = 'tag-create-form-styles';
  const STYLE_CSS = `
    .drawer.is-creating-tag > :not(.tag-create-view) { display: none !important; }
    .tag-create-view {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      gap: 8px;
      width: 100%;
    }
    .tag-create-header {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 16px 16px 8px;
      flex-shrink: 0;
    }
    .tag-create-back {
      width: 32px;
      height: 32px;
      padding: 6px;
      border: none;
      background: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .tag-create-back:hover { background: var(--color-surface-low); }
    .tag-create-back svg {
      width: 20px;
      height: 20px;
      fill: var(--color-text-high);
      display: block;
    }
    .tag-create-title {
      flex: 1;
      min-width: 0;
      min-height: 32px;
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 700;
      color: var(--color-text-high);
      letter-spacing: -0.16px;
      line-height: 1.5;
    }
    .tag-create-body {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 0 16px;
    }
    .tag-create-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }
    .tag-create-label {
      font-size: 16px;
      font-weight: 700;
      color: var(--color-text-high);
      letter-spacing: -0.16px;
      line-height: 1.5;
    }
    .tag-create-input {
      width: 100%;
      height: 40px;
      padding: 8px 12px;
      border: 1px solid var(--color-border-interactive);
      border-radius: var(--radius-md);
      background: var(--color-surface);
      font-family: var(--font);
      font-size: 16px;
      font-weight: 500;
      color: var(--color-text-high);
      letter-spacing: -0.16px;
      outline: none;
      box-sizing: border-box;
    }
    .tag-create-input:focus {
      border-color: var(--color-primary-border);
      box-shadow: 0 0 0 2px rgba(0,219,255,0.15);
    }
    .tag-create-swatches {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      row-gap: 8px;
      width: 100%;
    }
    .tag-create-shades {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 8px;
      background: var(--color-surface-low);
      border-radius: var(--radius-sm);
    }
    .tag-create-swatch {
      width: 32px;
      height: 32px;
      padding: 0;
      border: 1px solid var(--color-border-interactive);
      border-radius: 999px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: var(--swatch-color);
    }
    .tag-create-swatch.is-selected {
      border-width: 2px;
    }
    .tag-create-swatch svg {
      width: 12px;
      height: 12px;
      fill: #fff;
      display: none;
    }
    .tag-create-swatch.is-selected svg { display: block; }
    .tag-create-preview-chip {
      display: inline-flex;
      align-items: center;
      align-self: flex-start;
      width: fit-content;
      max-width: 100%;
      box-sizing: border-box;
      gap: 4px;
      min-height: 24px;
      padding: 4px 8px;
      border-radius: var(--radius-xs);
      background: var(--color-surface-low);
      color: var(--color-text-high);
      font-size: 12px;
      font-weight: 900;
      letter-spacing: -0.12px;
      line-height: 1.3;
      text-transform: uppercase;
    }
    .tag-create-preview-chip svg {
      width: 16px;
      height: 16px;
      fill: var(--tag-color, #405466);
      display: block;
      flex-shrink: 0;
    }
    .tag-create-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 8px 16px;
      flex-shrink: 0;
    }
    .tag-create-cancel,
    .tag-create-save {
      height: 32px;
      min-width: 59px;
      padding: 6px 12px;
      border: none;
      border-radius: var(--radius-sm);
      font-family: var(--font);
      font-size: 14px;
      font-weight: 700;
      letter-spacing: -0.14px;
      line-height: 1.4;
      cursor: pointer;
      color: var(--color-primary-text);
    }
    .tag-create-cancel { background: none; }
    .tag-create-cancel:hover { background: var(--color-primary-surface-low); }
    .tag-create-save { background: var(--color-primary-surface-low); }
    .tag-create-save:hover:not(:disabled) { background: #66EBFF; color: #005580; }
    .tag-create-save:disabled { opacity: 0.5; cursor: not-allowed; }
    .tag-picker-chip { cursor: pointer; }
  `;

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = STYLE_CSS;
    document.head.appendChild(style);
  }

  function esc(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function findHost() {
    const tagsDrawer = document.getElementById('drawer-edit-tags');
    if (tagsDrawer?.classList.contains('open')) return tagsDrawer;
    const contactDrawer = document.getElementById('drawer-add-contact');
    if (contactDrawer?.classList.contains('open')) return contactDrawer;
    return tagsDrawer || contactDrawer || document.querySelector('.detail-panel') || document.body;
  }

  function selectedColor(state) {
    return COLOR_GROUPS[state.group].shades[state.shade];
  }

  function colorToHex(color) {
    const value = String(color || '').trim();
    if (!value) return '';
    if (value.startsWith('#')) {
      const hex = value.slice(1);
      if (hex.length === 3) return `#${hex.split('').map(ch => ch + ch).join('')}`.toUpperCase();
      return `#${hex}`.toUpperCase().replace('##', '#');
    }
    const rgb = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (!rgb) return value.toUpperCase();
    return `#${[rgb[1], rgb[2], rgb[3]].map(n => Number(n).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
  }

  function hexToRgb(hex) {
    const clean = colorToHex(hex).replace('#', '');
    if (clean.length !== 6) return null;
    return [0, 2, 4].map(i => parseInt(clean.slice(i, i + 2), 16));
  }

  function findColorPosition(color) {
    const hex = colorToHex(color);
    let best = { group: 0, shade: DEFAULT_SHADE, dist: Infinity };
    COLOR_GROUPS.forEach((group, groupIndex) => {
      group.shades.forEach((shade, shadeIndex) => {
        if (shade.toUpperCase() === hex) {
          best = { group: groupIndex, shade: shadeIndex, dist: 0 };
          return;
        }
        const a = hexToRgb(shade);
        const b = hexToRgb(hex);
        if (!a || !b) return;
        const dist = (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
        if (dist < best.dist) best = { group: groupIndex, shade: shadeIndex, dist };
      });
    });
    return { group: best.group, shade: best.shade };
  }

  const form = {
    _open: false,
    _host: null,
    _view: null,
    _state: null,
    _onSave: null,
    _onCancel: null,
    _busy: false,

    isOpen() {
      return this._open;
    },

    open({ name = '', color, product, id, mode = 'create', host, onSave, onCancel } = {}) {
      ensureStyles();
      this.close('replace');
      this._host = host || findHost();
      this._onSave = onSave;
      this._onCancel = onCancel;
      const position = findColorPosition(color);
      this._state = {
        id: id || '',
        mode: mode === 'edit' ? 'edit' : 'create',
        name: String(name || ''),
        product: product || '',
        group: position.group,
        shade: position.shade,
      };
      this._view = this._render();
      this._host.appendChild(this._view);
      this._host.classList.add('is-creating-tag', 'open');
      this._open = true;
      this._view.querySelector('.tag-create-input')?.focus();
      this._view.querySelector('.tag-create-input')?.select();
    },

    close(reason) {
      if (!this._open && !this._view) return;
      this._host?.classList.remove('is-creating-tag');
      this._view?.remove();
      const onCancel = this._onCancel;
      this._open = false;
      this._view = null;
      this._host = null;
      this._onSave = null;
      this._onCancel = null;
      this._state = null;
      this._busy = false;
      if (reason === 'cancel') onCancel?.();
    },

    _render() {
      const view = document.createElement('div');
      view.className = 'tag-create-view';
      view.innerHTML = `
        <div class="tag-create-header">
          <button type="button" class="tag-create-back" data-tag-create-back title="Voltar" aria-label="Voltar">${ARROW_SVG}</button>
          <div class="tag-create-title">${this._state.mode === 'edit' ? 'Editar etiqueta' : 'Criar etiquetas'}</div>
        </div>
        <div class="tag-create-body">
          <div class="tag-create-field">
            <label class="tag-create-label" for="tag-create-name">Nome da etiqueta</label>
            <input class="tag-create-input" id="tag-create-name" type="text" maxlength="80" value="${esc(this._state.name)}" autocomplete="off">
          </div>
          <div class="tag-create-field">
            <div class="tag-create-label">Cor</div>
            <div class="tag-create-swatches" data-tag-create-groups></div>
            <div class="tag-create-shades" data-tag-create-shades></div>
          </div>
          <div class="tag-create-field">
            <div class="tag-create-label">Pré-visualização</div>
            <div class="tag-create-preview-chip" data-tag-create-preview>
              ${TAG_SVG}
              <span data-tag-create-preview-label></span>
            </div>
          </div>
        </div>
        <div class="tag-create-footer">
          <button type="button" class="tag-create-cancel" data-tag-create-cancel>Cancelar</button>
          <button type="button" class="tag-create-save" data-tag-create-save>${this._state.mode === 'edit' ? 'Salvar' : 'Criar etiqueta'}</button>
        </div>
      `;
      this._bind(view);
      this._sync(view);
      return view;
    },

    _bind(view) {
      view.querySelector('[data-tag-create-back]').addEventListener('click', () => this.close('cancel'));
      view.querySelector('[data-tag-create-cancel]').addEventListener('click', () => this.close('cancel'));
      view.querySelector('[data-tag-create-save]').addEventListener('click', () => this._save());
      view.querySelector('#tag-create-name').addEventListener('input', e => {
        this._state.name = e.target.value;
        this._sync(view);
      });
      view.querySelector('#tag-create-name').addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this._save();
        }
      });
      view.querySelector('[data-tag-create-groups]').addEventListener('click', e => {
        const btn = e.target.closest('[data-group-index]');
        if (!btn) return;
        this._state.group = Number(btn.dataset.groupIndex);
        this._state.shade = DEFAULT_SHADE;
        this._sync(view);
      });
      view.querySelector('[data-tag-create-shades]').addEventListener('click', e => {
        const btn = e.target.closest('[data-shade-index]');
        if (!btn) return;
        this._state.shade = Number(btn.dataset.shadeIndex);
        this._sync(view);
      });
    },

    _swatch(color, selected, indexAttr) {
      return `
        <button type="button" class="tag-create-swatch${selected ? ' is-selected' : ''}" style="--swatch-color:${color}" ${indexAttr} aria-pressed="${selected}">
          ${CHECK_SVG}
        </button>`;
    },

    _sync(view) {
      const groupsEl = view.querySelector('[data-tag-create-groups]');
      const shadesEl = view.querySelector('[data-tag-create-shades]');
      const preview = view.querySelector('[data-tag-create-preview]');
      const previewLabel = view.querySelector('[data-tag-create-preview-label]');
      const saveBtn = view.querySelector('[data-tag-create-save]');
      const color = selectedColor(this._state);
      const name = this._state.name.trim();

      groupsEl.innerHTML = COLOR_GROUPS.map((group, index) =>
        this._swatch(group.shades[DEFAULT_SHADE], index === this._state.group, `data-group-index="${index}"`)
      ).join('');
      shadesEl.innerHTML = COLOR_GROUPS[this._state.group].shades.map((shade, index) =>
        this._swatch(shade, index === this._state.shade, `data-shade-index="${index}"`)
      ).join('');

      preview.style.setProperty('--tag-color', color);
      previewLabel.textContent = name || 'Nome da etiqueta';
      saveBtn.disabled = !name || this._busy;
    },

    async _save() {
      const label = this._state.name.trim();
      if (!label || this._busy) return;
      this._busy = true;
      this._sync(this._view);
      const payload = {
        id: this._state.id,
        mode: this._state.mode,
        label,
        color: selectedColor(this._state),
        product: this._state.product,
      };
      try {
        await this._onSave?.(payload);
        this.close('save');
      } catch (error) {
        console.error('[Criar etiqueta] Erro ao salvar:', error?.message || error);
        this._busy = false;
        this._sync(this._view);
      }
    },
  };

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && form.isOpen()) {
      e.preventDefault();
      e.stopPropagation();
      form.close('cancel');
    }
  }, true);

  window.__tagCreateForm = form;
})();
