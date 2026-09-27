import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {layout} from './components.mjs';
import * as pages from './pages.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'content.js'),'utf8'),context);
const data=context.window.SITE_CONTENT;
for (const image of [...data.publications, ...data.gallery]) {
  if (image.image && !(image.imageAlt || image.alt)) throw new Error('Every research/gallery image needs meaningful alt text.');
}
if (data.profile.portrait && !data.profile.portraitAlt) throw new Error('The portrait needs alt text.');
if (data.featured.length < 3) throw new Error('The homepage needs three featured papers.');
for (const item of data.featured.slice(0,3)) {
  const paper=data.publications.find(p=>p.id===item.paper);
  if (!paper || paper.status) throw new Error(`Featured paper ${item.paper} needs a published record.`);
}
const definitions=[
 ['index.html','Interface & Device Physics for Emerging Electronics','Min Jong Lee studies interfaces, defects, ionic motion, and charge transport in emerging electronic devices, spanning memory, optoelectronic, and flexible electronic platforms.',pages.home],
 ['about.html','About','Min Jong Lee is an integrated M.S.–Ph.D. researcher in electronic devices, materials, and interface physics at Korea University.',pages.about],
 ['research.html','Research','Interface and device physics across memory, optoelectronic, and flexible platforms, with integrated electronic systems as a long-term direction.',pages.research],
 ['projects.html','Projects','Independent doctoral research and participation in government-funded and industry–academic R&D programs.',pages.projects],
 ['publications.html','Publications','Publications by Min Jong Lee in memory, interface science, thin-film electronics, organic and hybrid optoelectronics.',pages.publications],
 ['patents.html','Patents & Technology Translation','Registered patents and applications in memory, interfaces, semiconductor devices, and optoelectronics.',pages.patents],
 ['cv.html','Curriculum Vitae','Public academic CV of Min Jong Lee, including education, publications, patents, projects, and recognition.',pages.cv]
];
for (const [file,title,description,render] of definitions) {
  fs.writeFileSync(path.join(root,file),layout(data,{file,title,description,body:render(data),bodyClass:file==='cv.html'?'cv-page':''}));
}
for (const [file,destination,label] of [['contact.html','index.html#contact','Contact details'],['recognition.html','about.html#recognition','Activities & recognition'],['activities.html','about.html#recognition','Activities & recognition']]) {
  const hashRedirect = file==='activities.html' ? `<script>if(location.hash&&location.hash!=='#gallery')location.replace('about.html'+location.hash)</script>` : '';
  fs.writeFileSync(path.join(root,file),layout(data,{file,title:label,description:`Continue to ${label.toLowerCase()} for Min Jong Lee.`,canonical:destination.split('#')[0],extraHead:`${hashRedirect}<meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url=${destination}">`,body:`<section class="page-hero shell"><h1>${label}</h1><p>This page has moved.</p><a class="text-link" href="${destination}">Continue to ${label.toLowerCase()} →</a></section>`}));
}
fs.writeFileSync(path.join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+definitions.map(([file])=>`  <url><loc>https://minjonglee.github.io/${file==='index.html'?'':file}</loc></url>`).join('\n')+'\n</urlset>\n');
console.log(`Built ${definitions.length} static pages and 3 legacy redirects. No browser-side content rendering required.`);
