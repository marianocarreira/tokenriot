// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import assert from 'node:assert/strict';
import {rewardValuation,drawRewardShowcase} from './results-rewards.js';
const solo={tokens:26,usdPerToken:.0000006,brand:'OpenAI',badgeBonus:850,score:876,badgeCount:3,badges:[{mark:'OP',level:'easy'}]};
assert.equal(rewardValuation(solo).usd,26*.0000006,'spendable coins alone determine money');
assert.equal(rewardValuation({...solo,usd:99999}).usd,26*.0000006,'valuation is explicitly coins times rate');
const coop=rewardValuation({players:[{...solo,tokens:20},{...solo,tokens:6,usdPerToken:.000001,brand:'Claude'}]});assert.equal(coop.tokens,26);assert.equal(coop.usd,20*.0000006+6*.000001,'each player keeps their own provider rate');
for(const bad of [{tokens:2},{tokens:-2,usdPerToken:1},{tokens:2,usdPerToken:NaN}])assert.equal(rewardValuation(bad),null);
assert.equal(rewardValuation({tokens:26,usdPerToken:0}).usd,0,'free model pricing is valid');
const text=[],gradient={addColorStop(){}},ctx=new Proxy({fillText:(s)=>text.push(s),createLinearGradient:()=>gradient,createRadialGradient:()=>gradient},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
drawRewardShowcase(ctx,2,solo);assert.ok(text.includes('CONGRATULATIONS!'));assert.ok(text.includes('26 × $0.00000060 = $0.00001560 USD'));assert.ok(text.includes('$0.00001560 USD'));assert.ok(text.includes('EXPERTISE BONUS +850'));text.length=0;drawRewardShowcase(ctx,2,solo,true);assert.ok(text.includes('Calculating estimated value...'));assert.ok(!text.some(s=>String(s).includes('0.00001560')),'pending quote never invents an estimate');
console.log('PASS explicit coin valuation, solo/co-op rates, invalid/free quotes and green results content.');
