/**
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
