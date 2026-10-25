// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import {createLearningCenters,enterLearningCenter,nearbyLearningCenter} from './learning-centers.js';
// Deterministic belt-scrolling combat simulation, independent of Canvas and browser APIs.
export const PLAYER_MAX_HEALTH=60;
export const PETS=[
 {name:'Null Signal',hp:4,speed:31,fly:false,color:'#b95786'},
 {name:'Codex',hp:3,speed:43,fly:false,color:'#797bff'},
 {name:'Dewey',hp:3,speed:38,fly:true,color:'#6ee9ff'},
 {name:'Fireball',hp:3,speed:51,fly:true,color:'#ffab44'},
 {name:'Hoots',hp:5,speed:26,fly:true,color:'#ee942d'},
 {name:'Rocky',hp:6,speed:19,fly:false,color:'#bbac8b'},
 {name:'Seedy',hp:3,speed:37,fly:false,color:'#9bca6a'},
 {name:'Stacky',hp:6,speed:22,fly:false,color:'#9792b9'},
 {name:'BSOD',hp:4,speed:40,fly:true,color:'#58b5ff'},
 {name:'Dot Frog',hp:3,speed:48,fly:false,color:'#96d836'},
 {name:'Dot Blue',hp:4,speed:36,fly:false,color:'#43c5f9'},
 {name:'Dot Triangle',hp:5,speed:25,fly:false,color:'#f9d03c'},
 {name:'Dot DJ',hp:4,speed:42,fly:true,color:'#ff79ca'},
 {name:'Dot Pearl',hp:3,speed:46,fly:false,color:'#f5d4bb'},
 {name:'Dot Cobalt',hp:5,speed:34,fly:false,color:'#489bdf'},
 {name:'Dot Heart',hp:3,speed:48,fly:true,color:'#ff66c6'}
];
export const DIFFICULTIES={easy:{label:'Easy',extra:0,hp:0,shotInterval:3.5,spread:[0],bossRate:1},medium:{label:'Medium',extra:0,hp:0,shotInterval:3.5,spread:[0],bossRate:1},hard:{label:'Hard',extra:2,hp:1,shotInterval:1.8,spread:[-.14,0,.14],bossRate:1}};
let runSequence=0;
const cap=(x,a,b)=>Math.max(a,Math.min(b,x));
export class MissionBayGame{
 get weapon(){return this.player?.loadout?.weapon||this._weapon;}
 set weapon(v){if(this.player?.loadout)this.player.loadout.weapon=v;else this._weapon=v;}
 get boosts(){return this.player?.loadout?.boosts||this._boosts;}
 set boosts(v){if(this.player?.loadout)this.player.loadout.boosts=v;else this._boosts=v;}
 get drone(){return this.player?.loadout?this.player.loadout.drone:this._drone;}
 set drone(v){if(this.player?.loadout)this.player.loadout.drone=v;else this._drone=v;}
 get helper(){return this.player?.loadout?this.player.loadout.helper:this._helper;}
 set helper(v){if(this.player?.loadout)this.player.loadout.helper=v;else this._helper=v;}
 get vacuum(){return this.player?.loadout?.vacuum||null;}
 set vacuum(value){this.player.loadout.vacuum=value;}
 get captiveCount(){return (this.players||[this.player]).reduce((sum,p)=>sum+(p.loadout.vacuum?.captured.length||0),0);}
 forPlayer(index,fn){const main=this.player;this.player=index===1?this.partner:main;try{return fn();}finally{this.player=main;}}
 constructor(character='Nano',company='OpenAI',bulletIndex=0,stage=0,difficulty='easy'){
  this.difficulty=Object.hasOwn(DIFFICULTIES,difficulty)?difficulty:'easy';this.rules=DIFFICULTIES[this.difficulty];
  this.stage=Math.max(0,Math.min(11,stage));this.enemyLogoIndex=[0,1,2,3,7,3,3,4,5,8,0,0][this.stage];
  this.character=character;this.company=company;this.bulletIndex=bulletIndex;this.time=0;this.zone=0;this.cleared=0;this.phase='combat';this.camera=0;this.weapon={tier:0,damage:1,name:'Basic',ammo:[Infinity,0,0]};this.sequence=0;
  this.hazards=[];this.hazardWarning=null;this.hazardTimer=5;this.hazardSequence=0;this.bikes=[];this.bikeTimer=4;this.bikeWarning=null;this.bikeSequence=0;this.boosts={double:0,shield:0,jump:0,both:0};this.drone=null;this.helper=null;this.supportShots=[];this.shockwaves=[];this.platforms=[];this.runId=Date.now().toString(36)+'-'+(++runSequence);this.rewardEvents=[];this.learningCenters=createLearningCenters(this.stage);this.learningEvents=[];
  this.player={x:180,y:580,hp:PLAYER_MAX_HEALTH,maxHp:PLAYER_MAX_HEALTH,face:1,invincible:0,shot:0,attack:0,moving:false,z:0,vz:0,crouching:false,guarding:false,jumpHeld:false,fireHeld:false,burstRemaining:0,totalShots:0};this.player.playerIndex=0;this.player.company=company;this.player.bulletIndex=bulletIndex;this.player.loadout={weapon:this._weapon,boosts:this._boosts,drone:null,helper:null};this.enemies=[];this.shots=[];this.hostile=[];this.particles=[];this.blobExplosions=[];this.soundEvents=[];this.soundSequence=0;this.boss=null;this.coBoss=null;this.waterRemaining=null;this.waterLimit={easy:32,medium:30,hard:28}[this.difficulty];this.shake=0;if(this.stage===10)this.spawnBoss();else this.spawnWave();
 }
 updateBikes(dt){
  if(this.stage!==2||['victory','gameover'].includes(this.phase))return;
  this.bikeTimer-=dt;
  if(!this.bikeWarning&&this.bikeTimer<=0&&['combat','boss'].includes(this.phase)){
   const fromLeft=this.difficulty!=='easy'&&this.bikeSequence%2===1;
   this.bikeWarning={remaining:1.2,y:this.nearestPlayer({x:this.player.x}).y,direction:fromLeft?1:-1};
  }
  if(this.bikeWarning){this.bikeWarning.remaining-=dt;if(this.bikeWarning.remaining<=0){const warning=this.bikeWarning;this.bikes.push({id:++this.bikeSequence,x:this.camera+(warning.direction===1?-110:1390),y:warning.y,vx:warning.direction*580,hit:new Set()});this.bikeWarning=null;this.bikeTimer=this.difficulty==='hard'?6.5:8.5;}}
  for(const bike of this.bikes){bike.x+=bike.vx*dt;for(const [i,p] of (this.players||[this.player]).entries())if(p.hp>0&&!bike.hit.has(i)&&Math.abs(bike.x-p.x)<64&&Math.abs(bike.y-p.y)<34&&p.z<52){this.damagePlayer(10,false,p);bike.hit.add(i);}}
  this.bikes=this.bikes.filter(b=>b.x>this.camera-300&&b.x<this.camera+1580);
 }
 updateStageHazards(dt){
  if(![3,4,5,6].includes(this.stage)||['victory','gameover'].includes(this.phase))return;
  this.hazardTimer-=dt;
  if(!this.hazardWarning&&this.hazardTimer<=0&&['combat','boss'].includes(this.phase)){
   const kind=this.stage===3?'boomerang':this.stage===6?'dosrun':this.stage===5?['cart','van','plane'][this.hazardSequence%3]:[ 'rocket','tesla','hovercar'][this.hazardSequence%3];
   this.hazardWarning={remaining:1.25,kind,y:this.nearestPlayer({x:this.player.x}).y};
  }
  if(this.hazardWarning){this.hazardWarning.remaining-=dt;if(this.hazardWarning.remaining<=0){const w=this.hazardWarning;this.hazards.push({id:++this.hazardSequence,kind:w.kind,x:this.camera+1420,y:w.y,age:0,vx:w.kind==='dosrun'?-430:w.kind==='hovercar'?-550:w.kind==='rocket'?-620:w.kind==='plane'?-560:w.kind==='van'?-550:w.kind==='tesla'?-490:-460,leg:0,hit:new Set()});this.hazardWarning=null;this.hazardTimer=this.stage===3||this.stage===6?13:this.difficulty==='hard'?8:10;}}
  for(const h of this.hazards){
   h.x+=h.vx*dt;h.age=(h.age||0)+dt;
   if(h.kind==='boomerang'&&h.leg===0&&h.x<this.camera-120){h.vx=460;h.leg=1;}
   for(const [i,p] of (this.players||[this.player]).entries()){
    const key=i+':'+h.leg;if(p.hp<=0||h.hit.has(key)||Math.abs(h.y-p.y)>32)continue;
    const halfWidth=h.kind==='hovercar'?70:h.kind==='dosrun'?65:h.kind==='van'?85:h.kind==='plane'?115:h.kind==='cart'?56:h.kind==='tesla'?80:h.kind==='rocket'?94:46;
    if(Math.abs(h.x-p.x)>halfWidth)continue;
    const low=['tesla','cart','van','hovercar','dosrun'].includes(h.kind);const clearance=h.kind==='hovercar'?100:h.kind==='dosrun'?65:h.kind==='van'?80:h.kind==='cart'?58:70;const cy=h.y-(low?35:h.kind==='plane'?175:164),halfHeight=low?31:h.kind==='rocket'?20:h.kind==='plane'?23:15,bottom=p.y-p.z,top=bottom-(p.crouching?135:p.guarding?165:185);
    if(low?p.z<clearance:top<cy+halfHeight&&bottom>cy-halfHeight){this.damagePlayer(h.kind==='rocket'?10:8,false,p);h.hit.add(key);}
   }
  }
  this.hazards=this.hazards.filter(h=>h.kind==='boomerang'?(h.leg===0||h.x<this.camera+1500):h.x>this.camera-220);
 }
 projectileFor(type,boss=false){
  if(this.stage===11)return boss?'triangle':['triangle','leaf','drop','cookie','server'][type%5];
  if(this.stage>=7)return ['code','drop','star','drop'][this.stage-7];
  if(boss)return ['token','book','web','photo','missile','parcel','window'][this.stage];
  const sets=[['plug','code','drop','flame','book','rock','leaf','server','error','note','headphones','glasses','record','star','code','heart'],['book','glyph','code','weight','plant','server','leaf','flame','tool','book','star','blueprint'],['web','battery','play'],['like','photo','message'],['missile','missile','missile','missile','missile','grok'],['parcel','parcel','chip'],['clip','book','bone','feather','azure','developers','copilot','yarn']];
  const set=sets[this.stage];return set[type%set.length];
 }
 enemyKind(type){const base=PETS[type];return this.stage===11?{...base,fly:type%5===0}:this.stage===5?{...base,fly:false}:base;}
 nearestPlayer(enemy){return (this.players||[this.player]).filter(p=>p.hp>0).sort((a,b)=>Math.abs(a.x-enemy.x)-Math.abs(b.x-enemy.x))[0]||this.player;}
 get gate(){return (this.zone+1)*1050;}
 spawnWave(){
  this.phase='combat';this.enemies=[];
  const count=3+Math.floor(this.zone/3)+this.rules.extra;
  for(let i=0;i<count;i++){const behind=this.difficulty!=='easy'&&i%2===1;this.spawnPet((this.zone*3+i)%PETS.length,behind?this.player.x-140-(i%3)*25:this.zone*1050+630+i*65,535+(i%3)*35);}
 }
 spawnPet(type,x,y){const p=PETS[type];this.enemies.push({id:++this.sequence,type,x,y,baseY:y,hp:p.hp+Math.floor(this.zone/5)+(this.phase==='boss'?0:this.rules.hp),maxHp:p.hp+Math.floor(this.zone/5)+(this.phase==='boss'?0:this.rules.hp),hit:0,cooldown:this.enemyKind(type).fly||(this.difficulty==='hard'&&type%3===0)?1.5+(type%4)*.4:6.5+(type%4)*.5});}
 spawnBoss(){this.phase='boss';this.boss={x:this.zone*1050+810,y:578,hp:65+Math.min(this.stage,4)*5+(this.difficulty==='hard'?5:0),maxHp:65+Math.min(this.stage,4)*5+(this.difficulty==='hard'?5:0),cooldown:1.4,hit:0,summons:0,dash:4};this.enemies=[];if(this.stage===11||(this.stage>=7&&this.stage<10))this.boss.hp=this.boss.maxHp=65;if(this.stage===10){this.boss.hp=this.boss.maxHp=48;this.boss.avatar=10;this.boss.id='xi';this.boss.y=530;this.coBoss={...this.boss,id:'trump',avatar:11,x:this.zone*1050+650,y:620,cooldown:2.1};this.waterRemaining=this.waterLimit;}}
 get bosses(){return [this.boss,this.coBoss].filter(Boolean);}
 isBoss(target){return this.bosses.includes(target);}
 burst(x,y,color,count=10){for(let i=0;i<count;i++){const a=i*2.399;this.particles.push({x,y,vx:Math.cos(a)*(55+i*5),vy:Math.sin(a)*(55+i*5),life:.45,color});}}
 canActivateAbility(id){
  if(!['combat','advance','boss'].includes(this.phase)||this.player.hp<=0)return false;
  if(id==='vacuum')return !this.vacuum;
  if(id==='heal')return this.player.hp<PLAYER_MAX_HEALTH;
  if(id==='drone')return !this.drone;
  if(id==='helper')return !this.helper;
  if(id==='wave')return this.enemies.some(e=>e.hp>0)||this.bosses.some(b=>b.hp>0);
  return Object.hasOwn(this.boosts,id)&&this.boosts[id]<=0;
 }
 activateAbility(id,variant='linus'){
  if(!this.canActivateAbility(id))return false;
  if(id==='vacuum'){this.releaseFire();this.vacuum={life:25,captured:[],sucking:false};}
  else if(id==='heal'){this.player.hp=Math.min(PLAYER_MAX_HEALTH,this.player.hp+20);this.burst(this.player.x,this.player.y-70,'#86ffb8',18);}
  else if(id==='drone')this.drone={life:5,cooldown:0,x:this.player.x+100,y:this.player.y-210};
  else if(id==='helper')this.helper={life:6,x:this.camera-140,y:this.player.y,variant:variant==='uncle-bob'?'uncle-bob':'linus',hit:new Set(),punch:0};
  else if(id==='wave'){
   this.shockwaves.push({x:this.player.x,y:this.player.y-55,life:.85,duration:.85});this.sound('blob');
   for(const e of [...this.enemies,...this.bosses.filter(b=>b.hp>0)]){const damage=this.isBoss(e)?Math.max(0,e.hp-1):e.hp>4?e.hp-1:e.hp;if(damage>0)this.hitEnemy(e,damage);}
   this.hostile=[];
  }else this.boosts[id]=id==='jump'?8:10;
  return true;
 }
 hitEnemy(target,damage=1,owner=this.player.playerIndex||0,absorbed=false){
  if(!target||target.hp<=0)return;target.hp=Math.max(0,target.hp-damage);target.hit=.12;
  if(!absorbed)this.burst(target.x,target.y-50,this.isBoss(target)?'#ff69df':PETS[target.type].color,8);
  if(target.hp===0){if(!absorbed)this.blobPop(target.x,target.y-50,['#68e7ce','#dc8d69','#f3d363','#679be9','#a6c4dd','#f0bb74','#79cfef'][this.stage%7],this.isBoss(target)?1.8:1,target.id||0);this.rewardEvents.push({id:this.runId+'-'+(this.isBoss(target)?(target.id||'boss'):target.id),kind:this.isBoss(target)?'boss':'pet',owner,x:target.x,y:target.y-55});if(!absorbed)this.burst(target.x,target.y-50,'#82fff3',18);}
 }
 updateVacuum(dt){
  const v=this.vacuum,p=this.player;if(!v)return;
  v.sucking=p.fireHeld&&!p.guarding&&p.hp>0;
  if(!v.sucking||v.captured.length>=5)return;
  p.attack=.12;
  for(const e of [...this.enemies]){
   if(e.hp<=0||e.vacuumPulled||v.captured.length>=5)continue;
   const dx=(e.x-p.x)*p.face,dy=e.y-p.y;
   if(dx<0||dx>300||Math.abs(dy)>65+dx*.4)continue;
   e.vacuumPulled=true;
   e.x-=p.face*Math.min(Math.max(0,dx-38),540*dt);e.y+=(p.y-e.y)*Math.min(1,dt*7);e.baseY=e.y;e.cooldown=Math.max(e.cooldown,.3);
   if(Math.abs(e.x-p.x)<75&&Math.abs(e.y-p.y)<50){v.captured.push(e);this.enemies=this.enemies.filter(other=>other!==e);this.burst(e.x,e.y-45,'#83ffe2',5);this.sound('block');if(v.captured.length===5){this.overloadVacuum();return;}}
  }
 }
 launchVacuum(){
  const v=this.vacuum,p=this.player;if(!v)return;if(p.hp<=0||['gameover','victory'].includes(this.phase)){this.expireVacuum();return;}v.sucking=false;
  const captured=v.captured.splice(0),count=captured.length;
  captured.forEach((e,i)=>{
   this.hitEnemy(e,e.hp,p.playerIndex||0,true);
   const angle=(i-(count-1)/2)*.12;
   this.shots.push({kind:'vacuum',type:e.type,x:p.x+p.face*65,y:p.y-p.z-70,vx:p.face*Math.cos(angle)*820,vy:Math.sin(angle)*220,life:2,damage:5,owner:p.playerIndex||0,pierce:3,hit:new Set()});
  });
  if(count){p.attack=.25;this.sound('player-shot');}
 }
 overloadVacuum(){
  const p=this.player;if(!this.vacuum)return;
  this.expireVacuum();
  p.hp=Math.max(0,p.hp-6);p.invincible=Math.max(p.invincible,.9);p.attack=0;
  this.blobPop(p.x-p.face*27,p.y-p.z-92,'#ffb461',1.15,this.sequence);this.burst(p.x,p.y-p.z-95,'#ffe99b',28);this.shake=.4;this.sound('hurt',p.character||this.character);
  if(!p.hp&&(!this.partner||this.players.every(actor=>actor.hp<=0)))this.phase='gameover';
 }
 expireVacuum(){
  const v=this.vacuum,p=this.player;if(!v)return;
  for(const [i,e] of v.captured.entries()){e.x=cap(p.x+p.face*(190+i*40),this.zone*1050+30,this.gate-45);e.y=cap(p.y+(i%3-1)*25,475,636);e.baseY=e.y;e.cooldown=1;this.enemies.push(e);}
  p.needsFireRelease=p.fireHeld;p.fireHeld=false;p.burstRemaining=0;this.vacuum=null;
 }
 updateAbilities(dt,shared=true){
  if(this.vacuum){this.vacuum.life=Math.max(0,this.vacuum.life-dt);if(this.vacuum.life<=0||this.player.hp<=0)this.expireVacuum();}
  for(const id of Object.keys(this.boosts))this.boosts[id]=Math.max(0,this.boosts[id]-dt);
  if(shared){this.supportShots.forEach(s=>s.life-=dt);this.supportShots=this.supportShots.filter(s=>s.life>0);}
  if(this.drone){const d=this.drone;d.life-=dt;d.cooldown-=dt;d.x=this.player.x+120;d.y=this.player.y-220+Math.sin(this.time*6)*7;
   if(d.cooldown<=0){const target=[...this.enemies,...this.bosses.filter(b=>b.hp>0)].find(e=>e.hp>0);if(target){d.cooldown=.15;this.supportShots.push({x:d.x,y:d.y+18,tx:target.x,ty:target.y-50,life:.13});this.hitEnemy(target,10);this.sound('player-shot');}}
   if(d.life<=0)this.drone=null;
  }
  if(this.helper){const h=this.helper;h.life-=dt;h.punch=Math.max(0,h.punch-dt);h.x+=520*dt;
   for(const e of [...this.enemies,...this.bosses.filter(b=>b.hp>0)]){const key=this.isBoss(e)?(e.id||'boss'):e.id;if(e.hp>0&&!h.hit.has(key)&&Math.abs(e.x-h.x)<95){h.hit.add(key);h.punch=.28;h.y=this.isBoss(e)?e.y:e.baseY;this.hitEnemy(e,this.isBoss(e)?25:4);this.sound('blob');}}
   if(h.life<=0||h.x>this.camera+1550)this.helper=null;
  }
 }
 sound(type,character=this.character){if(this.soundEvents.length<48)this.soundEvents.push({type,character});}
 blobPop(x,y,color,size=1,seed=0){this.blobExplosions.push({x,y,color,size,seed,life:.62,duration:.62});this.sound('blob');}
 damagePlayer(amount,projectile=false,target=this.player){const main=this.player;this.player=target;try{if(this.player.invincible>0||this.boosts.shield>0||['victory','gameover'].includes(this.phase))return;this.player.hp=Math.max(0,this.player.hp-amount*(projectile&&this.player.guarding ? .01 : 1));this.sound(projectile&&this.player.guarding?'block':'hurt',this.player.character||this.character);this.player.invincible=.9;this.shake=.16;this.burst(this.player.x,this.player.y-65,'#ff6cae');if(!this.player.hp&&(!this.partner||this.players.every(player=>player.hp<=0)))this.phase='gameover';}finally{this.player=main;}}
 interactLearning(actor=0){const p=actor===1?this.partner:this.player;return !!p&&enterLearningCenter(this,p);}
 pressFire(){const p=this.player;if(p.fireHeld||p.needsFireRelease)return;p.fireHeld=true;if(this.vacuum){this.vacuum.sucking=true;return;}p.burstRemaining=3;this.fire();}
 releaseFire(){if(this.vacuum&&this.player.fireHeld)this.launchVacuum();this.player.needsFireRelease=false;this.player.fireHeld=false;this.player.burstRemaining=0;}
 get volleySize(){return (this.boosts.double>0?2:1)*(this.boosts.both>0?2:1);}
 fire(){
  if(this.vacuum)return;
  if(this.weapon.tier>0&&this.weapon.ammo[this.weapon.tier]<this.volleySize)return;
  const p=this.player;if(p.hp<=0||p.shot>0||p.guarding||p.burstRemaining<=0||['gameover','victory'].includes(this.phase))return;if(this.weapon.tier>0)this.weapon.ammo[this.weapon.tier]-=this.volleySize;p.burstRemaining--;p.totalShots++;if(p.totalShots%3===1)this.sound('player-shot');p.shot=.23;p.attack=.18;
  const candidates=[...this.enemies,...this.bosses.filter(b=>b.hp>0)].filter(e=>e.hp>0&&Math.abs(e.x-p.x)<850);
  candidates.sort((a,b)=>Math.abs(a.x-p.x)-Math.abs(b.x-p.x));const target=candidates[0];
  if(target)p.face=Math.sign(target.x-p.x)||p.face;const x=p.x+p.face*45,y=p.y-p.z-(p.crouching?42:85);let a=target?Math.atan2(target.y-(this.isBoss(target)?125:47)-y,target.x-x):p.face===1?0:Math.PI;
  const directions=this.boosts.both>0?[p.face,-p.face]:[p.face];
  for(const direction of directions){const aimed=direction===p.face?target:candidates.find(e=>Math.sign(e.x-p.x)===direction);const sx=p.x+direction*45;const angle=aimed?Math.atan2(aimed.y-(this.isBoss(aimed)?125:47)-y,aimed.x-sx):direction===1?0:Math.PI;
   for(const offset of (this.boosts.double>0?[-9,9]:[0]))this.shots.push({x:sx,y:y+offset,vx:Math.cos(angle)*720,vy:Math.sin(angle)*720,life:1.5,damage:this.weapon.damage,owner:p.playerIndex||0,bulletIndex:p.bulletIndex??this.bulletIndex,size:[29,35,40][this.weapon.tier]});
  }
 }
 retry(){
  this.vacuum=null;if(this.partner)this.partner.loadout.vacuum=null;this.releaseFire();this.player.shot=0;this.player.z=0;this.player.vz=0;this.player.jumpHeld=false;this.player.hp=PLAYER_MAX_HEALTH;this.player.invincible=1;this.player.x=this.zone*1050+180;this.player.y=580;this.shots=[];this.hostile=[];this.bikes=[];this.bikeWarning=null;this.bikeTimer=4;this.hazards=[];this.hazardWarning=null;this.hazardTimer=5;this.blobExplosions=[];this.soundEvents=[];this.drone=null;this.helper=null;this.supportShots=[];this.shockwaves=[];for(const id of Object.keys(this.boosts))this.boosts[id]=0;
  if(this.partner){this.partner.loadout.boosts={double:0,shield:0,jump:0,both:0};this.partner.loadout.drone=null;this.partner.loadout.helper=null;Object.assign(this.partner,{x:this.player.x+90,y:615,z:0,vz:0,hp:PLAYER_MAX_HEALTH,invincible:1,fireHeld:false,burstRemaining:0});}
  if(this.boss)this.spawnBoss();else this.spawnWave();
 }
 update(delta,input={},partnerInput={}){
  if(this.learningEvents.length)return;const dt=Math.min(.05,Math.max(0,delta));this.time+=dt;const p=this.player;
  if(['gameover','victory'].includes(this.phase)){this.updateParticles(dt);return;}
  for(const e of this.enemies)e.vacuumPulled=false;
  this.shake=Math.max(0,this.shake-dt);this.updateAbilities(dt);if(this.partner)this.forPlayer(1,()=>this.updateAbilities(dt,false));
  this.updatePlayer(dt,input,p);
  if(this.learningEvents.length)return;
  if(this.partner&&this.partner.hp>0)this.updatePlayer(dt,partnerInput,this.partner);
  if(this.learningEvents.length)return;
  const leader=p.hp>0?p:(this.partner?.hp>0?this.partner:p);if(this.phase==='advance'&&leader.x>=this.gate){this.zone++;if(this.cleared===10)this.spawnBoss();else this.spawnWave();}
  for(const e of this.enemies){
   if(e.hp<=0||e.vacuumPulled)continue;const p=this.nearestPlayer(e);const kind=this.enemyKind(e.type);e.hit=Math.max(0,e.hit-dt);e.cooldown-=dt;
   e.x+=Math.sign(p.x-e.x)*kind.speed*dt;e.x=cap(e.x,this.zone*1050+(this.difficulty==='easy'?25:-220),this.gate-45);
   if(kind.fly)e.y=475+Math.sin(this.time*2.1+e.id)*55;else e.y+=Math.sign(p.y-e.y)*Math.min(26,kind.speed*.5)*dt;
   if((kind.fly||p.z<65)&&Math.abs(e.x-p.x)<57&&Math.abs(e.y-p.y)<(kind.fly?110:48))this.damagePlayer(6,false,p);
   if(e.cooldown<0&&Math.abs(e.x-p.x)<700){e.cooldown=kind.fly||(this.difficulty==='hard'&&e.type%3===0)?(this.phase==='boss'?3.5:this.rules.shotInterval):14;if(this.soundSequence++%4===0)this.sound('enemy-shot');const a=Math.atan2(p.y-65-(e.y-45),p.x-e.x);for(const spread of (this.phase==='boss'||(!kind.fly&&e.type%3!==0)?[0]:this.rules.spread))this.hostile.push({x:e.x,y:e.y-45,vx:Math.cos(a+spread)*150,vy:Math.sin(a+spread)*150,life:5,r:10,kind:this.projectileFor(e.type),damage:kind.fly?7:3});}
  }
  for(const b of this.bosses.filter(b=>b.hp>0)){
   const p=this.nearestPlayer(b);b.hit=Math.max(0,b.hit-dt);b.cooldown-=dt;b.dash-=dt;
   b.x+=Math.sign(p.x-b.x)*(b.hp<30?83:52)*dt;b.y=(b.id==='xi'?530:b.id==='trump'?615:560)+Math.sin(this.time*.85)*26;
   if(b.dash<0){b.dash=5;b.x=cap(b.x+(p.x<b.x?-130:130),this.zone*1050+150,this.gate-100);this.burst(b.x,b.y-100,'#ff56ce',20);}
   if(p.z<95&&Math.abs(b.x-p.x)<90&&Math.abs(b.y-p.y)<65)this.damagePlayer(this.stage===10?4:10,false,p);
   if(b.cooldown<0){b.cooldown=(this.stage===10?2.15:b.hp<30?1.05:1.65)*this.rules.bossRate;if(this.soundSequence++%2===0)this.sound('enemy-shot');const a=Math.atan2(p.y-65-(b.y-120),p.x-b.x);for(const spread of [-.17,0,.17])this.hostile.push({x:b.x,y:b.y-120,vx:Math.cos(a+spread)*235,vy:Math.sin(a+spread)*235,life:5,r:13,kind:this.projectileFor(0,true),damage:this.stage===10?4:7});}
   if(this.stage!==10&&((b.hp<45&&b.summons===0)||(b.hp<20&&b.summons===1))){b.summons++;for(let i=0;i<2;i++)this.spawnPet((b.summons*4+i)%16,cap(b.x+180+i*100,this.zone*1050+80,this.gate-60),570);}
  }
  for(const shot of this.shots){
   shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;shot.life-=dt;
   const available=e=>!shot.hit?.has(e);
   const target=this.enemies.find(e=>available(e)&&e.hp>0&&Math.abs(shot.x-e.x)<48&&Math.abs(shot.y-(e.y-47))<50)||this.bosses.find(b=>available(b)&&b.hp>0&&Math.abs(shot.x-b.x)<85&&Math.abs(shot.y-(b.y-125))<125);
   if(target){this.hitEnemy(target,shot.damage??1,shot.owner||0);if(shot.kind==='vacuum'){shot.hit.add(target);if(--shot.pierce<=0)shot.life=0;}else shot.life=0;}
  }
  this.shots=this.shots.filter(s=>s.life>0);this.enemies=this.enemies.filter(e=>e.hp>0);
  for(const shot of this.hostile){shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;shot.life-=dt;for(const p of this.players||[this.player])if(p.hp>0&&Math.abs(shot.x-p.x)<30&&Math.abs(shot.y-(p.y-p.z-(p.crouching?30:65)))<(p.crouching?28:60)){this.damagePlayer(shot.damage??7,true,p);shot.life=0;break;}}
  this.hostile=this.hostile.filter(s=>s.life>0);
  this.updateBikes(dt);this.updateStageHazards(dt);
  if(this.boss&&this.bosses.every(b=>b.hp<=0)){this.phase='victory';this.hostile=[];this.enemies=[];this.bikes=[];this.bikeWarning=null;this.hazards=[];this.hazardWarning=null;this.burst(this.boss.x,this.boss.y-120,'#fff575',45);}
  else if(this.stage===10&&this.waterRemaining!==null){this.waterRemaining=Math.max(0,this.waterRemaining-dt);if(this.waterRemaining===0)this.phase='gameover';}
  else if(this.phase==='combat'&&!this.enemies.length&&!this.captiveCount){this.phase='advance';this.cleared++;}
  this.camera+=(cap(leader.x-340,0,11050)-this.camera)*(1-Math.exp(-dt*5));this.updateParticles(dt);
 }
 enableCoop(character='Pili',company=this.company,bulletIndex=this.bulletIndex){this.partner={...this.player,playerIndex:1,company,bulletIndex,loadout:{weapon:{tier:0,damage:1,name:'Basic',ammo:[Infinity,0,0]},boosts:{double:0,shield:0,jump:0,both:0},drone:null,helper:null},x:this.player.x+90,y:615,character,variant:character===this.character?1:0};this.players=[this.player,this.partner];return this.partner;}
 updatePlayer(dt,input,p){if(p.hp<=0)return;p.invincible=Math.max(0,p.invincible-dt);p.shot=Math.max(0,p.shot-dt);p.attack=Math.max(0,p.attack-dt);const main=this.player;this.player=p;try{
  const inside=platform=>p.x>=platform.x&&p.x<=platform.x+platform.width&&Math.abs(p.y-platform.y)<=platform.depth/2;
  const support=this.platforms.find(platform=>platform.zone===this.zone&&inside(platform)&&p.z===platform.height);
  const grounded=p.z===0||!!support;
  p.guarding=!!input.guard&&grounded;p.crouching=!!input.crouch&&grounded&&!p.guarding;
  if(input.jump&&!p.jumpHeld&&grounded&&!p.crouching&&!p.guarding)p.vz=this.boosts.jump>0?840:620;
  p.jumpHeld=!!input.jump;const previousZ=p.z;
  if(!grounded||p.vz!==0){p.z=Math.max(0,p.z+p.vz*dt);if(p.z>0)p.vz-=1550*dt;else p.vz=0;}
  if(p.vz<=0){const landing=this.platforms.filter(platform=>platform.zone===this.zone&&inside(platform)&&previousZ>=platform.height&&p.z<=platform.height).sort((a,b)=>b.height-a.height)[0];if(landing){p.z=landing.height;p.vz=0;}}
  p.onPlatform=p.z>0&&p.vz===0&&this.platforms.some(platform=>inside(platform)&&p.z===platform.height);

  const pace=p.guarding ? .25 : p.crouching ? .4 : 1;
  const analog=Number.isFinite(input.moveX)&&Number.isFinite(input.moveY);
  const dx=analog?input.moveX:(input.right?1:0)-(input.left?1:0),dy=analog?input.moveY:(input.down?1:0)-(input.up?1:0);p.moving=!!(dx||dy);
  const stride=pace/Math.max(1,Math.hypot(dx,dy));
  if(dx)p.face=dx<0?-1:1;p.x+=dx*245*dt*stride;p.y=cap(p.y+dy*165*dt*stride,475,636);
  p.x=cap(p.x,this.zone*1050+45,this.phase==='advance'?this.gate+40:this.gate-60);
  this.updateVacuum(dt);
  if(input.fire&&!p.needsFireRelease){if(!p.fireHeld)this.pressFire();else this.fire();}else if(!input.fire)this.releaseFire();

 }finally{this.player=main;}}
 updateParticles(dt){for(const w of this.shockwaves)w.life-=dt;this.shockwaves=this.shockwaves.filter(w=>w.life>0);for(const b of this.blobExplosions)b.life-=dt;this.blobExplosions=this.blobExplosions.filter(b=>b.life>0);for(const p of this.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=100*dt;p.life-=dt;}this.particles=this.particles.filter(p=>p.life>0);}
 snapshot(){return {nearLearningCenter:!!nearbyLearningCenter(this),centersVisited:this.learningCenters.filter(b=>b.visited).length,vacuumSeconds:this.vacuum?.life||0,vacuumCaptured:this.vacuum?.captured.length||0,model:{name:this.weapon.name,tier:this.weapon.tier+1,damage:this.weapon.damage,ammo:this.weapon.tier?this.weapon.ammo[this.weapon.tier]:null},boosts:{...this.boosts},droneSeconds:this.drone?.life||0,helperSeconds:this.helper?.life||0,waterRemaining:this.waterRemaining,bosses:this.bosses.map(b=>({id:b.id,hp:b.hp,maxHp:b.maxHp})),phase:this.phase,zone:this.zone,cleared:this.cleared,health:this.player.hp,onPlatform:!!this.player.onPlatform,jump:this.player.z,crouching:this.player.crouching,guarding:this.player.guarding,enemies:this.enemies.length,bossHealth:this.boss?.hp??null,stage:this.stage,hazards:this.hazards.map(h=>({kind:h.kind,x:h.x,y:h.y,returning:h.leg===1})),bikes:this.bikes.length,bikeWarning:!!this.bikeWarning,players:(this.players||[this.player]).map(p=>({character:p.character||this.character,company:p.company||this.company,model:{name:p.loadout.weapon.name,tier:p.loadout.weapon.tier+1,damage:p.loadout.weapon.damage},hp:p.hp,x:p.x,y:p.y,variant:p.variant||0})),difficulty:this.difficulty,shotsFired:this.player.totalShots,burstRemaining:this.player.burstRemaining};}
}
