// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {createOfflineEconomy} from './offline-economy.js';
const require=createRequire(import.meta.url),{createService}=require('./challenge-policy.cjs');
const abilities=JSON.parse(fs.readFileSync('abilities.json')),models=JSON.parse(fs.readFileSync('combat-models.json')),prices=JSON.parse(fs.readFileSync('token-price-cache.json'));
const values=new Map(),read=async key=>values.get(key)||null,write=async(key,value)=>values.set(key,value);
const make=()=>createOfflineEconomy({abilities,models,prices,read,write});
let offline=make();const desktop=createService(async()=>{throw Error('No model calls');},{pricing:{quote:async brand=>({...prices[brand],cached:true})}});
const base={session:'offline-player-one',company:'Claude',stage:1,tier:0};
const sequence=[{action:'token-wallet'},{action:'collect',events:[{id:'boss-funds',kind:'boss'},...Array.from({length:4},(_,i)=>({id:'pet-'+i,kind:'pet'}))]},{action:'activate',ability:'heal',purchaseId:'healing-one'},{action:'activate',ability:'jump',purchaseId:'jump-free-one'},{action:'ammo',tier:2,count:1,purchaseId:'bullet-paid-one'},{action:'ammo',tier:2,count:1,purchaseId:'bullet-paid-one'},{action:'collect',events:[{id:'boss-funds',kind:'boss'}]}];
for(const action of sequence)assert.deepEqual(await offline({...base,...action}),await desktop({...base,...action}));
offline=make();assert.equal((await offline({...base,action:'wallet'})).wallet,6,'reload restores SQLite-style saved balance');
assert.equal((await offline({session:'offline-player-two',company:'OpenAI',action:'token-wallet'})).wallet,0,'P2 is separate');
await assert.rejects(offline({...base,action:'ammo',tier:2,count:1,purchaseId:'bullet-paid-four'}).then(()=>offline({...base,action:'activate',ability:'heal',purchaseId:'heal-insufficient'})),/Not enough/);
await desktop({...base,action:'ammo',tier:2,count:1,purchaseId:'bullet-paid-four'});
assert.deepEqual(await offline({...base,action:'settle'}),await desktop({...base,action:'settle'}));
await assert.rejects(offline({...base,action:'collect',events:[]}),/complete/);
const savedResult=await offline({...base,action:'settle',company:'OpenAI'});assert.equal(savedResult.result.brand,'Claude');
let fail=true;const flaky=createOfflineEconomy({abilities,models,prices,read,write:async(k,v)=>{if(fail)throw Error('Disk full');await write(k,v);}});
await assert.rejects(flaky({session:'failed-disk-test',company:'OpenAI',action:'token-wallet'}),/Disk full/);fail=false;assert.equal((await flaky({session:'failed-disk-test',company:'OpenAI',action:'token-wallet'})).wallet,0);
console.log('PASS offline/mobile parity: individual shots, paid healing, free allowances, independent wallets, reload, immutable results and failed-write recovery.');
