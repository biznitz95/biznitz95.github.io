/* ============================================================
   BIZET RODRIGUEZ — site interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---------- font + accent maps (used by tweaks) ---------- */
  const ACCENTS = {
    cyan:  { accent: '#1fd0e6', ink: '#04141a' },
    pink:  { accent: '#ff2d6f', ink: '#1a0510' },
    mint:  { accent: '#14d39a', ink: '#04140e' },
    amber: { accent: '#f5a623', ink: '#1a1100' },
    violet:{ accent: '#9b6bff', ink: '#0f0820' }
  };
  const FONTS = {
    anton:   "'Anton', system-ui, sans-serif",
    oswald:  "'Oswald', system-ui, sans-serif",
    archivo: "'Archivo Black', system-ui, sans-serif",
    teko:    "'Teko', system-ui, sans-serif"
  };

  function applyTweaks(t) {
    const root = document.documentElement;
    const a = ACCENTS[t.accent] || ACCENTS.cyan;
    root.style.setProperty('--accent', a.accent);
    root.style.setProperty('--accent-ink', a.ink);
    root.style.setProperty('--glow', `color-mix(in oklab, ${a.accent} 55%, transparent)`);
    root.style.setProperty('--display', FONTS[t.font] || FONTS.anton);
    if (t.scanlines === false) document.querySelectorAll('.fx-scan').forEach(e => e.style.display = 'none');
    else document.querySelectorAll('.fx-scan').forEach(e => e.style.display = '');
  }

  const STATE = Object.assign({ accent: 'cyan', font: 'anton', scanlines: true }, window.__TWEAKS || {});
  applyTweaks(STATE);

  document.addEventListener('DOMContentLoaded', init);
  if (document.readyState !== 'loading') init();
  let inited = false;
  function init() {
    if (inited) return; inited = true;

    /* ---------- sticky topbar ---------- */
    const topbar = document.querySelector('.topbar');
    const onScroll = () => topbar.classList.toggle('stuck', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------- hero reel ---------- */
    const slides = [...document.querySelectorAll('.hero-slide')];
    const dots = [...document.querySelectorAll('.reel .dot')];
    const labelEl = document.querySelector('.reel .label');
    const hlEl = document.querySelector('.hero-headline');
    const subEl = document.querySelector('.hero-sub');
    const eyebrowTag = document.querySelector('.hero-content .eyebrow .ebtext');
    const glowEl = document.querySelector('.hero .bg-glow');
    const REEL = window.__REEL || [];
    let cur = 0, timer = null;
    const heroChar = document.querySelector('.hero-char');
    const N = REEL.length || 1;

    function go(i, user) {
      cur = (i + N) % N;
      dots.forEach((d, k) => d.classList.toggle('active', k === cur));
      const data = REEL[cur];
      if (data) {
        if (hlEl) hlEl.innerHTML = '<span class="l1">' + data.l1 + '</span><span class="l2">' + data.l2 + '</span>';
        if (subEl) subEl.textContent = data.sub;
        if (eyebrowTag) eyebrowTag.textContent = data.eyebrow;
        if (labelEl) labelEl.innerHTML = '<b>' + data.name + '</b> &nbsp;/&nbsp; ' + String(cur + 1).padStart(2, '0') + '—' + String(N).padStart(2, '0');
      }
      // re-trigger the headline entrance + a subtle character drift for life
      if (hlEl) { hlEl.classList.remove('swap'); void hlEl.offsetWidth; hlEl.classList.add('swap'); }
      if (heroChar) { heroChar.style.transform = 'scale(1.06) translateX(' + (cur % 2 ? '-' : '') + '6px)'; }
      if (user) restart();
    }
    function next() { go(cur + 1); }
    function restart() { clearInterval(timer); timer = setInterval(next, 6500); }

    dots.forEach((d, k) => d.addEventListener('click', () => go(k, true)));
    const nx = document.querySelector('.reel .next');
    const pv = document.querySelector('.reel .prev');
    if (nx) nx.addEventListener('click', () => go(cur + 1, true));
    if (pv) pv.addEventListener('click', () => go(cur - 1, true));
    document.addEventListener('keydown', (e) => {
      if (window.scrollY > window.innerHeight * 0.7) return;
      if (e.key === 'ArrowRight') go(cur + 1, true);
      if (e.key === 'ArrowLeft') go(cur - 1, true);
    });
    if (N > 1) { go(0); restart(); }

    /* ---------- scroll reveals ---------- */
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = (Math.min(i % 6, 5) * 0.06) + 's';
      io.observe(el);
    });

    /* ---------- active nav link ---------- */
    const navLinks = [...document.querySelectorAll('.topbar nav a')];
    const navMap = {};
    navLinks.forEach(a => { const id = a.getAttribute('href').slice(1); if (id) navMap[id] = a; });
    const secObs = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          navLinks.forEach(a => a.classList.remove('active'));
          if (navMap[en.target.id]) navMap[en.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('section[id]').forEach(s => secObs.observe(s));

    /* ---------- mobile menu ---------- */
    const mb = document.querySelector('.menu-btn');
    const mm = document.querySelector('.mobile-menu');
    if (mb && mm) {
      mb.addEventListener('click', () => mm.classList.add('open'));
      mm.querySelector('.close').addEventListener('click', () => mm.classList.remove('open'));
      mm.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mm.classList.remove('open')));
    }

    /* ---------- terminal typing ---------- */
    runTerminal();

    /* ---------- scroll-driven hero video ---------- */
    heroVideoScrub();

    /* ---------- tweaks ---------- */
    setupTweaks();

    /* ---------- konami easter egg ---------- */
    konami();
  }

  /* ============================================================
     HERO VIDEO — scrubs with scroll; the figure animates as you move
     ============================================================ */
  function heroVideoScrub() {
    const vid = document.querySelector('video.hero-char');
    const hero = document.querySelector('.hero');
    if (!vid || !hero) return;
    const track = (hero.parentElement && hero.parentElement.classList.contains('hero-track')) ? hero.parentElement : hero;

    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // skip the white first frame + any tail glitch
    const PAD_IN = 0.1, PAD_OUT = 0.1;
    let dur = 0, target = 0, raf = null, ready = false;

    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

    function progress() {
      const range = (track.offsetHeight - window.innerHeight) || (hero.offsetHeight * 0.92);
      const top = track.getBoundingClientRect().top + window.scrollY;
      return clamp((window.scrollY - top) / range, 0, 1);
    }

    function settle() {
      if (!ready) return;
      const t0 = PAD_IN, t1 = Math.max(t0, dur - PAD_OUT);
      const want = t0 + (t1 - t0) * progress();
      // ease toward target so seeking feels smooth, not steppy
      target += (want - target) * 0.35;
      if (Math.abs(want - target) < 0.004) target = want;
      try { vid.currentTime = target; } catch (e) {}
      if (Math.abs(want - target) > 0.004) raf = requestAnimationFrame(settle);
      else raf = null;
    }
    function onScroll() { if (!raf) raf = requestAnimationFrame(settle); }

    function start() {
      if (ready) return;
      dur = vid.duration || 4;
      ready = true;
      if (window.matchMedia('(max-width: 960px)').matches) {
        vid.loop = true;
        vid.play().catch(() => {});
        return;
      }
      target = PAD_IN;
      try { vid.currentTime = PAD_IN; } catch (e) {}
      if (!reduce) {
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        settle();
      }
    }

    // prime decoding so seeks paint immediately, then hand control to scroll
    vid.addEventListener('loadedmetadata', () => {
      const prime = vid.play();
      if (prime && prime.then) prime.then(() => { vid.pause(); start(); }).catch(start);
      else { try { vid.pause(); } catch (e) {} start(); }
    });
    if (vid.readyState >= 1) vid.dispatchEvent(new Event('loadedmetadata'));
  }

  /* ============================================================
     TERMINAL — types out an interactive-looking whoami
     ============================================================ */
  function runTerminal() {
    const body = document.querySelector('.terminal .tbody');
    if (!body) return;
    const lines = [
      { t: 'cmd', html: '<span class="p">bizet@workshop</span>:~$ whoami' },
      { t: 'out', html: 'Bizet Rodriguez &middot; maker, roboticist &amp; AI tinkerer.' },
      { t: 'out', html: 'I take ideas from <span class="hl">CAD</span> &rarr; <span class="hl">print bed</span> &rarr; <span class="hl">working machine</span>.' },
      { t: 'gap' },
      { t: 'cmd', html: '<span class="p">bizet@workshop</span>:~$ cat philosophy.txt' },
      { t: 'out', html: 'Build relentlessly. Break things on purpose.' },
      { t: 'out', html: 'Document the scars. <span class="pink">Iterate.</span>' },
      { t: 'gap' },
      { t: 'cmd', html: '<span class="p">bizet@workshop</span>:~$ ls ~/obsessions' },
      { t: 'out', html: 'robotics/  3d-printing/  ai-ml/  anime/  muay-thai/' },
      { t: 'gap' },
      { t: 'cmd', html: '<span class="p">bizet@workshop</span>:~$ <span class="cur"></span>' }
    ];
    let started = false;
    const io = new IntersectionObserver((es) => {
      es.forEach(e => { if (e.isIntersecting && !started) { started = true; typeLines(); io.disconnect(); } });
    }, { threshold: 0.3 });
    io.observe(body);

    function typeLines() {
      let i = 0;
      function nextLine() {
        if (i >= lines.length) return;
        const ln = lines[i++];
        if (ln.t === 'gap') { const d = document.createElement('div'); d.style.height = '10px'; body.appendChild(d); setTimeout(nextLine, 120); return; }
        const div = document.createElement('div');
        div.className = ln.t === 'cmd' ? 'cmd' : 'out';
        body.appendChild(div);
        if (ln.t === 'cmd') { div.innerHTML = ln.html; setTimeout(nextLine, 360); }
        else { typeHTML(div, ln.html, nextLine); }
      }
      nextLine();
    }
    function typeHTML(el, html, done) {
      // derive plain text so we never slice mid-tag / mid-entity
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      const plain = tmp.textContent;
      let i = 0;
      const speed = 11;
      function step() {
        i += 1;
        el.textContent = plain.slice(0, i);
        if (i < plain.length) setTimeout(step, speed);
        else { el.innerHTML = html; done && setTimeout(done, 200); }
      }
      step();
    }
  }

  /* ============================================================
     TWEAKS PANEL  (host protocol)
     ============================================================ */
  function setupTweaks() {
    const panel = document.getElementById('tweaks');
    if (!panel) return;

    // register listener BEFORE announcing availability
    window.addEventListener('message', (e) => {
      const d = e.data || {};
      if (d.type === '__activate_edit_mode') panel.classList.add('open');
      if (d.type === '__deactivate_edit_mode') panel.classList.remove('open');
    });
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');

    function persist(edits) {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
    }

    // accent swatches
    panel.querySelectorAll('[data-accent]').forEach(b => {
      b.classList.toggle('sel', b.dataset.accent === STATE.accent);
      b.addEventListener('click', () => {
        STATE.accent = b.dataset.accent;
        applyTweaks(STATE);
        panel.querySelectorAll('[data-accent]').forEach(x => x.classList.toggle('sel', x === b));
        persist({ accent: STATE.accent });
      });
    });
    // fonts
    panel.querySelectorAll('[data-font]').forEach(b => {
      b.classList.toggle('sel', b.dataset.font === STATE.font);
      b.addEventListener('click', () => {
        STATE.font = b.dataset.font;
        applyTweaks(STATE);
        panel.querySelectorAll('[data-font]').forEach(x => x.classList.toggle('sel', x === b));
        persist({ font: STATE.font });
      });
    });
    // scanlines toggle
    const sc = panel.querySelector('#tw-scan');
    if (sc) {
      sc.checked = STATE.scanlines !== false;
      sc.addEventListener('change', () => {
        STATE.scanlines = sc.checked;
        applyTweaks(STATE);
        persist({ scanlines: STATE.scanlines });
      });
    }
    // close
    const close = panel.querySelector('.tw-close');
    if (close) close.addEventListener('click', () => {
      panel.classList.remove('open');
      window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
    });
  }

  /* ============================================================
     KONAMI — flips a hidden "rampage" glow
     ============================================================ */
  function konami() {
    const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let p = 0;
    document.addEventListener('keydown', (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      p = (k === seq[p]) ? p + 1 : (k === seq[0] ? 1 : 0);
      if (p === seq.length) {
        p = 0;
        document.body.classList.add('rampage');
        const t = document.createElement('div');
        t.className = 'konami-toast';
        t.textContent = '// SYSTEM OVERCLOCKED — 無敵モード';
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 3200);
      }
    });
  }
})();
