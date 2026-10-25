// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import assert from 'node:assert/strict';
import {joystickVector,bindJoystick} from './joystick.js';
import {MissionBayGame} from '../game-engine.js';
assert.equal(joystickVector(2,2,40).x,0,'dead zone prevents drift');
for(let angle=0;angle<Math.PI*2;angle+=.17){
 const v=joystickVector(Math.cos(angle)*80,Math.sin(angle)*80,40);
 assert.ok(Math.abs(Math.hypot(v.x,v.y)-1)<1e-9);
 assert.ok(Math.abs(Math.atan2(v.y,v.x)-Math.atan2(Math.sin(angle),Math.cos(angle)))<1e-9);
 assert.ok(Math.abs(Math.hypot(v.thumbX,v.thumbY)-40)<1e-9);
}
const slow=joystickVector(20,0,40),fast=joystickVector(40,0,40);
assert.ok(slow.x>0&&slow.x<fast.x,'stick displacement controls speed');
const events={},moves=[],styles={};let active=true;
const stick={addEventListener:(name,fn)=>events[name]=fn,getBoundingClientRect:()=>({left:0,top:0,width:140,height:140}),setPointerCapture(){},classList:{add(){},remove(){}},style:{setProperty:(k,v)=>styles[k]=v}};
const reset=bindJoystick(stick,{playing:()=>active,move:(x,y)=>moves.push([x,y]),navigate(){}});
const event=(id,x,y)=>({pointerId:id,clientX:x,clientY:y,preventDefault(){}});
events.pointerdown(event(1,110,90));assert.ok(moves.at(-1)[0]>0&&moves.at(-1)[1]>0);
events.pointermove(event(2,0,0));assert.ok(moves.at(-1)[0]>0,'second finger does not take over');
events.pointermove(event(1,30,90));assert.ok(moves.at(-1)[0]<0&&moves.at(-1)[1]>0,'continuous direction changes');
events.pointercancel(event(1,30,90));assert.deepEqual(moves.at(-1),[0,0]);assert.equal(styles['--stick-x'],'0px');
events.pointerdown(event(3,90,30));events.lostpointercapture(event(3,90,30));assert.deepEqual(moves.at(-1),[0,0]);reset();
for(const actor of [0,1]){
 const game=new MissionBayGame();game.enableCoop();const player=game.players[actor];player.x=300;player.y=550;
 game.updatePlayer(.05,{moveX:.2,moveY:.4},player);
 assert.ok(Math.abs(player.x-302.45)<1e-9);assert.ok(Math.abs(player.y-553.3)<1e-9);assert.equal(player.face,1);
 game.updatePlayer(.05,{moveX:0,moveY:0},player);assert.ok(Math.abs(player.x-302.45)<1e-9);
 game.updatePlayer(.05,{moveX:-.2,moveY:-.4},player);assert.equal(player.face,-1);
}
console.log('PASS analog angles, variable speed, dead zone, multitouch isolation, release/cancel and both players.');
