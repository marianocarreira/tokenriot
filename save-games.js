// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
export const SAVE_GAMES_KEY='tokenriot-save-games-v1';
// Preserve shared players/platforms, Set hit lists and unlimited ammunition.
export function packRun(value){
 const nodes=[],seen=new Map();
 function encode(v){
  if(v===Infinity)return {infinity:1};if(v===-Infinity)return {infinity:-1};
  if(v===undefined)return {missing:true};
  if(v===null||typeof v!=='object')return v;
  if(seen.has(v))return {ref:seen.get(v)};
  const id=nodes.length;seen.set(v,id);nodes.push(null);
  nodes[id]=v instanceof Set?{type:'set',items:[...v].map(encode)}:v instanceof Map?{type:'map',items:[...v].map(([k,x])=>[encode(k),encode(x)])}:Array.isArray(v)?{type:'array',items:v.map(encode)}:{type:'object',items:Object.entries(v).filter(([,x])=>typeof x!=='function').map(([k,x])=>[k,encode(x)])};
  return {ref:id};
 }
 const root=encode(value);return {root,nodes};
}
export function unpackRun(graph){
 if(!graph||!Array.isArray(graph.nodes)||graph.nodes.length>50000)throw Error('Invalid saved game');
 const objects=graph.nodes.map(n=>n?.type==='array'?[]:n?.type==='set'?new Set():n?.type==='map'?new Map():n?.type==='object'?{}:null);
 if(objects.some(x=>!x))throw Error('Invalid saved game');
 function decode(v){if(v===null||typeof v!=='object')return v==='Naxo'?'Nano':v==='Pixy'?'Pili':v;if(Object.hasOwn(v,'ref')){if(!Number.isInteger(v.ref)||v.ref<0||v.ref>=objects.length)throw Error('Invalid saved reference');return objects[v.ref];}if(v.infinity===1)return Infinity;if(v.infinity===-1)return -Infinity;if(v.missing===true)return undefined;throw Error('Invalid saved value');}
 graph.nodes.forEach((node,i)=>{if(!Array.isArray(node.items))throw Error('Invalid saved game');const target=objects[i];for(const item of node.items){if(node.type==='array')target.push(decode(item));else if(node.type==='set')target.add(decode(item));else if(node.type==='map')target.set(decode(item[0]),decode(item[1]));else{const [key,value]=item;if(typeof key!=='string'||['__proto__','constructor','prototype'].includes(key))throw Error('Invalid saved property');target[key]=decode(value);}}});
 return decode(graph.root);
}
export function createSaveGames({storage=localStorage,persist=async value=>storage.setItem(SAVE_GAMES_KEY,value)}={}){
 function list(runId){try{const data=JSON.parse(storage.getItem(SAVE_GAMES_KEY)||'[]');if(!Array.isArray(data))return [];return data.filter(s=>s?.version===1&&Number.isSafeInteger(s.slot)&&s.slot>=1&&typeof s.savedAt==='string'&&typeof s.character==='string'&&typeof s.company==='string'&&['easy','medium','hard'].includes(s.difficulty)&&Number.isInteger(s.stageNumber)&&Number.isInteger(s.zone)&&Number.isFinite(s.tokens)&&s.payload&&[1,2].includes(s.players)).map(s=>({...s,character:s.character==='Naxo'?'Nano':s.character==='Pixy'?'Pili':s.character,runId:typeof s.runId==='string'&&s.runId?s.runId:'legacy-slot-'+s.slot,checkpoint:Number.isSafeInteger(s.checkpoint)&&s.checkpoint>0?s.checkpoint:1})).filter(s=>runId===undefined||s.runId===runId);}catch{return [];}}
 function runs(){const latest=new Map();for(const save of list()){const previous=latest.get(save.runId);if(!previous||save.checkpoint>previous.checkpoint)latest.set(save.runId,save);}return [...latest.values()];}
 return {list,runs,get:slot=>list().find(s=>s.slot===slot),async add(runId,data){if(typeof runId!=='string'||!runId||runId.length>120)throw Error('Invalid saved run');const all=list(),history=all.filter(s=>s.runId===runId),item={...data,version:1,runId,slot:Math.max(0,...all.map(s=>s.slot))+1,checkpoint:Math.max(0,...history.map(s=>s.checkpoint))+1,savedAt:new Date().toISOString()};await persist(JSON.stringify([...all,item]));return item;},async put(slot,data){if(!Number.isInteger(slot)||slot<1||slot>5)throw Error('Invalid save slot');const item={...data,version:1,slot,savedAt:new Date().toISOString()};await persist(JSON.stringify([...list().filter(s=>s.slot!==slot),item].sort((a,b)=>a.slot-b.slot)));return item;}};
}
export function restoreSavedGame(data,Game){
 if(!data||!data.game||![1,2].includes(data.players)||!['easy','medium','hard'].includes(data.difficulty)||!Number.isInteger(data.game.stage)||data.game.stage<0||data.game.stage>11||!['combat','boss','advance'].includes(data.game.phase)||!data.game.player?.loadout||!Array.isArray(data.game.enemies)||!Array.isArray(data.game.learningCenters)||!Array.isArray(data.accounts)||data.accounts.length!==data.players)throw Error('Invalid saved game');
 if(data.players===2&&(!data.game.partner||data.game.players?.[1]!==data.game.partner||data.game.players?.[0]!==data.game.player))throw Error('Invalid saved players');
 if(!Array.isArray(data.playerCompanies)||data.playerCompanies.length!==2||!Array.isArray(data.playerCharacters)||data.playerCharacters.length!==2||!['Nano','Pili'].includes(data.selected)||!Number.isInteger(data.mapIndex)||data.mapIndex!==data.game.stage||!Number.isInteger(data.completedStages)||!Array.isArray(data.introducedStages)||!Number.isInteger(data.arcadeCredits)||!Number.isInteger(data.continuesUsed)||data.accounts.some(a=>!(a.freeUses instanceof Set)||!(a.pendingAmmo instanceof Map)||!(a.pendingActivations instanceof Map)||typeof a.session!=='string'||typeof a.checkpointId!=='string'||typeof a.log!=='string'))throw Error('Invalid saved campaign');
 return Object.setPrototypeOf(data.game,Game.prototype);
}
