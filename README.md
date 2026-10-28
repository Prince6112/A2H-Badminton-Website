# A2H Badminton & Indoor Sports website (v1)

A one-page, mobile-first website. Its only job: get people to **WhatsApp or call** to book.

## How it works (the 30-second explanation)

- It's a **static site**: plain files (HTML for content, CSS for looks, a little JavaScript for extras). There's no server, database or login. That makes it fast, free to host, and hard to break.
- Every "Book" button is a **WhatsApp click-to-chat link** (`wa.me/917200796960?text=...`). The message is already typed in when WhatsApp opens. Phone buttons use `tel:` links.
- The **booking form** (Book & play section, `#book`) asks for name, phone, sport, date, start time and how long. "Continue on WhatsApp" turns those into a ready-to-send WhatsApp message. Nothing is stored or sent to a server; the visitor still presses Send in WhatsApp.
- On phones, a **sticky bar** at the bottom keeps WhatsApp and Call one tap away.
- **SEO**: the page title and description, plus a hidden "structured data" block (JSON-LD), tell Google the name, address, hours and phone number.

## Files

```
index.html        All content (text, links, sections)
css/styles.css    All styling. Brand colours are at the top (:root)
js/main.js        Mobile menu, "Open now" badge, footer year, booking form
images/           Web-optimised photos (WebP + JPG fallback)
favicon.svg       Browser tab icon
robots.txt        Tells search engines they can index the site
```

## Preview locally

Open `index.html` in a browser. Or, in VS Code, run `npx serve .` in this folder and open the address it prints.

## Common updates

| Change | Where |
| --- | --- |
| Opening hours | Currently 24 hours. `index.html` (search "24 hours"), the JSON-LD `openingHoursSpecification` in `<head>`, and the "Open now" badge in `js/main.js` |
| Phone / WhatsApp number | `index.html`: search `7200796960` and replace every occurrence (also `WHATSAPP_NUMBER` in `js/main.js`) |
| Add a gallery photo | Add the file to `images/`, then copy a `<figure class="gallery-item">` block in the Gallery section |
| Booking form | Fields: `index.html` (search `booking-form`). Message wording, time slots and the WhatsApp number it sends to: `js/main.js` (search `Booking form`) |
| Coaching details | Coaching section in `index.html`: replace the "Coming soon" cards |
| Colours | Top of `css/styles.css` |
| Logo | `images/logo-wide.svg` (header), `images/logo-on-dark.svg` (footer), `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`. Master files and the script that makes them are in `../Logo/` |

## Still to do before launch

- Confirm the items marked `TODO` in `index.html`
- Domain → add canonical URL, absolute `og:image`, sitemap
- Deploy (Cloudflare Pages or Netlify), then Google Search Console and the Google Business Profile
- Tamil version (planned as `/ta/index.html`, with a language switch)
