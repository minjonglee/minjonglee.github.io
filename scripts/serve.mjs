import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {defaultRoot} from './content.mjs';

const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.pdf':'application/pdf','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);
  const file=path.resolve(defaultRoot,'.'+(pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(defaultRoot+path.sep)||!fs.existsSync(file)||fs.statSync(file).isDirectory()) {res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':types[path.extname(file).toLowerCase()]||'application/octet-stream'});
  fs.createReadStream(file).pipe(res);
}).listen(8765,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:8765/'));
