// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import assert from 'node:assert/strict';
import {MissionBayGame} from './game-engine.js';
import {CREDIT_ROLES,DISCLAIMER_LINES,drawFinalBossDialogue} from './world-finale.js';
for(const difficulty of ['easy','medium','hard']){
 const g=new MissionBayGame('Nano','Qwen',4,10,difficulty);assert.equal(g.bosses.length,2);assert.equal(g.enemies.length,0);let direction=1;
 for(let frame=0;frame<6000&&!['victory','gameover'].includes(g.phase);frame++){if(g.player.x>g.gate-140)direction=-1;if(g.player.x<110)direction=1;/* Headless player closes optional practice and releases FIRE. */if(g.learningEvents.length){g.learningEvents.length=0;g.releaseFire();g.player.needsFireRelease=true;}g.update(1/60,{fire:frame%36<33,right:direction===1,left:direction===-1,down:Math.sin(g.time*2)>0,up:Math.sin(g.time*2)<=0});}
 assert.equal(g.phase,'victory',difficulty+' final must be beatable using ordinary shots');assert.ok(g.waterRemaining>0&&g.waterRemaining<10,'water budget has a tight achievable margin');assert.equal(g.rewardEvents.filter(e=>e.kind==='boss').length,2);assert.equal(new Set(g.rewardEvents.map(e=>e.id)).size,2);console.log(difficulty,'final won, water remaining:',g.waterRemaining.toFixed(1));
}
const lose=new MissionBayGame('Pili','Kimi',8,10);lose.player.invincible=1000;for(let f=0;f<2200;f++)lose.update(1/60,{});assert.equal(lose.phase,'gameover');assert.equal(lose.waterRemaining,0);lose.retry();assert.equal(lose.waterRemaining,lose.waterLimit);assert.ok(lose.bosses.every(b=>b.hp===48));
const two=new MissionBayGame('Nano','Qwen',4,10);two.hitEnemy(two.boss,100);two.update(.01,{});assert.notEqual(two.phase,'victory','both rivals must be defeated');assert.equal(two.canActivateAbility('wave'),true,'skills still work against the surviving co-boss');two.hitEnemy(two.coBoss,100);two.update(.01,{});assert.equal(two.phase,'victory');
const support=new MissionBayGame('Nano','Qwen',4,10);support.activateAbility('wave');assert.deepEqual(support.bosses.map(b=>b.hp),[1,1]);support.activateAbility('drone');for(let f=0;f<50;f++)support.update(1/60,{});assert.equal(support.phase,'victory');assert.equal(support.rewardEvents.length,2);
assert.ok(CREDIT_ROLES.length>=10);assert.ok(DISCLAIMER_LINES.some(s=>s.includes('violence')));assert.ok(DISCLAIMER_LINES.some(s=>s.includes('better humanity')));
console.log('PASS final dual-boss balance, water timeout/retry, separate rewards, support attacks, credits and disclaimer.');

const speechGame=new MissionBayGame('Nano','OpenAI',0,10),lines=[],ctx=new Proxy({fillText:(...args)=>lines.push(args)},{get:(o,k)=>o[k]||(()=>{})});speechGame.time=3;drawFinalBossDialogue(ctx,speechGame);assert.equal(lines.at(-1)[0],"It's superintelligence!");speechGame.time=7;drawFinalBossDialogue(ctx,speechGame);assert.equal(lines.at(-1)[0],"It's IA!");speechGame.boss.hp=0;const count=lines.length;drawFinalBossDialogue(ctx,speechGame);assert.equal(lines.length,count,'defeated bosses stop speaking');
