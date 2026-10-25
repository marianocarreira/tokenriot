// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import assert from 'node:assert/strict';
import {MissionBayGame} from './game-engine.js';
import {CAMPAIGN_ORDER,nextStage,stageNumber,stageRegion} from './campaign.js';
assert.equal(CAMPAIGN_ORDER.length,12);assert.equal(nextStage(1),11);assert.equal(nextStage(11),2);assert.equal(nextStage(5),6);assert.equal(nextStage(6),7);assert.equal(nextStage(10),null);assert.equal(stageNumber(11),3);assert.equal(stageNumber(5),7);assert.equal(stageNumber(6),8);assert.equal(stageRegion(11),'bay');
for(const difficulty of ['easy','medium','hard']){
 const g=new MissionBayGame('Nano','OpenAI',0,11,difficulty),seen=new Set();let direction=1,retries=0,healingSpent=0;
 for(let f=0;f<50000&&g.phase!=='victory';f++){
  const earned=g.rewardEvents.reduce((sum,event)=>sum+(event.kind==='boss'?10:1),0);if(g.player.hp<=25&&earned-healingSpent>=5&&g.activateAbility('heal'))healingSpent+=5;
  if(g.phase==='gameover'){retries++;assert.ok(retries<=3,'Vercel must be beatable within arcade credits');g.retry();}
  for(const e of g.enemies)seen.add(e.type%5);
  const controls={fire:f%36<33,jump:f%65<34};if(g.hostile.some(s=>Math.abs(s.x-g.player.x)<95&&Math.abs(s.y-(g.player.y-65))<65)){controls.guard=true;controls.jump=false;}
  if(g.phase==='advance')controls.right=true;else{if(g.player.x>g.gate-150)direction=-1;if(g.player.x<g.zone*1050+130)direction=1;controls.right=direction===1;controls.left=direction===-1;controls.down=Math.sin(g.time*2)>0;controls.up=!controls.down;}/* Headless player closes optional practice and releases FIRE. */if(g.learningEvents.length){g.learningEvents.length=0;g.releaseFire();g.player.needsFireRelease=true;}g.update(1/60,controls);
 }
 assert.equal(g.phase,'victory');assert.equal(g.cleared,10);assert.equal(seen.size,5);assert.equal(g.rewardEvents.filter(e=>e.kind==='boss').length,1);assert.equal(new Set(g.rewardEvents.map(e=>e.id)).size,g.rewardEvents.length);assert.equal(g.weapon.tier,0);assert.ok(g.rewardEvents.filter(e=>e.kind==='pet').length>=42);assert.deepEqual(Array.from({length:5},(_,i)=>g.projectileFor(i)),['triangle','leaf','drop','cookie','server']);console.log('PASS Vercel',difficulty,'ten encounters, five themed enemies, Rauch boss, basic-only win, retries:',retries);
}

const {createRequire}=await import('node:module');const {createService}=createRequire(import.meta.url)('./challenge-policy.cjs');const service=createService(async()=>{throw Error('Unexpected LLM call');}),base={session:'vercel-stage-wallet'};await service({...base,action:'token-wallet'});assert.equal((await service({...base,action:'activate',ability:'shield',stage:11,tier:0,purchaseId:'vercel-free-tool'})).cost,0);assert.equal((await service({...base,action:'activate',ability:'wave',stage:11,tier:0,purchaseId:'vercel-free-skill'})).cost,0);console.log('PASS Vercel zero-token free tool/skill allowances.');
