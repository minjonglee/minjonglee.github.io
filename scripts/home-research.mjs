import {escape as e, doiHref, scientificVisual, pageHero, sectionTabs} from './components.mjs';

const editorialLink=(href,text,extra='')=>`<a class="editorial-link" href="${e(href)}" ${extra}>${e(text)}</a>`;
const sectionHead=(kicker,headline,id)=>`<div class="editorial-heading"><p class="eyebrow">${e(kicker)}</p><h2 id="${e(id)}">${e(headline)}</h2></div>`;
const researchTabs=file=>sectionTabs([{label:'Overview',href:'research.html'},{label:'Projects',href:'projects.html'}],file,'Research sections');

export function home(d) {
  const page=d.pages.home;
  const heroImage=scientificVisual(d.profile.heroImage,d.profile.heroImageAlt,{label:d.profile.heroImageCaption,className:'hero-science',position:d.profile.heroImagePosition});
  const featured=page.work.features.map(item=>{
    const paper=d.publications.find(p=>p.id===item.paper);
    if(!paper) throw new Error(`Missing homepage paper: ${item.paper}`);
    return `<article class="editorial-work" id="feature-${e(item.paper)}">
      ${scientificVisual(paper.image,paper.imageAlt,{label:paper.imageCaption,position:paper.imagePosition,className:'editorial-work-image'})}
      <div class="editorial-work-copy">
        <p class="editorial-meta">${e(paper.journalName||paper.journal)} · ${e(paper.year)} <span>First author</span></p>
        <h3>${e(item.title)}</h3>
        <p class="editorial-work-description">${e(item.description)}</p>
        <p class="editorial-evidence">${e(item.evidence)}</p>
        <div class="editorial-link-row">${editorialLink(`publications.html#${paper.id}`,'Publication details')}${doiHref(paper)?editorialLink(doiHref(paper),'Paper / DOI','target="_blank" rel="noopener noreferrer"'):''}</div>
      </div>
    </article>`;
  }).join('');
  const researchRows=page.research.areas.map((area,index)=>`<li class="${index===0?'is-core':''}"><a href="research.html#${e(area.anchor)}"><span>${e(area.title)}</span></a></li>`).join('');
  const directions=page.outlook.directions.map(item=>`<article><h3>${e(item.title)}</h3><p>${e(item.description)}</p></article>`).join('');
  const journalText=e(page.work.journalStatement).replace('Advanced Materials, ACS Nano, Advanced Functional Materials','<strong>Advanced Materials, ACS Nano, Advanced Functional Materials</strong>');
  return `<section class="home-hero shell" aria-labelledby="home-title">
    <div class="home-hero-grid${heroImage?'':' home-hero-text-only'}"><div class="home-hero-copy">
      <p class="home-name">${e(d.profile.name)}</p>
      <h1 id="home-title">${e(page.hero.headline)}</h1>
      <p class="home-deck">${e(page.hero.description)}</p>
      <p class="home-affiliation"><strong>${e(d.profile.position)}</strong><br>${e(d.profile.department)}, ${e(d.profile.institution)}</p>
      <div class="editorial-link-row home-actions">${editorialLink('research.html','Explore Research')}${editorialLink('publications.html','View Publications')}${editorialLink(d.profile.cv,'Download CV','download')}${editorialLink(`mailto:${d.profile.email}`,'Email')}${editorialLink(d.scholar,'Google Scholar','target="_blank" rel="noopener noreferrer"')}</div>
    </div>${heroImage}</div>
  </section>
  <section class="editorial-section shell home-research" id="research" aria-labelledby="home-research-title">
    ${sectionHead(page.research.title,page.research.headline,'home-research-title')}
    <ul class="editorial-research-list">${researchRows}</ul>
    ${editorialLink('research.html','Research in Depth')}
  </section>
  <section class="editorial-section editorial-work-section" id="featured" aria-labelledby="home-work-title"><div class="shell">
    ${sectionHead(page.work.title,page.work.headline,'home-work-title')}
    <div class="editorial-work-grid">${featured}</div>
    <div class="editorial-breadth">
      <h3>${e(page.work.breadthTitle)}</h3>
      ${page.work.breadthParagraphs.map(text=>`<p>${e(text)}</p>`).join('')}
      <p class="journal-line">${journalText}</p>
      ${editorialLink('publications.html','Explore All Publications')}
    </div>
  </div></section>
  <section class="editorial-section shell editorial-outlook" id="outlook" aria-labelledby="home-outlook-title">
    ${sectionHead(page.outlook.title,page.outlook.headline,'home-outlook-title')}
    <p class="editorial-intro">${e(page.outlook.introduction)}</p>
    <div class="editorial-direction-grid">${directions}</div>
    ${editorialLink('research.html#directions','Explore Future Research')}
  </section>
  <section class="editorial-section editorial-contact" id="contact" aria-labelledby="home-contact-title"><div class="shell">
    <h2 id="home-contact-title">${e(page.contact.headline)}</h2>
    <p>${e(page.contact.description)}</p>
    <div class="editorial-link-row">${editorialLink(`mailto:${d.profile.email}`,'Email')}${editorialLink(d.scholar,'Google Scholar','target="_blank" rel="noopener noreferrer"')}${editorialLink(d.profile.cv,'Download CV','download')}</div>
  </div></section>`;
}

export function research(d) {
  const page=d.pages.research;
  const introImage=scientificVisual(page.hero.image,page.hero.alt,{label:page.hero.caption,className:'research-hero-visual',position:page.hero.imagePosition});
  const connected=page.areas.connected.map(item=>`<article class="editorial-connected-area" id="${e(item.anchor)}"><h3>${e(item.title)}</h3><p>${e(item.description)}</p></article>`).join('');
  const directions=page.outlook.directions.map(item=>`<article class="editorial-research-direction" id="${e(item.anchor)}"><h3>${e(item.title)}</h3><p>${e(item.description)}</p></article>`).join('');
  return `${pageHero(e(page.hero.kicker),e(page.hero.title),e(page.hero.description))}
  ${researchTabs('research.html')}
${introImage?`<div class="shell research-hero-image">${introImage}</div>`:''}
  <section class="editorial-section shell editorial-research-areas" id="expertise" aria-labelledby="research-areas-title">
    <p class="eyebrow">Research Areas</p><h2 id="research-areas-title" class="sr-only">${e(page.areas.title)}</h2>
    <article class="editorial-core-area" id="memory">
      <div><p class="area-type">Core research</p><h3>${e(page.areas.core.title)}</h3></div>
      <p>${e(page.areas.core.description)}</p>
    </article>
    <div class="editorial-connected-grid">
      ${connected}
    </div>
    <article class="editorial-platform-area" id="flexible">
      <span class="anchor-target" id="platforms"></span><span class="anchor-target" id="optoelectronics"></span><span class="anchor-target" id="foundations"></span>
      <p class="area-type">Connected device platforms</p><h3>${e(page.areas.platform.title)}</h3><p>${e(page.areas.platform.description)}</p>
    </article>
  </section>
  <section class="editorial-section editorial-research-outlook" id="directions" aria-labelledby="research-outlook-title"><div class="shell">
    ${sectionHead(page.outlook.title,page.outlook.headline,'research-outlook-title')}
    <p class="editorial-intro">${e(page.outlook.introduction)}</p>
    <p class="area-type">Future research directions</p>
    <span class="anchor-target" id="oxide-direction"></span>
    <div class="editorial-research-direction-list">${directions}</div>
  </div></section>
  <section class="editorial-section shell editorial-research-next" id="contributions" aria-labelledby="research-next-title">
    <h2 id="research-next-title">Projects &amp; Publications</h2>
    <p>Explore the research projects and published studies behind these areas.</p>
    <div class="editorial-link-row">${editorialLink('projects.html','Explore Research Projects')}${editorialLink('publications.html','View Publications')}</div>
  </section>`;
}
