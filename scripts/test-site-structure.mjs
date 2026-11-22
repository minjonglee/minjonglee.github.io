import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {defaultRoot,loadContent} from './content.mjs';
import {bySortDateDesc} from './components.mjs';
import {about,activities,conferences,home,projects} from './pages.mjs';

const data=loadContent();
const html=name=>fs.readFileSync(path.join(defaultRoot,`${name}.html`),'utf8');
const pages=Object.fromEntries(['index','about','research','projects','publications','patents','conferences','activities','cv'].map(name=>[name,html(name)]));
const expectedNav=[['About','about.html'],['Research','research.html'],['Publications','publications.html'],['Activities','activities.html'],['CV','cv.html']];
assert.deepEqual(data.site.navigation.filter(item=>item.visible!==false).map(item=>item.label),expectedNav.map(([label])=>label));
for(const [name,page] of Object.entries(pages)) {
  const nav=page.match(/<nav id="primary-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(nav,`${name}: missing primary navigation`);
  for(const [label,href] of expectedNav) assert.ok(nav.includes(`href="${href}"`)&&nav.includes(`>${label}</a>`),`${name}: ${label} link missing`);
  assert.equal((nav.match(/<a\b/g)||[]).length,5,`${name}: unexpected primary navigation item`);
  assert.ok(page.includes('id="contact"'),`${name}: footer contact missing`);
}
for(const [name,links] of [['research',['research.html','projects.html']],['projects',['research.html','projects.html']],['publications',['publications.html','patents.html']],['patents',['publications.html','patents.html']]]) {
  const tabs=pages[name].match(/<nav class="section-tabs shell"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(tabs,`${name}: secondary tabs missing`);
  for(const href of links) assert.ok(tabs.includes(`href="${href}"`),`${name}: ${href} tab missing`);
  assert.ok(tabs.includes(`href="${name}.html" aria-current="page"`),`${name}: current tab not marked`);
}
assert.ok(!pages.publications.includes('href="conferences.html"')&&!pages.patents.includes('href="conferences.html"'),'Empty Conferences tab should be hidden');
assert.ok(pages.conferences.includes('http-equiv="refresh"')&&pages.conferences.includes('url=publications.html'),'Empty Conferences URL should redirect to Publications');
assert.equal(data.education.length,2);
assert.equal(data.experience.length,1);
assert.equal(data.awards.length,6);
assert.equal(data.projects.length,9);
assert.equal(new Set(data.projects.map(item=>item.title.trim().toLocaleLowerCase())).size,data.projects.length,'duplicate project titles');
assert.equal(data.patents.length,8);
for(const item of data.education) assert.ok(pages.about.includes(item.degree),`education missing: ${item.id}`);
assert.ok(!pages.about.includes('id="experience"'),'Duplicate current position should be omitted from About');
for(const item of data.awards) assert.ok(pages.about.includes(item.title),`honor missing: ${item.id}`);
for(const item of data.awards) assert.ok(pages.about.includes(`<h3>${item.englishTitle}</h3>`),`English honor title should lead: ${item.id}`);
for(const item of data.awards) assert.ok(pages.about.includes(`${item.englishOrganization} · ${item.type}`),`English honor organization should appear first: ${item.id}`);
assert.ok(!pages.about.includes('class="award-year"'),'About should list honors without year headings');
for(const item of data.awards) assert.ok(pages.about.includes(`class="award-entry" id="${item.id}"`),`honor should remain directly linkable: ${item.id}`);
assert.ok(pages.about.indexOf('id="education"')<pages.about.indexOf('id="recognition"'),'About section order is incorrect');
const sortedAwards=[...data.awards].sort((a,b)=>Number(b.year)-Number(a.year)||Number(a.order??999)-Number(b.order??999));
assert.deepEqual([...pages.about.matchAll(/class="award-entry" id="([^"]+)"/g)].map(match=>match[1]),sortedAwards.map(item=>item.id),'About honors order is incorrect');
for(const item of data.projects) assert.ok(pages.projects.includes(`id="${item.id}"`)||pages.projects.includes(item.title),`project missing: ${item.id}`);
assert.ok(pages.projects.indexOf('id="ongoing"')<pages.projects.indexOf('id="completed"'),'Projects status section order is incorrect');
for(const item of data.projects) {
  const section=item.status==='Completed'?'completed':'ongoing';
  const html=section==='ongoing'?pages.projects.split('id="ongoing"')[1].split('id="completed"')[0]:pages.projects.split('id="completed"')[1];
  assert.ok(html.includes(`id="${item.id}"`),`project in wrong status section: ${item.id}`);
}
for(const id of ['photonic-skin','flexible-fpcb','ald-electrodes-industry']) {
  const entry=pages.projects.split(`id="${id}"`)[1].split('</article>')[0];
  assert.ok(!entry.includes('project-summary'),`title-repeating project summary remains: ${id}`);
}
for(const item of data.patents) {
  assert.ok(pages.patents.includes(`id="${item.id}"`),`patent missing: ${item.id}`);
  assert.ok(item.applicationNumber||item.registrationNumber,`patent identifier missing: ${item.id}`);
  assert.ok(item.applicationDate||item.registrationDate,`patent date missing: ${item.id}`);
}
assert.ok(pages.patents.includes('10-2024-0060762'));
assert.ok(pages.patents.includes('MIM 커패시터'));
assert.ok(pages.patents.includes('Also listed in CN · TW; filing details are not shown.')&&pages.patents.includes('Application No. 19/002,282'),'Unverified additional filings must stay distinct from the shown patent number');
for(const status of ['all','registered','application']) assert.ok(pages.patents.includes(`data-patent-filter="${status}"`));
assert.ok(pages.patents.includes('id="patent-search"'));
assert.equal((pages.patents.match(/class="output-entry patent-family-entry"/g)||[]).length,6);
assert.equal((pages.patents.match(/class="patent-filing" id="patent-/g)||[]).length,8);
assert.ok(!pages.patents.includes('class="output-year"')&&!pages.patents.includes('data-patent-year'),'Patents should be one continuous list');
const patentIds=[...pages.patents.matchAll(/class="patent-filing" id="([^"]+)"/g)].map(match=>match[1]);
assert.deepEqual(patentIds,['patent-01','patent-02','patent-03','patent-04','patent-06','patent-05','patent-07','patent-08'],'Patents should retain descending sort dates within confirmed families');
assert.equal((pages.patents.match(/>Multifunctional low-power optoelectronic memristors<\/h3>/g)||[]).length,1,'Confirmed KR and US filings should share one family heading');
assert.equal((pages.patents.match(/>Method of manufacturing semiconductor memory devices<\/h3>/g)||[]).length,1,'Confirmed KR and US memory filings should share one family heading');
assert.ok(!pages.conferences.includes('class="output-entry conference-entry"'));
assert.ok(!pages.conferences.includes('class="output-year"'),'Conferences should not have year headings');
const conferenceSample=conferences({...data,conferences:[
  {id:'older',title:'Older presentation',conferenceName:'Older event',date:'2023-06',year:2023,sortDate:'2023-06-01',order:1},
  {id:'recent',title:'Recent presentation',conferenceName:'Recent event',date:'July 2025',year:2025,sortDate:'2025-07-01',order:9},
  {id:'newest',title:'New presentation',conferenceName:'New event',year:2026,sortDate:'2026-01-01',order:99}
]});
assert.deepEqual([...conferenceSample.matchAll(/class="output-entry conference-entry" id="([^"]+)"/g)].map(match=>match[1]),['newest','recent','older'],'Conferences should sort by sortDate, independent of order');
assert.ok(!conferenceSample.includes('class="output-year"'),'Populated Conferences should remain a continuous list');
assert.ok(pages.activities.includes('Activity archive')&&!pages.activities.includes('Selected activities'));
for(const filter of ['all','awards','research','media']) assert.ok(pages.activities.includes(`data-activity-filter="${filter}"`));
assert.equal((pages.activities.match(/class="activity-entry"/g)||[]).length,9,'Six verified awards and three research/media records should appear without duplicate award cards');
assert.ok(pages.activities.includes('id="chiral-perovskite-university-highlight"')&&pages.activities.includes('Korea University News'),'Chiral paper should have official university coverage');
assert.ok(pages.activities.includes('13 coverage links')&&pages.activities.includes('12 coverage links'));
assert.ok(pages.activities.includes('https://n.news.naver.com/mnews/article/003/0013541442?sid=102'));
assert.ok(pages.activities.includes('https://www.youtube.com/watch?v=t0I_C4Qzbdk'));
assert.ok(!pages.activities.includes('shimgrp.korea.ac.kr/notices/'),'Source laboratory links should not appear on the public page');
assert.ok(pages.index.includes('Outstanding Graduate Research Achievement')&&pages.activities.includes('Outstanding Graduate Research Achievement'));
const linkedActivity={id:'test-linked',title:'Linked activity',date:'2027-01-01',type:'News',url:'https://example.org/article',visible:true,featured:true};
const staticActivity={id:'test-static',title:'Static activity',date:'2027-01-02',type:'Media',url:'#',visible:true,featured:true};
const activityData={...data,news:[linkedActivity,staticActivity]};
assert.ok(home(activityData).includes('href="activities.html#test-linked"'),'Home activity links should open internal details');
assert.ok(activities(activityData).includes('href="https://example.org/article"')&&!activities(activityData).includes('href="#"'),'Real external links should appear only inside activity details');
assert.ok(!pages.activities.includes('id="gallery"'),'Gallery should be hidden until an image is provided');
assert.equal((pages.index.match(/class="featured-work"/g)||[]).length,3,'Home should show three featured papers');
const featuredHtml=pages.index.split('id="featured"')[1].split('</section>')[0];
const featuredTitles=['paper-22','paper-02','paper-03'].map(id=>data.publications.find(item=>item.id===id).title);
for(const title of featuredTitles) assert.ok(featuredHtml.includes(title),`featured paper missing: ${title}`);
assert.ok(featuredTitles.every((title,index)=>index===0||featuredHtml.indexOf(featuredTitles[index-1])<featuredHtml.indexOf(title)),'Featured papers should follow the requested order');
assert.ok(!pages.index.includes('ADD VERIFIED RESEARCH FIGURE'),'Missing featured image should not produce a placeholder');
for(const file of ['featured-chiral-synapse.jpg','featured-hydrogen-synapse.jpg','featured-opto-memory.jpg']) assert.ok(featuredHtml.includes(`assets/artwork/${file}`),`Featured Work needs its distinct ${file} artwork`);
assert.ok(!featuredHtml.includes('assets/schematics/'),'The old Featured Work schematics must not render');
const memorySection=pages.research.split('id="memory"')[1].split('</section>')[0];
assert.ok(memorySection.includes('paper-02')&&memorySection.includes('paper-03')&&memorySection.includes('paper-23')&&memorySection.includes('paper-08')&&memorySection.includes('paper-22'),'Memory pillar should connect first-author and collaborative device studies');
const platformSection=pages.research.split('id="platforms"')[1].split('</section>')[0];
assert.ok(platformSection.includes('paper-06')&&platformSection.includes('paper-24'),'Thin-film pillar should connect ALD electrodes and printed interconnects');
const chiralSection=pages.research.split('id="chiral-memory"')[1].split('</article>')[0];
assert.ok(chiralSection.includes('paper-22')&&chiralSection.includes('72 experimentally')&&chiralSection.includes('publisher CRediT'),'Chiral research should be a sourced selected study within broader device physics');
const flexibleSection=pages.research.split('id="flexible"')[1].split('</article>')[0];
assert.ok(flexibleSection.includes('paper-24')&&flexibleSection.toLowerCase().includes('initial')&&flexibleSection.includes('repeated deformation'),'Flexible work needs its accepted paper and variability distinction');
const stretchableProject=pages.projects.split('id="stretchable-pcb"')[1].split('</article>')[0];
assert.ok(stretchableProject.includes('publications.html#paper-24'),'Stretchable PCB project should link the accepted paper');
assert.ok(pages.cv.includes('Printed Thickness and Trace-to-Trace Electrical Variability in Liquid Metal Particle Stretchable Interconnects')&&pages.cv.includes('Journal of Flexible and Printed Electronics</em> 2026 (Accepted)'),'Web CV should preserve the new paper and its Accepted status');
assert.ok(pages.cv.includes('Download CV (November 2026 PDF)'),'The downloadable PDF should be the updated public version');
assert.ok(pages.cv.includes('Vol. 36 · Issue 87 · Article e78448'),'Web CV should reflect updated AFM bibliographic details');
assert.ok(pages.research.includes('Research expertise &amp; methods')&&pages.research.includes('Materials &amp; Interface Engineering')&&pages.research.includes('Processing &amp; Applied Devices'),'Four method-to-question expertise areas should render');
const chiralActivity=pages.activities.split('id="chiral-perovskite-university-highlight"')[1].split('</details>')[0];
for(const name of ['한국강사신문','내일신문','이뉴스투데이','이데일리','뉴스티앤티','팝콘뉴스','베리타스알파']) assert.ok(chiralActivity.includes(name),`Missing media outlet: ${name}`);
assert.ok(chiralActivity.includes('Institutional coverage')&&chiralActivity.includes('Media coverage · 7 outlets')&&chiralActivity.includes('https://doi.org/10.1002/adma.75308'));
assert.equal((pages.activities.match(/id="chiral-perovskite-university-highlight"/g)||[]).length,1,'Chiral research highlight must remain one activity');
const chiralNews=data.news.find(item=>item.id==='chiral-perovskite-university-highlight');
assert.equal(chiralNews.institutionalLinks.length,2);
assert.equal(chiralNews.mediaLinks.length,7);
for(const link of [...chiralNews.institutionalLinks,...chiralNews.mediaLinks]) assert.ok(chiralActivity.includes(link.url.replaceAll('&','&amp;')),`Coverage URL missing: ${link.url}`);
assert.ok(pages.research.includes('Toward integrated electronic systems'),'Integration must be marked as a future direction');
assert.ok(pages.index.includes('Interface &amp; Defect Engineering')&&pages.index.includes('Memory Device Physics &amp; Reliability')&&pages.index.includes('Thin-Film Electronics &amp; Device Platforms'),'Home should present the three transferable research pillars');
assert.ok(pages.research.indexOf('Three connected lines of inquiry')<pages.research.indexOf('Selected Research Contributions')&&pages.research.indexOf('Selected Research Contributions')<pages.research.indexOf('Current Research &amp; Future Directions'),'Research should progress from framework to evidence and directions');
assert.ok(pages.projects.includes('class="project-case-inline"')&&!pages.projects.includes('class="section shell project-cases"'),'A single case study should be inside its related project');
const biography=pages.about.match(/<div class="about-biography">([\s\S]*?)<\/div>/)?.[1]||'';
assert.equal((biography.match(/<p>/g)||[]).length,2,'Biography should have two paragraphs');
for(const file of ['research-interfaces.jpg','research-memory.jpg','research-optoelectronics.jpg','research-flexible.jpg']) assert.ok(pages.research.includes(`assets/artwork/${file}`),`Research artwork missing: ${file}`);
assert.ok(!pages.research.includes('assets/schematics/'),'The old Research schematics must not render');
for(const file of ['samsung-award-presentation.jpg','samsung-award-ceremony.jpg','samsung-award-certificate.png','next-generation-engineering-award.jpg','hydrogen-synapse-press-figure.jpg','optoelectronic-memristor-press-02.jpg']) assert.ok(pages.activities.includes(`assets/images/activities/${file}`),`Activity image missing: ${file}`);
assert.ok(pages.activities.includes('id="activity-lightbox"')&&pages.activities.includes('class="activity-image-open"'),'Activity details need a lightbox gallery');
assert.ok(pages.activities.includes('object-fit:contain')&&pages.activities.includes('object-fit:cover'),'Activities should preserve research figures and fill photographic cards');
assert.ok(!pages.activities.includes('assets/schematics/'),'Media cards should use source images rather than old artwork');
for(const item of [...data.publications,...data.research,...data.news]) for(const value of [item.image,item.thumbnail,...(item.images??[]).map(image=>image.image)].filter(Boolean)) if(value.startsWith('/assets/')) assert.ok(fs.existsSync(path.join(defaultRoot,value.slice(1))),`Missing local image: ${value}`);
assert.ok(!pages.index.includes('PORTFOLIO / 2026'));
const hiddenFeatured=home({...data,pages:{...data.pages,home:{...data.pages.home,featured:{...data.pages.home.featured,visible:false}}}});
assert.ok(!hiddenFeatured.includes('id="featured"')&&!hiddenFeatured.includes('href="#featured"'),'Hidden featured section should not leave a dead hero link');
assert.ok(!projects({...data,projects:data.projects.filter(item=>item.status==='Ongoing')}).includes('id="completed"'),'Empty project groups should be omitted');
assert.ok(!about({...data,awards:[]}).includes('id="recognition"'),'Empty honors section should be omitted');
console.log('Navigation, secondary tabs, migrated records, patent filters, and empty-state content checks passed.');
