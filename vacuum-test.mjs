// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
const base=resolve(process.argv[2]||'.');
const {MissionBayGame,PETS}=await import(pathToFileURL(resolve(base,'game-engine.js')));
const abilities=JSON.parse(await readFile(resolve(base,'abilities.json'),'utf8'));
const models=JSON.parse(await readFile(resolve(base,'combat-models.json'),'utf8'));
const {createOfflineEconomy}=await import(pathToFileURL(resolve(base,'offline-economy.js')));
assert.equal(PETS[1].hp,3,'regular enemy now takes three basic hits instead of two');
const setup=(count=1)=>{const g=new MissionBayGame();g.enemies=[];g.player.invincible=1000;for(let i=0;i<count;i++)g.spawnPet(1,220+i*8,580);assert.equal(g.activateAbility('vacuum'),true);return g;};
const g=setup(4);assert.equal(g.activateAbility('vacuum'),false);g.weapon.tier=1;g.weapon.ammo[1]=8;
g.pressFire();for(let i=0;i<25;i++)g.update(.02,{fire:true});
assert.equal(g.vacuum.captured.length,4);assert.equal(g.enemies.length,0);assert.equal(g.shots.length,0);assert.equal(g.weapon.ammo[1],8,'vacuum never consumes model ammo');assert.equal(g.rewardEvents.length,0);
g.releaseFire();assert.equal(g.shots.length,4);assert.ok(g.shots.every(s=>s.kind==='vacuum'&&s.damage===5));assert.equal(g.rewardEvents.length,4);g.releaseFire();assert.equal(g.shots.length,4,'release launches each captive once');
const overload=setup(6);overload.pressFire();overload.updateVacuum(.2);assert.equal(overload.vacuum,null,'fifth enemy destroys the vacuum');assert.equal(overload.player.hp,54,'overload costs exactly six energy, including during invulnerability');assert.equal(overload.enemies.length,6,'captives escape alive');assert.equal(overload.rewardEvents.length,0);assert.equal(overload.shots.length,0);assert.equal(overload.player.needsFireRelease,true);overload.releaseFire();assert.equal(overload.rewardEvents.length,0,'release after overload does not grant rewards');
const fatal=setup(5);fatal.player.hp=6;fatal.boosts.shield=10;fatal.pressFire();fatal.updateVacuum(.2);assert.equal(fatal.player.hp,0);assert.equal(fatal.phase,'gameover');
const coBlast=setup(5);coBlast.enableCoop();coBlast.pressFire();coBlast.updateVacuum(.2);assert.equal(coBlast.player.hp,54);assert.equal(coBlast.partner.hp,60,'overload only damages its owner');
const combo=setup();combo.pressFire();for(let i=0;i<12;i++)combo.update(.02,{fire:true});assert.equal(combo.phase,'combat','captured enemies keep encounter pending');
combo.spawnPet(0,450,580);combo.releaseFire();for(let i=0;i<40;i++)combo.update(.02,{});assert.equal(combo.rewardEvents.length,2,'thrown enemy defeats another and both rewards are unique');assert.equal(new Set(combo.rewardEvents.map(e=>e.id)).size,2);
const piercing=setup();piercing.pressFire();for(let i=0;i<12;i++)piercing.update(.02,{fire:true});piercing.spawnPet(0,340,580);const tank=piercing.enemies[0];tank.hp=tank.maxHp=30;piercing.releaseFire();for(let i=0;i<30;i++)piercing.update(.01,{});assert.equal(tank.hp,25,'piercing projectile hits each target only once');
const expiry=setup();expiry.pressFire();for(let i=0;i<12;i++)expiry.update(.02,{fire:true});assert.equal(expiry.enemies.length,0);expiry.updateAbilities(25);assert.equal(expiry.vacuum,null);assert.equal(expiry.enemies.length,1);assert.equal(expiry.rewardEvents.length,0,'expiry returns live captives without farming rewards');assert.equal(expiry.player.needsFireRelease,true);
const flying=setup(0);flying.spawnPet(2,420,450);flying.pressFire();for(let i=0;i<45;i++)flying.update(.02,{fire:true});assert.equal(flying.vacuum.captured.length,1,'flying enemies stay pulled into the nozzle');
const boss=setup(0);boss.spawnBoss();boss.boss.x=240;boss.pressFire();for(let i=0;i<20;i++)boss.update(.02,{fire:true});assert.equal(boss.vacuum.captured.length,0,'boss cannot be absorbed');
const retry=setup();retry.pressFire();retry.updateVacuum(.2);retry.retry();assert.equal(retry.vacuum,null);assert.equal(retry.captiveCount,0);assert.equal(retry.rewardEvents.length,0);
const coop=setup(0);coop.enableCoop();coop.partner.x=300;coop.partner.y=580;coop.forPlayer(1,()=>coop.activateAbility('vacuum'));coop.spawnPet(1,350,580);coop.forPlayer(1,()=>{coop.pressFire();coop.updateVacuum(.2);coop.releaseFire();});assert.equal(coop.shots[0].owner,1);assert.equal(coop.rewardEvents[0].owner,1);assert.equal(coop.player.loadout.vacuum.captured.length,0);
const store=new Map(),offline=createOfflineEconomy({abilities,models,prices:{},read:async k=>store.get(k)||null,write:async(k,v)=>store.set(k,v)});
const node=createRequire(import.meta.url)('./challenge-policy.cjs').createService(async()=>{throw Error('No inference');});
for(const service of [offline,node]){const body={session:'vacuum-economy-test'};await service({...body,action:'token-wallet'});await assert.rejects(service({...body,action:'activate',ability:'vacuum',tier:0,stage:0,purchaseId:'vacuum-no-money'}),/Not enough/);await service({...body,action:'collect',events:Array.from({length:25},(_,i)=>({id:'vacuum-coin-'+i,kind:'pet'}))});const receipt=await service({...body,action:'activate',ability:'vacuum',tier:0,stage:0,purchaseId:'vacuum-purchase'});assert.equal(receipt.cost,20);assert.equal(receipt.seconds,25);assert.equal(receipt.free,false);assert.equal(receipt.wallet,5);const again=await service({...body,action:'activate',ability:'vacuum',tier:0,stage:0,purchaseId:'vacuum-purchase'});assert.equal(again.wallet,5);const free=await service({...body,action:'activate',ability:'shield',tier:0,stage:0,purchaseId:'vacuum-free-shield'});assert.equal(free.cost,0,'vacuum does not consume the ordinary free tool');}
console.log('PASS vacuum hold/capture/release, damage, piercing, ownership, expiry, retry, boss immunity and paid/idempotent Node/offline economy.');
