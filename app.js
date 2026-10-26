// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import {SAVE_GAMES_KEY,packRun,unpackRun,createSaveGames,restoreSavedGame} from './save-games.js';
import {createBadgeRewards} from './badge-rewards.js';
import {tr,onGameLanguageChange,installGameLanguage} from './i18n.js';
import {normalizeConsoleCommand} from './console-commands.js';
import {createKnowledgeUI} from './knowledge-ui.js';
import {CAMPAIGN_ORDER,stageNumber,nextStage} from './campaign.js';
import {drawFlight,drawCredits,drawDisclaimer,drawCurtainCall,drawSavingsResults,CREDIT_SECONDS,FLIGHT_SECONDS} from './world-finale.js';
import {drawChallenge} from './mission-view.js';
import {MissionBayGame} from './game-engine.js';
import {drawRouteMap,drawTitleRival,drawMission,DISTRICTS} from './game-view.js';
import {drawStageBanner,drawComic,drawStageStory,drawBossDefeat,STAGE_BANNER_MS} from './cinematics.js';
import {loadAssets,drawCharacter,drawBullet,art,companies,companyBulletIndices} from './sprites.js';
const $=s=>document.querySelector(s),canvas=$('#scene'),c=canvas.getContext('2d');
c.imageSmoothingEnabled=false;
installGameLanguage(document,[canvas,$('#selection-scene'),$('#company-portrait')]);
let knowledge;
const badgeRewards=createBadgeRewards(document,()=>knowledge?.badgeIds()||[]);
knowledge=createKnowledgeUI({onAward:badge=>badgeRewards.celebrate(badge),onBadgesChange:()=>badgeRewards.render(),getGame:()=>game,pause:()=>resetControls(),resume:()=>{resetControls();canvas.focus();},request:async(data,actor)=>{await flushCoinRewards(actor);return requestLLM('knowledge',data,actor);}});
let difficulty='easy';
const difficultyOptions=['easy','medium','hard'];
let game=null,mapIndex=0,completedStages=0,comicPage=0,lastGameTime=null,mapMessage='';
let campaignHealth=null;
function rememberHealth(){if(game)campaignHealth=[game.player.hp,...(game.partner?[game.partner.hp]:[])];}
let companySlot=0;const playerCompanies=['OpenAI','OpenAI'];let consolePlayer=0;
let storyStage=0,storyDestination='map',introducedStages=new Set(),playerCount=1,selectionSlot=0,playerCharacters=['Nano','Pili'];
let skipCode='',skipCodeAt=0,creditCode='',creditCodeAt=0,arcadeCredits=3,continuesUsed=0;
const MAX_CONTINUES=3,CONTINUE_SECONDS=10;
const partnerInput={};
const input={left:false,right:false,up:false,down:false,fire:false,jump:false,crouch:false,guard:false};
let state='loading',epoch=null,elapsed=0,selected='Nano',company='OpenAI',raf=0,pausedAt=null,manual=false;
const INTRO_DURATION=5000;
const gameHudStates=new Set(['arena','stage','comic','map','defeat','continue','gameover','flight']);
let saveBusy=false,resumeBusy=false,activeRunId=crypto.randomUUID();
const savedGames=createSaveGames({persist:async value=>{if(window.tokenRiotSaveStorage)await window.tokenRiotSaveStorage(value);else localStorage.setItem(SAVE_GAMES_KEY,value);}});
const soundtrack=$('#intro-soundtrack'),menuMusic=$('#selection-soundtrack'),stageMusic=$('#stage-soundtrack');
const stageThemes=['openai','anthropic','google','meta','x','amazon','microsoft','qwen','deepseek','kimi','finale','vercel'].map((name,i)=>{const audio=i===0?stageMusic:document.createElement('audio');audio.src='assets/adventure-'+name+'-v3.wav';audio.loop=true;audio.preload='none';if(i>0){audio.hidden=true;$('main').append(audio);}return audio;});
[7,8,9,10].forEach((id,i)=>stageThemes[id].src='assets/oriental-'+['qwen','deepseek','kimi','finale'][i]+'.wav');
function extraMusic(file){const a=document.createElement('audio');a.src='assets/'+file;a.loop=true;a.preload='none';a.hidden=true;$('main').append(a);return a;}
const bossMusic=extraMusic('rock-boss-pressure.wav'),villainMusic=extraMusic('rock-villain-tension.wav'),defeatMusic=extraMusic('boss-defeat-comedy.wav');
const orientalStory=extraMusic('oriental-story.wav'),orientalBoss=extraMusic('oriental-boss.wav');
const tracks=[soundtrack,menuMusic,...stageThemes,bossMusic,villainMusic,defeatMusic,orientalStory,orientalBoss];tracks.forEach(track=>{track.preload=track===soundtrack?'auto':track.preload;track.volume=track===soundtrack?.65:stageThemes.includes(track)?.46:.46;});
soundtrack.loop=true;menuMusic.loop=true;
let soundBlocked=false,soundMuted=false,currentTrack=null,audioRequest=0;
const speakerOn='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h4l5-4v14l-5-4H3z"/><path class="speaker-wave" d="M16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></svg>';
const speakerOff='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9h4l5-4v14l-5-4H3z"/><path class="speaker-wave" d="m16 9 6 6m0-6-6 6"/></svg>';
function soundLabel(){const b=$('#sound');b.innerHTML=soundMuted?speakerOff:speakerOn;b.setAttribute('aria-label',soundMuted?'Unmute':'Mute');b.setAttribute('title',soundMuted?'Unmute':'Mute');b.setAttribute('aria-pressed',String(!soundMuted));}
function desiredTrack(){
 if(['intro','title','difficulty'].includes(state))return soundtrack;
 if(['flight','credits','disclaimer','curtain','results'].includes(state))return menuMusic;
 if(state==='map'&&mapIndex>=7&&mapIndex<=10)return orientalStory;
 if(['selector','company','map'].includes(state))return menuMusic;
 if(state==='defeat')return defeatMusic;
 if(state==='comic')return storyStage>=7&&storyStage<=10?orientalStory:villainMusic;
 if(state==='arena'&&game?.phase==='boss')return game.stage>=7&&game.stage<=10?orientalBoss:bossMusic;
 return ['stage','arena','continue','gameover'].includes(state)?stageThemes[state==='stage'?storyStage:(game?.stage??mapIndex)]:null;
}
function playMusic(track,restart=false){
 const request=++audioRequest;for(const other of tracks)if(other!==track)other.pause();
 const changed=currentTrack!==track;currentTrack=track;if(!track)return;
 track.muted=soundMuted;if(restart||changed)track.currentTime=0;
 const attempt=track.play();if(attempt)attempt.then(()=>{if(request===audioRequest)soundBlocked=false;}).catch(()=>{if(request===audioRequest)soundBlocked=true;});
}
function unlockAudio(){if(soundBlocked&&!soundMuted&&currentTrack){const desired=desiredTrack();playMusic(desired);}}
const sfxPools={},sfxLast={};const sfxFiles={'player-shot':'sfx-player-shot.wav','enemy-shot':'sfx-enemy-shot.wav',blob:'sfx-blob-pop.wav',block:'sfx-guard-tick.wav','hurt-Nano':'sfx-ouch-nano.wav','hurt-Pili':'sfx-ouch-pili.wav'};
for(const [key,file] of Object.entries(sfxFiles)){sfxPools[key]=Array.from({length:key.startsWith('hurt')?1:2},()=>{const a=document.createElement('audio');a.src='assets/'+file;a.preload='auto';a.hidden=true;a.volume=key.startsWith('hurt')?.78:key==='blob'?.4:.26;$('main').append(a);return a;});}
function playSfx(type,character='Nano'){
 if(soundMuted)return;const key=type==='hurt'?'hurt-'+character:type,pool=sfxPools[key];if(!pool)return;const now=performance.now(),gap=type==='hurt'?350:type==='blob'?85:110;if(now-(sfxLast[key]??-Infinity)<gap)return;sfxLast[key]=now;
 const voice=pool.find(a=>a.paused||a.ended)||pool[0];voice.muted=false;voice.currentTime=0;const playing=voice.play();if(playing)playing.catch(()=>{});
}
function processGameAudio(){if(!game)return;const events=game.soundEvents.splice(0);for(const event of events)playSfx(event.type,event.character);}
$('#sound').onclick=()=>{soundMuted=!soundMuted;tracks.forEach(track=>track.muted=soundMuted);Object.values(sfxPools).flat().forEach(a=>{a.muted=soundMuted;if(soundMuted)a.pause();});if(!soundMuted)playMusic(desiredTrack());soundLabel();};
document.addEventListener('pointerdown',e=>{if(e.target?.closest?.('#sound'))return;unlockAudio();},{capture:true});
soundLabel();
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>1-(1-clamp(x))**3;
const rect=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h)};
function city(t){
 const bg=art.select;
 // City-only regions from the supplied selection artwork; foreground and skyline move independently.
 for(let i=-1;i<6;i++){
  const x=i*300-(t*9)%300;
  c.drawImage(bg,i%2===0?0:1160,140,280,420,x,-30,302,600);
 }
 const floorY=548;
 c.drawImage(bg,0,924,1448,55,0,floorY,1280,172);
 c.save();c.globalAlpha=.33;
 c.drawImage(bg,0,200,190,620,-24-Math.sin(t*.6)*9,0,175,720);
 c.translate(1280,0);c.scale(-1,1);c.drawImage(bg,0,200,190,620,-22-Math.sin(t*.9)*13,0,175,720);c.restore();
 // Retro perspective grid moves beneath the duo, inspired by the supplied reference.
 c.save();c.strokeStyle='#dc3cff55';c.lineWidth=1;
 for(let i=-6;i<=6;i++){c.beginPath();c.moveTo(640+i*24,548);c.lineTo(640+i*170,720);c.stroke();}
 for(let i=0;i<9;i++){const z=((i+t*2)%9)/9,y=548+z*z*172;c.beginPath();c.moveTo(0,y);c.lineTo(1280,y);c.stroke();}c.restore();
 const gradient=c.createLinearGradient(0,0,0,720);gradient.addColorStop(0,'#04082033');gradient.addColorStop(.65,'#05082016');gradient.addColorStop(1,'#030818aa');c.fillStyle=gradient;c.fillRect(0,0,1280,720);
 for(let i=0;i<52;i++){const x=(i*113-t*70+1500)%1300,y=(i*71+t*180)%720;rect(x,y,1,11,'#8bd9ff35');}
 // Moving urban light sweeps and small drones, independent of the background image.
 for(let i=0;i<3;i++){const x=(170+i*370+t*(i%2?-30:32)+1280)%1280,y=110+i*38+Math.sin(t*3+i)*8;
 rect(x-13,y,26,5,'#060e22');rect(x-23,y-2,11,3,'#43e8ff');rect(x+13,y-2,11,3,'#ff42c8');rect(x-2,y+5,4,2,'#fff');}
}
function title(t){
 const entry=ease(t/.35),final=ease((t-2.5)/.4),scale=(t<.8?1:.70)+final*.3;
 c.save();c.translate(640,125+final*70);c.scale(scale,scale);c.globalAlpha=entry;
 // Original TOKEN RIOT title from the supplied arena-initializing artwork.
 c.globalCompositeOperation='screen';c.shadowColor='#00dfff';c.shadowBlur=15;
 const glitch=t<.8||t>2.5?Math.sin(t*88)*6*(1-final):0;
 c.drawImage(art.logo,0,0,640,280,-280+glitch,-95,560,245);
 if(Math.sin(t*73)>.65){c.globalAlpha=.65;c.drawImage(art.logo,0,70,640,10,-290,-34,560,9);}
 c.restore();
}
// Cooperative burst: both heroes fire OUTWARD, away from one another.
export function projectilePosition(t,i){
 const birth=1.8+i*.045,age=t-birth;if(age<0||age>.68)return null;
 const direction=i%2?1:-1,origin=direction===1?865:415;
 return {age,direction,x:origin+direction*age*1100,y:398+(i%5)*18};
}
function projectiles(t){
 for(let i=0;i<10;i++){
  const shot=projectilePosition(t,i);if(!shot)continue;const {age,direction,x,y}=shot;
  c.save();c.globalAlpha=clamp((.68-age)*8);c.shadowColor=direction===1?'#ff4bdd':'#38eaff';c.shadowBlur=17;
  rect(direction===1?x-95:x+20,y+15,75,2,c.shadowColor);drawBullet(c,companyBulletIndices[i%companies.length],x,y,90,direction);c.restore();
  // Impacts stay at the outer edges, never on the other protagonist.
  if(age>.24){const p=clamp((age-.24)/.4),edge=direction===1?1230:50;
   for(let j=0;j<12;j++){const a=j*2.4+i;rect(edge+Math.cos(a)*p*95,y+Math.sin(a)*p*75,5*(1-p)+1,5*(1-p)+1,j%2?'#57f8ff':'#ff52c8');}
  }
 }
}
function energyPulse(t){
 if(t<1.8||t>2.5)return;const p=clamp((t-1.8)/.7);
 c.save();c.globalAlpha=(1-p)*.8;c.strokeStyle='#71faff';c.lineWidth=4*(1-p)+1;c.shadowColor='#5effff';c.shadowBlur=25;
 c.beginPath();c.ellipse(640,605,80+p*710,15+p*80,0,0,Math.PI*2);c.stroke();c.restore();
 if(t<1.89){c.save();c.globalAlpha=(1-(t-1.8)/.09)*.22;rect(0,0,1280,720,'#b8fbff');c.restore();}
}
function draw(t){
 city(t);
 // Short camera kick gives the shared burst impact without suggesting a duel.
 c.save();if(t>1.8&&t<2.08){const kick=(1-(t-1.8)/.28)*7;c.translate(Math.sin(t*95)*kick,Math.cos(t*81)*kick*.5);}
 title(t);
 if(t>=.8){const entry=ease((t-.8)/.85),pose=t<1.65?'run':t<1.85?'idle':'attack';
  c.save();c.globalAlpha=1-clamp((t-2.5)/.5)*.55;
  drawCharacter(c,'Nano',-170+entry*675,610,290,pose,t,t<1.65?1:-1,'#40efff');
  drawCharacter(c,'Pili',1450-entry*675,610,290,pose,t,t<1.65?-1:1,'#ff38bd');c.restore();
 }
 projectiles(t);energyPulse(t);c.restore();
 for(let y=0;y<720;y+=4)rect(0,y,1280,1,'#03051525');

 if(t<.13){c.globalAlpha=1-t/.13;rect(0,0,1280,720,'#020714');c.globalAlpha=1;}
}
let spotlightX=400,selectorLastTime=null;
function drawSelector(now){
 const sc=$('#selection-scene').getContext('2d');sc.imageSmoothingEnabled=false;
 const dt=selectorLastTime===null?0:Math.min(80,now-selectorLastTime);selectorLastTime=now;
 const target=selected==='Nano'?400:880;spotlightX+=(target-spotlightX)*(1-Math.exp(-dt/180));
 sc.fillStyle='#040c20';sc.fillRect(0,0,1280,960);
 // Rebuild only the city/floor from the original artwork, excluding its baked-in Nano spotlight.
 for(let i=0;i<5;i++)sc.drawImage(art.select,i%2===0?0:1160,140,280,420,i*280-35,0,282,760);
 sc.drawImage(art.select,0,924,1448,55,0,720,1280,240);
 const shade=sc.createLinearGradient(0,0,0,960);shade.addColorStop(0,'#040b2130');shade.addColorStop(1,'#040b21a0');sc.fillStyle=shade;sc.fillRect(0,0,1280,960);
 // One physical cone and one floor ring travel together to the active character.
 sc.save();sc.globalCompositeOperation='screen';
 const beam=sc.createLinearGradient(0,70,0,760);beam.addColorStop(0,'#a3fbff08');beam.addColorStop(.3,'#58eaff38');beam.addColorStop(1,'#35eaff65');sc.fillStyle=beam;
 sc.beginPath();sc.moveTo(spotlightX-35,75);sc.lineTo(spotlightX+35,75);sc.lineTo(spotlightX+175,762);sc.lineTo(spotlightX-175,762);sc.closePath();sc.fill();
 sc.shadowColor='#35f7ff';sc.shadowBlur=30;sc.lineWidth=6;sc.strokeStyle='#bbffff';sc.beginPath();sc.ellipse(spotlightX,762,178,27,0,0,Math.PI*2);sc.stroke();
 sc.globalAlpha=.55+.035*Math.sin(now/1500);sc.lineWidth=2;sc.beginPath();sc.ellipse(spotlightX,762,194,36,0,0,Math.PI*2);sc.stroke();sc.restore();
 for(const [name,x,direction] of [['Nano',400,1],['Pili',880,-1]]){
  const lit=Math.exp(-Math.abs(x-spotlightX)/160);sc.save();sc.filter='brightness('+(.42+.58*lit)+')';
  sc.translate(0,Math.sin(now/1800+(name==='Pili'?1:0))*1.4);
  drawCharacter(sc,name,x,756,490,'idle',0,direction,lit>.6?'#62faff':'#00000000');sc.restore();
 }
}
function drawStartScreen(time){
 city(3+time*.4);title(3);c.save();c.globalAlpha=.5;drawCharacter(c,'Nano',295,620,280,'idle',0,1,'#56faff');drawCharacter(c,'Pili',985,620,280,'idle',0,-1,'#ff55d2');c.restore();
 drawTitleRival(c,time);
}
function tick(now){
 if(manual)return;
 if(state==='intro'){if(epoch===null)epoch=now;elapsed=(now-epoch)/1000;draw(Math.min(elapsed*3000/INTRO_DURATION,3));if(elapsed>=5){state='title';epoch=now;elapsed=0;show(null);}}
 else if(state==='title'||state==='difficulty'){elapsed=(now-epoch)/1000;drawStartScreen(elapsed);}
 else if(['flight','credits','disclaimer','curtain','results'].includes(state)){if(epoch===null)epoch=now;elapsed=(now-epoch)/1000;if(state==='results'){drawSavingsResults(c,elapsed,finalSummary,resultsLoading,resultsError);$('#results-continue').disabled=resultsLoading;}else if(state==='flight'){drawFlight(c,elapsed);if(elapsed>=FLIGHT_SECONDS){openMap(7);return;}}else if(state==='credits'){drawCredits(c,elapsed);if(elapsed>=CREDIT_SECONDS){openEnding('disclaimer');return;}}else if(state==='disclaimer')drawDisclaimer(c,elapsed);else drawCurtainCall(c,elapsed);}
 else if(state==='selector')drawSelector(now);
 else if(state==='challenge')drawChallenge(c,contract,elapsed=(now-(epoch??now))/1000,selected,contractDone);
 else if(['stage','comic','map','arena','defeat','continue','gameover'].includes(state)){
  if(epoch===null)epoch=now;elapsed=(now-epoch)/1000;
  if(state==='stage'){drawStageBanner(c,elapsed,storyStage,DISTRICTS[storyStage].place);if(elapsed>=STAGE_BANNER_MS/1000){state='comic';comicPage=0;epoch=now;elapsed=0;}}
  else if(state==='comic')drawStageStory(c,elapsed,storyStage,comicPage);
  else if(['continue','gameover'].includes(state)){drawMission(c,game,null,true);const remaining=Math.max(0,Math.ceil(CONTINUE_SECONDS-elapsed));if(state==='continue'&&remaining===0){state='gameover';show(null);}drawContinueScreen(remaining);}
  else if(state==='defeat')drawBossDefeat(c,elapsed,game.stage,DISTRICTS[game.stage].company);
  else if(state==='map')drawRouteMap(c,elapsed,mapIndex,completedStages,mapMessage);
  else if(game){const dt=lastGameTime===null?0:(now-lastGameTime)/1000;lastGameTime=now;if(!overlayOpen()){refillCombatAmmo();game.update(dt,input,partnerInput);if(state==='arena')knowledge.pickup();rememberHealth();}drawMission(c,game,$('#combat-terminal').hidden?null:(now-consoleOpenedAt)/1000);processCoinRewards(now);processGameAudio();if(game.phase==='gameover'){resetControls();state=continuesUsed<MAX_CONTINUES?'continue':'gameover';epoch=now;elapsed=0;show(null);}else if(game.phase==='victory'){state='defeat';epoch=now;elapsed=0;show(null);}}
 }else return;
 const desired=desiredTrack();if(desired&&desired!==currentTrack)playMusic(desired);
 if(now>=tokenNoticeUntil)$('#combat-notice').hidden=true;if(gameHudStates.has(state))drawCoinFlights(now);$('#credits').textContent='CREDITS '+arcadeCredits;canvas.dataset.screen=state;if(game){canvas.dataset.encounter=String(game.zone+1);canvas.dataset.enemies=String(game.enemies.length);canvas.dataset.phase=game.phase;canvas.dataset.health=String(game.player.hp);}
 raf=requestAnimationFrame(tick);
}
function drawContinueScreen(remaining){
 c.fillStyle='#030918eb';c.fillRect(200,160,880,410);c.strokeStyle='#72eaff';c.lineWidth=2;c.strokeRect(200,160,880,410);c.textAlign='center';c.fillStyle='#ffbd68';c.font='bold 58px monospace';c.fillText(state==='continue'?'CONTINUE?':'GAME OVER',640,250);
 c.fillStyle='#eaffff';c.font='bold 95px monospace';if(state==='continue')c.fillText(String(remaining).padStart(2,'0'),640,363);c.font='bold 23px monospace';c.fillText('CREDITS '+arcadeCredits+'  /  CONTINUES '+continuesUsed+' OF '+MAX_CONTINUES,640,422);
 c.fillStyle='#9eeeff';c.fillText(state==='continue'?(arcadeCredits>0?'Press Enter — 1 credit':'NO CREDITS'): 'Press Enter',640,492);
}
function continueRun(){if(state!=='continue'||arcadeCredits<1||continuesUsed>=MAX_CONTINUES)return;arcadeCredits--;continuesUsed++;game.retry();state='arena';epoch=null;lastGameTime=null;show(null);canvas.focus();}
function openEnding(next='credits'){cancelAnimationFrame(raf);resetControls();state=next;manual=false;epoch=null;elapsed=0;show(null);playMusic(menuMusic);canvas.focus();raf=requestAnimationFrame(tick);}
function openFlight(){cancelAnimationFrame(raf);resetControls();state='flight';manual=false;epoch=null;elapsed=0;show(null);playMusic(menuMusic,true);canvas.focus();raf=requestAnimationFrame(tick);}
function openMap(index=game?.stage??0){resetControls();mapIndex=index;cancelAnimationFrame(raf);state='map';manual=false;epoch=null;elapsed=0;mapMessage='';show(null);playMusic(desiredTrack());raf=requestAnimationFrame(tick);canvas.focus();}
function startArena(){resetControls();cancelAnimationFrame(raf);if(!game||game.stage!==mapIndex||game.phase==='victory')game=new MissionBayGame(selected,company,companyBulletIndices[companies.indexOf(company)],mapIndex,difficulty);if(campaignWeapon)game.weapon=campaignWeapon;else campaignWeapon=game.weapon;game.weapon.name=combatModels.brands[company]?.[game.weapon.tier]||game.weapon.name;if(playerCount===2&&!game.partner){game.enableCoop(playerCharacters[1],playerCompanies[1],companyBulletIndices[companies.indexOf(playerCompanies[1])]);if(partnerEconomy.weapon)game.partner.loadout.weapon=partnerEconomy.weapon;else partnerEconomy.weapon=game.partner.loadout.weapon;game.partner.loadout.weapon.name=combatModels.brands[playerCompanies[1]][game.partner.loadout.weapon.tier];}if(campaignHealth){game.player.hp=campaignHealth[0];if(game.partner)game.partner.hp=campaignHealth[1]??60;}state='arena';manual=false;epoch=null;elapsed=0;lastGameTime=null;Object.keys(input).forEach(k=>input[k]=false);show(null);playMusic(stageThemes[mapIndex]);raf=requestAnimationFrame(tick);canvas.focus();window.dispatchEvent(new CustomEvent('tokenriot:stage-ready',{detail:{stage:stageNumber(game.stage),character:selected,company}}));}
function beginStageIntro(index,destination='arena'){storyStage=index;mapIndex=index;storyDestination=destination;comicPage=0;cancelAnimationFrame(raf);state='stage';epoch=null;elapsed=0;manual=false;show(null);playMusic(stageThemes[index],true);canvas.focus();raf=requestAnimationFrame(tick);}
function advanceComic(){if(comicPage<2){comicPage++;epoch=null;elapsed=0;}else{introducedStages.add(storyStage);if(storyDestination==='map')openMap(storyStage);else{rememberHealth();game=null;startArena();}}}
function enterMappedStage(){if(completedStages>=DISTRICTS.length)return;if(introducedStages.has(mapIndex))startArena();else beginStageIntro(mapIndex);}
function show(id){$('.cabinet').classList.toggle('game-hud',gameHudStates.has(state));$('#credits').hidden=!gameHudStates.has(state);$('#resume-open').disabled=!savedGames.runs().some(save=>save.players===1||!document.body.classList.contains?.('mobile-app'));$('.cabinet').classList.toggle('results-mode',state==='results');$('#results-continue').hidden=state!=='results';for(const key of ['selector','company-screen'])$('#'+key).hidden=key!==id;$('.cabinet').classList.toggle('menu-mode',id!==null);$('.cabinet').classList.toggle('coop-mode',playerCount===2);$('#difficulty-picker').hidden=state!=='difficulty';$('#skip').hidden=true;$('#console-open').hidden=state!=='arena';$('#console-open-p2').hidden=state!=='arena'||playerCount!==2;$('#stage-back').hidden=!['stage','comic','map','arena','defeat'].includes(state);soundLabel();}
function choose(name){selected=name;document.querySelectorAll('.character').forEach(b=>{const active=b.dataset.character===selected;b.setAttribute('aria-pressed',String(active));b.tabIndex=active?0:-1;});$('#selection').textContent=playerCount===2?'PLAYER '+(selectionSlot+1)+' / Press Enter':'Press Enter';$('.select-title').textContent=playerCount===2?'PLAYER '+(selectionSlot+1)+' — CHOOSE YOUR CHARACTER':'CHOOSE YOUR CHARACTER';}
function confirmCharacter(){playerCharacters[selectionSlot]=selected;if(playerCount===2&&selectionSlot===0){selectionSlot=1;choose(playerCharacters[1]);focusCharacter();return;}selected=playerCharacters[0];openCompany();}
$('#player-count').onchange=()=>{playerCount=document.body.classList.contains?.('mobile-app')?1:Number($('#player-count').value)===2?2:1;selectionSlot=0;};
function focusCharacter(){document.querySelector('[data-character="'+selected+'"]').focus();}
function selectScreen(){if(state!=='selector')selectionSlot=0;playMusic(menuMusic);cancelAnimationFrame(raf);manual=false;state='selector';show('selector');choose(selected);selectorLastTime=null;drawSelector(performance.now());raf=requestAnimationFrame(tick);focusCharacter();}
function replay(){resetTokenRun();cancelAnimationFrame(raf);state='intro';epoch=null;elapsed=0;pausedAt=null;manual=false;show(null);playMusic(soundtrack,true);raf=requestAnimationFrame(tick);}
function focusCompany(){document.querySelector('[data-company="'+company+'"]').focus();}
function selectCompany(name){
 if(company!==name)clearCombatConsole();company=name;const portrait=$('#company-portrait'),pc=portrait.getContext('2d');pc.clearRect(0,0,200,280);drawCharacter(pc,playerCharacters[companySlot],100,278,265,'idle',0,1,selected==='Pili'?'#ff42c8':'#4bffff');
 document.querySelectorAll('.company').forEach(b=>{const active=b.dataset.company===company;b.setAttribute('aria-pressed',String(active));b.tabIndex=active?0:-1;});$('#company-choice').textContent='PLAYER '+(companySlot+1)+' · '+playerCharacters[companySlot]+' / '+company;
}
function openCompany(announce=true){companySlot=0;company=playerCompanies[0];cancelAnimationFrame(raf);state='company';show('company-screen');playMusic(menuMusic);selectCompany(company);if(announce)window.dispatchEvent(new CustomEvent('tokenriot:character-selected',{detail:{name:selected}}));focusCompany();}
function resetTokenRun(){activeRunId=crypto.randomUUID();badgeRewards.cancel();knowledge.newRun();campaignHealth=null;$('#combat-notice').hidden=true;tokenNoticeUntil=0;partnerEconomy.session=crypto.randomUUID();partnerEconomy.wallet=0;partnerEconomy.queue.length=0;partnerEconomy.freeUses.clear();partnerEconomy.pendingAmmo.clear();partnerEconomy.pendingActivations.clear();partnerEconomy.weapon=null;partnerEconomy.log=initialConsole;primaryEconomy.log=initialConsole;consolePlayer=0;resultsRequest++;finalSummary=null;resultsLoading=false;resultsError='';sessionId=crypto.randomUUID();wallet=0;renderTokenBalance();coinFlights=[];coinGrantQueue=[];freeUses.clear();pendingActivations.clear();campaignWeapon=null;pendingAmmo.clear();requestLLM('token-wallet').catch(()=>{});if(playerCount===2)requestLLM('token-wallet',{},1).catch(()=>{});}
function finishSelection(){playerCompanies[companySlot]=company;if(playerCount===2&&companySlot===0){companySlot=1;selectCompany(playerCompanies[1]);focusCompany();return;}companySlot=0;company=playerCompanies[0];clearCombatConsole();resetTokenRun();game=null;continuesUsed=0;completedStages=0;introducedStages.clear();beginStageIntro(0,'map');window.dispatchEvent(new CustomEvent('tokenriot:ready',{detail:{character:selected,company,players:playerCount}}));}
function goBack(){if(['continue','gameover'].includes(state)){replay();return;}if(state==='challenge'){return;}else if(state==='arena')openMap();else if(state==='defeat')beginContract();else if(state==='map')openCompany(false);else if(state==='comic'&&comicPage>0){comicPage--;epoch=null;elapsed=0;}else if(['stage','comic'].includes(state))openCompany(false);else if(state==='company'){if(companySlot===1){companySlot=0;selectCompany(playerCompanies[0]);focusCompany();}else selectScreen();}else if(state==='selector')openDifficulty();else if(state==='difficulty'){state='title';epoch=performance.now();show(null);}}
$('#skip').onclick=selectScreen;$('#stage-back').onclick=goBack;$('#company-back').onclick=goBack;$('#character-back').onclick=goBack;

document.querySelectorAll('.character').forEach(b=>{b.onpointerenter=()=>choose(b.dataset.character);b.onfocus=()=>choose(b.dataset.character);b.onclick=()=>{choose(b.dataset.character);confirmCharacter();};});
for(const [i,name] of companies.entries()){
 const b=document.createElement('button');b.className='company';b.dataset.company=name;b.setAttribute('aria-label',name);b.style.left=(5.7+i%5*13.8)+'%';b.style.top=(36.8+Math.floor(i/5)*17.8)+'%';
 const icon=document.createElement('canvas');icon.width=180;icon.height=120;icon.id='company-icon-'+i;const label=document.createElement('span');label.textContent=name;b.append(icon);b.append(label);
 b.onpointerenter=()=>selectCompany(name);b.onfocus=()=>selectCompany(name);b.onclick=()=>{selectCompany(name);finishSelection();};$('#company-grid').append(b);
}
const defaultBindings=[
 {left:['arrowleft','a'],right:['arrowright','d'],up:['arrowup','w'],down:['arrowdown','s'],fire:[' '],jump:['z'],crouch:['x'],guard:['c']},
 {left:['j'],right:['l'],up:['i'],down:['k'],fire:['h'],jump:['u'],crouch:['o'],guard:['p']}
];
let controlBindings=JSON.parse(JSON.stringify(defaultBindings)),draftBindings=null,capturingControl=null;
try{const saved=JSON.parse(localStorage.getItem('tokenriot-controls')||'null');if(saved&&defaultBindings.every((p,i)=>Object.keys(p).every(a=>Array.isArray(saved[i]?.[a])&&saved[i][a].length&&saved[i][a].every(k=>typeof k==='string'))))controlBindings=saved.map((bindings,i)=>Object.fromEntries(Object.entries(bindings).map(([action,keys])=>[action,keys.includes('v')?defaultBindings[i][action]:keys])));}catch{}
function keyLabel(key){return ({' ':'Space',arrowleft:'←',arrowright:'→',arrowup:'↑',arrowdown:'↓'})[key]||key.toUpperCase();}
function clearCombatConsole(){primaryEconomy.log=initialConsole;partnerEconomy.log=initialConsole;closeModelPicker();$('#combat-log').textContent=tr(initialConsole);$('#combat-input').value='';$('#combat-terminal').hidden=true;resetControls();}
function renderControlSettings(){const host=$('#control-bindings');host.textContent='';draftBindings.slice(0,document.body.classList.contains?.('mobile-app')?1:2).forEach((bindings,i)=>{const section=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent='PLAYER '+(i+1);section.append(legend);for(const action of Object.keys(bindings)){const label=document.createElement('label'),button=document.createElement('button');label.textContent=action.toUpperCase();button.type='button';button.textContent=bindings[action].map(keyLabel).join(' / ');button.onclick=()=>{capturingControl={player:i,action,button};$('#settings-status').textContent='Press a key for Player '+(i+1)+' '+action+'. Escape cancels.';button.textContent='Press a key…';};label.append(button);section.append(label);}host.append(section);});}
function captureControl(e){if(!capturingControl)return false;e.preventDefault();if(e.repeat)return true;const capture=capturingControl;if(e.key==='Escape'){capturingControl=null;renderControlSettings();$('#settings-status').textContent='Key change cancelled.';return true;}const key=e.key.toLowerCase();if(key==='v'||e.ctrlKey||e.altKey||e.metaKey||['control','shift','alt','meta','enter','tab'].includes(key)){ $('#settings-status').textContent='Choose a single key. V, Enter, Escape and Ctrl+C are reserved.';return true;}const conflict=draftBindings.some((bindings,i)=>Object.entries(bindings).some(([action,keys])=>!(i===capture.player&&action===capture.action)&&keys.includes(key)));if(conflict){$('#settings-status').textContent='That key is already assigned. Choose another key.';return true;}draftBindings[capture.player][capture.action]=[key];capturingControl=null;renderControlSettings();$('#settings-status').textContent='Key changed. Save to keep your controls.';return true;}
const heldControlKeys=new Set();
function setControl(e,value){const key=(e.key||'').toLowerCase();if(value)heldControlKeys.add(key);else heldControlKeys.delete(key);let matched=false;controlBindings.forEach((bindings,i)=>{const controls=i?partnerInput:input;for(const [action,keys] of Object.entries(bindings)){if(keys.includes(key))matched=true;const was=!!controls[action];controls[action]=keys.some(k=>heldControlKeys.has(k));if(action==='fire'&&was!==controls[action]&&state==='arena'&&game&&!overlayOpen()){const main=game.player,target=i?game.partner:main;if(target){game.player=target;try{if(controls[action])game.pressFire();else game.releaseFire();}finally{game.player=main;}}}}});return matched;}

document.addEventListener('keydown',e=>{
 if(e.isComposing)return;if(resumeBusy||saveBusy){e.preventDefault();return;}if(!$('#resume-panel').hidden&&e.key!=='Escape')return;
 if(state==='difficulty'&&!overlayOpen()&&e.key.toLowerCase()==='r'&&!e.ctrlKey&&!e.altKey&&!e.metaKey){e.preventDefault();if(!e.repeat)openResume();return;}
 if(e.isComposing)return;if(captureControl(e))return;unlockAudio();
 const typing=['INPUT','TEXTAREA','SELECT'].includes(e.target?.tagName);
 if(['intro','title','difficulty'].includes(state)&&!overlayOpen()&&!typing&&!e.repeat&&!e.ctrlKey&&!e.altKey&&!e.metaKey){const now=performance.now();if(now-creditCodeAt>2500)creditCode='';creditCodeAt=now;creditCode=e.key==='1'?'1':e.key==='2'&&creditCode==='1'?'12':'';if(creditCode==='12'){arcadeCredits++;creditCode='';$('#credits').textContent='CREDITS '+arcadeCredits;e.preventDefault();return;}}
 if(['intro','title'].includes(state)&&!overlayOpen()&&!typing&&!e.repeat&&!e.ctrlKey&&!e.altKey&&!e.metaKey){e.preventDefault();beginStart();return;}
 if(['arena','defeat'].includes(state)&&!overlayOpen()&&!typing&&!e.ctrlKey&&!e.altKey&&!e.metaKey){
  if(!e.repeat){const now=performance.now();if(now-skipCodeAt>2500)skipCode='';skipCodeAt=now;skipCode=/^[0-9]$/.test(e.key)?(skipCode+e.key).slice(-3):'';
   if(skipCode==='899'){e.preventDefault();skipCode='';const next=nextStage(game.stage);resetControls();if(next!==null){completedStages=Math.max(completedStages,stageNumber(next)-1);rememberHealth();game=null;if(next===7)openFlight();else beginStageIntro(next);}else{completedStages=DISTRICTS.length;openEnding();}return;}
  }
 }else skipCode='';
 if(e.ctrlKey&&['c','p'].includes(e.key.toLowerCase())&&state==='arena'&&$('#settings-panel').hidden&&!knowledge.open){e.preventDefault();if(!e.repeat){const actor=e.key.toLowerCase()==='p'?1:0;if(actor===1&&playerCount!==2)return;if($('#combat-terminal').hidden||consolePlayer!==actor)openConsole(actor);else closeOverlay();}return;}
 if(modelPickerIndex!==null&&!$('#combat-terminal').hidden&&handleModelPickerKey(e))return;
 if(e.key==='Escape'&&overlayOpen()){e.preventDefault();closeOverlay();return;}
 if(overlayOpen()||['INPUT','TEXTAREA','SELECT'].includes(e.target?.tagName))return;
 if(['continue','gameover'].includes(state)&&e.key==='Enter'){e.preventDefault();if(!e.repeat){if(state==='continue')continueRun();else replay();}return;}
 if(state==='challenge'){if(e.key==='Enter'&&contractDone){e.preventDefault();continueContract();}return;}
 if(state==='difficulty'&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key)){e.preventDefault();const i=difficultyOptions.indexOf(difficulty),next=e.key==='Home'?0:e.key==='End'?2:(i+(['ArrowLeft','ArrowUp'].includes(e.key)?2:1))%3;chooseDifficulty(difficultyOptions[next]);return;}
 if(state==='results'&&e.key.toLowerCase()==='r'&&!resultsLoading&&resultsError){e.preventDefault();valueFinalRun();return;}
 if(e.key==='Enter'&&e.repeat){e.preventDefault();return;}
 if(e.key==='Escape'){e.preventDefault();if(e.repeat)return;if(!['intro','title','loading'].includes(state))goBack();return;}
 if(e.key==='Enter'&&['resume-open','resume-back','resume-slot'].includes(e.target?.id||e.target?.className))return;
 const isBack=['stage-back','company-back','character-back','sound'].includes(e.target?.id);
 if(state==='arena'&&game){
  if(e.key.toLowerCase()==='v'){e.preventDefault();if(!e.repeat)openLearningCenter();return;}
  if(setControl(e,true)){e.preventDefault();return;}
  if(e.key==='Enter'&&!isBack){e.preventDefault();if(game.phase==='gameover'){state='continue';epoch=null;elapsed=0;show(null);}else if(game.phase==='victory'){beginContract();}return;}
 }
 if(e.key==='Enter'&&!isBack){
  e.preventDefault();if(state==='results'){if(!resultsLoading)openEnding('credits');}else if(state==='flight')openMap(7);else if(state==='credits')openEnding('disclaimer');else if(state==='disclaimer')openEnding('curtain');else if(state==='curtain')replay();else if(['intro','title'].includes(state))beginStart();else if(state==='difficulty')selectScreen();else if(state==='selector')confirmCharacter();else if(state==='company')finishSelection();else if(state==='comic')advanceComic();else if(state==='defeat')beginContract();else if(state==='map'){if(stageNumber(mapIndex)-1<=completedStages)enterMappedStage();else mapMessage='LOCKED // Clear previous stage';}return;
 }
 if(!['selector','company','map'].includes(state)||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();
 if(state==='selector'){if(e.key==='Home')choose('Nano');else if(e.key==='End')choose('Pili');else choose(selected==='Nano'?'Pili':'Nano');focusCharacter();}
 else if(state==='map'){return;}
 else{let i=companies.indexOf(company);i=e.key==='Home'?0:e.key==='End'?companies.length-1:e.key==='ArrowUp'?(i-5+companies.length)%companies.length:e.key==='ArrowDown'?(i+5)%companies.length:(i+(e.key==='ArrowLeft'?companies.length-1:1))%companies.length;selectCompany(companies[i]);focusCompany();}
});
document.addEventListener('keyup',e=>{if(setControl(e,false)&&state==='arena')e.preventDefault();});
window.addEventListener('blur',()=>{skipCode='';resetControls();});
document.addEventListener('visibilitychange',()=>{
 if(manual)return;
 if(document.hidden){Object.values(sfxPools).flat().forEach(a=>a.pause());tracks.forEach(track=>track.pause());cancelAnimationFrame(raf);pausedAt=performance.now();resetControls();}
 else if(['intro','title','difficulty','selector','company','stage','comic','map','arena','defeat','continue','gameover','challenge','flight','credits','disclaimer','curtain','results'].includes(state)){if(epoch!==null&&pausedAt!==null)epoch+=performance.now()-pausedAt;pausedAt=null;selectorLastTime=null;lastGameTime=null;Object.keys(input).forEach(k=>input[k]=false);if(!soundBlocked)playMusic(desiredTrack());raf=requestAnimationFrame(tick);}
});
window.tokenRiot={learn:()=>openLearningCenter(),touchMove(x,y,actor=0){const controls=actor?partnerInput:input;if(!Number.isFinite(x)||!Number.isFinite(y)||actor<0||actor>=playerCount)return;if((x||y)&&(state!=='arena'||overlayOpen()))return;controls.moveX=Math.max(-1,Math.min(1,x));controls.moveY=Math.max(-1,Math.min(1,y));},touchAction(action,pressed,actor=0){if(state!=='arena'||overlayOpen()||actor>=playerCount||!controlBindings[actor][action])return;setControl({key:controlBindings[actor][action][0]},pressed);},duration:INTRO_DURATION,get state(){return state;},get difficulty(){return difficulty;},get selected(){return selected;},get company(){return company;},get players(){return playerCount;},get credits(){return arcadeCredits;},get continues(){return continuesUsed;},get spotlightX(){return spotlightX;},get comicPage(){return comicPage;},get game(){return game?.snapshot()??null;},renderComicAt(ms){tracks.forEach(track=>track.pause());cancelAnimationFrame(raf);manual=true;state='comic';show(null);drawComic(c,clamp(ms/10000)*10);},renderAt(ms){tracks.forEach(track=>track.pause());cancelAnimationFrame(raf);manual=true;state='intro';show(null);draw(clamp(ms/INTRO_DURATION)*3);},replay};
Promise.all([loadAssets(),loadServerDefaults()]).then(()=>{for(let i=0;i<companies.length;i++){const icon=$('#company-icon-'+i);drawBullet(icon.getContext('2d'),companyBulletIndices[i],90,60,170);}$('#loading').hidden=true;canvas.tabIndex=0;const query=new URLSearchParams(location.search),comic=query.get('comic'),frame=query.get('frame');if(comic!==null)window.tokenRiot.renderComicAt(Number(comic)||0);else if(frame!==null)window.tokenRiot.renderAt(Number(frame)||0);else replay();}).catch(err=>{state='error';$('#loading').textContent='Could not load assets. Please reload.';console.error(err);});

// Model requests are constrained again by the local server; no terminal command reaches an OS.
let consoleOpenedAt=0;
let modelPickerIndex=null,modelPickerBusy=false;
let contract=null,contractDone=false,requestBusy=false,wallet=0;let finalSummary=null,resultsLoading=false,resultsError='',resultsRequest=0;
let abilityCatalog={},combatModels={tiers:[{damage:1,cost:0},{damage:2,cost:1},{damage:3,cost:3}],brands:{}},campaignWeapon=null,abilityBusy=false,ammoBusy=false;const pendingAmmo=new Map();const freeUses=new Set();const pendingActivations=new Map();
let coinFlights=[],coinGrantQueue=[],coinSync=null,missionQuestions=3,quoteTimer=null;
let sessionId;try{sessionId=crypto.randomUUID();localStorage.setItem('tokenriot-session',sessionId);}catch{sessionId='session-'+Date.now();}
const initialConsole='Type help, save, list, resume N, models, t, sa, s or exit.';
const primaryEconomy={get wallet(){return wallet;},set wallet(v){wallet=v;},get session(){return sessionId;},get queue(){return coinGrantQueue;},get sync(){return coinSync;},set sync(v){coinSync=v;},freeUses,pendingAmmo,pendingActivations,log:initialConsole};
const partnerEconomy={wallet:0,session:crypto.randomUUID(),queue:[],sync:null,freeUses:new Set(),pendingAmmo:new Map(),pendingActivations:new Map(),weapon:null,log:initialConsole};
function playerEconomy(actor=0){return actor===1?partnerEconomy:primaryEconomy;}
function actorCompany(actor=consolePlayer){return actor===1?playerCompanies[1]:company;}
function actorWeapon(actor=consolePlayer){return actor===1?game.partner.loadout.weapon:game.weapon;}
function actorWallet(actor=consolePlayer){return playerEconomy(actor).wallet;}
function actorCall(actor,fn){return game.forPlayer(actor,fn);}
function overlayOpen(){return saveBusy||resumeBusy||!$('#resume-panel').hidden||knowledge.open||!$('#settings-panel').hidden||!$('#combat-terminal').hidden;}
function resetControls(){if(game){game.releaseFire();if(game.partner)game.forPlayer(1,()=>game.releaseFire());}heldControlKeys.clear();for(const controls of [input,partnerInput])Object.keys(controls).forEach(k=>controls[k]=false);lastGameTime=null;}

function refreshResume(){const count=savedGames.runs().filter(save=>save.players===1||!document.body.classList.contains?.('mobile-app')).length;$('#resume-open').disabled=!count;$('#resume-open').title=count?'Resume saved game':'No saved games yet';}
function savedRunLabel(save){return save.character+' · '+save.company+' · '+tr('STAGE')+' '+save.stageNumber+' · '+tr(save.difficulty[0].toUpperCase()+save.difficulty.slice(1));}
function renderSaveSlots(){$('#save-game-controls').hidden=true;}
async function saveCurrentRun(returnToTitle=false){
 if(saveBusy||resumeBusy||state!=='arena'||!game||!['combat','boss','advance'].includes(game.phase))return false;
 if(abilityBusy||modelPickerBusy||primaryEconomy.ammoBusy||partnerEconomy.ammoBusy){$('#save-game-status').textContent='Wait for the current action to finish.';return false;}
 saveBusy=true;resetControls();$('#save-game').disabled=true;$('#save-game-title').disabled=true;$('#save-game-status').textContent='Saving game...';
 try{processCoinRewards(performance.now());await Promise.all(Array.from({length:playerCount},(_,actor)=>flushCoinRewards(actor)));
 const checkpoints=await Promise.all(Array.from({length:playerCount},async(_,actor)=>{const checkpointId=crypto.randomUUID();await requestLLM('token-wallet',{},actor);await requestLLM('checkpoint',{checkpointId},actor);return checkpointId;}));
 const accounts=Array.from({length:playerCount},(_,actor)=>{const a=playerEconomy(actor);return {session:a.session,checkpointId:checkpoints[actor],wallet:a.wallet,freeUses:a.freeUses,pendingAmmo:a.pendingAmmo,pendingActivations:a.pendingActivations,log:a.log};});
 const data={game,players:playerCount,difficulty,selected,company,playerCompanies:[...playerCompanies],playerCharacters:[...playerCharacters],mapIndex,completedStages,introducedStages:[...introducedStages],continuesUsed,arcadeCredits,accounts,learning:knowledge.snapshot()};
 const checkpoint=await savedGames.add(activeRunId,{character:selected,company,difficulty,players:playerCount,stage:game.stage,stageNumber:stageNumber(game.stage),zone:game.zone,tokens:wallet+ (playerCount===2?partnerEconomy.wallet:0),payload:packRun(data)});
 $('#save-game-status').textContent=tr('Checkpoint saved.')+' '+checkpoint.checkpoint;refreshResume();if(returnToTitle){capturingControl=null;$('#settings-panel').hidden=true;replay();}return checkpoint;
 }catch(error){$('#save-game-status').textContent=tr('Could not save game: ')+error.message;return false;}finally{saveBusy=false;$('#save-game').disabled=false;$('#save-game-title').disabled=false;}
}
function openResume(){if(saveBusy||resumeBusy||state!=='difficulty')return;const list=$('#resume-list');list.textContent='';$('#resume-status').textContent='';for(const save of savedGames.runs().sort((a,b)=>b.savedAt.localeCompare(a.savedAt))){const button=document.createElement('button');button.type='button';button.className='resume-slot';const title=document.createElement('strong');title.textContent=savedRunLabel(save);const info=document.createElement('span');info.textContent=new Date(save.savedAt).toLocaleString(({en:'en-US',es:'es-AR','zh-CN':'zh-CN'}[document.documentElement?.lang]||'en-US'),{dateStyle:'short',timeStyle:'short'})+' · '+tr('CHECKPOINT')+' '+save.checkpoint+' · '+tr('ENCOUNTER')+' '+(save.zone+1)+' · TR × '+save.tokens;button.append(title);button.append(info);button.disabled=document.body.classList.contains?.('mobile-app')&&save.players===2;if(button.disabled)info.textContent+=' · '+tr('PC only');button.onclick=()=>resumeSavedRun(save.slot);list.append(button);}if(!savedGames.runs().length)$('#resume-status').textContent='No saved games yet';$('#difficulty-picker').hidden=true;$('#resume-panel').hidden=false;$('#resume-back').focus();}
async function resumeSavedRun(slot){
 if(resumeBusy||saveBusy)return;resumeBusy=true;$('#resume-status').textContent='Loading saved game...';$('#resume-back').disabled=true;for(const button of $('#resume-list').querySelectorAll('button'))button.disabled=true;
 try{const save=savedGames.get(slot);if(!save)throw Error('Saved game not found');const data=unpackRun(save.payload),restored=restoreSavedGame(data,MissionBayGame);if(data.players===2&&document.body.classList.contains?.('mobile-app'))throw Error('PC only');
 const sessions=data.accounts.map(()=>crypto.randomUUID()),balances=await Promise.all(data.accounts.map(async(account,actor)=>{const response=await fetch('/api/llm',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'resume-run',session:sessions[actor],sourceSession:account.session,checkpointId:account.checkpointId})}),result=await response.json();if(!response.ok)throw Error(result.error||'Could not restore saved balance');if(!Number.isFinite(result.wallet))throw Error('Invalid saved balance');return result.wallet;}));
 resetControls();capturingControl=null;closeModelPicker();badgeRewards.cancel();knowledge.restore(data.learning);resultsRequest++;finalSummary=null;resultsLoading=false;resultsError='';activeRunId=save.runId;game=restored;difficulty=data.difficulty;selected=data.selected;company=data.company;playerCount=data.players;playerCompanies.splice(0,2,...data.playerCompanies);playerCharacters=[...data.playerCharacters];mapIndex=data.mapIndex;completedStages=data.completedStages;introducedStages=new Set(data.introducedStages);continuesUsed=data.continuesUsed;arcadeCredits=data.arcadeCredits;sessionId=sessions[0];partnerEconomy.session=sessions[1]||crypto.randomUUID();coinFlights=[];coinGrantQueue=[];coinSync=null;partnerEconomy.queue=[];partnerEconomy.sync=null;
 for(let actor=0;actor<playerCount;actor++){const a=playerEconomy(actor),saved=data.accounts[actor];a.wallet=balances[actor];a.freeUses.clear();for(const key of saved.freeUses)a.freeUses.add(key);a.pendingAmmo.clear();for(const [key,value] of saved.pendingAmmo)a.pendingAmmo.set(key,value);a.pendingActivations.clear();for(const [key,value] of saved.pendingActivations)a.pendingActivations.set(key,value);a.log=saved.log;}
 campaignWeapon=game.weapon;partnerEconomy.weapon=game.partner?.loadout.weapon||null;rememberHealth();consolePlayer=0;game.learningEvents=[];game.soundEvents=[];$('#resume-panel').hidden=true;$('#settings-panel').hidden=true;$('#combat-terminal').hidden=true;$('#combat-notice').hidden=true;$('#player-count').value=String(playerCount);renderTokenBalance();startArena();return true;
 }catch(error){$('#resume-status').textContent=tr('Could not resume game: ')+error.message;for(const button of $('#resume-list').querySelectorAll('button'))button.disabled=false;return false;}finally{resumeBusy=false;$('#resume-back').disabled=false;}
}
$('#save-game').onclick=()=>saveCurrentRun();$('#save-game-title').onclick=()=>saveCurrentRun(true);$('#resume-open').onclick=openResume;$('#resume-back').onclick=closeOverlay;

function openLearningCenter(actor=0){if(state!=='arena'||!game||overlayOpen()||abilityBusy||modelPickerBusy||primaryEconomy.ammoBusy||partnerEconomy.ammoBusy)return false;if(!game.interactLearning(actor))return false;knowledge.pickup();return true;}
function openSettings(){if(knowledge.open||saveBusy||resumeBusy)return;renderSaveSlots();resetControls();draftBindings=JSON.parse(JSON.stringify(controlBindings));capturingControl=null;renderControlSettings();$('#settings-status').textContent='Choose an action to change its key. Ctrl+C: P1 terminal. Ctrl+P: P2 terminal.';$('#settings-panel').hidden=false;$('#settings-back').focus();}
function closeOverlay(){if(saveBusy||resumeBusy)return;if(!$('#resume-panel').hidden){$('#resume-panel').hidden=true;$('#difficulty-picker').hidden=state!=='difficulty';$('#resume-open').focus();return;}if(knowledge.open){knowledge.close();return;}closeModelPicker();capturingControl=null;$('#settings-panel').hidden=true;$('#combat-terminal').hidden=true;resetControls();canvas.focus();}
function openConsole(actor=0){if(knowledge.open)return;if(saveBusy||resumeBusy||state!=='arena'||!game||(actor===1&&!game.partner)||abilityBusy||modelPickerBusy||primaryEconomy.ammoBusy||partnerEconomy.ammoBusy)return;closeModelPicker();consolePlayer=actor;if(game)game.consolePlayer=actor;$('#combat-log').textContent=tr(playerEconomy(actor).log);resetControls();consoleOpenedAt=performance.now();$('#combat-terminal').hidden=false;$('#combat-prompt').textContent='P'+(actor+1)+' '+playerCharacters[actor]+'@ai:~$';$('#combat-input').value='';$('#combat-input').focus();}
$('#settings-open').onclick=openSettings;$('#challenge-settings').onclick=openSettings;$('#settings-back').onclick=closeOverlay;$('#console-close').onclick=closeOverlay;$('#console-open').onclick=()=>openConsole(0);$('#console-open-p2').onclick=()=>openConsole(1);
$('#controls-reset').onclick=()=>{draftBindings=JSON.parse(JSON.stringify(defaultBindings));capturingControl=null;renderControlSettings();$('#settings-status').textContent='Defaults restored. Save to keep them.';};
$('#settings-form').onsubmit=e=>{e.preventDefault();try{localStorage.setItem('tokenriot-controls',JSON.stringify(draftBindings));controlBindings=JSON.parse(JSON.stringify(draftBindings));closeOverlay();}catch{$('#settings-status').textContent='Could not save controls. Browser storage is unavailable.';}};

async function requestLLM(action,extra={},actor=0){if(!['knowledge','collect','wallet','token-wallet','activate','ammo','settle','checkpoint','resume-run'].includes(action))throw Error('AI missions are currently disabled. Type help for game commands.');const account=playerEconomy(actor),requestSession=account.session;const response=await fetch('/api/llm',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({session:requestSession,action,stage:game?.stage??0,company:actorCompany(actor),character:playerCharacters[actor],...extra})});const result=await response.json();if(!response.ok)throw Error(result.error||'Game request failed');if(requestSession===account.session&&Number.isFinite(result.wallet)){account.wallet=result.wallet+account.queue.reduce((n,e)=>n+(e.kind==='boss'?10:1),0);renderTokenBalance();}return result;}

function listConsoleSaves(){const checkpoints=savedGames.list(activeRunId).sort((a,b)=>a.checkpoint-b.checkpoint);logConsole(checkpoints.length?tr('CURRENT GAME CHECKPOINTS')+'\n\n'+checkpoints.map(save=>tr('CHECKPOINT')+' '+save.checkpoint+' · '+savedRunLabel(save)+'\n'+new Date(save.savedAt).toLocaleString(({en:'en-US',es:'es-AR','zh-CN':'zh-CN'}[document.documentElement?.lang]||'en-US'))+' · TR × '+save.tokens).join('\n\n')+'\n\n'+tr('Use resume N to return to a checkpoint.'):tr('No checkpoints in this game yet. Type save.'));}
async function consoleSaveCommand(command){
 const words=command.split(' '),name=words[0];if(!['save','list','resume','load'].includes(name))return false;
 if(saveBusy||resumeBusy){logConsole('Wait for the current action to finish.');return true;}
 if(state!=='arena'||!game){logConsole('Checkpoints are available during gameplay.');return true;}
 if(name==='list'){if(words.length!==1)logConsole('Use list to see checkpoints.');else listConsoleSaves();return true;}
 if(name==='save'&&words.length!==1){logConsole('Use save to create a new checkpoint.');return true;}
 if(name!=='save'&&(words.length>2||(words.length===2&&!/^[1-9][0-9]*$/.test(words[1])))){logConsole('Use resume N to return to a checkpoint.');return true;}
 if(name!=='save'&&words.length===1){listConsoleSaves();return true;}
 const field=$('#combat-input');field.disabled=true;
 try{if(name==='save'){logConsole('Saving checkpoint...');const checkpoint=await saveCurrentRun();if(checkpoint)logConsole(tr('Checkpoint saved.')+' '+checkpoint.checkpoint);else logConsole($('#save-game-status').textContent||tr('Cannot save a checkpoint right now.'));}else{const checkpoint=savedGames.list(activeRunId).find(save=>save.checkpoint===Number(words[1]));if(!checkpoint){logConsole('Checkpoint not found in this game. Type list.');return true;}logConsole('Loading checkpoint...');if(!await resumeSavedRun(checkpoint.slot))logConsole($('#resume-status').textContent);}}
 finally{field.disabled=false;if(!$('#combat-terminal').hidden)field.focus();}return true;
}

function logConsole(text){const el=$('#combat-log'),account=playerEconomy(consolePlayer);account.log+='\n\n'+text;el.textContent=tr(account.log);el.scrollTop=el.scrollHeight;}
onGameLanguageChange(()=>{renderTokenBalance();$('#combat-log').textContent=tr(playerEconomy(consolePlayer).log);});
function renderTokenBalance(){$('#wallet-player').hidden=playerCount!==2;$('#wallet-count').textContent=wallet.toLocaleString('en-US');$('#wallet').setAttribute('aria-label',(playerCount===2?'P1 ':'')+'Tokens '+wallet);$('#wallet-p2').hidden=playerCount!==2;$('#wallet-count-p2').textContent=partnerEconomy.wallet.toLocaleString('en-US');$('#wallet-p2').setAttribute('aria-label','P2 Tokens '+partnerEconomy.wallet);}
function abilityPrice(spec){return !spec.paidOnly&&actorWeapon().tier===0&&['tool','skill'].includes(spec.group)&&!playerEconomy(consolePlayer).freeUses.has(game.stage+':'+spec.group)?0:spec.cost;}
function abilityList(group){
 const entries=Object.entries(abilityCatalog).filter(([,a])=>a.group===group);
 const free=entries.some(([,a])=>abilityPrice(a)===0);
 const rows=entries.flatMap(([id,a])=>(group==='subagent'?['sa linus','sa uncle']:[(group==='tool'?'t':'s')+' '+id]).map(command=>command+'  |  '+abilityPrice(a)+' TOKENS NOW'+(abilityPrice(a)!==a.cost?'  (normally '+a.cost+')':'')+'\n  '+a.description));
 logConsole(group.toUpperCase()+'S — Balance: '+actorWallet()+' TOKENS\n'+(free?'One FREE activation remaining, shared by this category.\nPrices below apply after that free activation.':'Listed prices apply. Free tool/skill uses require the basic model.')+'\n\n'+(rows.join('\n\n')||'Catalog unavailable. Reload the game.'));
}
async function activateConsoleAbility(id,variant){
 const spec=Object.hasOwn(abilityCatalog,id)?abilityCatalog[id]:null;if(!spec){logConsole('Unknown ability. Type tools, subagents or skills.');return;}
 if(abilityBusy){logConsole('Activation in progress.');return;}
 if(!actorCall(consolePlayer,()=>game.canActivateAbility(id))){logConsole('Already active, no available targets, or combat is over.');return;}
 const actor=consolePlayer,account=playerEconomy(actor);abilityBusy=true;$('#combat-input').disabled=true;
 try{await flushCoinRewards(actor);const price=abilityPrice(spec);if(account.wallet<price){logConsole('Not enough tokens: '+price+' required; '+actorWallet()+' available.');return;}
  const purchaseId=account.pendingActivations.get(id)||crypto.randomUUID();account.pendingActivations.set(id,purchaseId);const receipt=await requestLLM('activate',{ability:id,purchaseId,tier:actorWeapon(actor).tier},actor);if(receipt.free)account.freeUses.add(game.stage+':'+spec.group);
  if(!actorCall(actor,()=>game.activateAbility(id,variant)))throw Error('Could not activate ability.');rememberHealth();account.pendingActivations.delete(id);
  logConsole(spec.name+' activated — '+receipt.cost+' tokens. Balance: '+actorWallet()+' tokens.');closeOverlay();
 }catch(error){logConsole(error.message);}finally{abilityBusy=false;$('#combat-input').disabled=false;}
}
$('#combat-form').onsubmit=async e=>{
 e.preventDefault();const field=$('#combat-input'),text=field.value.trim();if(!text||field.disabled)return;field.value='';closeModelPicker();logConsole('> '+text);const command=normalizeConsoleCommand(text);
 if(await consoleSaveCommand(command))return;
 if((state!=='arena'||!game)&&!['help','clear','exit','settings'].includes(command)){logConsole('Start or resume a game before using combat commands.');return;}
 switch(command){
 case 'help':logConsole('CONTROLS\n\n'+controlBindings.slice(0,document.body.classList.contains?.('mobile-app')?1:2).map((bindings,i)=>'PLAYER '+(i+1)+'\n'+Object.entries(bindings).map(([action,keys])=>action.toUpperCase()+': '+keys.map(keyLabel).join(' / ')).join('\n')).join('\n\n')+'\nUp to 3 shots per fire press\nCTRL+C: Player 1 terminal · CTRL+P: Player 2 terminal\nENTER: advance story / continue\n\nLEARN: approach a Learning Center and press V\n\nCONSOLE COMMANDS — 0 TOKENS\n\nhelp, models, tools (t), subagents (sa), skills (s), status, learn, clear, exit / salir, settings\n\nsave: create a checkpoint\nlist: this game’s checkpoints · resume N: return to checkpoint N\n\nMODEL COMMANDS\n'+(combatModels.brands[actorCompany()]||[]).map(name=>'model '+name).join('\n')+'\nType models, use arrows to choose, then Enter. Damage and costs are shown.\n\nTOOLS — t lists costs\nt drone · t double · t shield · t vacuum (20 tokens / 25s)\n\nSKILLS — s lists costs\ns jump · s both · s wave · s heal (5 tokens / +20 energy)\n\nSUBAGENTS — sa lists costs\nsa linus · sa uncle (or just linus / uncle)');return;
 case 'model':case 'models':listCombatModels();return;
 case 'tools':abilityList('tool');return;
 case 'subagents':case 'sub-agents':abilityList('subagent');return;
 case 'skills':case 'skilss':abilityList('skill');return;
 case 'status':{const info=actorCall(consolePlayer,()=>game.snapshot());logConsole('PLAYER STATUS\n\n'+playerCharacters[consolePlayer]+'  |   Health: '+Math.ceil(info.health)+'\nBalance: '+actorWallet()+' TOKENS\n\nMODEL\n'+info.model.name+'  |  Damage: '+info.model.damage+'\nAmmo: '+(info.model.ammo===null?'unlimited / 0 TOKENS':info.model.ammo+' prepaid projectiles')+'\n\nSUPPORT\nDrone: '+info.droneSeconds.toFixed(1)+'s  |  Subagent: '+info.helperSeconds.toFixed(1)+'s\nVacuum: '+info.vacuumSeconds.toFixed(1)+'s / '+info.vacuumCaptured+' captured\n\nUse tools, skills or subagents to see activation costs.');return;}
 case 'clear':$('#combat-log').textContent='';playerEconomy(consolePlayer).log='';return;
 case 'learn':case 'books':if(knowledge.library(consolePlayer)){closeModelPicker();$('#combat-terminal').hidden=true;}else logConsole('Visit a Learning Center in this stage first.');return;
 case 'exit':closeOverlay();return;
 case 'settings':openSettings();return;
 }
 const modelMatch=command.match(/^(?:model|modelo) (.+)$/);if(modelMatch){await selectCombatModel(modelMatch[1]);return;}
 const words=command.split(' ');if(['subagent','subagents','sub-agent','sub-agents'].includes(words[0])){words.shift();const who=words.join('-');if(!['linus','linus-torvalds','torvalds','uncle-bob','bob'].includes(who)){logConsole('Use sa linus or sa uncle');return;}await activateConsoleAbility('helper',['uncle-bob','bob'].includes(who)?'uncle-bob':'linus');return;}if(['tool','tools','skill','skills','use'].includes(words[0]))words.shift();
 if(['self-healing','selfhealing'].includes(words[0]))words[0]='heal';
 if(Object.hasOwn(abilityCatalog,words[0])){const variant=words.slice(1).join('-');if(words[0]==='helper'&&variant&&!['linus','linus-torvalds','uncle-bob','bob'].includes(variant)){logConsole('Use sa linus or sa uncle');return;}await activateConsoleAbility(words[0],['uncle-bob','bob'].includes(variant)?'uncle-bob':'linus');return;}
 logConsole('Unknown command. Type help to see available commands.');
};

function beginContract(){
 // Interstage challenges are temporarily paused; keep their implementation for later.
 if(!game||!['arena','defeat'].includes(state))return;
 completedStages=Math.max(completedStages,stageNumber(game.stage));
 if(game.stage===6){rememberHealth();game=null;openFlight();}else if(nextStage(game.stage)===null)openResults();else openMap(nextStage(game.stage));
}
async function generateContract(){if(requestBusy)return;requestBusy=true;$('#challenge-retry').hidden=true;$('#challenge-log').textContent='Generating mission…';try{await flushCoinRewards();contract=await requestLLM('generate');missionQuestions=contract.questionsRemaining??3;updateMissionMode();$('#challenge-log').textContent=contract.title+'\n'+contract.problem+'\nObstacle: '+contract.obstacle+'\nObjective: '+contract.objective+'\nAvailable reward: up to '+contract.payment;$('#mission-cost').textContent='1 token / 200 input tokens · three free questions about constraints';$('#challenge-form').hidden=false;$('#challenge-input').focus();}catch(error){$('#challenge-log').textContent=error.message;$('#challenge-retry').hidden=false;}finally{requestBusy=false;}}
$('#challenge-retry').onclick=generateContract;
$('#challenge-form').onsubmit=async e=>{e.preventDefault();if(requestBusy||contractDone||!contract)return;const field=$('#challenge-input'),proposal=field.value.trim(),asking=$('#challenge-mode').value==='question';if(!proposal)return;if(asking&&(missionQuestions<=0||proposal.length>300)){$('#mission-cost').textContent=missionQuestions<=0?'No clarification questions left.':'Keep questions under 300 characters.';return;}requestBusy=true;field.disabled=true;clearTimeout(quoteTimer);$('#challenge-log').textContent+='\n$ '+proposal+'\n'+(asking?'Asking about constraints…':'Evaluating solution…');try{const result=await requestLLM(asking?'clarify':'evaluate',{id:contract.id,proposal});missionQuestions=result.questionsRemaining??missionQuestions;updateMissionMode();$('#challenge-log').textContent+='\n'+result.feedback;if(!asking){$('#challenge-log').textContent+='\nInput tokens: '+(result.tokensEstimated?'~':'')+result.tokens+' · Cost: '+result.cost+(result.success?'\nMISSION COMPLETE // +'+result.reward:'\nRevise your solution and try again.');}field.value='';if(result.success){contractDone=true;$('#challenge-form').hidden=true;$('#challenge-continue').hidden=false;$('#challenge-continue').focus();}}catch(error){$('#challenge-log').textContent+='\n'+error.message;}finally{requestBusy=false;field.disabled=false;$('#challenge-log').scrollTop=$('#challenge-log').scrollHeight;if(!contractDone)field.focus();}};
function updateMissionMode(){const select=$('#challenge-mode');select.options?.[1]&&(select.options[1].textContent='Ask a question ('+missionQuestions+' left)');}
$('#challenge-mode').onchange=()=>{clearTimeout(quoteTimer);$('#mission-cost').textContent=$('#challenge-mode').value==='question'?'Free: ask a short question about the mission restrictions ('+missionQuestions+' left).':'1 token / 200 input tokens. Cost includes the mission context.';};
$('#challenge-input').oninput=()=>{clearTimeout(quoteTimer);if(!contract||contractDone||requestBusy||$('#challenge-mode').value==='question')return;const proposal=$('#challenge-input').value.trim();if(!proposal)return;quoteTimer=setTimeout(async()=>{try{const quote=await requestLLM('quote',{id:contract.id,proposal});$('#mission-cost').textContent='Estimated input: ~'+quote.estimatedTokens+' tokens · ~$'+quote.estimatedCost+' · balance '+wallet;}catch(error){$('#mission-cost').textContent=error.message;}},300);};
$('#challenge-back').onclick=()=>{if(requestBusy)return;clearTimeout(quoteTimer);document.body.classList.remove('challenge-mode');$('#challenge-terminal').hidden=true;const stage=game?.stage??0;rememberHealth();game=null;openMap(stage);};
function continueContract(){if(!contractDone)return;completedStages=Math.max(completedStages,stageNumber(game.stage));document.body.classList.remove('challenge-mode');$('#challenge-terminal').hidden=true;$('#challenge-input').value='';nextStage(game.stage)===null?openEnding():openMap(nextStage(game.stage));}
$('#challenge-continue').onclick=continueContract;
// Some embedded browsers translate Ctrl+C into a copy event before bubbling keydown.
document.addEventListener('copy',e=>{if(state==='arena'&&!overlayOpen()&&!['INPUT','TEXTAREA'].includes(e.target?.tagName)){e.preventDefault();openConsole();}});

function beginStart(){openDifficulty();}
function openDifficulty(){refreshResume();cancelAnimationFrame(raf);state='difficulty';epoch=performance.now();elapsed=0;manual=false;show(null);chooseDifficulty(difficulty);playMusic(soundtrack);canvas.focus();raf=requestAnimationFrame(tick);}
function chooseDifficulty(value){difficulty=value;$('#difficulty-options').setAttribute('aria-activedescendant','difficulty-'+value);document.querySelectorAll('[data-difficulty]').forEach(button=>{const active=button.dataset.difficulty===value;button.setAttribute('aria-selected',String(active));});}
document.querySelectorAll('[data-difficulty]').forEach(button=>button.onclick=()=>{chooseDifficulty(button.dataset.difficulty);canvas.focus();});

async function loadServerDefaults(){try{const response=await fetch('/api/config');if(!response.ok)return;const defaults=await response.json();abilityCatalog=defaults.abilities||{};combatModels=defaults.combatModels||combatModels;await requestLLM('token-wallet');}catch{}}

function processCoinRewards(now){if(!game?.rewardEvents?.length)return;for(const event of game.rewardEvents.splice(0)){const actor=event.owner===1&&playerCount===2?1:0,account=playerEconomy(actor),value=event.kind==='boss'?10:1;coinFlights.push({x:event.x-game.camera,y:event.y,start:now,value,owner:actor});account.queue.push({id:event.id,kind:event.kind});account.wallet+=value;}renderTokenBalance();for(let actor=0;actor<playerCount;actor++)flushCoinRewards(actor).catch(()=>{});}
async function flushCoinRewards(actor=0){const account=playerEconomy(actor);if(account.sync){await account.sync;if(account.queue.length)return flushCoinRewards(actor);return;}if(!account.queue.length)return;const session=account.session,batch=account.queue.splice(0,200);account.sync=requestLLM('collect',{events:batch},actor);try{await account.sync;}catch(error){if(session===account.session)account.queue.unshift(...batch);throw error;}finally{account.sync=null;}if(account.queue.length)return flushCoinRewards(actor);}
function drawCoinFlights(now){const bounds=canvas.getBoundingClientRect?.(),hud=$('#wallet').getBoundingClientRect?.();const tx=bounds?.width&&hud?.width?(hud.left+hud.width/2-bounds.left)/bounds.width*1280:1100,ty=bounds?.height&&hud?.height?(hud.top+hud.height/2-bounds.top)/bounds.height*720:30;coinFlights=coinFlights.filter(coin=>now-coin.start<850);for(const coin of coinFlights){const targetHud=coin.owner===1?$('#wallet-p2').getBoundingClientRect?.():hud;const targetX=bounds?.width&&targetHud?.width?(targetHud.left+targetHud.width/2-bounds.left)/bounds.width*1280:tx;const targetY=bounds?.height&&targetHud?.height?(targetHud.top+targetHud.height/2-bounds.top)/bounds.height*720:ty;const p=Math.max(0,Math.min(1,(now-coin.start)/850)),ease=1-(1-p)**2,x=coin.x+(targetX-coin.x)*ease,y=coin.y+(targetY-coin.y)*ease-Math.sin(p*Math.PI)*110,r=coin.value===10?18:11;c.save();c.globalAlpha=(1-p)**.4;c.shadowColor='#62edff';c.shadowBlur=12;c.translate(x,y);c.scale(Math.max(.18,Math.abs(Math.cos(p*12))),1);c.fillStyle='#d6a349';c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.fill();c.strokeStyle='#fff1a4';c.lineWidth=2;c.stroke();c.shadowBlur=0;c.fillStyle='#3d361e';c.font='bold '+Math.round(r*.85)+'px monospace';c.textAlign='center';c.fillText('TR',0,r*.3);c.restore();}}

function closeModelPicker(){modelPickerIndex=null;$('#model-picker').hidden=true;$('#combat-input').disabled=false;}
function renderModelPicker(){const host=$('#model-picker'),names=combatModels.brands[actorCompany()]||[];host.hidden=false;host.textContent='';const heading=document.createElement('p');heading.textContent=actorCompany()+' MODELS — '+actorWallet()+' TOKENS · ↑/↓ choose · Enter select · Esc Back';host.append(heading);names.forEach((name,i)=>{const option=document.createElement('button'),tier=combatModels.tiers[i];option.type='button';option.id='combat-model-'+i;option.setAttribute('role','option');option.setAttribute('aria-selected',String(modelPickerIndex===i));option.tabIndex=-1;option.textContent=(modelPickerIndex===i?'▶ ':'  ')+name+(actorWeapon()?.tier===i?' [ACTIVE]':'')+'\nDamage '+tier.damage+' · '+(i?tier.cost+' TOKENS / projectile':'0 TOKENS / unlimited projectiles');option.onclick=()=>{modelPickerIndex=i;confirmModelPicker();};host.append(option);});host.setAttribute('aria-activedescendant','combat-model-'+modelPickerIndex);}
function listCombatModels(){modelPickerIndex=actorWeapon()?.tier||0;renderModelPicker();$('#model-picker').focus();}
async function confirmModelPicker(){if(modelPickerBusy||modelPickerIndex===null)return;modelPickerBusy=true;const name=combatModels.brands[actorCompany()][modelPickerIndex];try{await selectCombatModel(name);}finally{modelPickerBusy=false;if(modelPickerIndex!==null){renderModelPicker();$('#model-picker').focus();}}}
function handleModelPickerKey(e){if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Home','End','Enter','Escape'].includes(e.key)){e.preventDefault();if(modelPickerBusy)return true;if(e.key==='Escape'){closeModelPicker();$('#combat-input').focus();return true;}if(e.key==='Enter'){if(!e.repeat)confirmModelPicker();return true;}const count=combatModels.brands[actorCompany()].length;modelPickerIndex=e.key==='Home'?0:e.key==='End'?count-1:(modelPickerIndex+(['ArrowUp','ArrowLeft'].includes(e.key)?count-1:1))%count;renderModelPicker();return true;}return false;}
async function buyCombatAmmo(tier,actor=consolePlayer){
 const account=playerEconomy(actor);if(account.ammoBusy||!game)return false;account.ammoBusy=true;const weapon=actorWeapon(actor),activeSession=account.session;
 try{await flushCoinRewards(actor);const spec=combatModels.tiers[tier];if(account.wallet<spec.cost)return false;const count=Math.max(1,actorCall(actor,()=>game.volleySize)-weapon.ammo[tier]);const required=spec.cost*count;if(account.wallet<required)return false;const pending=account.pendingAmmo.get(tier)||{id:crypto.randomUUID(),count};account.pendingAmmo.set(tier,pending);const receipt=await requestLLM('ammo',{tier,count:pending.count,purchaseId:pending.id},actor);if(activeSession!==account.session)return false;weapon.ammo[tier]+=receipt.shots;account.pendingAmmo.delete(tier);return true;
 }catch(error){if(/not enough tokens/i.test(error.message))restoreFreeModel(actor);else logConsole(error.message);return false;}finally{account.ammoBusy=false;}
}
async function selectCombatModel(value){
 value=value.trim().toLowerCase().replace(/\s+/g,' ');
 const names=combatModels.brands[actorCompany()]||['Basic','Advanced','Elite'];const tier=['basic','default'].includes(value)?0:/^[123]$/.test(value)?Number(value)-1:names.findIndex(n=>n.toLowerCase()===value);
 if(tier<0||tier>2){logConsole('Use models to list your brand, then type model followed by its full name.');return;}
 if(playerEconomy(consolePlayer).ammoBusy){logConsole('Authorizing a projectile.');return;}
 if(tier&&actorWallet()<combatModels.tiers[tier].cost&&actorWeapon().ammo[tier]===0){logConsole('Not enough tokens. '+names[tier]+' needs '+combatModels.tiers[tier].cost+' tokens per projectile.');return;}
 actorWeapon().tier=tier;actorWeapon().damage=combatModels.tiers[tier].damage;actorWeapon().name=names[tier];logConsole(names[tier]+' active — damage '+actorWeapon().damage+(tier?' / '+actorWeapon().ammo[tier]+' prepaid shots':' / unlimited shots'));closeOverlay();
}
let tokenNoticeUntil=0;
function restoreFreeModel(actor){const weapon=actorWeapon(actor),p=actor===1?game.partner:game.player,controls=actor===1?partnerInput:input,oldName=weapon.name;weapon.tier=0;weapon.damage=combatModels.tiers[0].damage;weapon.name=combatModels.brands[actorCompany(actor)][0];actorCall(actor,()=>game.releaseFire());p.needsFireRelease=!!controls.fire;const message='P'+(actor+1)+' — Not enough tokens for '+oldName+'. FREE MODEL: '+weapon.name+'. Open '+(actor?'Ctrl+P':'Ctrl+C')+' to choose another model.';playerEconomy(actor).log+='\n\n'+message;$('#combat-notice').textContent=message;$('#combat-notice').hidden=false;tokenNoticeUntil=performance.now()+6500;}
function refillCombatAmmo(){if(game?.learningEvents?.length)return;for(let actor=0;actor<playerCount;actor++){const weapon=actorWeapon(actor),p=actor===1?game.partner:game.player,controls=actor===1?partnerInput:input,account=playerEconomy(actor);if(!p||!weapon.tier||account.ammoBusy||actorCall(actor,()=>game.vacuum))continue;const size=actorCall(actor,()=>game.volleySize);if(weapon.ammo[weapon.tier]>=size)continue;const tier=weapon.tier;if(account.wallet<combatModels.tiers[tier].cost*(size-weapon.ammo[tier])){restoreFreeModel(actor);continue;}if(!controls.fire||p.shot>0||p.hp<=0||(p.fireHeld&&p.burstRemaining<=0))continue;buyCombatAmmo(tier,actor);}}

$('#results-continue').onclick=()=>{if(state==='results'&&!resultsLoading)openEnding('credits');};
function openResults(){
 finalSummary={tokens:wallet,...knowledge.score(playerCount,wallet),badges:knowledge.rewards(playerCount),waterPercent:Math.ceil(Math.max(0,game.waterRemaining)/game.waterLimit*100)};resultsError='';resultsLoading=true;cancelAnimationFrame(raf);resetControls();state='results';manual=false;epoch=null;elapsed=0;show(null);playMusic(menuMusic);canvas.focus();raf=requestAnimationFrame(tick);valueFinalRun();
}
async function valueFinalRun(){
 const request=++resultsRequest;resultsLoading=true;resultsError='';try{const results=await Promise.all(Array.from({length:playerCount},async(_,actor)=>{await flushCoinRewards(actor);return (await requestLLM('settle',{},actor)).result;}));if(request!==resultsRequest)return;finalSummary={...results[0],waterPercent:finalSummary.waterPercent};if(playerCount===2){finalSummary.players=results.map((result,i)=>({...result,character:playerCharacters[i]}));for(const key of ['tokens','usd','earnedTokens','spentTokens'])finalSummary[key]=results.reduce((sum,r)=>sum+r[key],0);}Object.assign(finalSummary,knowledge.score(playerCount,finalSummary.tokens),{badges:knowledge.rewards(playerCount)});epoch=null;elapsed=0;}catch(error){if(request===resultsRequest)resultsError=error.message;}finally{if(request===resultsRequest)resultsLoading=false;}
}
