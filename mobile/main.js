// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import {bindJoystick} from './joystick.js';
import {bindTapAdvance} from './tap-advance.js';
import {Capacitor,registerPlugin} from '@capacitor/core';
import {createOfflineEconomy} from '../offline-economy.js';
import abilities from '../abilities.json';
import combatModels from '../combat-models.json';
import prices from '../token-price-cache.json';
const native=Capacitor.isNativePlatform();
const Store=registerPlugin('TokenRiotStore');
const read=async key=>native?(await Store.get({key})).value:localStorage.getItem('mobile:'+key);
const write=async(key,value)=>{if(native)await Store.set({key,value});else localStorage.setItem('mobile:'+key,value);};
const originalFetch=window.fetch.bind(window);
const service=createOfflineEconomy({abilities,models:combatModels,prices,read,write,refreshPrices:async(brand,quote)=>{
 const r=await originalFetch('https://openrouter.ai/api/v1/models',{signal:AbortSignal.timeout(3500)});if(!r.ok)throw Error('offline');
 const data=await r.json(),model=data.data?.find(m=>m.id===quote.modelId),rate=Number(model?.pricing?.completion);
 if(!model||!Number.isFinite(rate)||rate<0)throw Error('unavailable');return {...quote,modelName:model.name,usdPerToken:rate,pricedAt:new Date().toISOString(),cached:false};
}});
window.fetch=async(url,options)=>{
 const pathname=typeof url==='string'?url:new URL(url.url).pathname;
 if(pathname==='/api/config')return new Response(JSON.stringify({abilities,combatModels}),{headers:{'Content-Type':'application/json'}});
 if(pathname==='/api/llm')try{return new Response(JSON.stringify(await service(JSON.parse(options.body))),{headers:{'Content-Type':'application/json'}});}catch(error){return new Response(JSON.stringify({error:error.message}),{status:400,headers:{'Content-Type':'application/json'}});}
 return originalFetch(url,options);
};
async function boot(){
 document.body.classList.add('mobile-app');
 for(const key of ['tokenriot-save-games-v1']){const value=await read(key);if(value)localStorage.setItem(key,value);}
 const savedLanguage=await read('language');if(savedLanguage)localStorage.setItem('tokenriot-language',savedLanguage);
 const saved=await read('controls');if(saved)localStorage.setItem('tokenriot-controls',saved);
 const setItem=Storage.prototype.setItem;
 Storage.prototype.setItem=function(key,value){setItem.call(this,key,value);if(this===localStorage&&['tokenriot-controls','tokenriot-language'].includes(key))write(key==='tokenriot-controls'?'controls':'language',value).catch(showStorageError);};
 window.tokenRiotSaveStorage=async value=>{await write('tokenriot-save-games-v1',value);localStorage.setItem('tokenriot-save-games-v1',value);};
 await import('../app.js');
 const playerMode=document.querySelector('#player-count');playerMode.value='1';playerMode.querySelector('option[value="2"]')?.remove();playerMode.disabled=true;playerMode.closest('label').hidden=true;
 const bar=document.createElement('div');bar.id='touch-controls';bar.setAttribute('aria-label','Touch game controls');
 bar.innerHTML='<div class="touch-stick" role="group" aria-label="Movement joystick"><span class="stick-ring"></span><span class="stick-thumb"></span></div><div class="touch-actions"><button data-action="jump" aria-label="Jump"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20V5m-6 6 6-6 6 6M5 21h14"/></svg></button><button data-action="crouch" aria-label="Crouch"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="2"/><path d="m10 10 4 3-5 3 5 4m-9 0h14M10 10l-4 4m8-1 5-3"/></svg></button><button data-action="guard" aria-label="Guard"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 8 3v5c0 5-4 8-8 10-4-2-8-5-8-10V6l8-3Z"/><path d="m8 12 3 3 5-6"/></svg></button><button data-action="fire" class="fire" aria-label="Fire"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 1v5m0 12v5M1 12h5m12 0h5"/></svg></button></div><button id="learning-open" class="learning-open" aria-label="Open Learning Center" hidden>V</button><div class="touch-menu"><button data-key="Escape" aria-label="Go back">BACK</button></div>';
 document.querySelector('.cabinet').append(bar);
 document.querySelector('#scene').dataset.mobileHud='true';
 for(const [id,text] of [['console-open','>_'],['console-open-p2','P2 >_'],['settings-open','⋮']]){const button=document.getElementById(id);button.title=button.textContent;button.setAttribute('aria-label',button.textContent);button.textContent=text;}
 const consoleButton=document.getElementById('console-open');consoleButton.title='Open console';consoleButton.setAttribute('aria-label','Open console');bar.querySelector('.touch-actions').append(consoleButton);
 const learnButton=bar.querySelector('#learning-open');learnButton.onclick=()=>window.tokenRiot.learn();
 let actor=0,stickActor=0;const releases=new Map();
 const keyEvent=(key,type)=>document.dispatchEvent(new KeyboardEvent(type,{key,bubbles:true,cancelable:true}));
 const navigate=key=>{keyEvent(key,'keydown');keyEvent(key,'keyup');};
 bindTapAdvance(document.querySelector('.cabinet'),{state:()=>window.tokenRiot.state,blocked:()=>!document.querySelector('#combat-terminal').hidden||!document.querySelector('#settings-panel').hidden||!document.querySelector('#knowledge-panel').hidden||!document.querySelector('#resume-panel').hidden,advance:()=>navigate('Enter')});
 const playing=()=>window.tokenRiot.state==='arena'&&document.querySelector('#combat-terminal').hidden&&document.querySelector('#settings-panel').hidden&&document.querySelector('#knowledge-panel').hidden;
 const resetStick=bindJoystick(bar.querySelector('.touch-stick'),{playing,navigate,move:(x,y)=>window.tokenRiot.touchMove(x,y,stickActor)});
 bar.querySelector('.touch-stick').addEventListener('pointerdown',()=>{stickActor=actor;},true);
 for(const button of bar.querySelectorAll('[data-key],[data-action]')){
  button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);
   if(playing()&&button.dataset.action){const who=actor,action=button.dataset.action;window.tokenRiot.touchAction(action,true,who);releases.set(e.pointerId,()=>window.tokenRiot.touchAction(action,false,who));}
   else if(button.dataset.key){keyEvent(button.dataset.key,'keydown');releases.set(e.pointerId,()=>keyEvent(button.dataset.key,'keyup'));}
  });
  for(const name of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(name,e=>{releases.get(e.pointerId)?.();releases.delete(e.pointerId);});
 }
 const releaseAll=()=>{resetStick();for(const release of releases.values())release();releases.clear();};
 window.addEventListener('blur',releaseAll);window.addEventListener('resize',releaseAll);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseAll();});
 let previous='';
 const sync=()=>{const state=window.tokenRiot.state,overlay=!document.querySelector('#combat-terminal').hidden||!document.querySelector('#settings-panel').hidden||!document.querySelector('#knowledge-panel').hidden||!document.querySelector('#resume-panel').hidden,mode=state+':'+overlay;
  if(mode!==previous){releaseAll();previous=mode;}
  learnButton.hidden=overlay||state!=='arena'||!window.tokenRiot.game?.nearLearningCenter;
  bar.classList.toggle('in-game',state==='arena');bar.classList.toggle('navigating',['difficulty','selector','company','map'].includes(state));bar.hidden=overlay||['loading','intro','title','results'].includes(state);
  requestAnimationFrame(sync);
 };sync();
 // Keep layout usable when the software keyboard opens inside the terminal.
 document.addEventListener('focusin',e=>{if(e.target.id==='combat-input')document.body.classList.add('typing-console');});
 document.addEventListener('focusout',e=>{if(e.target.id==='combat-input')document.body.classList.remove('typing-console');});
}
function showStorageError(error){document.querySelector('#loading').hidden=false;document.querySelector('#loading').textContent='Could not save locally: '+error.message;}
boot().catch(showStorageError);
