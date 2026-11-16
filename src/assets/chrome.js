// The top bar and the design picker: the same site in five designs. The choice is kept in this browser only. Code Apache-2.0.
(() => {
  const me = document.currentScript, slug = me.dataset.slug || 'brief';
  const KEY = 'yw-design';
  const store = { get() { try { return localStorage.getItem(KEY); } catch { return null; } }, set(v) { try { localStorage.setItem(KEY, v); } catch {} } };
  const q = new URLSearchParams(location.search).get('design');
  if (q) store.set(q);
  // The home page remembers a chosen design and opens it, unless ?design= says otherwise.
  const home = location.pathname === '/' || location.pathname === '/index.html';
  if (home && !q) { const saved = store.get(); if (saved && saved !== slug) fetch('/designs.json').then(r => r.json()).then(m => { const d = m.designs.find(x => x.slug === saved); if (d) location.replace(d.path); }).catch(() => {}); }
  if (slug !== 'page' && !q) store.set(slug);
  const bar = document.createElement('div');
  bar.className = 'yw-bar';
  bar.innerHTML = '<span>Yiheng Wang, Project Manager and PMO Coordinator</span><span class="yw-bar-sep" aria-hidden="true">|</span><button type="button" class="yw-bar-pick" data-yw-picker>Choose a design</button><a href="/photos/">Photos</a><a href="/agents/">Use with AI</a><a href="/#contact">Contact</a><a href="/assets/cv/YihengWang_CV.pdf">CV (PDF)</a>';
  document.body.prepend(bar);
  let box;
  async function open() {
    if (!box) {
      const m = await (await fetch('/designs.json')).json();
      box = document.createElement('div'); box.className = 'yw-pick'; box.hidden = true;
      box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Choose a design');
      const card = d => `<a class="yw-pick-card" href="${d.path}?design=${d.slug}" data-slug="${d.slug}"${d.slug === slug ? ' aria-current="true"' : ''}><div class="yw-pick-thumb" style="background-image:url('${d.thumb}')"></div><strong>${d.name}</strong><span>${d.tagline}</span></a>`;
      box.innerHTML = `<div class="yw-pick-box"><button type="button" class="yw-pick-close" aria-label="Close">×</button><h2>Choose a design</h2><p>The same site, the same facts and sources, in five designs. Your choice is kept in this browser only.</p><div class="yw-pick-grid">${m.designs.map(card).join('')}</div></div>`;
      document.body.appendChild(box);
      box.addEventListener('click', e => { if (e.target === box || e.target.closest('.yw-pick-close')) close(); });
      box.querySelectorAll('.yw-pick-card').forEach(a => a.addEventListener('click', () => store.set(a.dataset.slug)));
    }
    box.hidden = false; document.body.style.overflow = 'hidden'; box.querySelector('.yw-pick-close').focus();
  }
  function close() { box.hidden = true; document.body.style.overflow = ''; document.querySelector('[data-yw-picker]')?.focus(); }
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && box && !box.hidden) close(); });
  document.querySelectorAll('[data-yw-picker]').forEach(b => b.addEventListener('click', open));
})();
