// One-time migration: preserve the published Papers order with internal sort
// keys, and use the displayed legal date for each existing patent filing.
// This script never overwrites a sortDate that an editor has already set.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {defaultRoot,loadContent} from './content.mjs';
import {isPublicationVisible,patentRecordDate} from './components.mjs';

const content=path.join(defaultRoot,'content');
const data=loadContent(content);
const byLegacyPaperOrder=(a,b)=>Number(b.year)-Number(a.year)
  ||String(b.publicationDate||b.onlinePublicationDate||'').localeCompare(String(a.publicationDate||a.onlinePublicationDate||''))
  ||Number(a.order??999)-Number(b.order??999)
  ||a.id.localeCompare(b.id);
const papers=[...data.publications].filter(isPublicationVisible).sort(byLegacyPaperOrder);
const expected=[...fs.readFileSync(path.join(defaultRoot,'publications.html'),'utf8').matchAll(/class="publication-item" id="([^"]+)"/g)].map(match=>match[1]);
assert.deepEqual(papers.map(p=>p.id),expected,'Legacy Papers order differs from the generated public page');

const yearPositions=new Map();
for(const paper of papers){
  const index=yearPositions.get(paper.year)||0;
  yearPositions.set(paper.year,index+1);
  const file=path.join(content,'publications',`${paper.id}.json`);
  const record=JSON.parse(fs.readFileSync(file,'utf8'));
  if(record.sortDate) continue;
  assert.ok(index<31,`Too many historical papers in ${paper.year} for this one-time migration`);
  // This is an ordering key, not a claim about the article's publication date.
  record.sortDate=`${paper.year}-01-${String(31-index).padStart(2,'0')}`;
  fs.writeFileSync(file,JSON.stringify(record,null,2)+'\n');
}
for(const patent of data.patents){
  const file=path.join(content,'patents',`${patent.id}.json`);
  const record=JSON.parse(fs.readFileSync(file,'utf8'));
  if(record.sortDate) continue;
  const date=patentRecordDate(record);
  assert.match(date,/^\d{4}-\d{2}-\d{2}$/,`Patent ${patent.id} needs a legal date`);
  record.sortDate=date;
  fs.writeFileSync(file,JSON.stringify(record,null,2)+'\n');
}
console.log(`Migrated ${papers.length} paper and ${data.patents.length} patent sort dates; existing editor values were preserved.`);
