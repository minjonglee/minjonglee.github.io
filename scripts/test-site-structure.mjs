import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {defaultRoot,loadContent} from './content.mjs';
import {patentRecordDate} from './components.mjs';
import {conferences} from './pages.mjs';

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
for(const [name,links] of [['research',['research.html','projects.html']],['projects',['research.html','projects.html']],['publications',['publications.html','patents.html','conferences.html']],['patents',['publications.html','patents.html','conferences.html']],['conferences',['publications.html','patents.html','conferences.html']]]) {
  const tabs=pages[name].match(/<nav class="section-tabs shell"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(tabs,`${name}: secondary tabs missing`);
  for(const href of links) assert.ok(tabs.includes(`href="${href}"`),`${name}: ${href} tab missing`);
  assert.ok(tabs.includes(`href="${name}.html" aria-current="page"`),`${name}: current tab not marked`);
}
assert.equal(data.education.length,2);
assert.equal(data.experience.length,1);
assert.equal(data.awards.length,6);
assert.equal(data.projects.length,9);
assert.equal(new Set(data.projects.map(item=>item.title.trim().toLocaleLowerCase())).size,data.projects.length,'duplicate project titles');
assert.equal(data.patents.length,8);
for(const item of data.education) assert.ok(pages.about.includes(item.degree),`education missing: ${item.id}`);
for(const item of data.experience) assert.ok(pages.about.includes(item.title),`experience missing: ${item.id}`);
for(const item of data.awards) assert.ok(pages.about.includes(item.title),`honor missing: ${item.id}`);
assert.ok(!pages.about.includes('class="award-year"'),'About should list honors without year headings');
for(const item of data.awards) assert.ok(pages.about.includes(`class="award-entry" id="${item.id}"`),`honor should remain directly linkable: ${item.id}`);
assert.ok(pages.about.indexOf('id="education"')<pages.about.indexOf('id="experience"')&&pages.about.indexOf('id="experience"')<pages.about.indexOf('id="recognition"'),'About section order is incorrect');
const sortedAwards=[...data.awards].sort((a,b)=>Number(b.year)-Number(a.year)||Number(a.order??999)-Number(b.order??999));
assert.deepEqual([...pages.about.matchAll(/class="award-entry" id="([^"]+)"/g)].map(match=>match[1]),sortedAwards.map(item=>item.id),'About honors order is incorrect');
for(const item of data.projects) assert.ok(pages.projects.includes(`id="${item.id}"`)||pages.projects.includes(item.title),`project missing: ${item.id}`);
assert.ok(pages.projects.indexOf('id="ongoing"')<pages.projects.indexOf('id="completed"'),'Projects status section order is incorrect');
for(const item of data.projects) {
  const section=item.status==='Completed'?'completed':'ongoing';
  const html=section==='ongoing'?pages.projects.split('id="ongoing"')[1].split('id="completed"')[0]:pages.projects.split('id="completed"')[1];
  assert.ok(html.includes(`id="${item.id}"`),`project in wrong status section: ${item.id}`);
}
for(const item of data.patents) {
  assert.ok(pages.patents.includes(`id="${item.id}"`),`patent missing: ${item.id}`);
  assert.ok(item.applicationNumber||item.registrationNumber,`patent identifier missing: ${item.id}`);
  assert.ok(item.applicationDate||item.registrationDate,`patent date missing: ${item.id}`);
}
assert.ok(pages.patents.includes('10-2024-0060762'));
assert.ok(pages.patents.includes('MIM 커패시터'));
for(const status of ['all','registered','application']) assert.ok(pages.patents.includes(`data-patent-filter="${status}"`));
assert.equal((pages.patents.match(/class="output-entry patent-entry"/g)||[]).length,8);
assert.ok(!pages.patents.includes('class="output-year"')&&!pages.patents.includes('data-patent-year'),'Patents should be one continuous list');
const patentIds=[...pages.patents.matchAll(/class="output-entry patent-entry" id="([^"]+)"/g)].map(match=>match[1]);
const expectedPatentIds=[...data.patents].sort((a,b)=>String(patentRecordDate(b)).localeCompare(String(patentRecordDate(a)))||Number(a.order??999)-Number(b.order??999)).map(item=>item.id);
assert.deepEqual(patentIds,expectedPatentIds,'Patents should be sorted by representative date');
assert.ok(pages.conferences.includes(data.pages.conferences.empty));
assert.ok(!pages.conferences.includes('class="output-entry conference-entry"'));
assert.ok(!pages.conferences.includes('class="output-year"'),'Conferences should not have year headings');
const conferenceSample=conferences({...data,conferences:[
  {id:'older',title:'Older presentation',conferenceName:'Older event',date:'2023-06',year:2023,order:1},
  {id:'recent',title:'Recent presentation',conferenceName:'Recent event',date:'July 2025',year:2025,order:9},
  {id:'undated',title:'Undated presentation',conferenceName:'Undated event',year:2026,order:0}
]});
assert.deepEqual([...conferenceSample.matchAll(/class="output-entry conference-entry" id="([^"]+)"/g)].map(match=>match[1]),['recent','older','undated'],'Conferences should sort by date and leave undated records last');
assert.ok(!conferenceSample.includes('class="output-year"'),'Populated Conferences should remain a continuous list');
const featuredAwards=data.awards.filter(item=>item.visible!==false&&item.featured);
if(featuredAwards.length) {
  for(const item of featuredAwards) {
    assert.ok(pages.activities.includes(`about.html#${item.id}`),`featured award missing from Activities: ${item.id}`);
    assert.ok(pages.index.includes(`about.html#${item.id}`),`featured award missing from Home: ${item.id}`);
  }
} else assert.ok(pages.activities.includes(data.pages.activities.newsEmpty));
assert.ok(pages.activities.includes(data.pages.activities.galleryEmpty));
assert.ok(!pages.index.includes('PORTFOLIO / 2026'));
console.log('Navigation, secondary tabs, migrated records, patent filters, and empty-state content checks passed.');
