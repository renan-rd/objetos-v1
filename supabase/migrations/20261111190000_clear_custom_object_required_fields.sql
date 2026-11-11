update public.custom_fields f
set is_required = false
from public.custom_objects o
where f.object_id = o.id
  and o.kind = 'personalizado'
  and f.is_required = true;
