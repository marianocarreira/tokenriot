// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import {gradeKnowledge} from './knowledge-bank.js';
/** Offline equivalent of the Node token service. The store commits before balances are returned. */
export function createOfflineEconomy({abilities,models,prices,read,write,refreshPrices=null}){
 let tail=Promise.resolve();
 async function execute(body){
  const {action,session}=body;
  if(typeof session!=='string'||!/^[-\w]{8,80}$/.test(session))throw Error('Invalid session');
  const key='ledger:'+session,old=await read(key);
  let ledger=old?JSON.parse(old):{wallet:0,starterGranted:false,brand:null,coins:[],purchases:{},freeUses:{}};
  let result;
  if(['checkpoint','resume-run'].includes(action)){
   const id=body.checkpointId;if(typeof id!=='string'||!/^[a-f0-9-]{36}$/i.test(id))throw Error('Invalid checkpoint');
   if(action==='checkpoint'){if(ledger.finalResult)throw Error('This run is complete');const existing=await read('checkpoint:'+id);if(existing){if(JSON.parse(existing).sourceSession!==session)throw Error('Checkpoint already used');}else await write('checkpoint:'+id,JSON.stringify({sourceSession:session,ledger}));return {wallet:ledger.wallet,checkpointId:id};}
   if(old){if(ledger.restoredFrom===id)return {wallet:ledger.wallet};throw Error('Resume requires a new session');}
   const saved=await read('checkpoint:'+id);if(!saved)throw Error('Saved balance is unavailable');const checkpoint=JSON.parse(saved);if(checkpoint.sourceSession!==body.sourceSession)throw Error('Invalid saved balance');ledger=checkpoint.ledger;ledger.restoredFrom=id;await write(key,JSON.stringify(ledger));return {wallet:ledger.wallet};
  }
  if(action==='token-wallet'){
   if(!ledger.brand&&Object.hasOwn(prices,body.company))ledger.brand=body.company;
   ledger.starterGranted=true;result={wallet:ledger.wallet,currency:'tokens'};
  }else if(action==='wallet')return {wallet:ledger.wallet};
  else if(action==='settle'){
   if(ledger.finalResult)return {wallet:ledger.wallet,result:ledger.finalResult};
   if(!ledger.brand)throw Error('No reference brand configured');
   let quote={...prices[ledger.brand],cached:true};
   const saved=await read('prices:'+ledger.brand);if(saved)quote={...JSON.parse(saved),cached:true};
   if(refreshPrices)try{const live=await refreshPrices(ledger.brand,quote);if(live){quote=live;await write('prices:'+ledger.brand,JSON.stringify(live));}}catch{}
   if(!quote.modelId||!Number.isFinite(quote.usdPerToken)||quote.usdPerToken<0||quote.basis!=='completion'||!Number.isFinite(Date.parse(quote.pricedAt)))throw Error('No verified price available');
   const spentTokens=Object.values(ledger.purchases).reduce((sum,p)=>sum+p.cost,0);
   ledger.finalResult={...quote,brand:ledger.brand,tokens:ledger.wallet,usd:ledger.wallet*quote.usdPerToken,spentTokens,earnedTokens:ledger.wallet+spentTokens};
   result={wallet:ledger.wallet,result:ledger.finalResult};
  }else{
   if(ledger.finalResult)throw Error('This run is complete');
   if(action==='knowledge'){
    ledger.knowledge||={};const receipt=gradeKnowledge(body,ledger.knowledge);ledger.knowledge[receipt.key]=receipt.correct||!ledger.knowledge[receipt.key]?.correct?receipt:ledger.knowledge[receipt.key];ledger.wallet+=receipt.reward;result={...receipt,wallet:ledger.wallet};
   }else if(action==='collect'){
    if(!Array.isArray(body.events)||body.events.length>200)throw Error('Invalid coin events');
    const ids=new Set(ledger.coins);
    for(const e of body.events){if(typeof e.id!=='string'||!e.id.trim()||e.id.length>150||!['pet','boss'].includes(e.kind))throw Error('Invalid reward');if(!ids.has(e.id)){ids.add(e.id);ledger.wallet+=e.kind==='boss'?10:1;}}
    ledger.coins=[...ids];result={wallet:ledger.wallet};
   }else if(action==='activate'||action==='ammo'){
    const id=body.purchaseId;if(typeof id!=='string'||!/^[-\w]{8,100}$/.test(id))throw Error('Invalid purchase');
    const previous=ledger.purchases[id];
    if(action==='activate'){
     const spec=Object.hasOwn(abilities,body.ability)?abilities[body.ability]:null;
     if(!spec)throw Error('Unknown ability or invalid purchase');
     if(!ledger.starterGranted)throw Error('Load token balance first');
     if(previous){if(previous.ability!==body.ability)throw Error('Purchase id already used');return {wallet:ledger.wallet,...previous,alreadyCharged:true};}
     const stage=Number.isInteger(body.stage)?body.stage:0;if(stage<0||stage>11)throw Error('Invalid stage');
     const freeKey=stage+':'+spec.group,free=!spec.paidOnly&&body.tier===0&&['tool','skill'].includes(spec.group)&&!ledger.freeUses[freeKey],cost=free?0:spec.cost;
     if(ledger.wallet<cost)throw Error('Not enough tokens. Need '+cost+', balance '+ledger.wallet+'.');
     ledger.wallet-=cost;if(free)ledger.freeUses[freeKey]=true;
     ledger.purchases[id]={ability:body.ability,cost,free:!!free,seconds:spec.seconds,purchaseId:id};
    }else{
     const tier=Number(body.tier),spec=models.tiers[tier],count=body.count===undefined?1:body.count;
     if(![1,2].includes(tier)||!spec)throw Error('Invalid projectile purchase');
     if(!Number.isInteger(count)||count<1||count>4)throw Error('Invalid projectile count');
     if(previous){if(previous.type!=='ammo'||previous.tier!==tier||previous.shots!==count)throw Error('Purchase id already used');return {wallet:ledger.wallet,...previous,alreadyCharged:true};}
     const cost=spec.cost*count;if(ledger.wallet<cost)throw Error('Not enough tokens for this projectile');
     ledger.wallet-=cost;ledger.purchases[id]={type:'ammo',tier,cost,shots:count,purchaseId:id};
    }
    result={wallet:ledger.wallet,...ledger.purchases[id]};
   }else throw Error('AI missions are currently disabled');
  }
  await write(key,JSON.stringify(ledger));return result;
 }
 return body=>{const task=tail.then(()=>execute(body));tail=task.catch(()=>{});return task;};
}
