// A2H Badminton Arena — small enhancements.
// The site works fully without JavaScript; this only adds the mobile menu,
// the live "Open now" badge and the footer year.

// ---- Opening hours (24h clock, India time). Update here if hours change. ----
const HOURS = { open: 6, close: 22 }; // 6 AM – 10 PM, every day

// ---- Mobile menu toggle ----
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  // Close the menu after tapping a link
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ---- "Open now" badge, always calculated in India time (Asia/Kolkata) ----
function formatHour(h) {
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12} ${suffix}`;
}

const statusEl = document.querySelector('[data-open-status]');
if (statusEl) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata', hour: 'numeric', minute: 'numeric', hourCycle: 'h23'
  }).formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === 'hour').value);
  const isOpen = hour >= HOURS.open && hour < HOURS.close;

  statusEl.classList.toggle('is-open', isOpen);
  statusEl.innerHTML = isOpen
    ? `<span class="dot" aria-hidden="true"></span><span>Open now · until ${formatHour(HOURS.close)}</span>`
    : `<span class="dot" aria-hidden="true"></span><span>Closed now · opens ${formatHour(HOURS.open)}</span>`;
}

// ---- Footer year ----
const yearEl = document.querySelector('[data-year]');
if (yearEl) yearEl.textContent = new Date().getFullYear();
