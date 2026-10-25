// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import assert from 'node:assert/strict';
import {MissionBayGame,PETS} from './game-engine.js';
import {CAMPAIGN_ORDER,stageNumber} from './campaign.js';
const campaign=[];
for(const stage of CAMPAIGN_ORDER.filter(id=>id!==10)){
 const game=new MissionBayGame('Pili','Grok',7,stage),seen=new Set();let direction=1,retries=0,sawBoss=false,advances=0,lastClear=0,usedTool=false,usedSkill=false,healingSpent=0;
 for(let frame=0;frame<42000&&game.phase!=='victory';frame++){
  for(const e of game.enemies)seen.add(e.type);
  if(game.phase==='gameover'){retries++;assert.ok(retries<6,'stage '+stage+' must be completable without excessive retries');game.retry();}
  if(game.phase==='boss'&&!usedSkill){game.activateAbility('wave');usedSkill=true;}
  if(game.phase==='combat'&&game.player.hp<25&&!usedTool){game.activateAbility('drone');usedTool=true;}
  const earned=game.rewardEvents.reduce((sum,event)=>sum+(event.kind==='boss'?10:1),0);if(game.player.hp<=25&&earned-healingSpent>=5&&game.activateAbility('heal'))healingSpent+=5;
  let input={fire:frame%36<33};if(stage===3||stage===4||stage===5||stage===6){const near=game.hazards.filter(h=>Math.abs(h.x-game.player.x)<260&&Math.abs(h.y-game.player.y)<34);input.crouch=near.some(h=>!['tesla','cart','van','hovercar','dosrun'].includes(h.kind));input.jump=near.some(h=>['tesla','cart','van','hovercar','dosrun'].includes(h.kind)&&Math.abs(h.x-game.player.x)<200)||(!game.hazards.some(h=>!['tesla','cart','van','hovercar','dosrun'].includes(h.kind)&&Math.abs(h.x-game.player.x)<600)&&frame%65<34);}if(stage===2)input.jump=game.bikes.some(b=>Math.abs(b.x-game.player.x)<230&&Math.abs(b.y-game.player.y)<34);
  if(game.phase==='advance')input.right=true;
  else if(game.phase==='boss'){
   sawBoss=true;const start=game.zone*1050;if(game.player.x>game.gate-140)direction=-1;if(game.player.x<start+110)direction=1;input.right=direction===1;input.left=direction===-1;input.down=Math.sin(game.time*2)>0;input.up=!input.down;
  }else{input.down=Math.sin(game.time*2.4)>0;input.up=!input.down;}
  /* Headless player closes optional practice and releases FIRE. */if(game.learningEvents.length){game.learningEvents.length=0;game.releaseFire();game.player.needsFireRelease=true;}game.update(1/60,input);if(game.cleared!==lastClear){advances++;lastClear=game.cleared;}
 }
 assert.equal(game.phase,'victory','every stage must be completable through actual projectiles/collisions');assert.equal(game.cleared,10);assert.equal(advances,10);assert.equal(game.zone,10);assert.ok(sawBoss);assert.equal(game.boss.hp,0);assert.equal(seen.size,PETS.length);
 assert.equal(game.rewardEvents.filter(e=>e.kind==='boss').length,1);assert.equal(new Set(game.rewardEvents.map(e=>e.id)).size,game.rewardEvents.length,'each defeated enemy drops a unique coin event');
 campaign.push({stage:stageNumber(stage),seconds:Math.round(game.time),retries,encounters:advances,health:game.player.hp});
}
const idle=new MissionBayGame();for(let i=0;i<5000;i++)idle.update(1/60,{});assert.equal(idle.phase,'gameover');idle.retry();assert.equal(idle.player.hp,60);assert.equal(idle.phase,'combat');
const gate=new MissionBayGame();for(let i=0;i<240;i++)gate.update(1/60,{right:true});assert.equal(gate.zone,0,'cannot bypass a live encounter');assert.ok(gate.player.x<gate.gate);
console.log('PASS full eleven-company-stage campaign with real combat, 110 encounters / 11 bosses:',JSON.stringify(campaign));

const coop=new MissionBayGame('Nano','OpenAI',0,5);coop.enableCoop('Nano');assert.equal(coop.partner.variant,1);const start=coop.partner.x;for(let n=0;n<30;n++)coop.update(1/60,{}, {right:true,fire:true});assert.ok(coop.partner.x>start);assert.equal(coop.partner.totalShots,3);assert.equal(coop.player.totalShots,0);coop.partner.guarding=true;coop.damagePlayer(7,true,coop.partner);assert.ok(Math.abs(coop.partner.hp-59.93)<.001);assert.equal(coop.player.hp,60);console.log('PASS shared-world cooperative player movement, separate burst and guarded damage.');

// All diagonal combinations work for both players, including partial release.
for(const horizontal of ['left','right'])for(const vertical of ['up','down']){
 const g=new MissionBayGame();g.enableCoop();
 for(const p of g.players){p.x=300;p.y=550;const x=p.x,y=p.y;
  g.updatePlayer(.05,{[horizontal]:true,[vertical]:true},p);
  assert.equal(Math.sign(p.x-x),horizontal==='right'?1:-1);
  assert.equal(Math.sign(p.y-y),vertical==='down'?1:-1);
  assert.ok(Math.abs(Math.hypot((p.x-x)/245,(p.y-y)/165)-.05)<1e-9,'diagonal speed is normalized');
  const afterY=p.y;g.updatePlayer(.05,{[horizontal]:true},p);assert.equal(p.y,afterY);
 }
}
console.log('PASS four diagonals, normalized speed and partial release for both players.');
