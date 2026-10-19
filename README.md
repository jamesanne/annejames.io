# annejames.io

Anne James's consulting site: strategic insight and AI ethics & governance for
cultural institutions and tourism and travel brands. Plain static HTML/CSS,
one shared stylesheet and one small script. No build step, no framework, and
no third-party requests.

Code lives on GitHub. Hosting is on statichost.eu (Sweden, EU-only
infrastructure, no visitor IP logging) at `annejamesio.statichost.page`, and
every push to GitHub republishes the site through a webhook. DNS is still at
Cloudflare until the domain moves to Infomaniak.

---

## What's left — checklist

### 1. Move hosting to the EU
- [x] Step 1: push the current site to GitHub (includes `statichost.yml`)
- [x] Step 2: create the site on statichost.eu, connect the repo (HTTPS URL if
      the repo is public; SSH URL plus a deploy key if it's private), and check
      the site at `SITENAME.statichost.page`
- [x] Step 3: GitHub → Settings → Webhooks → add
      `https://builder.statichost.eu/SITENAME`, content type `application/json`,
      "Just the push event"
- [x] Step 4: statichost → site → Settings → Domains: add `annejames.io` and
      `www.annejames.io`
- [x] Step 5: Cloudflare DNS now points at statichost (A `95.217.26.94`,
      AAAA `2a01:4f9:c01f:8002::`, `www` CNAME `annejamesio.statichost.page`,
      all DNS only). annejames.io serves from statichost (Let's Encrypt
      certificate, 13 Oct 2026)
- [x] Check `https://www.annejames.io` also shows a Let's Encrypt certificate
- [x] Turn off GitHub Pages: repo → Settings → Pages → remove the custom
      domain and unpublish
- [x] Step 6: paid Infomaniak for the GoDaddy → Infomaniak transfer (14 Oct
      2026). Transfer in progress (about 5 days). Leave GoDaddy's Domain Lock
      off until it completes. Approve GoDaddy's outgoing-transfer email if one
      arrives, and confirm any email Infomaniak sends
- [ ] Step 7 (after the transfer completes): in Infomaniak's DNS zone for
      annejames.io, delete any default records Infomaniak added, then create:
      - `A` `@` → `95.217.26.94`
      - `AAAA` `@` → `2a01:4f9:c01f:8002::`
      - `CNAME` `www` → `annejamesio.statichost.page`
      - "No mail" records, so nobody can send spoofed email as @annejames.io
        (skip these if you set up kSuite email on the domain instead):
        - `MX` `@` → `.` (priority 0, a "null MX")
        - `TXT` `@` → `v=spf1 -all`
        - `TXT` `_dmarc` → `v=DMARC1; p=reject;`

      Then switch the domain's nameservers to Infomaniak's. Wait a day, check
      that annejames.io and www still show a Let's Encrypt certificate, then
      delete the site from Cloudflare and close the account
- [ ] Ask statichost (hello@statichost.eu) whether a second site can go on the
      free plan, or what a second site costs

### 2. Share images and preview text (before calling the site done)
Every page needs its title, meta description, `og:title`, `og:description`,
`og:image` and `og:image:alt` reviewed. Share images are 1200×630.
- [ ] Create the default share image and upload it as `images/share-default.jpg`.
      **It isn't in the repo yet**, so 11 English pages currently point to a
      missing image: home, both services pages, projects, about, contact, blog
      index, privacy, cookies and both case studies
- [ ] Decide which pages get their own share image instead of the default
      (e.g. the services pages and case studies)
- [ ] Update `og:image:alt` on those 11 pages. It still says "Portrait of Anne
      James", and the share image won't be your headshot
- [ ] Review the share images and text for the six blog posts, which already
      have their own `images/blog/*-social.jpg`
- [ ] Preview each page in a link-preview checker (or by pasting the link into
      LinkedIn) once the site is live on statichost

### 3. Privacy and cookies pages (English done; check before publishing)
- [ ] Confirm or adjust the retention periods for email and bookings
- [ ] Check meetergo's data processing agreement and where its servers are
      (the policy describes it as German and EU-only)
- [ ] Set "Last updated" to the date you publish
- [ ] Publish only after the move to statichost. The policy names it as the host

### 4. Content still pending
- [ ] PhotoIreland case study: the page is set to `noindex` while the work is
      underway (the project starts November 2026). Remove
      `<meta name="robots" content="noindex">` when it's finished
- [ ] Testimonials on the home page are hidden until each person approves their
      quote. Remove the `hidden` attribute on `.testimonials-wrap` in
      `index.html` to show them
- [ ] Delete `images/headshot-placeholder.svg`. Nothing uses it any more

### 5. Spanish and Portuguese (after the English is final)
- [ ] Rebuild every ES and PT page from the final English pages, including the
      blog, case studies and new privacy and cookies pages
- [ ] Add `og:description` to all ES and PT pages (none have it yet)
- [ ] Clear the remaining `hello@example.com` placeholders (ES and PT
      contact, privacy and cookies pages)
- [ ] Show the language switcher: remove `hidden` from
      `<div class="lang-drop-item" hidden>` on all 17 English pages

### 6. Nice to have
- [ ] A custom 404 page (statichost supports one)
- [ ] `robots.txt` and `sitemap.xml`

---

## Done recently
- Fonts are self-hosted. There are no requests to Google Fonts
- English privacy and cookies pages are written: no cookies, no analytics, EU
  and Swiss services only
- Analytics deliberately left out
- Removed the unused red-threads images (Chiharu Shiota installation)

---

## Structure

```
/                         English pages
  index.html
  services-museums.html
  services-tourism.html
  projects.html
  about.html
  contact.html
  privacy.html
  cookies.html
/case-studies/            photoireland.html (noindex, in progress), zymbol.html
/blog/                    index.html + six articles republished from Substack
/es/  /pt/                Spanish and Portuguese (out of date; see checklist 5)
/css/styles.css           one shared stylesheet
/js/site.js               mobile nav, dropdowns, blog tag filter, email address
/fonts/                   self-hosted WOFF fonts + their OFL licences
/images/                  WebP images in several widths (srcset); share images as JPG
statichost.yml            statichost.eu config: publish the repo root as-is
```

## House rules

- **No third parties on the page.** No analytics, embeds, tracking pixels or
  outside fonts or scripts. Substack, LinkedIn and meetergo are plain links
  only. If that ever changes, update the privacy and cookies pages first.
- **Image credits.** Feature photos (home page, blog, case studies) carry a
  visible credit (e.g. "Photo: … / Unsplash"). The decorative images on the
  services pages have no credit and `alt=""`. Before adding an uncredited
  image, check that its licence doesn't require attribution. Unsplash's
  licence doesn't; Creative Commons BY licences do.
- **Email address.** It never appears in the HTML. `site.js` assembles it from
  reversed parts:
  `<a class="js-email" data-u="semajenna" data-d="moc.kite" href="#">`.
- **Blog posts** keep their original Substack publish date and carry a
  canonical link and a visible link back to the original.
- **Fonts.** Newsreader 600 (headings, variable optical size) and Inclusive
  Sans 400–700 plus italic 400 (body). They're subset to Latin plus the
  characters the pages use. If new text adds unusual characters (e.g. Polish
  or Greek), rebuild the font files from the originals.

## Design and accessibility

- **Colour:** a warm off-white base, near-black text, plum (`--plum`) as the
  single bold colour, and vermilion (`--spark`) for small marks only, never
  text. The tokens are at the top of `styles.css`.
- **Type:** 19px base size with generous line height, for comfortable reading
  on a phone.
- **Keyboard and focus:** visible focus rings, a skip-to-content link on every
  page, and menus that work with the keyboard and Escape.
- **Motion:** `prefers-reduced-motion` is respected.
- **Page weight:** WebP images in multiple sizes with `loading="lazy"`, and no
  frameworks.
