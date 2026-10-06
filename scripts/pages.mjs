import {escape as e, textLink, paperLink, isPublicationVisible, isUnpublished, label, profiles, portrait, scientificVisual, imagePosition, paperReference, publication, featured, pageHero, authors, formatPeriod, sectionTabs, patentIdentifier, patentRecordDate, bySortDateDesc} from './components.mjs';

const projectStatus = p => p.status || (p.endDate?'Completed':'Ongoing');
const projectPeriod = p => {
  if(p.periodDisplay) return p.periodDisplay;
  if(p.startDate) return `${p.startDate.replace('-', '.')}${p.endDate?` – ${p.endDate.replace('-', '.')}`:projectStatus(p)==='Ongoing'?' – Present':''}`;
  return String(p.period||'').replaceAll('–',' – ').replace(/present/i,'Present');
};
const patentCountry=value=>({Korea:'KR',Republic:'KR',China:'CN',Taiwan:'TW','United States':'US'}[String(value??'').trim()]||String(value??'').trim());
const patentNumber=value=>String(value??'').replace(/^(\d{2}\/)(\d{3})(\d{3})$/,'$1$2,$3');
const projectEntry = (d,p,inlineCase=false) => {
  const study=p.caseStudyId?d.researchProjects.find(item=>item.id===p.caseStudyId):null;
  const links=[study&&!inlineCase?textLink(`#${p.caseStudyId}`,'Research detail'):'',...(p.relatedResearch??[]).map(id=>d.research.some(item=>item.id===id)?textLink(`research.html#${id}`,'Research area'):''),...(p.relatedPublications??[]).map(id=>d.publications.some(item=>item.id===id)?textLink(`publications.html#${id}`,'Related paper'):''),p.externalUrl?textLink(p.externalUrl,'Project link'):''].filter(Boolean).join('');
  const title=p.englishTitle||p.title;
  const official=p.englishTitle&&p.title&&p.englishTitle!==p.title?p.title:'';
  const meta=[p.fundingAgency||p.sponsor,projectPeriod(p)].filter(Boolean).join(' · ');
  const details=[p.personalRole?`Role: ${p.personalRole}`:'',p.program||p.category].filter(Boolean).join(' · ');
  return `<article class="project-entry" id="${e(p.id)}"><h3 ${/[가-힣]/.test(title)?'lang="ko"':''}>${e(title)}</h3>${official?`<p class="project-translation" lang="ko">${e(official)}</p>`:''}${meta?`<p class="project-agency">${e(meta)}</p>`:''}${details?`<p class="project-role">${e(details)}</p>`:''}${p.personalParticipationPeriod?`<p class="project-participation">My participation: ${e(formatPeriod(p.personalParticipationPeriod))}</p>`:''}${p.myContribution?`<div class="project-contribution"><span>My contribution</span><p>${e(p.myContribution)}</p></div>`:''}${p.summary||p.description?`<p class="project-summary">${e(p.description||p.summary)}</p>`:''}${p.image?scientificVisual(p.image,p.imageAlt,{label:p.imageCaption,position:p.imagePosition,className:'project-science'}):''}${links?`<div class="project-links">${links}</div>`:''}${study&&inlineCase?`<details class="project-case-inline" id="${e(study.id)}"><summary>Research detail · ${e(study.title)}</summary>${caseStudy(d,study,true)}</details>`:''}</article>`;
};
const caseStudy = (d,p,inline=false) => {
  const facts=[['Research question',p.question],['Hypothesis',p.hypothesis],['Approach',p.approach],['Methods',(p.methods??[]).join(' · ')],[(p.papers??[]).length?'Scientific contribution':'Current research status',p.outcome],['Role',p.role]].filter(([,value])=>value);
  return `<article class="project-detail"${inline?'':` id="${e(p.id)}"`}><div class="project-heading"><p class="project-state">${e(p.status)}</p><h3>${e(p.title)}</h3></div><div class="project-body"><dl class="project-facts">${facts.map(([heading,value])=>`<div><dt>${e(heading)}</dt><dd>${e(value)}</dd></div>`).join('')}</dl>${(p.papers??[]).length?`<h4 class="small-heading">Related publications</h4><ul class="paper-references">${p.papers.map(id=>paperReference(d,id)).join('')}</ul>`:''}${(p.patents??[]).length?`<h4 class="small-heading">Related patents</h4><ul class="paper-references">${p.patents.map(id=>{const patent=d.patents.find(item=>item.id===id);return patent?`<li><a href="patents.html#${e(patent.id)}">${e(patent.englishTitle||patent.title)}</a><span>${e(patent.status)} · ${e(patentIdentifier(patent))}</span></li>`:''}).join('')}</ul>`:''}</div></article>`;
};

const richLinks=links=>(links??[]).map(link=>textLink(link.href,link.label)).join('');
const activityUrl=value=>{
  const url=String(value??'').trim();
  return url&&url!=='#'&&!/^javascript:/i.test(url)?url:'';
};
const activityItems=(d,featuredOnly=false)=>{
  const represented=new Set(d.news.map(item=>item.relatedAwardId).filter(Boolean));
  return [
    ...d.news.filter(item=>!featuredOnly||item.featured),
    ...d.awards.filter(item=>(!featuredOnly||item.featured)&&!represented.has(item.id)).map(item=>({id:`award-${item.id}`,date:item.date||String(item.year),type:item.type||'Award',source:item.englishOrganization||item.organization||'',title:item.englishTitle||item.title,shortDescription:item.description||'',url:activityUrl(item.url),featured:item.featured}))
  ].sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))||String(a.id).localeCompare(String(b.id)));
};
const activityCategory=item=>['Award','Scholarship','Honor','Fellowship'].includes(item.type)?'awards':['Media','Press Release','Interview'].includes(item.type)?'media':'research';
const heroFrom=data=>pageHero(e(data.hero.kicker),e(data.hero.title),e(data.hero.description));
const publicationsTabs=(d,file)=>sectionTabs([{label:'Papers',href:'publications.html'},{label:'Patents',href:'patents.html'},...(d.conferences.length?[{label:'Conferences',href:'conferences.html'}]:[])],file,'Publications sections');
const researchTabs=file=>sectionTabs([{label:'Overview',href:'research.html'},{label:'Projects',href:'projects.html'}],file,'Research sections');
const outputHero=(title,description)=>`<header class="shell publications-hero"><h1>${e(title)}</h1><p>${e(description)}</p></header>`;
export function home(d) {
  const page=d.pages.home, h=page.hero;
  const core=d.research.find(item=>item.homeRole==='core'&&item.featured);
  const memory=d.research.find(item=>item.homeRole==='platform'&&item.featured);
  const foundation=d.research.find(item=>item.homeRole==='foundation'&&item.featured);
  const future=d.research.find(item=>item.homeRole==='future'&&item.featured);
  const latest=activityItems(d,true).slice(0,2);
  const heroImage=scientificVisual(d.profile.heroImage,d.profile.heroImageAlt,{label:d.profile.heroImageCaption,className:'hero-science',position:d.profile.heroImagePosition});
  const researchRows=[core,memory,future].filter(Boolean);
  const actions=h.actions.filter(action=>action.href!=='#featured'||page.featured.visible!==false&&d.featured.length);
  return `<section class="home-hero shell"><div class="home-hero-grid${heroImage?'':' home-hero-text-only'}"><div class="home-hero-copy"><p class="home-name">${e(d.profile.name.toUpperCase())}</p><h1>${e(h.line1)}<br>${e(h.line2Prefix)}<span class="accent-phrase">${e(h.accent)}</span></h1><p class="home-deck">${e(h.deck)}</p><dl class="hero-focus"><div><dt>${e(h.focusCurrentLabel)}</dt><dd>${e(h.focusCurrent)}</dd></div><div><dt>${e(h.focusFutureLabel)}</dt><dd>${e(h.focusFuture)}</dd></div></dl><p class="home-affiliation">${e(h.affiliation)}</p><div class="home-actions">${actions.map(action=>`<a class="text-link" href="${e(action.kind==='cv'?d.profile.cv:action.href)}"${action.kind==='cv'?' download':''}>${e(action.label)} <span aria-hidden="true">${e(action.arrow)}</span></a>`).join('')}</div></div>${heroImage}</div></section>
  ${page.research.visible!==false&&researchRows.length?`<section class="home-research shell" id="research" aria-labelledby="home-research-title"><div class="home-section-head"><h2 id="home-research-title">${e(page.research.title)}</h2>${textLink('research.html',e(page.research.moreLabel))}</div><div class="home-research-sequence">${researchRows.map((item,index)=>`<a class="home-research-row${item.prospective?' is-prospective':''}" href="research.html#${e(item.id)}"><span class="home-research-number">0${index+1}</span><div><h3>${e(item.homeTitle)}</h3><p>${e(item.homeDescription)}</p>${item.prospective?`<small>${e(page.research.futureLabel)}</small>`:''}</div><span class="home-research-arrow" aria-hidden="true">↗</span></a>`).join('')}</div>${foundation?`<p class="home-foundation">Research foundation: <a href="research.html#${e(foundation.id)}">${e(foundation.homeTitle)}</a> · ${e(foundation.homeDescription)}</p>`:''}</section>`:''}
  ${page.featured.visible!==false&&d.featured.length?`<section class="home-featured" id="featured" aria-labelledby="featured-title"><div class="shell"><div class="home-section-head"><h2 id="featured-title">${e(page.featured.title)}</h2>${textLink('publications.html',e(page.featured.moreLabel))}</div>${featured(d)}</div></section>`:''}
  ${page.activities.visible!==false&&latest.length?`<section class="home-activities shell" aria-labelledby="home-activities-title"><div class="home-section-head"><h2 id="home-activities-title">${e(page.activities.title)}</h2>${textLink('activities.html',e(page.activities.moreLabel))}</div><div class="home-activity-list">${latest.map(item=>`<article><p>${item.type?`<span class="activity-category">${e(item.type)}</span>`:''}${e([item.date,item.source].filter(Boolean).join(' · '))}</p><h3><a href="activities.html#${e(item.id)}">${e(item.title)}</a></h3></article>`).join('')}</div></section>`:''}`;
}

export function research(d) {
  const page=d.pages.research;
  const introImage=scientificVisual(page.hero.image,page.hero.alt,{label:page.hero.caption,className:'research-hero-visual',position:page.hero.imagePosition});
  const core=d.research.filter(area=>!area.prospective&&['core','platform'].includes(area.homeRole)&&area.id!=='flexible');
  const foundations=d.research.filter(area=>!area.prospective&&!core.includes(area));
  const future=d.research.filter(area=>area.prospective);
  const coreEntry=area=>{
    const facts=[['What I control',area.whatIControl],['What I measure',area.whatIMeasure],['Why it matters',area.whyItMatters]].filter(([,value])=>value);
    const papers=area.selectedPapers??area.papers??[];
    return `<section class="section shell research-area" id="${e(area.id)}"><div class="research-area-heading"><p class="area-type">${e(area.areaType)}</p><h3>${e(area.displayTitle)}</h3>${scientificVisual(area.image,area.alt,{label:area.caption,className:'research-science',position:area.imagePosition})}</div><div class="research-area-body"><p class="research-question-label">Research question</p><h4 class="research-question">${e(area.question)}</h4>${facts.length?`<dl class="research-facts">${facts.map(([heading,value])=>`<div><dt>${e(heading)}</dt><dd>${e(value)}</dd></div>`).join('')}</dl>`:''}${area.showPapers&&papers.length?`<h5 class="small-heading">${e(page.selectedPapersHeading)}</h5><ul class="paper-references">${papers.map(id=>paperReference(d,id)).join('')}</ul>`:''}${area.links?.length?`<div class="research-actions">${richLinks(area.links)}</div>`:''}</div></section>`;
  };
  const foundationEntry=area=>`<article class="research-foundation" id="${e(area.id)}">${scientificVisual(area.image,area.alt,{label:area.caption,className:'foundation-science',position:area.imagePosition})}<h3>${e(area.displayTitle)}</h3><p>${e(area.foundationText||area.scope||area.homeDescription||'')}</p>${area.links?.length?`<div class="research-actions">${richLinks(area.links)}</div>`:''}</article>`;
  const futureEntry=area=>`<section class="research-future shell" id="${e(area.id)}"><div><p class="area-type">Long-term direction</p><h2>${e(area.displayTitle)}</h2><p class="research-future-question">${e(area.question)}</p><dl class="research-facts"><div><dt>Existing foundation</dt><dd>${e(area.existingFoundation)}</dd></div><div><dt>Future research directions</dt><dd>${e(area.futureDirections)}</dd></div></dl>${area.links?.length?`<div class="research-actions">${richLinks(area.links)}</div>`:''}</div>${scientificVisual(area.image,area.alt,{label:area.caption,className:'future-science',position:area.imagePosition})}</section>`;
  return `${heroFrom(page)}${researchTabs('research.html')}${introImage?`<div class="shell research-hero-image">${introImage}</div>`:''}<div class="shell research-chapter-head"><p class="area-type">Core research</p><h2>From interfaces to reliable memory</h2></div>${page.map.visible!==false?`<ol class="shell research-sequence" aria-label="Research progression"><li>Interfaces · defects · ions</li><li>Transport &amp; state formation</li><li>Memory &amp; reliability</li></ol>`:''}${core.map(coreEntry).join('')}${foundations.length?`<section class="shell research-foundations"><div class="research-chapter-head"><p class="area-type">Research foundations</p><h2>Connected device platforms</h2></div><div class="research-foundation-grid">${foundations.map(foundationEntry).join('')}</div></section>`:''}${future.length?`<div class="research-future-wrap"><div class="shell research-chapter-head"><p class="area-type">Future direction</p></div>${future.map(futureEntry).join('')}</div>`:''}`;
}

export function publications(d) {
  const page=d.pages.publications;
  const published=d.publications.filter(isPublicationVisible).sort(bySortDateDesc);
  const years=[...new Set(published.map(p=>p.year))].sort((a,b)=>b-a);
  const allYears=[...new Set(published.map(p=>p.year))].sort((a,b)=>b-a);
  return `${outputHero(page.hero.title,page.hero.description)}${publicationsTabs(d,'publications.html')}
  <section class="shell publications-section" id="publications" aria-label="Publication list"><div class="publication-controls"><label class="sr-only" for="publication-search">Search publications</label><input id="publication-search" type="search" placeholder="Search title, author, journal or year" autocomplete="off"><label class="sr-only" for="publication-year-filter">Filter by year</label><select id="publication-year-filter"><option value="all">All years</option>${allYears.map(year=>`<option value="${e(year)}">${e(year)}</option>`).join('')}</select></div><p class="publication-count" id="publication-count" role="status" aria-live="polite">${published.length} publications</p><div id="publication-list">${years.map(year=>`<section class="publication-year" data-year-group><h2>${e(year)}</h2>${published.filter(p=>p.year===year).map(p=>publication(d,p)).join('')}</section>`).join('')}</div><p id="publication-empty" class="publication-empty" hidden>No publications match this search and year.</p><p class="record-note">${e(d.notes.authors)}</p></section>`;
}

export function projects(d) {
  const page=d.pages.projects;
  const inlineCase=page.caseStudiesVisible!==false&&d.researchProjects.length===1&&d.projects.some(p=>p.caseStudyId===d.researchProjects[0].id);
  const sections=[['Ongoing','startDate'],['Completed','endDate']].map(([status,dateKey])=>{
    const entries=d.projects.filter(p=>projectStatus(p)===status).sort((a,b)=>String(b[dateKey]||'').localeCompare(String(a[dateKey]||''))||Number(a.order??999)-Number(b.order??999));
    return entries.length?`<section class="section shell project-group" id="${status.toLowerCase()}"><h2>${e(status==='Ongoing'?page.ongoingTitle:page.completedTitle)}</h2><div class="project-list">${entries.map(p=>projectEntry(d,p,inlineCase)).join('')}</div></section>`:'';
  }).join('');
  return `${heroFrom(page)}${researchTabs('projects.html')}${sections}${page.caseStudiesVisible!==false&&d.researchProjects.length&&!inlineCase?`<section class="section shell project-cases"><h2>${e(page.caseStudiesTitle)}</h2><div class="project-case-list">${d.researchProjects.map(p=>caseStudy(d,p)).join('')}</div></section>`:''}<div class="shell project-endnote"><p class="record-note">${e(page.note)}</p>${textLink(page.outputsUrl,e(page.outputsLabel))}</div>`;
}

export function patents(d) {
  const page=d.pages.patents;
  const ordered=[...d.patents].sort(bySortDateDesc);
  const families=new Map();
  for(const patent of ordered){
    const key=patent.familyId||patent.id;
    if(!families.has(key)) families.set(key,{key,title:patent.familyTitle||patent.englishTitle||patent.title,filings:[]});
    families.get(key).filings.push(patent);
  }
  const entry=family=>{
    const first=family.filings[0];
    const original=first.englishTitle&&first.title!==first.englishTitle?first.title:'';
    const countries=new Set(family.filings.map(p=>patentCountry(p.country||'')));
    const additional=[...new Set(family.filings.flatMap(p=>String(p.jurisdiction||'').split(/\s*[·,]\s*/).map(patentCountry)))].filter(country=>country&&!countries.has(country));
    const search=[family.title,original,first.inventors,...family.filings.flatMap(p=>[p.title,p.englishTitle,p.status,p.country,p.jurisdiction,p.applicationNumber,p.registrationNumber])].filter(Boolean).join(' ').toLocaleLowerCase();
    const filings=family.filings.map(p=>{
      const registered=['Registered','Granted'].includes(p.status);
      const country=patentCountry(p.country||p.jurisdiction||'');
      const identifier=patentNumber(registered?p.registrationNumber||p.applicationNumber:p.applicationNumber||p.registrationNumber);
      const date=patentRecordDate(p).replaceAll('-','.');
      return `<div class="patent-filing" id="${e(p.id)}" data-patent-status="${registered?'registered':'application'}"><span class="patent-filing-country">${e(country)}</span><div><p>${e([p.status,date].filter(Boolean).join(' · '))}</p>${identifier?`<p class="patent-filing-number">${registered?'Registration':'Application'} No. ${e(identifier)}</p>`:''}</div>${p.externalUrl?textLink(p.externalUrl,'Patent record'):''}</div>`;
    }).join('');
    return `<article class="output-entry patent-family-entry" data-patent-search="${e(search)}"><h3 class="output-title">${e(family.title)}</h3>${original?`<p class="patent-original" lang="ko">${e(original)}</p>`:''}<p class="output-authors" lang="ko">${e(first.inventors)}</p><div class="patent-filings">${filings}</div>${additional.length?`<p class="patent-extra">Also listed in ${e(additional.join(' · '))}; filing details are not shown.</p>`:''}${first.assignee?`<p class="patent-extra">Assignee: ${e(first.assignee)}</p>`:''}${first.description?`<p class="output-description">${e(first.description)}</p>`:''}</article>`;
  };
  return `${outputHero('Patents',page.hero.description)}${publicationsTabs(d,'patents.html')}<section class="shell output-section"><div class="patent-controls"><label class="sr-only" for="patent-search">Search patents</label><input id="patent-search" type="search" placeholder="Search title, inventor, country or number" autocomplete="off"><div class="patent-filters" role="group" aria-label="Filter patents by status"><button type="button" data-patent-filter="all" aria-pressed="true">All</button><button type="button" data-patent-filter="registered" aria-pressed="false">Registered</button><button type="button" data-patent-filter="application" aria-pressed="false">Application</button></div></div><div class="output-list patent-list">${[...families.values()].map(entry).join('')}</div><p class="output-empty" id="patent-empty" hidden>No patents match this filter.</p><p class="record-note">${e(page.intro)}</p></section>`;
}

export function conferences(d) {
  const page=d.pages.conferences;
  const ordered=[...d.conferences].sort(bySortDateDesc);
  const entry=item=>`<article class="output-entry conference-entry" id="${e(item.id)}">${item.title?`<p class="output-source">${e(item.conferenceName)}</p><h3 class="output-title">${e(item.title)}</h3>`:`<h3 class="output-title">${e(item.conferenceName)}</h3>`}${item.authors?`<p class="output-authors">${authors(item.authors)}</p>`:''}<div class="conference-details">${item.presentationType?`<span class="output-badge">${e(item.presentationType)}</span>`:''}${item.date?`<span>${e(item.date)}</span>`:''}${item.location?`<span>${e(item.location)}</span>`:''}</div>${item.description?`<p class="output-description">${e(item.description)}</p>`:''}${item.url?textLink(item.url,'Conference record'):''}</article>`;
  return `${outputHero(page.hero.title,page.hero.description)}${publicationsTabs(d,'conferences.html')}<section class="shell output-section">${ordered.length?`<div class="output-list conference-list">${ordered.map(entry).join('')}</div>`:''}</section>`;
}

export function about(d) {
  const page=d.pages.about;
  const education=d.education.map(item=>{const [university,...location]=String(item.school||'').split(', ');const details=[item.gpa?`GPA ${item.gpa}`:'',item.honor,item.advisor?`Advisor: ${item.advisor}`:''].filter(Boolean);return `<article class="about-entry" id="${e(item.id)}"><p class="about-entry-date">${e(item.period||'')}</p><div><h3>${e(university)}</h3><p class="about-entry-role">${e(item.degree)}</p>${location.length?`<p class="about-entry-meta">${e(location.join(', '))}</p>`:''}${details.length?`<p class="about-entry-meta">${e(details.join(' · '))}</p>`:''}</div></article>`}).join('');
  const distinctExperience=d.experience.filter(item=>!(item.organization===d.profile.institution&&item.title?.toLowerCase()===d.profile.position?.toLowerCase()));
  const experience=distinctExperience.map(item=>`<article class="about-entry" id="${e(item.id)}"><p class="about-entry-date">${e(item.period||'')}</p><div><h3>${e(item.organization)}</h3><p class="about-entry-role">${e(item.title)}</p>${item.department?`<p class="about-entry-meta">${e(item.department)}</p>`:''}${item.description?`<p class="about-entry-meta">${e(item.description)}</p>`:''}</div></article>`).join('');
  const awards=[...d.awards].sort((a,b)=>Number(b.year)-Number(a.year)||Number(a.order??999)-Number(b.order??999));
  return `<section class="about-intro shell about-page" id="profile">${portrait(d)}<div class="about-intro-copy"><p class="about-field">${e(page.field)}</p><h1>${e(d.profile.name)}</h1><p class="about-position">${page.positionLines.map(e).join('<br>')}</p><div class="about-biography"><h2>${e(page.biographyTitle)}</h2><p>${e(d.profile.bio)}</p><p>${e(d.profile.vision)}</p></div>${profiles(d)}<p class="about-affiliation">${e(d.profile.lab)} · Advisor: <a href="${e(d.profile.advisorUrl)}">${e(d.profile.advisor)}</a></p></div></section>
  <section class="section shell about-page about-section" id="education"><h2>${e(page.educationTitle)}</h2><div class="about-entry-list">${education}</div></section>
${experience?`  <section class="section shell about-page about-section" id="experience"><h2>Experience</h2><div class="about-entry-list">${experience}</div></section>`:''}
  ${awards.length?`<section class="section shell about-page about-section about-recognition" id="recognition"><h2>Honors &amp; Scholarships</h2><div class="award-list">${awards.map(item=>`<article class="award-entry" id="${e(item.id)}"><div class="award-main"><h3>${e(item.englishTitle||item.title)}</h3><p class="award-meta">${e([item.englishOrganization||item.organization,item.type].filter(Boolean).join(' · '))}</p>${item.englishTitle&&item.title!==item.englishTitle?`<p class="award-original" lang="ko">${e(item.title)}</p>`:''}${item.description?`<p>${e(item.description)}</p>`:''}${item.url?textLink(item.url,'Award record'):''}</div><span class="award-item-year">${e(item.year)}</span></article>`).join('')}</div><div class="about-related"><div><p class="about-related-title">${e(page.activitiesTitle)}</p><p>${e(page.activitiesIntro)}</p></div>${textLink('activities.html',e(page.activitiesLinkLabel))}</div></section>`:''}`;
}

export function activities(d) {
  const page=d.pages.activities;
  const items=activityItems(d);
  const photos=d.gallery.filter(item=>item.image);
  const gallery=photos.length
    ? `<div class="gallery-grid">${photos.map((item,i)=>`<figure class="gallery-item"><button type="button" class="gallery-open" data-gallery-index="${i}" data-gallery-title="${e(item.title)}" data-gallery-category="${e(item.category)}" data-gallery-location="${e(item.location??'')}" data-gallery-date="${e(item.date||item.year||'')}" data-gallery-caption="${e(item.caption??'')}" aria-label="Open image: ${e(item.title)}"><img src="${e(item.image)}" alt="${e(item.alt)}" width="900" height="675" style="object-position:${imagePosition(item.imagePosition)}" loading="lazy" decoding="async"></button><figcaption><p class="gallery-category">${e(item.category)}</p><h3>${e(item.title)}</h3><p>${e([item.location,item.date||item.year].filter(Boolean).join(' · '))}</p>${item.caption?`<p>${e(item.caption)}</p>`:''}${item.url?textLink(item.url,'Related link'):''}</figcaption></figure>`).join('')}</div><dialog class="gallery-dialog" id="gallery-dialog" aria-label="Gallery image"><div class="gallery-dialog-inner"><button type="button" class="gallery-close" aria-label="Close image">Close ×</button><img alt=""><div class="gallery-dialog-copy"><p class="gallery-dialog-meta"></p><h2 class="gallery-dialog-title"></h2><p class="gallery-dialog-caption"></p><div class="gallery-dialog-controls"><button type="button" class="gallery-prev">← Previous</button><button type="button" class="gallery-next">Next →</button></div></div></div></dialog>`
    : '';
  const itemHtml=item=>{
    const category=activityCategory(item);
    const images=(item.images??[]).filter(image=>image?.image);
    const thumbnail=item.thumbnail||images[0]?.image;
    const thumbnailAlt=item.thumbnailAlt||images[0]?.alt||item.title;
    const mediaLinks=(item.mediaLinks??[]).filter(link=>link?.outlet&&/^https?:\/\//i.test(link.url||''));
    const hasDetail=Boolean(item.detailText||images.length||mediaLinks.length||item.relatedPublicationId||activityUrl(item.url));
    const image=thumbnail?`<img src="${e(thumbnail)}" alt="${e(thumbnailAlt)}" width="640" height="400" style="object-position:${imagePosition(item.thumbnailPosition)}" loading="lazy" decoding="async">`:'';
    const summary=`${image}<div class="activity-card-copy"><p class="activity-card-meta">${e(item.date)} · ${e(item.type||'Activity')}${item.source?` · ${e(item.source)}`:''}</p><h3>${e(item.title)}</h3>${item.shortDescription?`<p class="activity-card-description">${e(item.shortDescription)}</p>`:''}${mediaLinks.length?`<p class="activity-coverage-count">${mediaLinks.length} coverage links</p>`:''}${hasDetail?'<span class="activity-detail-cue">View details <span aria-hidden="true">↘</span></span>':''}</div>`;
    const detail=`${item.detailText?`<p>${e(item.detailText)}</p>`:''}${images.length?`<div class="activity-image-grid">${images.map(image=>`<figure><img src="${e(image.image)}" alt="${e(image.alt||item.title)}" loading="lazy" decoding="async">${image.caption?`<figcaption>${e(image.caption)}</figcaption>`:''}</figure>`).join('')}</div>`:''}${item.relatedPublicationId&&d.publications.some(p=>p.id===item.relatedPublicationId)?`<p>${textLink(`publications.html#${item.relatedPublicationId}`,'Related paper')}</p>`:''}${mediaLinks.length?`<div class="activity-coverage"><h4>Coverage links</h4><ul>${mediaLinks.map(link=>`<li><a href="${e(link.url)}" target="_blank" rel="noopener noreferrer">${e(link.outlet)} <span aria-hidden="true">↗</span></a></li>`).join('')}</ul></div>`:''}${activityUrl(item.url)?`<p>${textLink(item.url,'Related external link','target="_blank" rel="noopener noreferrer"')}</p>`:''}`;
    return hasDetail?`<details class="activity-entry" id="${e(item.id)}" data-activity-category="${category}"><summary class="activity-summary">${summary}</summary><div class="activity-detail">${detail}</div></details>`:`<article class="activity-entry" id="${e(item.id)}" data-activity-category="${category}"><div class="activity-summary">${summary}</div></article>`;
  };
  const archive=items.length?`<section class="section shell activities-archive" id="news"><div class="section-heading"><div><h2>${e(page.newsTitle||'Activity archive')}</h2>${page.newsIntro?`<p class="section-intro">${e(page.newsIntro)}</p>`:''}</div></div><div class="activity-filters" role="group" aria-label="Filter activities"><button type="button" data-activity-filter="all" aria-pressed="true">All</button><button type="button" data-activity-filter="awards" aria-pressed="false">Awards</button><button type="button" data-activity-filter="research" aria-pressed="false">Research highlights</button><button type="button" data-activity-filter="media" aria-pressed="false">Media</button></div><div class="activity-list">${items.map(itemHtml).join('')}</div><p class="output-empty" id="activity-empty" hidden>No activities match this filter.</p></section>`:'';
  return `${heroFrom(page)}${archive}${gallery?`<section class="section shell activities-gallery" id="gallery"><div class="section-heading"><div><h2>${e(page.galleryTitle)}</h2>${page.galleryIntro?`<p class="section-intro">${e(page.galleryIntro)}</p>`:''}</div></div>${gallery}</section>`:''}`;
}

export function cv(d) {
  const page=d.pages.cv;
  const pubs=d.publications.filter(p=>!isUnpublished(p)).sort((a,b)=>b.year-a.year);
  const education=d.education.map(item=>`<p><strong>${e(item.degree)}</strong> · ${e(item.period||'')}<br>${e(item.school)}${item.gpa?`<br>GPA: ${e(item.gpa)}`:''}${item.honor?` · ${e(item.honor)}`:''}${item.advisor?`<br>Advisor: ${e(item.advisor)}`:''}</p>`).join('');
  return `<div class="shell cv-toolbar">${textLink(d.profile.cv,e(page.downloadLabel),'download')}<button class="text-link print-button" type="button" hidden>Print CV <span aria-hidden="true">↗</span></button><span>${e(page.updatedPrefix)} ${e(d.profile.updated)}</span></div><article class="cv-document shell"><header><p class="eyebrow">Curriculum vitae</p><h1>${e(d.profile.name)}</h1><p>${e(d.profile.department)}, ${e(d.profile.institution)}<br>${e(d.profile.location)} · <a href="mailto:${e(d.profile.email)}">${e(d.profile.email)}</a><br><a href="${e(d.site.baseUrl)}">${e(new URL(d.site.baseUrl).hostname)}</a> · <a href="${e(d.scholar)}">Google Scholar</a></p></header><section><h2>${e(page.researchIdentityTitle)}</h2><p>${e(page.researchIdentity)}</p><p>${e(page.researchInterests)}</p></section><section><h2>Education</h2>${education}</section><section><h2>Publications</h2><ol class="cv-publications">${pubs.map(p=>`<li><p>${authors(p.authors)}. “${e(p.title)}.” <em>${e(p.journalName||p.journal)}</em> (${p.year}).${p.type==='first'||p.firstAuthor?' <strong>[First author]</strong>':''}${p.doi?` <a href="https://doi.org/${e(p.doi)}">doi:${e(p.doi)}</a>`:''}</p></li>`).join('')}</ol></section><section><h2>Patents</h2><ol>${d.patents.map(p=>`<li><p><span lang="ko">${e(p.inventors)}</span>. “<span ${/[가-힣]/.test(p.title)?'lang="ko"':''}>${e(p.title)}</span>.” ${e(p.status)} · ${e(p.jurisdiction)} · ${p.numberLabel?`${e(p.numberLabel)}: `:''}${e(patentIdentifier(p))} · ${e(patentRecordDate(p))}.${p.territoryNote?' '+e(p.territoryNote):''}</p></li>`).join('')}</ol></section><section><h2>Research projects</h2>${d.projects.map(p=>`<div class="cv-entry"><p><strong>${e(p.englishTitle||p.title)}</strong>${p.englishTitle&&p.title?`<br><span lang="ko">${e(p.title)}</span>`:''}<br>${e(p.sponsor||p.fundingAgency||'')}<br>Program period: ${e(projectPeriod(p))}${p.personalRole?` · Role: ${e(p.personalRole)}`:''}${p.personalParticipationPeriod?`<br>My participation: ${e(formatPeriod(p.personalParticipationPeriod))}`:''}</p></div>`).join('')}</section><section><h2>Awards &amp; academic programs</h2>${d.awards.map(a=>`<div class="cv-entry"><p><strong>${a.year} · ${e(a.englishTitle)}</strong><br><span lang="ko">${e(a.title)}</span></p></div>`).join('')}</section><p class="cv-source">${e(page.sourceNote)}</p></article>`;
}
