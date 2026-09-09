#!/usr/bin/env python3
"""Gera o projeto Google Apps Script a partir do protótipo, sem alterar os arquivos originais."""

from pathlib import Path
import re
import base64
import mimetypes

ROOT = Path(__file__).resolve().parent.parent
OUT = Path(__file__).resolve().parent
MAX_EMBED_BYTES = 80_000

PAGES = [
    ("vendas-contatos", "VendasContatos", ROOT / "contatos/index.html", "vendas"),
    ("vendas-perfil", "VendasPerfil", ROOT / "perfil/index.html", "vendas"),
    ("marketing-contatos", "RdmContatos", ROOT / "RDM/contatos/index.html", "marketing"),
    ("marketing-perfil", "RdmPerfil", ROOT / "RDM/perfil/index.html", "marketing"),
    ("conversas-contatos", "RdaContatos", ROOT / "RDA/contatos/index.html", "conversas"),
    ("conversas-perfil", "RdaPerfil", ROOT / "RDA/perfil/index.html", "conversas"),
]

MIME_EXTRA = {
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
}

PLACEHOLDER_AVATAR = (
    "data:image/svg+xml;utf8,"
    "%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E"
    "%3Ccircle cx='20' cy='20' r='20' fill='%23B2F4FF'/%3E"
    "%3Ccircle cx='20' cy='16' r='7' fill='%230077B2'/%3E"
    "%3Cpath d='M8 34c2-8 8-12 12-12s10 4 12 12' fill='%230077B2'/%3E"
    "%3C/svg%3E"
)

data_uri_cache = {}


def is_remote(url: str) -> bool:
    u = url.strip()
    return u.startswith(("http://", "https://", "data:", "mailto:", "javascript:", "#", "<?"))


def resolve_local(base_dir: Path, url: str):
    clean = url.strip().strip("'\"")
    clean = clean.split("?")[0].split("#")[0]
    if not clean or is_remote(clean):
        return None
    path = (base_dir / clean).resolve()
    try:
        path.relative_to(ROOT.resolve())
    except ValueError:
        return None
    return path if path.is_file() else None


def to_data_uri(path: Path) -> str:
    key = str(path)
    if key in data_uri_cache:
        return data_uri_cache[key]
    raw = path.read_bytes()
    if len(raw) > MAX_EMBED_BYTES:
        data_uri_cache[key] = PLACEHOLDER_AVATAR
        return PLACEHOLDER_AVATAR
    mime = MIME_EXTRA.get(path.suffix.lower()) or mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    uri = f"data:{mime};base64,{base64.b64encode(raw).decode('ascii')}"
    data_uri_cache[key] = uri
    return uri


def inline_css_urls(css: str, css_dir: Path) -> str:
    def repl(m):
        quote = m.group(1) or ""
        url = m.group(2)
        local = resolve_local(css_dir, url)
        if not local:
            return m.group(0)
        return f"url({quote}{to_data_uri(local)}{quote})"

    return re.sub(r"url\((['\"]?)([^'\")]+)\1\)", repl, css)


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


GAS_PRODUCTS_JS = r"""
(function () {
  const PRODUCT_LABELS = {
    vendas: 'RD Vendas',
    marketing: 'RD Marketing',
    conversas: 'RD Atendimento',
  };

  function getMenuEl() {
    return document.getElementById('products-menu');
  }

  function getCurrentProduct() {
    const menu = getMenuEl();
    return menu?.dataset.currentProduct || 'vendas';
  }

  function getPageType() {
    const menu = getMenuEl();
    return menu?.dataset.page || 'contatos';
  }

  function buildProductUrl(productId, pageType) {
    return __gasPage(productId + '-' + pageType);
  }

  function navigateToProduct(productId) {
    if (productId === getCurrentProduct()) return;
    const pageType = getPageType();
    const params = {};
    if (pageType === 'perfil') {
      const id = new URLSearchParams(window.location.search).get('id');
      if (id) params.id = id;
    }
    window.location.href = __gasPage(productId + '-' + pageType, params);
  }

  function closeMenu() {
    const menu = getMenuEl();
    const trigger = document.getElementById('products-menu-trigger');
    const drop = document.getElementById('products-dropdown');
    if (!menu || !trigger || !drop) return;
    drop.classList.remove('open');
    trigger.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  }

  function initProductsMenu() {
    const menu = getMenuEl();
    const trigger = document.getElementById('products-menu-trigger');
    const drop = document.getElementById('products-dropdown');
    if (!menu || !trigger || !drop) return;

    const current = getCurrentProduct();
    menu.querySelectorAll('[data-product-id]').forEach(item => {
      if (item.dataset.productId === current) {
        item.classList.add('active');
        item.setAttribute('aria-current', 'true');
      }
      item.addEventListener('click', e => {
        e.stopPropagation();
        navigateToProduct(item.dataset.productId);
      });
    });

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = drop.classList.toggle('open');
      trigger.classList.toggle('open', isOpen);
      trigger.setAttribute('aria-expanded', String(isOpen));
      const accountDrop = document.getElementById('account-dropdown');
      if (isOpen && accountDrop) accountDrop.classList.remove('open');
    });

    document.addEventListener('click', e => {
      if (!menu.contains(e.target)) closeMenu();
    });

    const accountMenu = document.getElementById('account-menu');
    const accountDrop = document.getElementById('account-dropdown');
    if (accountMenu && accountDrop) {
      accountMenu.addEventListener('click', e => {
        if (e.target.closest('#logout-btn')) return;
        const isOpen = accountDrop.classList.toggle('open');
        if (isOpen) closeMenu();
      });
      document.addEventListener('click', e => {
        if (!accountMenu.contains(e.target)) accountDrop.classList.remove('open');
      });
    }
  }

  window.__products = {
    PRODUCT_LABELS,
    buildProductUrl,
    navigateToProduct,
    initProductsMenu,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductsMenu);
  } else {
    initProductsMenu();
  }
})();
"""

BOOTSTRAP = r"""
<script>
window.__GAS_URL = <?!= JSON.stringify(gasUrl) ?>;
window.__GAS_PAGE = <?!= JSON.stringify(page) ?>;
window.__GAS_CONTACT_ID = <?!= JSON.stringify(contactId) ?>;
function __gasPage(page, params) {
  var base = window.__GAS_URL || '';
  var qs = ['page=' + encodeURIComponent(page)];
  if (params) {
    Object.keys(params).forEach(function (k) {
      if (params[k] != null && params[k] !== '') {
        qs.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
      }
    });
  }
  return base + (base.indexOf('?') >= 0 ? '&' : '?') + qs.join('&');
}
</script>
"""


def rewrite_navigation(html: str, product: str) -> str:
    html = html.replace(
        "window.location.href = `../perfil/index.html?id=${contactId}`",
        f"window.location.href = __gasPage('{product}-perfil', {{id: contactId}})",
    )
    html = html.replace(
        "window.location.href = '../contatos/index.html'",
        f"window.location.href = __gasPage('{product}-contatos')",
    )
    html = html.replace(
        'href="../contatos/index.html"',
        f'''href="<?!= __gasPageHref('{product}-contatos') ?>"''',
    )
    html = html.replace(
        'href="./index.html"',
        f'''href="<?!= __gasPageHref('{product}-contatos') ?>"''',
    )
    return html


def rewrite_js_for_product(js: str, product: str) -> str:
    return js.replace(
        "window.location.href = '../contatos/index.html'",
        f"window.location.href = __gasPage('{product}-contatos')",
    )


def inline_scripts_and_styles(html: str, page_dir: Path, product: str) -> str:
    def style_repl(m):
        href = m.group(1)
        local = resolve_local(page_dir, href)
        if not local:
            return m.group(0)
        css = inline_css_urls(read_text(local), local.parent)
        return f"<style>\n{css}\n</style>"

    html = re.sub(
        r'<link[^>]+rel=["\']stylesheet["\'][^>]+href=["\']([^"\']+)["\'][^>]*>',
        style_repl,
        html,
        flags=re.I,
    )
    html = re.sub(
        r'<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']stylesheet["\'][^>]*>',
        style_repl,
        html,
        flags=re.I,
    )

    def script_repl(m):
        src = m.group(2)
        if is_remote(src):
            return m.group(0)
        local = resolve_local(page_dir, src)
        if not local:
            return m.group(0)
        if local.name == "products.js":
            js = GAS_PRODUCTS_JS
        else:
            js = rewrite_js_for_product(read_text(local), product)
        return f"<script>\n{js}\n</script>"

    html = re.sub(
        r'<script([^>]*?)\ssrc=["\']([^"\']+)["\']([^>]*)>\s*</script>',
        script_repl,
        html,
        flags=re.I,
    )
    return html


ASSET_ATTR_RE = re.compile(
    r"""(?P<attr>src|href)=(?P<q>['"])(?P<url>(?:\.\.?/|./)?[^'"]+\.(?:svg|png|jpg|jpeg|gif|webp|ico))(?:\?[^'"]*)?(?P=q)""",
    re.I,
)
JS_ASSET_RE = re.compile(
    r"""(?P<q>['"])(?P<url>(?:\.\.?/)[^'"]+\.(?:svg|png|jpg|jpeg|gif|webp))(?:\?[^'"]*)?(?P=q)"""
)


def embed_assets(html: str, page_dir: Path) -> str:
    def attr_repl(m):
        url = m.group("url")
        local = resolve_local(page_dir, url)
        if not local:
            return m.group(0)
        return f'{m.group("attr")}={m.group("q")}{to_data_uri(local)}{m.group("q")}'

    html = ASSET_ATTR_RE.sub(attr_repl, html)

    def js_repl(m):
        url = m.group("url")
        local = resolve_local(page_dir, url)
        if not local:
            return m.group(0)
        return f'{m.group("q")}{to_data_uri(local)}{m.group("q")}'

    html = JS_ASSET_RE.sub(js_repl, html)
    html = inline_css_urls(html, page_dir)
    return html


def compile_page(src: Path, product: str) -> str:
    html = read_text(src)
    html = rewrite_navigation(html, product)
    html = inline_scripts_and_styles(html, src.parent, product)
    html = embed_assets(html, src.parent)
    if "<head>" in html:
        html = html.replace("<head>", "<head>\n" + BOOTSTRAP, 1)
    else:
        html = BOOTSTRAP + html
    return html


CODE_GS = r'''/**
 * RD Station Multiproduto — Web App para Google Apps Script
 *
 * Como publicar:
 * 1. Abra https://script.google.com e crie um projeto (ou use `clasp push` nesta pasta).
 * 2. Copie os arquivos desta pasta para o projeto (exceto _compile.py).
 * 3. Implantar > Nova implantação > Tipo: App da Web
 *    - Executar como: Eu
 *    - Quem tem acesso: Qualquer pessoa
 * 4. Abra a URL da implantação. A página inicial é a lista de contatos do RD Vendas.
 *
 * Rotas (?page=):
 *   vendas-contatos | vendas-perfil
 *   marketing-contatos | marketing-perfil
 *   conversas-contatos | conversas-perfil
 *
 * O cliente Supabase e os dados continuam iguais ao protótipo original.
 * Os HTML/JS do protótipo não foram alterados; este pacote é uma cópia compilada.
 */

var PAGE_FILES = {
  'vendas-contatos': 'VendasContatos',
  'vendas-perfil': 'VendasPerfil',
  'marketing-contatos': 'RdmContatos',
  'marketing-perfil': 'RdmPerfil',
  'conversas-contatos': 'RdaContatos',
  'conversas-perfil': 'RdaPerfil'
};

function doGet(e) {
  var params = (e && e.parameter) || {};
  var page = params.page || 'vendas-contatos';
  var file = PAGE_FILES[page] || 'VendasContatos';

  var template = HtmlService.createTemplateFromFile(file);
  template.gasUrl = ScriptApp.getService().getUrl();
  template.page = page;
  template.contactId = params.id || '';

  return template
    .evaluate()
    .setTitle(pageTitle(page))
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

function pageTitle(page) {
  if (page.indexOf('marketing') === 0) return 'RD Marketing';
  if (page.indexOf('conversas') === 0) return 'RD Atendimento';
  return 'RD Vendas';
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function __gasPageHref(page, id) {
  var url = ScriptApp.getService().getUrl();
  var qs = 'page=' + encodeURIComponent(page);
  if (id) qs += '&id=' + encodeURIComponent(id);
  return url + (url.indexOf('?') >= 0 ? '&' : '?') + qs;
}
'''

APPSSCRIPT_JSON = """{
  "timeZone": "America/Sao_Paulo",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "webapp": {
    "executeAs": "USER_DEPLOYING",
    "access": "ANYONE_ANONYMOUS"
  }
}
"""


def main():
    data_uri_cache.clear()
    (OUT / "appsscript.json").write_text(APPSSCRIPT_JSON, encoding="utf-8")
    (OUT / "Code.gs").write_text(CODE_GS, encoding="utf-8")

    for page_id, filename, src, product in PAGES:
        print(f"Compiling {page_id} ...")
        html = compile_page(src, product)
        dest = OUT / f"{filename}.html"
        dest.write_text(html, encoding="utf-8")
        print(f"  -> {dest.name} ({dest.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
