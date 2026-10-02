import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {defaultRoot,loadContent} from './content.mjs';
import {doiHref,isPublicationVisible,publication} from './components.mjs';

const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(defaultRoot,'content.js'),'utf8'),context);
const old=context.window.SITE_CONTENT.publications;
const current=loadContent();
assert.equal(current.publications.length,old.length+2,'the two verified new papers should be added alongside preserved records');
for(const before of old){
  const after=current.publications.find(p=>p.id===before.id);
  assert.ok(after,`missing ${before.id}`);
  for(const key of ['title','authors','journal','year','doi','status','type','image','imageAlt'])
    if(key in before) assert.deepEqual(after[key],before[key],`${before.id}: ${key} changed`);
  assert.equal(after.journalName,(before.journal||'').split(' · ')[0]);
}

const config=JSON.parse(fs.readFileSync(path.join(defaultRoot,'.pages.yml'),'utf8'));
const editor=config.content.flatMap(group=>group.items).find(item=>item.name==='publications');
const fields=new Map(editor.fields.map(field=>[field.name,field]));
for(const key of ['title','authors','journalName','publicationType','publicationStatus','year','publicationDate','onlinePublicationDate','volume','issue','startPage','endPage','pages','articleNumber','eLocationId','doi','doiUrl','publisherUrl','journalUrl','pdfUrl','supplementaryUrl','publisher','issn','eIssn','researchCategory','keywords','topics','relatedResearch','relatedProjects','myAuthorRole','firstAuthor','coFirstAuthor','correspondingAuthor','coCorrespondingAuthor','authorNotes','featured','visible','order','id'])
  assert.ok(fields.has(key),`CMS missing ${key}`);
for(const paper of current.publications) for(const key of Object.keys(paper)) assert.ok(fields.has(key),`CMS would omit ${paper.id}.${key}`);
assert.equal(fields.get('visible').default,true);
assert.equal(fields.get('publicationDate').default,'');
assert.equal(fields.get('publicationStatus').default,'Published');
assert.ok(editor.fields.findIndex(f=>f.name==='title')<editor.fields.findIndex(f=>f.name==='volume'));
assert.ok(fields.get('publicationStatus').options.values.includes('Manuscript'));
const pageText=config.content.flatMap(group=>group.items).find(item=>item.name==='publications-page');
assert.ok(!pageText.fields.some(field=>field.name.startsWith('manuscripts')),'CMS still exposes a manuscript display section');

for(const status of ['Accepted','In Press','ASAP','Early View','Online Published','Published'])
  assert.ok(isPublicationVisible({publicationStatus:status}),`${status} must be shown`);
for(const status of ['Manuscript','In Revision','Submitted','Under Review'])
  assert.ok(!isPublicationVisible({publicationStatus:status}),`${status} must be hidden`);

const sample={id:'test',title:'Example paper',authors:'A. Researcher, Min Jong Lee*',journalName:'Example Journal',year:2027,publicationStatus:'Published',volume:'38',issue:'12',startPage:'1234',endPage:'1246',doi:'10.1234/example',keywords:['ionic memory']};
let html=publication(current,sample);
for(const value of ['Vol. 38','Issue 12','pp. 1234–1246','https://doi.org/10.1234/example','ionic memory']) assert.ok(html.includes(value),`missing ${value}`);
assert.ok(html.indexOf('pp. 1234–1246')<html.indexOf('<h3>'),'bibliographic metadata must precede the title');
assert.ok(html.indexOf('publication-doi')<html.indexOf('<h3>'),'DOI must align with metadata');
assert.ok(!html.includes('publication-bibliography'),'separate bibliography line remains');
assert.equal(doiHref({...sample,doiUrl:'https://publisher.example/article'}),'https://publisher.example/article');
html=publication(current,{...sample,volume:'',issue:'',startPage:'',endPage:'',articleNumber:'e2456789',doi:'',doiUrl:''});
assert.ok(html.includes('Article e2456789'));
assert.ok(!html.includes('publication-doi'));
assert.ok(!html.includes('undefined')&&!html.includes('null'));
html=publication(current,{...sample,publicationStatus:'Accepted',volume:'',issue:'',startPage:'',endPage:'',articleNumber:'',doi:'',doiUrl:''});
assert.ok(html.includes('2027 (Accepted)'));
assert.ok(!html.includes('Vol.')&&!html.includes('Issue')&&!html.includes('pp. –')&&!html.includes('Article '));
const page=fs.readFileSync(path.join(defaultRoot,'publications.html'),'utf8');
const visiblePapers=current.publications.filter(isPublicationVisible);
assert.equal(visiblePapers.length,22);
assert.equal(visiblePapers.filter(p=>p.type==='first').length,6);
assert.equal(visiblePapers.filter(p=>p.type==='co').length,16);
assert.equal(current.publications.find(p=>p.id==='paper-22').publicationStatus,'Accepted');
assert.equal(current.publications.find(p=>p.id==='paper-07').articleNumber,'e74660');
assert.equal((page.match(/class="publication-item"/g)||[]).length,visiblePapers.length);
assert.ok(!page.includes('id="paper-01"')&&!page.includes('Chiral Neuromorphic Memory IC'));
assert.ok(!page.includes('publication-manuscripts')&&!page.includes('A manuscript in revision'));
assert.ok(page.indexOf('>2026</h2>')<page.indexOf('>2025</h2>'));
assert.ok(page.includes('id="publication-search"')&&page.includes('id="publication-year-filter"'));
console.log(`Preserved ${old.length} legacy publication records and verified ${visiblePapers.length} visible papers, CMS fields, metadata, and status filtering.`);
