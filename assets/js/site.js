/* NERO — A New Renaissance. Client-side routing, home interactions and the Perspectives hub.
   No build step. The hero sparkle lives in hero-sparkles.js and is intentionally untouched. */
(function () {
  'use strict';

  /* ───────────── Data ───────────── */
  // slug = value used in content/perspectives/*.md `groups:`; img = file name in assets/images/fields/
  const FIELDS = [
    { slug: 'narrative', img: 'narrative', title: 'New European Narrative and Identification', short: 'Narrative',
      statement: 'Our civilisatory achievements and cultural richness still inspire hope and desire.',
      question: 'How can we promote European unity, dynamism and way of life through a strong and aspirational story of our continent?' },
    { slug: 'tech', img: 'technology', pos: 'center 15%', title: 'New Technology Leadership', short: 'Technology',
      statement: "Technological innovation and its adoption define a society's prosperity and power.",
      question: 'How can we unleash European pioneering spirit, inventiveness and craftmanship to become global technology leader again?' },
    { slug: 'state-governance', img: 'state-governance', title: 'New State and Governance Models', short: 'State & Governance',
      statement: 'A robust and competitive democracy needs to deliver superior outcomes for its citizens.',
      question: 'How can we rebuild our state and our governance as reliable systems, defined by speed, efficiency, accountability and trust?' },
    { slug: 'capital-market', img: 'capital-markets', pos: 'center 100%', title: 'New Private Capital Union', short: 'Capital Markets',
      statement: 'Entrepreneurial drive, financial security and personal freedom are built on ownership.',
      question: 'How can we turn Europeans into owners and leverage private capital to fuel growth and public goods within a unified market?' },
    { slug: 'citizenship', img: 'citizenship', pos: 'center 80%', title: 'New Role of Citizenship in Europe', short: 'Citizenship',
      statement: 'A strong continent in a complex world needs independent and engaged individuals.',
      question: 'How can we empower citizens to take action in order to build healthy communities, a thriving economy and an effective state?' },
    { slug: 'local-ecosystems', img: 'local-ecosystems', pos: 'center 15%', title: 'New Local Ecosystems and Healthy Communities', short: 'Local Ecosystems',
      statement: 'Safe, healthy, connected and fulfilling lives are primarily enabled by local communities.',
      question: 'How can we strengthen local ecosystems, businesses, clubs and authorities to create the best possible living environments?' },
    { slug: 'infrastructure', img: 'infrastructure', title: 'New Infrastructure and Public Good Philosophy', short: 'Infrastructure',
      statement: 'Superior public infrastructure for everyone is a cornerstone of the European identity.',
      question: 'How can we make public good policy work again to enable excellent life quality, social mobility and trust in our model of society?' },
    { slug: 'defense', img: 'defense', title: 'New Defense and Resilience', short: 'Defense',
      statement: 'A peaceful and war-weary Europe has now become a target, unable to defend itself.',
      question: 'How can we quickly rebuild the military force and resilience to prevent attacks and defend Europe as an independent power?' },
    { slug: 'education', img: 'education', title: 'New Education', short: 'Education',
      statement: 'Strong independent public education and research are now needed more than ever.',
      question: 'How can we update our education systems and institutions to enable humans, citizens and builders that thrive in today’s world?' },
    { slug: 'energy', img: 'energy', pos: 'center 65%', title: 'New Energy', short: 'Energy',
      statement: 'Energy is the most important enabler for a thriving society and its economy.',
      question: 'How can we become the leader in clean and affordable energy, building on technology, smart markets and a vision of abundance?' },
  ];
  // Pseudo-category for articles that are not tied to exactly one action field (none, or several).
  const COMMONPLACE = { slug: 'commonplace', short: 'Commonplace Monthly' };
  const TYPE_LABELS = { Essay: 'Essays', Report: 'Reports', Interview: 'Interviews', Commentary: 'Commentary' };
  const MEMBERS_ONLY = true; // article links open the gate until member login exists …
  const OPEN_ARTICLES = ['governing-with-goals']; // … except these slugs, which are publicly readable
  const FIRST_PAGE = 7, PAGE_STEP = 6;

  const fieldBySlug = (slug) => FIELDS.find((f) => f.slug === slug);
  const pad2 = (n) => String(n + 1).padStart(2, '0');
  const esc = (s) => noBreakText(String(s == null ? '' : s)).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // Never break "New Renaissance" or "21st century" across lines.
  const noBreakText = (s) => s.replace(/\b(new) +(renaissance)\b/gi, '$1\u00a0$2').replace(/\b(21st) +(century)\b/gi, '$1\u00a0$2');
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function formatDate(iso) {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso || '');
    return m ? `${parseInt(m[3], 10)} ${MONTHS[parseInt(m[2], 10) - 1]} ${m[1]}` : '';
  }

  /* ───────────── Star rings (SVG generated, no image file) ───────────── */
  const STAR_PTS = Array.from({ length: 10 }, (_, k) => {
    const r = k % 2 ? 3.9 : 9.5, a = -Math.PI / 2 + (k * Math.PI) / 5;
    return (r * Math.cos(a)).toFixed(2) + ',' + (r * Math.sin(a)).toFixed(2);
  }).join(' ');
  function ringAt(i, radius) {
    const a = -Math.PI / 2 + (i * Math.PI) / 6;
    return [(radius * Math.cos(a)).toFixed(2), (radius * Math.sin(a)).toFixed(2)];
  }
  function bigRingSVG() {
    const stars = Array.from({ length: 12 }, (_, i) => {
      const [x, y] = ringAt(i, 78);
      return `<g transform="translate(${x} ${y})"><polygon class="ring-star" style="--i:${i}" points="${STAR_PTS}" fill="#D9C6D6"/></g>`;
    }).join('');
    return `<svg class="ring-big" viewBox="-100 -100 200 200" aria-hidden="true"><g class="ring-spin">${stars}</g></svg>`;
  }
  function miniRingSVG() {
    const stars = Array.from({ length: 12 }, (_, i) => {
      const [x, y] = ringAt(i, 76);
      return `<polygon points="${STAR_PTS}" fill="#C4717A" transform="translate(${x} ${y}) scale(1.55)"/>`;
    }).join('');
    return `<svg class="ring-mini" viewBox="-100 -100 200 200" aria-hidden="true">${stars}</svg>`;
  }

  /* ───────────── Routing ───────────── */
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;
  const header = $('#siteHeader');
  const VIEW_PATHS = { home: '/', perspectives: '/perspectives', imprint: '/imprint', privacy: '/privacy' };
  let currentView = 'home', articleSlug = null;
  const DEFAULT_DESC = $('#metaDesc').getAttribute('content');

  // Old site routes → new homes (keeps bookmarks and shared links working).
  function resolveLocation(loc) {
    const path = loc.pathname.replace(/\/+$/, '').toLowerCase() || '/';
    const out = { view: 'home', hash: loc.hash.replace('#', ''), search: loc.search, gate: false, canonical: null, article: null };
    if (path === '/') return out;
    if (path === '/perspectives') { out.view = 'perspectives'; return out; }
    if (path === '/imprint') { out.view = 'imprint'; return out; }
    if (path === '/privacy') { out.view = 'privacy'; return out; }
    if (path === '/mission') { out.hash = 'mission'; out.canonical = '/#mission'; return out; }
    if (path === '/get-involved' || path === '/stay-informed') { out.hash = 'join'; out.canonical = '/#join'; return out; }
    if (path.indexOf('/perspectives/') === 0 && OPEN_ARTICLES.includes(path.slice('/perspectives/'.length))) {
      out.view = 'article'; out.article = path.slice('/perspectives/'.length); return out;
    }
    if (path.indexOf('/perspectives/') === 0) {
      out.view = 'perspectives';
      out.gate = path.indexOf('/perspectives/author/') !== 0; // article deep link → members-only dialog
      out.canonical = '/perspectives';
      return out;
    }
    out.canonical = '/';
    return out;
  }

  function scrollToId(id, smooth) {
    const el = document.getElementById(id);
    if (!el) return false;
    const offset = id === 'join' ? 100 : 84;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: smooth ? 'smooth' : 'instant' });
    return true;
  }

  function updateHeader() {
    let solid;
    if (currentView === 'imprint' || currentView === 'privacy' || currentView === 'article') solid = true;
    else if (currentView === 'home') solid = window.scrollY > window.innerHeight * 0.8;
    else solid = window.scrollY > 120;
    header.classList.toggle('is-solid', solid);
  }

  function showView(view, opts) {
    opts = opts || {};
    const changed = view !== currentView;
    // Cross-fade between pages where the View Transitions API exists (not on first paint, not for reduced motion).
    if (changed && !opts.instant && document.startViewTransition && !REDUCED_MOTION) {
      const vt = document.startViewTransition(() => applyView(view, opts, changed));
      // Skipped transitions (e.g. hidden tab) reject these promises; the page change itself still happens.
      vt.ready.catch(() => {}); vt.finished.catch(() => {});
      return;
    }
    applyView(view, opts, changed);
  }
  function applyView(view, opts, changed) {
    currentView = view;
    body.dataset.view = view;
    $$('.view').forEach((v) => { v.classList.toggle('is-active', v.id === 'view-' + view); });
    const active = $('#view-' + view);
    document.title = active.dataset.title;
    articleSlug = view === 'article' ? opts.article || null : null;
    $('#metaDesc').setAttribute('content', DEFAULT_DESC);
    $('#metaRobots').setAttribute('content', active.hasAttribute('data-noindex') ? 'noindex, nofollow' : 'index, follow');
    $$('[data-nav]').forEach((a) => {
      if (a.dataset.nav === view || (view === 'article' && a.dataset.nav === 'perspectives')) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    if (opts.hash) {
      scrollToId(opts.hash, !changed && opts.smooth);
      // Layout can still shift while images/fonts settle — correct once more.
      setTimeout(() => scrollToId(opts.hash, false), 400);
    } else if (changed || opts.top) {
      window.scrollTo({ top: 0, left: 0, behavior: changed ? 'instant' : 'smooth' });
    }
    if (view === 'article') renderArticle();
    if (view === 'home') fitFieldText();
    updateHeader();
  }

  function applyFeedParams(search) {
    const p = new URLSearchParams(search || '');
    const f = p.get('field');
    if (f && (f === COMMONPLACE.slug || fieldBySlug(f))) { feed.field = f; feed.limit = FIRST_PAGE; renderFeed(Infinity); return true; }
    return false;
  }

  function go(url, opts) {
    opts = opts || {};
    const u = new URL(url, location.origin);
    const r = resolveLocation(u);
    closeGate();
    const samePage = r.view === currentView && location.pathname === u.pathname;
    const next = r.canonical || (r.view === 'perspectives' ? '/perspectives' : u.pathname + u.search + u.hash);
    if (opts.replace) history.replaceState({}, '', next); else if (location.pathname + location.search + location.hash !== next) history.pushState({}, '', next);
    if (r.view === 'perspectives' && applyFeedParams(r.search)) r.hash = r.hash || 'latest';
    showView(r.view, { hash: r.hash, smooth: samePage, top: samePage && !r.hash, article: r.article });
    if (r.gate) openGate();
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a');
    if (!a) return;
    if (a.matches('a[data-article]')) {
      const slug = (a.getAttribute('href') || '').split('/').pop();
      if (!MEMBERS_ONLY || OPEN_ARTICLES.includes(slug)) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return; // let the browser open a new tab
        e.preventDefault(); go(a.getAttribute('href')); return;
      }
      e.preventDefault(); openGate(); return;
    }
    if (!a.hasAttribute('data-route') || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
    e.preventDefault();
    go(a.getAttribute('href'));
  });
  window.addEventListener('popstate', () => {
    const r = resolveLocation(location);
    closeGate();
    if (r.view === 'perspectives') applyFeedParams(r.search);
    showView(r.view, { hash: r.hash, article: r.article });
    if (r.gate) openGate();
  });
  window.addEventListener('scroll', updateHeader, { passive: true });
  window.addEventListener('resize', updateHeader);

  /* ───────────── Home: action fields ───────────── */
  let activeField = 0;
  const fieldsList = $('#fieldsList'), fieldsMobile = $('#fieldsMobile');
  function fieldImgURL(f, thumb) { return `/assets/images/fields/${thumb ? 'thumbs/' : ''}${f.img}.avif`; }

  function renderFieldRows() {
    fieldsList.innerHTML = FIELDS.map((f, i) => `
      <button class="field-row" data-i="${i}" aria-pressed="${i === activeField}">
        <span class="field-num">${pad2(i)}</span><span class="field-title">${esc(f.title)}</span><span class="field-arrow" aria-hidden="true">→</span>
      </button>`).join('');
  }
  let fieldSwapToken = 0;
  function renderFieldPanel(animate) {
    const f = FIELDS[activeField], token = ++fieldSwapToken;
    $$('.field-row', fieldsList).forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.i === activeField)));
    const photo = $('#fieldPanel .field-photo'), url = fieldImgURL(f);
    const setText = () => {
      $('#fieldTitle').textContent = f.title;
      $('#fieldStatement').textContent = f.statement;
      $('#fieldQuestion').textContent = f.question;
    };
    if (!animate || REDUCED_MOTION) {
      setText();
      const img = $('#fieldImg'); img.style.objectPosition = f.pos || 'center';
      const pre = new Image(); pre.onload = () => { if (token === fieldSwapToken) img.src = url; }; pre.src = url;
      return;
    }
    setText(); // text changes instantly; only the photo cross-fades
    // Photo: the new image fades in (with a hint of settling zoom) on top of the old one, which is then removed.
    const pre = new Image();
    pre.onload = () => {
      if (token !== fieldSwapToken) return;
      const next = document.createElement('img');
      next.alt = ''; next.src = url; next.className = 'field-img-next';
      next.style.objectPosition = f.pos || 'center';
      photo.appendChild(next);
      next.getBoundingClientRect(); // commit the start state
      next.classList.add('is-in');
      setTimeout(() => {
        if (token !== fieldSwapToken) return; // a newer swap cleans up everything itself
        $$('img', photo).forEach((im) => { if (im !== next) im.remove(); });
        next.id = 'fieldImg'; next.className = ''; // becomes the base image
      }, 700);
    };
    pre.src = url;
  }
  function renderFieldAccordion(animate) {
    fieldsMobile.innerHTML = FIELDS.map((f, i) => {
      const on = i === activeField;
      return `<div>
        <button class="field-row" data-i="${i}" aria-expanded="${on}" aria-pressed="${on}" style="width:100%">
          <span class="field-num">${pad2(i)}</span><span class="field-title">${esc(f.title)}</span><span class="field-arrow" aria-hidden="true">${on ? '−' : '+'}</span>
        </button>
        ${on ? `<div class="field-acc${animate ? ' is-new' : ''}">
          <div class="field-photo"><img src="${fieldImgURL(f)}" alt="" loading="lazy" style="object-position:${f.pos || 'center'}" /></div>
          <div class="field-text"><h3>${esc(f.title)}</h3>
            <p class="field-statement">${esc(f.statement)}</p><p class="field-question">${esc(f.question)}</p></div>
        </div>` : ''}
      </div>`;
    }).join('');
  }
  // The photo area is whatever the text block leaves over. Reserve the height of the tallest text so the
  // photo keeps the same size for every item (no jumping when switching).
  function fitFieldText() {
    const panel = $('#fieldPanel');
    if (!panel || !panel.offsetParent) return; // hidden (mobile layout / other page)
    const text = $('.field-text', panel), t = $('#fieldTitle'), st = $('#fieldStatement'), q = $('#fieldQuestion');
    text.style.minHeight = '';
    let max = 0;
    FIELDS.forEach((f) => {
      t.textContent = f.title; st.textContent = f.statement; q.textContent = f.question;
      max = Math.max(max, text.offsetHeight);
    });
    const cur = FIELDS[activeField];
    t.textContent = cur.title; st.textContent = cur.statement; q.textContent = cur.question;
    text.style.minHeight = max + 'px';
  }
  let fitTimer = null;
  window.addEventListener('resize', () => { clearTimeout(fitTimer); fitTimer = setTimeout(fitFieldText, 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitFieldText);

  function setField(i) { if (i === activeField) return; activeField = i; renderFieldPanel(true); renderFieldAccordion(true); }
  function initFields() {
    renderFieldRows(); renderFieldPanel(); renderFieldAccordion();
    fitFieldText();
    const onClick = (e) => { const b = e.target.closest('.field-row'); if (b) setField(+b.dataset.i); };
    fieldsList.addEventListener('click', onClick);
    fieldsMobile.addEventListener('click', onClick);
  }

  /* ───────────── Home: rings, chips, flag, forms ───────────── */
  function initRings() {
    $('#ringBig').outerHTML = bigRingSVG();
    $$('#boxes .box-top').forEach((t) => t.insertAdjacentHTML('beforeend', miniRingSVG()));
    $('#teaserChips').innerHTML = FIELDS.map((f) =>
      `<a class="chip" href="/perspectives?field=${f.slug}" data-route>${esc(f.short)}</a>`).join('');
  }

  // three.js + the waving flag are ~600 KB: only fetch them when the newsletter box nears the viewport.
  function initFlag() {
    const host = $('#newsletter');
    if (!host || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      const load = (src) => new Promise((ok, fail) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = fail; document.head.appendChild(s); });
      load('/assets/js/vendor/three.min.js').then(() => load('/assets/js/nero-flag.js')).then(() => {
        const flag = document.createElement('nero-flag');
        flag.setAttribute('lift', '0.7'); flag.setAttribute('zoom', '1.3');
        host.insertBefore(flag, host.firstChild);
      }).catch(() => { /* the box simply stays plain surface-coloured */ });
    }, { rootMargin: '400px' });
    io.observe(host);
  }

  /* ───────────── Perspectives ───────────── */
  let ARTICLES = [], AUTHORS = {}, contentLoaded = false;
  const feed = { field: null, type: 'All', q: '', limit: FIRST_PAGE };

  function parseFrontmatter(raw) {
    const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
    if (!m) return { data: {}, body: raw };
    const data = {};
    m[1].split('\n').forEach((line) => {
      const idx = line.indexOf(':');
      if (idx === -1) return;
      const key = line.slice(0, idx).trim();
      let value = line.slice(idx + 1).trim();
      if (value.length > 1 && ((value[0] === '"' && value[value.length - 1] === '"') || (value[0] === "'" && value[value.length - 1] === "'"))) value = value.slice(1, -1);
      data[key] = value;
    });
    return { data, body: m[2].trim() };
  }
  const fetchOnce = (url) => fetch(url).then((r) => { if (!r.ok) throw new Error(url + ' ' + r.status); return r.text(); });
  const fetchText = (url) => fetchOnce(url).catch(() => new Promise((ok) => setTimeout(ok, 400)).then(() => fetchOnce(url))); // one retry on flaky networks

  async function loadContent() {
    try {
      const [slugs, authorSlugs] = await Promise.all([
        fetch('/content/perspectives/manifest.json').then((r) => r.json()),
        fetch('/content/perspectives/authors/manifest.json').then((r) => r.json()).catch(() => []),
      ]);
      const [articles, authors] = await Promise.all([
        Promise.all(slugs.map(async (slug) => {
          const { data, body } = parseFrontmatter(await fetchText(`/content/perspectives/${slug}.md`));
          const words = body.split(/\s+/).filter(Boolean).length;
          return {
            slug: data.slug || slug,
            groups: (data.groups || '').split(',').map((s) => s.trim()).filter(Boolean),
            author: data.author || 'editorial-team',
            type: data.type || 'Essay',
            date: data.date || '',
            title: data.title || slug,
            teaser: data.teaser || data.lede || '',
            image: data.image || '',
            lede: data.lede || '',
            pull: data.pull || '',
            body,
            read: Math.max(1, Math.ceil(words / 200)),
          };
        })),
        Promise.all(authorSlugs.map(async (slug) => {
          const { data, body } = parseFrontmatter(await fetchText(`/content/perspectives/authors/${slug}.md`));
          return { slug: data.slug || slug, name: data.name || slug, role: data.role || '', photo: data.photo || '', bio: body };
        })),
      ]);
      ARTICLES = articles.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
      authors.forEach((a) => { AUTHORS[a.slug] = a; });
    } catch (err) {
      console.error('Failed to load Perspectives content', err);
      ARTICLES = [];
    }
    contentLoaded = true;
  }

  // An article carries a field tag only if it names exactly one known action field.
  function singleField(a) {
    const g = a.groups.map(fieldBySlug).filter(Boolean);
    return g.length === 1 ? g[0] : null;
  }
  const fieldLabel = (a) => (singleField(a) || COMMONPLACE).short;
  const authorName = (a) => (AUTHORS[a.author] || {}).name || 'Editorial Team';
  function articleImage(a, thumb) {
    if (a.image) return { src: a.image, pos: 'center' };
    const f = singleField(a);
    return f ? { src: fieldImgURL(f, thumb), pos: f.pos || 'center' } : null;
  }
  const imgTag = (a, thumb, lazy) => {
    const im = articleImage(a, thumb);
    return im ? `<img src="${esc(im.src)}" alt="" ${lazy ? 'loading="lazy"' : ''} style="object-position:${im.pos}" />` : '';
  };
  const articleHref = (a) => `/perspectives/${a.slug}`;

  function renderMasthead() {
    const [lead, ...rest] = ARTICLES;
    const tops = rest.slice(0, 2);
    if (!lead) { $('#stories').innerHTML = ''; return; }
    $('#stories').innerHTML = `
      <a class="story-lead reveal" href="${articleHref(lead)}" data-article>
        ${imgTag(lead, false, false)}
        <div class="story-lead-copy">
          <div class="badges"><span class="badge-type">${esc(lead.type)}</span><span class="badge-field">${esc(fieldLabel(lead))}</span></div>
          <h2>${esc(lead.title)}</h2>
          <p>${esc(lead.teaser)}</p>
          <span class="byline">${esc(authorName(lead))} · ${formatDate(lead.date)} · ${lead.read} min read</span>
        </div>
      </a>
      <div class="stories-side">${tops.map((a) => `
        <a class="story-top reveal" href="${articleHref(a)}" data-article>
          <div class="story-top-media">${imgTag(a, true, false)}</div>
          <div class="story-top-copy">
            <span class="kicker">${esc(a.type)} · ${esc(fieldLabel(a))}</span>
            <h3>${esc(a.title)}</h3>
            <span class="meta">${formatDate(a.date)} · ${a.read} min read</span>
          </div>
        </a>`).join('')}</div>`;
  }

  function renderTiles() {
    $('#tiles').innerHTML = FIELDS.map((f, i) => `
      <button class="tile" data-field="${f.slug}">
        <img src="${fieldImgURL(f, true)}" alt="" loading="lazy" style="object-position:${f.pos || 'center'}" />
        <span class="tile-shade"></span>
        <span class="tile-num">${pad2(i)}</span><span class="tile-name">${esc(f.short)}</span>
      </button>`).join('');
  }

  function renderMostRead() {
    // No analytics yet, so this is "more to read" (the next five after the masthead stories), not a ranking.
    $('#mostRead').innerHTML = ARTICLES.slice(3, 8).map((a, i) => `
      <a class="mr-item" href="${articleHref(a)}" data-article>
        <span class="mr-rank">${pad2(i)}</span>
        <div class="mr-copy"><span class="mr-title">${esc(a.title)}</span><span class="mr-meta">${esc(a.type)} · ${a.read} min read</span></div>
      </a>`).join('');
  }

  const isFiltered = () => !!(feed.field || feed.type !== 'All' || feed.q.trim());
  function feedMatches() {
    const q = feed.q.trim().toLowerCase();
    // Unfiltered, the lead + two top stories already sit in the masthead; any filter searches everything.
    const base = isFiltered() ? ARTICLES : ARTICLES.slice(3);
    return base.filter((a) => {
      if (feed.field === COMMONPLACE.slug && singleField(a)) return false;
      if (feed.field && feed.field !== COMMONPLACE.slug && !(singleField(a) && singleField(a).slug === feed.field)) return false;
      if (feed.type !== 'All' && a.type !== feed.type) return false;
      return !q || (a.title + ' ' + a.teaser + ' ' + authorName(a)).toLowerCase().includes(q);
    });
  }
  function renderFilters() {
    const set = feed.field !== null;
    const label = !feed.field ? 'Action field' : feed.field === COMMONPLACE.slug ? COMMONPLACE.short : fieldBySlug(feed.field).short;
    $('#ddLabel').textContent = label;
    $('#ddBtn').classList.toggle('is-set', set);
    const items = [{ slug: null, label: 'All action fields', num: '' }]
      .concat(FIELDS.map((f, i) => ({ slug: f.slug, label: f.short, num: pad2(i) })))
      .concat([{ slug: COMMONPLACE.slug, label: COMMONPLACE.short, num: '' }]);
    $('#ddMenu').innerHTML = items.map((it) => `
      <button class="dd-item" data-field="${it.slug || ''}" aria-pressed="${(feed.field || null) === it.slug}">
        <span class="dd-num">${it.num}</span><span>${esc(it.label)}</span>
      </button>`).join('');
    const present = Array.from(new Set(ARTICLES.map((a) => a.type)));
    const types = ['All'].concat(Object.keys(TYPE_LABELS).filter((t) => present.includes(t)), present.filter((t) => !TYPE_LABELS[t]));
    $('#types').innerHTML = types.map((t) => `<button class="type-btn" data-type="${esc(t)}" aria-pressed="${feed.type === t}">${esc(TYPE_LABELS[t] || t)}</button>`).join('');
    $('#feedClear').hidden = !isFiltered();
  }
  // animateFrom: index of the first card that fades in (filters re-render instantly, 'load more' animates only the new cards).
  function renderFeed(animateFrom = 0) {
    const list = feedMatches(), shown = list.slice(0, feed.limit), unfiltered = !isFiltered();
    $('#feedGrid').innerHTML = shown.map((a, i) => `
      <a class="acard${unfiltered && i === 0 ? ' is-big' : ''}${i >= animateFrom ? ' reveal' : ''}" href="${articleHref(a)}" data-article>
        <div class="acard-media">${imgTag(a, true, true)}<span class="acard-type">${esc(a.type)}</span></div>
        <div class="acard-copy">
          <span class="acard-field">${esc(fieldLabel(a))}</span>
          <h3>${esc(a.title)}</h3>
          <p>${esc(a.teaser)}</p>
          <span class="acard-by">${esc(authorName(a))} · ${formatDate(a.date)}</span>
        </div>
      </a>`).join('');
    $('#feedCount').textContent = list.length === 1 ? '1 article' : list.length + ' articles';
    $('#feedEmpty').hidden = list.length > 0;
    $('#feedMore').hidden = list.length <= feed.limit;
    renderFilters();
    watchReveals();
  }
  function setFeed(patch) { Object.assign(feed, patch, { limit: FIRST_PAGE }); closeDropdown(); renderFeed(Infinity); }

  function closeDropdown() { $('#ddMenu').hidden = true; $('#ddBtn').setAttribute('aria-expanded', 'false'); }
  function initPerspectives() {
    renderTiles();
    $('#tiles').addEventListener('click', (e) => {
      const t = e.target.closest('.tile'); if (!t) return;
      setFeed({ field: t.dataset.field });
      scrollToId('latest', true);
    });
    $('#ddBtn').addEventListener('click', () => {
      const open = $('#ddMenu').hidden;
      $('#ddMenu').hidden = !open; $('#ddBtn').setAttribute('aria-expanded', String(open));
    });
    $('#ddMenu').addEventListener('click', (e) => { const b = e.target.closest('.dd-item'); if (b) setFeed({ field: b.dataset.field || null }); });
    $('#types').addEventListener('click', (e) => { const b = e.target.closest('.type-btn'); if (b) setFeed({ type: b.dataset.type }); });
    $('#feedQuery').addEventListener('input', (e) => setFeed({ q: e.target.value }));
    const reset = () => { $('#feedQuery').value = ''; setFeed({ field: null, type: 'All', q: '' }); };
    $('#feedClear').addEventListener('click', reset);
    $('#feedReset').addEventListener('click', reset);
    $('#feedMore').addEventListener('click', () => { const prev = feed.limit; feed.limit += PAGE_STEP; renderFeed(prev); });
    document.addEventListener('click', (e) => { if (!e.target.closest('.dropdown')) closeDropdown(); });
  }


  /* ───────────── Article page ───────────── */
  // Small Markdown subset (headings, paragraphs, lists, quotes, **bold**, _italic_, links) — enough for the articles.
  function mdInline(t) {
    return esc(t)
      .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[\s(>])_(.+?)_(?=[\s.,;:!?)<]|$)/g, '$1<em>$2</em>')
      .replace(/(^|[\s(>])\*(.+?)\*(?=[\s.,;:!?)<]|$)/g, '$1<em>$2</em>');
  }
  function mdBlocks(md) {
    const out = [];
    let para = [], list = [], quote = [];
    const flush = () => {
      if (para.length) { out.push('<p>' + mdInline(para.join(' ')) + '</p>'); para = []; }
      if (list.length) { out.push('<ul>' + list.map((i) => '<li>' + mdInline(i) + '</li>').join('') + '</ul>'); list = []; }
      if (quote.length) { out.push('<blockquote>' + mdInline(quote.join(' ')) + '</blockquote>'); quote = []; }
    };
    md.split('\n').forEach((raw) => {
      const line = raw.trim(), h = /^(#{1,3})\s+(.*)$/.exec(line);
      if (!line) flush();
      else if (h) { flush(); out.push(`<h${h[1].length === 1 ? 2 : h[1].length}>${mdInline(h[2])}</h${h[1].length === 1 ? 2 : h[1].length}>`); }
      else if (/^[-*]\s+/.test(line)) { if (para.length || quote.length) flush(); list.push(line.replace(/^[-*]\s+/, '')); }
      else if (/^>\s?/.test(line)) { if (para.length || list.length) flush(); quote.push(line.replace(/^>\s?/, '')); }
      else { if (list.length || quote.length) flush(); para.push(line); }
    });
    flush();
    return out;
  }
  function articleHTML(a) {
    const blocks = mdBlocks(a.body);
    if (blocks[0] && blocks[0].indexOf('<p><em><strong>TL;DR') === 0) blocks[0] = '<p class="tldr">' + blocks[0].slice(3);
    if (a.pull) { // pull quote just before the second section heading
      const h2 = blocks.reduce((acc, b, i) => (b.indexOf('<h2') === 0 ? acc.concat(i) : acc), []);
      const at = h2.length > 1 ? h2[1] : blocks.length;
      blocks.splice(at, 0, `<p class="pull">${esc(a.pull)}</p>`);
    }
    return blocks.join('\n');
  }
  function renderArticle() {
    const root = $('#articleRoot');
    const a = ARTICLES.find((x) => x.slug === articleSlug);
    if (!contentLoaded) { root.innerHTML = '<p class="article-loading">Loading…</p>'; return; }
    if (!a) { go('/perspectives', { replace: true }); return; }
    const au = AUTHORS[a.author] || { name: 'Editorial Team', role: 'NERO Perspectives', photo: '', bio: '' };
    const img = articleImage(a, false);
    document.title = `${a.title} — NERO`;
    $('#metaDesc').setAttribute('content', a.teaser);
    const more = ARTICLES.filter((x) => x.slug !== a.slug).slice(0, 3);
    root.innerHTML = `
      <header class="article-head reveal">
        <a class="back" href="/perspectives" data-route>← Perspectives</a>
        <h1>${esc(a.title)}</h1>
        ${a.lede ? `<p class="article-lede">${esc(a.lede)}</p>` : ''}
        <div class="article-by">
          ${au.photo ? `<img src="${esc(au.photo)}" alt="" />` : ''}
          <div><div class="article-by-name">${esc(au.name)}</div><div class="article-by-meta">${formatDate(a.date)} · ${a.read} min read</div></div>
        </div>
      </header>
      ${img ? `<figure class="article-figure reveal"><div><img src="${esc(img.src)}" alt="" style="object-position:${img.pos}" /></div></figure>` : ''}
      <div class="article-body">
        <div class="prose">${articleHTML(a)}</div>
        <nav class="toc" aria-label="In this article"><span class="toc-title">In this article</span><ol></ol></nav>
      </div>
      <aside class="author-card reveal">
        <div class="author-card-inner">
          ${au.photo ? `<img src="${esc(au.photo)}" alt="" />` : '<span></span>'}
          <div><span class="kicker">About the author</span><h2>${esc(au.name)}</h2><div class="role">${esc(au.role)}</div>
            <div class="bio">${mdBlocks(au.bio || '').join('')}</div></div>
        </div>
      </aside>
      <section class="article-more">
        <div class="article-more-head"><h2>More perspectives</h2><a href="/perspectives" data-route>All perspectives →</a></div>
        <div class="grid">${more.map((m) => `
          <a class="acard reveal" href="${articleHref(m)}" data-article>
            <div class="acard-media">${imgTag(m, true, true)}<span class="acard-type">${esc(m.type)}</span></div>
            <div class="acard-copy"><span class="acard-field">${esc(fieldLabel(m))}</span><h3>${esc(m.title)}</h3><p>${esc(m.teaser)}</p>
              <span class="acard-by">${esc(authorName(m))} · ${formatDate(m.date)}</span></div>
          </a>`).join('')}</div>
      </section>`;
    buildToc(root);
    watchReveals();
  }

  // Agenda box: links to the article's section titles, highlights the one being read.
  let tocHeads = [];
  function buildToc(root) {
    const toc = $('.toc', root);
    tocHeads = $$('.prose h2, .prose h3', root);
    if (tocHeads.length < 2) { toc.remove(); tocHeads = []; return; }
    tocHeads.forEach((h, i) => { h.id = 'sec-' + (i + 1); });
    $('ol', toc).innerHTML = tocHeads.map((h) =>
      `<li class="${h.tagName === 'H3' ? 'sub' : ''}"><a href="#${h.id}" data-sec="${h.id}">${esc(h.textContent)}</a></li>`).join('');
    updateToc();
  }
  function updateToc() {
    if (currentView !== 'article' || !tocHeads.length) return;
    let cur = tocHeads[0];
    tocHeads.forEach((h) => { if (h.getBoundingClientRect().top <= 140) cur = h; });
    if (window.scrollY < 200) cur = null; // above the text: nothing highlighted
    $$('.toc a').forEach((a) => a.classList.toggle('is-active', !!cur && a.dataset.sec === cur.id));
  }
  window.addEventListener('scroll', updateToc, { passive: true });
  document.addEventListener('click', (e) => {
    const l = e.target.closest && e.target.closest('.toc a');
    if (!l) return;
    e.preventDefault();
    const h = document.getElementById(l.dataset.sec);
    if (h) window.scrollTo({ top: h.getBoundingClientRect().top + window.scrollY - 108, behavior: 'smooth' });
  });

  /* ───────────── Dialogs: members-only notice + "Join the renaissance" ───────────── */
  const gate = $('#gate'), joinDlg = $('#join-modal'), joinForm = $('#joinForm');
  let returnFocus = null;
  function openDialog(d) {
    if (d.open) return;
    if (!returnFocus) returnFocus = document.activeElement;
    d.showModal();
    document.documentElement.style.overflow = 'hidden';
  }
  function closeDialogs() { $$('dialog[open]').forEach((d) => d.close()); }
  const openGate = () => openDialog(gate);
  const closeGate = closeDialogs;
  $$('dialog.modal').forEach((d) => {
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); }); // backdrop
    d.addEventListener('close', () => {
      if ($$('dialog[open]').length) return; // e.g. notice → join flow handover
      document.documentElement.style.overflow = '';
      if (returnFocus && returnFocus.focus) returnFocus.focus();
      returnFocus = null;
    });
    $$('[data-close]', d).forEach((b) => b.addEventListener('click', () => d.close()));
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDropdown(); });

  // Join flow — 1 involvement, 2 spaces, 3 contact (+ optional newsletter), then thank-you.
  const ROLES = ['Investor', 'Contributor', 'Initiative Owner', 'Other'];
  const join = { step: 1, roles: new Set(), spaces: new Set() };
  const leadEndpoint = () => (document.querySelector('meta[name="nero-join-endpoint"]') || {}).content || '';
  // Apps Script has no CORS headers, hence no-cors: the response is opaque but network errors still reject.
  function postLead(data) {
    const endpoint = leadEndpoint();
    if (!endpoint) return Promise.reject(new Error('no-endpoint'));
    return fetch(endpoint, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(data) });
  }
  const NOT_CONNECTED = 'Sign-up is not connected yet. Please write to johannes@anewrenaissance.com.';
  const joinNext = $('#joinNext'), joinBack = $('#joinBack'), joinError = $('#joinError');

  function renderOpts(host, values, set) {
    host.innerHTML = values.map((v) => `<button type="button" class="opt" data-v="${esc(v)}" aria-pressed="${set.has(v)}">${esc(v)}</button>`).join('');
  }
  function showStep(n) {
    join.step = n;
    $$('.join-step', joinDlg).forEach((st) => { st.hidden = +st.dataset.step !== n; });
    $('#joinKicker').textContent = `Join the renaissance · Step ${n} of 3`;
    joinBack.hidden = n === 1;
    joinNext.textContent = n < 3 ? 'Continue' : 'Send';
    joinNext.disabled = n === 1 && join.roles.size === 0;
    joinError.hidden = true;
    const focusEl = n === 3 ? joinForm.elements.email : $('.join-step:not([hidden]) .opt', joinDlg);
    if (focusEl) focusEl.focus();
  }
  function openJoin() {
    join.roles.clear(); join.spaces.clear();
    joinForm.reset();
    renderOpts($('#optsRole'), ROLES, join.roles);
    renderOpts($('#optsSpaces'), FIELDS.map((f) => f.short), join.spaces);
    $('.join-flow', joinDlg).hidden = false; $('#joinDone').hidden = true;
    joinNext.disabled = true; joinNext.textContent = 'Continue';
    gate.close();
    openDialog(joinDlg);
    showStep(1);
  }
  function joinFail(msg) { joinError.textContent = msg; joinError.hidden = false; }
  function joinDone(name) {
    $('#joinDoneTitle').textContent = name ? `Thank you, ${name.split(/\s+/)[0]}!` : 'Thank you!';
    $('.join-flow', joinDlg).hidden = true; $('#joinDone').hidden = false;
    $('#joinDone .btn').focus();
  }
  function joinSubmit() {
    const f = joinForm.elements, name = f.name.value.trim(), email = f.email.value.trim();
    joinError.hidden = true;
    if (!email || !f.email.checkValidity()) { joinFail('Please enter a valid email address.'); f.email.focus(); return; }
    if (f.website.value) { joinDone(name); return; } // honeypot: bots fill the hidden field
    const data = {
      type: 'join', roles: Array.from(join.roles).join(', '), spaces: Array.from(join.spaces).join(', '),
      name, email, message: f.message.value.trim(), updates: f.updates.checked ? 'yes' : 'no', page: location.href,
    };
    joinNext.disabled = true; joinNext.textContent = 'Sending…';
    postLead(data)
      .then(() => joinDone(name))
      .catch((err) => joinFail(err.message === 'no-endpoint' ? NOT_CONNECTED : 'That did not work. Please try again later.'))
      .then(() => { joinNext.disabled = false; joinNext.textContent = 'Send'; });
  }
  function joinAdvance() { if (join.step < 3) showStep(join.step + 1); else joinSubmit(); }

  joinDlg.addEventListener('click', (e) => {
    const o = e.target.closest('.opt');
    if (!o) return;
    const set = o.parentElement.id === 'optsRole' ? join.roles : join.spaces, v = o.dataset.v;
    if (set.has(v)) set.delete(v); else set.add(v);
    o.setAttribute('aria-pressed', String(set.has(v)));
    if (join.step === 1) joinNext.disabled = join.roles.size === 0;
  });
  joinNext.addEventListener('click', joinAdvance);
  joinBack.addEventListener('click', () => showStep(join.step - 1));
  joinForm.addEventListener('submit', (e) => { e.preventDefault(); if (!joinNext.disabled) joinAdvance(); });
  document.addEventListener('click', (e) => { if (e.target.closest('[data-open-join]')) openJoin(); });

  // Newsletter: the boxes validate the email, then this dialog collects name + explicit consent.
  const newsDlg = $('#news-modal'), newsForm = $('#newsForm'), newsError = $('#newsError'), newsSubmit = $('#newsSubmit');
  let newsSource = null;
  function openNewsletter(email, sourceForm) {
    newsSource = sourceForm;
    newsForm.reset();
    newsForm.elements.email.value = email;
    newsError.hidden = true;
    $('#newsFlow').hidden = false; $('#newsDone').hidden = true;
    newsSubmit.disabled = false; newsSubmit.textContent = 'Subscribe';
    openDialog(newsDlg);
    newsForm.elements.name.focus();
  }
  function newsFail(msg) { newsError.textContent = msg; newsError.hidden = false; }
  newsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = newsForm.elements, name = f.name.value.trim(), email = f.email.value.trim();
    newsError.hidden = true;
    if (!email || !f.email.checkValidity()) { newsFail('Please enter a valid email address.'); f.email.focus(); return; }
    if (!f.consent.checked) { newsFail('Please tick the box to confirm your consent.'); f.consent.focus(); return; }
    const done = () => {
      $('#newsDoneTitle').textContent = name ? `Thank you, ${name.split(/\s+/)[0]}!` : 'Thank you!';
      $('#newsFlow').hidden = true; $('#newsDone').hidden = false;
      $('#newsDone .btn').focus();
      if (newsSource) newsSource.reset();
    };
    if (f.website.value) { done(); return; } // honeypot
    newsSubmit.disabled = true; newsSubmit.textContent = 'Sending…';
    postLead({ type: 'newsletter', name, email, consent: 'yes', page: location.href })
      .then(done)
      .catch((err) => newsFail(err.message === 'no-endpoint' ? NOT_CONNECTED : 'That did not work. Please try again later.'))
      .then(() => { newsSubmit.disabled = false; newsSubmit.textContent = 'Subscribe'; });
  });
  $$('form[data-newsletter]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      openNewsletter($('input', form).value.trim(), form);
    });
  });

  /* ───────────── Scroll reveal ───────────── */
  const revealIO = ('IntersectionObserver' in window && !REDUCED_MOTION)
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.04 })
    : null;
  function watchReveals() {
    if (!revealIO) { document.documentElement.classList.remove('js'); return; }
    // Stagger siblings inside grids.
    $$('.cards, .boxes, .join-grid, .stories, .mostread-grid, .grid').forEach((g) => {
      Array.from(g.children).forEach((c, i) => { if (!c.style.getPropertyValue('--d')) c.style.setProperty('--d', (i % 4) * 90 + 'ms'); });
    });
    $$('.reveal:not(.in)').forEach((el) => revealIO.observe(el)); // re-observing is a no-op
  }

  /* ───────────── Boot ───────────── */
  initRings();
  initFields();
  initFlag();
  initPerspectives();
  renderFilters();

  window.__nero = true;
  watchReveals();

  const initial = resolveLocation(location);
  if (initial.canonical) history.replaceState({}, '', initial.canonical);
  else if (initial.view === 'perspectives' && location.search) history.replaceState({}, '', '/perspectives');
  showView(initial.view, { hash: initial.hash, article: initial.article, instant: true });
  if (initial.gate) openGate();

  loadContent().then(() => {
    renderMasthead();
    if (currentView === 'article') renderArticle();
    watchReveals();
    renderMostRead();
    if (initial.view === 'perspectives') applyFeedParams(initial.search);
    renderFeed();
  });
})();
