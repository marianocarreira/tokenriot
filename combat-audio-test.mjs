// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {MissionBayGame} from './game-engine.js';
const hurt=new MissionBayGame();hurt.damagePlayer(6);assert.equal(hurt.soundEvents.filter(e=>e.type==='hurt').length,1);hurt.damagePlayer(6);assert.equal(hurt.soundEvents.filter(e=>e.type==='hurt').length,1,'invincible hit does not repeat ouch');
const block=new MissionBayGame();block.player.guarding=true;block.damagePlayer(7,true);assert.equal(block.soundEvents[0].type,'block');assert.ok(Math.abs(block.player.hp-59.93)<.001);
const fire=new MissionBayGame();for(let n=0;n<100;n++)fire.update(1/60,{fire:true});assert.equal(fire.player.totalShots,3);assert.equal(fire.soundEvents.filter(e=>e.type==='player-shot').length,1,'one intermittent effect per three-shot burst');
const pop=new MissionBayGame();const e={...pop.enemies[0],x:300,y:580,hp:1,maxHp:1};pop.enemies=[e];pop.shots=[{x:300,y:533,vx:0,vy:0,life:1}];pop.update(.01,{});assert.equal(pop.blobExplosions.length,1);assert.equal(pop.soundEvents.filter(e=>e.type==='blob').length,1);pop.updateParticles(.7);assert.equal(pop.blobExplosions.length,0,'blob animation expires');pop.blobPop(300,500,'#fff');pop.retry();assert.equal(pop.blobExplosions.length,0);assert.equal(pop.soundEvents.length,0);
const manifest=JSON.parse(fs.readFileSync('assets/rock-audio-manifest.json','utf8'));assert.equal(manifest.length,16);for(const entry of manifest){const bytes=fs.readFileSync('assets/'+entry.file);assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WAVE');assert.ok(bytes.length>1000);assert.ok(entry.peak<=.98);}
console.log('PASS damage/guard audio events, intermittent fire, single blob on defeat, effect cleanup and sixteen valid audio files.');
