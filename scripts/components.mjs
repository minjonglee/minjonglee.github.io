export const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const e = escape;
export const arrow = '<span aria-hidden="true">↗</span>';
export const textLink = (href, label, extra = '') => `<a class="text-link" href="${e(href)}" ${extra}>${label} ${arrow}</a>`;
export const tags = values => `<ul class="tags" aria-label="Topics">${values.map(x => `<li>${e(x)}</li>`).join('')}</ul>`;
export const label = text => `<p class="eyebrow">${e(text)}</p>`;
export const authors = text => e(text).replaceAll('Min Jong Lee', '<strong>Min Jong Lee</strong>');
export const paperUrl = p => p.doi ? `https://doi.org/${p.doi}` : p.externalUrl || `https://scholar.google.com/scholar?q=${encodeURIComponent(p.title)}`;
export const paperLink = p => p.status ? '' : textLink(paperUrl(p), p.doi ? 'Paper / DOI' : p.externalUrl ? 'Paper link' : 'Find on Scholar', `aria-label="${e((p.doi||p.externalUrl ? 'Read paper: ' : 'Search Google Scholar for: ') + p.title)}"`);

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
  return `<figure class="research-map" aria-label="${e(map.ariaLabel)}"><div class="map-core"><span>${e(map.coreLabel)}</span><strong>${e(map.coreTitle)}</strong></div><div class="map-platforms">${map.platforms.map(name=>`<div>${e(name).replace(' &amp; ',' &amp;<br>')}</div>`).join('')}</div><div class="map-future"><span>${e(map.futureLabel)}</span><strong>${e(map.futureTitle)}</strong></div></figure>`;
}

export function trajectory(data) {
  return `<ol class="trajectory">${data.trajectory.map((s,i)=>`<li class="${s.prospective||i===data.trajectory.length-1?'prospective':''}"><span class="eyebrow">${String(i+1).padStart(2,'0')} · ${e(s.phase)}</span><h3>${e(s.title)}</h3><p>${e(s.detail)}</p></li>`).join('')}</ol>`;
}

export function scientificVisual(image, alt, {label:caption='Research figure',className=''} = {}) {
  const priority=className==='hero-science' ? 'fetchpriority="high"' : 'loading="lazy"';
  return image
    ? `<figure class="scientific-visual ${e(className)}"><img src="${e(image)}" alt="${e(alt)}" width="1448" height="1086" ${priority} decoding="async"><figcaption>${e(caption)}</figcaption></figure>`
    : `<figure class="scientific-visual visual-placeholder ${e(className)}" aria-label="${e(caption)} awaiting a verified image"><span>${e(caption)}</span><strong>[ADD VERIFIED RESEARCH FIGURE]</strong><figcaption>Original research image pending</figcaption></figure>`;
}

export function formatPeriod(period) {
  const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
  return String(period??'').replace(/(\d{4})\.(\d{2})/g,(_,year,month)=>`${months[Number(month)-1]} ${year}`).replace('–',' – ').replace('present','Present');
}

export function paperReference(data, id) {
  const p = data.publications.find(x=>x.id===id);
  if (!p) return '';
  return `<li><a href="publications.html#${e(p.id)}">${e(p.title)}</a><span>${e(p.journal.split(' · ')[0])} · ${p.year}</span></li>`;
}

export function publication(data, p, {showYear = true} = {}) {
  const topicNames = (p.topics??[]).map(id=>data.topics.find(t=>t.id===id)?.label??id);
  const titleTag = showYear ? 'h3' : 'h4';
  return `<article class="publication-item ${showYear?'':'publication-no-year'}" id="${e(p.id)}" data-topics="${(p.topics??[]).join(' ')}">${showYear?`<div class="publication-index"><span>${p.year}</span></div>`:''}
    <div class="publication-body"><div class="badges">${p.type==='first'?'<span class="badge">First author</span>':''}${!p.status&&data.featured.some(f=>f.paper===p.id)?'<span class="badge badge-outline">Featured</span>':''}${p.status?`<span class="badge badge-outline">${e(p.status)} · not published</span>`:''}</div>
    <${titleTag}>${e(p.title)}</${titleTag}><p class="authors">${authors(p.authors)}</p><p class="journal">${p.status?`Manuscript in revision · ${p.year}`:`${e(p.journal)} <span>(${p.year})</span>`}</p>${p.summary?`<p>${e(p.summary)}</p>`:''}${tags(topicNames)}</div>
    <div class="publication-link">${paperLink(p)}</div></article>`;
}

export function featured(data) {
  return `<div class="featured-grid">${data.featured.slice(0,3).map(f=>{
    const p=data.publications.find(p=>p.id===f.paper);
    return `<article class="featured-work">${scientificVisual(p.image,p.imageAlt,{label:p.imageCaption??'Paper figure'})}<div class="featured-copy"><p class="work-source">${e((p.journal??'').split(' · ')[0])} · ${p.year}</p><h3>${e(f.title)}</h3><p class="work-contribution">${e(f.contribution)}</p><p class="work-paper">${e(p.title)}</p>${paperLink(p)}</div></article>`;
  }).join('')}</div>`;
}

export function layout(data, {file, title, description, body, canonical, extraHead='', bodyClass=''}) {
  const site=data.site, footer=site.footer;
  const seo=site.seo[file]??{};
  const url = `${site.baseUrl}${canonical ?? (file==='index.html'?'':file)}`;
  const nav=site.navigation.filter(item=>item.visible!==false).sort((a,b)=>a.order-b.order);
  const footerHref=item=>item.kind==='cv'?data.profile.cv:item.kind==='scholar'?data.scholar:item.kind==='lab'?data.profile.labUrl:item.href;
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
    <nav id="primary-nav" class="primary-nav" aria-label="Primary navigation">${nav.map(item=>{const href=item.kind==='cv'?data.profile.cv:item.href;return `<a${item.kind==='cv'?' class="nav-cv"':''} href="${e(href)}"${file===href?' aria-current="page"':''}${item.kind==='cv'?' download':''}>${e(item.label)}</a>`}).join('')}</nav>
  </div></header>
  <main id="main" tabindex="-1">${body}</main>
  <footer class="site-footer" id="contact"><div class="shell"><div class="footer-top"><div><a class="brand" href="index.html">${e(data.profile.name.toUpperCase())}</a><p>${e(footer.affiliation)}<br>${e(footer.department)}</p></div><div class="footer-contact"><a class="footer-email" href="mailto:${e(data.profile.email)}">${e(data.profile.email)}</a><div class="profile-links">${footer.links.map(item=>textLink(footerHref(item),e(item.label),item.kind==='cv'?'download':'')).join('')}</div></div></div><div class="footer-bottom"><span>© <span id="copyright-year">${new Date().getFullYear()}</span> ${e(footer.copyrightName)}</span><span>${e(footer.location)}</span><a href="#top">${e(footer.backToTop)}</a></div></div></footer>
</body>
</html>
`;
}

export function pageHero(kicker,title,description,extra='') {
  return `<section class="page-hero shell">${label(kicker)}<h1>${title}</h1><p class="page-deck">${description}</p>${extra}</section>`;
}
