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

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      toggle.focus();
    }
  });

  // Close the "Industries" dropdown when clicking outside it.
  document.querySelectorAll('.nav-drop').forEach(function (drop) {
    document.addEventListener('click', function (e) {
      if (!drop.contains(e.target)) drop.removeAttribute('open');
    });
  });
});
