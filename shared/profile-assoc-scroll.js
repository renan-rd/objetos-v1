(function () {
  const LISTS = ['profile-companies-list', 'profile-responsible-list'];

  function mount(list) {
    let wrap = list.closest('.assoc-scroll');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'assoc-scroll';
      list.parentNode.insertBefore(wrap, list);
      wrap.appendChild(list);
      const track = document.createElement('div');
      track.className = 'assoc-scroll-track';
      track.setAttribute('aria-hidden', 'true');
      const thumb = document.createElement('div');
      thumb.className = 'assoc-scroll-thumb';
      track.appendChild(thumb);
      wrap.appendChild(track);
    }
    return wrap;
  }

  function bind(list) {
    const wrap = mount(list);
    const track = wrap.querySelector('.assoc-scroll-track');
    const thumb = wrap.querySelector('.assoc-scroll-thumb');
    if (wrap.dataset.bound === '1') return;
    wrap.dataset.bound = '1';

    function place() {
      const overflow = list.scrollHeight - list.clientHeight;
      const scrollable = overflow > 1;
      wrap.classList.toggle('is-scrollable', scrollable);
      if (!scrollable) return;
      const trackHeight = track.clientHeight;
      const thumbHeight = Math.max(16, trackHeight * (list.clientHeight / list.scrollHeight));
      const travel = Math.max(1, trackHeight - thumbHeight);
      const top = (list.scrollTop / overflow) * travel;
      thumb.style.height = thumbHeight + 'px';
      thumb.style.transform = 'translateY(' + top + 'px)';
    }

    list.addEventListener('scroll', place, { passive: true });
    window.addEventListener('resize', place);

    if (typeof ResizeObserver === 'function') {
      const resize = new ResizeObserver(place);
      resize.observe(list);
      resize.observe(track);
    }

    const changes = new MutationObserver(place);
    changes.observe(list, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

    thumb.addEventListener('pointerdown', event => {
      event.preventDefault();
      event.stopPropagation();
      thumb.classList.add('is-dragging');
      thumb.setPointerCapture(event.pointerId);
      const startY = event.clientY;
      const startTop = list.scrollTop;
      const overflow = list.scrollHeight - list.clientHeight;
      const travel = Math.max(1, track.clientHeight - thumb.offsetHeight);

      function move(next) {
        const delta = next.clientY - startY;
        list.scrollTop = startTop + (delta / travel) * overflow;
      }

      function end() {
        thumb.classList.remove('is-dragging');
        thumb.removeEventListener('pointermove', move);
        thumb.removeEventListener('pointerup', end);
        thumb.removeEventListener('pointercancel', end);
      }

      thumb.addEventListener('pointermove', move);
      thumb.addEventListener('pointerup', end);
      thumb.addEventListener('pointercancel', end);
    });

    track.addEventListener('pointerdown', event => {
      if (event.target === thumb) return;
      const rect = track.getBoundingClientRect();
      const overflow = list.scrollHeight - list.clientHeight;
      const thumbHeight = thumb.offsetHeight;
      const travel = Math.max(1, track.clientHeight - thumbHeight);
      const ratio = Math.min(1, Math.max(0, (event.clientY - rect.top - thumbHeight / 2) / travel));
      list.scrollTop = ratio * overflow;
    });

    place();
  }

  function start() {
    const lists = LISTS.map(id => document.getElementById(id)).filter(Boolean);
    document.querySelectorAll('.assoc-record-list').forEach(list => lists.push(list));
    lists.forEach(bind);
  }

  window.__bindAssocLists = start;

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
