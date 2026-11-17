// The top bar and the design picker: the same site in six designs. The home page always shows the default design. Code Apache-2.0.
(() => {
  const me = document.currentScript, slug = me.dataset.slug || 'brief';
  // The home page always shows the default design. Earlier versions remembered the last design a visitor
  // opened and jumped to it; that memory is cleared here so nobody is sent away from the home page.
  try { localStorage.removeItem('yw-design'); } catch {}
  const bar = document.createElement('div');
  bar.className = 'yw-bar';
  bar.innerHTML = '<span>Yiheng (Vicky) Wang, Project Manager and AI Operations</span><span class="yw-bar-sep" aria-hidden="true">|</span><button type="button" class="yw-bar-pick" data-yw-picker>Choose a design</button><a href="/photos/">Photos</a><a href="/agents/">Use with AI</a><a href="/#contact">Contact</a><a href="/assets/cv/YihengWang_CV.pdf">CV (PDF)</a>';
  document.body.prepend(bar);
  let box;
  async function open() {
    if (!box) {
      const m = await (await fetch('/designs.json')).json();
      box = document.createElement('div'); box.className = 'yw-pick'; box.hidden = true;
      box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Choose a design');
      const card = d => `<a class="yw-pick-card" href="${d.path}" data-slug="${d.slug}"${d.slug === slug ? ' aria-current="true"' : ''}><div class="yw-pick-thumb" style="background-image:url('${d.thumb}')"></div><strong>${d.name}</strong><span>${d.tagline}</span></a>`;
      box.innerHTML = `<div class="yw-pick-box"><button type="button" class="yw-pick-close" aria-label="Close">×</button><h2>Choose a design</h2><p>The same site, the same facts and sources, in six designs.</p><div class="yw-pick-grid">${m.designs.map(card).join('')}</div></div>`;
      document.body.appendChild(box);
      box.addEventListener('click', e => { if (e.target === box || e.target.closest('.yw-pick-close')) close(); });
          }
    box.hidden = false; document.body.style.overflow = 'hidden'; box.querySelector('.yw-pick-close').focus();
  }
  function close() { box.hidden = true; document.body.style.overflow = ''; document.querySelector('[data-yw-picker]')?.focus(); }
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && box && !box.hidden) close(); });
  document.querySelectorAll('[data-yw-picker]').forEach(b => b.addEventListener('click', open));
})();
