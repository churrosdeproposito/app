/* Churros de Propósito — service worker v5: avisos com o app fechado (push da equipe e do cliente) + notificações + abertura instantânea + casca/ícones/logo guardados.
   Precisa ficar na MESMA pasta do HTML, em endereço https.
   - Página: mostra a cópia guardada NA HORA e confere a rede em segundo plano. Se a página mudou, avisa o app ("Nova versão disponível").
   - Ícones, logo e manifest: guardados (cache primeiro).
   - Fotos do Google Drive: só são guardadas se o navegador conseguir ler a resposta (modo "cors"); senão o navegador cuida delas.
   - BACKEND: NADA de Apps Script (script.google.com) nem de Supabase (*.supabase.co) é guardado aqui.
     Dados, pedidos, login e RPCs nunca passam pelo cache do service worker — sempre vão direto para a rede.
   - O único cache de dados é o de fotos (FOTOS) e o da casca/ícones (SHELL/ASSETS). Não adicionar outros. */
const SHELL = 'churros-shell-v7';
const ASSETS = 'churros-assets-v2';   // trocou ícone/logo/manifest/leaflet? suba para v5
const FOTOS = 'churros-fotos-v1';
/* Código do app dividido em arquivos (app-*.js e estilo-*.css). Cada arquivo tem ?v=<impressão digital> na página; o cache guarda
   pela endereço COMPLETO, então uma página antiga sempre acha os arquivos antigos dela e a nova acha os novos (nunca mistura versões).
   A lista abaixo é gerada pelo script de selagem (selar.py) a cada entrega. */
const CODIGO = 'churros-codigo-v1';
const LISTA = [/*LISTA-INICIO*/
  'estilo-01-base.css?v=aa4a5d64',
  'estilo-02-chat-publico.css?v=807e23b8',
  'app-01-base-e-api.js?v=79d345d6',
  'app-02-abas.js?v=da70d86b',
  'app-03-cadastros.js?v=4870b587',
  'app-04-pedidos-entrega.js?v=12b43cfa',
  'app-05-avisos-push.js?v=14287c96',
  'app-06-caixa.js?v=4956a3f3',
  'app-07-impressao.js?v=ea0f0b18',
  'app-08-vendas-despesas.js?v=07159b49',
  'app-09-ajuda.js?v=a40039ef',
  'app-10-backup-financeiro.js?v=b0425e38',
  'app-11-admin-integracoes.js?v=f2c3cdd9',
  'app-12-gestao-ia.js?v=4ca4ae21',
  'app-13-conexao-sync.js?v=6b8cf139',
  'app-14-relatorios.js?v=38e28981',
  'app-15-cardapio-cliente.js?v=1a0570b3',
  'app-16-sessao-final.js?v=514da005',
  'app-17-sessao-supabase.js?v=add7fc79',
  'app-18-queda-supabase.js?v=79639042',
  'estilo-03-ia.css?v=2db6f3db',
  'app-19-ia.js?v=dd31b68b',
  'estilo-04-cardapio-compacto.css?v=9f400dbf',
  'estilo-05-cardapio-layout.css?v=431dee00',
  'estilo-06-ia-publica.css?v=174d4945',
  'estilo-08-balao-interno.css?v=48504d0a',
  'app-20-balao-interno.js?v=70630b0c',
  'app-21-localizacao.js?v=36151064',
  'estilo-09-navegacao-inferior.css?v=be651def',
  'estilo-10-polimento.css?v=1efe95fe',
  'app-22-navegacao-inferior.js?v=e5847991',
  'estilo-11-janelas-popup.css?v=71d0a623',
  'app-23-janelas-popup.js?v=6f031891',
  'app-24-acessibilidade.js?v=1567f2c1',
  'estilo-12-cadastro-facil.css?v=9e06f9bd',
  'app-25-cadastro-facil.js?v=a975409b',
  'estilo-13-visual.css?v=8850f8ae',
  'estilo-14-computador.css?v=0e0eb889',
  'app-26-visual.js?v=0c67507c',
/*LISTA-FIM*/];
const FOTOS_MAX = 150;
const PRE = ['manifest.webmanifest', 'icon-192.png', 'badge-96.png', 'apple-touch-icon.png', 'logo.webp', 'logo-impressao-cor.png'];
const HOSTS_FOTO = ['drive.google.com', 'lh3.googleusercontent.com'];

self.addEventListener('install', e => e.waitUntil((async () => {
  const c = await caches.open(ASSETS);
  await Promise.all(PRE.map(u => c.add(u).catch(() => {})));
  try { const cc = await caches.open(CODIGO); await Promise.all(LISTA.map(u => cc.add(u).catch(() => {}))); } catch (err) {}
  await self.skipWaiting();
})()));

self.addEventListener('activate', e => e.waitUntil((async () => {
  for (const k of await caches.keys()) {
    if ((k.indexOf('churros-shell') === 0 && k !== SHELL) || (k.indexOf('churros-assets') === 0 && k !== ASSETS)) await caches.delete(k);
  }
  try {   /* limpa do cache de código o que não está na lista atual */
    const cc = await caches.open(CODIGO);
    const validos = new Set(LISTA.map(u => new URL(u, self.registration.scope).href));
    for (const rq of await cc.keys()) if (!validos.has(rq.url)) await cc.delete(rq);
  } catch (err) {}
  await self.clients.claim();
})()));

async function avisarNovaVersao_() {
  const lista = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  lista.forEach(cl => cl.postMessage({ tipo: 'nova-versao' }));
}

/* Página: cópia guardada na hora + atualização em segundo plano (stale-while-revalidate). */
function paginaRapida_(r) {
  let fim = Promise.resolve();
  const resposta = (async () => {
    const c = await caches.open(SHELL);
    const copia = await c.match('./');
    const rede = fetch(r).then(async res => {
      if (res && res.ok) {
        if (copia) {
          try { const [a, b] = await Promise.all([res.clone().text(), copia.clone().text()]); if (a !== b) avisarNovaVersao_(); } catch (err) {}
        }
        await c.put('./', res.clone());
      }
      return res;
    });
    fim = rede.catch(() => {});
    return copia || rede;
  })();
  return { resposta, fim: resposta.then(() => fim, () => {}) };
}

async function cacheDepoisRede_(r, nome) {
  const c = await caches.open(nome);
  const hit = await c.match(r);
  if (hit) return hit;
  const res = await fetch(r);
  if (res && res.ok) c.put(r, res.clone());
  return res;
}

/* Código do app (app-*.js, estilo-*.css): cache primeiro, pelo endereço completo (com ?v=). */
async function codigoCache_(r) {
  const c = await caches.open(CODIGO);
  const hit = await c.match(r);
  if (hit) return hit;
  const res = await fetch(r);
  if (res && res.ok) c.put(r, res.clone());
  return res;
}

async function aparar_(c) {
  const ks = await c.keys();
  for (let i = 0; i < ks.length - FOTOS_MAX; i++) await c.delete(ks[i]);
}
async function fotoCache_(r) {
  const c = await caches.open(FOTOS);
  const hit = await c.match(r);
  if (hit) return hit;
  const res = await fetch(r);
  if (res && res.ok && res.type !== 'opaque') { await c.put(r, res.clone()); aparar_(c); }
  return res;
}

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const url = new URL(r.url);
  if (r.mode === 'navigate' && url.origin === self.location.origin) {
    const p = paginaRapida_(r);
    e.respondWith(p.resposta); e.waitUntil(p.fim);
    return;
  }
  if (url.origin === self.location.origin) {
    if (/\/(app|estilo)-[^/]+\.(js|css)$/.test(url.pathname)) { e.respondWith(codigoCache_(r)); return; }
    if (PRE.some(p => url.pathname.endsWith('/' + p)) || /\.(png|webp|jpe?g|svg|woff2?)$/i.test(url.pathname) || url.pathname.indexOf('/vendor/leaflet/') !== -1) e.respondWith(cacheDepoisRede_(r, ASSETS));
    return;
  }
  /* foto do Drive: só intercepta quando o app pediu em modo "cors" (com crossorigin="anonymous"); no modo normal o navegador cuida */
  if (r.mode === 'cors' && HOSTS_FOTO.indexOf(url.hostname) !== -1) { e.respondWith(fotoCache_(r)); return; }
  /* tudo o mais (inclusive script.google.com) passa direto, sem cache */
});

/* Toque no aviso: abre o app. Aviso do cliente traz um endereço ./?pedido=XXXXXXXX ou ./?feedback=XXXXXXXX:
   com o app aberto, manda a mensagem "abrir-url" para a página abrir a tela certa; fechado, abre direto nesse endereço. */
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const d = e.notification.data || {};
  const url = /^\.\/\?(pedido|feedback)=[0-9a-f]{8}$/.test(String(d.url || '')) ? d.url : './';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if ('focus' in c) { if (url !== './') c.postMessage({ tipo: 'abrir-url', url }); return c.focus(); } }
    if (self.clients.openWindow) return self.clients.openWindow(url);
  }));
});

/* Push (app fechado): o servidor manda { titulo, texto, tag, tipo, url }. Sem dados pessoais do cliente. */
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { titulo: 'Churros de Propósito', texto: e.data ? e.data.text() : '' }; }
  const titulo = String(d.titulo || 'Churros de Propósito').slice(0, 80);
  e.waitUntil(self.registration.showNotification(titulo, {
    body: String(d.texto || '').slice(0, 140), tag: String(d.tag || 'restaurante'), renotify: true,
    icon: 'icon-192.png', badge: 'badge-96.png', vibrate: [250, 120, 250, 120, 400], requireInteraction: d.tipo === 'pedido',
    data: { url: String(d.url || './') }
  }));
});
