(function () {
  const fields = [
    ['rg', 'RG', 'Informe o RG'],
    ['cargo', 'Cargo', 'Informe o cargo'],
    ['data_nascimento', 'Data de nascimento', '--/--/----', 'date'],
    ['divider'],
    ['cep', 'CEP', 'Informe o CEP'],
    ['rua', 'Rua', 'Informe a rua'],
    ['numero', 'Número', 'Informe o número'],
    ['complemento', 'Complemento', 'Informe o complemento'],
    ['bairro', 'Bairro', 'Informe o bairro'],
    ['cidade', 'Cidade', 'Selecione a cidade'],
    ['estado', 'Estado', 'Selecione o estado', 'select'],
    ['pais', 'País', 'Selecione o país', 'autocomplete'],
  ];

  const socials = [
    ['whatsapp', 'WhatsApp'],
    ['facebook', 'Facebook'],
    ['twitter', 'X.com'],
    ['instagram', 'Instagram'],
    ['teams', 'Teams'],
    ['site_pessoal', 'Site pessoal'],
  ];

  function esc(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fieldHtml(field, label, placeholder, type) {
    const typeAttr = type ? ` data-inline-type="${type}"` : '';
    return `
      <div class="profile-detail-item more-info-row" id="pi-${field}" data-field="${field}"${typeAttr}>
        <span class="profile-detail-label">${label}</span>
        <span class="profile-detail-value is-empty" id="pi-${field}-val" data-placeholder="${esc(placeholder)}">${esc(placeholder)}</span>
      </div>`;
  }

  function socialHtml(rede, label, index) {
    const placeholder = rede === 'site_pessoal' ? 'Informe um site' : '@username';
    return `
      <div class="profile-detail-item more-info-row more-info-social-row"
           data-field="rede_social_usuario"
           data-social-index="${index}"
           data-social-rede="${rede}">
        <span class="profile-detail-label">${label}</span>
        <span class="profile-detail-value is-empty" data-placeholder="${placeholder}">${placeholder}</span>
      </div>`;
  }

  function build() {
    const card = document.getElementById('profile-more-info-card');
    const body = card?.querySelector('.overview-card-body');
    if (!body || body.dataset.figmaLayout === '1') return;

    body.dataset.figmaLayout = '1';
    body.innerHTML = `
      <div class="profile-detail-list more-info-fields" id="profile-info-list">
        ${fields.map(field => field[0] === 'divider'
          ? '<div class="profile-divider more-info-divider" aria-hidden="true"></div>'
          : fieldHtml(...field)).join('')}
      </div>
      <div class="profile-divider more-info-divider" aria-hidden="true"></div>
      <div class="profile-detail-list more-info-socials" id="profile-extra-socials">
        ${socials.map((social, index) => socialHtml(social[0], social[1], index)).join('')}
      </div>
      <div class="profile-divider more-info-divider" aria-hidden="true"></div>
      <div class="profile-detail-list more-info-footer-fields">
        ${fieldHtml('origem', 'Origem', 'Informe a origem')}
        <div class="more-info-base-legal">
          <span class="profile-detail-label">Base legal</span>
          <div class="profile-privacy-list" id="profile-privacy-list"></div>
        </div>
      </div>
      <button type="button" class="overview-btn-secondary" id="profile-open-contact-edit">Editar contato</button>`;
  }

  function displayDate(value) {
    if (!value) return '';
    const [year, month, day] = String(value).split('-');
    return year && month && day ? `${day}/${month}/${year}` : String(value);
  }

  function setField(field, value) {
    const el = document.getElementById(`pi-${field}-val`);
    if (!el) return;
    const shown = field === 'data_nascimento' ? displayDate(value) : String(value || '');
    const placeholder = el.dataset.placeholder || '—';
    el.textContent = shown || placeholder;
    el.classList.toggle('is-empty', !shown);
  }

  function socialMap(contact) {
    const list = Array.isArray(contact?.redes_sociais) ? contact.redes_sociais : [];
    const map = new Map();
    list.forEach(item => {
      if (item?.rede) map.set(item.rede, item.usuario || '');
    });
    if (contact?.rede_social) {
      map.set(contact.rede_social, contact.rede_social_usuario || '');
    }
    return map;
  }

  function render(contact) {
    if (!contact) return;
    fields.forEach(field => {
      if (field[0] !== 'divider') setField(field[0], contact[field[0]]);
    });

    const map = socialMap(contact);
    const canonical = socials.map(([rede]) => ({ rede, usuario: map.get(rede) || '' }));
    window.__profileContactSocials = canonical;

    const socialList = document.getElementById('profile-extra-socials');
    if (socialList) {
      socialList.innerHTML = socials.map((social, index) => socialHtml(social[0], social[1], index)).join('');
    }

    document.querySelectorAll('#profile-extra-socials [data-social-rede]').forEach(item => {
      const rede = item.dataset.socialRede;
      const value = map.get(rede) || '';
      const valueEl = item.querySelector('.profile-detail-value, .inline-field__value');
      if (!valueEl) return;
      const placeholder = valueEl.dataset.placeholder || (rede === 'site_pessoal' ? 'Informe um site' : '@username');
      const shown = value
        ? (rede === 'site_pessoal' || String(value).startsWith('@') ? String(value) : `@${value}`)
        : placeholder;
      valueEl.textContent = shown;
      valueEl.classList.toggle('is-empty', !value);
      window.InlineField?.bindItem(item, { type: 'text' });
    });

    window.InlineField?.mountCard('#profile-more-info-card');
  }

  build();
  window.__renderMoreInfoCard = render;
})();
