/* Hero sparkle trail — mouse-follow star dust on the home hero.
   Kept verbatim from the previous site (deliberate: do not replace with the idle NERO_SPARKLE from the design package). */
function initHeroSparkles(heroId, canvasId) {
  const hero = document.getElementById(heroId);
  const canvas = document.getElementById(canvasId);
  if (!hero || !canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let rafId = null;
  let lastSpawn = 0;
  let lastX = null, lastY = null;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    const rect = hero.getBoundingClientRect();
    if (!rect.width || !rect.height) return; // hero's page is hidden (display:none) right now
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
  }
  resize();
  // A plain window 'resize' listener misses the hero going from display:none (0x0)
  // to visible when its page becomes active via showPage() — ResizeObserver catches that too.
  if (window.ResizeObserver) {
    new ResizeObserver(resize).observe(hero);
  } else {
    window.addEventListener('resize', resize);
  }

  function spawn(x, y, dirX, dirY) {
    const baseAngle = Math.atan2(dirY, dirX);
    const angle = baseAngle + (Math.random() - 0.5) * 0.9;
    const speed = (0.12 + Math.random() * 0.22) * dpr;
    particles.push({
      x: (x + (Math.random() - 0.5) * 8) * dpr,
      y: (y + (Math.random() - 0.5) * 8) * dpr,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: (0.42 + Math.random() * 0.54) * dpr,
      baseAlpha: 0.65 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
      age: 0,
      maxLife: 500 + Math.random() * 500,
    });
  }

  function tick(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => p.age < p.maxLife);
    for (const p of particles) {
      p.age += 16.7;
      p.x += p.vx;
      p.y += p.vy;
      const lifeRatio = p.age / p.maxLife;
      const fade = lifeRatio < 0.15 ? lifeRatio / 0.15 : 1 - Math.pow((lifeRatio - 0.15) / 0.85, 2);
      const twinkle = 0.7 + 0.3 * Math.sin(p.age * 0.025 + p.phase);
      const alpha = Math.max(0, p.baseAlpha * fade * twinkle);
      const r = p.size * 1.15;
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
      grad.addColorStop(0.55, `rgba(255,255,255,${alpha * 0.85})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (particles.length > 0) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  }

  function ensureLoop() {
    if (rafId === null) rafId = requestAnimationFrame(tick);
  }

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let dirX = 1, dirY = 0;
    if (lastX !== null) {
      const dx = x - lastX, dy = y - lastY;
      const dist = Math.hypot(dx, dy);
      if (dist > 0.5) { dirX = dx / dist; dirY = dy / dist; }
    }
    lastX = x;
    lastY = y;

    const now = performance.now();
    if (now - lastSpawn < 170) return;
    lastSpawn = now;
    if (Math.random() > 0.55) return;
    spawn(x, y, dirX, dirY);
    ensureLoop();
  });
}

initHeroSparkles('hero', 'heroSparkleCanvas');
