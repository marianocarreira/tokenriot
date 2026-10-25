// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import {drawRewardShowcase} from './results-rewards.js';
import {art,drawCharacter,drawBoss,drawTravelPlane} from './sprites.js';
function text(c,s,x,y,size=24,color='#dffaff',align='center'){c.font='bold '+size+'px monospace';c.textAlign=align;c.fillStyle=color;c.fillText(s,x,y);}
export const CHINA_STORIES=[
 [['HANGZHOU // QWEN','Alibaba lights up a new city of models. Eddie Wu enters the fictional arena.'],['THE INFINITE MARKET // FICTION','Every tower asks for another token. Every answer opens another gate.'],['EDDIE WU // FICTIONAL ARCADE RIVAL','"Welcome to my cloud. Can you break the token monopoly?"']],
 [['HANGZHOU // DEEPSEEK','Liang Wenfeng opens the doors of a different AI laboratory.'],['THE DEEP BLUE GRID // FICTION','Whale-shaped machines patrol the research district.'],['LIANG WENFENG // FICTIONAL ARCADE RIVAL','"Go deeper, challenger. The final answer is still ahead!"']],
 [['BEIJING // KIMI','Yang Zhilin watches a moonlit network awaken at Moonshot.'],['THE LONG CONTEXT // FICTION','The city remembers every move. Moon drones guard the last route.'],['YANG ZHILIN // FICTIONAL ARCADE RIVAL','"A million paths. Find the one that brings us together."']],
 [['THE WORLD WATER CORE // FICTION','Xi Jinping and Donald Trump join forces as the final arcade rivals.'],['ONE PLANET. ONE RESERVE.','Their imaginary AI machine drains the world water gauge. Stop both before it empties.'],['THE FINAL TOKEN RIOT','This is a fictional showdown. The real victory is cooperation.']]
];
export function drawChinaBackdrop(c,t,stage,camera=0){
 if(stage<10&&art.chinaScenes){c.drawImage(art.chinaScenes[stage-7],0,0,1280,545);c.fillStyle='#0b153122';c.fillRect(0,0,1280,545);return;}
 if(stage===10&&art.chinaScenes){c.drawImage(art.chinaScenes[2],0,0,1280,470);c.fillStyle='#05243377';c.fillRect(0,0,1280,470);}else{
 const tone=stage===7?'#663f79':stage===8?'#143f65':stage===9?'#1e204a':'#133e51';const sky=c.createLinearGradient(0,0,0,470);sky.addColorStop(0,tone);sky.addColorStop(1,stage===7?'#efb79a':'#648eb0');c.fillStyle=sky;c.fillRect(0,0,1280,470);
 c.fillStyle=stage===7?'#ffd2a0':'#e2faff';c.beginPath();c.arc(1020-camera*.01,155,45,0,Math.PI*2);c.fill();
 for(let layer=0;layer<3;layer++)for(let i=-2;i<14;i++){const x=i*125-((camera*(.08+layer*.06))%125),h=90+((i+20)*73+stage*39+layer*31)%210,y=470-h;c.fillStyle=['#364763','#293c51','#213247'][layer];c.fillRect(x,y,116,h);c.fillRect(x+30,y-15,56,15);for(let row=0;row<h/20-1;row++)for(let col=0;col<5;col++){c.fillStyle=(row+col+i)%3?'#7ccac47a':'#f3c29c99';c.fillRect(x+10+col*20,y+12+row*20,7,8);}if(layer===2&&i%3===0){c.fillStyle=['#a88cff','#5dcfff','#ea9aff','#7affd4'][stage-7];c.fillRect(x+35,y+30,26,80);text(c,['Q','D','K','AI'][stage-7],x+48,y+80,22,'#092037');}}
 }
 if(stage===10){for(let i=0;i<3;i++){const x=330+i*280;c.fillStyle='#081e32';c.fillRect(x,200,180,230);c.fillStyle='#36b5d388';c.fillRect(x+10,225+Math.sin(t+i)*8,160,190);c.strokeStyle='#87eaff';c.lineWidth=5;c.strokeRect(x,200,180,230);for(let b=0;b<10;b++){c.fillStyle='#a1ffff';c.fillRect(x+25+(b*41)%130,420-(b*27+t*18)%190,4,5);}c.fillStyle='#7ba0ab';c.fillRect(x-30,400,30,15);}}
 c.fillStyle='#182a3b';c.fillRect(0,435,1280,35);for(let x=0;x<1280;x+=90){c.fillStyle='#92e6e8';c.fillRect(x,420,4,38);c.fillRect(x-8,417,20,5);}text(c,['HANGZHOU • CLOUD DISTRICT','HANGZHOU • RESEARCH DISTRICT','BEIJING • MOONSHOT DISTRICT','WORLD WATER CORE • FINAL ALLIANCE'][stage-7],640,390,23,'#dfffff');
}
export const CHINA_NODES=[{x:960,y:470},{x:800,y:550},{x:940,y:220},{x:560,y:335}];
export const FLIGHT_SECONDS=11;
const flightClamp=x=>Math.max(0,Math.min(1,x));
const flightEase=x=>{x=flightClamp(x);return x*x*(3-2*x);};
export function flightFrame(t){
 t=Math.max(0,t);
 if(t<3.2){const p=flightEase(t/3.2);return {phase:'takeoff',sprite:0,x:940-340*p,y:320-90*p,width:54+366*p,progress:p};}
 if(t<7.2){const p=(t-3.2)/4;return {phase:'cruise',sprite:1,x:600-840*flightEase(p),y:230+Math.sin(p*Math.PI)*22,width:420,progress:p};}
 const p=flightEase((t-7.2)/3.8);return {phase:'landing',sprite:2,x:1500+(CHINA_NODES[0].x-1500)*p,y:230+(CHINA_NODES[0].y-230)*p,width:420-366*p,progress:p};
}
function flightMap(c,image,zoom=1,cx=640,cy=360){c.save();c.translate(cx,cy);c.scale(zoom,zoom);c.drawImage(image,-cx,-cy,1280,720);c.restore();}
export function drawFlight(c,t){
 const frame=flightFrame(t),ocean=art.seattleMap;c.fillStyle='#041334';c.fillRect(0,0,1280,720);
 // Real map art at both ends, with a moving, richly textured sea chart during cruise.
 c.drawImage(ocean,0,0,Math.floor(ocean.width*.22),ocean.height,0,0,1280,720);
 for(let i=0;i<12;i++){c.save();c.globalAlpha=.1;c.drawImage(ocean,0,Math.floor((i%4)*ocean.height/5),Math.floor(ocean.width*.12),Math.floor(ocean.height/5),((i*271+t*65)%1600+1600)%1600-200,i%3*245-30,250,160);c.restore();}
 const departAlpha=1-flightEase((t-2.1)/1.5),arriveAlpha=flightEase((t-6.5)/1.3);
 if(departAlpha>0){c.save();c.globalAlpha=departAlpha;flightMap(c,art.seattleMap,1+flightClamp(t/3.2)*.06,940,320);c.restore();}
 if(arriveAlpha>0){c.save();c.globalAlpha=arriveAlpha;flightMap(c,art.chinaMap,1+.05*(1-flightClamp((t-7.2)/3.8)),960,470);c.restore();}
 c.fillStyle='#02091c44';c.fillRect(0,0,1280,720);
 const port=frame.phase==='takeoff'?{x:940,y:320}:frame.phase==='landing'?CHINA_NODES[0]:null;
 if(port){c.save();c.fillStyle='#172536';c.fillRect(port.x-85,port.y+5,170,22);c.fillStyle='#b9c9d0';c.fillRect(port.x-84,port.y+6,168,2);c.fillRect(port.x-84,port.y+24,168,2);for(let n=0;n<7;n++){c.fillStyle='#f6e5b2';c.fillRect(port.x-72+n*22,port.y+14,12,3);c.fillStyle='#8dfaff';c.fillRect(port.x-80+n*26,port.y+1,3,3);c.fillRect(port.x-80+n*26,port.y+29,3,3);}c.strokeStyle='#fff48b';c.lineWidth=3;c.beginPath();c.arc(port.x,port.y,22+Math.sin(t*4)*3,0,7);c.stroke();c.restore();}
 if(frame.phase==='cruise'){c.save();c.setLineDash([12,10]);c.lineDashOffset=-t*90;c.strokeStyle='#fff29c99';c.lineWidth=3;c.beginPath();c.moveTo(90,460);c.bezierCurveTo(360,510,700,410,1160,370);c.stroke();c.restore();}
 // The shadow grows with the plane on ascent, then contracts onto the arrival point.
 c.save();c.globalAlpha=.27;c.fillStyle='#01091c';c.beginPath();c.ellipse(frame.x,frame.y+Math.max(6,frame.width*.22),frame.width*.32,frame.width*.055,0,0,7);c.fill();c.restore();
 drawTravelPlane(c,frame.sprite,frame.x,frame.y,frame.width);
 c.fillStyle='#030a1de8';c.fillRect(0,0,1280,90);text(c,'REDMOND  →  CHINA',640,42,30,'#9cfcff');text(c,frame.phase==='takeoff'?'TAKEOFF // REDMOND CAMPUS':frame.phase==='cruise'?'TRANS-PACIFIC FLIGHT':'LANDING // HANGZHOU',640,72,18,'#ffe49a');
 c.fillStyle='#030a1df5';c.fillRect(0,635,1280,85);text(c,'TOKEN RIOT // THE EASTERN CIRCUIT',35,666,25,'#78f8ff','left');text(c,'Mariano Carreira',35,699,15,'#7d9ab6','left');text(c,'Press Enter to skip',1240,700,20,'#eaffff','right');
 c.fillStyle='#4ce9ef';c.fillRect(0,717,1280*flightClamp(t/FLIGHT_SECONDS),3);
}
export const CREDIT_ROLES=['A game by','Created and directed by','Story and satire','Game design','Pixel art direction','Combat and world design','Music direction','Programming','Production','Testing','Special thanks','Starring'];
export const CREDIT_SECONDS=38;
export function drawCredits(c,t){c.fillStyle='#03040c';c.fillRect(0,0,1280,720);for(let i=0;i<60;i++){c.fillStyle='#8ad9ee';c.fillRect((i*179)%1280,(i*83+t*5)%720,2,2);}c.save();c.beginPath();c.rect(0,0,1280,720);c.clip();const y=780-t*55;text(c,'TOKEN RIOT',640,y,62,'#9afaff');CREDIT_ROLES.forEach((role,i)=>{text(c,role.toUpperCase(),640,y+190+i*110,18,'#8d9bab');text(c,'Mariano Carreira',640,y+228+i*110,32);});text(c,'ONE PLANET. ONE HUMANITY.',640,y+1640,27,'#a4f7d1');c.restore();}
export const DISCLAIMER_LINES=[
 'TOKEN RIOT is a work of fiction and satire.',
 'All rivalries, dialogue and actions are invented.',
 'It does not promote violence, threats or harm',
 'against any person, company or world leader.',
 '',
 'We acknowledge the people, technologies and conditions',
 'that helped make a game like this possible.',
 'No participation or endorsement is implied.',
 '',
 'The goal is to bring competitors and everyone involved',
 'together: unite our strengths for a better humanity.'
];
export function drawDisclaimer(c,t){c.fillStyle='#06101f';c.fillRect(0,0,1280,720);text(c,'A SATIRE. A CALL TO COOPERATE.',640,105,35,'#87f6ee');DISCLAIMER_LINES.forEach((line,i)=>text(c,line,640,181+i*35,23,i<4?'#f1e5d6':'#bbd6de'));text(c,'Mariano Carreira',640,629,22,'#e3bd83');text(c,'Press Enter',640,689,23);}
export function drawCurtainCall(c,t){c.fillStyle='#050713';c.fillRect(0,0,1280,720);if(art.curtainCall){const zoom=1+Math.min(t,12)*.002;c.save();c.translate(640,360);c.scale(zoom,zoom);c.drawImage(art.curtainCall,-640,-360,1280,720);c.restore();}for(let i=0;i<65;i++){c.fillStyle=['#8afaff','#ffd37e','#ff91dc'][i%3];c.fillRect((i*199+Math.sin(t+i)*25)%1280,(i*73+t*(25+i%4*9))%720,4,7);}c.fillStyle='#030716cc';c.fillRect(0,585,1280,135);text(c,'THE CAST TAKES A BOW. THE FUTURE IS SHARED.',640,622,28,'#fff0ba');text(c,'Mariano Carreira',640,660,22);text(c,'THE END  /  Press Enter',640,698,20,'#91ffee');}
export function formatVirtualUSD(value){return '$'+Number(value).toFixed(8);}
export function drawSavingsResults(c,t,result,loading=false,error=''){drawRewardShowcase(c,t,result,loading,error,art.chinaScenes?.[2]);}

// Satirical speech belongs to each fictional boss and follows its world position.
export function drawFinalBossDialogue(c,g){if(g.stage!==10||g.phase!=='boss'||g.time<2.5)return;const phase=(g.time-2.5)%8.4,id=phase<3.6?'trump':phase>=4.2&&phase<7.8?'xi':null,b=g.bosses.find(b=>b.id===id&&b.hp>0);if(!b)return;const line=id==='trump'?"It's superintelligence!":"It's IA!",w=id==='trump'?304:155,h=53,x=Math.max(12,Math.min(1268-w,b.x-g.camera-w/2)),y=Math.max(220,b.y-353);c.save();c.fillStyle='#fff4d6';c.strokeStyle='#263241';c.lineWidth=3;c.beginPath();c.roundRect(x,y,w,h,15);c.fill();c.stroke();const tail=Math.max(x+22,Math.min(x+w-22,b.x-g.camera));c.beginPath();c.moveTo(tail-12,y+h-2);c.lineTo(tail+2,y+h+20);c.lineTo(tail+15,y+h-2);c.fill();c.stroke();c.fillStyle='#283645';c.font='bold 20px monospace';c.textAlign='center';c.fillText(line,x+w/2,y+33,w-20);c.restore();}
