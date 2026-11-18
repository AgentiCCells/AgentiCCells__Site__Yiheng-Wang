// The top bar and the design picker: the same site in five designs. The home page always shows the default design. Code Apache-2.0.
(() => {
  const me = document.currentScript, slug = me.dataset.slug || 'brief';
  // The home page always shows the default design. Earlier versions remembered the last design a visitor
  // opened and jumped to it; that memory is cleared here so nobody is sent away from the home page.
  try { localStorage.removeItem('yw-design'); } catch {}
  const bar = document.createElement('div');
  bar.className = 'yw-bar';
  bar.innerHTML = '<span>Yiheng (Vicky) Wang, Project Manager and AI Operations</span><span class="yw-bar-sep" aria-hidden="true">|</span><a href="/photos/">Photos</a><a href="/agents/">Use with AI</a><a href="/#contact">Contact</a><a href="/assets/cv/YihengWang_CV.pdf">CV (PDF)</a>';
  document.body.prepend(bar);
  let box;
  async function open() {
    if (!box) {
      const m = await (await fetch('/designs.json')).json();
      box = document.createElement('div'); box.className = 'yw-pick'; box.hidden = true;
      box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Choose a design');
      const card = d => `<a class="yw-pick-card" href="${d.path}" data-slug="${d.slug}"${d.slug === slug ? ' aria-current="true"' : ''}><div class="yw-pick-thumb" style="background-image:url('${d.thumb}')"></div><strong>${d.name}</strong><span>${d.tagline}</span></a>`;
      box.innerHTML = `<div class="yw-pick-box"><button type="button" class="yw-pick-close" aria-label="Close">×</button><h2>Choose a design</h2><p>The same site, the same facts and sources, in five designs.</p><div class="yw-pick-grid">${m.designs.map(card).join('')}</div></div>`;
      document.body.appendChild(box);
      box.addEventListener('click', e => { if (e.target === box || e.target.closest('.yw-pick-close')) close(); });
          }
    box.hidden = false; document.body.style.overflow = 'hidden'; box.querySelector('.yw-pick-close').focus();
  }
  function close() { box.hidden = true; document.body.style.overflow = ''; document.querySelector('[data-yw-picker]')?.focus(); }
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && box && !box.hidden) close(); });
  // "Choose a design" sits in the page footer (the last footer that is not part of a quote).
  const foot = [...document.querySelectorAll('footer')].filter(f => !f.closest('blockquote,figure')).pop();
  if (foot) { const p = document.createElement('p'); p.className = 'yw-foot-pick'; p.innerHTML = '<button type="button" data-yw-picker>Choose a design</button> &middot; this site comes in five designs with the same facts'; (foot.querySelector('.wrap') || foot).appendChild(p); }
  document.querySelectorAll('[data-yw-picker]').forEach(b => b.addEventListener('click', open));

  // "Hire her" cursor in each design's own colour: it replaces the mouse arrow. Over links and buttons the normal pointer returns.
  const HT = { pass: ['#8c1f4f', '#ffffff'], brief: ['#4a1fa3', '#ffffff'], profile: ['#c4602a', '#ffffff'], control: ['#e3bd72', '#06110e'], journey: ['#ffd58a', '#1d1426'] };
  if (HT[slug] && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    const t = document.createElement('div'); t.className = 'hire-tag off'; t.setAttribute('aria-hidden', 'true');
    t.innerHTML = `<svg viewBox="0 0 20 24"><path d="M1.5 1.5 L1.5 19 L6 14.6 L9.2 22 L12.4 20.6 L9.3 13.4 L15.5 13.4 Z" fill="${HT[slug][0]}" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg><b>Hire her</b>`;
    t.style.setProperty('--ht-bg', HT[slug][0]); t.style.setProperty('--ht-fg', HT[slug][1]);
    document.body.appendChild(t);
    const root = document.documentElement;
    const set = on => { t.classList.toggle('off', !on); root.classList.toggle('ht-on', on); };
    addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return set(false);
      t.style.transform = `translate(${e.clientX - 1}px,${e.clientY - 1}px)`;
      set(!e.target.closest('a,button,summary,label,input,select,textarea,[role="button"],.yw-bar,.yw-pick,#plan'));
    }, { passive: true });
    document.addEventListener('pointerleave', () => set(false));
    addEventListener('blur', () => set(false));
  }
})();
