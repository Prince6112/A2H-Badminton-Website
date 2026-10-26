// A2H Badminton Arena — small enhancements.
// The site works fully without JavaScript; this only adds the mobile menu,
// the live "Open now" badge and the footer year.

// ---- Opening hours: the arena is open 24 hours, every day. ----
// (If fixed hours ever return, see the Git history for the old open/closed logic.)

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

// ---- "Open now" badge (always open: 24 hours, every day) ----
const statusEl = document.querySelector('[data-open-status]');
if (statusEl) {
  statusEl.classList.add('is-open');
  statusEl.innerHTML = '<span class="dot" aria-hidden="true"></span><span>Open now · 24 hours, every day</span>';
}

// ---- Footer year ----
const yearEl = document.querySelector('[data-year]');
if (yearEl) yearEl.textContent = new Date().getFullYear();
