// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import assert from 'node:assert/strict';
import {flightFrame,FLIGHT_SECONDS,CHINA_NODES} from './world-finale.js';
const parked=flightFrame(0),climb=flightFrame(1.6),cruise=flightFrame(4.5),approach=flightFrame(8),landed=flightFrame(FLIGHT_SECONDS);
assert.equal(parked.phase,'takeoff');assert.equal(parked.x,940);assert.equal(parked.y,320);assert.ok(climb.width>parked.width);assert.ok(climb.y<parked.y);assert.equal(cruise.phase,'cruise');assert.equal(cruise.sprite,1);assert.equal(approach.phase,'landing');assert.equal(approach.sprite,2);assert.ok(landed.width<approach.width);assert.equal(landed.x,CHINA_NODES[0].x);assert.equal(landed.y,CHINA_NODES[0].y);
for(const boundary of [3.2]){const a=flightFrame(boundary-.0001),b=flightFrame(boundary+.0001);assert.ok(Math.abs(a.x-b.x)<.1&&Math.abs(a.y-b.y)<.1&&Math.abs(a.width-b.width)<.1,'flight must not jump at a phase transition');}
for(let t=0;t<=FLIGHT_SECONDS;t+=.1){const f=flightFrame(t);assert.ok([f.x,f.y,f.width].every(Number.isFinite));assert.ok(f.width>=54&&f.width<=420);assert.ok(f.x>=-240&&f.x<=1500);}
const exit=flightFrame(7.2-.0001),arrival=flightFrame(7.2);assert.ok(exit.x+exit.width/2<0&&arrival.x-arrival.width/2>1280,'camera cut happens only while the plane is off-screen');
console.log('PASS Redmond departure, growing takeoff, continuous takeoff and off-screen ocean/arrival cut, shrinking arrival aligned with first China stage.');
