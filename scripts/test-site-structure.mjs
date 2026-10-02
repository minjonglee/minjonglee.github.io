import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {defaultRoot,loadContent} from './content.mjs';

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
assert.equal(data.patents.length,8);
for(const item of data.education) assert.ok(pages.about.includes(item.degree),`education missing: ${item.id}`);
for(const item of data.experience) assert.ok(pages.about.includes(item.title),`experience missing: ${item.id}`);
for(const item of data.awards) assert.ok(pages.about.includes(item.title),`honor missing: ${item.id}`);
for(const item of data.projects) assert.ok(pages.projects.includes(`id="${item.id}"`)||pages.projects.includes(item.title),`project missing: ${item.id}`);
for(const item of data.patents) {
  assert.ok(pages.patents.includes(`id="${item.id}"`),`patent missing: ${item.id}`);
  assert.ok(item.applicationNumber||item.registrationNumber,`patent identifier missing: ${item.id}`);
  assert.ok(item.applicationDate||item.registrationDate,`patent date missing: ${item.id}`);
}
assert.ok(pages.patents.includes('10-2024-0060762'));
assert.ok(pages.patents.includes('MIM 커패시터'));
for(const status of ['all','registered','application']) assert.ok(pages.patents.includes(`data-patent-filter="${status}"`));
assert.equal((pages.patents.match(/class="output-entry patent-entry"/g)||[]).length,8);
assert.ok(pages.conferences.includes(data.pages.conferences.empty));
assert.ok(!pages.conferences.includes('class="output-entry conference-entry"'));
assert.ok(pages.activities.includes(data.pages.activities.newsEmpty));
assert.ok(pages.activities.includes(data.pages.activities.galleryEmpty));
assert.ok(!pages.index.includes('PORTFOLIO / 2026'));
console.log('Navigation, secondary tabs, migrated records, patent filters, and empty-state content checks passed.');
