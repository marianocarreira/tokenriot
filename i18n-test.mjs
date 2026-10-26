// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import assert from 'node:assert/strict';
import {KNOWLEDGE_BANK} from './knowledge-bank.js';
import {bookLesson,learningLesson} from './knowledge-lessons.js';
const saved=new Map();globalThis.localStorage={getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)};
const {tr,setGameLanguage,getGameLanguage,installGameLanguage,localizeCanvas,wrapLocalizedText,GAME_LANGUAGES}=await import('./i18n.js');
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
assert.deepEqual(GAME_LANGUAGES,['en','es','zh']);
const {SPANISH}=await import('./i18n-es.js'),{CHINESE}=await import('./i18n-zh.js');
const {CURRICULUM_TRANSLATIONS,CURRICULUM_CHINESE}=await import('./learning-curriculum.js');
assert.deepEqual(Object.keys(CHINESE).sort(),Object.keys(SPANISH).sort(),'complete game dictionary coverage');
assert.deepEqual(Object.keys(CURRICULUM_CHINESE).sort(),Object.keys(CURRICULUM_TRANSLATIONS).sort(),'complete generated curriculum coverage');
assert.equal(setGameLanguage('zh-CN'),true);assert.equal(getGameLanguage(),'zh');assert.equal(doc.documentElement.lang,'zh-CN');assert.equal(saved.get('tokenriot-language'),'zh');assert.equal(select.value,'zh');
assert.deepEqual(nodes.map(n=>n.data),['返回','保存','简单']);
assert.equal(tr('Settings'),'设置');assert.equal(tr('STAGE 3'),'关卡 3');assert.equal(tr('Save\nBack'),'保存\n返回');
const inserted={nodeType:3,parentElement:element,data:tr('Settings')};nodes.push(inserted);observe([{type:'childList',addedNodes:[inserted]}]);
assert.equal(tr('> t vacuum'),'> t vacuum');assert.equal(tr('P1 Nano@ai:~$'),'P1 Nano@ai:~$');
for(let stage=0;stage<12;stage++)for(let i=0;i<3;i++){const l=bookLesson(stage,i);for(const field of ['title','body','exercise'])assert.match(tr(l[field]),/\p{Script=Han}/u,l.id+' '+field);}
for(let stage=0;stage<12;stage++)for(const level of ['easy','medium','hard'])for(let index=0;index<6;index++){
 const lesson=learningLesson(stage,level,index),question=lesson.question;
 for(const field of ['body','exercise'])assert.match(tr(lesson[field]),/\p{Script=Han}/u,lesson.id+' '+field);
 for(const field of ['prompt','explanation'])assert.match(tr(question[field]),/\p{Script=Han}/u,question.id+' '+field);
 for(const option of question.options)assert.ok(tr(option).length>0);
}
calls.length=0;ctx.font='20px monospace';ctx.fillText('Save',10,20);assert.deepEqual(calls,[['保存',10,20]]);assert.equal(ctx.measureText('Save').width,2);assert.match(ctx.font,/Microsoft YaHei/);
const lines=wrapLocalizedText({measureText:text=>({width:Array.from(text).length})},'This is a fictional showdown. The real victory is cooperation.',10);
assert.ok(lines.length>1);assert.ok(lines.every(line=>Array.from(line).length<=10));assert.equal(lines.join(''),tr('This is a fictional showdown. The real victory is cooperation.'));
const chineseReload=await import('./i18n.js?reload-chinese');assert.equal(chineseReload.getGameLanguage(),'zh');
setGameLanguage('es');assert.deepEqual(nodes.map(n=>n.data),['Volver','Guardar','Fácil','Configuración']);
setGameLanguage('en');assert.deepEqual(nodes.map(n=>n.data),['Back','Save','Easy','Settings']);
assert.equal(setGameLanguage('fr'),false);assert.equal(getGameLanguage(),'en');
saved.set('tokenriot-language','invalid');const invalidReload=await import('./i18n.js?invalid-language');assert.equal(invalidReload.getGameLanguage(),'en');
saved.delete('tokenriot-language');saved.set('token-riot-site-language','zh');const inheritedSiteChoice=await import('./i18n.js?site-language');assert.equal(inheritedSiteChoice.getGameLanguage(),'zh');
saved.set('tokenriot-language','es');const explicitGameChoice=await import('./i18n.js?game-language-priority');assert.equal(explicitGameChoice.getGameLanguage(),'es');saved.delete('token-riot-site-language');
console.log('PASS: English default, persisted en/es/zh choice, reversible dynamic DOM/canvas, CJK wrapping, all original book lessons and 216 curriculum questions.');

setGameLanguage("zh");const keyHint={nodeType:3,parentElement:element,data:"← / A"};nodes.push(keyHint);observe([{type:"childList",addedNodes:[keyHint]}]);assert.equal(keyHint.data,"← / A");setGameLanguage("en");assert.equal(keyHint.data,"← / A");assert.equal(tr("TOKEN RIOT"),"TOKEN RIOT");
