(function () {
  function db() {
    return window.__sbClient;
  }

  async function listObjects() {
    const { data, error } = await db()
      .from('custom_objects')
      .select('id, name, singular, description, kind, status, show_in_catalog, created_at')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async function listCatalog() {
    const objects = await listObjects();
    const { data: links, error } = await db()
      .from('custom_object_links')
      .select('id, object_a_id, object_b_id');
    if (error) throw error;
    const byId = Object.fromEntries(objects.map(item => [item.id, item]));
    const order = ['Negociação', 'Empresa', 'Contato', 'Alunos', 'Contratos'];
    function byCatalogOrder(a, b) {
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      if (ai === -1 && bi === -1) return a < b ? -1 : 1;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    }
    return objects.filter(item => item.show_in_catalog).sort((a, b) => {
      const ai = order.indexOf(a.name);
      const bi = order.indexOf(b.name);
      if (ai === -1 && bi === -1) return a.created_at < b.created_at ? -1 : 1;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    }).map(item => {
      const names = (links || [])
        .filter(link => link.object_a_id === item.id || link.object_b_id === item.id)
        .map(link => {
          const otherId = link.object_a_id === item.id ? link.object_b_id : link.object_a_id;
          return byId[otherId] ? byId[otherId].name : '';
        })
        .filter(Boolean)
        .sort(byCatalogOrder);
      return {
        id: item.id,
        name: item.name,
        singular: item.singular,
        description: item.description,
        kind: item.kind,
        status: item.status,
        links: names.join(', ')
      };
    });
  }

  async function getObjectByName(name) {
    const { data, error } = await db()
      .from('custom_objects')
      .select('id, name, singular, description, kind, status, show_in_catalog')
      .eq('name', name)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async function updateObject(id, patch) {
    const { error } = await db().from('custom_objects').update(patch).eq('id', id);
    if (error) throw error;
  }

  async function createObject(payload) {
    const { data, error } = await db()
      .from('custom_objects')
      .insert({
        name: payload.name,
        singular: payload.singular,
        description: payload.description || '',
        kind: 'personalizado',
        status: 'ativo',
        show_in_catalog: true
      })
      .select('id, name, singular, description, kind, status')
      .single();
    if (error) throw error;
    return data;
  }

  async function listFields(objectId) {
    const { data, error } = await db()
      .from('custom_fields')
      .select('id, object_id, name, field_type, type_label, type_detail, description, is_required, is_primary, preference, position, options, created_at')
      .eq('object_id', objectId)
      .order('position', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async function createField(payload) {
    const { data, error } = await db()
      .from('custom_fields')
      .insert(payload)
      .select('id, object_id, name, field_type, type_label, type_detail, description, is_required, is_primary, preference, position, options, created_at')
      .single();
    if (error) throw error;
    return data;
  }

  async function updateField(id, patch) {
    const { error } = await db().from('custom_fields').update(patch).eq('id', id);
    if (error) throw error;
  }

  async function deleteField(id) {
    const { error } = await db().from('custom_fields').delete().eq('id', id);
    if (error) throw error;
  }

  async function deleteObject(id) {
    const { error } = await db().from('custom_objects').delete().eq('id', id);
    if (error) throw error;
  }

  async function listObjectLinks(objectId) {
    const objects = await listObjects();
    const { data, error } = await db()
      .from('custom_object_links')
      .select('id, object_a_id, object_b_id')
      .or('object_a_id.eq.' + objectId + ',object_b_id.eq.' + objectId);
    if (error) throw error;
    const byId = Object.fromEntries(objects.map(item => [item.id, item]));
    return (data || []).map(link => {
      const otherId = link.object_a_id === objectId ? link.object_b_id : link.object_a_id;
      const other = byId[otherId];
      return {
        id: link.id,
        objectId: otherId,
        name: other ? other.name : '',
        status: other ? other.status : 'desativado'
      };
    }).filter(item => item.name);
  }

  async function createObjectLink(objectAId, objectBId) {
    const { data, error } = await db()
      .from('custom_object_links')
      .insert({ object_a_id: objectAId, object_b_id: objectBId })
      .select('id, object_a_id, object_b_id')
      .single();
    if (error) throw error;
    return data;
  }

  async function deleteObjectLink(id) {
    const { error } = await db().from('custom_object_links').delete().eq('id', id);
    if (error) throw error;
  }

  async function listRecords(objectId) {
    const { data, error } = await db()
      .from('custom_records')
      .select('id, object_id, data, created_at')
      .eq('object_id', objectId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async function deleteRecords(ids) {
    const recordIds = (ids || []).filter(Boolean);
    if (!recordIds.length) return;
    const { error } = await db().from('custom_records').delete().in('id', recordIds);
    if (error) throw error;
  }

  async function createRecord(objectId, data) {
    const { data: row, error } = await db()
      .from('custom_records')
      .insert({ object_id: objectId, data: data || {} })
      .select('id, object_id, data, created_at')
      .single();
    if (error) throw error;
    return row;
  }

  async function createRecordLink(payload) {
    const { data, error } = await db()
      .from('custom_record_links')
      .insert({
        object_link_id: payload.objectLinkId,
        left_kind: payload.leftKind,
        left_id: payload.leftId,
        right_kind: payload.rightKind,
        right_id: payload.rightId
      })
      .select('id, object_link_id, left_kind, left_id, right_kind, right_id')
      .single();
    if (error) throw error;
    return data;
  }

  async function listRecordLinks(kind, id) {
    const { data, error } = await db()
      .from('custom_record_links')
      .select('id, object_link_id, left_kind, left_id, right_kind, right_id, created_at')
      .or('and(left_kind.eq.' + kind + ',left_id.eq.' + id + '),and(right_kind.eq.' + kind + ',right_id.eq.' + id + ')');
    if (error) throw error;
    return data || [];
  }

  window.__customObjectsDb = {
    listObjects,
    listCatalog,
    getObjectByName,
    createObject,
    updateObject,
    listFields,
    createField,
    updateField,
    deleteField,
    deleteObject,
    listObjectLinks,
    createObjectLink,
    deleteObjectLink,
    listRecords,
    createRecord,
    deleteRecords,
    createRecordLink,
    listRecordLinks
  };
})();
