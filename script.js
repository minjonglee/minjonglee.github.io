(() => {
  'use strict';
  const pageName = location.pathname.split('/').pop() || 'index.html';
  const legacyAnchors = pageName === 'index.html'
    ? { '#publications': 'publications.html', '#patents': 'patents.html', '#projects': 'projects.html', '#recognition': 'about.html#recognition' }
    : pageName === 'patents.html' ? { '#projects': 'projects.html' }
    : pageName === 'activities.html' ? { '#recognition': 'about.html#recognition' } : {};
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
  const search = document.querySelector('#publication-search');
  const yearFilter = document.querySelector('#publication-year-filter');
  const list = document.querySelector('#publication-list');
  const count = document.querySelector('#publication-count');
  const empty = document.querySelector('#publication-empty');
  if (search && yearFilter && list && count) {
    const rows = [...list.querySelectorAll('.publication-item')];
    const update = () => {
      const query = search.value.trim().toLocaleLowerCase();
      const year = yearFilter.value;
      let visible = 0;
      rows.forEach(row => { row.hidden = (year !== 'all' && row.dataset.year !== year) || !row.dataset.search.includes(query); if (!row.hidden) visible++; });
      list.querySelectorAll('[data-year-group]').forEach(group => {
        group.hidden = ![...group.querySelectorAll('.publication-item')].some(row => !row.hidden);
      });
      count.textContent = `${visible} ${visible === 1 ? 'record' : 'records'} shown`;
      if (empty) empty.hidden = visible !== 0;
    };
    search.addEventListener('input', update);
    yearFilter.addEventListener('change', update);
  }
  const patentButtons = [...document.querySelectorAll('[data-patent-filter]')];
  if (patentButtons.length) {
    const search = document.querySelector('#patent-search');
    const families = [...document.querySelectorAll('.patent-family-entry')];
    const empty = document.querySelector('#patent-empty');
    const update = () => {
      const filter = patentButtons.find(button => button.getAttribute('aria-pressed') === 'true')?.dataset.patentFilter || 'all';
      const query = search?.value.trim().toLocaleLowerCase() || '';
      for (const family of families) {
        const matches = family.dataset.patentSearch.includes(query);
        const filings = [...family.querySelectorAll('.patent-filing')];
        filings.forEach(filing => { filing.hidden = !matches || filter !== 'all' && filing.dataset.patentStatus !== filter; });
        family.hidden = !filings.some(filing => !filing.hidden);
      }
      if (empty) empty.hidden = families.some(family => !family.hidden);
    };
    patentButtons.forEach(button => button.addEventListener('click', () => {
      patentButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      update();
    }));
    search?.addEventListener('input', update);
  }
  const activityButtons = [...document.querySelectorAll('[data-activity-filter]')];
  if (activityButtons.length) {
    const entries = [...document.querySelectorAll('.activity-entry')];
    const empty = document.querySelector('#activity-empty');
    activityButtons.forEach(button => button.addEventListener('click', () => {
      const category = button.dataset.activityFilter;
      activityButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      entries.forEach(entry => { entry.hidden = category !== 'all' && entry.dataset.activityCategory !== category; });
      if (empty) empty.hidden = entries.some(entry => !entry.hidden);
    }));
    const openHashEntry = () => {
      const id = decodeURIComponent(location.hash.slice(1));
      const entry = id && document.getElementById(id);
      if (entry?.matches('details.activity-entry')) {
        activityButtons[0].click();
        entry.open = true;
      }
    };
    openHashEntry();
    window.addEventListener('hashchange', openHashEntry);
  }
  const activityLightbox = document.querySelector('#activity-lightbox');
  const activityImages = [...document.querySelectorAll('[data-activity-image]')];
  if (activityLightbox && activityImages.length) {
    const fullImage = activityLightbox.querySelector('img');
    const caption = activityLightbox.querySelector('.activity-lightbox-caption');
    const previous = activityLightbox.querySelector('.activity-lightbox-prev');
    const next = activityLightbox.querySelector('.activity-lightbox-next');
    let group = [];
    let index = 0;
    let opener = null;
    const show = nextIndex => {
      index = (nextIndex + group.length) % group.length;
      const figure = group[index].closest('figure');
      const thumbnail = group[index].querySelector('img');
      fullImage.src = thumbnail.getAttribute('src');
      fullImage.alt = thumbnail.alt;
      caption.textContent = figure.querySelector('figcaption')?.textContent || '';
      previous.hidden = next.hidden = group.length < 2;
    };
    activityImages.forEach(button => button.addEventListener('click', () => {
      opener = button;
      group = [...button.closest('.activity-entry').querySelectorAll('[data-activity-image]')];
      show(group.indexOf(button));
      activityLightbox.showModal();
      activityLightbox.querySelector('.activity-lightbox-close').focus();
    }));
    previous.addEventListener('click', () => show(index - 1));
    next.addEventListener('click', () => show(index + 1));
    activityLightbox.querySelector('.activity-lightbox-close').addEventListener('click', () => activityLightbox.close());
    activityLightbox.addEventListener('click', event => { if (event.target === activityLightbox) activityLightbox.close(); });
    activityLightbox.addEventListener('close', () => { opener?.focus(); fullImage.removeAttribute('src'); });
    activityLightbox.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' && group.length > 1) { event.preventDefault(); show(index - 1); }
      if (event.key === 'ArrowRight' && group.length > 1) { event.preventDefault(); show(index + 1); }
    });
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
      meta.textContent = [button.dataset.galleryCategory, button.dataset.galleryLocation, button.dataset.galleryDate].filter(Boolean).join(' · ');
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
