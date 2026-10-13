# AI Governance Consulting — site

A static, trilingual (EN/ES/PT) business site: 6 pages × 3 languages, one shared
stylesheet, minimal JS. Built to upload straight to GitHub Pages.

## Structure

```
/                      → English (GitHub Pages default/root)
  index.html
  services-museums.html
  services-tourism.html
  services-tech.html
  about.html
  contact.html
/es/                   → Spanish versions of the same six pages
/pt/                   → Portuguese versions of the same six pages
/css/styles.css        → one shared stylesheet for every page/language
/js/site.js            → mobile nav toggle + dropdown close (~1kb, no dependencies)
/images/headshot-placeholder.svg → swap this for your real photo (see below)
```

## Before you publish — things you need to change

1. **Brand name.** "AI Governance Consulting" / "Gobernanza de IA" / "Governança
   de IA" is a placeholder in the header `<a class="brand">` and footer on every
   page. Find-and-replace it with your actual name or business name in all 18
   HTML files.
2. **Headshot.** Add your real photo as `images/headshot.jpg` (or .webp — WebP
   is smaller and better for page weight/carbon footprint), then in
   `about.html`, `es/sobre-mi.html`, `pt/sobre.html`, and the home pages,
   swap:
   `<img src="images/headshot-placeholder.svg" alt="Placeholder — add your headshot here" ...>`
   for something like:
   `<img src="images/headshot.jpg" alt="Portrait of [Your Name]" width="..." height="...">`
   Keep real width/height attributes to avoid layout shift, and compress the
   photo (under ~150KB) to keep the carbon footprint low.
3. **Contact form.** The form in `contact.html` (and its ES/PT versions) has no
   backend — `action="#"` is a placeholder. The simplest low-effort options:
   - [Formspree](https://formspree.io) or [Netlify Forms](https://docs.netlify.com/manage/forms/)
     — both have a free tier, just point `action` at the endpoint they give you.
   - Or drop the form and keep just the `mailto:` link if you'd rather not run
     a backend at all.
4. **Email address.** Replace `hello@example.com` everywhere it appears.
5. **City/region.** Replace the `[your city]` / `[tu ciudad]` / `[sua cidade]`
   and region placeholders in the contact page panel.

## Publishing to GitHub Pages

1. Push this whole folder to a repo, with these files at the repo root.
2. In the repo's Settings → Pages, set the source to the `main` branch, root
   folder.
3. Your English pages will be live at `https://<username>.github.io/<repo>/`,
   Spanish at `.../es/`, Portuguese at `.../pt/`.
4. If you use a custom domain, add a `CNAME` file at the root per GitHub's docs.

## Adding a real blog later

You mentioned Substack for now. When you're ready to bring it in-house, the
site's structure already keeps room for a `/blog/` folder in the same pattern
as `/es/` and `/pt/` — Ghost.org can also sit on a subdomain (`blog.yoursite.com`)
without touching this site at all.

## Design & accessibility notes

- **Type:** Newsreader (headers) + Inclusive Sans (body), self-hosted in `/fonts` as subsetted WOFF files (SIL Open Font Licence, copies alongside). No requests to Google Fonts.
  with `font-display: swap`. Base body size is 19px with 1.65 line-height —
  deliberately larger than the 16px web default so it stays comfortable for
  older readers on a phone screen at a conference.
- **Color:** the teal and amber accents are only used decoratively or as large
  fills — actual text/button contrast runs through darkened `--teal-text` and
  `--amber-text` tokens so it clears WCAG AA against white, blush, and lilac
  backgrounds. Nothing depends on red/green distinction, so it should hold up
  for the common forms of color blindness (protanopia, deuteranopia,
  tritanopia) — but it's worth spot-checking your final choices with a
  simulator like [Coblis](https://www.color-blindness.com/coblis-color-blindness-simulator/)
  once you've made any tweaks.
- **Keyboard/focus:** every interactive element has a visible focus ring
  (`:focus-visible`), there's a skip-to-content link on every page, and the
  mobile nav and "Industries" dropdown both work with keyboard and Escape.
- **Motion:** `prefers-reduced-motion` is respected; the only animation is the
  nav drawer sliding in.

## Keeping the carbon footprint down

- No build tooling, no JS framework, no icon font — the whole site is two
  small files (CSS + a ~1kb JS file) plus HTML.
- Only two web fonts are loaded, and only the weights actually used.
- The "photography" is done with flat color panels instead of images, so the
  only image on the whole site (once you add it) is your headshot — keep it
  compressed and appropriately sized, and page weight should stay well under
  the [Website Carbon](https://www.websitecarbon.com/) "cleaner than most
  websites" range once hosted on a green host like GitHub Pages.
