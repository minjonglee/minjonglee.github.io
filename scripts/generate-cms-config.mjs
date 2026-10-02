// Generate the Pages CMS schema from the actual JSON content keys, so editing
// and resaving a migrated record cannot silently discard legacy fields.
import fs from 'node:fs';
import path from 'node:path';
import {defaultRoot} from './content.mjs';

const root=defaultRoot;
const read=relative=>JSON.parse(fs.readFileSync(path.join(root,'content',relative),'utf8'));
const entries=folder=>fs.readdirSync(path.join(root,'content',folder)).filter(file=>file.endsWith('.json')).map(file=>read(`${folder}/${file}`));
const title=key=>key.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/\b\w/g,c=>c.toUpperCase());
const labels={
  id:'Stable URL ID',visible:'Show on website',featured:'Feature on homepage',featuredOrder:'Homepage order',order:'Display order',image:'Research or article image',alt:'Image alternative text',imageAlt:'Image alternative text',caption:'Image caption',heroImage:'Home hero image',heroImageAlt:'Home hero image alternative text',portrait:'Profile portrait',portraitAlt:'Portrait alternative text',cv:'CV PDF file',doi:'DOI',orcid:'ORCID URL',researchGate:'ResearchGate URL',labUrl:'Laboratory URL',advisorUrl:'Advisor URL',externalUrl:'External paper or project URL',year:'Publication or event year',type:'Author role',status:'Publication or legal status',papers:'Related publication IDs',patents:'Related patent IDs',selectedPapers:'Selected publication IDs',caseStudyId:'Detailed research case ID',homeRole:'Home section placement',homeTitle:'Home research title',homeDescription:'Home research description',homeAnchor:'Project page anchor',featuredContribution:'Featured contribution',featuredTitle:'Featured work title',featuredProject:'Related featured project ID',seoPages:'Page SEO',siteTitle:'Website title',socialPreview:'Social preview image',socialPreviewAlt:'Social preview image alternative text',location:'Location',personalRole:'My role',personalParticipationPeriod:'My participation period',territoryNote:'Patent territory note',numberLabel:'Number label',englishTitle:'English title',number:'Patent number',date:'Patent date',jurisdiction:'Jurisdictions',authors:'Authors',inventors:'Inventors',paper:'Publication ID',researchGate:'ResearchGate URL',github:'GitHub URL',scholar:'Google Scholar URL',topics:'Research topics',methods:'Methods',approach:'Scientific approach',outcome:'Finding or current status',prospective:'Future direction (not completed)'
};
const longText=new Set(['description','summary','abstract','bio','vision','motivation','current','results','future','question','scope','outcome','approach','foundationText','homeDescription','featuredContribution','researchInterests','sourceNote','territoryNote','biographyExtra','journeyIntro','galleryIntro','galleryEmpty','intro','independence','note','bibliographyAfter']);
const imageKeys=new Set(['image','heroImage','portrait','socialPreview','ogImage']);
const numberKeys=new Set(['order','featuredOrder','year']);
const booleanKeys=new Set(['visible','featured','showPapers','prospective']);
const choices={
  'publications.type':['first','co'],
  'patents.status':['Registered','Application'],
  'projects.category':['independent','government','industry'],
  'awards.category':['award','fellowship'],
  'research.homeRole':['core','platform','future','none'],
  'gallery.category':['Conference','Research','Collaboration','Award'],
};
const refTargets={'publications.topics':'topics','publications.featuredProject':'projects','research.papers':'publications','research.selectedPapers':'publications','research.relatedProjects':'projects','research-cases.papers':'publications','research-cases.patents':'patents','projects.caseStudyId':'research-cases','projects.relatedPublications':'publications','projects.relatedPatents':'patents','patents.relatedResearch':'research','patents.relatedProject':'projects','patents.relatedPublication':'publications'};
const additional={
  publications:{externalUrl:'',summary:'',abstract:'',volume:'',issue:'',pages:'',keywords:[]},
  projects:{image:'',imageAlt:'',externalUrl:'',collaborators:'',status:'',relatedPublications:[],relatedPatents:[]},
  patents:{assignee:'',description:'',externalUrl:'',relatedProject:'',relatedPublication:'',featured:false},
  research:{heroImage:'',keywords:[],relatedProjects:[]},
  gallery:{id:'',title:'',category:'',image:'',alt:'',caption:'',location:'',year:'',order:1,visible:true,featured:false},
  topics:{visible:true,featured:false},
  awards:{featured:false},
  'research-cases':{featured:false}
};

function mergeValues(values){
  const result={};
  for(const value of values.filter(value=>value&&typeof value==='object'&&!Array.isArray(value))){
    for(const [key,item] of Object.entries(value)){
      if(!(key in result)||result[key]===null||result[key]==='') result[key]=item;
      else if(Array.isArray(item)&&item.length&&(!Array.isArray(result[key])||!result[key].length)) result[key]=item;
      else if(item&&typeof item==='object'&&!Array.isArray(item)&&typeof result[key]==='object') result[key]=mergeValues([result[key],item]);
    }
  }
  return result;
}
function fields(value,scope){
  return Object.entries(value).map(([key,item])=>{
    const qualified=`${scope}.${key}`;
    const field={name:key,label:labels[key]||title(key)};
    if(key==='id') {field.type='string';field.readonly=true;field.description='Stable anchor used by links. New items use the filename if blank.';return field;}
    if(refTargets[qualified]) {field.type='reference';field.options={collection:refTargets[qualified],multiple:Array.isArray(item),value:'{fields.id}',label:'{primary}'};return field;}
    if(choices[qualified]) {field.type='select';field.options={values:choices[qualified]};return field;}
    if(Array.isArray(item)) {
      const sample=item.find(x=>x!==null&&x!==undefined);
      if(sample&&typeof sample==='object') {field.type='object';field.list={collapsible:true};field.fields=fields(mergeValues(item),qualified);}
      else {field.type='string';field.list=true;}
    } else if(item&&typeof item==='object') {field.type='object';field.fields=fields(item,qualified);}
    else if(imageKeys.has(key)) {field.type='image';field.options={media:'images'};}
    else if(key==='cv') {field.type='file';field.options={media:'documents',extensions:['pdf']};}
    else if(booleanKeys.has(key)||typeof item==='boolean') field.type='boolean';
    else if(numberKeys.has(key)&&scope!=='gallery'||typeof item==='number') field.type='number';
    else if(longText.has(key)||typeof item==='string'&&item.length>125) field.type='text';
    else field.type='string';
    if(key==='visible') field.description='Turn off to hide this item without deleting it.';
    if(key==='featured') field.description='Show this item in a featured area on the home page.';
    if(key==='order'||key==='featuredOrder') field.description='Lower numbers appear first.';
    if(key==='image'||key==='heroImage') field.description='Upload an authorized research image; also fill in the alternative text and caption.';
    if(key==='status'&&scope==='publications') field.description='Leave blank for published work; e.g. In revision for a manuscript.';
    return field;
  });
}
const collection=(name,label,primary)=>{
  const sample=mergeValues([...entries(name),additional[name]??{}]);
  const schema=fields(sample,name);
  for(const key of [primary,...({publications:['authors','year'],projects:['category','period'],patents:['status','number'],gallery:['image','alt']}[name]??[])]){
    const field=schema.find(item=>item.name===key);
    if(field) field.required=true;
  }
  return {name,label,type:'collection',path:`content/${name}`,format:'json',filename:{template:'{primary}.json',field:'create'},view:{primary,fields:[primary,'order','visible'],sort:['order',primary],default:{sort:'order',order:'asc'}},operations:{create:true,rename:false,delete:true},fields:schema};
};
const file=(name,label,relative)=>({name,label,type:'file',path:`content/${relative}`,format:'json',fields:fields(mergeValues([read(relative),name==='profile'?{externalLinks:[{label:'',href:''}]}:{}]),name)});
const config={
  media:[{name:'images',label:'Images',input:'assets',output:'/assets',rename:'safe',categories:['image']},{name:'documents',label:'Documents',input:'assets',output:'/assets',rename:'safe',categories:['document']}],
  content:[
    {name:'home-management',label:'Home & profile',type:'group',items:[file('home','Home page','pages/home.json'),file('profile','Profile & contact','profile.json'),file('site','Site settings, menu & footer','site.json')]},
    {name:'research-management',label:'Research & projects',type:'group',items:[collection('research','Research areas','displayTitle'),collection('projects','Projects','englishTitle'),collection('research-cases','Research case studies','title'),file('research-page','Research page text','pages/research.json'),file('projects-page','Projects page text','pages/projects.json')]},
    {name:'outputs',label:'Research outputs',type:'group',items:[collection('publications','Publications','title'),collection('patents','Patents','englishTitle'),collection('topics','Publication topics','label'),file('publications-page','Publications page text','pages/publications.json'),file('patents-page','Patents page text','pages/patents.json')]},
    {name:'about-management',label:'About & activities',type:'group',items:[collection('awards','Awards & programs','englishTitle'),collection('gallery','Gallery photographs','title'),file('about-page','About page text','pages/about.json'),file('activities-page','Activities page text','pages/activities.json'),file('cv-page','CV page text','pages/cv.json')]}
  ]
};

// JSON is a strict subset of YAML 1.2. This keeps the generated .pages.yml
// easy to validate with Node, without adding a YAML dependency to the site.
fs.writeFileSync(path.join(root,'.pages.yml'),JSON.stringify(config,null,2)+'\n');
console.log(`Wrote Pages CMS configuration with ${config.content.length} groups and ${config.content.flatMap(group=>group.items).length} editors.`);
