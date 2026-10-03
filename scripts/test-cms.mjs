import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {defaultRoot,loadContent} from './content.mjs';
import {isPublicationVisible} from './components.mjs';

const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(defaultRoot,'content.js'),'utf8'),context);
const previous=context.window.SITE_CONTENT;
const current=loadContent();
for(const name of ['publications','projects','patents','awards','topics']){
  if(name!=='publications') assert.equal(current[name].length,previous[name].length,`${name} count changed unexpectedly`);
  for(const item of previous[name]){
    if(name==='publications'&&!isPublicationVisible(item)) continue;
    assert.ok(current[name].some(record=>record.id===item.id)||name==='awards',`missing migrated ${name}: ${item.id}`);
  }
}
assert.equal(fs.readdirSync(path.join(defaultRoot,'content','research-cases')).filter(file=>file.endsWith('.json')).length,previous.researchProjects.length,'research case migration count changed');
const config=JSON.parse(fs.readFileSync(path.join(defaultRoot,'.pages.yml'),'utf8'));
const editors=config.content.flatMap(group=>group.items);
for(const name of ['publications','projects','patents','research','awards','gallery','education','experience','conferences','news']){
  const editor=editors.find(item=>item.name===name);
  assert.equal(editor?.type,'collection',`${name} editor missing`);
  assert.equal(editor.operations.create,true);
  assert.equal(editor.operations.delete,true);
  assert.equal(editor.fields.find(field=>field.name==='id')?.required,true,`${name} needs a stable filename ID`);
  assert.ok(editor.fields.some(field=>field.name==='visible'));
  if(name!=='education') assert.ok(editor.fields.some(field=>field.name==='featured'));
  assert.ok(editor.fields.some(field=>field.name==='order'));
}
assert.ok(config.media.some(source=>source.name==='images'&&source.input==='assets'));
const projectFields=editors.find(item=>item.name==='projects').fields;
for(const key of ['title','program','fundingAgency','personalRole','startDate','status']) assert.equal(projectFields.find(field=>field.name===key)?.required,true,`project ${key} should be required`);
for(const key of ['endDate','shortTitle','periodDisplay','description','relatedResearch','relatedPublications']) assert.ok(projectFields.some(field=>field.name===key),`project ${key} editor missing`);
assert.notEqual(projectFields.find(field=>field.name==='period')?.required,true,'legacy period should not be required for new projects');
const editorFields=name=>editors.find(item=>item.name===name).fields;
for(const [name,keys] of Object.entries({research:['image','alt','caption','imagePosition','whatIControl','whatIMeasure','whyItMatters'],publications:['image','imageAlt','imageCaption','imagePosition'],projects:['image','imageAlt','imageCaption','imagePosition'],news:['thumbnail','thumbnailAlt','thumbnailCaption','thumbnailPosition','type'],gallery:['image','alt','caption','imagePosition','date','category','url']}))
  for(const key of keys) assert.ok(editorFields(name).some(field=>field.name===key),`${name} image/content editor missing ${key}`);
assert.ok(editorFields('news').find(field=>field.name==='type').options.values.includes('Video'),'Activities need a video category');
assert.equal(editorFields('news').find(field=>field.name==='type').label,'Category');
assert.equal(editorFields('news').find(field=>field.name==='type').required,true);
for(const name of ['news','awards','gallery']) assert.notEqual(editorFields(name).find(field=>field.name==='url').required,true,`${name} URL must be optional`);
assert.ok(editorFields('awards').some(field=>field.name==='englishOrganization'),'English award organization must remain CMS-editable');
for(const key of ['description','summary']) assert.notEqual(projectFields.find(field=>field.name===key)?.required,true,`project ${key} must be optional`);
assert.ok(editorFields('profile').some(field=>field.name==='heroImagePosition'),'Home hero crop focus missing');
const researchHero=editorFields('research-page').find(field=>field.name==='hero').fields;
for(const key of ['image','alt','caption','imagePosition']) assert.ok(researchHero.some(field=>field.name===key),`Research hero editor missing ${key}`);

const temp=fs.mkdtempSync(path.join(os.tmpdir(),'minjonglee-cms-'));
const content=path.join(temp,'content'),out=path.join(temp,'output');
fs.cpSync(path.join(defaultRoot,'content'),content,{recursive:true});
const write=(collection,name,data)=>fs.writeFileSync(path.join(content,collection,`${name}.json`),JSON.stringify(data,null,2)+'\n');
const build=()=>{
  execFileSync(process.execPath,[path.join(defaultRoot,'scripts','build.mjs')],{env:{...process.env,SITE_CONTENT_DIR:content,SITE_OUTPUT_DIR:out},stdio:'pipe'});
  return Object.fromEntries(['index','about','research','projects','publications','patents','conferences','activities','cv'].map(name=>[name,fs.readFileSync(path.join(out,`${name}.html`),'utf8')]));
};
try{
  const newPaper={id:'cms-test-paper',title:'CMS test publication',authors:'A. Researcher, Min Jong Lee',journalName:'Test Journal',year:2027,publicationType:'Journal Article',publicationStatus:'Published',volume:'38',issue:'12',startPage:'1234',endPage:'1246',doi:'10.1234/example',keywords:['ionic memory'],featured:true,featuredOrder:0,featuredTitle:'CMS test feature',featuredContribution:'Test contribution',visible:true,image:'/assets/concept-memory-switching.jpg',imageAlt:'Concept device illustration',imagePosition:'top'};
  write('publications','cms-test-paper',newPaper);
  const project=JSON.parse(fs.readFileSync(path.join(content,'projects','doctoral-ionic-memory.json'),'utf8'));
  write('projects','cms-test-project',{...project,id:'cms-test-project',englishTitle:'CMS test project',caseStudyId:'',homeAnchor:'cms-test-project',featured:true,featuredOrder:0,visible:true});
  const minimalProject={id:'cms-minimal-project',title:'CMS 신규 과제',program:'CMS test program',fundingAgency:'Test agency',personalRole:'Researcher',startDate:'2027-01',status:'Ongoing',visible:true,image:'/assets/concept-flexible-circuit.jpg',imageAlt:'Concept flexible circuit',imagePosition:'right'};
  write('projects','cms-minimal-project',minimalProject);
  const patent=JSON.parse(fs.readFileSync(path.join(content,'patents',fs.readdirSync(path.join(content,'patents')).find(file=>file.endsWith('.json'))),'utf8'));
  write('patents','cms-test-patent',{...patent,id:'cms-test-patent',title:'CMS test patent',visible:true});
  write('conferences','cms-test-conference',{id:'cms-test-conference',conferenceName:'CMS test conference',title:'CMS test presentation',authors:'Min Jong Lee',year:2027,presentationType:'Poster',visible:true,order:1});
  write('news','cms-test-news',{id:'cms-test-news',title:'CMS test news',date:'2027-01-01',type:'News',source:'Test source',thumbnail:'/assets/concept-device-layers.jpg',thumbnailAlt:'Concept layered device',thumbnailCaption:'CMS test activity caption',thumbnailPosition:'right',featured:true,visible:true,order:1});
  write('gallery','cms-test-gallery',{id:'cms-test-gallery',title:'CMS test gallery',category:'Research',image:'/assets/concept-device-layers.jpg',alt:'Concept layered device',caption:'CMS test caption',date:'2027-01-01',url:'https://example.com/gallery',imagePosition:'bottom',visible:true,order:1});
  const profile=JSON.parse(fs.readFileSync(path.join(content,'profile.json'),'utf8'));
  profile.heroImage='/assets/concept-flexible-circuit.jpg';profile.heroImageAlt='Concept flexible circuit';profile.heroImagePosition='left';
  fs.writeFileSync(path.join(content,'profile.json'),JSON.stringify(profile,null,2)+'\n');
  const researchPage=JSON.parse(fs.readFileSync(path.join(content,'pages','research.json'),'utf8'));
  researchPage.hero.image='/assets/concept-device-layers.jpg';researchPage.hero.alt='Concept layered device';researchPage.hero.caption='CMS test research image';researchPage.hero.imagePosition='bottom';
  fs.writeFileSync(path.join(content,'pages','research.json'),JSON.stringify(researchPage,null,2)+'\n');
  const area=JSON.parse(fs.readFileSync(path.join(content,'research','memory.json'),'utf8'));
  write('research','cms-test-area',{...area,id:'cms-test-area',displayTitle:'CMS test research area',homeTitle:'CMS test research area',homeRole:'platform',order:6,featured:true,selectedPapers:[],showPapers:false,visible:true});
  let html=build();
  for(const [page,text] of [['publications','CMS test publication'],['index','CMS test publication'],['index','CMS test news'],['projects','CMS test project'],['patents','CMS test patent'],['conferences','CMS test presentation'],['activities','CMS test news'],['research','CMS test research area']]) assert.ok(html[page].includes(text),`${page} did not pick up new content`);
  assert.ok(html.index.includes('concept-flexible-circuit.jpg')&&html.index.includes('object-position:left'),'Home hero image should follow CMS fields');
  assert.ok(html.index.includes('object-position:top'),'Featured paper crop focus should follow CMS fields');
  assert.ok(html.research.includes('research-hero-visual')&&html.research.includes('object-position:bottom'),'Research hero image should follow CMS fields');
  assert.ok(html.projects.includes('project-science')&&html.projects.includes('object-position:right'),'Project image should follow CMS fields');
  assert.ok(html.activities.includes('id="gallery"')&&html.activities.includes('CMS test gallery')&&html.activities.includes('https://example.com/gallery'),'Gallery should appear from CMS data');
  assert.ok(html.activities.includes('CMS test activity caption')&&html.activities.includes('object-position:right'),'Activities should render CMS thumbnail caption and crop focus');
  assert.ok(html.activities.includes('<h3>CMS test news</h3>')&&html.index.includes('<h3>CMS test news</h3>'),'Activity with no URL should stay static in both locations');
  const linkedNews=JSON.parse(fs.readFileSync(path.join(content,'news','cms-test-news.json'),'utf8'));
  linkedNews.url='https://example.org/article';write('news','cms-test-news',linkedNews);html=build();
  assert.ok(html.activities.includes('<a href="https://example.org/article">CMS test news</a>')&&html.index.includes('<a href="https://example.org/article">CMS test news</a>'),'A CMS URL should activate both activity links');
  assert.ok(html.publications.includes('href="conferences.html"'),'Conferences tab should reappear when CMS has a record');
  assert.ok(html.projects.split('id="ongoing"')[1].split('id="completed"')[0].includes('CMS 신규 과제'),'minimal project should appear among ongoing projects');
  assert.ok(html.projects.includes('2027.01 – Present'),'project period should derive from CMS dates');
  assert.ok(html.cv.includes('CMS 신규 과제'),'CV should use the original title when no English title is supplied');
  minimalProject.status='Completed';write('projects','cms-minimal-project',minimalProject);html=build();
  assert.ok(!html.projects.split('id="ongoing"')[1].split('id="completed"')[0].includes('CMS 신규 과제'),'status change should remove project from ongoing list');
  assert.ok(html.projects.split('id="completed"')[1].includes('CMS 신규 과제'),'status change should place project in completed list');
  minimalProject.endDate='2027-02';write('projects','cms-minimal-project',minimalProject);html=build();
  assert.ok(html.projects.includes('2027.01 – 2027.02'),'completed period should use the end date');
  assert.ok(html.projects.indexOf('id="cms-minimal-project"')<html.projects.indexOf('id="ald-electrodes-industry"'),'completed projects should sort by end date');
  for(const text of ['Vol. 38','Issue 12','pp. 1234–1246','https://doi.org/10.1234/example']) assert.ok(html.publications.includes(text),`new publication missing ${text}`);
  assert.ok(html.index.includes('assets/concept-memory-switching.jpg'),'CMS image path was not normalized');
  newPaper.title='CMS updated publication';newPaper.featured=false;write('publications','cms-test-paper',newPaper);
  area.visible=false;write('research','cms-test-area',area);
  html=build();
  assert.ok(html.publications.includes('CMS updated publication'),'editing did not rebuild');
  assert.ok(!html.index.includes('CMS test publication'),'featured toggle did not rebuild');
  assert.ok(!html.research.includes('CMS test research area'),'visible toggle did not rebuild');
  newPaper.visible=false;write('publications','cms-test-paper',newPaper);html=build();
  assert.ok(!html.publications.includes('CMS updated publication'),'publication visible toggle did not rebuild');
  newPaper.visible=true;write('publications','cms-test-paper',newPaper);
  fs.rmSync(path.join(content,'publications','cms-test-paper.json'));
  fs.rmSync(path.join(content,'gallery','cms-test-gallery.json'));
  html=build();
  assert.ok(!html.publications.includes('CMS updated publication'),'deletion did not rebuild');
  assert.ok(!html.activities.includes('id="gallery"'),'Gallery should disappear when the last image is removed');
  console.log('CMS migration and local create/edit/delete/visible/featured/image-path rebuild checks passed.');
}finally{fs.rmSync(temp,{recursive:true,force:true});}
