(function() {
  const drawer = document.getElementById('drawer-edit-tags');
  const content = document.querySelector('.content');
  const detailPanel = document.getElementById('detail-panel');
  const closeBtn = document.getElementById('tags-drawer-close-btn');
  const cancelBtn = document.getElementById('tags-drawer-cancel-btn');
  const saveBtn = document.getElementById('tags-drawer-save-btn');
  const errorEl = document.getElementById('tags-drawer-form-error');
  if (!drawer || !detailPanel || !window.__tagPicker) return;

  const db = window.__sbClient;
  window.__tagPicker.init(db);

  let editContactId = null;

  drawer.classList.remove('open');
  detailPanel.appendChild(drawer);

  function isListingOverview() {
    return !!document.getElementById('detail-panel-preview');
  }

  function getPanelContactId() {
    return window.__selectedContactId
      || window.__profileContactId
      || new URLSearchParams(window.location.search).get('id')
      || null;
  }

  function placeTagPicker(host) {
    const picker = document.getElementById('dc-tag-picker');
    if (!picker || !host || picker.parentElement === host) return;
    host.appendChild(picker);
  }

  function restoreTagPicker() {
    if (!isListingOverview()) return;
    placeTagPicker(document.getElementById('dc-tags-field'));
  }

  function closeSiblingDrawers() {
    ['drawer-edit-responsible', 'drawer-edit-company'].forEach(id => {
      document.getElementById(id)?.classList.remove('open');
    });
  }

  async function openTagsPanel(contactId) {
    if (!contactId) return;
    if (content?.classList.contains('detail-edit')) return;
    closeSiblingDrawers();
    window.__tagCreateForm?.close('replace');
    editContactId = contactId;
    if (errorEl) errorEl.style.display = 'none';
    window.__tagPicker.reset();
    detailPanel.appendChild(drawer);
    if (isListingOverview()) {
      content.classList.add('detail-tags');
      placeTagPicker(document.getElementById('tags-drawer-picker-host'));
    } else {
      content.classList.add('detail-open');
      detailPanel.setAttribute('aria-hidden', 'false');
    }
    drawer.classList.add('open');

    if (saveBtn) saveBtn.disabled = true;
    await window.__tagPicker.loadForContact(contactId);
    if (saveBtn) saveBtn.disabled = false;
  }

  function closeTagsPanel() {
    window.__tagCreateForm?.close('replace');
    drawer.classList.remove('open');
    if (isListingOverview()) {
      content?.classList.remove('detail-tags');
      restoreTagPicker();
    } else {
      content?.classList.remove('detail-open');
      detailPanel?.setAttribute('aria-hidden', 'true');
    }
    editContactId = null;
    window.__tagPicker.reset();
  }

  window.__openContactEditTags = (id) => {
    const cid = id || getPanelContactId();
    if (cid) openTagsPanel(cid);
  };
  window.__closeContactEditTags = closeTagsPanel;

  document.getElementById('profile-edit-tags-btn')?.addEventListener('click', () => {
    window.__openContactEditTags(getPanelContactId());
  });

  closeBtn?.addEventListener('click', closeTagsPanel);
  cancelBtn?.addEventListener('click', closeTagsPanel);
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (window.__tagCreateForm?.isOpen()) return;
    if (drawer.classList.contains('open') && !content?.classList.contains('detail-edit')) {
      closeTagsPanel();
    }
  });

  saveBtn?.addEventListener('click', async () => {
    if (!editContactId) return;
    if (errorEl) errorEl.style.display = 'none';
    saveBtn.disabled = true;
    saveBtn.textContent = 'Salvando...';
    const savedContactId = editContactId;
    const savedTags = window.__tagPicker.getSelectedTags ? window.__tagPicker.getSelectedTags() : [];
    const tagError = await window.__tagPicker.saveForContact(savedContactId);
    saveBtn.disabled = false;
    saveBtn.textContent = 'Salvar etiquetas';
    if (tagError) {
      if (errorEl) {
        errorEl.textContent = 'Erro ao salvar etiquetas: ' + tagError.message;
        errorEl.style.display = 'block';
      }
      return;
    }
    if (window.__renderProfileTagsList) window.__renderProfileTagsList(savedTags);
    closeTagsPanel();
    if (window.__refreshProfileTags) await window.__refreshProfileTags(savedContactId);
    if (window.__refreshProfileTagCard) await window.__refreshProfileTagCard();
  });
})();
