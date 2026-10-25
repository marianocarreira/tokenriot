// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import assert from 'node:assert/strict';
import {MissionBayGame} from './game-engine.js';
function hazard(){const g=new MissionBayGame('Nano','OpenAI',0,2);g.bikeTimer=99;g.bikes=[{x:g.player.x,y:g.player.y,vx:0,hit:new Set()}];return g;}
const hit=hazard();hit.updateBikes(.01);assert.equal(hit.player.hp,50);hit.player.invincible=0;hit.updateBikes(.01);assert.equal(hit.player.hp,50,'one collision per bike per player');
const jump=hazard();jump.player.z=65;jump.updateBikes(.01);assert.equal(jump.player.hp,60,'jump clears the bike');
const guard=hazard();guard.player.guarding=true;guard.updateBikes(.01);assert.equal(guard.player.hp,50,'guard does not block a vehicle');
const warning=new MissionBayGame('Nano','OpenAI',0,2);warning.bikeTimer=0;warning.updateBikes(.01);assert.ok(warning.bikeWarning);assert.equal(warning.bikes.length,0);for(let i=0;i<125;i++)warning.updateBikes(.01);assert.equal(warning.bikes.length,1);assert.ok(warning.bikes[0].vx<0);warning.retry();assert.equal(warning.bikes.length,0);assert.equal(warning.bikeWarning,null);
const other=new MissionBayGame();other.bikeTimer=0;other.updateBikes(1);assert.equal(other.bikeWarning,null);
console.log('PASS Google bike warning, timed crossing, jumping, unguardable collision, single hit and retry cleanup.');
