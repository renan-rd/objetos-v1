(function() {
  const ICON_PATHS = {
    pen: 'M13.0861 6.91356L17.0868 10.9143L8.39947 19.6016L4.83254 19.9953C4.35503 20.0482 3.95159 19.6444 4.00471 19.1669L4.4016 15.5975L13.0861 6.91356ZM19.5612 6.31793L17.6828 4.43946C17.0968 3.85351 16.1465 3.85351 15.5605 4.43946L13.7933 6.20668L17.794 10.2074L19.5612 8.44015C20.1472 7.85389 20.1472 6.90388 19.5612 6.31793Z',
    'caret-down': 'M8.53907 10H15.4609C15.9402 10 16.1803 10.6386 15.8414 11.0121L12.3804 14.8264C12.1703 15.0579 11.8297 15.0579 11.6196 14.8264L8.15866 11.0121C7.81973 10.6386 8.05978 10 8.53907 10Z',
    copy: 'M15 18.75V20C15 20.5 14.5 21 14 21H5.5C4.5 21 4 20.5 4 19.5V7C4 6.5 4.5 6 5 6H7.42857V16.7812C7.42857 17.8668 8.32575 18.75 9.42857 18.75H15ZM15.4286 6.65625V3H9.42857C8.95518 3 8.57143 3.37775 8.57143 3.84375V16.7812C8.57143 17.2472 8.95518 17.625 9.42857 17.625H19.1429C19.6163 17.625 20 17.2472 20 16.7812V7.5H16.2857C15.8143 7.5 15.4286 7.12031 15.4286 6.65625ZM19.749 5.56539L17.3939 3.24711C17.2332 3.08889 17.0151 3 16.7878 3H16.5714V6.375H20V6.16199C20 5.93822 19.9097 5.72362 19.749 5.56539Z',
    calendar: 'M4 19.3125C4 20.2441 4.76786 21 5.71429 21H18.2857C19.2321 21 20 20.2441 20 19.3125V9.75H4V19.3125ZM6.28571 12.5625C6.28571 12.2531 6.54286 12 6.85714 12H10.2857C10.6 12 10.8571 12.2531 10.8571 12.5625V15.9375C10.8571 16.2469 10.6 16.5 10.2857 16.5H6.85714C6.54286 16.5 6.28571 16.2469 6.28571 15.9375V12.5625ZM18.2857 5.25H16.5714V3.5625C16.5714 3.25312 16.3143 3 16 3H14.8571C14.5429 3 14.2857 3.25312 14.2857 3.5625V5.25H9.71429V3.5625C9.71429 3.25312 9.45714 3 9.14286 3H8C7.68571 3 7.42857 3.25312 7.42857 3.5625V5.25H5.71429C4.76786 5.25 4 6.00586 4 6.9375V8.625H20V6.9375C20 6.00586 19.2321 5.25 18.2857 5.25Z',
    'chevron-left': 'M7.91075 12.4663L13.2513 17.8068C13.5088 18.0644 13.9264 18.0644 14.1839 17.8068L14.8068 17.1839C15.064 16.9268 15.0645 16.5101 14.8079 16.2524L10.5755 12L14.8079 7.74765C15.0645 7.48991 15.064 7.07318 14.8068 6.81606L14.1839 6.19318C13.9264 5.93561 13.5088 5.93561 13.2513 6.19318L7.91078 11.5337C7.65321 11.7912 7.65321 12.2088 7.91075 12.4663Z',
    'chevron-right': 'M15.0892 12.4663L9.74874 17.8068C9.49117 18.0644 9.07359 18.0644 8.81605 17.8068L8.19317 17.1839C7.93604 16.9268 7.93555 16.5101 8.19207 16.2524L12.4245 12L8.19207 7.74765C7.93555 7.48991 7.93604 7.07318 8.19317 6.81606L8.81605 6.19318C9.07362 5.93561 9.4912 5.93561 9.74874 6.19318L15.0892 11.5337C15.3468 11.7912 15.3468 12.2088 15.0892 12.4663Z',
    times: 'M14.2745 12L17.686 8.58852C18.1047 8.16989 18.1047 7.49114 17.686 7.07216L16.9278 6.31398C16.5092 5.89534 15.8305 5.89534 15.4115 6.31398L12 9.72545L8.58852 6.31398C8.16989 5.89534 7.49114 5.89534 7.07216 6.31398L6.31398 7.07216C5.89534 7.4908 5.89534 8.16955 6.31398 8.58852L9.72545 12L6.31398 15.4115C5.89534 15.8301 5.89534 16.5089 6.31398 16.9278L7.07216 17.686C7.4908 18.1047 8.16989 18.1047 8.58852 17.686L12 14.2745L15.4115 17.686C15.8301 18.1047 16.5092 18.1047 16.9278 17.686L17.686 16.9278C18.1047 16.5092 18.1047 15.8305 17.686 15.4115L14.2745 12Z',
    'exclamation-circle': 'M21 12C21 16.9717 16.9702 21 12 21C7.02979 21 3 16.9717 3 12C3 7.03124 7.02979 3 12 3C16.9702 3 21 7.03124 21 12ZM12 13.8145C11.078 13.8145 10.3306 14.5619 10.3306 15.4839C10.3306 16.4058 11.078 17.1532 12 17.1532C12.922 17.1532 13.6694 16.4058 13.6694 15.4839C13.6694 14.5619 12.922 13.8145 12 13.8145ZM10.4151 7.81406L10.6843 12.7495C10.6969 12.9805 10.8878 13.1613 11.1191 13.1613H12.8809C13.1122 13.1613 13.3031 12.9805 13.3157 12.7495L13.5849 7.81406C13.5985 7.5646 13.3999 7.35484 13.1501 7.35484H10.8499C10.6001 7.35484 10.4015 7.5646 10.4151 7.81406Z',
  };

  function icon(name) {
    const d = ICON_PATHS[name];
    if (!d) return '';
    return `<svg class="inline-field__icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="${d}" fill="currentColor"/></svg>`;
  }

  const UF_OPTIONS = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
  ].map(uf => ({ value: uf, label: uf }));

  const COUNTRY_NAME_OPTIONS = [
    'Brasil', 'Argentina', 'Chile', 'Colômbia', 'México', 'Peru', 'Uruguai', 'Paraguai',
    'Bolívia', 'Equador', 'Venezuela', 'Estados Unidos', 'Portugal', 'Espanha',
    'Alemanha', 'França', 'Reino Unido', 'Itália',
  ].map(name => ({ value: name, label: name }));

  const INTEREST_OPTIONS = [
    { value: 'SUV', label: 'SUV' },
    { value: 'Sedan', label: 'Sedan' },
    { value: 'Hatch', label: 'Hatch' },
    { value: 'Pickup', label: 'Pickup' },
    { value: 'Van', label: 'Van' },
  ];

  const MONTHS = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const FIELD_TYPE = {
    data_nascimento: 'date',
    estado: 'select',
    pais: 'autocomplete',
    categoria_interesse: 'select',
    base_legal: 'select',
    telefone: 'phone',
    empresa_telefone: 'phone',
    empresa_site: 'text',
    email: 'text',
    cpf: 'text',
    rede_social_usuario: 'text',
  };

  const SKIP_INLINE_FIELDS = new Set(['nome', 'cargo', 'avatar']);

  let activeField = null;
  let toastTimer = null;

  function esc(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function tooltip(label) {
    return `<span class="inline-field__tooltip"><span class="inline-field__tooltip-box">${esc(label)}</span><span class="inline-field__tooltip-arrow"></span></span>`;
  }

  function pinActionTooltip(btn) {
    const tip = btn?._pinnedTooltip || btn?.querySelector('.inline-field__tooltip');
    if (!tip || !btn) return;
    if (tip.parentElement !== document.body) {
      btn._tooltipHome = tip.parentElement;
      document.body.appendChild(tip);
    }
    btn._pinnedTooltip = tip;
    const rect = btn.getBoundingClientRect();
    tip.style.left = `${Math.round(rect.left + rect.width / 2)}px`;
    tip.style.top = `${Math.round(rect.top)}px`;
    tip.classList.add('is-pinned');
  }

  function unpinActionTooltip(btn) {
    const tip = btn?._pinnedTooltip || btn?.querySelector('.inline-field__tooltip');
    if (!tip) return;
    tip.classList.remove('is-pinned');
    tip.style.left = '';
    tip.style.top = '';
    if (btn?._tooltipHome) {
      btn._tooltipHome.appendChild(tip);
      btn._tooltipHome = null;
    }
    if (btn) btn._pinnedTooltip = null;
  }

  function bindActionTooltip(btn) {
    if (!btn) return;
    btn.addEventListener('mouseenter', () => pinActionTooltip(btn));
    btn.addEventListener('mouseleave', () => unpinActionTooltip(btn));
    btn.addEventListener('focus', () => pinActionTooltip(btn));
    btn.addEventListener('blur', () => unpinActionTooltip(btn));
  }

  document.addEventListener('scroll', () => {
    document.querySelectorAll('.inline-field__action').forEach(btn => {
      if (!btn._pinnedTooltip) return;
      if (btn.matches(':hover, :focus-visible')) pinActionTooltip(btn);
      else unpinActionTooltip(btn);
    });
  }, true);

  function formatDateDisplay(iso) {
    if (!iso) return '';
    const [y, m, d] = String(iso).split('-');
    if (!y || !m || !d) return iso;
    return `${d}/${m}/${y}`;
  }

  function parseDateInput(text) {
    const t = (text || '').trim();
    const br = t.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (br) return `${br[3]}-${br[2]}-${br[1]}`;
    const iso = t.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) return t;
    return t;
  }

  function applyMask(value, mask) {
    const digits = String(value || '').replace(/\D/g, '');
    let result = '';
    let di = 0;
    for (let i = 0; i < mask.length && di < digits.length; i++) {
      result += mask[i] === '#' ? digits[di++] : mask[i];
    }
    return result;
  }

  function countries() {
    return window.__countries || [];
  }

  function countryForPhone(value) {
    const list = countries();
    if (typeof value !== 'string' || !value) return list[0] || null;
    const sorted = [...list].sort((a, b) => b.dial.length - a.dial.length);
    return sorted.find(c => value.startsWith(c.dial)) || list[0] || null;
  }

  function formatPhone(raw) {
    if (window.__formatProfilePhone) return window.__formatProfilePhone(raw);
    if (!raw) return '';
    const country = countryForPhone(raw);
    if (!country) return raw;
    const digits = raw.replace(country.dial, '').replace(/\D/g, '');
    return `${country.dial} ${applyMask(digits, country.mask)}`.trim();
  }

  function phoneValueHtml(raw, fallbackText) {
    const formatted = (raw && formatPhone(raw)) || fallbackText || '';
    if (!formatted || formatted === '—') return '—';
    const country = countryForPhone(typeof raw === 'string' ? raw : formatted);
    const dial = country?.dial || (formatted.match(/^\+\d+/) || [''])[0];
    if (dial && formatted.startsWith(dial)) {
      return `<span class="inline-field__ddi">${esc(dial)}</span>${esc(formatted.slice(dial.length))}`;
    }
    return esc(formatted);
  }

  function ensureToast() {
    let el = document.getElementById('inline-edit-toast');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'inline-edit-toast';
    el.className = 'inline-toast';
    el.setAttribute('role', 'alert');
    el.setAttribute('aria-live', 'assertive');
    el.innerHTML = `
      <div class="inline-toast__inner">
        <span class="inline-toast__icon" aria-hidden="true">${icon('exclamation-circle')}</span>
        <div class="inline-toast__content">
          <p class="inline-toast__title">Erro ao salvar</p>
          <p class="inline-toast__message">Ocorreu um erro ao salvar, tente novamente.</p>
        </div>
        <button type="button" class="inline-toast__close" aria-label="Fechar">${icon('times')}</button>
      </div>`;
    document.body.appendChild(el);
    el.querySelector('.inline-toast__close').addEventListener('click', hideToast);
    return el;
  }

  function hideToast() {
    const el = document.getElementById('inline-edit-toast');
    if (!el) return;
    el.classList.remove('is-visible');
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
  }

  function showSaveErrorToast(message) {
    const el = ensureToast();
    const title = el.querySelector('.inline-toast__title');
    const body = el.querySelector('.inline-toast__message');
    if (title) title.textContent = 'Erro ao salvar';
    if (body) body.textContent = message || 'Ocorreu um erro ao salvar, tente novamente.';
    el.classList.add('is-visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 5000);
  }

  function resolveType(item) {
    if (item.dataset.inlineType) return item.dataset.inlineType;
    const field = item.dataset.field;
    return FIELD_TYPE[field] || 'text';
  }

  function resolveOptions(item, type) {
    const field = item.dataset.field;
    if (field === 'estado') return UF_OPTIONS;
    if (field === 'pais') return COUNTRY_NAME_OPTIONS;
    if (field === 'categoria_interesse') return INTEREST_OPTIONS;
    if (field === 'base_legal') {
      return (window.__legalBasisPicker?.OPTIONS || []).map(opt => ({
        value: opt.key,
        label: opt.label,
      }));
    }
    if (Array.isArray(item._inlineOptions)) return item._inlineOptions;
    return type === 'select' || type === 'autocomplete' ? [] : null;
  }

  function getRawFromStore(item) {
    const field = item.dataset.field;
    const data = window.__profileFieldRaw || window.__profileIdentRaw || {};
    if (field === 'rede_social_usuario') {
      const index = parseInt(item.dataset.socialIndex || '0', 10) || 0;
      const socials = window.__profileContactSocials || [];
      const s = socials[index];
      if (index === 0) {
        return {
          rede: data.rede_social || s?.rede || 'instagram',
          usuario: data.rede_social_usuario ?? s?.usuario ?? '',
        };
      }
      return { rede: s?.rede || 'instagram', usuario: s?.usuario || '' };
    }
    if (field === 'base_legal') return item.dataset.baseLegal || '';
    if (field === 'categoria_interesse') {
      return item.querySelector('.inline-field__value, .profile-detail-value')?.textContent.trim() || '';
    }
    return data[field] ?? '';
  }

  function displayFromRaw(field, raw) {
    if (field === 'data_nascimento') return formatDateDisplay(raw) || '—';
    if (field === 'telefone' || field === 'empresa_telefone') return formatPhone(raw) || '—';
    if (field === 'rede_social_usuario') {
      const u = raw?.usuario || '';
      if (!u) return '—';
      return u.startsWith('@') ? u : '@' + u;
    }
    if (field === 'base_legal') {
      const OPTIONS = window.__legalBasisPicker?.OPTIONS || [];
      return OPTIONS.find(opt => opt.key === raw)?.label || raw || '—';
    }
    return raw || '—';
  }

  class InlineField {
    constructor(el, options = {}) {
      this.el = el;
      this.type = options.type || resolveType(el);
      this.field = el.dataset.field || options.field || '';
      this.options = options.options || resolveOptions(el, this.type) || [];
      this.originalRaw = null;
      this.editing = false;
      this.saving = false;
      this.calendarMonth = null;
      this.selectedCountry = this.type === 'phone'
        ? (countryForPhone(getRawFromStore(el)) || countries()[0] || null)
        : (countries()[0] || null);
      this._onDocClick = this._onDocClick.bind(this);
      this._onDocKey = this._onDocKey.bind(this);
      this._enhance();
      this._bind();
    }

    static bindItem(item, options) {
      if (!item || SKIP_INLINE_FIELDS.has(item.dataset.field)) return null;
      if (item.dataset.inlineBound === '1') {
        if (item._inlineField) item._inlineField.syncFromDom();
        return item._inlineField || null;
      }
      try {
        const field = new InlineField(item, options);
        item.dataset.inlineBound = '1';
        item._inlineField = field;
        return field;
      } catch (err) {
        console.error('[InlineField] falha ao ligar', item.dataset.field, err);
        return null;
      }
    }

    static mountCard(root) {
      const card = typeof root === 'string' ? document.querySelector(root) : root;
      if (!card) return [];
      const items = card.querySelectorAll(
        '.profile-detail-item[data-field], .profile-privacy-item[data-field], .profile-ident-item[data-field]'
      );
      return Array.from(items)
        .filter(item => !SKIP_INLINE_FIELDS.has(item.dataset.field))
        .map(item => InlineField.bindItem(item))
        .filter(Boolean);
    }

    syncFromDom() {
      const valueEl = this._valueEl();
      if (!valueEl || this.editing) return;
      if (this.type === 'phone' || this.field === 'telefone') {
        this._restoreDisplay(getRawFromStore(this.el) || valueEl.textContent.trim());
        return;
      }
      const text = valueEl.textContent.trim();
      valueEl.classList.toggle('is-empty', !text || text === '—');
    }

    _valueEl() {
      return this.el.querySelector('.inline-field__value')
        || this.el.querySelector('.profile-detail-value, .profile-privacy-value, .profile-ident-value');
    }

    _inputEl() {
      return this.el.querySelector('.inline-field__input');
    }

    _enhance() {
      const item = this.el;
      item.classList.add('inline-field');
      item.dataset.inlineType = this.type;

      const label = item.querySelector('.profile-detail-label, .inline-field__label');
      if (label) label.classList.add('inline-field__label');

      let row = item.querySelector('.profile-detail-value-row, .profile-privacy-value-row, .inline-field__control');
      const existingValue = item.querySelector('.profile-detail-value, .profile-privacy-value, .profile-ident-value, .inline-field__value');
      const currentText = existingValue?.textContent.trim() || '—';
      const valueId = existingValue?.id ? ` id="${esc(existingValue.id)}"` : '';

      if (!row) {
        row = document.createElement('div');
        item.appendChild(row);
      }
      row.className = 'inline-field__control';

      const leading = this._leadingHtml();
      const actions = this._actionsHtml();
      const valueKind = item.classList.contains('profile-privacy-item')
        ? 'profile-privacy-value'
        : item.classList.contains('profile-ident-item')
          ? 'profile-ident-value'
          : 'profile-detail-value';
      const valueInner = (this.type === 'phone' || this.field === 'telefone')
        ? phoneValueHtml(getRawFromStore(item), currentText)
        : esc(currentText);
      const valueHtml = `<span class="inline-field__value ${valueKind}${(!currentText || currentText === '—') ? ' is-empty' : ''}"${valueId}>${valueInner}</span>`;
      const inputHtml = this.type === 'phone'
        ? `<div class="inline-field__phone-text" hidden>
            <span class="inline-field__dial">${esc(this.selectedCountry?.dial || '+55')}</span>
            <input class="inline-field__input" type="text" autocomplete="off" inputmode="tel">
          </div>`
        : `<input class="inline-field__input" type="text" autocomplete="off" hidden>`;

      row.innerHTML = `${leading}${valueHtml}${inputHtml}${actions}`;

      if (item.classList.contains('profile-ident-item')) {
        Array.from(item.children).forEach(child => {
          if (child === row) return;
          if (child.classList.contains('inline-field__helper')) return;
          if (child.classList.contains('inline-field__menu')) return;
          if (child.classList.contains('inline-field__datepicker')) return;
          child.remove();
        });
      }

      if (!item.querySelector('.inline-field__helper')) {
        const helper = document.createElement('p');
        helper.className = 'inline-field__helper';
        item.appendChild(helper);
      }

      if (this.type === 'select' || this.type === 'autocomplete' || this.type === 'phone') {
        if (!item.querySelector('.inline-field__menu')) {
          const menu = document.createElement('div');
          menu.className = 'inline-field__menu';
          if (this.type === 'phone') menu.classList.add('inline-field__country-menu');
          item.appendChild(menu);
        }
      }

      if (this.type === 'date' && !item.querySelector('.inline-field__datepicker')) {
        const dp = document.createElement('div');
        dp.className = 'inline-field__datepicker';
        item.appendChild(dp);
      }
    }

    _leadingHtml() {
      if (this.type === 'date') {
        return `<span class="inline-field__leading"><span class="inline-field__calendar-icon">${icon('calendar')}</span></span>`;
      }
      if (this.type === 'phone') {
        const country = this.selectedCountry || countries()[0];
        return `<span class="inline-field__leading">
          <button type="button" class="inline-field__flag-trigger" aria-label="Selecionar país">
            <span class="inline-field__flag">${country?.flag || ''}</span>
            <span class="inline-field__caret">${icon('caret-down')}</span>
          </button>
        </span>`;
      }
      return '';
    }

    _actionsHtml() {
      const caret = (this.type === 'select' || this.type === 'autocomplete' || this.type === 'date')
        ? `<button type="button" class="inline-field__action inline-field__action--caret" aria-label="Abrir lista">${icon('caret-down')}</button>`
        : '';
      return `<div class="inline-field__actions">
        <button type="button" class="inline-field__action inline-field__action--edit" aria-label="Editar">${icon('pen')}${tooltip('Editar')}</button>
        <button type="button" class="inline-field__action inline-field__action--copy" aria-label="Copiar">${icon('copy')}${tooltip('Copiar')}</button>
        ${caret}
      </div>`;
    }

    _bind() {
      const item = this.el;
      const valueEl = this._valueEl();
      const editBtn = item.querySelector('.inline-field__action--edit');
      const copyBtn = item.querySelector('.inline-field__action--copy');
      const caretBtn = item.querySelector('.inline-field__action--caret');
      const input = this._inputEl();
      const flagBtn = item.querySelector('.inline-field__flag-trigger');

      const open = (evt) => {
        evt?.preventDefault();
        evt?.stopPropagation();
        this.enter();
      };

      valueEl?.addEventListener('click', open);
      editBtn?.addEventListener('click', open);
      caretBtn?.addEventListener('click', open);
      bindActionTooltip(editBtn);
      bindActionTooltip(copyBtn);
      item.querySelector('.inline-field__calendar-icon')?.addEventListener('click', open);

      copyBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.copy();
      });

      flagBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.enter();
        this._toggleCountryMenu();
      });

      input?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.commit();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          this.cancel();
        } else if (e.key === 'ArrowDown' && (this.type === 'autocomplete' || this.type === 'select')) {
          e.preventDefault();
          this._moveOption(1);
        } else if (e.key === 'ArrowUp' && (this.type === 'autocomplete' || this.type === 'select')) {
          e.preventDefault();
          this._moveOption(-1);
        }
      });

      input?.addEventListener('input', () => {
        if (this.type === 'phone' && this.selectedCountry) {
          input.value = applyMask(input.value, this.selectedCountry.mask);
        }
        if (this.field === 'cpf') {
          input.value = applyMask(input.value, '###.###.###-##');
        }
        if (this.type === 'autocomplete') this._renderMenu(input.value);
        if (this.type === 'date') this._renderCalendar(parseDateInput(input.value));
      });
    }

    async enter() {
      if (this.editing) {
        if (this.type === 'select' || this.type === 'autocomplete') this._renderMenu(this._inputEl()?.value || '');
        if (this.type === 'date') this._renderCalendar(this.originalRaw);
        return;
      }
      if (activeField && activeField !== this) await activeField.commit();

      this.originalRaw = getRawFromStore(this.el);
      if (this.field === 'categoria_interesse' && (!this.originalRaw || this.originalRaw === '—')) {
        this.originalRaw = this._valueEl()?.textContent.trim() || '';
      }
      if ((this.field === 'telefone' || this.type === 'phone') && !this.originalRaw) {
        const shown = this._valueEl()?.textContent.trim();
        this.originalRaw = shown && shown !== '—' ? shown.replace(/\s/g, '') : '';
      }

      this.editing = true;
      this.el.classList.add('is-editing');
      this.el.classList.remove('is-error');
      this._setHelper('');
      activeField = this;

      const valueEl = this._valueEl();
      const input = this._inputEl();
      const phoneWrap = this.el.querySelector('.inline-field__phone-text');
      valueEl.hidden = true;
      if (phoneWrap) phoneWrap.hidden = false;
      if (input) input.hidden = false;

      if (this.type === 'phone') {
        this._applyCountry(countryForPhone(this.originalRaw));
        const country = this.selectedCountry;
        const digits = country && this.originalRaw
          ? String(this.originalRaw).replace(country.dial, '').replace(/\D/g, '')
          : String(this.originalRaw || '').replace(/\D/g, '');
        input.value = country ? applyMask(digits, country.mask) : digits;
      } else if (this.type === 'date') {
        input.value = formatDateDisplay(this.originalRaw);
        this._renderCalendar(this.originalRaw);
      } else if (this.field === 'rede_social_usuario') {
        const u = this.originalRaw?.usuario || '';
        input.value = u ? (u.startsWith('@') ? u : '@' + u) : '';
      } else if (this.type === 'select' || this.type === 'autocomplete') {
        const match = this.options.find(opt => opt.value === this.originalRaw);
        input.value = match?.label || (this.originalRaw && this.originalRaw !== '—' ? this.originalRaw : '');
        this._renderMenu(this.type === 'autocomplete' ? input.value : '');
      } else {
        const shown = valueEl.textContent.trim();
        input.value = shown === '—' ? '' : shown;
      }

      input.focus();
      if (this.type === 'text' || this.type === 'autocomplete' || this.type === 'phone') input.select();

      document.addEventListener('mousedown', this._onDocClick);
      document.addEventListener('keydown', this._onDocKey);
    }

    cancel() {
      this._restoreDisplay(this.originalRaw);
      this.exit();
    }

    async commit() {
      if (!this.editing || this.saving) return;
      const nextRaw = this._readRaw();
      if (this._equals(nextRaw, this.originalRaw)) {
        this.exit();
        return;
      }

      const invalid = this._validate(nextRaw);
      if (invalid) {
        this._setError(invalid);
        return;
      }

      this.saving = true;
      const previous = this.originalRaw;
      try {
        await this._persist(nextRaw);
        this._restoreDisplay(nextRaw);
        this.exit();
      } catch (err) {
        this._restoreDisplay(previous);
        this.exit();
        showSaveErrorToast(err?.message || 'Ocorreu um erro ao salvar, tente novamente.');
      } finally {
        this.saving = false;
      }
    }

    exit() {
      this.editing = false;
      this.el.classList.remove('is-editing', 'is-error');
      this._setHelper('');
      const valueEl = this._valueEl();
      const input = this._inputEl();
      const phoneWrap = this.el.querySelector('.inline-field__phone-text');
      if (valueEl) valueEl.hidden = false;
      if (phoneWrap) phoneWrap.hidden = true;
      if (input) input.hidden = true;
      this._closeOverlays();
      document.removeEventListener('mousedown', this._onDocClick);
      document.removeEventListener('keydown', this._onDocKey);
      if (activeField === this) activeField = null;
    }

    copy() {
      const text = this._valueEl()?.textContent.trim() || '';
      if (!text || text === '—') return;
      navigator.clipboard.writeText(text).then(() => {
        const btn = this.el.querySelector('.inline-field__action--copy');
        if (!btn) return;
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 1200);
      });
    }

    _readRaw() {
      const input = this._inputEl();
      const typed = (input?.value || '').trim();
      if (this.type === 'phone') {
        const digits = typed.replace(/\D/g, '');
        if (!digits) return '';
        return (this.selectedCountry?.dial || '') + digits;
      }
      if (this.field === 'cpf') {
        const digits = typed.replace(/\D/g, '');
        if (!digits) return '';
        return applyMask(digits, '###.###.###-##');
      }
      if (this.type === 'date') return parseDateInput(typed);
      if (this.field === 'rede_social_usuario') {
        const rede = this.originalRaw?.rede || this.el.dataset.socialRede || 'instagram';
        return { rede, usuario: typed.replace(/^@/, '') };
      }
      if (this.type === 'select' || this.type === 'autocomplete') {
        const match = this.options.find(opt =>
          opt.label.toLowerCase() === typed.toLowerCase() || opt.value === typed
        );
        return match ? match.value : typed;
      }
      return typed;
    }

    _validate(raw) {
      if (this.field === 'data_nascimento' && raw) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return 'Insira uma data válida.';
      }
      if (this.field === 'email' && raw && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
        return 'Digite um e-mail válido.';
      }
      return '';
    }

    _equals(a, b) {
      if (this.field === 'rede_social_usuario') {
        return (a?.rede || '') === (b?.rede || '') && (a?.usuario || '') === (b?.usuario || '');
      }
      return (a || '') === (b || '');
    }

    _restoreDisplay(raw) {
      const valueEl = this._valueEl();
      if (!valueEl) return;
      if (this.type === 'phone' || this.field === 'telefone') {
        const display = formatPhone(raw) || '';
        valueEl.innerHTML = phoneValueHtml(raw, display);
        valueEl.classList.toggle('is-empty', !display || display === '—');
        this._applyCountry(countryForPhone(raw));
        return;
      }
      const display = displayFromRaw(this.field, raw);
      valueEl.textContent = display || '—';
      valueEl.classList.toggle('is-empty', !display || display === '—');
      if (this.field === 'base_legal') this.el.dataset.baseLegal = raw || '';
    }

    _setError(message) {
      this.el.classList.add('is-error');
      this._setHelper(message);
    }

    _setHelper(message) {
      const helper = this.el.querySelector('.inline-field__helper');
      if (helper) helper.textContent = message || '';
    }

    async _persist(raw) {
      if (this.field === 'categoria_interesse') return;

      const db = window.__profileDb;
      const contactId = window.__profileContactId;
      if (!db || !contactId) throw new Error('Não foi possível salvar. Tente novamente.');

      if (this.field === 'base_legal') {
        const canal = this.el.dataset.canal || '';
        if (!canal || !raw) throw new Error('Selecione uma base legal.');
        const { error } = await db.from('claude_contato_bases_legais').upsert({
          contato_id: contactId,
          canal,
          base_legal: raw,
          status: 'opt_in',
          atualizado_em: new Date().toISOString(),
        }, { onConflict: 'contato_id,canal' });
        if (error) throw error;
        return;
      }

      if (this.field === 'empresa_site' || this.field === 'empresa_telefone') {
        const empresaId = window.__profileFieldRaw?.empresa_id;
        if (!empresaId) throw new Error('Não foi possível salvar. Tente novamente.');
        const column = this.field === 'empresa_site' ? 'site' : 'telefone';
        const { error } = await db.from('claude_empresas').update({ [column]: raw || null }).eq('id', empresaId);
        if (error) throw error;
        if (!window.__profileFieldRaw) window.__profileFieldRaw = {};
        window.__profileFieldRaw[this.field] = raw;
        window.__profileIdentRaw = window.__profileFieldRaw;
        return;
      }

      let payload = {};
      if (this.field === 'rede_social_usuario') {
        const index = parseInt(this.el.dataset.socialIndex || '0', 10) || 0;
        const socials = [...(window.__profileContactSocials || [])];
        while (socials.length <= index) socials.push({ rede: 'instagram', usuario: '' });
        socials[index] = raw;
        const filtered = socials.filter(s => s && s.usuario);
        payload = {
          rede_social: filtered[0]?.rede || null,
          rede_social_usuario: filtered[0]?.usuario || null,
          redes_sociais: filtered,
        };
      } else {
        payload = { [this.field]: raw || null };
      }

      const { error } = await db.from('claude_contatos').update(payload).eq('id', contactId);
      if (error) throw error;

      if (!window.__profileFieldRaw) window.__profileFieldRaw = {};
      if (this.field === 'rede_social_usuario') {
        window.__profileContactSocials = payload.redes_sociais || [];
        if ((parseInt(this.el.dataset.socialIndex || '0', 10) || 0) === 0) {
          window.__profileFieldRaw.rede_social = raw.rede;
          window.__profileFieldRaw.rede_social_usuario = raw.usuario;
        }
        window.__refreshProfileSocials?.();
      } else {
        window.__profileFieldRaw[this.field] = raw;
      }
      window.__profileIdentRaw = window.__profileFieldRaw;
    }

    _renderMenu(query) {
      const menu = this.el.querySelector('.inline-field__menu');
      if (!menu) return;
      const q = (query || '').toLowerCase();
      const list = this.type === 'autocomplete'
        ? this.options.filter(opt => opt.label.toLowerCase().includes(q) || String(opt.value).toLowerCase().includes(q))
        : this.options;

      if (!list.length) {
        menu.innerHTML = '<div class="inline-field__empty">Nenhuma opção encontrada</div>';
        menu.classList.add('is-open');
        return;
      }

      const current = this._readRaw();
      menu.innerHTML = list.map(opt =>
        `<div class="inline-field__option${opt.value === current ? ' is-selected' : ''}" data-value="${esc(opt.value)}">${esc(opt.label)}</div>`
      ).join('');
      menu.querySelectorAll('.inline-field__option').forEach(optEl => {
        optEl.addEventListener('mousedown', (e) => {
          e.preventDefault();
          this._pickOption(optEl.dataset.value);
        });
      });
      menu.classList.add('is-open');
    }

    _pickOption(value) {
      const input = this._inputEl();
      const match = this.options.find(opt => opt.value === value);
      if (input) input.value = match?.label || value;
      this.commit();
    }

    _moveOption(dir) {
      const menu = this.el.querySelector('.inline-field__menu');
      if (!menu?.classList.contains('is-open')) {
        this._renderMenu(this._inputEl()?.value || '');
        return;
      }
      const items = Array.from(menu.querySelectorAll('.inline-field__option'));
      if (!items.length) return;
      const current = items.findIndex(el => el.classList.contains('is-active'));
      const next = items[(current + dir + items.length) % items.length];
      items.forEach(el => el.classList.remove('is-active'));
      next.classList.add('is-active');
      next.scrollIntoView({ block: 'nearest' });
    }

    _toggleCountryMenu() {
      const menu = this.el.querySelector('.inline-field__menu');
      if (!menu) return;
      if (menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        return;
      }
      const list = countries();
      menu.innerHTML = list.map(c =>
        `<div class="inline-field__option inline-field__country-item${c.code === this.selectedCountry?.code ? ' is-selected' : ''}" data-code="${c.code}">
          <span class="item-flag">${c.flag}</span>
          <span class="item-name">${esc(c.name)}</span>
          <span class="item-code">${esc(c.dial)}</span>
        </div>`
      ).join('');
      menu.querySelectorAll('[data-code]').forEach(optEl => {
        optEl.addEventListener('mousedown', (e) => {
          e.preventDefault();
          const country = list.find(c => c.code === optEl.dataset.code);
          if (country) this._applyCountry(country);
          menu.classList.remove('is-open');
          this._inputEl()?.focus();
        });
      });
      menu.classList.add('is-open');
    }

    _applyCountry(country) {
      if (!country) return;
      this.selectedCountry = country;
      const flag = this.el.querySelector('.inline-field__flag');
      const dial = this.el.querySelector('.inline-field__dial');
      if (flag) flag.innerHTML = country.flag;
      if (dial) dial.textContent = country.dial;
      const input = this._inputEl();
      if (input && this.editing) {
        input.value = applyMask(input.value, country.mask);
        input.placeholder = country.mask.replace(/#/g, '9');
      }
    }

    _renderCalendar(iso) {
      const dp = this.el.querySelector('.inline-field__datepicker');
      if (!dp) return;
      const selected = iso && /^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso : '';
      const base = selected ? new Date(`${selected}T00:00:00`) : new Date();
      if (!this.calendarMonth) {
        this.calendarMonth = new Date(base.getFullYear(), base.getMonth(), 1);
      }
      const year = this.calendarMonth.getFullYear();
      const month = this.calendarMonth.getMonth();
      const firstDow = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const prevDays = new Date(year, month, 0).getDate();

      const cells = [];
      for (let i = 0; i < 42; i++) {
        let day;
        let cellMonth = month;
        let cellYear = year;
        let outside = false;
        if (i < firstDow) {
          day = prevDays - firstDow + 1 + i;
          cellMonth = month - 1;
          if (cellMonth < 0) { cellMonth = 11; cellYear -= 1; }
          outside = true;
        } else if (i >= firstDow + daysInMonth) {
          day = i - firstDow - daysInMonth + 1;
          cellMonth = month + 1;
          if (cellMonth > 11) { cellMonth = 0; cellYear += 1; }
          outside = true;
        } else {
          day = i - firstDow + 1;
        }
        const value = `${cellYear}-${String(cellMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        cells.push({ day, value, outside, selected: value === selected });
      }

      dp.innerHTML = `
        <div class="inline-field__dp-head">
          <button type="button" class="inline-field__dp-nav" data-nav="-1" aria-label="Mês anterior">${icon('chevron-left')}</button>
          <div class="inline-field__dp-title">${MONTHS[month]} ${year}</div>
          <button type="button" class="inline-field__dp-nav" data-nav="1" aria-label="Próximo mês">${icon('chevron-right')}</button>
        </div>
        <div class="inline-field__dp-week">${WEEKDAYS.map(d => `<span>${d}</span>`).join('')}</div>
        <div class="inline-field__dp-grid">
          ${cells.map(c =>
            `<button type="button" class="inline-field__dp-day${c.outside ? ' is-outside' : ''}${c.selected ? ' is-selected' : ''}" data-date="${c.value}">${c.day}</button>`
          ).join('')}
        </div>`;

      dp.querySelectorAll('[data-nav]').forEach(btn => {
        btn.addEventListener('mousedown', (e) => {
          e.preventDefault();
          const dir = parseInt(btn.dataset.nav, 10);
          this.calendarMonth = new Date(year, month + dir, 1);
          this._renderCalendar(selected);
        });
      });
      dp.querySelectorAll('[data-date]').forEach(btn => {
        btn.addEventListener('mousedown', (e) => {
          e.preventDefault();
          const input = this._inputEl();
          if (input) input.value = formatDateDisplay(btn.dataset.date);
          this.commit();
        });
      });
      dp.classList.add('is-open');
    }

    _closeOverlays() {
      this.el.querySelector('.inline-field__menu')?.classList.remove('is-open');
      this.el.querySelector('.inline-field__datepicker')?.classList.remove('is-open');
      this.calendarMonth = null;
    }

    _onDocClick(e) {
      if (this.el.contains(e.target)) return;
      this.commit();
    }

    _onDocKey(e) {
      if (e.key === 'Escape') this.cancel();
    }
  }

  function wrapPrivacyBinder() {
    const prev = window.__bindProfilePrivacyItem;
    window.__bindProfilePrivacyItem = function(item) {
      if (item?.closest('#profile-more-info-card')) {
        InlineField.bindItem(item, { type: 'select' });
        return;
      }
      prev?.(item);
    };
  }

  function wrapSocialBinder() {
    const prev = window.__bindProfileSocialItem;
    window.__bindProfileSocialItem = function(item) {
      if (item?.closest('#profile-more-info-card')) {
        InlineField.bindItem(item, { type: 'text' });
        return;
      }
      prev?.(item);
    };
  }

  function init() {
    wrapPrivacyBinder();
    wrapSocialBinder();
    InlineField.mountCard('#profile-more-info-card');
    InlineField.mountCard('#profile-contact-card');
    InlineField.mountCard('#profile-company-card');
  }

  window.InlineField = InlineField;
  window.__showInlineSaveError = showSaveErrorToast;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
