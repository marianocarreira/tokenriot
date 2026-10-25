// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import assert from 'node:assert/strict';
import {MissionBayGame} from './game-engine.js';
function setup(stage,kind,pose={}){const g=new MissionBayGame('Nano','OpenAI',0,stage);g.hazardTimer=99;Object.assign(g.player,pose);g.hazards=[{kind,x:g.player.x,y:g.player.y,vx:0,leg:0,hit:new Set()}];return g;}
const standing=setup(3,'boomerang');standing.updateStageHazards(.01);assert.equal(standing.player.hp,52);standing.player.invincible=0;standing.updateStageHazards(.01);assert.equal(standing.player.hp,52,'one hit on each pass');standing.hazards[0].leg=1;standing.updateStageHazards(.01);assert.equal(standing.player.hp,44,'return pass can hit again');
const duck=setup(3,'boomerang',{crouching:true});duck.updateStageHazards(.01);assert.equal(duck.player.hp,60);
const guard=setup(3,'boomerang',{guarding:true});guard.updateStageHazards(.01);assert.equal(guard.player.hp,52,'guard does not replace crouching');
const turn=setup(3,'boomerang');turn.hazards[0].x=-121;turn.updateStageHazards(.01);assert.equal(turn.hazards[0].leg,1);assert.ok(turn.hazards[0].vx>0);turn.hazards[0].x=1501;turn.updateStageHazards(.01);assert.equal(turn.hazards.length,0);
for(const [kind,pose,expected] of [['rocket',{},50],['rocket',{crouching:true},60],['tesla',{},52],['tesla',{z:85},60],['tesla',{crouching:true},52]]){const g=setup(4,kind,pose);g.updateStageHazards(.01);assert.equal(g.player.hp,expected,kind+' posture collision');}
const spawn=new MissionBayGame('Nano','OpenAI',0,4);spawn.hazardTimer=0;spawn.updateStageHazards(.01);assert.equal(spawn.hazardWarning.kind,'rocket');for(let n=0;n<130;n++)spawn.updateStageHazards(.01);spawn.hazardTimer=0;spawn.updateStageHazards(.01);assert.equal(spawn.hazardWarning.kind,'tesla');spawn.retry();assert.equal(spawn.hazards.length,0);assert.equal(spawn.hazardWarning,null);
console.log('PASS Meta boomerang round trip and crouch clearance; SpaceX rocket ducking, Tesla jumping, telegraphs and retry cleanup.');

for(const [kind,pose,hp] of [['cart',{},52],['cart',{z:65},60],['van',{},52],['van',{z:90},60],['plane',{},52],['plane',{crouching:true},60]]){const g=setup(5,kind,pose);g.updateStageHazards(.01);assert.equal(g.player.hp,hp,'Amazon '+kind);}
const amazon=new MissionBayGame('Nano','OpenAI',0,5);for(const expected of ['cart','van','plane']){amazon.hazardTimer=0;amazon.updateStageHazards(.01);assert.equal(amazon.hazardWarning.kind,expected);for(let n=0;n<130;n++)amazon.updateStageHazards(.01);}assert.ok(amazon.enemies.every(e=>amazon.enemyKind(e.type).fly===false));console.log('PASS Amazon cart/van jumping, cargo plane crouching and ordered three-hazard rotation.');

for(const [stage,kind,pose,hp] of [[4,'hovercar',{},52],[4,'hovercar',{z:110},60],[6,'dosrun',{},52],[6,'dosrun',{z:75},60]]){const g=setup(stage,kind,pose);g.updateStageHazards(.01);assert.equal(g.player.hp,hp,kind+' clearance');}
for(let stage=0;stage<7;stage++){const g=new MissionBayGame('Nano','OpenAI',0,stage);g.enemies=[];g.spawnPet(stage===6?5:0,g.player.x+220,g.player.y);g.enemies[0].cooldown=0;g.update(.01,{});assert.ok(g.hostile.length>0,'all common enemies can shoot');assert.equal(g.hostile[0].kind,g.projectileFor(g.enemies[0].type));assert.ok(!g.hostile[0].kind.includes('orb'));assert.ok(g.projectileFor(0,true));}
console.log('PASS hovering Roadster and DOS runner clearance; themed projectiles for all seven companies.');
