(function () {
  const FIXED_EMAIL = 'design@rdstation.com';
  const script = document.currentScript;
  const loginUrl = script?.dataset.login || './login.html';
  const requireAuth = script?.dataset.requireAuth === 'true';

  function safeNextPath(raw) {
    if (!raw || typeof raw !== 'string') return null;
    if (!raw.startsWith('/') && !raw.startsWith('./') && !raw.startsWith('../')) return null;
    if (raw.startsWith('//') || raw.includes('://')) return null;
    return raw;
  }

  async function getSession() {
    const db = window.__sbClient;
    if (!db) return null;
    const { data } = await db.auth.getSession();
    return data?.session || null;
  }

  async function requireSession() {
    const session = await getSession();
    if (!session) {
      const next = encodeURIComponent(location.pathname + location.search + location.hash);
      location.replace(loginUrl + (loginUrl.includes('?') ? '&' : '?') + 'next=' + next);
      return null;
    }
    return session;
  }

  async function signOut() {
    const db = window.__sbClient;
    if (db) {
      try { await db.auth.signOut(); } catch (err) { console.warn('[auth] signOut', err); }
    }
    location.replace(loginUrl);
  }

  function bindLogout() {
    document.getElementById('logout-btn')?.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      signOut();
    });
  }

  window.__auth = {
    FIXED_EMAIL,
    loginUrl,
    getSession,
    requireSession,
    signOut,
    bindLogout,
    safeNextPath,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindLogout);
  } else {
    bindLogout();
  }

  if (requireAuth) {
    const style = document.createElement('style');
    style.textContent = 'html[data-auth-pending] body { visibility: hidden; }';
    document.head.appendChild(style);
    document.documentElement.dataset.authPending = 'true';
    requireSession().then(session => {
      if (session) delete document.documentElement.dataset.authPending;
    });
  }
})();
