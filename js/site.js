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
  document.querySelectorAll('.nav-drop, .lang-drop').forEach(function (drop) {
    document.addEventListener('click', function (e) {
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
        dot.setAttribute('aria-label', 'Go to post ' + (i + 1));
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

    sync();
  });
});
