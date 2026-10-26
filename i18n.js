// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import './knowledge-bank.js';
import {CURRICULUM_TRANSLATIONS,CURRICULUM_CHINESE} from './learning-curriculum.js';
import {SPANISH} from './i18n-es.js';
import {CHINESE} from './i18n-zh.js';
export const GAME_LANGUAGES=Object.freeze(['en','es','zh']);
const normalizeLanguage=value=>value==='zh-CN'?'zh':value;
let language='en';try{const saved=normalizeLanguage(localStorage.getItem('tokenriot-language')??localStorage.getItem('token-riot-site-language'));if(GAME_LANGUAGES.includes(saved))language=saved;}catch{}
const languageListeners=new Set();
const backslash=String.fromCharCode(92);const escapePattern=s=>Array.from(s,ch=>'.*+?^$()|[]{}'.includes(ch)||ch===backslash?backslash+ch:ch).join('');
const catalogs={es:{...SPANISH,...CURRICULUM_TRANSLATIONS},zh:{...CHINESE,...CURRICULUM_CHINESE}};
function makeTranslator(entries,reverse=false){
 const map=new Map();for(const [key,value] of entries)if(!reverse||!map.has(key))map.set(key,value);
 if(!reverse)for(const [en,value] of entries)if(/[a-z]/.test(en)&&!map.has(en.toUpperCase()))map.set(en.toUpperCase(),value.toUpperCase());
 const keys=[...map.keys()].filter(key=>key&&(!reverse||/[\p{L}\p{N}]/u.test(key))).sort((a,b)=>b.length-a.length);
 const pattern=new RegExp((reverse?'':'(?<![\\p{L}\\p{N}_])')+'(?:'+keys.map(escapePattern).join('|')+')'+(reverse?'':'(?![\\p{L}\\p{N}_])'),'gu');
 return {map,pattern};
}
const translators=Object.fromEntries(Object.entries(catalogs).map(([locale,catalog])=>[locale,makeTranslator(Object.entries(catalog))]));
// Newly inserted DOM may already contain translated text from an explicit tr().
// Recover its source once so switching languages never accumulates translations.
const reverseTranslators=Object.fromEntries(Object.entries(catalogs).map(([locale,catalog])=>[locale,makeTranslator(Object.entries(catalog).map(([en,value])=>[value,en]),true)]));
function sourceText(value){const text=String(value??'');if(!/[\p{L}\p{N}]/u.test(text))return text;for(const reverse of Object.values(reverseTranslators))if(reverse.map.has(text))return reverse.map.get(text);if(language==='en')return text;const reverse=reverseTranslators[language];return text.replace(reverse.pattern,match=>reverse.map.get(match));}
export function getGameLanguage(){return language;}
export function tr(value){const text=String(value??'');if(language==='en'||!text)return text;if(text.includes('\n'))return text.split('\n').map(tr).join('\n');if(/^> /.test(text)||/@ai:~/.test(text))return text;const {map,pattern}=translators[language];return map.get(text)||text.replace(pattern,match=>map.get(match));}
export function onGameLanguageChange(listener){languageListeners.add(listener);return ()=>languageListeners.delete(listener);}
export function setGameLanguage(value){value=normalizeLanguage(value);if(!GAME_LANGUAGES.includes(value))return false;language=value;try{localStorage.setItem('tokenriot-language',value);}catch{}for(const listener of languageListeners)listener(value);return true;}
const translatedContexts=new WeakSet();
export function localizeCanvas(context){if(!context||translatedContexts.has(context))return context;translatedContexts.add(context);for(const method of ['fillText','strokeText','measureText'])if(typeof context[method]==='function'){const original=context[method];context[method]=function(text,...args){if(language==='zh'&&typeof this.font==='string'&&!this.font.includes('Microsoft YaHei'))this.font+=', "Noto Sans SC", "Microsoft YaHei", "PingFang SC", sans-serif';return original.call(this,tr(text),...args);};}return context;}
export function wrapLocalizedText(context,value,maxWidth){
 const text=tr(value),parts=language==='zh'?text.match(/[\p{Script=Han}]|[^\p{Script=Han}\s]+|\s+/gu)||[]:text.split(/(\s+)/),lines=[];let line='';
 const push=()=>{if(line.trim())lines.push(line.trim());line='';};
 for(const part of parts){if(context.measureText(line+part).width<=maxWidth){line+=part;continue;}push();if(context.measureText(part).width<=maxWidth){line=part.trimStart();continue;}for(const char of part){if(line&&context.measureText(line+char).width>maxWidth)push();line+=char;}}
 push();return lines;
}
export function installGameLanguage(doc,canvases=[]){
 for(const canvas of canvases)localizeCanvas(canvas?.getContext?.('2d'));
 const select=doc.querySelector('#game-language');if(select){select.value=language;select.onchange=()=>setGameLanguage(select.value);}
 const originals=new WeakMap(),attributes=new WeakMap();
 const skip=node=>{const el=node.nodeType===1?node:node.parentElement;return !el||el.closest('script,style,textarea,input,code,#combat-log,#combat-prompt,[data-no-translate]');};
 const translateNode=node=>{if(skip(node))return;const previous=originals.get(node),current=node.data;const source=previous&&current===previous.rendered?previous.source:sourceText(current);const rendered=tr(source);originals.set(node,{source,rendered});if(current!==rendered)node.data=rendered;};
 const translateAttributes=el=>{if(el.nodeType!==1||skip(el))return;let values=attributes.get(el);if(!values){values={};attributes.set(el,values);}for(const attr of ['aria-label','title','alt','placeholder']){if(!el.hasAttribute(attr))continue;const current=el.getAttribute(attr),previous=values[attr],source=previous&&current===previous.rendered?previous.source:sourceText(current),rendered=tr(source);values[attr]={source,rendered};if(current!==rendered)el.setAttribute(attr,rendered);}};
 const scan=node=>{if(!node)return;if(node.nodeType===3){translateNode(node);return;}translateAttributes(node);if(!doc.createTreeWalker)return;const walker=doc.createTreeWalker(node,5);let child;while((child=walker.nextNode())){if(child.nodeType===3)translateNode(child);else translateAttributes(child);}};
 const refresh=()=>{if(doc.documentElement)doc.documentElement.lang=language==='zh'?'zh-CN':language;if(select)select.value=language;scan(doc.body);};
 onGameLanguageChange(refresh);refresh();
 if(typeof MutationObserver!=='undefined'&&doc.body){const observer=new MutationObserver(records=>{for(const record of records){if(record.type==='characterData')translateNode(record.target);else if(record.type==='attributes')translateAttributes(record.target);else for(const node of record.addedNodes)scan(node);}});observer.observe(doc.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','alt','placeholder']});}
 return refresh;
}
