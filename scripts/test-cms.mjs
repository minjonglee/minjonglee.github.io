import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {defaultRoot,loadContent} from './content.mjs';

const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(defaultRoot,'content.js'),'utf8'),context);
const previous=context.window.SITE_CONTENT;
const current=loadContent();
for(const name of ['publications','projects','patents','awards','topics']){
  assert.equal(current[name].length,previous[name].length,`${name} count changed during migration`);
  for(const item of previous[name]) assert.ok(current[name].some(record=>record.id===item.id)||name==='awards',`missing migrated ${name}: ${item.id}`);
}
assert.equal(fs.readdirSync(path.join(defaultRoot,'content','research-cases')).filter(file=>file.endsWith('.json')).length,previous.researchProjects.length,'research case migration count changed');
const config=JSON.parse(fs.readFileSync(path.join(defaultRoot,'.pages.yml'),'utf8'));
const editors=config.content.flatMap(group=>group.items);
for(const name of ['publications','projects','patents','research','awards','gallery']){
  const editor=editors.find(item=>item.name===name);
  assert.equal(editor?.type,'collection',`${name} editor missing`);
  assert.equal(editor.operations.create,true);
  assert.equal(editor.operations.delete,true);
  assert.ok(editor.fields.some(field=>field.name==='visible'));
  assert.ok(editor.fields.some(field=>field.name==='featured'));
  assert.ok(editor.fields.some(field=>field.name==='order'));
}
assert.ok(config.media.some(source=>source.name==='images'&&source.input==='assets'));

const temp=fs.mkdtempSync(path.join(os.tmpdir(),'minjonglee-cms-'));
const content=path.join(temp,'content'),out=path.join(temp,'output');
fs.cpSync(path.join(defaultRoot,'content'),content,{recursive:true});
const write=(collection,name,data)=>fs.writeFileSync(path.join(content,collection,`${name}.json`),JSON.stringify(data,null,2)+'\n');
const build=()=>{
  execFileSync(process.execPath,[path.join(defaultRoot,'scripts','build.mjs')],{env:{...process.env,SITE_CONTENT_DIR:content,SITE_OUTPUT_DIR:out},stdio:'pipe'});
  return Object.fromEntries(['index','research','projects','publications','patents'].map(name=>[name,fs.readFileSync(path.join(out,`${name}.html`),'utf8')]));
};
try{
  const newPaper={id:'cms-test-paper',title:'CMS test publication',authors:'A. Researcher, Min Jong Lee',journalName:'Test Journal',year:2027,publicationType:'Journal Article',publicationStatus:'Published',volume:'38',issue:'12',startPage:'1234',endPage:'1246',doi:'10.1234/example',keywords:['ionic memory'],featured:true,featuredOrder:0,featuredTitle:'CMS test feature',featuredContribution:'Test contribution',visible:true,image:'/assets/concept-memory-switching.jpg',imageAlt:'Concept device illustration'};
  write('publications','cms-test-paper',newPaper);
  const project=JSON.parse(fs.readFileSync(path.join(content,'projects','doctoral-ionic-memory.json'),'utf8'));
  write('projects','cms-test-project',{...project,id:'cms-test-project',englishTitle:'CMS test project',caseStudyId:'',homeAnchor:'cms-test-project',featured:true,featuredOrder:0,visible:true});
  const patent=JSON.parse(fs.readFileSync(path.join(content,'patents',fs.readdirSync(path.join(content,'patents')).find(file=>file.endsWith('.json'))),'utf8'));
  write('patents','cms-test-patent',{...patent,id:'cms-test-patent',englishTitle:'CMS test patent',visible:true});
  const area=JSON.parse(fs.readFileSync(path.join(content,'research','memory.json'),'utf8'));
  write('research','cms-test-area',{...area,id:'cms-test-area',displayTitle:'CMS test research area',homeTitle:'CMS test research area',homeRole:'platform',order:6,featured:true,selectedPapers:[],showPapers:false,visible:true});
  let html=build();
  for(const [page,text] of [['publications','CMS test publication'],['index','CMS test feature'],['index','CMS test project'],['patents','CMS test patent'],['research','CMS test research area']]) assert.ok(html[page].includes(text),`${page} did not pick up new content`);
  for(const text of ['Vol. 38','Issue 12','pp. 1234–1246','https://doi.org/10.1234/example']) assert.ok(html.publications.includes(text),`new publication missing ${text}`);
  assert.ok(html.index.includes('assets/concept-memory-switching.jpg'),'CMS image path was not normalized');
  newPaper.title='CMS updated publication';newPaper.featured=false;write('publications','cms-test-paper',newPaper);
  area.visible=false;write('research','cms-test-area',area);
  html=build();
  assert.ok(html.publications.includes('CMS updated publication'),'editing did not rebuild');
  assert.ok(!html.index.includes('CMS test feature'),'featured toggle did not rebuild');
  assert.ok(!html.research.includes('CMS test research area'),'visible toggle did not rebuild');
  newPaper.visible=false;write('publications','cms-test-paper',newPaper);html=build();
  assert.ok(!html.publications.includes('CMS updated publication'),'publication visible toggle did not rebuild');
  newPaper.visible=true;write('publications','cms-test-paper',newPaper);
  fs.rmSync(path.join(content,'publications','cms-test-paper.json'));
  html=build();
  assert.ok(!html.publications.includes('CMS updated publication'),'deletion did not rebuild');
  console.log('CMS migration and local create/edit/delete/visible/featured/image-path rebuild checks passed.');
}finally{fs.rmSync(temp,{recursive:true,force:true});}
