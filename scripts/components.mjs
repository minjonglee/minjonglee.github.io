export const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const e = escape;
export const arrow = '<span aria-hidden="true">↗</span>';
export const textLink = (href, label, extra = '') => `<a class="text-link" href="${e(href)}" ${extra}>${label} ${arrow}</a>`;
export const tags = values => `<ul class="tags" aria-label="Topics">${values.map(x => `<li>${e(x)}</li>`).join('')}</ul>`;
export const label = text => `<p class="eyebrow">${e(text)}</p>`;
export const authors = text => e(text).replaceAll('Min Jong Lee', '<strong>Min Jong Lee</strong>');
export const patentIdentifier = p => p.registrationNumber || p.applicationNumber || p.number || '';
export const patentRecordDate = p => p.registrationDate || p.applicationDate || p.date || '';
export const sectionTabs = (items,file,label) => `<nav class="section-tabs shell" aria-label="${e(label)}">${items.map(item=>`<a href="${e(item.href)}"${item.href===file?' aria-current="page"':''}>${e(item.label)}</a>`).join('')}</nav>`;
export const doiHref = p => p.doiUrl || (p.doi ? `https://doi.org/${String(p.doi).replace(/^https?:\/\/(?:dx\.)?doi\.org\//i,'')}` : '');
const publicStatuses=new Set(['Accepted','In Press','ASAP','Early View','Online Published','Published']);
export const isPublicationVisible = p => publicStatuses.has(p.publicationStatus || p.status || 'Published');
export const isUnpublished = p => !isPublicationVisible(p);
export const journalName = p => p.journalName || String(p.journal || '').split(' · ')[0];
export const paperUrl = p => doiHref(p) || p.publisherUrl || p.externalUrl || `https://scholar.google.com/scholar?q=${encodeURIComponent(p.title)}`;
export const paperLink = p => isUnpublished(p) ? '' : textLink(paperUrl(p), doiHref(p) ? 'Paper / DOI' : p.publisherUrl || p.externalUrl ? 'Paper link' : 'Find on Scholar', `aria-label="${e((doiHref(p)||p.externalUrl ? 'Read paper: ' : 'Search Google Scholar for: ') + p.title)}"`);

export function profiles(data, {cv = true} = {}) {
  const p = data.profile;
  return `<div class="profile-links">${textLink(`mailto:${p.email}`, 'Email')}${textLink(data.scholar, 'Google Scholar')}${p.orcid ? textLink(p.orcid, 'ORCID') : ''}${p.linkedin ? textLink(p.linkedin, 'LinkedIn') : ''}${p.github?textLink(p.github,'GitHub'):''}${p.researchGate?textLink(p.researchGate,'ResearchGate'):''}${(p.externalLinks??[]).map(link=>textLink(link.href,e(link.label))).join('')}${cv ? textLink(p.cv, 'CV (PDF)', 'download') : ''}</div>`;
}

export function portrait(data, compact = false) {
  const p = data.profile;
  return p.portrait
    ? `<figure class="portrait ${compact ? 'portrait-small' : ''}"><img src="${e(p.portrait)}" alt="${e(p.portraitAlt)}" width="354" height="472" ${compact ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async"></figure>`
    : '';
}

export function researchDiagram(map) {
  return `<figure class="research-map" aria-label="${e(map.ariaLabel)}"><div class="map-core"><span>${e(map.coreLabel)}</span><strong>${e(map.coreTitle)}</strong></div><div class="map-platforms">${map.platforms.map(name=>`<div>${e(name)}</div>`).join('')}${map.foundation?`<p>${e(map.foundation)}</p>`:''}</div><div class="map-future"><span>${e(map.futureLabel)}</span><strong>${e(map.futureTitle)}</strong></div></figure>`;
}

export const imagePosition = value => ['center','top','bottom','left','right'].includes(value) ? value : 'center';
export function scientificVisual(image, alt, {label:caption='',className='',position='center'} = {}) {
  if (!image) return '';
  const priority=className==='hero-science' ? 'fetchpriority="high"' : 'loading="lazy"';
  return `<figure class="scientific-visual ${e(className)}"><img src="${e(image)}" alt="${e(alt)}" width="1448" height="1086" style="object-position:${imagePosition(position)}" ${priority} decoding="async">${caption?`<figcaption>${e(caption)}</figcaption>`:''}</figure>`;
}

export function formatPeriod(period) {
  const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  return String(period??'').replace(/(\d{4})\.(\d{2})/g,(_,year,month)=>`${months[Number(month)-1]} ${year}`).replace('–',' – ').replace('present','Present');
}

export function paperReference(data, id) {
  const p = data.publications.find(x=>x.id===id);
  if (!p) return '';
  return `<li><a href="publications.html#${e(p.id)}">${e(p.title)}</a><span>${e(journalName(p))} · ${p.year}${p.publicationStatus&&p.publicationStatus!=='Published'?` · ${e(p.publicationStatus)}`:''}</span></li>`;
}

export function publication(data, p) {
  const status=p.publicationStatus || p.status || 'Published';
  const parts=[];
  if(p.volume) parts.push(`Vol. ${p.volume}`);
  if(p.issue) parts.push(`Issue ${p.issue}`);
  const pageRange=p.startPage&&p.endPage?`${p.startPage}–${p.endPage}`:p.pages;
  if(pageRange) parts.push(`pp. ${pageRange}`);
  if(p.articleNumber) parts.push(`Article ${p.articleNumber}`);
  if(p.eLocationId) parts.push(`eLocation ${p.eLocationId}`);
  const bibliography=parts.join(' · ');
  const source=journalName(p) || 'Publication';
  const statusText=status==='Published'?'':` (${status})`;
  const meta=[`${p.year}${statusText}`,bibliography].filter(Boolean).join(' · ');
  const search=[p.title,p.authors,p.journal,p.journalName,p.year,status,p.doi,p.doiUrl,p.volume,p.issue,p.pages,p.startPage,p.endPage,p.articleNumber,p.eLocationId,p.researchCategory,...(p.keywords??[])].filter(Boolean).join(' ').toLocaleLowerCase();
  return `<article class="publication-item" id="${e(p.id)}" data-year="${e(p.year)}" data-search="${e(search)}"><div class="publication-topline"><p class="publication-meta"><span class="publication-source">${e(source)}</span><span class="publication-meta-separator" aria-hidden="true">|</span><span>${e(meta)}</span>${p.firstAuthor||p.coFirstAuthor||p.type==='first'?'<span class="publication-author-role">First author</span>':''}</p>${doiHref(p)?`<a class="publication-doi" href="${e(doiHref(p))}" target="_blank" rel="noopener noreferrer" aria-label="DOI for ${e(p.title)} (opens in a new tab)">DOI <span aria-hidden="true">↗</span></a>`:''}</div><h3>${e(p.title)}</h3><p class="authors">${authors(p.authors)}</p>${p.authorNotes?`<p class="publication-author-note">${e(p.authorNotes)}</p>`:''}</article>`;
}

export function featured(data) {
  return `<div class="featured-grid">${data.featured.slice(0,3).map(f=>{
    const p=data.publications.find(p=>p.id===f.paper);
    const paperAction=doiHref(p)||p.publisherUrl||p.externalUrl?paperLink(p):`<span class="work-status">${e(p.publicationStatus==='Accepted'?'Accepted · DOI pending':p.publicationStatus||'Publication link pending')}</span>`;
    return `<article class="featured-work">${scientificVisual(p.image,p.imageAlt,{label:p.imageCaption??'',position:p.imagePosition})}<div class="featured-copy"><p class="work-source">${e(journalName(p))} · ${p.year}</p><h3>${e(p.title)}</h3>${f.contribution?`<p class="work-contribution">${e(f.contribution)}</p>`:''}${paperAction}</div></article>`;
  }).join('')}</div>`;
}

export function layout(data, {file, title, description, body, canonical, extraHead='', bodyClass=''}) {
  const site=data.site, footer=site.footer;
  const seo=site.seo[file]??{};
  const url = `${site.baseUrl}${canonical ?? (file==='index.html'?'':file)}`;
  const nav=site.navigation.filter(item=>item.visible!==false).sort((a,b)=>a.order-b.order);
  const activeFile=file==='projects.html'?'research.html':['patents.html','conferences.html'].includes(file)?'publications.html':file;
  const footerHref=item=>item.kind==='cv'?'cv.html':item.kind==='scholar'?data.scholar:item.kind==='lab'?data.profile.labUrl:item.href;
  const person = {'@context':'https://schema.org','@type':'Person',name:data.profile.name,url:site.baseUrl,email:`mailto:${data.profile.email}`,affiliation:{'@type':'CollegeOrUniversity',name:data.profile.institution},sameAs:[data.scholar,data.profile.orcid,data.profile.linkedin].filter(Boolean)};
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(title)} — ${e(data.profile.name)}</title>
  <meta name="description" content="${e(description)}">
  <meta name="theme-color" content="${e(site.themeColor)}">
  <link rel="canonical" href="${e(url)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${e(site.siteTitle)}">
  <meta property="og:title" content="${e(seo.ogTitle||`${title} — ${data.profile.name}`)}">
  <meta property="og:description" content="${e(seo.ogDescription||description)}">
  <meta property="og:url" content="${e(url)}">
  <meta property="og:image" content="${e(new URL(seo.ogImage||site.socialPreview,site.baseUrl).href)}">
  <meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${e(site.socialPreviewAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/svg+xml" href="${e(site.favicon)}">
  <link rel="stylesheet" href="styles.css">
  <script src="script.js" defer></script>
  <script type="application/ld+json">${JSON.stringify(person).replaceAll('<','\\u003c')}</script>
${extraHead}
</head>
<body class="${e(bodyClass)}" id="top">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"><div class="header-inner shell">
    <a class="brand" href="index.html" aria-label="${e(data.profile.name)}, home">${e(data.profile.name.toUpperCase())}<span class="brand-dot" aria-hidden="true">.</span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Open navigation" hidden><span>Menu</span><span class="menu-symbol" aria-hidden="true">+</span></button>
    <nav id="primary-nav" class="primary-nav" aria-label="Primary navigation">${nav.map(item=>{const href=item.kind==='cv'?'cv.html':item.href;return `<a${item.kind==='cv'?' class="nav-cv"':''} href="${e(href)}"${activeFile===href?' aria-current="page"':''}>${e(item.label)}</a>`}).join('')}</nav>
  </div></header>
  <main id="main" tabindex="-1">${body}</main>
  <footer class="site-footer" id="contact"><div class="shell"><div class="footer-top"><div><a class="brand" href="index.html">${e(data.profile.name.toUpperCase())}</a><p>${e(footer.affiliation)}<br>${e(footer.department)}</p></div><div class="footer-contact"><a class="footer-email" href="mailto:${e(data.profile.email)}">${e(data.profile.email)}</a><div class="profile-links">${footer.links.map(item=>textLink(footerHref(item),e(item.label))).join('')}${data.profile.orcid&&!footer.links.some(item=>item.label==='ORCID')?textLink(data.profile.orcid,'ORCID'):''}</div></div></div><div class="footer-bottom"><span>© <span id="copyright-year">${new Date().getFullYear()}</span> ${e(footer.copyrightName)}</span><span>${e(footer.location)}</span><a href="#top">${e(footer.backToTop)}</a></div></div></footer>
</body>
</html>
`;
}

export function pageHero(kicker,title,description,extra='') {
  return `<section class="page-hero shell">${label(kicker)}<h1>${title}</h1><p class="page-deck">${description}</p>${extra}</section>`;
}
