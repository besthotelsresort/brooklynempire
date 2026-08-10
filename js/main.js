(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      });
    });

    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      if (history.replaceState) {
        history.replaceState(null, '', id);
      }
    });
  });

  var tabsRoot = document.querySelector('[data-prop-tabs]');
  if (tabsRoot) {
    var tabs = Array.prototype.slice.call(tabsRoot.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(tabsRoot.querySelectorAll('[role="tabpanel"]'));
    var accordionBtns = Array.prototype.slice.call(tabsRoot.querySelectorAll('[data-accordion]'));

    function isAccordion() {
      return window.matchMedia('(max-width: 480px)').matches;
    }

    function activateTab(id, focusTab) {
      tabs.forEach(function (tab) {
        var on = tab.getAttribute('data-tab') === id;
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.setAttribute('tabindex', on ? '0' : '-1');
        if (on && focusTab) tab.focus();
      });

      panels.forEach(function (panel) {
        var on = panel.getAttribute('data-panel') === id;
        if (isAccordion()) {
          panel.hidden = false;
          panel.classList.toggle('is-open', on);
          panel.classList.toggle('is-active', on);
        } else {
          panel.hidden = !on;
          panel.classList.toggle('is-active', on);
          panel.classList.toggle('is-open', on);
        }
      });

      accordionBtns.forEach(function (btn) {
        var on = btn.getAttribute('data-accordion') === id;
        btn.setAttribute('aria-expanded', on ? 'true' : 'false');
      });
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        activateTab(tab.getAttribute('data-tab'), false);
      });

      tab.addEventListener('keydown', function (e) {
        if (isAccordion()) return;
        var next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          next = tabs[(index + 1) % tabs.length];
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          next = tabs[(index - 1 + tabs.length) % tabs.length];
        } else if (e.key === 'Home') {
          next = tabs[0];
        } else if (e.key === 'End') {
          next = tabs[tabs.length - 1];
        }
        if (next) {
          e.preventDefault();
          activateTab(next.getAttribute('data-tab'), true);
        }
      });
    });

    accordionBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activateTab(btn.getAttribute('data-accordion'), false);
      });
    });

    window.addEventListener('resize', function () {
      var selected = tabsRoot.querySelector('[role="tab"][aria-selected="true"]');
      if (selected) activateTab(selected.getAttribute('data-tab'), false);
    });

    var initial = tabsRoot.querySelector('[role="tab"][aria-selected="true"]');
    if (initial) activateTab(initial.getAttribute('data-tab'), false);
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) {
        el.classList.add('is-visible');
      });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      reveals.forEach(function (el) {
        io.observe(el);
      });
    }
  }
})();
