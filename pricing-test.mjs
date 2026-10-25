// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{REFERENCES,SOURCE,createPricing,calculateEarnings}=require('./token-pricing.cjs'),{createService}=require('./challenge-policy.cjs');
const cacheFile=path.resolve('qa/.price-test-'+process.pid+'.json'),stateFile=path.resolve('qa/.settle-test-'+process.pid+'.json');
try{
 const rows=Object.values(REFERENCES).map(id=>({id,name:id,pricing:{prompt:'0.0000001',completion:'0.0000006'}}));let catalogCalls=0;const pricing=createPricing(async(url)=>{assert.equal(url,SOURCE);catalogCalls++;return {ok:true,json:async()=>({data:rows})};},{cacheFile,now:()=> '2026-10-19T15:00:00.000Z'});
 const quotes=await Promise.all(Object.keys(REFERENCES).map(b=>pricing.quote(b)));assert.equal(catalogCalls,1);assert.equal(quotes.length,10);assert.ok(quotes.every(q=>q.usdPerToken===.0000006&&!q.cached));assert.equal(calculateEarnings(1000000,quotes[0]).usd,.6);assert.equal(calculateEarnings(1,quotes[0]).usd,.0000006);
 const offline=createPricing(async()=>{throw Error('offline');},{cacheFile});assert.equal((await offline.quote('OpenAI')).cached,true);await assert.rejects(createPricing(async()=>{throw Error('offline');}).quote('OpenAI'),/No verified price/);await assert.rejects(pricing.quote('unknown'),/Unsupported/);
 const service=createService(async()=>{throw Error('No model inference');},{stateFile,pricing});
 for(const session of ['austere-run','expensive-run']){await service({session,company:'OpenAI',action:'token-wallet'});await service({session,action:'collect',events:Array.from({length:100},(_,i)=>({id:session+'-'+i,kind:'pet'}))});}
 for(let i=0;i<3;i++)await service({session:'expensive-run',action:'ammo',tier:2,purchaseId:'ammo-pack-'+i});
 await service({session:'expensive-run',action:'activate',ability:'shield',tier:2,stage:0,purchaseId:'shield-buy'});
 const a=(await service({session:'austere-run',action:'settle',company:'Claude'})).result,b=(await service({session:'expensive-run',action:'settle'})).result;assert.equal(a.brand,'OpenAI');assert.equal(a.tokens,100);assert.equal(b.tokens,85);assert.equal(b.earnedTokens,100);assert.equal(b.spentTokens,15);assert.ok(a.usd>b.usd);assert.equal(a.usd,100*.0000006);
 const restored=createService(async()=>{throw Error('No inference');},{stateFile,pricing:{quote(){throw Error('Must not reprice settled run');}}});assert.deepEqual((await restored({session:'austere-run',action:'settle',company:'Claude'})).result,a);await assert.rejects(restored({session:'austere-run',action:'ammo',tier:2,purchaseId:'after-game'}),/complete/);
 console.log('PASS real-price schema/units, ten brand references, verified offline fallback, austerity reward, locked brand, immutable persisted settlement and no model inference.');
}finally{for(const f of [cacheFile,stateFile,stateFile+'.tmp'])if(fs.existsSync(f))fs.unlinkSync(f);}
