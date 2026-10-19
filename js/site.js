// Interface text the script adds to the page, picked by the page's <html lang>.
var I18N = (function () {
  var t = {
    en: {
      goToPost: 'Go to post ',
      showAll: 'Show all posts',
      allShown: function (n) { return 'Showing all ' + n + ' posts'; },
      someShown: function (n, label) { return 'Showing ' + n + (n === 1 ? ' post' : ' posts') + ' tagged ' + label; },
      emailBody: 'Hi Anne,\r\n\r\nOur organization:\r\nWhat we are working on:\r\nTiming:\r\n'
    },
    es: {
      goToPost: 'Ir al artículo ',
      showAll: 'Ver todos los artículos',
      allShown: function (n) { return 'Mostrando los ' + n + ' artículos'; },
      someShown: function (n, label) { return 'Mostrando ' + n + (n === 1 ? ' artículo' : ' artículos') + ' con la etiqueta ' + label; },
      emailBody: 'Hola, Anne:\r\n\r\nNuestra organización:\r\nEn qué estamos trabajando:\r\nPlazos:\r\n'
    },
    pt: {
      goToPost: 'Ir para o artigo ',
      showAll: 'Ver todos os artigos',
      allShown: function (n) { return 'A mostrar os ' + n + ' artigos'; },
      someShown: function (n, label) { return 'A mostrar ' + n + (n === 1 ? ' artigo' : ' artigos') + ' com a etiqueta ' + label; },
      emailBody: 'Olá, Anne,\r\n\r\nA nossa organização:\r\nEm que estamos a trabalhar:\r\nPrazos:\r\n'
    }
  };
  var lang = (document.documentElement.lang || 'en').slice(0, 2);
  return t[lang] || t.en;
})();

// Mobile nav toggle — no dependencies, ~0.5kb.
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A' && window.innerWidth < 960) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('click', function (e) {
    if (
      nav.classList.contains('is-open') &&
      !nav.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      toggle.focus();
    }
  });

  // Close the "Industries"/language dropdowns when clicking outside them.
  document.addEventListener('click', function (e) {
    document.querySelectorAll('.nav-drop[open], .lang-drop[open]').forEach(function (drop) {
      if (!drop.contains(e.target)) drop.removeAttribute('open');
    });
  });

  // Accordions ("who it's for"): exactly one item should always stay open.
  // The `name` attribute on each <details> already makes opening one close
  // the others; this just blocks the one gap — clicking the sole open
  // item's own header, which would otherwise leave all three collapsed.
  document.querySelectorAll('.accordion').forEach(function (accordion) {
    var items = accordion.querySelectorAll(':scope > .accordion-item');
    items.forEach(function (item) {
      var summary = item.querySelector(':scope > summary');
      if (!summary) return;
      summary.addEventListener('click', function (e) {
        var openCount = 0;
        items.forEach(function (i) { if (i.open) openCount++; });
        if (item.open && openCount === 1) {
          e.preventDefault();
        }
      });
    });
  });

  // Blog post carousel: arrow buttons + synced dots, native scroll otherwise.
  document.querySelectorAll('.post-carousel').forEach(function (track) {
    var wrap = track.closest('section');
    if (!wrap) return;
    var prevBtn = wrap.querySelector('[data-carousel-dir="-1"]');
    var nextBtn = wrap.querySelector('[data-carousel-dir="1"]');
    var dotsHost = wrap.querySelector('.carousel-dots');
    var cards = Array.from(track.children);
    if (!cards.length) return;

    if (dotsHost) {
      dotsHost.innerHTML = '';
      cards.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', I18N.goToPost + (i + 1));
        dot.addEventListener('click', function () {
          cards[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        });
        dotsHost.appendChild(dot);
      });
    }

    function activeIndex() {
      var trackLeft = track.getBoundingClientRect().left;
      var best = 0, bestDist = Infinity;
      cards.forEach(function (card, i) {
        var dist = Math.abs(card.getBoundingClientRect().left - trackLeft);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      return best;
    }

    function sync() {
      var idx = activeIndex();
      if (dotsHost) {
        Array.from(dotsHost.children).forEach(function (dot, i) {
          dot.setAttribute('aria-current', i === idx ? 'true' : 'false');
        });
      }
      // Hide arrows and dots when every card already fits (nothing to scroll).
      var fits = track.scrollWidth <= track.clientWidth + 4;
      [prevBtn, nextBtn, dotsHost].forEach(function (el) { if (el) el.hidden = fits; });
      if (prevBtn) prevBtn.disabled = track.scrollLeft <= 4;
      if (nextBtn) nextBtn.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
    }

    var scrollTimer;
    track.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(sync, 80);
    });

    if (prevBtn) prevBtn.addEventListener('click', function () {
      var idx = Math.max(0, activeIndex() - 1);
      cards[idx].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    });
    if (nextBtn) nextBtn.addEventListener('click', function () {
      var idx = Math.min(cards.length - 1, activeIndex() + 1);
      cards[idx].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    });

    window.addEventListener('resize', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(sync, 120);
    });
    sync();
  });
});


// Tabs ("index cards"). Without JS every card is simply shown, stacked.
document.querySelectorAll('[data-tabs]').forEach(function (root) {
  var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
  var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
  if (!tabs.length) return;

  panels.forEach(function (p, i) {
    p.setAttribute('role', 'tabpanel');
    p.setAttribute('aria-labelledby', tabs[i].id);
  });

  function select(i, focus) {
    tabs.forEach(function (t, j) {
      var on = i === j;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      panels[j].classList.toggle('is-active', on);
    });
    if (focus) tabs[i].focus();
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(i); });
    t.addEventListener('keydown', function (e) {
      var n = tabs.length, next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % n;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + n) % n;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = n - 1;
      if (next !== null) { e.preventDefault(); select(next, true); }
    });
  });

  // Deep link: services-museums.html#skills opens that card
  var hash = location.hash.slice(1), start = 0;
  tabs.forEach(function (t, i) {
    if (t.id === hash || t.getAttribute('aria-controls') === hash) start = i;
  });
  select(start);
});


// Blog: filter posts by tag. Shareable via ?tag=slug. Without JS every post is listed.
document.querySelectorAll('[data-filter-root]').forEach(function (root) {
  var buttons = Array.prototype.slice.call(root.querySelectorAll('.tag-filter [data-tag]'));
  var cards = Array.prototype.slice.call(root.querySelectorAll('[data-tags]'));
  var status = root.querySelector('[data-filter-status]');
  var known = buttons.map(function (b) { return b.getAttribute('data-tag'); });
  var bar = root.querySelector('.tag-filter');
  var barHidden = !bar || bar.hidden;
  // "Show all posts" control, so a filtered view can always be undone (needed when the filter bar is hidden)
  var reset = null;
  if (status) {
    reset = document.createElement('button');
    reset.type = 'button';
    reset.className = 'filter-reset';
    reset.textContent = I18N.showAll;
    reset.hidden = true;
    reset.addEventListener('click', function () { apply('all', true); });
    status.insertAdjacentElement('afterend', reset);
  }

  // renamed tags: old slug -> new slug, so previously shared ?tag= links still work
  var renamed = { 'policy-leadership': 'policy' };

  function apply(tag, updateUrl) {
    if (renamed[tag]) tag = renamed[tag];
    if (known.indexOf(tag) === -1) tag = 'all';
    var shown = 0, label = '';
    cards.forEach(function (c) {
      var on = tag === 'all' || (' ' + c.getAttribute('data-tags') + ' ').indexOf(' ' + tag + ' ') > -1;
      c.hidden = !on;
      if (on) shown++;
    });
    buttons.forEach(function (b) {
      var on = b.getAttribute('data-tag') === tag;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (on) label = b.getAttribute('data-label') || '';
    });
    if (status) {
      status.textContent = tag === 'all'
        ? (barHidden ? '' : I18N.allShown(shown))
        : I18N.someShown(shown, label);
      status.hidden = barHidden && tag === 'all';
    }
    if (reset) reset.hidden = tag === 'all';
    if (updateUrl && window.history && history.replaceState) {
      // best effort: some sandboxed or file:// contexts refuse to change the address bar
      try { history.replaceState(null, '', tag === 'all' ? location.pathname : '?tag=' + encodeURIComponent(tag)); } catch (e) {}
    }
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () { apply(b.getAttribute('data-tag'), true); });
  });
  // tags on the cards filter in place instead of reloading
  root.querySelectorAll('a.tag[href^="?tag="]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      apply(decodeURIComponent(a.getAttribute('href').slice(5)), true);
    });
  });
  var m = /[?&]tag=([^&]+)/.exec(location.search);
  apply(m ? decodeURIComponent(m[1]) : 'all', false);
});

// Email: assembled at runtime from reversed parts so scrapers reading the HTML don't find it
document.querySelectorAll('a.js-email').forEach(function (a) {
  var rev = function (t) { return (t || '').split('').reverse().join(''); };
  var addr = rev(a.getAttribute('data-u')) + String.fromCharCode(64) + rev(a.getAttribute('data-d'));
  var subject = a.getAttribute('data-subject');
  if (subject) {
    // Service buttons: pre-fill subject and a short prompt, keep the button's own label
    var body = I18N.emailBody;
    a.setAttribute('href', 'mai' + 'lto:' + addr + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body));
  } else {
    a.setAttribute('href', 'mai' + 'lto:' + addr);
    a.textContent = addr;
  }
});
