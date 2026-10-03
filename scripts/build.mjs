import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {layout,isUnpublished} from './components.mjs';
import * as pages from './pages.mjs';
import {loadContent} from './content.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const data=loadContent(process.env.SITE_CONTENT_DIR||path.join(root,'content'));
const outputRoot=process.env.SITE_OUTPUT_DIR||root;
fs.mkdirSync(outputRoot,{recursive:true});
for (const image of [...data.publications, ...data.gallery]) {
  if (image.image && !(image.imageAlt || image.alt)) throw new Error('Every research/gallery image needs meaningful alt text.');
}
if (data.profile.portrait && !data.profile.portraitAlt) throw new Error('The portrait needs alt text.');
if (data.profile.heroImage && !data.profile.heroImageAlt) throw new Error('The home research image needs alt text.');
if (data.pages.research.hero.image && !data.pages.research.hero.alt) throw new Error('The research hero image needs alt text.');
for (const project of data.projects) if (project.image && !project.imageAlt) throw new Error(`Project image ${project.id} needs alt text.`);
for (const item of data.news) if (item.thumbnail && !item.thumbnailAlt) throw new Error(`Activity image ${item.id} needs alt text.`);
for (const [name,figure] of Object.entries(data.researchFigures??{})) {
  if (figure.image && !figure.alt) throw new Error(`Research figure ${name} needs alt text.`);
}
for (const item of data.gallery) {
  if (item.image && (!item.title || !item.category)) throw new Error('Each gallery photograph needs a title and category.');
}
for (const item of data.featured) {
  const paper=data.publications.find(p=>p.id===item.paper);
  if (!paper || isUnpublished(paper)) throw new Error(`Featured paper ${item.paper} needs a published record.`);
}
const definitions=[['index.html',pages.home],['about.html',pages.about],['research.html',pages.research],['projects.html',pages.projects],['publications.html',pages.publications],['patents.html',pages.patents],['conferences.html',pages.conferences],['activities.html',pages.activities],['cv.html',pages.cv]];
for (const [file,render] of definitions) {
  const {title,description}=data.site.seo[file];
  const noConferences=file==='conferences.html'&&!data.conferences.length;
  fs.writeFileSync(path.join(outputRoot,file),layout(data,noConferences
    ? {file,title,description,canonical:'publications.html',extraHead:'<meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url=publications.html">',body:'<section class="page-hero shell"><h1>Conferences</h1><a class="text-link" href="publications.html">View publications →</a></section>'}
    : {file,title,description,body:render(data),bodyClass:file==='cv.html'?'cv-page':''}));
}
for (const [file,destination,label] of [['contact.html','index.html#contact','Contact details'],['recognition.html','about.html#recognition','Activities & recognition']]) {
  fs.writeFileSync(path.join(outputRoot,file),layout(data,{file,title:label,description:`Continue to ${label.toLowerCase()} for Min Jong Lee.`,canonical:destination.split('#')[0],extraHead:`<meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url=${destination}">`,body:`<section class="page-hero shell"><h1>${label}</h1><p>This page has moved.</p><a class="text-link" href="${destination}">Continue to ${label.toLowerCase()} →</a></section>`}));
}
fs.writeFileSync(path.join(outputRoot,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+definitions.filter(([file])=>file!=='conferences.html'||data.conferences.length).map(([file])=>`  <url><loc>${data.site.baseUrl}${file==='index.html'?'':file}</loc></url>`).join('\n')+'\n</urlset>\n');
console.log(`Built ${definitions.length} static pages and 2 legacy redirects. No browser-side content rendering required.`);
