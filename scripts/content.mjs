import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {isPublicationVisible} from './components.mjs';

export const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const number=value=>Number.isFinite(Number(value))?Number(value):999;
const ordered=(a,b)=>number(a.order)-number(b.order)||a.id.localeCompare(b.id);
const normalize=value=>{
  if (typeof value==='string') return value.startsWith('/assets/')?value.slice(1):value;
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value==='object') return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,normalize(item)]));
  return value;
};

export function loadContent(contentRoot=path.join(defaultRoot,'content')) {
  const single=name=>normalize(read(path.join(contentRoot,name)));
  const collection=name=>{
    const dir=path.join(contentRoot,name);
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter(file=>file.endsWith('.json')).map(file=>{
      const item=normalize(read(path.join(dir,file)));
      return {...item,id:item.id||path.basename(file,'.json')};
    }).filter(item=>item.visible!==false).sort(ordered);
  };
  const site=single('site.json');
  site.seo=Object.fromEntries((site.seoPages??[]).map(entry=>[entry.file,entry]));
  const profile=single('profile.json');
  const pages=Object.fromEntries(['home','research','projects','publications','patents','about','activities','cv'].map(name=>[name,single(`pages/${name}.json`)]));
  const publications=collection('publications');
  const projects=collection('projects');
  const patents=collection('patents');
  const awards=collection('awards');
  const topics=collection('topics');
  const research=collection('research');
  const researchProjects=collection('research-cases');
  const gallery=collection('gallery');
  const featured=publications.filter(p=>p.featured===true&&isPublicationVisible(p)).sort((a,b)=>number(a.featuredOrder)-number(b.featuredOrder)||ordered(a,b)).map(p=>({paper:p.id,project:p.featuredProject,title:p.featuredTitle||p.title,contribution:p.featuredContribution||''}));
  const data={site,profile,pages,publications,projects,patents,awards,topics,research,researchProjects,gallery,featured,scholar:profile.scholar,notes:site.notes,trajectory:pages.about.trajectory};
  // Compatibility while page templates are moved from the old object shape.
  data.pillars=research.filter(item=>['interfaces','memory','integration'].includes(item.id));
  const opto=research.find(item=>item.id==='optoelectronics');
  data.connected={title:opto?.title??'',text:opto?.foundationText??'',papers:opto?.papers??[]};
  data.flexible=research.find(item=>item.id==='flexible')??{};
  data.researchFigures=Object.fromEntries(research.map(item=>[item.id,{image:item.image,alt:item.alt,caption:item.caption}]));
  return data;
}
