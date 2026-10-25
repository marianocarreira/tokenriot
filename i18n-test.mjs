// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import assert from 'node:assert/strict';
import {KNOWLEDGE_BANK} from './knowledge-bank.js';
import {bookLesson,learningLesson} from './knowledge-lessons.js';
const saved=new Map();globalThis.localStorage={getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)};
const {tr,setGameLanguage,getGameLanguage,installGameLanguage,localizeCanvas}=await import('./i18n.js');
assert.equal(getGameLanguage(),'en');assert.equal(tr('Settings'),'Settings');
let observe;globalThis.MutationObserver=class{constructor(fn){observe=fn;}observe(){}};
const element={nodeType:1,closest:()=>null,hasAttribute:()=>false};
const nodes=['Settings','Save','Easy'].map(data=>({nodeType:3,parentElement:element,data}));
const select={value:'en'},doc={body:element,documentElement:{},querySelector:()=>select,createTreeWalker(){let i=0;return{nextNode:()=>nodes[i++]||null};}};
installGameLanguage(doc);select.value='es';select.onchange();
assert.equal(doc.documentElement.lang,'es');assert.deepEqual(nodes.map(n=>n.data),['Configuración','Guardar','Fácil']);assert.equal(saved.get('tokenriot-language'),'es');
assert.match(tr('Combat paused. Type help, models, t (tools), sa (subagents), s (skills) or salir.'),/pausa/i);
assert.equal(tr('> t vacuum'),'> t vacuum');assert.equal(tr('P1 Nano@ai:~$'),'P1 Nano@ai:~$');
for(let stage=0;stage<12;stage++)for(let i=0;i<3;i++){const l=bookLesson(stage,i);for(const key of ['title','body','exercise'])assert.notEqual(tr(l[key]),l[key],l.id+' '+key);const q=KNOWLEDGE_BANK[stage].questions[i];assert.notEqual(tr(q.prompt),q.prompt);assert.notEqual(tr(q.explanation),q.explanation);for(const option of q.options)if(!['streamText','resizeWindow','paintButton','Streaming'].includes(option))assert.notEqual(tr(option),option);}
for(let stage=0;stage<12;stage++)for(const level of ['easy','medium','hard'])for(let index=0;index<6;index++){const l=learningLesson(stage,level,index);for(const field of ['body','exercise'])assert.notEqual(tr(l[field]),l[field],l.id+' '+field);const q=l.question;assert.notEqual(tr(q.prompt),q.prompt,q.id);assert.notEqual(tr(q.explanation),q.explanation,q.id);}
const calls=[],ctx={fillText:(...a)=>calls.push(a),measureText:t=>({width:t.length})};localizeCanvas(ctx);localizeCanvas(ctx);ctx.fillText('Save',10,20);assert.deepEqual(calls,[['Guardar',10,20]]);assert.equal(ctx.measureText('Save').width,7);
setGameLanguage('en');assert.deepEqual(nodes.map(n=>n.data),['Settings','Save','Easy']);assert.equal(select.value,'en');
nodes[0].data='Back';observe([{type:'characterData',target:nodes[0]}]);setGameLanguage('es');assert.equal(nodes[0].data,'Volver');
const reloaded=await import('./i18n.js?reload-test');assert.equal(reloaded.getGameLanguage(),'es');
console.log('PASS: saved language, reversible dynamic DOM, canvas, commands and all 36 book lessons/quizzes.');
