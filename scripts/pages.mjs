import {escape as e, textLink, paperLink, isPublicationVisible, isUnpublished, label, profiles, portrait, scientificVisual, imagePosition, researchDiagram, paperReference, publication, featured, pageHero, authors, formatPeriod, sectionTabs, patentIdentifier, patentRecordDate, bySortDateDesc} from './components.mjs';

const projectStatus = p => p.status || (p.endDate?'Completed':'Ongoing');
const projectPeriod = p => {
  if(p.periodDisplay) return p.periodDisplay;
  if(p.startDate) return `${p.startDate.replace('-', '.')}${p.endDate?` – ${p.endDate.replace('-', '.')}`:projectStatus(p)==='Ongoing'?' – Present':''}`;
  return String(p.period||'').replaceAll('–',' – ').replace(/present/i,'Present');
};
const patentCountry=value=>({Korea:'KR',Republic:'KR',China:'CN',Taiwan:'TW','United States':'US'}[String(value??'').trim()]||String(value??'').trim());
const patentNumber=value=>String(value??'').replace(/^(\d{2}\/)(\d{3})(\d{3})$/,'$1$2,$3');
const projectEntry = (d,p) => {
  const links=[p.caseStudyId&&d.researchProjects.some(item=>item.id===p.caseStudyId)?textLink(`#${p.caseStudyId}`,'Research detail'):'',...(p.relatedResearch??[]).map(id=>d.research.some(item=>item.id===id)?textLink(`research.html#${id}`,'Research area'):''),...(p.relatedPublications??[]).map(id=>d.publications.some(item=>item.id===id)?textLink(`publications.html#${id}`,'Related paper'):''),p.externalUrl?textLink(p.externalUrl,'Project link'):''].filter(Boolean).join('');
  const title=p.englishTitle||p.title;
  const official=p.englishTitle&&p.title&&p.englishTitle!==p.title?p.title:'';
  const meta=[p.fundingAgency||p.sponsor,projectPeriod(p)].filter(Boolean).join(' · ');
  const details=[p.personalRole?`Role: ${p.personalRole}`:'',p.program||p.category].filter(Boolean).join(' · ');
  return `<article class="project-entry" id="${e(p.id)}"><h3 ${/[가-힣]/.test(title)?'lang="ko"':''}>${e(title)}</h3>${official?`<p class="project-translation" lang="ko">${e(official)}</p>`:''}${meta?`<p class="project-agency">${e(meta)}</p>`:''}${details?`<p class="project-role">${e(details)}</p>`:''}${p.personalParticipationPeriod?`<p class="project-participation">My participation: ${e(formatPeriod(p.personalParticipationPeriod))}</p>`:''}${p.summary||p.description?`<p class="project-summary">${e(p.description||p.summary)}</p>`:''}${p.image?scientificVisual(p.image,p.imageAlt,{label:p.imageCaption,position:p.imagePosition,className:'project-science'}):''}${links?`<div class="project-links">${links}</div>`:''}</article>`;
};
const caseStudy = (d,p) => {
  const facts=[['Research question',p.question],['Hypothesis',p.hypothesis],['Approach',p.approach],['Methods',(p.methods??[]).join(' · ')],[(p.papers??[]).length?'Scientific contribution':'Current research status',p.outcome],['Role',p.role]].filter(([,value])=>value);
  return `<article class="project-detail" id="${e(p.id)}"><div class="project-heading"><p class="project-state">${e(p.status)}</p><h3>${e(p.title)}</h3></div><div class="project-body"><dl class="project-facts">${facts.map(([heading,value])=>`<div><dt>${e(heading)}</dt><dd>${e(value)}</dd></div>`).join('')}</dl>${(p.papers??[]).length?`<h4 class="small-heading">Related publications</h4><ul class="paper-references">${p.papers.map(id=>paperReference(d,id)).join('')}</ul>`:''}${(p.patents??[]).length?`<h4 class="small-heading">Related patents</h4><ul class="paper-references">${p.patents.map(id=>{const patent=d.patents.find(item=>item.id===id);return patent?`<li><a href="patents.html#${e(patent.id)}">${e(patent.englishTitle||patent.title)}</a><span>${e(patent.status)} · ${e(patentIdentifier(patent))}</span></li>`:''}).join('')}</ul>`:''}</div></article>`;
};

const richLinks=links=>(links??[]).map(link=>textLink(link.href,link.label)).join('');
const activityUrl=value=>{
  const url=String(value??'').trim();
  return url&&url!=='#'&&!/^javascript:/i.test(url)?url:'';
};
const activityItems=(d,featuredOnly=false)=>[
  ...d.news.filter(item=>!featuredOnly||item.featured).map(item=>({...item,url:activityUrl(item.url)})),
  ...d.awards.filter(item=>item.featured).map(item=>({id:`news-${item.id}`,date:String(item.year),type:item.type||'Award',source:item.englishOrganization||item.organization||'',title:item.englishTitle||item.title,shortDescription:'',url:activityUrl(item.url),featured:true}))
].sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))||Number(a.order??999)-Number(b.order??999));
const activityTitle=item=>item.url?`<a href="${e(item.url)}">${e(item.title)}</a>`:e(item.title);
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
  ${page.activities.visible!==false&&latest.length?`<section class="home-activities shell" aria-labelledby="home-activities-title"><div class="home-section-head"><h2 id="home-activities-title">${e(page.activities.title)}</h2>${textLink('activities.html',e(page.activities.moreLabel))}</div><div class="home-activity-list">${latest.map(item=>`<article><p>${item.type?`<span class="activity-category">${e(item.type)}</span>`:''}${e([item.date,item.source].filter(Boolean).join(' · '))}</p><h3>${activityTitle(item)}</h3></article>`).join('')}</div></section>`:''}`;
}

export function research(d) {
  const page=d.pages.research;
  const introImage=scientificVisual(page.hero.image,page.hero.alt,{label:page.hero.caption,className:'research-hero-visual',position:page.hero.imagePosition});
  const sections=d.research.map(area=>{
    const facts=area.prospective?[['Existing foundation',area.existingFoundation],['Future research directions',area.futureDirections]]:[['What I control',area.whatIControl],['What I measure',area.whatIMeasure],['Why it matters',area.whyItMatters]];
    const filled=facts.filter(([,value])=>value);
    const papers=area.selectedPapers??area.papers??[];
    return `<section class="section shell research-area${area.prospective?' research-emerging':''}" id="${e(area.id)}"><div class="research-area-heading"><p class="area-type">${e(area.areaType)}</p><h2>${e(area.displayTitle)}</h2>${scientificVisual(area.image,area.alt,{label:area.caption,className:'research-science',position:area.imagePosition})}</div><div class="research-area-body"><p class="research-question-label">Research question</p><h3>${e(area.question)}</h3>${filled.length?`<dl class="research-facts">${filled.map(([heading,value])=>`<div><dt>${e(heading)}</dt><dd>${e(value)}</dd></div>`).join('')}</dl>`:(area.paragraphs??[]).map(p=>`<p>${p.label?`<strong>${e(p.label)}</strong> `:''}${e(p.text)}</p>`).join('')}${area.showPapers&&papers.length?`<h4 class="small-heading">${e(area.prospective?'Research foundation':page.selectedPapersHeading)}</h4><ul class="paper-references">${papers.map(id=>paperReference(d,id)).join('')}</ul>`:''}${area.links?.length?`<div class="research-actions">${richLinks(area.links)}</div>`:''}</div></section>`;
  }).join('');
  return `${heroFrom(page)}${researchTabs('research.html')}${introImage?`<div class="shell research-hero-image">${introImage}</div>`:''}${page.map.visible!==false?`<div class="shell research-map-wrap">${researchDiagram(page.map)}</div>`:''}${sections}`;
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
  const sections=[['Ongoing','startDate'],['Completed','endDate']].map(([status,dateKey])=>{
    const entries=d.projects.filter(p=>projectStatus(p)===status).sort((a,b)=>String(b[dateKey]||'').localeCompare(String(a[dateKey]||''))||Number(a.order??999)-Number(b.order??999));
    return entries.length?`<section class="section shell project-group" id="${status.toLowerCase()}"><h2>${e(status==='Ongoing'?page.ongoingTitle:page.completedTitle)}</h2><div class="project-list">${entries.map(p=>projectEntry(d,p)).join('')}</div></section>`:'';
  }).join('');
  return `${heroFrom(page)}${researchTabs('projects.html')}${sections}${page.caseStudiesVisible!==false&&d.researchProjects.length?`<section class="section shell project-cases"><h2>${e(page.caseStudiesTitle)}</h2><div class="project-case-list">${d.researchProjects.map(p=>caseStudy(d,p)).join('')}</div></section>`:''}<div class="shell project-endnote"><p class="record-note">${e(page.note)}</p>${textLink(page.outputsUrl,e(page.outputsLabel))}</div>`;
}

export function patents(d) {
  const page=d.pages.patents;
  const ordered=[...d.patents].sort(bySortDateDesc);
  const entry=p=>{
    const registered=['Registered','Granted'].includes(p.status);
    const date=patentRecordDate(p).replaceAll('-','.');
    const filingCountry=patentCountry(p.country||p.jurisdiction||'');
    const identifier=patentNumber(registered?p.registrationNumber||p.applicationNumber:p.applicationNumber||p.registrationNumber);
    const family=p.jurisdiction&&/[·,]/.test(p.jurisdiction)?p.jurisdiction.split(/\s*[·,]\s*/).map(patentCountry).join(' · '):'';
    const metadata=[p.status,filingCountry,date,!family&&identifier?`${registered?'Registration':'Application'} No. ${identifier}`:''].filter(Boolean).join(' · ');
    const original=p.englishTitle&&p.title!==p.englishTitle?p.title:'';
    return `<article class="output-entry patent-entry" id="${e(p.id)}" data-patent-status="${registered?'registered':'application'}"><h3 class="output-title">${e(p.englishTitle||p.title)}</h3>${original?`<p class="patent-original" lang="ko">${e(original)}</p>`:''}<p class="output-authors" lang="ko">${e(p.inventors)}</p><p class="patent-metadata">${e(metadata)}</p>${family?`<dl class="patent-family"><div><dt>Patent family</dt><dd>${e(family)}</dd></div><div><dt>Shown filing</dt><dd>${e([filingCountry,identifier].filter(Boolean).join(' '))}</dd></div></dl>`:''}${p.assignee?`<p class="patent-extra">Assignee: ${e(p.assignee)}</p>`:''}${p.description?`<p class="output-description">${e(p.description)}</p>`:''}${p.externalUrl?textLink(p.externalUrl,'Patent record'):''}</article>`;
  };
  return `${outputHero('Patents',page.hero.description)}${publicationsTabs(d,'patents.html')}<section class="shell output-section"><div class="patent-filters" role="group" aria-label="Filter patents by status"><button type="button" data-patent-filter="all" aria-pressed="true">All</button><button type="button" data-patent-filter="registered" aria-pressed="false">Registered</button><button type="button" data-patent-filter="application" aria-pressed="false">Application</button></div><div class="output-list patent-list">${ordered.map(entry).join('')}</div><p class="output-empty" id="patent-empty" hidden>No patents match this filter.</p><p class="record-note">${e(page.intro)}</p></section>`;
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
  return `<section class="about-intro shell about-page" id="profile">${portrait(d)}<div class="about-intro-copy"><p class="about-field">${e(page.field)}</p><h1>${e(d.profile.name)}</h1><p class="about-position">${page.positionLines.map(e).join('<br>')}</p><div class="about-biography"><h2>${e(page.biographyTitle)}</h2><p>${e(d.profile.bio)}</p><p>${e(page.biographyExtra)}</p><p>${e(d.profile.vision)}</p></div>${profiles(d)}<p class="about-affiliation">${e(d.profile.lab)} · Advisor: <a href="${e(d.profile.advisorUrl)}">${e(d.profile.advisor)}</a></p></div></section>
  <section class="section shell about-page about-section" id="education"><h2>${e(page.educationTitle)}</h2><div class="about-entry-list">${education}</div></section>
${experience?`  <section class="section shell about-page about-section" id="experience"><h2>Experience</h2><div class="about-entry-list">${experience}</div></section>`:''}
  ${awards.length?`<section class="section shell about-page about-section about-recognition" id="recognition"><h2>Honors &amp; Scholarships</h2><div class="award-list">${awards.map(item=>`<article class="award-entry" id="${e(item.id)}"><div class="award-main"><h3>${e(item.englishTitle||item.title)}</h3><p class="award-meta">${e([item.englishOrganization||item.organization,item.type].filter(Boolean).join(' · '))}</p>${item.englishTitle&&item.title!==item.englishTitle?`<p class="award-original" lang="ko">${e(item.title)}</p>`:''}${item.description?`<p>${e(item.description)}</p>`:''}${item.url?textLink(item.url,'Award record'):''}</div><span class="award-item-year">${e(item.year)}</span></article>`).join('')}</div><div class="about-related"><div><p class="about-related-title">${e(page.activitiesTitle)}</p><p>${e(page.activitiesIntro)}</p></div>${textLink('activities.html',e(page.activitiesLinkLabel))}</div></section>`:''}`;
}

export function activities(d) {
  const page=d.pages.activities;
  const news=activityItems(d);
  const photos=d.gallery.filter(item=>item.image);
  const gallery=photos.length
    ? `<div class="gallery-grid">${photos.map((item,i)=>`<figure class="gallery-item"><button type="button" class="gallery-open" data-gallery-index="${i}" data-gallery-title="${e(item.title)}" data-gallery-category="${e(item.category)}" data-gallery-location="${e(item.location??'')}" data-gallery-date="${e(item.date||item.year||'')}" data-gallery-caption="${e(item.caption??'')}" aria-label="Open image: ${e(item.title)}"><img src="${e(item.image)}" alt="${e(item.alt)}" width="900" height="675" style="object-position:${imagePosition(item.imagePosition)}" loading="lazy" decoding="async"></button><figcaption><p class="gallery-category">${e(item.category)}</p><h3>${e(item.title)}</h3><p>${e([item.location,item.date||item.year].filter(Boolean).join(' · '))}</p>${item.caption?`<p>${e(item.caption)}</p>`:''}${item.url?textLink(item.url,'Related link'):''}</figcaption></figure>`).join('')}</div><dialog class="gallery-dialog" id="gallery-dialog" aria-label="Gallery image"><div class="gallery-dialog-inner"><button type="button" class="gallery-close" aria-label="Close image">Close ×</button><img alt=""><div class="gallery-dialog-copy"><p class="gallery-dialog-meta"></p><h2 class="gallery-dialog-title"></h2><p class="gallery-dialog-caption"></p><div class="gallery-dialog-controls"><button type="button" class="gallery-prev">← Previous</button><button type="button" class="gallery-next">Next →</button></div></div></div></dialog>`
    : '';
  const newsSection=news.length?`<section class="section shell activities-news" id="news"><div class="section-heading"><div><h2>${e(page.newsTitle||'Selected activities')}</h2>${page.newsIntro?`<p class="section-intro">${e(page.newsIntro)}</p>`:''}</div></div><div class="news-list">${news.map(item=>`<article class="news-item${item.featured?' news-featured':''}" id="${e(item.id)}">${item.thumbnail?`<figure><img src="${e(item.thumbnail)}" alt="${e(item.thumbnailAlt||item.title)}" width="640" height="400" style="object-position:${imagePosition(item.thumbnailPosition)}" loading="lazy" decoding="async">${item.thumbnailCaption?`<figcaption>${e(item.thumbnailCaption)}</figcaption>`:''}</figure>`:''}<div><p class="news-meta">${item.type?`<span class="activity-category">${e(item.type)}</span>`:''}${e([item.date,item.source].filter(Boolean).join(' · '))}</p><h3>${activityTitle(item)}</h3>${item.shortDescription?`<p>${e(item.shortDescription)}</p>`:''}</div></article>`).join('')}</div></section>`:'';
  return `${heroFrom(page)}${newsSection}${gallery?`<section class="section shell activities-gallery" id="gallery"><div class="section-heading"><div><h2>${e(page.galleryTitle)}</h2>${page.galleryIntro?`<p class="section-intro">${e(page.galleryIntro)}</p>`:''}</div></div>${gallery}</section>`:''}`;
}

export function cv(d) {
  const page=d.pages.cv;
  const pubs=d.publications.filter(p=>!isUnpublished(p)).sort((a,b)=>b.year-a.year);
  const education=d.education.map(item=>`<p><strong>${e(item.degree)}</strong> · ${e(item.period||'')}<br>${e(item.school)}${item.gpa?`<br>GPA: ${e(item.gpa)}`:''}${item.honor?` · ${e(item.honor)}`:''}${item.advisor?`<br>Advisor: ${e(item.advisor)}`:''}</p>`).join('');
  return `<div class="shell cv-toolbar">${textLink(d.profile.cv,e(page.downloadLabel),'download')}<button class="text-link print-button" type="button" hidden>Print CV <span aria-hidden="true">↗</span></button><span>${e(page.updatedPrefix)} ${e(d.profile.updated)}</span></div><article class="cv-document shell"><header><p class="eyebrow">Curriculum vitae</p><h1>${e(d.profile.name)}</h1><p>${e(d.profile.department)}, ${e(d.profile.institution)}<br>${e(d.profile.location)} · <a href="mailto:${e(d.profile.email)}">${e(d.profile.email)}</a><br><a href="${e(d.site.baseUrl)}">${e(new URL(d.site.baseUrl).hostname)}</a> · <a href="${e(d.scholar)}">Google Scholar</a></p></header><section><h2>${e(page.researchIdentityTitle)}</h2><p>${e(page.researchIdentity)}</p><p>${e(page.researchInterests)}</p></section><section><h2>Education</h2>${education}</section><section><h2>Publications</h2><ol class="cv-publications">${pubs.map(p=>`<li><p>${authors(p.authors)}. “${e(p.title)}.” <em>${e(p.journalName||p.journal)}</em> (${p.year}).${p.type==='first'||p.firstAuthor?' <strong>[First author]</strong>':''}${p.doi?` <a href="https://doi.org/${e(p.doi)}">doi:${e(p.doi)}</a>`:''}</p></li>`).join('')}</ol></section><section><h2>Patents</h2><ol>${d.patents.map(p=>`<li><p><span lang="ko">${e(p.inventors)}</span>. “<span ${/[가-힣]/.test(p.title)?'lang="ko"':''}>${e(p.title)}</span>.” ${e(p.status)} · ${e(p.jurisdiction)} · ${p.numberLabel?`${e(p.numberLabel)}: `:''}${e(patentIdentifier(p))} · ${e(patentRecordDate(p))}.${p.territoryNote?' '+e(p.territoryNote):''}</p></li>`).join('')}</ol></section><section><h2>Research projects</h2>${d.projects.map(p=>`<div class="cv-entry"><p><strong>${e(p.englishTitle||p.title)}</strong>${p.englishTitle&&p.title?`<br><span lang="ko">${e(p.title)}</span>`:''}<br>${e(p.sponsor||p.fundingAgency||'')}<br>Program period: ${e(projectPeriod(p))}${p.personalRole?` · Role: ${e(p.personalRole)}`:''}${p.personalParticipationPeriod?`<br>My participation: ${e(formatPeriod(p.personalParticipationPeriod))}`:''}</p></div>`).join('')}</section><section><h2>Awards &amp; academic programs</h2>${d.awards.map(a=>`<div class="cv-entry"><p><strong>${a.year} · ${e(a.englishTitle)}</strong><br><span lang="ko">${e(a.title)}</span></p></div>`).join('')}</section><p class="cv-source">${e(page.sourceNote)}</p></article>`;
}
