(() => {
  'use strict';
  const pageName = location.pathname.split('/').pop() || 'index.html';
  const legacyAnchors = pageName === 'index.html'
    ? { '#publications': 'publications.html', '#patents': 'patents.html', '#projects': 'projects.html', '#recognition': 'activities.html', '#contact': 'about.html#contact' }
    : pageName === 'patents.html' ? { '#projects': 'projects.html' } : {};
  if (legacyAnchors[location.hash]) { location.replace(legacyAnchors[location.hash]); return; }
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  const mobile = window.matchMedia('(max-width: 1000px)');
  if (menu && nav) {
    document.documentElement.classList.add('nav-enhanced');
    menu.hidden = false;
    const setOpen = open => {
      nav.classList.toggle('open', open);
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      menu.querySelector('.menu-symbol').textContent = open ? '−' : '+';
    };
    menu.addEventListener('click', () => setOpen(menu.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', event => { if (event.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); menu.focus(); }
    });
    document.addEventListener('click', event => { if (mobile.matches && !event.target.closest('.site-header')) setOpen(false); });
    document.addEventListener('focusin', event => { if (mobile.matches && !event.target.closest('.site-header')) setOpen(false); });
    mobile.addEventListener('change', () => setOpen(false));
  }
  const controls = document.querySelector('.publication-controls');
  const list = document.querySelector('#publication-list');
  const count = document.querySelector('#publication-count');
  if (controls && list && count) {
    controls.hidden = false;
    const buttons = [...controls.querySelectorAll('[data-filter]')];
    const rows = [...list.querySelectorAll('.publication-item')];
    buttons.forEach(button => button.addEventListener('click', () => {
      const topic = button.dataset.filter;
      buttons.forEach(other => {
        const selected = other === button;
        other.setAttribute('aria-pressed', String(selected));
        other.classList.toggle('active', selected);
      });
      let visible = 0;
      rows.forEach(row => { row.hidden = topic !== 'all' && !row.dataset.topics.split(' ').includes(topic); if (!row.hidden) visible++; });
      count.textContent = `${visible} published ${visible === 1 ? 'paper' : 'papers'}${topic === 'all' ? '' : ' · ' + button.textContent}`;
    }));
  }
  document.querySelectorAll('.print-button').forEach(button => { button.hidden = false; button.addEventListener('click', () => window.print()); });
  const year = document.querySelector('#copyright-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
