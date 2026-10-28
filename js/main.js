// A2H Badminton & Indoor Sports — small enhancements.
// The site works fully without JavaScript; this only adds the mobile menu,
// the live "Open now" badge, the footer year and the booking form.
// (Without JavaScript, the WhatsApp and Call buttons still work.)

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

// ---- Booking form → pre-filled WhatsApp message ----
// The visitor fills in name, phone, sport, date and time. On "Continue on
// WhatsApp" we check the details, turn them into a message and open
// wa.me/<number>?text=<message>. Nothing is stored or sent to any server.
const WHATSAPP_NUMBER = '917200796960'; // country code + number, digits only

const form = document.getElementById('booking-form');

if (form) {
  const f = {
    name: form.querySelector('#bk-name'),
    phone: form.querySelector('#bk-phone'),
    sport: form.querySelector('#bk-sport'),
    date: form.querySelector('#bk-date'),
    time: form.querySelector('#bk-time'),
    hours: form.querySelector('#bk-hours'),
  };

  // "6" -> "6 AM", "13" -> "1 PM", "0" -> "12 AM"
  const hourLabel = (h) => {
    h = ((h % 24) + 24) % 24;
    return (h % 12 === 0 ? 12 : h % 12) + (h < 12 ? ' AM' : ' PM');
  };

  // Local date as YYYY-MM-DD (what <input type="date"> uses)
  const isoDate = (d) =>
    d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

  // Hourly start times, grouped so the long list is easy to scan
  const groups = [
    ['Early morning', 0, 5],
    ['Morning', 6, 11],
    ['Afternoon', 12, 15],
    ['Evening', 16, 19],
    ['Night', 20, 23],
  ];
  groups.forEach(([label, from, to]) => {
    const og = document.createElement('optgroup');
    og.label = label;
    for (let h = from; h <= to; h++) {
      const o = document.createElement('option');
      o.value = String(h);
      o.textContent = hourLabel(h) + (h === 0 ? ' (midnight)' : h === 12 ? ' (noon)' : '');
      og.appendChild(o);
    }
    f.time.appendChild(og);
  });

  // Date: today by default, and no past dates
  const today = isoDate(new Date());
  f.date.min = today;
  if (!f.date.value) f.date.value = today;

  // If the date is today, grey out start times that have already passed
  const updatePastSlots = () => {
    const isToday = f.date.value === isoDate(new Date());
    const nowHour = new Date().getHours();
    f.time.querySelectorAll('option[value]:not([value=""])').forEach((o) => {
      o.disabled = isToday && Number(o.value) <= nowHour;
    });
    if (f.time.selectedOptions[0] && f.time.selectedOptions[0].disabled) f.time.value = '';
  };
  updatePastSlots();
  f.date.addEventListener('change', updatePastSlots);

  // "Book badminton" / "Book table tennis" buttons pre-select the sport
  document.querySelectorAll('[data-book-sport]').forEach((btn) => {
    btn.addEventListener('click', () => { f.sport.value = btn.dataset.bookSport; });
  });

  // ---- Validation helpers ----
  const setError = (input, msg) => {
    const err = document.getElementById(input.id + '-err');
    if (msg) {
      input.setAttribute('aria-invalid', 'true');
      if (err) { err.textContent = msg; err.hidden = false; }
    } else {
      input.removeAttribute('aria-invalid');
      if (err) { err.textContent = ''; err.hidden = true; }
    }
    return !msg;
  };

  // Accepts "98765 43210", "+91 98765 43210", "098765 43210" → "9876543210"
  const cleanPhone = (v) => {
    let d = v.replace(/\D/g, '');
    if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
    if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
    return d;
  };

  const checks = {
    name: () => setError(f.name, f.name.value.trim().length < 2 ? 'Please enter your name.' : ''),
    phone: () => setError(f.phone, /^[6-9]\d{9}$/.test(cleanPhone(f.phone.value)) ? '' : 'Please enter a 10-digit mobile number.'),
    date: () => {
      if (!f.date.value) return setError(f.date, 'Please choose a date.');
      return setError(f.date, f.date.value < isoDate(new Date()) ? 'Please choose today or a later date.' : '');
    },
    time: () => {
      if (f.time.value) return setError(f.time, '');
      const allPast = !f.time.querySelector('option[value]:not([value=""]):not(:disabled)');
      return setError(f.time, allPast ? 'No more slots today. Please pick another date.' : 'Please choose a start time.');
    },
  };

  // Clear an error as soon as the visitor fixes the field
  Object.keys(checks).forEach((k) => {
    const evt = f[k].tagName === 'SELECT' || f[k].type === 'date' ? 'change' : 'input';
    f[k].addEventListener(evt, () => { if (f[k].getAttribute('aria-invalid')) checks[k](); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const order = ['name', 'phone', 'date', 'time'];
    const results = order.map((k) => checks[k]());
    const firstBad = order.find((k, i) => !results[i]);
    if (firstBad) { f[firstBad].focus(); return; }

    const phone = cleanPhone(f.phone.value);
    const [y, m, d] = f.date.value.split('-').map(Number);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dateText = days[new Date(y, m - 1, d).getDay()] + ', ' + d + ' ' + months[m - 1] + ' ' + y; // "Thu, 29 Oct 2026"
    const start = Number(f.time.value);
    const hours = Number(f.hours.value);
    const timeText = hourLabel(start) + ' to ' + hourLabel(start + hours) +
      ' (' + hours + (hours === 1 ? ' hour)' : ' hours)');

    const message = [
      'Hi A2H Badminton & Indoor Sports! I would like to book a slot.',
      '',
      'Name: ' + f.name.value.trim(),
      'Phone: ' + phone.slice(0, 5) + ' ' + phone.slice(5),
      'Sport: ' + f.sport.value,
      'Date: ' + dateText,
      'Time: ' + timeText,
      '',
      'Please confirm if this slot is available.',
    ].join('\n');

    const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);

    // New tab on computers; if the browser blocks it, open in the same tab
    const win = window.open(url, '_blank');
    if (win) win.opener = null;
    else window.location.href = url;
  });
}
