// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import http from 'node:http';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{createGameServer}=require('./server.cjs');
let calls=0;const server=createGameServer({service:async()=>{calls++;return{wallet:0};}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
const post=(body,headers={})=>fetch(base+'/api/llm',{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body)});
try{
 const home=await fetch(base);assert.equal(home.status,200);assert.match(home.headers.get('content-security-policy'),/script-src 'self'/);assert.equal(home.headers.get('x-content-type-options'),'nosniff');assert.equal(home.headers.get('x-frame-options'),'DENY');
 for(const file of ['/.env.local','/.git/config','/.token-riot-save.json','/server.cjs','/scripts/list_free_models.cjs','/sites/token-riot/site-entry.js','/%2eenv.local','/assets/%2e%2e/%2eenv.local'])assert.ok([403,404].includes((await fetch(base+file)).status),file);
 assert.equal((await fetch(base+'/app.js')).status,200);assert.equal((await fetch(base+'/api/config')).status,200);
 const hostileHost=await new Promise(resolve=>{const request=http.get(base,{headers:{Host:'attacker.example:'+server.address().port}},response=>{response.resume();resolve(response.statusCode);});});assert.equal(hostileHost,403);
 assert.equal((await post({action:'wallet'},{Origin:'https://attacker.example'})).status,403);
 assert.equal((await post({action:'wallet'},{'Sec-Fetch-Site':'cross-site'})).status,403);
 assert.equal((await fetch(base+'/api/llm',{method:'POST',body:'{}'})).status,415);
 assert.equal((await post({action:'generate',config:{endpoint:'http://127.0.0.1:9'}})).status,400);assert.equal(calls,0);
 assert.equal((await post(null)).status,400);assert.equal((await post({data:'x'.repeat(17000)})).status,413);
 assert.equal((await post({action:'wallet',session:'test-session'})).status,200);assert.equal(calls,1);
 console.log('PASS host/origin isolation, CSP/security headers, private path denial, API allowlist, JSON-only requests and body limits.');
}finally{await new Promise(resolve=>server.close(resolve));}
