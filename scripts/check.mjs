import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const files=fs.readdirSync(root).filter(f=>f.endsWith('.html'));
const documents=new Map(files.map(f=>[f,fs.readFileSync(path.join(root,f),'utf8')]));
const errors=[];
let checkedLinks=0;
for(const [file,html] of documents) {
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  if(new Set(ids).size!==ids.length) errors.push(`${file}: duplicate IDs`);
  if((html.match(/<h1(?:\s|>)/g)||[]).length!==1) errors.push(`${file}: expected one h1`);
  for(const token of ['<title>','name="description"','rel="canonical"','property="og:image"','<html lang="en"','application/ld+json']) {
    if(!html.includes(token)) errors.push(`${file}: missing ${token}`);
  }
  for(const image of html.matchAll(/<img\s[^>]*>/g)) {
    if(!/\balt="[^"]+"/.test(image[0])) errors.push(`${file}: missing meaningful image alt`);
    if(!/\bwidth=/.test(image[0])||!/\bheight=/.test(image[0])) errors.push(`${file}: missing image dimensions`);
  }
  for(const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const target=match[1];
    if(/^(https?:|mailto:|data:)/.test(target)) continue;
    const [pathname,hash]=target.split('#');
    const destination=pathname||file;
    const absolute=path.resolve(root,destination);
    checkedLinks++;
    if(!absolute.startsWith(root+path.sep)||!fs.existsSync(absolute)) errors.push(`${file}: missing ${target}`);
    else if(hash&&destination.endsWith('.html')) {
      const targetHtml=documents.get(destination);
      if(!targetHtml?.includes(`id="${hash}"`)) errors.push(`${file}: missing fragment ${target}`);
    }
  }
}
const css=fs.readFileSync(path.join(root,'styles.css'),'utf8');
if(!css.includes(':focus-visible')||!css.includes('prefers-reduced-motion')||!css.includes('@media print')) errors.push('Missing accessibility/print styles');
const result={htmlPages:files.length,internalReferences:checkedLinks,errors};
console.log(JSON.stringify(result,null,2));
if(errors.length) process.exitCode=1;
