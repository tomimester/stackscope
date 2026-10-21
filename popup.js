// Popup: collects clues from the page, headers and cookies, then renders the stack.

const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};

let showEvidence = false;
try { showEvidence = localStorage.getItem('evidence') === '1'; } catch {}
$('evidence').checked = showEvidence;
document.body.classList.toggle('with-evidence', showEvidence);
$('evidence').addEventListener('change', (e) => {
  showEvidence = e.target.checked;
  document.body.classList.toggle('with-evidence', showEvidence);
  try { localStorage.setItem('evidence', showEvidence ? '1' : '0'); } catch {}
});
$('refresh').addEventListener('click', () => scan());

function createStore() {
  const map = new Map();
  const add = (name, evidence, version, implied = false) => {
    let t = map.get(name);
    if (!t) {
      t = { name, evidence: [], version: null, implied };
      map.set(name, t);
    }
    if (!implied) t.implied = false; // direct evidence beats inference
    if (evidence && !t.evidence.includes(evidence)) t.evidence.push(evidence);
    if (version && !t.version) t.version = String(version);
  };
  return { map, add };
}

// WordPress -> PHP + MySQL, Next.js -> React + Node.js, ... (transitively)
function applyImplications(store) {
  const queue = [...store.map.values()];
  while (queue.length) {
    const t = queue.shift();
    for (const target of TECH[t.name]?.implies || []) {
      const existed = store.map.has(target);
      store.add(target, `implied by ${t.name}`, null, true);
      if (!existed) queue.push(store.map.get(target));
    }
  }
}

async function getHeaders(tab) {
  const origin = new URL(tab.url).origin;
  try {
    const key = `tab:${tab.id}`;
    const rec = (await chrome.storage.session.get(key))[key];
    if (rec && new URL(rec.url).origin === origin) return { headers: rec.headers, source: 'captured when the page loaded' };
  } catch {}
  // Page was loaded before the extension was installed: request it again ourselves.
  try {
    const res = await fetch(tab.url, { credentials: 'include', cache: 'no-store' });
    const headers = {};
    res.headers.forEach((v, k) => { headers[k.toLowerCase()] = v; });
    return { headers, source: 'fetched just now — reload the page for best results' };
  } catch {
    return { headers: {}, source: 'unavailable' };
  }
}

async function scan() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  $('sections').replaceChildren(el('div', 'loading', 'Scanning…'));
  $('headline').textContent = '';
  $('source').textContent = '';

  if (!tab || !/^https?:/.test(tab.url || '')) {
    $('host').textContent = 'Not a website';
    $('sections').replaceChildren(el('div', 'message', 'Open a regular http(s) web page, then click the StackScope icon again.'));
    return;
  }

  const url = new URL(tab.url);
  $('host').textContent = url.hostname.replace(/^www\./, '');
  if (tab.favIconUrl) $('favicon').src = tab.favIconUrl;
  else $('favicon').style.visibility = 'hidden';

  const store = createStore();
  const notes = [];

  const [page, hdr, cookies] = await Promise.all([
    chrome.scripting.executeScript({ target: { tabId: tab.id }, world: 'MAIN', files: ['detect.js'] })
      .then((r) => r[0]?.result)
      .catch((e) => { notes.push('page scan blocked (' + e.message + ')'); return null; }),
    getHeaders(tab),
    chrome.cookies.getAll({ url: tab.url }).catch(() => []),
  ]);

  for (const f of page?.found || []) for (const ev of f.evidence) store.add(f.name, ev, f.version);
  analyzeHeaders(hdr.headers, store.add);
  analyzeCookies(cookies.map((c) => c.name), store.add);
  applyImplications(store);

  render([...store.map.values()]);
  $('source').textContent = `Response headers: ${hdr.source}${notes.length ? ' · ' + notes.join(' · ') : ''}`;
}

function sortKey(t) {
  const cat = TECH[t.name]?.cat;
  const sec = SECTIONS.find((s) => s.cats.includes(cat));
  return (sec ? sec.cats.indexOf(cat) : 99) * 10 + (t.implied ? 1 : 0);
}

function render(techs) {
  const bySection = new Map(SECTIONS.map((s) => [s.id, []]));
  const other = [];
  for (const t of techs) {
    const cat = TECH[t.name]?.cat;
    const sec = SECTIONS.find((s) => s.cats.includes(cat));
    (sec ? bySection.get(sec.id) : other).push(t);
  }
  for (const list of bySection.values()) list.sort((a, b) => sortKey(a) - sortKey(b) || a.name.localeCompare(b.name));

  renderHeadline(bySection);

  const root = $('sections');
  root.replaceChildren();
  for (const s of SECTIONS) {
    const list = bySection.get(s.id);
    if (!list.length && !s.empty) continue;

    const section = el('section', `section section-${s.id}`);
    section.append(el('h2', null, s.title));
    if (!list.length) {
      section.append(el('div', 'empty', s.empty));
    } else {
      const ul = el('ul', 'techs');
      for (const t of list) ul.append(renderTech(t));
      section.append(ul);
    }
    root.append(section);
  }
}

function renderTech(t) {
  const info = TECH[t.name] || {};
  const li = el('li', `tech${t.implied ? ' implied' : ''}`);
  li.title = info.desc || '';

  const row = el('div', 'row');
  const name = el('span', 'name', t.name);
  if (t.version) name.append(el('span', 'version', t.version));
  row.append(name, el('span', 'cat', t.implied ? `${info.cat || ''} · inferred` : info.cat || ''));
  li.append(row);

  const details = el('div', 'details');
  if (info.desc) details.append(el('div', 'desc', info.desc));
  for (const ev of t.evidence.slice(0, 3)) details.append(el('div', 'ev', ev));
  li.append(details);
  return li;
}

// One-line summary for the big screen: "WordPress · PHP · MySQL / MariaDB · Nginx · Cloudflare"
function renderHeadline(bySection) {
  const first = (id, cats) => bySection.get(id).find((t) => !cats || cats.includes(TECH[t.name]?.cat));
  const picks = [
    first('platform', ['CMS', 'E-commerce', 'Site builder', 'Static site generator']),
    first('frontend', ['Meta-framework']),
    first('frontend', ['JavaScript framework']),
    first('backend', ['Backend framework']),
    first('backend', ['Programming language', 'Runtime']),
    first('database'),
    first('infra', ['Hosting / PaaS', 'CDN']) || first('infra', ['Web server']),
  ].filter(Boolean);
  const names = [...new Set(picks.map((t) => t.name))];

  const box = $('headline');
  box.replaceChildren();
  if (!names.length) {
    box.append(el('span', 'none', 'No well-known technology detected'));
    return;
  }
  names.forEach((n, i) => {
    if (i) box.append(el('span', 'sep', '·'));
    box.append(el('span', 'pick', n));
  });
}

scan();
