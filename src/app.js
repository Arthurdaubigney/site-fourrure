(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Scroll reveals
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal, .line-mask').forEach((el) => io.observe(el));
  // clipped images are observed through their wrapper (clip-path zeroes their own box)
  $$('.img-reveal').forEach((el) => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); o.disconnect(); } }, { threshold: 0.15 });
    o.observe(el.parentElement);
  });
  // hero (visible on load)
  requestAnimationFrame(() => $$('#top > section:first-child .reveal, #top > section:first-child .line-mask').forEach((el) => el.classList.add('in')));

  // Nav + floating CTA + parallax
  const nav = $('#nav'), fab = $('#floatCta'), form = $('#estimation');
  if (form) fab.setAttribute('href', '#estimation');
  $$('.nav-link').forEach((a) => { if (a.getAttribute('href') === location.pathname.replace(/\/$/, '') || (a.getAttribute('href') === '/' && location.pathname === '/')) a.setAttribute('aria-current', 'page'); });
  const par = $$('[data-parallax]');
  let ticking = false;
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('bg-ink-950/80', y > 40);
    nav.classList.toggle('backdrop-blur-md', y > 40);
    const fr = form ? form.getBoundingClientRect() : null;
    const ft = $('footer');
    const show = y > innerHeight * 0.7 && !(ft && ft.getBoundingClientRect().top < innerHeight - 40) && !(fr && fr.top < innerHeight * 0.6 && fr.bottom > innerHeight * 0.3);
    fab.classList.toggle('opacity-0', !show);
    fab.classList.toggle('translate-y-6', !show);
    fab.classList.toggle('pointer-events-none', !show);
    if (!reduce) par.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      el.style.transform = `translate3d(0, ${(r.top + r.height / 2 - innerHeight / 2) * -Number(el.dataset.parallax)}px, 0)`;
    });
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // Card tilt + glare
  if (!reduce && matchMedia('(hover: hover)').matches) {
    $$('[data-tilt]').forEach((c) => {
      c.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.transform = `perspective(1100px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 6}deg)`;
        c.style.setProperty('--mx', x * 100 + '%'); c.style.setProperty('--my', y * 100 + '%');
      });
      c.addEventListener('pointerleave', () => { c.style.transform = ''; });
    });
  }

  // Mobile menu
  const btn = $('#menuBtn'), menu = $('#mobileMenu');
  const setMenu = (open) => {
    btn.setAttribute('aria-expanded', open); menu.setAttribute('aria-hidden', !open);
    menu.classList.toggle('opacity-0', !open); menu.classList.toggle('pointer-events-none', !open);
    menu.classList.toggle('translate-y-[-4%]', !open); document.body.style.overflow = open ? 'hidden' : '';
  };
  btn.addEventListener('click', () => setMenu(btn.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  // Tally embed (official loader pattern; iframe-resizer grows the iframe to the full form height)
  const tallyFrames = $$('iframe[data-tally-src]');
  if (tallyFrames.length) {
    const w = 'https://tally.so/widgets/embed.js';
    const v = () => {
      if (typeof Tally !== 'undefined') Tally.loadEmbeds();
      else tallyFrames.forEach((f) => { if (!f.src) f.src = f.dataset.tallySrc; });
    };
    if (typeof Tally !== 'undefined') v();
    else {
      const s = document.createElement('script');
      s.src = w; s.onload = v; s.onerror = v; document.body.appendChild(s);
    }
  }
  $$('details').forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) $$('details').forEach((o) => { if (o !== d) o.open = false; });
  }));

  const yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();
})();
