// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {HEADERS}=require('./security-policy.cjs');
const PUBLIC_FILES=new Set(['index.html','style.css','i18n-es.js','i18n.js','app.js','sprites.js','cinematics.js','game-engine.js','game-view.js','mission-view.js','world-finale.js','campaign.js','knowledge-bank.js','knowledge-ui.js','badge-rewards.js','expertise-score.js','results-rewards.js','save-games.js','console-commands.js','learning-centers.js','learning-curriculum.js','knowledge-lessons.js','street-life.js']);
const TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.wav':'audio/wav','.ico':'image/x-icon'};
function createGameServer({root=__dirname,service}={}){
 const defaults={combatModels:require('./combat-models.json'),abilities:require('./abilities.json')};
 if(!service){const pricing=require('./token-pricing.cjs').createPricing(fetch,{cacheFile:path.join(root,'token-price-cache.json')});service=require('./challenge-policy.cjs').createService(fetch,{stateFile:path.join(root,'.token-riot-save.json'),pricing});}
 const server=http.createServer(async(req,res)=>{
  for(const [name,value] of Object.entries(HEADERS))res.setHeader(name,value);
  const json=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));};
  const port=server.address().port,hosts=['127.0.0.1:'+port,'localhost:'+port];
  if(!hosts.includes(req.headers.host)||req.headers['sec-fetch-site']==='cross-site')return json(403,{error:'Invalid host or request source'});
  if(req.headers.origin&&!hosts.some(host=>req.headers.origin==='http://'+host))return json(403,{error:'Invalid origin'});
  if(req.url==='/api/config'){if(req.method!=='GET')return json(405,{error:'GET required'});return json(200,defaults);}
  if(req.url==='/api/llm'){
   if(req.method!=='POST')return json(405,{error:'POST required'});
   if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']||''))return json(415,{error:'JSON required'});
   const length=Number(req.headers['content-length']);if(Number.isFinite(length)&&length>16000)return json(413,{error:'Request too large'});
   try{const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>16000)return json(413,{error:'Request too large'});chunks.push(chunk);}const body=JSON.parse(Buffer.concat(chunks).toString('utf8'));if(!body||typeof body!=='object'||Array.isArray(body))return json(400,{error:'Invalid request'});if(!['knowledge','collect','wallet','token-wallet','activate','ammo','settle','checkpoint','resume-run'].includes(body.action))return json(400,{error:'AI missions are currently disabled'});const result=await service(body);return json(200,result);}catch(error){return json(error.code?500:400,{error:error.code?'Could not process request':error instanceof SyntaxError?'Invalid JSON':error.message});}
  }
  if(!['GET','HEAD'].includes(req.method))return json(405,{error:'GET or HEAD required'});
  let relative;try{const url=new URL(req.url,'http://localhost');relative=decodeURIComponent(url.pathname).slice(1)||'index.html';}catch{return json(400,{error:'Invalid path'});}
  if(relative.includes('\\')||relative.split('/').some(part=>part.startsWith('.')||!part)||!Object.hasOwn(TYPES,path.extname(relative)))return json(403,{error:'Forbidden'});
  if(!PUBLIC_FILES.has(relative)&&!(/^(assets|qa)\//.test(relative)))return json(403,{error:'Forbidden'});
  const file=path.resolve(root,relative);
  try{const real=await fs.promises.realpath(file);if(!real.startsWith(path.resolve(root)+path.sep))return json(403,{error:'Forbidden'});const data=await fs.promises.readFile(real);res.writeHead(200,{'Content-Type':TYPES[path.extname(real)]||'application/octet-stream','Content-Length':data.length,'Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:data);}catch{return json(404,{error:'Not found'});}
 });
 server.requestTimeout=10000;server.headersTimeout=10000;server.keepAliveTimeout=5000;server.maxHeadersCount=50;
 return server;
}
if(require.main===module)createGameServer().listen(4173,'127.0.0.1',()=>console.log('TOKEN RIOT: http://127.0.0.1:4173'));
module.exports={createGameServer};
