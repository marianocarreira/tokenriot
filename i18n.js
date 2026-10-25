// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import './knowledge-bank.js';
import {CURRICULUM_TRANSLATIONS} from './learning-curriculum.js';
import {SPANISH} from './i18n-es.js';
let language='en';try{if(localStorage.getItem('tokenriot-language')==='es')language='es';}catch{}
const languageListeners=new Set();
const translations={...SPANISH,...CURRICULUM_TRANSLATIONS};const phraseMap=new Map(Object.entries(translations));for(const [en,es] of Object.entries(translations))if(/[a-z]/.test(en)&&!phraseMap.has(en.toUpperCase()))phraseMap.set(en.toUpperCase(),es.toUpperCase());
const backslash=String.fromCharCode(92);const escapePattern=s=>Array.from(s,ch=>'.*+?^$()|[]{}'.includes(ch)||ch===backslash?backslash+ch:ch).join('');
const phrasePattern=new RegExp('(?<![\\p{L}\\p{N}_])(?:'+[...phraseMap.keys()].filter(Boolean).sort((a,b)=>b.length-a.length).map(escapePattern).join('|')+')(?![\\p{L}\\p{N}_])','gu');
export function getGameLanguage(){return language;}
export function tr(value){const text=String(value??'');if(language!=='es'||!text)return text;if(text.includes('\n'))return text.split('\n').map(tr).join('\n');if(/^> /.test(text)||/@ai:~/.test(text))return text;return phraseMap.get(text)||text.replace(phrasePattern,match=>phraseMap.get(match));}
export function onGameLanguageChange(listener){languageListeners.add(listener);return ()=>languageListeners.delete(listener);}
export function setGameLanguage(value){if(!['en','es'].includes(value))return false;language=value;try{localStorage.setItem('tokenriot-language',value);}catch{}for(const listener of languageListeners)listener(value);return true;}
const translatedContexts=new WeakSet();
export function localizeCanvas(context){if(!context||translatedContexts.has(context))return context;translatedContexts.add(context);for(const method of ['fillText','strokeText','measureText'])if(typeof context[method]==='function'){const original=context[method];context[method]=function(text,...args){return original.call(this,tr(text),...args);};}return context;}
export function installGameLanguage(doc,canvases=[]){
 for(const canvas of canvases)localizeCanvas(canvas?.getContext?.('2d'));
 const select=doc.querySelector('#game-language');if(select){select.value=language;select.onchange=()=>setGameLanguage(select.value);}
 const originals=new WeakMap(),attributes=new WeakMap();
 const skip=node=>{const el=node.nodeType===1?node:node.parentElement;return !el||el.closest('script,style,textarea,input,code,#combat-log,#combat-prompt,[data-no-translate]');};
 const translateNode=node=>{if(skip(node))return;const previous=originals.get(node),current=node.data;const source=previous&&current===previous.rendered?previous.source:current;const rendered=tr(source);originals.set(node,{source,rendered});if(current!==rendered)node.data=rendered;};
 const translateAttributes=el=>{if(el.nodeType!==1||skip(el))return;let values=attributes.get(el);if(!values){values={};attributes.set(el,values);}for(const attr of ['aria-label','title','alt']){if(!el.hasAttribute(attr))continue;const current=el.getAttribute(attr),previous=values[attr],source=previous&&current===previous.rendered?previous.source:current,rendered=tr(source);values[attr]={source,rendered};if(current!==rendered)el.setAttribute(attr,rendered);}};
 const scan=node=>{if(!node)return;if(node.nodeType===3){translateNode(node);return;}translateAttributes(node);if(!doc.createTreeWalker)return;const walker=doc.createTreeWalker(node,5);let child;while((child=walker.nextNode())){if(child.nodeType===3)translateNode(child);else translateAttributes(child);}};
 const refresh=()=>{if(doc.documentElement)doc.documentElement.lang=language;if(select)select.value=language;scan(doc.body);};
 onGameLanguageChange(refresh);refresh();
 if(typeof MutationObserver!=='undefined'&&doc.body){const observer=new MutationObserver(records=>{for(const record of records){if(record.type==='characterData')translateNode(record.target);else if(record.type==='attributes')translateAttributes(record.target);else for(const node of record.addedNodes)scan(node);}});observer.observe(doc.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','alt']});}
 return refresh;
}
