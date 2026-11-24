import {escape as e, doiHref, authorRoleLabel, scientificVisual, pageHero, sectionTabs} from './components.mjs';

const editorialLink=(href,text,extra='')=>`<a class="editorial-link" href="${e(href)}" ${extra}>${e(text)}</a>`;
const sectionHead=(kicker,headline,id)=>`<div class="editorial-heading"><p class="eyebrow">${e(kicker)}</p><h2 id="${e(id)}">${e(headline)}</h2></div>`;
const researchTabs=file=>sectionTabs([{label:'Overview',href:'research.html'},{label:'Projects',href:'projects.html'}],file,'Research sections');
const areaImage=item=>`<figure class="editorial-area-image"><img src="${e(item.image)}" alt="${e(item.alt)}" width="1536" height="960" loading="lazy" decoding="async"></figure>`;
const areaCard=(item,tier,anchor,aliases=[])=>`<article class="editorial-area-card" id="${e(anchor)}">${aliases.map(id=>`<span class="anchor-target" id="${e(id)}"></span>`).join('')}${areaImage(item)}<div class="editorial-area-copy"><p class="area-type">${tier==='core'?'Core research':'Connected platform'}</p><h4>${e(item.title)}</h4><p>${e(item.description)}</p></div></article>`;

export function home(d) {
  const page=d.pages.home;
  const heroImage=scientificVisual(d.profile.heroImage,d.profile.heroImageAlt,{label:d.profile.heroImageCaption,className:'hero-science',position:d.profile.heroImagePosition});
  const featured=page.work.features.map(item=>{
    const paper=d.publications.find(p=>p.id===item.paper);
    if(!paper) throw new Error(`Missing homepage paper: ${item.paper}`);
    return `<article class="editorial-work" id="feature-${e(item.paper)}">
      ${scientificVisual(paper.image,paper.imageAlt,{label:paper.imageCaption,position:paper.imagePosition,className:'editorial-work-image'})}
      <div class="editorial-work-copy">
        <p class="editorial-meta">${e(paper.journalName||paper.journal)} · ${e(paper.year)} <span>${e(authorRoleLabel(paper))}</span></p>
        <h3>${e(item.title)}</h3>
        <p class="editorial-work-description">${e(item.description)}</p>
        <p class="editorial-evidence">${e(item.evidence)}</p>
        <div class="editorial-link-row">${editorialLink(`publications.html#${paper.id}`,'Publication details')}${doiHref(paper)?editorialLink(doiHref(paper),'Paper / DOI','target="_blank" rel="noopener noreferrer"'):''}</div>
      </div>
    </article>`;
  }).join('');
  const researchGroups=[['core','Core research'],['connected','Connected research platforms']].map(([tier,title])=>{
    const rows=page.research.areas.filter(area=>area.tier===tier).map(area=>`<li class="${tier==='core'?'is-core':''}"><a href="research.html#${e(area.anchor)}"><span>${e(area.title)}</span></a></li>`).join('');
    return rows?`<div class="editorial-research-group"><p class="area-type">${title}</p><ul class="editorial-research-list">${rows}</ul></div>`:'';
  }).join('');
  const directions=page.outlook.directions.map(item=>`<article><h3>${e(item.title)}</h3><p>${e(item.description)}</p></article>`).join('');
  return `<section class="home-hero shell" aria-labelledby="home-title">
    <div class="home-hero-grid${heroImage?'':' home-hero-text-only'}"><div class="home-hero-copy">
      <p class="home-name">${e(d.profile.name)}</p>
      <h1 id="home-title">${e(page.hero.headline)}</h1>
      <p class="home-deck">${e(page.hero.description)}</p>
      <p class="home-affiliation"><strong>${e(d.profile.position)}</strong><br>${e(d.profile.department)}, ${e(d.profile.institution)}</p>
      <div class="home-actions"><div class="home-actions-primary">${editorialLink('research.html','Explore Research')}${editorialLink('publications.html','View Publications')}</div><div class="home-actions-secondary"><a href="${e(d.profile.cv)}" download aria-label="Download CV">CV</a><span aria-hidden="true">·</span><a href="${e(d.scholar)}" target="_blank" rel="noopener noreferrer">Google Scholar</a><span aria-hidden="true">·</span><a href="mailto:${e(d.profile.email)}">Email</a></div></div>
    </div>${heroImage}</div>
  </section>
  <section class="editorial-section shell home-research" id="research" aria-labelledby="home-research-title">
    ${sectionHead(page.research.title,page.research.headline,'home-research-title')}
    <div class="editorial-research-groups">${researchGroups}</div>
    ${editorialLink('research.html','Research in Depth')}
  </section>
  <section class="editorial-section editorial-work-section" id="featured" aria-labelledby="home-work-title"><div class="shell">
    ${sectionHead(page.work.title,page.work.headline,'home-work-title')}
    <div class="editorial-work-grid">${featured}</div>
    <div class="editorial-work-footer">${editorialLink('publications.html','Explore All Publications')}</div>
  </div></section>
  <section class="editorial-section shell editorial-outlook" id="outlook" aria-labelledby="home-outlook-title">
    ${sectionHead(page.outlook.title,page.outlook.headline,'home-outlook-title')}
    <p class="editorial-intro">${e(page.outlook.introduction)}</p>
    <div class="editorial-direction-grid">${directions}</div>
    ${editorialLink('research.html#directions','Explore Future Research')}
  </section>`;
}

export function research(d) {
  const page=d.pages.research;
  const introImage=scientificVisual(page.hero.image,page.hero.alt,{label:page.hero.caption,className:'research-hero-visual',position:page.hero.imagePosition});
  const core=[areaCard(page.areas.core,'core','memory'),...page.areas.connected.filter(item=>item.tier==='core').map(item=>areaCard(item,'core',item.anchor,item.anchor==='neuromorphic'?['chiral-memory']:[]))].join('');
  const connected=[...page.areas.connected.filter(item=>item.tier!=='core').map(item=>areaCard(item,'connected',item.anchor)),areaCard(page.areas.platform,'connected','flexible',['platforms','optoelectronics','foundations'])].join('');
  const contributions=(page.selectedContributions??[]).map(id=>{
    const item=d.researchProjects.find(project=>project.id===id);
    if(!item) throw new Error(`Missing selected research contribution: ${id}`);
    const paper=d.publications.find(entry=>entry.id===item.papers?.[0]);
    if(!paper) throw new Error(`Missing primary publication for ${id}`);
    return `<article class="editorial-contribution" id="contribution-${e(item.id)}"><div class="editorial-contribution-head"><p class="editorial-contribution-meta"><a href="publications.html#${e(paper.id)}">${e(paper.journalName||paper.journal)} · ${e(paper.year)}${paper.publicationStatus==='Accepted'?' (Accepted)':''}</a></p><h3>${e(item.title)}</h3></div><div class="editorial-contribution-body"><p>${e(item.teaser||item.outcome||item.question)}</p>${item.highlights?`<p class="editorial-contribution-highlights">${e(item.highlights)}</p>`:''}${editorialLink(`projects.html#${e(item.id)}`,'Project details')}</div></article>`;
  }).join('');
  const directions=page.outlook.directions.map(item=>`<article class="editorial-research-direction" id="${e(item.anchor)}"><h3>${e(item.title)}</h3><p>${e(item.description)}</p></article>`).join('');
  return `${pageHero(e(page.hero.kicker),e(page.hero.title),e(page.hero.description))}
  ${researchTabs('research.html')}
${introImage?`<div class="shell research-hero-image">${introImage}</div>`:''}
  <section class="editorial-section shell editorial-research-areas" id="expertise" aria-labelledby="research-areas-title">
    <p class="eyebrow">Research Areas</p><h2 id="research-areas-title" class="sr-only">${e(page.areas.title)}</h2>
    <div class="editorial-area-group"><h3>Core research</h3><div class="editorial-area-grid">${core}</div></div>
    <div class="editorial-area-group"><h3>Connected research platforms</h3><div class="editorial-area-grid">${connected}</div></div>
  </section>
  <section class="editorial-section shell editorial-contributions" id="selected-contributions" aria-labelledby="selected-contributions-title">
    ${sectionHead('Selected Research Contributions','Mechanisms tested in devices and arrays.','selected-contributions-title')}
    <div class="editorial-contribution-list">${contributions}</div>
  </section>
  <section class="editorial-section editorial-research-outlook" id="directions" aria-labelledby="research-outlook-title"><div class="shell">
    ${sectionHead(page.outlook.title,page.outlook.headline,'research-outlook-title')}
    <p class="editorial-intro">${e(page.outlook.introduction)}</p>
    <p class="area-type">Future research directions</p>
    <span class="anchor-target" id="oxide-direction"></span>
    <div class="editorial-research-direction-list">${directions}</div>
    <div class="editorial-research-next" id="contributions"><div class="editorial-link-row">${editorialLink('projects.html','Explore Research Projects')}${editorialLink('publications.html','View Publications')}</div></div>
  </div></section>`;
}
