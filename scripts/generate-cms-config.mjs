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
  id:'Stable URL ID',visible:'Show on website',featured:'Feature on homepage',featuredOrder:'Homepage order',order:'Display order',image:'Research or article image',alt:'Image alternative text',imageAlt:'Image alternative text',caption:'Image caption',heroImage:'Home hero image',heroImageAlt:'Home hero image alternative text',portrait:'Profile portrait',portraitAlt:'Portrait alternative text',cv:'CV PDF file',doi:'DOI',doiUrl:'DOI URL (optional override)',publisherUrl:'Publisher URL',journalUrl:'Journal URL',pdfUrl:'PDF URL',supplementaryUrl:'Supplementary information URL',journalName:'Journal',publicationType:'Publication type',publicationStatus:'Publication status',publicationDate:'Publication date',onlinePublicationDate:'Online publication date',volume:'Volume',issue:'Issue',startPage:'Start page',endPage:'End page',pages:'Pages',articleNumber:'Article number',eLocationId:'eLocation ID',publisher:'Publisher',issn:'ISSN',eIssn:'EISSN',researchCategory:'Research category',relatedResearch:'Related research',relatedProjects:'Related projects',myAuthorRole:'My author role',firstAuthor:'First author',coFirstAuthor:'Co-first author',correspondingAuthor:'Corresponding author',coCorrespondingAuthor:'Co-corresponding author',authorNotes:'Author notes',orcid:'ORCID URL',researchGate:'ResearchGate URL',labUrl:'Laboratory URL',advisorUrl:'Advisor URL',externalUrl:'External paper or project URL',year:'Year',type:'Type',status:'Status',journal:'Original journal and citation (preserved)',papers:'Related publication IDs',patents:'Related patent IDs',selectedPapers:'Selected publication IDs',caseStudyId:'Detailed research case ID',homeRole:'Home section placement',homeTitle:'Home research title',homeDescription:'Home research description',homeAnchor:'Project page anchor',featuredContribution:'Featured contribution',featuredTitle:'Featured work title',featuredProject:'Related featured project ID',seoPages:'Page SEO',siteTitle:'Website title',socialPreview:'Social preview image',socialPreviewAlt:'Social preview image alternative text',location:'Location',personalRole:'My role',personalParticipationPeriod:'My participation period',territoryNote:'Patent territory note',numberLabel:'Number label',englishTitle:'English title',number:'Patent number',date:'Date',jurisdiction:'Jurisdictions',authors:'Authors / presenters',inventors:'Inventors',paper:'Publication ID',github:'GitHub URL',scholar:'Google Scholar URL',topics:'Research topics',methods:'Methods',approach:'Scientific approach',outcome:'Finding or current status',prospective:'Future direction (not completed)',country:'Primary country',applicationNumber:'Application number',registrationNumber:'Registration number',applicationDate:'Application date',registrationDate:'Registration date',assignee:'Assignee',program:'Program',fundingAgency:'Funding agency',startDate:'Start date (YYYY-MM)',endDate:'End date (YYYY-MM)',organization:'Organization',department:'Department',conferenceName:'Conference name',presentationType:'Presentation type',shortDescription:'Short description',thumbnail:'Thumbnail',thumbnailAlt:'Thumbnail alternative text',relatedActivity:'Related activity ID',url:'External URL'
};
const longText=new Set(['description','summary','abstract','bio','vision','motivation','current','results','future','question','scope','outcome','approach','foundationText','homeDescription','featuredContribution','researchInterests','sourceNote','territoryNote','biographyExtra','journeyIntro','galleryIntro','galleryEmpty','intro','independence','note','bibliographyAfter']);
const imageKeys=new Set(['image','heroImage','portrait','socialPreview','ogImage','thumbnail']);
const numberKeys=new Set(['order','featuredOrder','year']);
const booleanKeys=new Set(['visible','featured','showPapers','prospective','firstAuthor','coFirstAuthor','correspondingAuthor','coCorrespondingAuthor']);
const choices={
  'publications.type':['first','co'],
  'publications.publicationType':['Journal Article','Review Article','Conference Paper','Book Chapter','Other'],
  'publications.publicationStatus':['Published','Accepted','In Press','ASAP','Early View','Online Published','Manuscript','Submitted','Under Review','In Revision'],
  'publications.myAuthorRole':['First author','Co-first author','Co-author','Corresponding author','Co-corresponding author','Other'],
  'patents.status':['Registered','Application','Pending','Granted','Published'],
  'projects.status':['Ongoing','Completed'],
  'awards.type':['Award','Scholarship','Honor','Fellowship'],
  'conferences.presentationType':['Oral','Poster','Invited','Keynote','Other'],
  'news.type':['News','Media Coverage','Press Release','Interview','Announcement'],
  'projects.category':['independent','government','industry'],
  'research.homeRole':['core','platform','future','none'],
  'gallery.category':['Conference','Research','Collaboration','Award'],
};
const refTargets={'publications.topics':'topics','publications.featuredProject':'projects','publications.relatedResearch':'research','publications.relatedProjects':'projects','research.papers':'publications','research.selectedPapers':'publications','research.relatedProjects':'projects','research-cases.papers':'publications','research-cases.patents':'patents','projects.caseStudyId':'research-cases','projects.relatedPublications':'publications','projects.relatedPatents':'patents','patents.relatedResearch':'research','patents.relatedProject':'projects','patents.relatedPublication':'publications','gallery.relatedActivity':'news'};
const additional={
  publications:{journalName:'',publicationType:'Journal Article',publicationStatus:'Published',publicationDate:'',onlinePublicationDate:'',volume:'',issue:'',startPage:'',endPage:'',pages:'',articleNumber:'',eLocationId:'',doiUrl:'',publisherUrl:'',journalUrl:'',pdfUrl:'',supplementaryUrl:'',publisher:'',issn:'',eIssn:'',researchCategory:'',keywords:[],relatedResearch:[],relatedProjects:[],myAuthorRole:'',firstAuthor:false,coFirstAuthor:false,correspondingAuthor:false,coCorrespondingAuthor:false,authorNotes:'',externalUrl:'',summary:'',abstract:''},
  projects:{image:'',imageAlt:'',externalUrl:'',collaborators:'',program:'',fundingAgency:'',startDate:'',endDate:'',status:'',relatedPublications:[],relatedPatents:[]},
  patents:{country:'',jurisdiction:'',applicationNumber:'',registrationNumber:'',applicationDate:'',registrationDate:'',assignee:'',description:'',externalUrl:'',relatedProject:'',relatedPublication:'',featured:false},
  education:{period:'',degree:'',school:'',gpa:'',honor:'',advisor:'',order:1,visible:true},
  experience:{title:'',type:'',organization:'',department:'',period:'',description:'',url:'',featured:false,visible:true,order:1},
  conferences:{id:'',title:'',conferenceName:'',authors:'',year:2026,date:'',location:'',presentationType:'',description:'',url:'',featured:false,visible:true,order:1},
  news:{id:'',title:'',date:'',type:'',source:'',shortDescription:'',url:'',thumbnail:'',thumbnailAlt:'',featured:false,visible:true,order:1},
  research:{heroImage:'',keywords:[],relatedProjects:[]},
  gallery:{id:'',title:'',category:'',image:'',alt:'',caption:'',location:'',year:'',date:'',relatedActivity:'',order:1,visible:true,featured:false},
  topics:{visible:true,featured:false},
  awards:{type:'',organization:'',date:'',description:'',url:'',featured:false},
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
    if(key==='id') {field.type='string';field.required=true;field.pattern='^[a-z0-9-]+$';field.description='Short English key for links, e.g. new-memory-study. Keep existing keys unchanged.';return field;}
    if(refTargets[qualified]) {field.type='reference';field.options={collection:refTargets[qualified],multiple:Array.isArray(item),value:'{fields.id}',label:'{primary}'};return field;}
    if(choices[qualified]) {field.type='select';field.options={values:choices[qualified]};if(key==='publicationType') field.default='Journal Article';if(key==='publicationStatus') field.default='Published';return field;}
    if(Array.isArray(item)) {
      const sample=item.find(x=>x!==null&&x!==undefined);
      if(sample&&typeof sample==='object') {field.type='object';field.list={collapsible:true};field.fields=fields(mergeValues(item),qualified);}
      else {field.type='string';field.list=true;}
    } else if(item&&typeof item==='object') {field.type='object';field.fields=fields(item,qualified);}
    else if(imageKeys.has(key)) {field.type='image';field.options={media:'images'};}
    else if(scope==='publications'&&['publicationDate','onlinePublicationDate'].includes(key)) {field.type='date';field.default='';field.options={format:'yyyy-MM-dd'};}
    else if(key==='cv') {field.type='file';field.options={media:'documents',extensions:['pdf']};}
    else if(booleanKeys.has(key)||typeof item==='boolean') field.type='boolean';
    else if(numberKeys.has(key)&&scope!=='gallery'||typeof item==='number') field.type='number';
    else if(longText.has(key)||typeof item==='string'&&item.length>125) field.type='text';
    else field.type='string';
    if(key==='visible') field.description='Turn off to hide this item without deleting it.';
    if(key==='featured') field.description='Show this item in a featured area on the home page.';
    if(key==='order'||key==='featuredOrder') field.description='Lower numbers appear first.';
    if(key==='image'||key==='heroImage') field.description='Upload an authorized research image; also fill in the alternative text and caption.';
    if(key==='visible') field.default=true;
    if(key==='publicationType') field.default='Journal Article';
    if(key==='publicationStatus') field.default='Published';
    if(key==='doi') field.description='Enter the DOI only; the site creates https://doi.org/ links automatically.';
    if(key==='journal'&&scope==='publications') field.description='Original combined citation from the CV. Kept for provenance; enter new journal names above.';
    if(key==='status'&&scope==='publications') {field.label='Legacy publication status';field.description='Legacy value kept for existing records. Use Publication status above for new records.';}
    if(key==='type'&&scope==='publications') field.label='Legacy author role';
    return field;
  });
}
const publicationFieldOrder=['title','authors','journalName','publicationType','publicationStatus','year','publicationDate','onlinePublicationDate','volume','issue','startPage','endPage','pages','articleNumber','eLocationId','doi','doiUrl','publisherUrl','journalUrl','pdfUrl','supplementaryUrl','publisher','issn','eIssn','researchCategory','keywords','topics','relatedResearch','relatedProjects','myAuthorRole','firstAuthor','coFirstAuthor','correspondingAuthor','coCorrespondingAuthor','authorNotes','featured','visible','order','id','featuredOrder','featuredTitle','featuredContribution','featuredProject','image','imageAlt','imageCaption','summary','abstract','source','journal','type','status','externalUrl'];
const collection=(name,label,primary)=>{
  const sample=mergeValues([...entries(name),additional[name]??{}]);
  const schema=fields(sample,name);
  if(name==='publications') schema.sort((a,b)=>{
    const ai=publicationFieldOrder.indexOf(a.name),bi=publicationFieldOrder.indexOf(b.name);
    return (ai<0?999:ai)-(bi<0?999:bi);
  });
  for(const key of [primary,...({publications:['authors','year'],projects:['category','period'],patents:['status'],conferences:['conferenceName','year'],gallery:['image','alt'],news:['date'],education:['degree','school']}[name]??[])]){
    const field=schema.find(item=>item.name===key);
    if(field) field.required=true;
  }
  return {name,label,type:'collection',path:`content/${name}`,format:'json',filename:{template:'{fields.id}.json',field:false},view:{primary,fields:[primary,'order','visible'],sort:['order',primary],default:{sort:'order',order:'asc'}},operations:{create:true,rename:false,delete:true},fields:schema};
};
const file=(name,label,relative)=>({name,label,type:'file',path:`content/${relative}`,format:'json',fields:fields(mergeValues([read(relative),name==='profile'?{externalLinks:[{label:'',href:''}]}:{}]),name)});
const config={
  media:[{name:'images',label:'Images',input:'assets',output:'/assets',rename:'safe',categories:['image']},{name:'documents',label:'Documents',input:'assets',output:'/assets',rename:'safe',categories:['document']}],
  content:[
    {name:'site-settings',label:'Site Settings',type:'group',items:[file('site','Navigation & footer','site.json'),file('home','Home page','pages/home.json'),file('cv-page','CV page text','pages/cv.json')]},
    {name:'about-management',label:'About',type:'group',items:[file('profile','Profile','profile.json'),collection('education','Education','degree'),collection('experience','Experience','title'),collection('awards','Awards & Scholarships','title'),file('about-page','About page text','pages/about.json')]},
    {name:'research-management',label:'Research',type:'group',items:[collection('research','Research Areas','displayTitle'),collection('projects','Projects','englishTitle'),collection('research-cases','Research case studies','title'),file('research-page','Research page text','pages/research.json'),file('projects-page','Projects page text','pages/projects.json'),collection('topics','Research topics','label')]},
    {name:'outputs',label:'Publications',type:'group',items:[collection('publications','Papers','title'),collection('patents','Patents','title'),collection('conferences','Conferences','conferenceName'),file('publications-page','Papers page text','pages/publications.json'),file('patents-page','Patents page text','pages/patents.json'),file('conferences-page','Conferences page text','pages/conferences.json')]},
    {name:'activities-management',label:'Activities',type:'group',items:[collection('news','News & Media','title'),collection('gallery','Gallery','title'),file('activities-page','Activities page text','pages/activities.json')]}
  ]
};

// JSON is a strict subset of YAML 1.2. This keeps the generated .pages.yml
// easy to validate with Node, without adding a YAML dependency to the site.
fs.writeFileSync(path.join(root,'.pages.yml'),JSON.stringify(config,null,2)+'\n');
console.log(`Wrote Pages CMS configuration with ${config.content.length} groups and ${config.content.flatMap(group=>group.items).length} editors.`);
