// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import {drawFinalBossDialogue} from './world-finale.js';
import {drawLearningCenters} from './learning-centers.js';
import {drawStreetLife} from './street-life.js';
import {CAMPAIGN_ORDER,stageNumber,stageRegion} from './campaign.js';
import {art,drawCharacter,drawBullet,drawPet,drawBoss,drawAnthropicEnemy,drawMetaEnemy,drawGoogleEnemy,drawGBike,drawMetaBoomerang,drawRocketEnemy,drawFlyingRocket,drawTesla,ROCKET_NAMES,drawAmazonEnemy,drawMicrosoftEnemy,drawAmazonHazard,drawDOSRunner,drawHoverRoadster,drawEnemyProjectile,drawSupportDrone,drawSupportHelper,drawChinaEnemy,drawVercelEnemy} from './sprites.js';
import {drawChinaBackdrop,CHINA_NODES} from './world-finale.js';
import {PETS} from './game-engine.js';
export const DISTRICTS=[
 {company:'OpenAI',leader:'Sam Altman',place:'MISSION BAY',x:1050,y:555},
 {company:'Anthropic',leader:'Dario Amodei',place:'HOWARD STREET',x:935,y:425},
 {company:'Google',leader:'Sundar Pichai',place:'GOOGLEPLEX / MOUNTAIN VIEW',x:965,y:255},
 {company:'Meta',leader:'Mark Zuckerberg',place:'MENLO PARK CAMPUS',x:585,y:175},
 {company:'X',leader:'Elon Musk',place:'STARBASE / TEXAS',x:390,y:260},
 {company:'Amazon',leader:'Jeff Bezos',place:'SEATTLE / SOUTH LAKE UNION',x:600,y:430},
 {company:'Microsoft',leader:'Bill Gates — fictional avatar',place:'REDMOND CAMPUS',x:940,y:320},
 {company:'Qwen',leader:'Eddie Wu',place:'HANGZHOU / QWEN',...CHINA_NODES[0]},
 {company:'DeepSeek',leader:'Liang Wenfeng',place:'HANGZHOU / DEEPSEEK',...CHINA_NODES[1]},
 {company:'Kimi',leader:'Yang Zhilin',place:'BEIJING / MOONSHOT',...CHINA_NODES[2]},
 {company:'Final alliance',leader:'Xi Jinping + Donald Trump',place:'WORLD WATER CORE',...CHINA_NODES[3]},
 {company:'Vercel',leader:'Guille Rauch',place:'SAN FRANCISCO / SOMA',x:1040,y:340}
];
function label(c,text,x,y,size=24,color='#e7ffff',align='left'){c.font='bold '+size+'px monospace';c.textAlign=align;c.fillStyle=color;c.fillText(text,x,y);}
export function drawRouteMap(c,time,index=0,completed=0,message=''){
 const region=stageRegion(index);c.drawImage(region==='china'?art.chinaMap:region==='north'?art.seattleMap:art.map,0,0,1280,720);c.fillStyle='#02091c66';c.fillRect(0,0,1280,720);
 c.fillStyle='#030a1de8';c.fillRect(0,0,1280,65);label(c,(region==='china'?'CHINA // ROUTE MAP':region==='north'?'SEATTLE / REDMOND // ROUTE MAP':'SAN FRANCISCO BAY // ROUTE MAP'),640,39,28,'#9cfcff','center');
 c.save();c.setLineDash([12,8]);c.lineDashOffset=-time*18;c.strokeStyle='#fff680';c.lineWidth=4;c.beginPath();CAMPAIGN_ORDER.filter(id=>stageRegion(id)===region).map(id=>DISTRICTS[id]).forEach((n,i)=>i?c.lineTo(n.x,n.y):c.moveTo(n.x,n.y));c.stroke();c.restore();
 DISTRICTS.forEach((node,i)=>{
  if(stageRegion(i)!==region)return;const order=stageNumber(i)-1;
  const active=i===index;c.save();c.shadowColor=active?'#ff49cd':'#4aeaff';c.shadowBlur=active?18:4;c.fillStyle=order<completed?'#86ff84':order===completed?'#fcff79':'#5598b9';c.beginPath();c.arc(node.x,node.y,active?17:12,0,Math.PI*2);c.fill();
  if(active){c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.arc(node.x,node.y,26+Math.sin(time*4)*3,0,Math.PI*2);c.stroke();}c.restore();
  const tagWidth=Math.max(184,node.company.length*12+45);c.fillStyle='#040b22df';c.fillRect(node.x-tagWidth/2,node.y+23,tagWidth,43);label(c,String(stageNumber(i)).padStart(2,'0')+' '+node.company.toUpperCase(),node.x,node.y+51,19,active?'#fff986':'#b6d3e8','center');
 });
 const n=DISTRICTS[index];c.fillStyle='#030a1df5';c.fillRect(0,635,1280,85);label(c,'STAGE '+stageNumber(index)+' // '+n.place,35,666,25,'#78f8ff');
 label(c,message||(completed===DISTRICTS.length?'CITY LIBERATED':'Press Enter'),1240,700,20,stageNumber(index)-1<=completed?'#eaffff':'#93a6bd','right');
 label(c,completed===DISTRICTS.length?'CITY LIBERATED // ALL STAGES CLEAR':'Fictional company territories',35,699,15,'#7d9ab6');
}
export function drawTitleRival(c,time){
 const index=CAMPAIGN_ORDER[Math.floor(time/5.3)%DISTRICTS.length],local=time%5.3;
 if(local>.25&&local<3.15){const a=Math.min(1,(local-.25)*5,(3.15-local)*3);c.save();c.fillStyle='#020718';c.globalAlpha=a*.83;c.fillRect(0,0,1280,720);c.globalAlpha=a;
  const shake=Math.sin(local*37)*3;drawBoss(c,index===11?12:index,850+shake,655,570,index===0?-1:1);
  label(c,DISTRICTS[index].company.toUpperCase(),80,360,54,index===1?'#ffb26e':'#5effff');label(c,DISTRICTS[index].leader.toUpperCase(),80,410,29,'#fff');label(c,'FICTIONAL ARCADE RIVAL',80,450,17,'#b68bc5');
  c.fillStyle='#ff42ce77';for(let i=0;i<5;i++)c.fillRect(80+(i*193+local*190)%1000,180+i*83,140,2);c.restore();
 }
}
// Match sprite animation to physical posture, keeping all feet anchored to the ground plane.
export function playerAnimation(p,time,terminalTime=null){
 if(terminalTime!==null)return {pose:terminalTime<.25?'laptopOpening':'laptop',height:145,time:terminalTime<.25?Math.min(.24,Math.max(0,terminalTime)):terminalTime*.3};
 if(p.guarding)return {pose:'guard',height:165,time:time*.25};
 if(p.crouching)return {pose:p.moving?'crouchWalk':'crouch',height:140,time:p.moving?time*.75:0};
 if(p.z>0&&!p.onPlatform)return {pose:'jump',height:180,time:p.vz>350?0:p.vz<-350?.26:.13};
 if(p.loadout?.vacuum)return {pose:p.moving?'walk':'idle',height:195,time:p.moving?time:0};
 return {pose:p.attack>0?'attack':p.moving?'walk':'idle',height:195,time:p.moving||p.attack>0?time:0};
}

function drawVacuumCreature(c,g,type,x,y,height,direction=1){
 const fly=g.enemyKind(type).fly;
 if(g.stage===0)drawPet(c,type,x,y,height,false,direction);
 else if(g.stage===1)drawAnthropicEnemy(c,type,x,y,height,false,direction,fly);
 else if(g.stage===2)drawGoogleEnemy(c,type,x,y,height);
 else if(g.stage===3)drawMetaEnemy(c,type,x,y,height);
 else if(g.stage===4)drawRocketEnemy(c,type,x,y,height);
 else if(g.stage===5)drawAmazonEnemy(c,type,x,y,height,false,direction);
 else if(g.stage===6)drawMicrosoftEnemy(c,type,x,y,height,false,direction);
 else if(g.stage===11)drawVercelEnemy(c,type,x,y,height,false,direction);
 else{c.save();c.translate(x,y);c.scale(height/100,height/100);drawChinaEnemy(c,g.stage,type,0,0,g.time,false,direction,fly);c.restore();}
}
function drawVacuumTool(c,g,p){
 const v=p.loadout?.vacuum;if(!v)return;
 const x=p.x-g.camera,y=p.y-p.z,full=v.captured.length>=4,accent=full?'#ff707e':'#9dffe1';
 c.save();c.translate(x,y);c.scale(p.face,1);if(full)c.translate(Math.sin(g.time*48)*1.5,0);
 if(v.sucking){
  const beam=c.createLinearGradient(86,0,325,0);beam.addColorStop(0,full?'#ff9d693f':'#78ffe53f');beam.addColorStop(.6,'#80cfff17');beam.addColorStop(1,'#a28cff00');
  c.fillStyle=beam;c.beginPath();c.moveTo(86,-89);c.lineTo(325,-180);c.quadraticCurveTo(355,-89,325,2);c.closePath();c.fill();
  const colors=['#b5fff1','#7de7ff','#d2a2ff','#fff3b2'];
  for(let i=0;i<20;i++){const q=(g.time*1.8+i/20)%1,px=87+(1-q)*235,py=-89+Math.sin(i*4.1+g.time*7)*(1-q)*75;
   c.globalAlpha=.25+q*.6;c.strokeStyle=colors[i%4];c.lineWidth=i%4===0?3:1.5;c.beginPath();c.moveTo(px,py);c.quadraticCurveTo(px-12,py+(py+89)*-.15,px-24,py+(py+89)*-.25);c.stroke();
  }c.globalAlpha=1;
 }
 // Rounded pressure tank, shaded shell, straps and a glass capture chamber.
 c.strokeStyle='#102a35';c.lineWidth=5;c.fillStyle='#203e48';c.beginPath();c.roundRect(-56,-143,47,84,15);c.fill();c.stroke();
 const tank=c.createLinearGradient(-54,-110,-9,-110);tank.addColorStop(0,'#437d75');tank.addColorStop(.28,'#a6dca0');tank.addColorStop(.62,'#78ad72');tank.addColorStop(1,'#385e55');
 c.fillStyle=tank;c.beginPath();c.roundRect(-52,-139,39,75,12);c.fill();
 c.fillStyle='#c8e3b2';c.fillRect(-46,-136,7,13);c.fillStyle='#244b4e';c.fillRect(-56,-118,47,7);c.fillRect(-56,-78,47,7);
 c.strokeStyle='#071b28';c.lineWidth=5;c.beginPath();c.moveTo(-16,-132);c.quadraticCurveTo(0,-136,8,-109);c.stroke();c.strokeStyle='#648d89';c.lineWidth=2;c.stroke();
 c.fillStyle='#092f3e';c.beginPath();c.roundRect(-43,-109,23,29,5);c.fill();c.strokeStyle=accent;c.lineWidth=1.5;c.stroke();
 c.save();c.beginPath();c.rect(-42,-108,21,27);c.clip();
 v.captured.slice(0,4).forEach((e,i)=>drawVacuumCreature(c,g,e.type,-36+(i%2)*10,-94+Math.floor(i/2)*12,11,1));c.restore();
 c.fillStyle='#dff4e0';c.beginPath();c.arc(-32,-124,8,0,Math.PI*2);c.fill();c.strokeStyle='#264b50';c.lineWidth=2;c.stroke();
 const angle=-Math.PI*.85+(v.captured.length/5)*Math.PI*1.7;c.strokeStyle=full?'#e34b59':'#246258';c.lineWidth=2;c.beginPath();c.moveTo(-32,-124);c.lineTo(-32+Math.cos(angle)*6,-124+Math.sin(angle)*6);c.stroke();
 // Corrugated hose wraps around the hip into a handled, flared suction bell.
 c.lineCap='round';c.strokeStyle='#102c35';c.lineWidth=14;c.beginPath();c.moveTo(-17,-73);c.bezierCurveTo(5,-49,16,-106,40,-89);c.stroke();c.strokeStyle='#91aba0';c.lineWidth=9;c.stroke();
 for(let i=1;i<12;i++){const q=i/12,a=1-q,px=a*a*a*-17+3*a*a*q*5+3*a*q*q*16+q*q*q*40,py=a*a*a*-73+3*a*a*q*-49+3*a*q*q*-106+q*q*q*-89;c.strokeStyle=i%2?'#415c61':'#c3d6be';c.lineWidth=2;c.beginPath();c.moveTo(px-2,py-4);c.lineTo(px+2,py+4);c.stroke();}
 c.fillStyle='#142e37';c.beginPath();c.roundRect(29,-96,23,21,5);c.fill();c.fillStyle='#d86e5f';c.fillRect(36,-92,13,7);
 c.fillStyle='#b2c9bb';c.strokeStyle='#142e37';c.lineWidth=3;c.beginPath();c.moveTo(48,-98);c.lineTo(80,-111);c.lineTo(88,-107);c.lineTo(88,-70);c.lineTo(80,-65);c.lineTo(48,-80);c.closePath();c.fill();c.stroke();
 c.fillStyle='#e3edce';c.beginPath();c.moveTo(51,-97);c.lineTo(79,-107);c.lineTo(79,-99);c.lineTo(51,-90);c.closePath();c.fill();
 c.fillStyle='#d6715c';c.beginPath();c.roundRect(79,-114,13,52,5);c.fill();c.stroke();c.fillStyle='#082b38';c.beginPath();c.ellipse(88,-88,5,20,0,0,Math.PI*2);c.fill();
 c.strokeStyle=accent;c.lineWidth=2;c.beginPath();c.ellipse(89,-88,3,17,0,0,Math.PI*2);c.stroke();
 for(let i=0;i<4;i++){c.fillStyle=i<v.captured.length?(full?'#ff7a6e':'#f7dd7c'):'#274b51';c.fillRect(-46+i*8,-68,5,4);}
 c.restore();
 if(full&&Math.floor(g.time*5)%2)label(c,'RELEASE!',x-32*p.face,y-157,14,'#ffbd86','center');
}
export function drawMission(c,g,terminalTime=null,hideOutcome=false){
 const compactHUD=c.canvas?.dataset?.mobileHud==='true';
 const camera=g.camera,t=g.time,p=g.player,district=DISTRICTS[g.stage],theme=['#6bffe2','#ffae62','#9fb6ff','#6daaff','#db8cff'][g.stage%5];c.save();
 if(g.shake>0)c.translate(Math.sin(t*88)*g.shake*22,Math.cos(t*71)*g.shake*13);
 c.save();c.filter='brightness(.95) contrast(.95)';
 const bgOffset=(camera*.18)%1280;
 const stageBackground=g.stage===11?art.vercel:g.stage>=7&&g.stage<10?art.chinaScenes[g.stage-7]:g.stage===4?art.texas:g.stage===2?art.googleCampus:g.stage===5?art.amazon:g.stage===6?art.redmond:g.stage===3?art.metaCampus:g.stage===1?art.howard:null;
 if(stageBackground){for(let i=-1;i<=1;i++)c.drawImage(stageBackground,0,0,stageBackground.width,Math.round(stageBackground.height*.65),i*1280-bgOffset,0,1282,468);}
 else if(g.stage===0){for(let i=-1;i<=1;i++)c.drawImage(art.mission,0,0,art.mission.width,Math.round(art.mission.height*.65),i*1280-bgOffset,0,1282,468);}
 else if(g.stage>=7)drawChinaBackdrop(c,t,g.stage,camera);
 else{for(let i=-1;i<6;i++)c.drawImage(art.select,i%2===0?0:1160,140,280,420,i*280-(camera*.22)%280,0,282,468);c.fillStyle=['','#592a1925','#35227025','#0e377025','#3f146025'][g.stage];c.fillRect(0,0,1280,468);}
 const groundOffset=(camera*.82)%1280;
 const floor=stageBackground||(g.stage===10?art.chinaScenes[2]:art.mission);
 for(let i=-1;i<=1;i++)c.drawImage(floor,0,Math.round(floor.height*.65),floor.width,Math.round(floor.height*.35),i*1280-groundOffset,468,1282,252);
 c.restore();
 drawStreetLife(c,g);
 const shade=c.createLinearGradient(0,0,0,720);shade.addColorStop(0,'#03102622');shade.addColorStop(1,'#060d1b33');c.fillStyle=shade;c.fillRect(0,0,1280,720);
 const shadow=(x,y,w)=>{c.fillStyle='#01091688';c.beginPath();c.ellipse(x-camera,y,w,9,0,0,Math.PI*2);c.fill();};
 drawLearningCenters(c,g);
 const entities=[{kind:'player',entity:p,y:p.y},...(g.partner?[{kind:'player',entity:g.partner,y:g.partner.y}]:[]),...[g.helper,g.partner?.loadout.helper].filter(Boolean).map(h=>({kind:'helper',entity:h,y:h.y})),...g.platforms.filter(platform=>platform.zone===g.zone).map(platform=>({kind:'platform',entity:platform,y:platform.y-platform.depth/2})),...g.hazards.map(h=>({kind:'hazard',entity:h,y:h.y})),...g.bikes.map(b=>({kind:'bike',entity:b,y:b.y})),...g.enemies.map(e=>({kind:'pet',entity:e,y:e.y})),...g.bosses.filter(b=>b.hp>0).map(b=>({kind:'boss',entity:b,y:b.y}))].sort((a,b)=>a.y-b.y);
 for(const item of entities){
  if(item.kind==='helper'){shadow(item.entity.x,item.entity.y,45);drawSupportHelper(c,item.entity,camera,t);}
  else if(item.kind==='hazard'){const h=item.entity;if(h.kind==='dosrun'){shadow(h.x,h.y,55);drawDOSRunner(c,h.x-camera,h.y,t,h.vx>0?1:-1);}else if(h.kind==='hovercar'){shadow(h.x,h.y,70);drawHoverRoadster(c,h.x-camera,h.y,t,h.vx>0?1:-1);}else if(h.kind==='boomerang')drawMetaBoomerang(c,h.x-camera,h.y-164,t);else if(h.kind==='rocket')drawFlyingRocket(c,h.x-camera,h.y-164,t,h.vx>0?1:-1);else if(['cart','van','plane'].includes(h.kind)){if(h.kind!=='plane')shadow(h.x,h.y,80);drawAmazonHazard(c,h.kind,h.x-camera,h.y-(h.kind==='plane'?175:0),t,h.vx>0?1:-1);}else{shadow(h.x,h.y,80);drawTesla(c,h.x-camera,h.y,t,h.vx>0?1:-1);}}
  else if(item.kind==='bike'){const b=item.entity;shadow(b.x,b.y,55);drawGBike(c,b.x-camera,b.y,t,b.vx>0?1:-1);}
  else if(item.kind==='platform'){
   const a=item.entity,x=a.x-camera,top=a.y-a.depth/2-a.height,front=a.y+a.depth/2-a.height;
   c.fillStyle='#101d32';c.fillRect(x,front,a.width,a.height);c.fillStyle='#344b62';c.fillRect(x,top,a.width,a.depth);c.strokeStyle='#69dac9';c.lineWidth=3;c.strokeRect(x,top,a.width,a.depth);c.fillStyle='#4ce7d8';c.fillRect(x,front,a.width,4);
   c.fillStyle='#1a2d44';c.fillRect(x+18,top+12,46,22);c.fillStyle='#587086';for(let n=0;n<5;n++)c.fillRect(x+24+n*7,top+16,3,14);c.fillStyle='#f064be';c.fillRect(x+a.width-35,top+15,18,9);
   c.fillStyle='#12263b';for(let i=12;i<a.width-20;i+=28)c.fillRect(x+i,front+14,18,Math.max(10,a.height-28));
   label(c,'JUMP ↑',x+a.width/2,top-9,15,'#baffee','center');
  }else if(item.kind==='player'){const p=item.entity;if(p.hp<=0)continue;shadow(p.x,p.y,43);if(p.loadout?.boosts.shield>0){c.save();c.strokeStyle='#74f8ff';c.fillStyle='#55dfff22';c.shadowColor='#40eaff';c.shadowBlur=15;c.lineWidth=3;c.beginPath();c.ellipse(p.x-camera,p.y-p.z-92,65+Math.sin(t*7)*2,110,0,0,Math.PI*2);c.fill();c.stroke();c.restore();}c.save();if(terminalTime===null&&p.invincible>0&&Math.floor(t*15)%2)c.globalAlpha=.4;const actorTerminal=terminalTime!==null&&(p.playerIndex||0)===(g.consolePlayer||0)?terminalTime:null;const animation=playerAnimation(p,t,actorTerminal);drawCharacter(c,p.character||g.character,p.x-camera,p.y-(terminalTime===null||p.onPlatform?p.z:0),animation.height,animation.pose,animation.time,p.face,(p.character||g.character)==='Pili'?'#ff55c7':'#59edff',p.variant||0);c.restore();drawVacuumTool(c,g,p);}
  else if(item.kind==='pet'){
   const e=item.entity,kind=g.enemyKind(e.type),x=e.x-camera;if(x< -180||x>1460)continue;
   shadow(e.x,kind.fly?e.baseY:e.y,34);
   if(g.stage===0)drawPet(c,e.type,x,e.y+(kind.fly?0:Math.sin(t*5+e.id)*1.8),e.type===7?112:88,e.hit>0,p.x<e.x?1:-1);
   else if(g.stage===1)drawAnthropicEnemy(c,e.type,x,e.y+Math.sin(t*4+e.id)*2,kind.fly?92:106,e.hit>0,p.x<e.x?1:-1,kind.fly);
   else if(g.stage===2)drawGoogleEnemy(c,e.type,x,e.y+Math.sin(t*4+e.id)*2,kind.fly?80:88,e.hit>0);
   else if(g.stage===3)drawMetaEnemy(c,e.type,x,e.y+Math.sin(t*4+e.id)*2,88,e.hit>0);
   else if(g.stage===4){drawRocketEnemy(c,e.type,x,e.y+Math.sin(t*4+e.id)*2,kind.fly?110:116,e.hit>0);label(c,ROCKET_NAMES[e.type%6],x,e.y+15,11,'#d9efff','center');}
   else if(g.stage===5)drawAmazonEnemy(c,e.type,x,e.y+Math.sin(t*5+e.id)*2,103,e.hit>0,p.x<e.x?1:-1);
   else if(g.stage===6)drawMicrosoftEnemy(c,e.type,x,e.y+Math.sin(t*4+e.id)*2,108,e.hit>0,p.x<e.x?1:-1);
   else if(g.stage===11)drawVercelEnemy(c,e.type,x,e.y+Math.sin(t*5+e.id)*2,kind.fly?88:108,e.hit>0,p.x<e.x?1:-1);
   else if(g.stage>=7)drawChinaEnemy(c,g.stage,e.type,x,e.y,t,e.hit>0,p.x<e.x?1:-1,kind.fly);
   else{c.save();if(e.hit>0)c.filter='brightness(2.5)';c.fillStyle='#071426';c.strokeStyle=theme;c.lineWidth=2;c.fillRect(x-35,e.y-78,70,65);c.strokeRect(x-35,e.y-78,70,65);drawBullet(c,g.enemyLogoIndex,x,e.y-48,75,1);if(!kind.fly){c.fillStyle=theme;c.fillRect(x-29,e.y-9,17,8);c.fillRect(x+12,e.y-9,17,8);}else{c.strokeStyle=theme;c.beginPath();c.ellipse(x,e.y-15,45,12,0,0,Math.PI*2);c.stroke();}c.restore();}
   if(!compactHUD&&g.stage===6&&e.type%8===5&&(t+e.id*.4)%6<3.5){const bx=Math.max(12,Math.min(1030,x-110)),by=Math.max(145,e.y-255);c.fillStyle='#fff7df';c.strokeStyle='#23354a';c.lineWidth=3;c.fillRect(bx,by,230,88);c.strokeRect(bx,by,230,88);c.beginPath();c.moveTo(bx+95,by+88);c.lineTo(bx+117,by+107);c.lineTo(bx+132,by+88);c.fill();for(let n=0;n<3;n++)label(c,'Developers!',bx+115,by+25+n*25,20,'#162238','center');}
   c.fillStyle='#152032';c.fillRect(x-29,e.y-109,58,5);c.fillStyle=kind.color;c.fillRect(x-29,e.y-109,58*Math.max(0,e.hp/e.maxHp),5);
  }else{const b=item.entity;shadow(b.x,b.y,70);drawBoss(c,g.stage===11?12:b.avatar??g.stage,b.x-camera,b.y,260,g.stage===0?(p.x<b.x?-1:1):(p.x<b.x?1:-1),b.hit>0);}
 }
 if(g.stage===10&&terminalTime===null)drawFinalBossDialogue(c,g);
 if(g.stage===10){c.fillStyle='#031827e6';c.fillRect(410,150,460,55);label(c,'WORLD WATER '+Math.ceil(g.waterRemaining/g.waterLimit*100)+'% / '+Math.ceil(g.waterRemaining)+'s',640,175,22,g.waterRemaining<15?'#ff8c88':'#7deaff','center');c.fillStyle='#348dc6';c.fillRect(430,185,420*g.waterRemaining/g.waterLimit,8);}
 for(const drone of [g.drone,g.partner?.loadout.drone].filter(Boolean))drawSupportDrone(c,drone.x-camera,drone.y,t,drone.cooldown>.06);
 for(const beam of g.supportShots){c.save();c.strokeStyle='#99ffff';c.shadowColor='#2ee8ff';c.shadowBlur=13;c.lineWidth=4;c.beginPath();c.moveTo(beam.x-camera,beam.y);c.lineTo(beam.tx-camera,beam.ty);c.stroke();c.restore();}
 for(const wave of g.shockwaves){const progress=1-wave.life/wave.duration;c.save();c.globalAlpha=1-progress;c.strokeStyle='#adfaff';c.lineWidth=8*(1-progress)+1;c.beginPath();c.ellipse(wave.x-camera,wave.y,40+progress*1000,20+progress*310,0,0,Math.PI*2);c.stroke();c.restore();}
 for(const shot of g.shots){c.save();c.shadowColor='#5dffff';c.shadowBlur=10;if(shot.kind==='vacuum'){c.translate(shot.x-camera,shot.y);c.rotate(t*13*(shot.vx<0?-1:1));drawVacuumCreature(c,g,shot.type,0,23,50,shot.vx<0?-1:1);}else drawBullet(c,shot.bulletIndex??g.bulletIndex,shot.x-camera,shot.y,shot.size??29,shot.vx<0?-1:1);c.restore();}
 for(const shot of g.hostile)drawEnemyProjectile(c,shot,camera,t);
 for(const blob of g.blobExplosions||[])drawBlobExplosion(c,blob,camera);
 for(const e of g.particles){c.globalAlpha=Math.max(0,e.life/.45);c.fillStyle=e.color;c.fillRect(e.x-camera,e.y,4,4);}c.globalAlpha=1;
 const boosts=Object.entries(g.boosts).filter(([,seconds])=>seconds>0).map(([id,seconds])=>id.toUpperCase()+' '+Math.ceil(seconds)+'s');if(g.drone)boosts.push('DRONE '+Math.ceil(g.drone.life)+'s');if(g.helper)boosts.push(g.helper.variant.toUpperCase());for(const [i,actor] of (g.players||[g.player]).entries())if(actor.loadout.vacuum)boosts.push((g.partner?'P'+(i+1)+' ':'')+'VACUUM '+Math.ceil(actor.loadout.vacuum.life)+'s · '+actor.loadout.vacuum.captured.length+'/5');if(boosts.length){const x=compactHUD?390:25,y=compactHUD?82:640;c.fillStyle=compactHUD?'#07172d88':'#07172ddd';c.fillRect(x,y,Math.min(compactHUD?500:1200,boosts.join(' / ').length*10+18),25);label(c,boosts.join(' / '),x+10,y+18,compactHUD?13:15,'#93fbf0');}
 if(g.phase==='combat'){
  const gate=g.gate-camera;c.strokeStyle='#ff4fc591';c.lineWidth=3;c.setLineDash([10,12]);c.beginPath();c.moveTo(gate,445);c.lineTo(gate,655);c.stroke();c.setLineDash([]);if(!compactHUD)label(c,'CLEAR THE AREA',Math.min(1210,gate-20),428,18,'#ff91d7','right');
 }
 if(g.hazardWarning){const h=g.hazardWarning,duck=['boomerang','rocket','plane'].includes(h.kind);c.fillStyle=duck?'#5c9cff33':'#ffbf3333';c.fillRect(0,h.y-(duck?168:8),1280,8);label(c,compactHUD?(duck?'CROUCH':'JUMP'):h.kind==='boomerang'?'META BOOMERANG — CROUCH X':h.kind==='rocket'?'ROCKET — CROUCH X':h.kind==='hovercar'?'THRUSTER ROADSTER — JUMP / DODGE':h.kind==='dosrun'?'RUN DOS RUN — JUMP Z':h.kind==='plane'?'AMAZON AIR — CROUCH X':h.kind==='cart'?'SHOPPING CART — JUMP Z':h.kind==='van'?'DELIVERY VAN — JUMP / DODGE':'ROADSTER — JUMP Z',1235,h.y-210,24,duck?'#8fc9ff':'#ffde76','right');}
 if(g.bikeWarning){const b=g.bikeWarning;c.fillStyle='#ffdc3955';c.fillRect(0,b.y-8,1280,10);label(c,(b.direction===1?'→ ':'← ')+'G-BIKE — JUMP!',b.direction===1?45:1235,b.y-88,26,'#ffed73',b.direction===1?'left':'right');}
 if(g.phase==='advance')label(c,Math.floor(t*3)%2?'GO →':'→',1140,365,60,'#ffff7d','center');
 c.restore();
 // Persistent gameplay HUD; the mute and Back buttons occupy the outer corners.
 if(compactHUD){
  c.fillStyle='#03102570';c.fillRect(0,0,1280,g.partner?70:54);
  const health=(player,y,name)=>{label(c,name,24,y+10,17,'#d8fff4');c.fillStyle='#24364199';c.fillRect(64,y,210,10);c.fillStyle=player.hp>(player.maxHp||60)*.3?'#5cf5d9':'#ff538a';c.fillRect(64,y,210*Math.max(0,player.hp)/(player.maxHp||60),10);};
  health(p,16,'P1');if(g.partner)health(g.partner,46,'P2');
  label(c,'STAGE '+stageNumber(g.stage)+' · '+(g.phase==='boss'?'BOSS':Math.min(10,g.zone+1)+'/10'),640,29,19,'#c9f8ff','center');
  if(g.weapon.tier)label(c,'AMMO '+g.weapon.ammo[g.weapon.tier],640,54,15,'#8ac6d7','center');
 }else{
 c.fillStyle='#031025ef';c.fillRect(0,0,1280,90);label(c,g.character.toUpperCase(),180,30,23);label(c,g.weapon.name.toUpperCase()+' / '+(g.weapon.tier?'AMMO '+g.weapon.ammo[g.weapon.tier]:'UNLIMITED'),180,77,14,'#8ac6d7');
 c.fillStyle='#33404c';c.fillRect(180,42,280,12);c.fillStyle=p.hp>(p.maxHp||60)*.3?'#5cf5d9':'#ff538a';c.fillRect(180,42,280*p.hp/(p.maxHp||60),12);
 if(g.partner){label(c,'P2 '+g.partner.character.toUpperCase(),900,30,23,'#88faff');c.fillStyle='#33404c';c.fillRect(900,42,280,12);c.fillStyle=g.partner.hp>(g.partner.maxHp||60)*.3?'#5cf5d9':'#ff538a';c.fillRect(900,42,280*g.partner.hp/(g.partner.maxHp||60),12);label(c,g.partner.loadout.weapon.name.toUpperCase()+' / '+(g.partner.loadout.weapon.tier?'AMMO '+g.partner.loadout.weapon.ammo[g.partner.loadout.weapon.tier]:'UNLIMITED'),900,77,12,'#8ac6d7');}
 label(c,district.place,640,29,25,'#88faff','center');label(c,g.phase==='boss'?'BOSS':('ENCOUNTER '+Math.min(10,g.zone+1)+' / 10'),640,66,18,'#ff8cd9','center');if(!g.partner)label(c,'STAGE '+stageNumber(g.stage)+' / '+g.rules.label.toUpperCase(),1120,70,17,'#8fc6db','right');
 }
 if(g.stage===10){g.bosses.forEach((b,i)=>{const x=280+i*370;label(c,i===0?'XI JINPING':'DONALD TRUMP',x+165,113,15,'#ffc8e4','center');c.fillStyle='#59233d';c.fillRect(x,125,330,8);c.fillStyle=b.hp>0?'#ff5dbb':'#73ffe2';c.fillRect(x,125,330*b.hp/b.maxHp,8);});}
 else if(g.bosses.some(b=>b.hp>0)){c.fillStyle='#060919dd';c.fillRect(250,98,780,42);label(c,district.leader.toUpperCase()+' // FICTIONAL BOSS',640,116,17,'#ffb6df','center');c.fillStyle='#59233d';c.fillRect(280,125,720,7);c.fillStyle='#ff5dbb';c.fillRect(280,125,720*g.bosses.reduce((n,b)=>n+b.hp,0)/g.bosses.reduce((n,b)=>n+b.maxHp,0),7);}
 if(!compactHUD){c.fillStyle='#020918c9';c.fillRect(0,676,1280,44);label(c,'MOVE: WASD / ARROWS  SPACE: 3 SHOTS  Z: JUMP  X: CROUCH  C: GUARD',25,703,15,'#b1ebf4');label(c,g.stage===10?'FINAL ALLIANCE':'CLEARED '+g.cleared+' / 10',1240,703,18,'#8bffb6','right');}
 if(terminalTime===null&&g.time<2.4){c.save();c.globalAlpha=Math.min(1,g.time*3,(2.4-g.time)*2);label(c,district.place,640,300,64,'#baffff','center');label(c,district.company.toUpperCase()+' // TOKEN PATROL',640,345,24,'#ff9de1','center');c.restore();}
 if(!hideOutcome&&(g.phase==='gameover'||g.phase==='victory')){
  c.fillStyle='#02081ad9';c.fillRect(0,0,1280,720);label(c,g.phase==='victory'?'STAGE '+stageNumber(g.stage)+' CLEAR':'SIGNAL LOST',640,315,64,g.phase==='victory'?'#95ffbe':'#ff8dcc','center');label(c,g.phase==='victory'?district.place+' LIBERATED':'Press Enter to retry this encounter',640,365,26,'#d9faff','center');if(g.phase==='victory')label(c,'Press Enter',640,427,24,'#a5faff','center');
 }
}

export function drawBlobExplosion(c,b,camera){
 const p=1-b.life/b.duration,unit=4*b.size,lobes=Array.from({length:7},(_,i)=>{const angle=i*Math.PI*2/7+b.seed*.47;return {x:Math.cos(angle)*p*17,y:Math.sin(angle)*p*14-p*5,r:(1-p)*4.5+1};});c.save();c.globalAlpha=Math.min(1,(1-p)*2.8);
 for(let y=-20;y<=17;y++)for(let x=-22;x<=22;x++){
  let field=Math.pow(Math.max(0,8*(1-p)),2)/(x*x+y*y+.8);
  for(const l of lobes)field+=l.r*l.r/((x-l.x)**2+(y-l.y)**2+.8);
  if(field>1.35){c.fillStyle=p<.08?'#fff1b0':(x+y<-4&&field>2.5?'#d8fff1':b.color);c.fillRect(Math.round(b.x-camera+x*unit),Math.round(b.y+y*unit),Math.ceil(unit),Math.ceil(unit));}
 }
 c.restore();
}
