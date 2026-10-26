// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import {tr,wrapLocalizedText} from './i18n.js';
import {stageNumber} from './campaign.js';
import {CHINA_STORIES,drawChinaBackdrop} from './world-finale.js';
import {art,drawCharacter,drawBullet,drawBoss} from './sprites.js';
export const STAGE_BANNER_MS=1200;
const storyClamp=x=>Math.max(0,Math.min(1,x));
function storyText(c,text,x,y,size=30,color='#eaffff',align='left'){
 c.font='bold '+size+'px monospace';c.textAlign=align;c.fillStyle=color;c.shadowColor=color;c.shadowBlur=size>=28?3:5;c.fillText(text,x,y);c.shadowBlur=0;
}
export function drawStageBanner(c,t,index=0,place='MISSION BAY'){
 c.fillStyle='#030716';c.fillRect(0,0,1280,720);
 c.save();const progress=storyClamp(t/.35);c.globalAlpha=progress;
 const glow=c.createRadialGradient(640,360,30,640,360,650);glow.addColorStop(0,'#174762');glow.addColorStop(1,'#030716');c.fillStyle=glow;c.fillRect(0,0,1280,720);
 for(let i=0;i<15;i++){c.fillStyle=i%2?'#ef35be44':'#29edff44';c.fillRect((i*197+t*900)%1500-150,160+i*29,130,2);}
 c.translate(640,350);const scale=1.6-.6*storyClamp(t/.28);c.scale(scale,scale);storyText(c,'STAGE '+stageNumber(index),0,0,126,'#dfffff','center');storyText(c,place,0,70,29,'#ff51d3','center');c.restore();
}
export function drawComic(c,t,page=null,canAdvance=true){
 const index=page===null?(t<3.3?0:t<6.6?1:2):page,start=index===0?0:index===1?3.3:6.6,local=page===null?t-start:t,motion=Math.min(local,4);
 const boxes=[[0,0,966,544],[0,544,966,516],[0,1060,966,569]],box=boxes[index];
 c.fillStyle='#040819';c.fillRect(0,0,1280,720);
 c.save();c.beginPath();c.rect(0,25,1280,640);c.clip();
 const zoom=1.04+motion*(index===2?.035:.016),w=1280*zoom,h=720*zoom;
 const laughter=index===2?Math.sin(local*19)*Math.min(1.3,Math.max(0,local-1.3))*1.4:0;
 c.drawImage(art.comic,...box,(1280-w)/2+Math.sin(local*.5)*12,(720-h)/2+laughter,w,h);
 // Animated light slashes, particles, hard cuts and push-in give the still comic art motion.
 c.globalCompositeOperation='screen';
 for(let i=0;i<25;i++){
  const x=(i*173+t*(index===2?55:28))%1280,y=(i*89+t*23)%720;
  c.fillStyle=i%2?'#ff5bd466':'#59faff88';c.fillRect(x,y,2+(i%3),2);
 }
 if(local<.20){c.globalAlpha=1-local/.20;c.fillStyle='#c5ffff';c.fillRect(0,0,1280,720);}
 c.restore();
 c.fillStyle='#030716';c.fillRect(0,0,1280,35);c.fillRect(0,572,1280,148);
 storyText(c,'FICTIONAL ARCADE STORY',200,24,17,'#99c3de');storyText(c,String(index+1).padStart(2,'0')+' / 03',1100,24,17,'#6dfaff','right');
 const slide=(1-storyClamp(local/.22))*60;c.save();c.translate(slide,0);
 if(index===0){storyText(c,'2015 // THE BEGINNING',40,610,23,'#65faff');storyText(c,'A nonprofit lab is born. AI for humanity.',40,657,40);}
 if(index===1){storyText(c,'A DRAMATIZED CLASH OF VISIONS',40,608,22,'#ff73d7');storyText(c,'SAM: "CLOSED CODE. EVERY TOKEN IS MINE."',40,648,38);storyText(c,'ELON: "OPEN THE SOURCE. LET PEOPLE BUILD."',40,688,38,'#6eeeff');}
 if(index===2){storyText(c,'2086 // THE FICTIONAL TOKEN EMPIRE',40,608,23,'#ff73d7');storyText(c,'SAM: "EVERY TOKEN... THROUGH ME!"',40,650,38);if(local>1.3)storyText(c,'HA. HA. HA!',1210,692,28,'#71faff','right');}
 c.restore();if(page!==null&&canAdvance)storyText(c,'Press Enter',1230,556,21,'#d0ffff','right');
 c.fillStyle='#3bf6ff';c.fillRect(0,717,1280*(page===null?storyClamp(t/10):(index+1)/3),3);
}

export const STAGE_STORIES=[null,
 [['2021 // A NEW LAB','Dario and Daniela Amodei, Chris Olah and Jared Kaplan leave OpenAI and found Anthropic.'],['A DIFFERENT DIRECTION','Safety and commercial priorities divide the labs. A new mission takes shape.'],['THE FEAR ENGINE // FICTION','DARIO: "Fear the machine! Only my empire can keep you safe!"']],
 [['THE SEARCH PIONEERS','Larry Page and Sergey Brin connect the world through search.'],['THE WEB BECOMES A KINGDOM // FICTION','In this arcade world, every link feeds their network.'],['THE INTERNET THRONE // FICTION','THE FOUNDERS: "Every road on the web will lead to us!"']],
 [['MENLO PARK // CONNECTED WORLD','Messages, photos and friendships fill the screens.'],['THE PUPPET NETWORK // FICTION','An AI machine turns the social feed into strings.'],['THE SOCIAL CONTROLLER // FICTION','MARK: "I choose the feed. I choose what the world believes!"']],
 [['A PROMISE TO HUMANITY // FICTION','ELON: "We must control AI to preserve humanity."'],['BEHIND THE CURTAIN // FICTION','While the speech continues, a secret machine awakens.'],['THE MONSTER ANSWERS // FICTION','ELON: "For your safety... my creation will take control!"']],
 [['SEATTLE // THE DELIVERY EMPIRE','Glass spheres rise above an endless stream of parcels.'],['THE GOLDEN CHECKOUT // FICTION','Every street becomes a checkout. Every citizen, a customer.'],['THE PRICE OF EVERYTHING // FICTION','JEFF: "Your last coin belongs in my cart!"']],
 [['REDMOND // COPILOT ONLINE','A fictional Bill Gates arcade avatar enters the control room.'],['THE PANIC BROADCAST // FICTION','Imaginary pandemic alarms fill the screens while the coin counter climbs.'],['THE FEAR MERCHANT // FICTION','BILL: "Keep them afraid. Keep them paying!"']]
];
function wrapStory(c,text,x,y,width,size=28){c.font='bold '+size+'px monospace';for(const [row,line] of wrapLocalizedText(c,text,width).entries())storyText(c,line,x,y+row*34,size);}
export function drawStageStory(c,t,index,page){
 if(index===0){drawComic(c,t,page);return;}
 if(index===11){c.fillStyle='#030716';c.fillRect(0,0,1280,720);c.save();c.beginPath();c.rect(0,35,1280,510);c.clip();c.drawImage(art.vercel,0,0,1280,600);drawBoss(c,12,880+Math.sin(t)*8,535,340,1);c.restore();const story=[['SAN FRANCISCO // A NEW DEPLOY','Guille Rauch opens the gates of a fictional Vercel deployment empire.'],['THE EDGE ARMY // FICTION','Triangle drones, mates, thermoses, alfajores and web servers guard every route.'],['THE LAST DEPLOY // FICTION','GUILLE: "Every request reaches my edge. Can you ship your way through?"']][page];storyText(c,'FICTIONAL SATIRICAL ARCADE STORY',180,25,17,'#9edce6');storyText(c,(page+1)+' / 3',1240,25,17,'#9edce6','right');storyText(c,story[0],30,585,23,'#c8faff');wrapStory(c,story[1],30,627,1210);storyText(c,'Press Enter',1240,535,20,'#fff','right');return;}
 if(index>=7){c.fillStyle='#030716';c.fillRect(0,0,1280,720);c.save();c.beginPath();c.rect(0,35,1280,510);c.clip();drawChinaBackdrop(c,t,index);drawBoss(c,index,930+Math.sin(t*.8)*8,550,340,-1);if(index===10)drawBoss(c,11,530+Math.sin(t)*6,550,340,1);c.restore();storyText(c,'FICTIONAL SATIRICAL ARCADE STORY',180,25,17,'#9edce6');storyText(c,(page+1)+' / 3',1240,25,17,'#9edce6','right');storyText(c,CHINA_STORIES[index-7][page][0],30,585,23,'#ffbc86');wrapStory(c,CHINA_STORIES[index-7][page][1],30,627,1210);storyText(c,'Press Enter',1240,535,20,'#fff','right');return;}
 const rows=6,cols=3,w=art.stories.width/cols,h=art.stories.height/rows,zoom=1.025+Math.min(t,5)*.01;
 c.fillStyle='#030716';c.fillRect(0,0,1280,720);c.save();c.beginPath();c.rect(0,35,1280,510);c.clip();c.translate(640,290);c.scale(zoom,zoom);c.drawImage(art.stories,page*w,(index-1)*h,w,h,-640,-255,1280,510);c.restore();
 for(let i=0;i<16;i++){c.fillStyle=i%2?'#ff71d477':'#6affff88';c.fillRect((i*139+t*23)%1280,80+(i*59)%440,3,3);}
 storyText(c,'FICTIONAL SATIRICAL ARCADE STORY',190,25,17,'#9edce6');storyText(c,(page+1)+' / 3',1240,25,17,'#9edce6','right');
 storyText(c,STAGE_STORIES[index][page][0],30,585,23,'#ffbc86');wrapStory(c,STAGE_STORIES[index][page][1],30,627,1210);storyText(c,'Press Enter',1240,535,20,'#fff','right');
}
export function drawBossDefeat(c,t,index,company){
 c.fillStyle='#09081b';c.fillRect(0,0,1280,720);const glow=c.createRadialGradient(640,325,30,640,325,430);glow.addColorStop(0,'#823459');glow.addColorStop(1,'#09081b');c.fillStyle=glow;c.fillRect(0,0,1280,720);
 if(index===11)drawBoss(c,12,640,520,380,1,false,true);else if(index>=7){drawBoss(c,index, index===10?470:640,520,380,1,false,true);if(index===10)drawBoss(c,11,810,520,380,-1,false,true);}else{
 const portraitWidth=art.defeated.width/7;c.save();c.translate(640,300);c.rotate(Math.sin(t*1.5)*.012);c.drawImage(art.defeated,index*portraitWidth,0,portraitWidth,art.defeated.height,-210,-220,420,440);c.restore();}
 for(let i=0;i<3;i++){const a=t*1.4+i*Math.PI*2/3,x=640+Math.cos(a)*160,y=151+Math.sin(a)*22;storyText(c,'★',x,y,32,'#ffec76','center');}
 storyText(c,'YOU HAVE BEATEN '+company.toUpperCase(),640,580,40,'#fff49b','center');storyText(c,'FICTIONAL ARCADE RIVAL DEFEATED',640,625,19,'#85e7ff','center');storyText(c,'Press Enter',640,683,25,'#fff','center');
}
