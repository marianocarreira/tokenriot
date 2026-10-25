// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import assert from 'node:assert/strict';
import {bindTapAdvance} from './tap-advance.js';
let current='title',overlay=false,count=0;const handlers={};
bindTapAdvance({addEventListener:(type,fn)=>handlers[type]=fn},{state:()=>current,blocked:()=>overlay,advance:()=>count++});
const event=(control=false,x=20,y=20)=>({pointerId:1,isPrimary:true,button:0,clientX:x,clientY:y,target:{closest:()=>control?{}:null},preventDefault(){}});
const tap=(control=false)=>{handlers.pointerdown(event(control));handlers.pointerup(event(control));};
tap();assert.equal(count,1,'tap advances title');
current='comic';tap();assert.equal(count,2,'tap advances story');
tap(true);assert.equal(count,2,'controls never advance');
current='arena';tap();assert.equal(count,2,'combat taps do not navigate');
current='comic';overlay=true;tap();assert.equal(count,2,'console taps do not navigate');overlay=false;
handlers.pointerdown(event());handlers.pointerup(event(false,80,80));assert.equal(count,2,'drag does not advance');
handlers.pointerdown(event());handlers.pointercancel();handlers.pointerup(event());assert.equal(count,2,'cancelled touch does not advance');
handlers.pointerdown(event());current='map';handlers.pointerup(event());assert.equal(count,2,'state change during touch does not skip next screen');
tap();assert.equal(count,3);
console.log('PASS tap-to-advance, controls/console exclusion, drag/cancel and transition protection.');
