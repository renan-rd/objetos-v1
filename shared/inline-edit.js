(function() {
  const ICON_PATHS = {
    pen: 'M13.0861 6.91356L17.0868 10.9143L8.39947 19.6016L4.83254 19.9953C4.35503 20.0482 3.95159 19.6444 4.00471 19.1669L4.4016 15.5975L13.0861 6.91356ZM19.5612 6.31793L17.6828 4.43946C17.0968 3.85351 16.1465 3.85351 15.5605 4.43946L13.7933 6.20668L17.794 10.2074L19.5612 8.44015C20.1472 7.85389 20.1472 6.90388 19.5612 6.31793Z',
    'caret-down': 'M8.53907 10H15.4609C15.9402 10 16.1803 10.6386 15.8414 11.0121L12.3804 14.8264C12.1703 15.0579 11.8297 15.0579 11.6196 14.8264L8.15866 11.0121C7.81973 10.6386 8.05978 10 8.53907 10Z',
    copy: 'M9.42857 1C8.24665 1 7.28571 2.00898 7.28571 3.25V12.25C7.28571 13.491 8.24665 14.5 9.42857 14.5H15.8571C17.0391 14.5 18 13.491 18 12.25V5.19766C18 4.58594 17.7623 3.99883 17.3404 3.57344L15.4085 1.62578C15.01 1.225 14.4777 1 13.9252 1H9.42857ZM5.14286 5.5C3.96094 5.5 3 6.50898 3 7.75V16.75C3 17.991 3.96094 19 5.14286 19H11.5714C12.7533 19 13.7143 17.991 13.7143 16.75V16.1875H11.5714V16.75H5.14286V7.75H5.67857V5.5H5.14286Z',
    calendar: 'M4 19.3125C4 20.2441 4.76786 21 5.71429 21H18.2857C19.2321 21 20 20.2441 20 19.3125V9.75H4V19.3125ZM6.28571 12.5625C6.28571 12.2531 6.54286 12 6.85714 12H10.2857C10.6 12 10.8571 12.2531 10.8571 12.5625V15.9375C10.8571 16.2469 10.6 16.5 10.2857 16.5H6.85714C6.54286 16.5 6.28571 16.2469 6.28571 15.9375V12.5625ZM18.2857 5.25H16.5714V3.5625C16.5714 3.25312 16.3143 3 16 3H14.8571C14.5429 3 14.2857 3.25312 14.2857 3.5625V5.25H9.71429V3.5625C9.71429 3.25312 9.45714 3 9.14286 3H8C7.68571 3 7.42857 3.25312 7.42857 3.5625V5.25H5.71429C4.76786 5.25 4 6.00586 4 6.9375V8.625H20V6.9375C20 6.00586 19.2321 5.25 18.2857 5.25Z',
    'chevron-left': 'M7.91075 12.4663L13.2513 17.8068C13.5088 18.0644 13.9264 18.0644 14.1839 17.8068L14.8068 17.1839C15.064 16.9268 15.0645 16.5101 14.8079 16.2524L10.5755 12L14.8079 7.74765C15.0645 7.48991 15.064 7.07318 14.8068 6.81606L14.1839 6.19318C13.9264 5.93561 13.5088 5.93561 13.2513 6.19318L7.91078 11.5337C7.65321 11.7912 7.65321 12.2088 7.91075 12.4663Z',
    'chevron-right': 'M15.0892 12.4663L9.74874 17.8068C9.49117 18.0644 9.07359 18.0644 8.81605 17.8068L8.19317 17.1839C7.93604 16.9268 7.93555 16.5101 8.19207 16.2524L12.4245 12L8.19207 7.74765C7.93555 7.48991 7.93604 7.07318 8.19317 6.81606L8.81605 6.19318C9.07362 5.93561 9.4912 5.93561 9.74874 6.19318L15.0892 11.5337C15.3468 11.7912 15.3468 12.2088 15.0892 12.4663Z',
    times: 'M14.2745 12L17.686 8.58852C18.1047 8.16989 18.1047 7.49114 17.686 7.07216L16.9278 6.31398C16.5092 5.89534 15.8305 5.89534 15.4115 6.31398L12 9.72545L8.58852 6.31398C8.16989 5.89534 7.49114 5.89534 7.07216 6.31398L6.31398 7.07216C5.89534 7.4908 5.89534 8.16955 6.31398 8.58852L9.72545 12L6.31398 15.4115C5.89534 15.8301 5.89534 16.5089 6.31398 16.9278L7.07216 17.686C7.4908 18.1047 8.16989 18.1047 8.58852 17.686L12 14.2745L15.4115 17.686C15.8301 18.1047 16.5092 18.1047 16.9278 17.686L17.686 16.9278C18.1047 16.5092 18.1047 15.8305 17.686 15.4115L14.2745 12Z',
    plus: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
    'exclamation-circle': 'M21 12C21 16.9717 16.9702 21 12 21C7.02979 21 3 16.9717 3 12C3 7.03124 7.02979 3 12 3C16.9702 3 21 7.03124 21 12ZM12 13.8145C11.078 13.8145 10.3306 14.5619 10.3306 15.4839C10.3306 16.4058 11.078 17.1532 12 17.1532C12.922 17.1532 13.6694 16.4058 13.6694 15.4839C13.6694 14.5619 12.922 13.8145 12 13.8145ZM10.4151 7.81406L10.6843 12.7495C10.6969 12.9805 10.8878 13.1613 11.1191 13.1613H12.8809C13.1122 13.1613 13.3031 12.9805 13.3157 12.7495L13.5849 7.81406C13.5985 7.5646 13.3999 7.35484 13.1501 7.35484H10.8499C10.6001 7.35484 10.4015 7.5646 10.4151 7.81406Z',
  };

  function icon(name) {
    const d = ICON_PATHS[name];
    if (!d) return '';
    const box = name === 'copy' ? 20 : 24;
    return `<svg class="inline-field__icon" width="${box}" height="${box}" viewBox="0 0 ${box} ${box}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="${d}" fill="currentColor"/></svg>`;
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
    cidade: 'autocomplete',
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

  const SKIP_INLINE_FIELDS = new Set(['nome', 'avatar']);

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
    if (field === 'cidade') {
      const capitals = [
        'Aracaju', 'Belém', 'Belo Horizonte', 'Boa Vista', 'Brasília', 'Campo Grande',
        'Cuiabá', 'Curitiba', 'Florianópolis', 'Fortaleza', 'Goiânia', 'João Pessoa',
        'Macapá', 'Maceió', 'Manaus', 'Natal', 'Palmas', 'Porto Alegre', 'Porto Velho',
        'Recife', 'Rio Branco', 'Rio de Janeiro', 'Salvador', 'São Luís', 'São Paulo',
        'Teresina', 'Vitória',
      ];
      const current = getRawFromStore(item);
      if (current && !capitals.includes(current)) capitals.unshift(current);
      return capitals.map(value => ({ value, label: value }));
    }
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

  function getEmailsList() {
    const data = window.__profileFieldRaw || window.__profileIdentRaw || {};
    if (Array.isArray(data.emails) && data.emails.length) {
      return data.emails.map(email => String(email || '').trim()).filter(Boolean);
    }
    if (data.email) return [String(data.email).trim()].filter(Boolean);
    return [];
  }

  function emailIndexOf(item) {
    return parseInt(item?.dataset.emailIndex || '0', 10) || 0;
  }

  function reindexEmailRows() {
    const container = document.getElementById('profile-email-values');
    if (!container) return;
    container.querySelectorAll('.profile-ident-item[data-field="email"]').forEach((el, i) => {
      el.dataset.emailIndex = String(i);
    });
  }

  function createEmailItem(value, index, draft) {
    const row = document.createElement('div');
    row.className = 'overview-info-item profile-ident-item';
    row.dataset.field = 'email';
    row.dataset.emailIndex = String(index);
    if (draft) row.dataset.emailDraft = '1';
    row.innerHTML = `<span class="profile-ident-value">${value ? esc(value) : ''}</span>`;
    return row;
  }

  function syncProfileEmails(emails) {
    const container = document.getElementById('profile-email-values');
    if (!container) return;
    const list = (emails || []).map(email => String(email || '').trim()).filter(Boolean);
    const items = [...container.querySelectorAll('.profile-ident-item[data-field="email"]')];
    const primary = items.find(el => emailIndexOf(el) === 0) || items[0];
    items.forEach(el => {
      if (el !== primary) el.remove();
    });
    if (primary) {
      primary.dataset.emailIndex = '0';
      delete primary.dataset.emailDraft;
    }
    list.slice(1).forEach((email, i) => {
      const row = createEmailItem(email, i + 1, false);
      container.appendChild(row);
      InlineField.bindItem(row);
    });
  }

  function addDraftEmailRow() {
    const container = document.getElementById('profile-email-values');
    if (!container) return;
    const existingDraft = container.querySelector('.profile-ident-item[data-email-draft="1"]');
    if (existingDraft) {
      existingDraft._inlineField?.enter();
      return;
    }
    const index = container.querySelectorAll('.profile-ident-item[data-field="email"]').length;
    const row = createEmailItem('', index, true);
    container.appendChild(row);
    const field = InlineField.bindItem(row);
    field?.enter();
  }

  function bindAddEmailButton() {
    const btn = document.getElementById('profile-add-email-btn');
    if (!btn || btn.dataset.bound === '1') return;
    btn.dataset.bound = '1';
    if (!btn.querySelector('svg')) {
      btn.insertAdjacentHTML('afterbegin', icon('plus'));
    }
    btn.addEventListener('click', () => addDraftEmailRow());
  }

  const PHONE_TYPE_OPTIONS = [
    { value: 'Residencial', label: 'Residencial' },
    { value: 'Escritório', label: 'Escritório' },
    { value: 'Comercial', label: 'Comercial' },
    { value: 'Recado', label: 'Recado' },
  ];
  const DEFAULT_PHONE_TYPE = 'Residencial';

  function normalizePhoneEntry(item) {
    if (!item) return null;
    if (typeof item === 'object') {
      const numero = String(item.numero || item.telefone || '').trim();
      if (!numero) return null;
      const tipo = PHONE_TYPE_OPTIONS.some(opt => opt.value === item.tipo) ? item.tipo : DEFAULT_PHONE_TYPE;
      return { numero, tipo };
    }
    const numero = String(item).trim();
    return numero ? { numero, tipo: DEFAULT_PHONE_TYPE } : null;
  }

  function normalizePhones(source) {
    const data = source || window.__profileFieldRaw || window.__profileIdentRaw || {};
    const list = Array.isArray(data.telefones) && data.telefones.length
      ? data.telefones
      : (data.telefone ? [data.telefone] : []);
    return list.map(normalizePhoneEntry).filter(Boolean);
  }

  function getPhonesList() {
    return normalizePhones();
  }

  function normalizeEmpresaPhones(source) {
    const data = source || window.__profileFieldRaw || window.__profileIdentRaw || {};
    const list = Array.isArray(data.empresa_telefones) && data.empresa_telefones.length
      ? data.empresa_telefones
      : (data.empresa_telefone
        ? [{ numero: data.empresa_telefone, tipo: data.empresa_telefone_tipo || 'Comercial' }]
        : []);
    return list.map(item => {
      const phone = normalizePhoneEntry(item);
      if (!phone) return null;
      if (typeof item !== 'object' && data.empresa_telefone_tipo) {
        phone.tipo = PHONE_TYPE_OPTIONS.some(opt => opt.value === data.empresa_telefone_tipo)
          ? data.empresa_telefone_tipo
          : phone.tipo;
      }
      return phone;
    }).filter(Boolean);
  }

  function getEmpresaPhonesList() {
    return normalizeEmpresaPhones();
  }

  function isEmpresaPhone(item) {
    return item?.dataset.field === 'empresa_telefone';
  }

  function phoneContainer(item) {
    return isEmpresaPhone(item)
      ? document.getElementById('profile-empresa-phone-values')
      : document.getElementById('profile-phone-values');
  }

  function phoneIndexOf(item) {
    return parseInt(item?.dataset.phoneIndex || '0', 10) || 0;
  }

  function reindexPhoneRows(item) {
    const container = item ? phoneContainer(item) : document.getElementById('profile-phone-values');
    if (!container) return;
    const field = item && isEmpresaPhone(item) ? 'empresa_telefone' : 'telefone';
    container.querySelectorAll(`.profile-ident-item[data-field="${field}"]`).forEach((el, i) => {
      el.dataset.phoneIndex = String(i);
    });
  }

  function isTypedPhoneField(field) {
    return field === 'telefone' || field === 'empresa_telefone';
  }

  function phoneTypeOf(item) {
    const labeled = item?.querySelector('.inline-field__type-label')?.textContent.trim();
    if (PHONE_TYPE_OPTIONS.some(opt => opt.value === labeled)) return labeled;
    if (PHONE_TYPE_OPTIONS.some(opt => opt.value === item?.dataset.phoneTipo)) return item.dataset.phoneTipo;
    if (isEmpresaPhone(item)) {
      return getEmpresaPhonesList()[phoneIndexOf(item)]?.tipo || 'Comercial';
    }
    return getPhonesList()[phoneIndexOf(item)]?.tipo || DEFAULT_PHONE_TYPE;
  }

  function createPhoneItem(phone, index, draft, field) {
    const row = document.createElement('div');
    const phoneField = field || 'telefone';
    const defaultTipo = phoneField === 'empresa_telefone' ? 'Comercial' : DEFAULT_PHONE_TYPE;
    row.className = 'overview-info-item profile-ident-item';
    row.dataset.field = phoneField;
    row.dataset.inlineType = 'phone';
    row.dataset.phoneIndex = String(index);
    row.dataset.phoneTipo = phone?.tipo || defaultTipo;
    if (draft) row.dataset.phoneDraft = '1';
    row.innerHTML = `<span class="profile-ident-value">${phone?.numero ? esc(formatPhone(phone.numero)) : ''}</span>`;
    return row;
  }

  function syncPhoneRows(containerId, field, phones, fallbackTipo) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const list = (phones || []).map(normalizePhoneEntry).filter(Boolean);
    const items = [...container.querySelectorAll(`.profile-ident-item[data-field="${field}"]`)];
    const primary = items.find(el => phoneIndexOf(el) === 0) || items[0];
    items.forEach(el => {
      if (el !== primary) el.remove();
    });
    if (primary) {
      primary.dataset.phoneIndex = '0';
      delete primary.dataset.phoneDraft;
      primary.dataset.phoneTipo = list[0]?.tipo || fallbackTipo;
      const typeLabel = primary.querySelector('.inline-field__type-label');
      if (typeLabel) typeLabel.textContent = primary.dataset.phoneTipo;
      primary._inlineField?.syncFromDom();
    }
    list.slice(1).forEach((phone, i) => {
      const row = createPhoneItem(phone, i + 1, false, field);
      container.appendChild(row);
      InlineField.bindItem(row);
    });
  }

  function syncProfilePhones(phones) {
    syncPhoneRows('profile-phone-values', 'telefone', phones, DEFAULT_PHONE_TYPE);
  }

  function syncEmpresaPhones(phones) {
    syncPhoneRows('profile-empresa-phone-values', 'empresa_telefone', phones, 'Comercial');
  }

  function addDraftPhoneRow(containerId, field, defaultTipo) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const existingDraft = container.querySelector('.profile-ident-item[data-phone-draft="1"]');
    if (existingDraft) {
      existingDraft._inlineField?.enter();
      return;
    }
    const index = container.querySelectorAll(`.profile-ident-item[data-field="${field}"]`).length;
    const row = createPhoneItem({ numero: '', tipo: defaultTipo }, index, true, field);
    container.appendChild(row);
    const instance = InlineField.bindItem(row);
    instance?.enter();
  }

  function bindAddPhoneButton() {
    const btn = document.getElementById('profile-add-phone-btn');
    if (!btn || btn.dataset.bound === '1') return;
    btn.dataset.bound = '1';
    if (!btn.querySelector('svg')) {
      btn.insertAdjacentHTML('afterbegin', icon('plus'));
    }
    btn.addEventListener('click', () => addDraftPhoneRow('profile-phone-values', 'telefone', DEFAULT_PHONE_TYPE));
  }

  function bindAddEmpresaPhoneButton() {
    const btn = document.getElementById('profile-add-empresa-phone-btn');
    if (!btn || btn.dataset.bound === '1') return;
    btn.dataset.bound = '1';
    if (!btn.querySelector('svg')) {
      btn.insertAdjacentHTML('afterbegin', icon('plus'));
    }
    btn.addEventListener('click', () => addDraftPhoneRow('profile-empresa-phone-values', 'empresa_telefone', 'Comercial'));
  }

  function getRawFromStore(item) {
    const field = item.dataset.field;
    const data = window.__profileFieldRaw || window.__profileIdentRaw || {};
    if (field === 'email') {
      return getEmailsList()[emailIndexOf(item)] ?? '';
    }
    if (field === 'telefone') {
      return getPhonesList()[phoneIndexOf(item)]?.numero ?? '';
    }
    if (field === 'empresa_telefone') {
      return getEmpresaPhonesList()[phoneIndexOf(item)]?.numero ?? '';
    }
    if (field === 'rede_social_usuario') {
      const fixedRede = item.dataset.socialRede;
      if (fixedRede) {
        const fixed = (window.__profileContactSocials || []).find(s => s?.rede === fixedRede);
        return { rede: fixedRede, usuario: fixed?.usuario || '' };
      }
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
      if (raw?.rede === 'site_pessoal') return u;
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
      this._onTypeOutside = this._onTypeOutside.bind(this);
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
        const typeLabel = this.el.querySelector('.inline-field__type-label');
        if (typeLabel) typeLabel.textContent = phoneTypeOf(this.el);
        return;
      }
      const raw = getRawFromStore(this.el);
      if (this.field === 'rede_social_usuario' || Object.prototype.hasOwnProperty.call(window.__profileFieldRaw || {}, this.field)) {
        this._restoreDisplay(raw);
        return;
      }
      const text = valueEl.textContent.trim();
      valueEl.classList.remove('skeleton');
      this.el.classList.remove('is-loading');
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
      const currentIsEmpty = existingValue?.classList.contains('is-empty') || !currentText || currentText === '—';
      const loading = existingValue?.classList.contains('skeleton');
      const placeholder = existingValue?.dataset.placeholder || '';
      const valueId = existingValue?.id ? ` id="${esc(existingValue.id)}"` : '';
      const placeholderAttr = placeholder ? ` data-placeholder="${esc(placeholder)}"` : '';

      if (!row) {
        row = document.createElement('div');
        item.appendChild(row);
      }
      if (existingValue && !row.contains(existingValue)) existingValue.remove();
      row.className = 'inline-field__control';
      if (this.type === 'phone') row.classList.add('inline-field__control--phone');

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
      const valueHtml = `<span class="inline-field__value ${valueKind}${currentIsEmpty ? ' is-empty' : ''}${loading ? ' skeleton' : ''}"${valueId}${placeholderAttr}>${valueInner}</span>`;
      const inputHtml = this.type === 'phone'
        ? `<div class="inline-field__phone-text" hidden>
            <span class="inline-field__dial">${esc(this.selectedCountry?.dial || '+55')}</span>
            <input class="inline-field__input" type="text" autocomplete="off" inputmode="tel">
          </div>`
        : `<input class="inline-field__input" type="text" autocomplete="off" hidden>`;

      row.innerHTML = `${leading}${valueHtml}${inputHtml}${actions}`;
      if (loading) item.classList.add('is-loading');

      if (item.classList.contains('profile-ident-item')) {
        Array.from(item.children).forEach(child => {
          if (child === row || child === label) return;
          if (child.classList.contains('inline-field__helper')) return;
          if (child.classList.contains('inline-field__menu')) return;
          if (child.classList.contains('inline-field__type-menu')) return;
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

      if (isTypedPhoneField(this.field) && !item.querySelector('.inline-field__type-menu')) {
        const typeMenu = document.createElement('div');
        typeMenu.className = 'inline-field__menu inline-field__type-menu';
        item.appendChild(typeMenu);
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
        const typeHtml = isTypedPhoneField(this.field)
          ? `<button type="button" class="inline-field__type-trigger" aria-label="Tipo de telefone" aria-haspopup="listbox">
              <span class="inline-field__type-label">${esc(phoneTypeOf(this.el))}</span>
              <span class="inline-field__caret">${icon('caret-down')}</span>
            </button>`
          : '';
        return `<span class="inline-field__leading">
          ${typeHtml}
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
        <button type="button" class="inline-field__action inline-field__action--copy" aria-label="Copiar">${icon('copy')}${tooltip('Copiar')}</button>
        ${caret}
      </div>`;
    }

    _bind() {
      const item = this.el;
      const valueEl = this._valueEl();
      const copyBtn = item.querySelector('.inline-field__action--copy');
      const caretBtn = item.querySelector('.inline-field__action--caret');
      const input = this._inputEl();
      const flagBtn = item.querySelector('.inline-field__flag-trigger');
      const typeBtn = item.querySelector('.inline-field__type-trigger');

      const open = (evt) => {
        evt?.preventDefault();
        evt?.stopPropagation();
        this.enter();
      };

      valueEl?.addEventListener('click', open);
      caretBtn?.addEventListener('click', open);
      bindActionTooltip(copyBtn);
      item.querySelector('.inline-field__calendar-icon')?.addEventListener('click', open);

      copyBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.copy();
      });

      flagBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.enter();
        this._closeTypeMenu();
        this._toggleCountryMenu();
      });

      typeBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this._toggleTypeMenu();
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
        input.value = this.originalRaw?.rede === 'site_pessoal'
          ? u
          : (u ? (u.startsWith('@') ? u : '@' + u) : '');
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
      if (this._isEmailDraft()) {
        this._discardEmailRow();
        return;
      }
      if (this._isPhoneDraft()) {
        this._discardPhoneRow();
        return;
      }
      this._restoreDisplay(this.originalRaw);
      this.exit();
    }

    async commit() {
      if (!this.editing || this.saving) return;
      const nextRaw = this._readRaw();
      if (this._isEmailDraft() && !(nextRaw || '').trim()) {
        this._discardEmailRow();
        return;
      }
      if (this._isPhoneDraft() && !(nextRaw || '').trim()) {
        this._discardPhoneRow();
        return;
      }
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
        if (this.field === 'email' && emailIndexOf(this.el) > 0 && !(nextRaw || '').trim()) {
          this._discardEmailRow();
          return;
        }
        if (isTypedPhoneField(this.field) && phoneIndexOf(this.el) > 0 && !(nextRaw || '').trim()) {
          this._discardPhoneRow();
          return;
        }
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

    _isEmailDraft() {
      return this.field === 'email' && this.el.dataset.emailDraft === '1';
    }

    _discardEmailRow() {
      this.exit();
      this.el.remove();
      reindexEmailRows();
    }

    _isPhoneDraft() {
      return isTypedPhoneField(this.field) && this.el.dataset.phoneDraft === '1';
    }

    _discardPhoneRow() {
      this.exit();
      this.el.remove();
      reindexPhoneRows(this.el);
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
        const box = (btn._pinnedTooltip || btn.querySelector('.inline-field__tooltip'))
          ?.querySelector('.inline-field__tooltip-box');
        if (box) box.textContent = 'Copiado';
        btn.classList.add('copied');
        pinActionTooltip(btn);
        setTimeout(() => {
          btn.classList.remove('copied');
          if (box) box.textContent = 'Copiar';
        }, 1200);
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
      valueEl.classList.remove('skeleton');
      this.el.classList.remove('is-loading');
      if (this.type === 'phone' || this.field === 'telefone') {
        const display = formatPhone(raw) || '';
        valueEl.innerHTML = phoneValueHtml(raw, display);
        valueEl.classList.toggle('is-empty', !display || display === '—');
        this._applyCountry(countryForPhone(raw));
        return;
      }
      const display = displayFromRaw(this.field, raw);
      const empty = !raw || display === '—';
      valueEl.textContent = empty ? (valueEl.dataset.placeholder || '—') : display;
      valueEl.classList.toggle('is-empty', empty);
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

      if (this.field === 'empresa_site') {
        const empresaId = window.__profileFieldRaw?.empresa_id;
        if (!empresaId) throw new Error('Não foi possível salvar. Tente novamente.');
        const { error } = await db.from('claude_empresas').update({ site: raw || null }).eq('id', empresaId);
        if (error) throw error;
        if (!window.__profileFieldRaw) window.__profileFieldRaw = {};
        window.__profileFieldRaw.empresa_site = raw;
        window.__profileIdentRaw = window.__profileFieldRaw;
        return;
      }

      if (this.field === 'empresa_telefone') {
        const empresaId = window.__profileFieldRaw?.empresa_id;
        if (!empresaId) throw new Error('Não foi possível salvar. Tente novamente.');
        const payload = this._empresaPhonePayload(raw, phoneTypeOf(this.el));
        const { error } = await db.from('claude_empresas').update(payload).eq('id', empresaId);
        if (error) throw error;
        if (!window.__profileFieldRaw) window.__profileFieldRaw = {};
        window.__profileFieldRaw.empresa_telefone = payload.telefone || '';
        window.__profileFieldRaw.empresa_telefone_tipo = payload.telefone_tipo || '';
        window.__profileFieldRaw.empresa_telefones = payload.telefones || [];
        delete this.el.dataset.phoneDraft;
        this.el.dataset.phoneTipo = phoneTypeOf(this.el);
        reindexPhoneRows(this.el);
        window.__profileIdentRaw = window.__profileFieldRaw;
        return;
      }

      let payload = {};
      if (this.field === 'email') {
        const emails = getEmailsList();
        const index = emailIndexOf(this.el);
        if (!(raw || '').trim() && index > 0) {
          emails.splice(index, 1);
        } else {
          while (emails.length <= index) emails.push('');
          emails[index] = (raw || '').trim();
        }
        const filtered = emails.map(email => String(email || '').trim()).filter(Boolean);
        payload = { email: filtered[0] || null, emails: filtered };
      } else if (this.field === 'telefone') {
        payload = this._phonePayload(raw, phoneTypeOf(this.el));
      } else if (this.field === 'rede_social_usuario') {
        const fixedRede = this.el.dataset.socialRede;
        const socials = [...(window.__profileContactSocials || [])];
        if (fixedRede) {
          const fixedIndex = socials.findIndex(s => s?.rede === fixedRede);
          if (fixedIndex >= 0) socials[fixedIndex] = { rede: fixedRede, usuario: raw.usuario };
          else socials.push({ rede: fixedRede, usuario: raw.usuario });
        } else {
          const index = parseInt(this.el.dataset.socialIndex || '0', 10) || 0;
          while (socials.length <= index) socials.push({ rede: 'instagram', usuario: '' });
          socials[index] = raw;
        }
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
      if (this.field === 'email') {
        window.__profileFieldRaw.email = payload.email || '';
        window.__profileFieldRaw.emails = payload.emails || [];
        delete this.el.dataset.emailDraft;
        reindexEmailRows();
      } else if (this.field === 'telefone') {
        window.__profileFieldRaw.telefone = payload.telefone || '';
        window.__profileFieldRaw.telefones = payload.telefones || [];
        delete this.el.dataset.phoneDraft;
        this.el.dataset.phoneTipo = phoneTypeOf(this.el);
        reindexPhoneRows();
      } else if (this.field === 'rede_social_usuario') {
        const fixedRede = this.el.dataset.socialRede;
        window.__profileContactSocials = fixedRede
          ? (window.__profileContactSocials || []).map(s => s?.rede === fixedRede ? raw : s)
          : (payload.redes_sociais || []);
        if (!fixedRede && (parseInt(this.el.dataset.socialIndex || '0', 10) || 0) === 0) {
          window.__profileFieldRaw.rede_social = raw.rede;
          window.__profileFieldRaw.rede_social_usuario = raw.usuario;
        }
        if (fixedRede) window.__renderMoreInfoCard?.({ ...window.__profileFieldRaw, redes_sociais: payload.redes_sociais });
        else window.__refreshProfileSocials?.();
      } else {
        window.__profileFieldRaw[this.field] = raw;
        if (this.field === 'cargo') {
          const role = document.getElementById('profile-role');
          if (role) role.textContent = raw || '—';
        }
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
      const menu = this.el.querySelector('.inline-field__country-menu');
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

    _phonePayload(numero, tipo) {
      const phones = getPhonesList();
      const index = phoneIndexOf(this.el);
      const nextTipo = PHONE_TYPE_OPTIONS.some(opt => opt.value === tipo) ? tipo : DEFAULT_PHONE_TYPE;
      const nextNumero = String(numero || '').trim();
      if (!nextNumero && index > 0) {
        phones.splice(index, 1);
      } else {
        while (phones.length <= index) phones.push({ numero: '', tipo: DEFAULT_PHONE_TYPE });
        phones[index] = { numero: nextNumero, tipo: nextTipo };
      }
      const filtered = phones.filter(phone => phone.numero);
      return {
        telefone: filtered[0]?.numero || null,
        telefones: filtered,
      };
    }

    _empresaPhonePayload(numero, tipo) {
      const phones = getEmpresaPhonesList();
      const index = phoneIndexOf(this.el);
      const nextTipo = PHONE_TYPE_OPTIONS.some(opt => opt.value === tipo) ? tipo : 'Comercial';
      const nextNumero = String(numero || '').trim();
      if (!nextNumero && index > 0) {
        phones.splice(index, 1);
      } else {
        while (phones.length <= index) phones.push({ numero: '', tipo: 'Comercial' });
        phones[index] = { numero: nextNumero, tipo: nextTipo };
      }
      const filtered = phones.filter(phone => phone.numero);
      return {
        telefone: filtered[0]?.numero || null,
        telefone_tipo: filtered[0]?.tipo || null,
        telefones: filtered,
      };
    }

    _setPhoneTypeLabel(tipo) {
      const label = this.el.querySelector('.inline-field__type-label');
      if (label) label.textContent = tipo;
      this.el.dataset.phoneTipo = tipo;
    }

    _closeTypeMenu() {
      this.el.querySelector('.inline-field__type-menu')?.classList.remove('is-open');
      document.removeEventListener('mousedown', this._onTypeOutside);
    }

    _onTypeOutside(e) {
      if (e.target.closest?.('.inline-field__type-menu') || e.target.closest?.('.inline-field__type-trigger')) return;
      this._closeTypeMenu();
    }

    _toggleTypeMenu() {
      const menu = this.el.querySelector('.inline-field__type-menu');
      if (!menu) return;
      this.el.querySelector('.inline-field__country-menu')?.classList.remove('is-open');
      if (menu.classList.contains('is-open')) {
        this._closeTypeMenu();
        return;
      }
      const current = phoneTypeOf(this.el);
      menu.innerHTML = PHONE_TYPE_OPTIONS.map(opt =>
        `<div class="inline-field__option${opt.value === current ? ' is-selected' : ''}" data-type="${esc(opt.value)}">${esc(opt.label)}</div>`
      ).join('');
      menu.querySelectorAll('[data-type]').forEach(optEl => {
        optEl.addEventListener('mousedown', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this._pickPhoneType(optEl.dataset.type);
        });
      });
      menu.classList.add('is-open');
      document.addEventListener('mousedown', this._onTypeOutside);
    }

    async _pickPhoneType(tipo) {
      this._setPhoneTypeLabel(tipo);
      this._closeTypeMenu();
      const numero = this.editing ? this._readRaw() : getRawFromStore(this.el);
      if (!(numero || '').trim()) return;
      try {
        await this._persist(numero);
      } catch (err) {
        showSaveErrorToast(err?.message || 'Ocorreu um erro ao salvar, tente novamente.');
      }
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
      this._closeTypeMenu();
      this.el.querySelectorAll('.inline-field__menu').forEach(menu => menu.classList.remove('is-open'));
      this.el.querySelector('.inline-field__datepicker')?.classList.remove('is-open');
      this.calendarMonth = null;
    }

    _onDocClick(e) {
      if (this.el.contains(e.target)) return;
      if (e.target.closest?.('#profile-add-email-btn') && this._isEmailDraft() && !(this._readRaw() || '').trim()) {
        return;
      }
      if (e.target.closest?.('#profile-add-phone-btn, #profile-add-empresa-phone-btn') && this._isPhoneDraft() && !(this._readRaw() || '').trim()) {
        return;
      }
      this.commit();
    }

    _onDocKey(e) {
      if (e.key !== 'Escape') return;
      if (this.el.querySelector('.inline-field__type-menu.is-open')) {
        this._closeTypeMenu();
        return;
      }
      this.cancel();
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
    bindAddEmailButton();
    bindAddPhoneButton();
    bindAddEmpresaPhoneButton();
  }

  window.InlineField = InlineField;
  window.__showInlineSaveError = showSaveErrorToast;
  window.__syncProfileEmails = syncProfileEmails;
  window.__syncProfilePhones = syncProfilePhones;
  window.__syncEmpresaPhones = syncEmpresaPhones;
  window.__bindAddEmpresaPhoneButton = bindAddEmpresaPhoneButton;
  window.__normalizePhones = normalizePhones;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
