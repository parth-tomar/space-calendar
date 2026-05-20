// ─── STARFIELD ───────────────────────────────────
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let stars = [];
const NUM_STARS = 320;
const NUM_NEBULA = 6;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initStars() {
  stars = [];
  for (let i = 0; i < NUM_STARS; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.2,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.4 + 0.05,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    });
  }
}

function drawNebula() {
  const nebulaColors = [
    ['rgba(80,20,120,', 'rgba(30,0,60,'],
    ['rgba(10,30,80,', 'rgba(0,10,40,'],
    ['rgba(100,40,10,', 'rgba(50,10,0,'],
    ['rgba(20,60,100,', 'rgba(0,20,50,'],
    ['rgba(60,10,80,', 'rgba(20,0,40,'],
    ['rgba(30,80,60,', 'rgba(0,30,20,'],
  ];

  for (let n = 0; n < NUM_NEBULA; n++) {
    const seed = n * 1234.5678;
    const cx = (Math.sin(seed) * 0.5 + 0.5) * canvas.width;
    const cy = (Math.cos(seed * 1.3) * 0.5 + 0.5) * canvas.height;
    const rx = 150 + Math.abs(Math.sin(seed * 2)) * 250;
    const ry = 100 + Math.abs(Math.cos(seed * 2.5)) * 200;
    const [c1, c2] = nebulaColors[n % nebulaColors.length];

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
    grad.addColorStop(0, c1 + '0.08)');
    grad.addColorStop(0.5, c2 + '0.04)');
    grad.addColorStop(1, 'transparent');

    ctx.save();
    ctx.scale(rx / Math.max(rx, ry), ry / Math.max(rx, ry));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(
      cx * (Math.max(rx, ry) / rx),
      cy * (Math.max(rx, ry) / ry),
      Math.max(rx, ry), 0, Math.PI * 2
    );
    ctx.fill();
    ctx.restore();
  }
}

let animFrame;
function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.fillStyle = '#020408';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Nebula clouds
  drawNebula();

  // Stars
  stars.forEach(s => {
    s.twinkle += s.twinkleSpeed;
    const flicker = 0.6 + 0.4 * Math.sin(s.twinkle);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,245,220,${s.alpha * flicker})`;
    ctx.fill();

    // Occasional bright star cross
    if (s.r > 1.3) {
      ctx.strokeStyle = `rgba(255,245,200,${s.alpha * flicker * 0.4})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(s.x - s.r * 3, s.y);
      ctx.lineTo(s.x + s.r * 3, s.y);
      ctx.moveTo(s.x, s.y - s.r * 3);
      ctx.lineTo(s.x, s.y + s.r * 3);
      ctx.stroke();
    }
  });

  animFrame = requestAnimationFrame(animateStars);
}

// ─── CLOCK ────────────────────────────────────────
function updateClock() {
  const now = new Date();

  const dateEl = document.getElementById('earth-date');
  const timeEl = document.getElementById('earth-time');

  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  }).toUpperCase();

  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });

  if (dateEl) dateEl.textContent = dateStr;
  if (timeEl) timeEl.textContent = timeStr;
}

setInterval(updateClock, 1000);
updateClock();

// ─── PLANET DATA (time multipliers) ──────────────
// dayRatio: how many Earth-hours = 1 local hour
// yearRatio: how many Earth-days = 1 local day/year unit
const PLANET_TIME = {
  mercury:  { dayHours: 1407.6, yearDays: 88 },
  venus:    { dayHours: 5832.5, yearDays: 225 },
  'earth-planet': { dayHours: 24, yearDays: 365.25 },
  mars:     { dayHours: 24.62, yearDays: 687 },
  jupiter:  { dayHours: 9.93, yearDays: 4333 },
  saturn:   { dayHours: 10.7, yearDays: 10759 },
  uranus:   { dayHours: 17.23, yearDays: 30687 },
  neptune:  { dayHours: 16.1, yearDays: 60190 },
};

function getLocalTime(planetId) {
  const data = PLANET_TIME[planetId];
  if (!data) return '—';
  const now = new Date();
  const earthHours = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  // Scale Earth hours into local planet hours
  const localHours = (earthHours / data.dayHours) * 24;
  const h = Math.floor(localHours) % 24;
  const m = Math.floor((localHours % 1) * 60);
  const s = Math.floor(((localHours * 60) % 1) * 60);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')} (local)`;
}

// ─── TOOLTIP ─────────────────────────────────────
const tooltip = document.getElementById('tooltip');
const ttDot  = tooltip.querySelector('.tooltip-dot');
const ttName = tooltip.querySelector('.tooltip-name');
const ttDay  = tooltip.querySelector('.tooltip-day');
const ttYear = tooltip.querySelector('.tooltip-year');
const ttNow  = tooltip.querySelector('.tooltip-earth-now');
const ttFact = tooltip.querySelector('.tooltip-fact');
const solarSystem = document.getElementById('solar-system');
const uiToggle = document.getElementById('ui-toggle');
const planetTargets = Array.from(document.querySelectorAll('.planet'));
const objectChips = Array.from(document.querySelectorAll('.object-chip'));
const sunTarget = document.getElementById('sun');

let tooltipInterval = null;
let activePlanetId = null;
let selectedObjectId = null;
let pinnedObjectId = null;
let activeTooltipTimer = null;
let uiHidden = false;

function showTooltip(planet, e) {
  const name  = planet.dataset.name;
  const day   = planet.dataset.day;
  const year  = planet.dataset.year;
  const fact  = planet.dataset.fact;
  const color = planet.dataset.color;

  ttDot.style.background = color;
  ttDot.style.boxShadow = `0 0 8px ${color}`;
  ttName.textContent = name.toUpperCase();
  ttDay.textContent  = day;
  ttYear.textContent = year;
  ttFact.textContent = fact;

  activePlanetId = planet.id;
  ttNow.textContent = getLocalTime(activePlanetId);

  clearInterval(tooltipInterval);
  tooltipInterval = setInterval(() => {
    if (activePlanetId) ttNow.textContent = getLocalTime(activePlanetId);
  }, 1000);

  tooltip.classList.remove('hidden');
  moveTooltip(e);
}

function hideTooltip() {
  tooltip.classList.add('hidden');
  activePlanetId = null;
  clearInterval(tooltipInterval);
}

function setActiveObject(targetId) {
  selectedObjectId = targetId;

  document.querySelectorAll('.orbit, .sun').forEach(node => {
    node.classList.toggle('is-selected', node.id === targetId || node.id === `orbit-${targetId}`);
  });

  objectChips.forEach(chip => {
    chip.classList.toggle('is-active', chip.dataset.target === targetId);
  });
}

function clearPinnedObject() {
  pinnedObjectId = null;
  selectedObjectId = null;

  document.querySelectorAll('.orbit, .sun').forEach(node => {
    node.classList.remove('is-selected');
  });

  objectChips.forEach(chip => chip.classList.remove('is-active'));
}

function setUiHidden(hidden) {
  uiHidden = hidden;

  if (hidden) {
    clearTimeout(activeTooltipTimer);
    clearPinnedObject();
    hideTooltip();
  }

  document.body.classList.toggle('ui-hidden', hidden);

  if (uiToggle) {
    uiToggle.textContent = hidden ? 'SHOW UI' : 'HIDE UI';
    uiToggle.setAttribute('aria-pressed', String(hidden));
  }
}

function focusObject(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  pinnedObjectId = targetId;
  setActiveObject(targetId);

  const eventPoint = target.getBoundingClientRect();
  const fakeEvent = {
    clientX: eventPoint.left + eventPoint.width / 2,
    clientY: eventPoint.top + eventPoint.height / 2,
  };

  clearTimeout(activeTooltipTimer);
  activeTooltipTimer = setTimeout(() => {
    if (target.dataset && target.dataset.name) {
      showTooltip(target, fakeEvent);
    }
  }, 250);
}

function moveTooltip(e) {
  const pad = 18;
  const tw = tooltip.offsetWidth + pad * 2;
  const th = tooltip.offsetHeight + pad * 2;
  const sideSafe = Math.max(84, Math.min(220, Math.round(window.innerWidth * 0.16)));
  const topSafe = 82;
  const bottomSafe = 28;
  let x = e.clientX + pad;
  let y = e.clientY - th / 2;
  const minX = sideSafe;
  const maxX = Math.max(minX, window.innerWidth - sideSafe - tw);
  const minY = topSafe;
  const maxY = Math.max(minY, window.innerHeight - bottomSafe - th);

  if (x > maxX) x = e.clientX - tw - pad;
  x = Math.min(Math.max(x, minX), maxX);
  y = Math.min(Math.max(y, minY), maxY);

  tooltip.style.left = x + 'px';
  tooltip.style.top  = y + 'px';
}

function getInteractiveObjectAtPoint(x, y) {
  if (sunTarget) {
    const sunRect = sunTarget.getBoundingClientRect();
    const sunPad = 16;

    if (
      x >= sunRect.left - sunPad &&
      x <= sunRect.right + sunPad &&
      y >= sunRect.top - sunPad &&
      y <= sunRect.bottom + sunPad
    ) {
      return sunTarget;
    }
  }

  for (let i = planetTargets.length - 1; i >= 0; i--) {
    const planet = planetTargets[i];
    const rect = planet.getBoundingClientRect();
    const hitPad = planet.id === 'saturn' ? 16 : 8;

    if (
      x >= rect.left - hitPad &&
      x <= rect.right + hitPad &&
      y >= rect.top - hitPad &&
      y <= rect.bottom + hitPad
    ) {
      return planet;
    }
  }

  return null;
}

if (solarSystem) {
  solarSystem.addEventListener('pointermove', e => {
    if (pinnedObjectId) {
      return;
    }

    const planet = getInteractiveObjectAtPoint(e.clientX, e.clientY);

    if (planet) {
      if (activePlanetId !== planet.id) {
        showTooltip(planet, e);
      } else {
        moveTooltip(e);
      }
      return;
    }

    if (activePlanetId && !pinnedObjectId) {
      hideTooltip();
    }
  });

  solarSystem.addEventListener('pointerleave', () => {
    if (!pinnedObjectId) {
      hideTooltip();
    }
  });

  solarSystem.addEventListener('click', e => {
    const planet = getInteractiveObjectAtPoint(e.clientX, e.clientY);

    if (!planet) {
      if (pinnedObjectId) {
        clearPinnedObject();
        hideTooltip();
      }
      return;
    }

    if (pinnedObjectId === planet.id) {
      clearPinnedObject();
      hideTooltip();
      return;
    }

    focusObject(planet.id);
  });
}

if (sunTarget) {
  sunTarget.addEventListener('pointermove', e => {
    if (!pinnedObjectId) {
      showTooltip(sunTarget, e);
    }
  });

  sunTarget.addEventListener('click', e => {
    e.stopPropagation();

    if (pinnedObjectId === 'sun') {
      clearPinnedObject();
      hideTooltip();
      return;
    }

    focusObject('sun');
  });

  sunTarget.addEventListener('pointerleave', () => {
    if (!pinnedObjectId) {
      hideTooltip();
    }
  });
}

objectChips.forEach(chip => {
  chip.addEventListener('click', () => {
    const targetId = chip.dataset.target;
    if (targetId) {
      if (pinnedObjectId === targetId) {
        clearPinnedObject();
        hideTooltip();
        return;
      }

      focusObject(targetId);
    }
  });
});

if (uiToggle) {
  uiToggle.addEventListener('click', () => {
    setUiHidden(!uiHidden);
  });
}

// ─── POSITION ORBITS RELATIVE TO SUN ─────────────
function centerOrbits() {
  const ss = document.getElementById('solar-system');
  const sun = document.querySelector('.sun');
  const cx = ss.clientWidth / 2;
  const cy = ss.clientHeight / 2;

  document.querySelectorAll('.orbit').forEach(orbit => {
    const r = parseInt(getComputedStyle(orbit).getPropertyValue('--r'));
    orbit.style.left = (cx - r) + 'px';
    orbit.style.top  = (cy - r) + 'px';
  });

  sun.style.left = (cx - 40) + 'px';
  sun.style.top  = (cy - 40) + 'px';
}

// ─── INIT ─────────────────────────────────────────
window.addEventListener('resize', () => {
  resizeCanvas();
  initStars();
  centerOrbits();
});

resizeCanvas();
initStars();
animateStars();
centerOrbits();

// Randomise starting orbit angle for each planet so they don't all start at top
document.querySelectorAll('.orbit').forEach(orbit => {
  const offset = Math.random() * 360;
  orbit.style.animationDelay = `-${offset / 360 * parseFloat(getComputedStyle(orbit).getPropertyValue('--duration').replace('s',''))}s`;
});

