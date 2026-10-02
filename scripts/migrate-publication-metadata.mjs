// One-time, non-destructive migration of the existing 21 publication records.
// The original `journal`, `authors`, status, links, and order remain untouched.
import fs from 'node:fs';
import path from 'node:path';
import {defaultRoot} from './content.mjs';

const dir=path.join(defaultRoot,'content','publications');
for(const file of fs.readdirSync(dir).filter(name=>name.endsWith('.json'))){
  const location=path.join(dir,file);
  const original=fs.readFileSync(location,'utf8');
  const p=JSON.parse(original);
  const [name,details='']=String(p.journal||'').split(' · ');
  const match=details.match(/^(\d+)(?:\((\d+)\))?,\s*(.+)$/);
  const tail=match?.[3]||'';
  const range=tail.match(/^(\d+)[–-](\d+)$/);
  const additions={
    journalName:name||'',
    publicationType:'Journal Article',
    publicationStatus:p.status==='In revision'?'In Revision':details==='Early View'?'Early View':'Published',
    publicationDate:'',onlinePublicationDate:'',
    volume:match?.[1]||'',issue:match?.[2]||'',
    startPage:range?.[1]||'',endPage:range?.[2]||'',pages:'',
    articleNumber:match&&!range?tail:'',eLocationId:'',
    doiUrl:'',publisherUrl:'',journalUrl:'',pdfUrl:'',supplementaryUrl:'',
    publisher:'',issn:'',eIssn:'',
    researchCategory:'',keywords:[],relatedResearch:[],relatedProjects:[],
    myAuthorRole:p.type==='first'?'First author':'Co-author',
    firstAuthor:p.type==='first',coFirstAuthor:false,correspondingAuthor:false,coCorrespondingAuthor:false,authorNotes:''
  };
  let changed=false;
  for(const [key,value] of Object.entries(additions)) if(!(key in p)){p[key]=value;changed=true;}
  if(changed) fs.writeFileSync(location,JSON.stringify(p,null,2)+'\n');
}
console.log('Publication metadata migration complete. Existing values were preserved.');
