// One-time, non-destructive migration from the original content.js snapshot.
// Refuses to overwrite CMS edits. The original file remains as an audit record.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const target=path.join(root,'content');
if (fs.existsSync(target)) throw new Error('content/ already exists; migration will not overwrite CMS data.');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'content.js'),'utf8'),context);
const old=JSON.parse(JSON.stringify(context.window.SITE_CONTENT));
const mediaPath=value=>{
  if(typeof value==='string') return value.startsWith('assets/')?'/'+value:value;
  if(Array.isArray(value)) return value.map(mediaPath);
  if(value&&typeof value==='object') return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,mediaPath(item)]));
  return value;
};
const write=(relative,value)=>{
  const file=path.join(target,relative);
  fs.mkdirSync(path.dirname(file),{recursive:true});
  fs.writeFileSync(file,JSON.stringify(mediaPath(value),null,2)+'\n');
};
const collection=(folder,items)=>items.forEach((item,index)=>write(`${folder}/${item.id}.json`,{...item,order:item.order??(index+1),visible:item.visible??true,featured:item.featured??false}));

const featuredByPaper=new Map(old.featured.map((item,index)=>[item.paper,{...item,order:index+1}]));
collection('publications',old.publications.map(p=>{
  const feature=featuredByPaper.get(p.id);
  return {...p,featured:!!feature,featuredOrder:feature?.order??999,featuredTitle:feature?.title??'',featuredContribution:feature?.contribution??'',featuredProject:feature?.project??''};
}));
const previewByProject=new Map([
  ['doctoral-ionic-memory',{order:1,category:'Independent research',description:'State formation and low-frequency noise in ion-migration-controlled multilevel memristors.',anchor:'ionic-dynamics'}],
  ['flexible-fpcb',{order:2,category:'Industry–academic R&D',description:'',anchor:'flexible-fpcb'}],
  ['photonic-skin',{order:3,category:'Government-funded R&D',description:'',anchor:'photonic-skin'}]
]);
collection('projects',old.projects.map(p=>{
  const preview=previewByProject.get(p.id);
  return {...p,featured:!!preview,featuredOrder:preview?.order??999,homeCategory:preview?.category??'',homeDescription:preview?.description??'',homeAnchor:preview?.anchor??p.id,caseStudyId:p.id==='doctoral-ionic-memory'?'ionic-dynamics':''};
}));
collection('patents',old.patents);
collection('awards',old.awards.map((a,i)=>({id:`award-${String(i+1).padStart(2,'0')}`,...a})));
collection('topics',old.topics.map((t,i)=>({...t,order:i+1})));
collection('research-cases',old.researchProjects.map((p,i)=>({...p,patents:p.patents.map(index=>old.patents[index]?.id).filter(Boolean),visible:p.id==='ionic-dynamics',order:i+1})));

const research=[
  {
    ...old.pillars.find(p=>p.id==='interfaces'),areaType:'Core science',displayTitle:'Interfaces · Defects · Ions · Transport',homeRole:'core',homeTitle:'Interfaces · Defects · Ions · Transport',homeDescription:'Common questions of interfaces, transport, and reliability across multiple electronic-device platforms.',featured:true,
    paragraphs:[{label:'',text:old.pillars[0].motivation},{label:'Published foundation.',text:old.pillars[0].results},{label:'Methods.',text:old.pillars[0].methods.join(' · ')}],
    links:[{label:'Relevant publications',href:'publications.html'}],showPapers:false
  },
  {
    ...old.pillars.find(p=>p.id==='memory'),areaType:'Device platform',displayTitle:'Memory & reliability',homeRole:'platform',homeTitle:'Memory & reliability',homeDescription:'Memristive switching, state variability, and capacitive-device questions.',featured:true,
    paragraphs:[{label:'',text:old.pillars[1].motivation},{label:'Published work.',text:old.pillars[1].results},{label:'Current research.',text:old.pillars[1].current},{label:'Methods.',text:old.pillars[1].methods.join(' · ')}],
    links:[{label:'Related project',href:'projects.html#ionic-dynamics'}],showPapers:true,selectedPapers:old.pillars[1].papers.slice(0,2)
  },
  {
    id:'optoelectronics',title:old.connected.title,foundationText:old.connected.text,papers:old.connected.papers,areaType:'Device platform',displayTitle:'Optoelectronics & hybrid devices',homeRole:'platform',homeTitle:'Optoelectronics & hybrid devices',homeDescription:'Molecular contacts, photovoltaic devices, and photodetectors.',featured:true,
    question:'How do contacts and traps shape light conversion and detection?',
    paragraphs:[
      {label:'',text:'Organic and hybrid devices provide a continuing platform for examining molecular contacts, thin-film electrodes, and charge-selective interfaces.'},
      {label:'Published work.',text:'First-author papers address self-assembled contacts and ALD oxide electrodes; collaborative work includes photodetectors and hybrid materials.'},
      {label:'Methods.',text:'SAM functionalization · ALD thin films · Interface energetics · Electrical / optical characterization.'},
      {label:'Platforms.',text:'Organic photovoltaics · Photodetectors · Capacitive devices.'}
    ],links:[{label:'Related paper',href:'publications.html#paper-05'}],showPapers:true,selectedPapers:old.connected.papers.slice(0,2)
  },
  {
    ...old.flexible,id:'flexible',areaType:'Device platform',displayTitle:'Flexible & stretchable electronics',homeRole:'platform',homeTitle:'Flexible & stretchable electronics',homeDescription:'Interconnects, stretchable PCBs, and thin films in government and industry R&D.',featured:true,
    paragraphs:[{label:'',text:old.flexible.scope},{label:'',text:'These programs extend my device research toward transport and reliability under mechanical deformation.'}],
    links:[{label:'Flexible interconnects',href:'projects.html#flexible-fpcb'},{label:'Stretchable PCBs',href:'projects.html#stretchable-pcb'}],showPapers:false
  },
  {
    ...old.pillars.find(p=>p.id==='integration'),areaType:'Long-term direction',displayTitle:'Integrated electronic systems',homeRole:'future',homeTitle:'Integrated electronic systems',homeDescription:'Low-temperature electronics · Heterogeneous integration · 3D integration · Device–system co-design',featured:true,
    paragraphs:[{label:'Existing foundation.',text:old.pillars[2].current},{label:'Possible directions.',text:'Low-temperature oxide electronics, heterogeneous and 3D integration, device–system co-design, and integrated memory, sensing, and optoelectronics.'}],
    links:[{label:'Related program',href:'projects.html#ald-electrodes-industry'},{label:'Foundation paper',href:'publications.html#paper-06'}],showPapers:false,prospective:true
  }
].map((item,index)=>({order:index+1,visible:true,...old.researchFigures[item.id],...item}));
collection('research',research);
fs.mkdirSync(path.join(target,'gallery'),{recursive:true});
fs.writeFileSync(path.join(target,'gallery','.gitkeep'),'');

write('profile.json',{...old.profile,scholar:old.scholar,github:'',researchGate:'',externalLinks:[]});
write('site.json',{
  siteTitle:'Min Jong Lee · Electronic Device Research',baseUrl:'https://minjonglee.github.io/',themeColor:'#fafaf8',favicon:'favicon.svg',socialPreview:'assets/social-preview.png',socialPreviewAlt:'Min Jong Lee — Interface and device physics for emerging electronics',
  navigation:[
    {label:'Home',href:'index.html',order:1,visible:true},{label:'About',href:'about.html',order:2,visible:true},{label:'Research',href:'research.html',order:3,visible:true},{label:'Projects',href:'projects.html',order:4,visible:true},{label:'Publications',href:'publications.html',order:5,visible:true},{label:'Patents',href:'patents.html',order:6,visible:true},{label:'Activities',href:'activities.html',order:7,visible:true},{label:'CV',href:'',kind:'cv',order:8,visible:true}
  ],
  footer:{affiliation:'Korea University',department:'School of Electrical Engineering',location:'Seoul, Republic of Korea',copyrightName:'Min Jong Lee',backToTop:'Back to top ↑',links:[{label:'Google Scholar',kind:'scholar'},{label:'AEEL',kind:'lab'},{label:'Activities',href:'activities.html'},{label:'CV',kind:'cv'}]},
  seo:{
    'index.html':{title:'Interface & Device Physics for Emerging Electronics',description:'Min Jong Lee studies interfaces, defects, ionic motion, and charge transport in emerging electronic devices, spanning memory, optoelectronic, and flexible electronic platforms.'},
    'about.html':{title:'About',description:'Min Jong Lee is an integrated M.S.–Ph.D. researcher in electronic devices, materials, and interface physics at Korea University.'},
    'research.html':{title:'Research',description:'Interface and device physics across memory, optoelectronic, and flexible platforms, with integrated electronic systems as a long-term direction.'},
    'projects.html':{title:'Projects',description:'Independent doctoral research and participation in government-funded and industry–academic R&D programs.'},
    'publications.html':{title:'Publications',description:'Publications by Min Jong Lee in memory, interface science, thin-film electronics, organic and hybrid optoelectronics.'},
    'patents.html':{title:'Patents & Technology Translation',description:'Registered patents and applications in memory, interfaces, semiconductor devices, and optoelectronics.'},
    'activities.html':{title:'Activities',description:'Academic recognition and a growing archive of research and conference photographs from Min Jong Lee.'},
    'cv.html':{title:'Curriculum Vitae',description:'Public academic CV of Min Jong Lee, including education, publications, patents, projects, and recognition.'}
  },notes:old.notes
});
const siteFile=path.join(target,'site.json');
const site=JSON.parse(fs.readFileSync(siteFile,'utf8'));
site.seoPages=Object.entries(site.seo).map(([file,entry])=>({file,...entry}));
delete site.seo;
fs.writeFileSync(siteFile,JSON.stringify(site,null,2)+'\n');

write('pages/home.json',{
  hero:{line1:'Interface & device physics',line2Prefix:'for ',accent:'emerging electronics.',deck:'I study interfaces, defects, ionic motion, and charge transport in emerging electronic devices. My research spans memory, optoelectronic, and flexible electronic platforms.',focusCurrentLabel:'Current focus',focusCurrent:'Emerging memory · Device reliability',focusFutureLabel:'Long-term direction',focusFuture:'Integrated electronic systems',affiliation:'Integrated M.S.–Ph.D. researcher · Electrical Engineering, Korea University',actions:[{label:'Research',href:'research.html',arrow:'→'},{label:'Selected work',href:'#featured',arrow:'→'},{label:'CV',href:'',kind:'cv',arrow:'↓'}]},
  research:{title:'Research',moreLabel:'Research in depth',coreLabel:'Core science',futureLabel:'Long-term direction'},
  featured:{title:'Featured work',moreLabel:'All publications'},
  current:{title:'Current research',moreLabel:'View all projects'},
  about:{title:'About',text:'Min Jong Lee is an integrated M.S.–Ph.D. researcher in electrical engineering at Korea University. His first-author work connects molecular interfaces, optoelectronic devices, and emerging memory.',links:[{label:'More about Min Jong Lee',href:'about.html'},{label:'Research activities',href:'activities.html'}]}
});
write('pages/research.json',{
  hero:{kicker:'Research',title:'From interfaces to integrated electronic systems.',description:'My work examines interfaces, defects, ionic dynamics, and charge transport in memory and optoelectronic devices, alongside flexible electronics R&D.'},
  map:{ariaLabel:'Research framework: interface and transport questions inform work across memory and optoelectronic devices; flexible electronics is a parallel research platform. Integrated electronic systems are a long-term direction.',coreLabel:'Core science',coreTitle:'Interfaces · Defects · Ions · Transport',platforms:['Memory & reliability','Optoelectronics & hybrid devices','Flexible & stretchable electronics'],futureLabel:'Long-term direction',futureTitle:'Integrated electronic systems'},selectedPapersHeading:'Selected papers'
});
write('pages/projects.json',{
  hero:{kicker:'Projects',title:'Research programs.',description:'Independent doctoral research and participation in government-funded and industry–academic R&D programs.'},
  groups:[{id:'independent',title:'01 · Independent research',description:''},{id:'government',title:'02 · Government-funded R&D programs',description:'Participation across flexible electronics, sensing, displays, and photovoltaics.'},{id:'industry',title:'03 · Industry–academic R&D programs',description:'Materials and device work with Samsung Electronics.'}],
  note:'Dates above are official program periods; they do not indicate the full length of individual participation.',outputsLabel:'Research outputs from these and related studies → Publications',outputsUrl:'publications.html'
});
write('pages/publications.json',{
  hero:{kicker:'Publications',title:'Publications.',description:'Selected research contributions followed by the complete publication record, organized by year.'},
  selectedTitle:'Selected publications',fullTitle:'Full publication list',fullNote:'Chronological by year · first-author work identified in each entry',manuscriptsTitle:'Manuscripts',manuscriptsKicker:'Work in progress',manuscriptsNote:'A manuscript in revision is distinct from an accepted or published article.',bibliographyAfter:'DOI links are provided where verified; other records link to an explicitly labeled Scholar search.',allFilterLabel:'All'
});
write('pages/patents.json',{
  hero:{kicker:'Intellectual property',title:'Patents & technology translation.',description:'Registered patents and applications connected to electronic materials and devices.'},intro:'Each record lists its legal status, jurisdictions, inventors, and identifier. For multi-jurisdiction applications, a Korean application number identifies the Korean filing only.',registeredTitle:'Registered patents',applicationsTitle:'Applications'
});
write('pages/about.json',{
  field:'Electronic Devices · Materials · Interface Physics',positionLines:['Integrated M.S.–Ph.D. Researcher','School of Electrical Engineering','Korea University'],
  biographyTitle:'Biography',biographyExtra:'My research experience also includes flexible interconnects, stretchable PCB technologies, and durable thin-film systems through government-funded and industry–academic R&D programs.',
  visionTitle:'Research vision',visionLinkLabel:'Explore research',journeyTitle:'Research journey',journeyIntro:'Organic and hybrid devices led to molecular interfaces, defect and ionic physics, and emerging memory. Flexible-device programs broaden this work; integrated electronic systems form a long-term direction.',trajectory:old.trajectory,
  environmentTitle:'Current research environment',independence:'Principal Investigator, Doctoral Research Support Program · Ministry of Education · since September 2026',independentLinkLabel:'Independent research',labLinkLabel:'Visit AEEL',educationTitle:'Education',recognitionTitle:'Selected awards & recognition',recognitionLinkLabel:'All activities',activitiesTitle:'Research & academic life',activitiesIntro:'A record of academic activities, recognition, and research photographs as they become available.',activitiesLinkLabel:'View Activities & Gallery'
});
write('pages/activities.json',{
  hero:{kicker:'Activities',title:'Research beyond the publication record.',description:'Academic recognition, with space for verified photographs of conferences, research, collaborations, and visits.'},
  recognitionTitle:'Awards & academic recognition',fellowshipsTitle:'Scholarships & researcher programs',galleryTitle:'Gallery',galleryIntro:'Conference, laboratory, collaboration, and academic-event photographs will be added as verified images become available.',galleryPlaceholders:['CONFERENCE PHOTO','LAB PHOTO','POSTER PRESENTATION','AWARD PHOTO','RESEARCH VISIT PHOTO'],galleryEmpty:'Event photographs and captions will appear here when supplied.'
});
write('pages/cv.json',{
  downloadLabel:'Download CV (PDF)',updatedPrefix:'Public version · Updated',researchIdentityTitle:'Research identity',researchIdentity:'Interface and device physics for emerging electronics',researchInterests:'Research interests: molecular and thin-film interfaces, defects, ionic dynamics, charge transport, emerging memory, optoelectronics, and flexible-device R&D. Integrated electronic systems are a long-term research direction.',sourceNote:'† Equal contribution; * Corresponding author. Project dates are official program periods, not individual participation dates. The public version omits a phone number and detailed postal address.'
});
console.log('Migrated 21 publications, 9 projects, 8 patents, 6 awards, 5 research cases, 5 research areas, and 5 topics. Original content.js retained.');
