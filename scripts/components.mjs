export const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const e = escape;
export const arrow = '<span aria-hidden="true">↗</span>';
export const textLink = (href, label, extra = '') => `<a class="text-link" href="${e(href)}" ${extra}>${label} ${arrow}</a>`;
export const tags = values => `<ul class="tags" aria-label="Topics">${values.map(x => `<li>${e(x)}</li>`).join('')}</ul>`;
export const label = text => `<p class="eyebrow">${e(text)}</p>`;
export const heading = (kicker, title, link = '') => `<div class="section-heading"><div>${label(kicker)}<h2>${title}</h2></div>${link}</div>`;
export const authors = text => e(text).replaceAll('Min Jong Lee', '<strong>Min Jong Lee</strong>');
export const paperUrl = p => p.doi ? `https://doi.org/${p.doi}` : `https://scholar.google.com/scholar?q=${encodeURIComponent(p.title)}`;
export const paperLink = p => p.status ? '' : textLink(paperUrl(p), p.doi ? 'Paper / DOI' : 'Find on Scholar', `aria-label="${e((p.doi ? 'Read paper: ' : 'Search Google Scholar for: ') + p.title)}"`);

export function profiles(data, {cv = true} = {}) {
  const p = data.profile;
  return `<div class="profile-links">${textLink(`mailto:${p.email}`, 'Email')}${textLink(data.scholar, 'Google Scholar')}${p.orcid ? textLink(p.orcid, 'ORCID') : ''}${p.linkedin ? textLink(p.linkedin, 'LinkedIn') : ''}${cv ? textLink(p.cv, 'CV (PDF)', 'download') : ''}</div>`;
}

export function portrait(data, compact = false) {
  const p = data.profile;
  return p.portrait
    ? `<figure class="portrait ${compact ? 'portrait-small' : ''}"><img src="${e(p.portrait)}" alt="${e(p.portraitAlt)}" width="354" height="472" ${compact ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async"></figure>`
    : `<figure class="portrait placeholder ${compact ? 'portrait-small' : ''}"><span class="placeholder-index" aria-hidden="true">MJL /</span><div><span class="placeholder-title">Portrait forthcoming</span><span class="placeholder-caption">Min Jong Lee · Korea University</span></div><figcaption class="sr-only">Placeholder for a professional portrait of Min Jong Lee.</figcaption></figure>`;
}

export function framework() {
  const steps = ['Molecules','Interfaces','Defects & ions','Devices','Circuits','Systems'];
  return `<div class="framework"><div class="framework-labels"><span>Physics across scales</span><span>Structure → Dynamics → Function</span></div><ol class="scale-steps">${steps.map((s,i)=>`<li class="${i>3?'prospective':''}"><span class="scale-number">0${i+1}</span><span class="scale-name">${e(s)}</span><span class="scale-caption">${['Molecular interactions','Energetic alignment','Transport & state dynamics','Memory & reliability','Emerging direction','Long-term direction'][i]}</span></li>`).join('')}</ol><p class="framework-note">Solid rules: established and current research. Dashed rules: directions toward circuits and systems.</p></div>`;
}

export function trajectory(data) {
  return `<ol class="trajectory">${data.trajectory.map((s,i)=>`<li class="${i===4?'prospective':''}"><span class="eyebrow">${e(s.phase)}</span><h3>${e(s.title)}</h3><p>${e(s.detail)}</p></li>`).join('')}</ol>`;
}

export function paperReference(data, id) {
  const p = data.publications.find(x=>x.id===id);
  if (!p) throw new Error(`Unknown paper ${id}`);
  return `<li><a href="publications.html#${e(p.id)}">${e(p.title)}</a><span>${e(p.journal.split(' · ')[0])} · ${p.year}</span></li>`;
}

export function publication(data, p) {
  const topicNames = p.topics.map(id=>data.topics.find(t=>t.id===id).label);
  return `<article class="publication-item ${p.featured?'is-featured':''}" id="${e(p.id)}" data-topics="${p.topics.join(' ')}">
    <div class="publication-index"><span>${p.year}</span></div>
    <div class="publication-body"><div class="badges">${p.type==='first'?'<span class="badge">First author</span>':''}${p.status?`<span class="badge badge-outline">${e(p.status)} · not published</span>`:''}</div>
    <h3>${e(p.title)}</h3><p class="authors">${authors(p.authors)}</p><p class="journal">${e(p.journal)} <span>(${p.year})</span></p>${tags(topicNames)}</div>
    <div class="publication-link">${paperLink(p)}</div></article>`;
}

export function featured(data) {
  return `<div class="featured-grid">${data.featured.slice(0,3).map(f=>{
    const p=data.publications.find(p=>p.id===f.paper);
    return `<article class="featured-work"><figure class="research-figure"><img src="${e(p.image)}" alt="${e(p.imageAlt)}" width="960" height="600" loading="lazy" decoding="async"><figcaption>Conceptual illustration</figcaption></figure><div class="featured-copy"><p class="work-topic">${e(f.title)}</p><h3>${e(p.title)}</h3><p class="work-source">${e(p.journal.split(' · ')[0])} · ${p.year}</p><p class="work-contribution">${e(f.contribution)}</p>${paperLink(p)}</div></article>`;
  }).join('')}</div>`;
}

export function layout(data, {file, title, description, body, canonical, extraHead='', bodyClass=''}) {
  const url = `https://minjonglee.github.io/${canonical ?? (file==='index.html'?'':file)}`;
  const nav = [['research.html','Research'],['publications.html','Publications'],['patents.html','Patents'],['about.html','About']];
  const person = {'@context':'https://schema.org','@type':'Person',name:data.profile.name,url:'https://minjonglee.github.io/',email:`mailto:${data.profile.email}`,affiliation:{'@type':'CollegeOrUniversity',name:'Korea University'},sameAs:[data.scholar,data.profile.orcid,data.profile.linkedin].filter(Boolean)};
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(title)} — Min Jong Lee</title>
  <meta name="description" content="${e(description)}">
  <meta name="theme-color" content="#faf9f6">
  <link rel="canonical" href="${e(url)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Min Jong Lee · Research Portfolio">
  <meta property="og:title" content="${e(title)} — Min Jong Lee">
  <meta property="og:description" content="${e(description)}">
  <meta property="og:url" content="${e(url)}">
  <meta property="og:image" content="https://minjonglee.github.io/assets/social-preview.png">
  <meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Min Jong Lee — Interface &amp; Defect Engineering for Memory and Computing">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="stylesheet" href="styles.css">
  <script src="script.js" defer></script>
  <script type="application/ld+json">${JSON.stringify(person).replaceAll('<','\\u003c')}</script>
${extraHead}
</head>
<body class="${e(bodyClass)}" id="top">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"><div class="header-inner shell">
    <a class="brand" href="index.html" aria-label="Min Jong Lee, home">MIN JONG LEE<span class="brand-dot" aria-hidden="true">.</span></a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Open navigation" hidden><span>Menu</span><span class="menu-symbol" aria-hidden="true">+</span></button>
    <nav id="primary-nav" class="primary-nav" aria-label="Primary navigation">${nav.map(([href,name])=>`<a href="${href}"${file===href?' aria-current="page"':''}>${name}</a>`).join('')}<a class="nav-cv" href="${e(data.profile.cv)}" download aria-label="Download Min Jong Lee's CV as PDF">CV <span aria-hidden="true">↓</span></a></nav>
  </div></header>
  <main id="main" tabindex="-1">${body}</main>
  <footer class="site-footer" id="contact"><div class="shell"><div class="footer-top"><div><a class="brand" href="index.html">MIN JONG LEE<span class="brand-dot" aria-hidden="true">.</span></a><p>Korea University · Electrical Engineering</p></div><div><a class="footer-email" href="mailto:${e(data.profile.email)}">${e(data.profile.email)}</a><div class="profile-links">${textLink(data.scholar,'Google Scholar')}</div></div></div><div class="footer-bottom"><span>© <span id="copyright-year">2026</span> Min Jong Lee</span><span>Korea University · Seoul</span><a href="#top">Back to top ↑</a></div></div></footer>
</body>
</html>
`;
}

export function pageHero(kicker,title,description,extra='') {
  return `<section class="page-hero shell">${label(kicker)}<h1>${title}</h1><p class="page-deck">${description}</p>${extra}</section>`;
}

export function environment(data) {
  return `<div class="environment">${label('Current research environment')}<h3>${e(data.profile.lab)}</h3><p>Korea University<br>Advisor: <a href="${e(data.profile.advisorUrl)}">${e(data.profile.advisor)}</a></p>${textLink(data.profile.labUrl,'Visit AEEL')}</div>`;
}
