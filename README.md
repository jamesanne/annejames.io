# annejames.io

Anne James's consulting site: strategic insight and AI ethics & governance for
cultural institutions and tourism and travel brands. Plain static HTML/CSS,
one shared stylesheet and one small script. No build step, no framework, and
no third-party requests.

Hosted on [statichost.eu](https://statichost.eu) (EU-only infrastructure, no
visitor IP logging). Every push to this repository republishes the site.

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
  404.html                served by statichost for any missing page
/case-studies/            case studies
/blog/                    index.html + articles republished from Substack
/es/  /pt/                Spanish and Portuguese
/css/styles.css           one shared stylesheet
/js/site.js               mobile nav, dropdowns, blog tag filter, email address
/fonts/                   self-hosted WOFF fonts + their OFL licences
/images/                  WebP images in several widths (srcset); share images as JPG
robots.txt, sitemap.xml
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
  reversed parts on any `<a class="js-email" data-u="…" data-d="…">`.
- **Blog posts** keep their original Substack publish date and carry a
  canonical link and a visible link back to the original. They're left out of
  `sitemap.xml` because their canonical URL is on Substack.
- **Share images** are 1200×630 JPGs. Pages without their own use
  `images/share-default.jpg`.
- **404 page.** It can be served at any depth, so every link and asset in
  `404.html` uses a root-absolute path (`/css/styles.css`, not
  `css/styles.css`).
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
