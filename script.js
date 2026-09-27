(() => {
  'use strict';
  const pageName = location.pathname.split('/').pop() || 'index.html';
  const legacyAnchors = pageName === 'index.html'
    ? { '#publications': 'publications.html', '#patents': 'patents.html', '#projects': 'projects.html', '#recognition': 'about.html#recognition' }
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
  const empty = document.querySelector('#publication-empty');
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
      list.querySelectorAll('[data-year-group]').forEach(group => {
        group.hidden = ![...group.querySelectorAll('.publication-item')].some(row => !row.hidden);
      });
      count.textContent = `${visible} published ${visible === 1 ? 'paper' : 'papers'}${topic === 'all' ? '' : ' · ' + button.textContent}`;
      if (empty) empty.hidden = visible !== 0;
    }));
  }
  const galleryButtons = [...document.querySelectorAll('.gallery-open')];
  const galleryDialog = document.querySelector('#gallery-dialog');
  if (galleryDialog && galleryButtons.length) {
    let activeIndex = 0;
    let opener = null;
    const image = galleryDialog.querySelector('img');
    const meta = galleryDialog.querySelector('.gallery-dialog-meta');
    const title = galleryDialog.querySelector('.gallery-dialog-title');
    const caption = galleryDialog.querySelector('.gallery-dialog-caption');
    const previous = galleryDialog.querySelector('.gallery-prev');
    const next = galleryDialog.querySelector('.gallery-next');
    previous.hidden = next.hidden = galleryButtons.length < 2;
    const show = index => {
      activeIndex = (index + galleryButtons.length) % galleryButtons.length;
      const button = galleryButtons[activeIndex];
      const thumbnail = button.querySelector('img');
      image.src = thumbnail.currentSrc || thumbnail.src;
      image.alt = thumbnail.alt;
      meta.textContent = [button.dataset.galleryCategory, button.dataset.galleryLocation, button.dataset.galleryYear].filter(Boolean).join(' · ');
      title.textContent = button.dataset.galleryTitle;
      caption.textContent = button.dataset.galleryCaption;
      caption.hidden = !button.dataset.galleryCaption;
    };
    galleryButtons.forEach((button,index) => button.addEventListener('click', () => {
      opener = button;
      show(index);
      galleryDialog.showModal();
      galleryDialog.querySelector('.gallery-close').focus();
    }));
    previous.addEventListener('click', () => show(activeIndex - 1));
    next.addEventListener('click', () => show(activeIndex + 1));
    galleryDialog.querySelector('.gallery-close').addEventListener('click', () => galleryDialog.close());
    galleryDialog.addEventListener('click', event => { if (event.target === galleryDialog) galleryDialog.close(); });
    galleryDialog.addEventListener('close', () => { opener?.focus(); image.removeAttribute('src'); });
    galleryDialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' && galleryButtons.length > 1) { event.preventDefault(); show(activeIndex - 1); }
      if (event.key === 'ArrowRight' && galleryButtons.length > 1) { event.preventDefault(); show(activeIndex + 1); }
    });
  }
  document.querySelectorAll('.print-button').forEach(button => { button.hidden = false; button.addEventListener('click', () => window.print()); });
  const year = document.querySelector('#copyright-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
