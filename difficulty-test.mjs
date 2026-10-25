// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import assert from 'node:assert/strict';
import {MissionBayGame} from './game-engine.js';
import {playerAnimation} from './game-view.js';
for(const difficulty of ['easy','medium','hard']){
 const burst=new MissionBayGame('Nano','OpenAI',0,0,difficulty);for(let i=0;i<180;i++)burst.update(1/60,{fire:true});assert.equal(burst.player.totalShots,3,'holding Space caps firing at three for '+difficulty);burst.update(1/60,{fire:false});for(let i=0;i<60;i++)burst.update(1/60,{fire:true});assert.equal(burst.player.totalShots,6,'release re-arms the next burst');
}
const easy=new MissionBayGame(),medium=new MissionBayGame('Nano','OpenAI',0,0,'medium'),hard=new MissionBayGame('Nano','OpenAI',0,0,'hard');assert.equal(easy.enemies.length,medium.enemies.length);assert.equal(hard.enemies.length,easy.enemies.length+2);assert.ok(easy.enemies.every(e=>e.x>easy.player.x));for(const g of [medium,hard]){assert.ok(g.enemies.some(e=>e.x<g.player.x));assert.ok(g.enemies.some(e=>e.x>g.player.x));g.zone=1;g.player.x=1052;g.spawnWave();assert.ok(g.enemies.some(e=>e.x<g.player.x),'later encounters also flank');}
assert.equal(easy.rules.shotInterval,medium.rules.shotInterval);assert.deepEqual(easy.rules.spread,medium.rules.spread);assert.ok(hard.rules.shotInterval<easy.rules.shotInterval);assert.ok(hard.rules.spread.length>easy.rules.spread.length);assert.ok(new MissionBayGame('Nano','OpenAI',0,0,'hard').enemies[0].maxHp>easy.enemies[0].maxHp);assert.ok(playerAnimation({guarding:true},0).height<195);
assert.equal(new MissionBayGame().platforms.length,0,'climbable objects removed');
const runs=[];
for(const difficulty of ['medium','hard'])for(const stage of [0,1,2,3,4,7,8,9]){
 const g=new MissionBayGame('Pili','Qwen',4,stage,difficulty);let direction=1,retries=0,usedTool=false,usedSkill=false;
 for(let f=0;f<60000&&g.phase!=='victory';f++){
  if(g.phase==='gameover'){retries++;g.retry();}
  if(g.phase==='boss'&&!usedSkill){g.activateAbility('wave');usedSkill=true;}
  if(g.phase==='combat'&&g.player.hp<25&&!usedTool){g.activateAbility('drone');usedTool=true;}
  const input={fire:f%36<33,jump:f%65<34};if(stage===3||stage===4||stage===5||stage===6){const near=g.hazards.filter(h=>Math.abs(h.x-g.player.x)<260&&Math.abs(h.y-g.player.y)<34);input.crouch=near.some(h=>!['tesla','cart','van','hovercar','dosrun'].includes(h.kind));input.jump=near.some(h=>['tesla','cart','van','hovercar','dosrun'].includes(h.kind)&&Math.abs(h.x-g.player.x)<200)||(!g.hazards.some(h=>!['tesla','cart','van','hovercar','dosrun'].includes(h.kind)&&Math.abs(h.x-g.player.x)<600)&&f%65<34);}
  if(!input.crouch&&g.hostile.some(s=>Math.abs(s.x-g.player.x)<95&&Math.abs(s.y-(g.player.y-65))<65)){input.guard=true;input.jump=false;}
  if(g.phase==='advance')input.right=true;
  else{if(g.player.x>g.gate-150)direction=-1;if(g.player.x<g.zone*1050+130)direction=1;input.right=direction===1;input.left=direction===-1;input.down=Math.sin(g.time*2)>0;input.up=!input.down;}
  /* Headless player closes optional practice and releases FIRE. */if(g.learningEvents.length){g.learningEvents.length=0;g.releaseFire();g.player.needsFireRelease=true;}g.update(1/60,input);
 }
 assert.equal(g.phase,'victory',difficulty+' stage '+stage+' must be beatable with actual burst shots');assert.ok(retries<10,difficulty+' stage '+stage+' retries '+retries+' must stay beatable without excessive retries');runs.push({difficulty,stage:stage+1,retries,seconds:Math.round(g.time)});
}
console.log('PASS: three-shot burst/release on all levels, flank positions/counts/HP/fire rates, proportional guard, and sixteen completed Medium/Hard stages:',JSON.stringify(runs));
