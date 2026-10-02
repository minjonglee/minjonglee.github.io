import fs from 'node:fs';
import path from 'node:path';
import {defaultRoot} from './content.mjs';

const out=path.join(defaultRoot,'.site');
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
for(const file of fs.readdirSync(defaultRoot)){
  if(file.endsWith('.html')||['styles.css','script.js','favicon.svg','robots.txt','sitemap.xml','.nojekyll'].includes(file)){
    fs.copyFileSync(path.join(defaultRoot,file),path.join(out,file));
  }
}
fs.cpSync(path.join(defaultRoot,'assets'),path.join(out,'assets'),{recursive:true});
console.log(`Staged static site at ${out}`);
