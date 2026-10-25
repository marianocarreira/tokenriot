// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import {art,drawCharacter} from './sprites.js';
export function drawChallenge(ctx,item,t,selected='Nano',contractDone=false){
 ctx.save();ctx.filter='brightness(.8) contrast(.95)';ctx.drawImage(art.mission,0,0,1280,720);ctx.restore();ctx.fillStyle='#030c23aa';ctx.fillRect(0,0,1280,720);
 const box=(x,y,w,h,col)=>{ctx.fillStyle=col;ctx.fillRect(x,y,w,h);};const text=(txt,x,y,size=24)=>{ctx.font='bold '+size+'px monospace';ctx.fillStyle='#adffef';ctx.textAlign='center';ctx.fillText(txt,x,y,1180);};
 text('BETWEEN DISTRICTS // CIVIC CONTRACT',640,85,30);if(!item){text('GENERATING MISSION…',640,350);return;}
 // A finite prop vocabulary keeps model output data-only, while place/type combine into a scene.
 const floor=item.place==='rooftop'?470:610;if(item.place==='rooftop'){box(70,floor,1140,220,'#142236');for(let i=0;i<13;i++)box(90+i*86,floor+55,48,80,'#233b50');}box(70,floor,1140,24,'#26384b');
 for(const object of item.ui_objects||[])drawMissionObject(ctx,object,t,contractDone);
 drawCharacter(ctx,selected,350,floor,205,'idle',0,1,'#51faff');text(item.title.toUpperCase(),640,145,25);text(item.type.toUpperCase()+' // '+item.place.toUpperCase(),640,190,18);text(contractDone?'CONTRACT COMPLETE':'PLAN YOUR SOLUTION IN THE TERMINAL BELOW',640,680,20);
}


function drawMissionObject(ctx,o,time,done){
 const {x,y,width:w,height:h,type}=o;ctx.save();const rect=(a,b,c,d,color)=>{ctx.fillStyle=color;ctx.fillRect(Math.round(a),Math.round(b),c,d);};
 const edge=(color='#63e7dd')=>{ctx.strokeStyle=color;ctx.lineWidth=3;ctx.strokeRect(x,y-h,w,h);};
 if(type==='citizen'){rect(x+w*.3,y-h,w*.35,h*.25,'#efbe98');rect(x+w*.2,y-h*.72,w*.55,h*.5,done?'#83f7ad':'#d088cc');rect(x+w*.2,y-h*.2,w*.2,h*.2,'#244b6d');rect(x+w*.55,y-h*.2,w*.2,h*.2,'#244b6d');}
 else if(type==='water'){rect(x,y-h,w,h,'#1d6b9c99');for(let n=0;n<6;n++)rect(x+n*w/6,y-h*.6+Math.sin(time*2+n)*4,w/10,3,'#a6e7ff');}
 else if(type==='ladder'){for(let n=0;n<9;n++){if(n===4)continue;rect(x,y-h+n*h/9,w,4,'#b1c5ca');}rect(x,y-h,6,h,'#b1c5ca');rect(x+w-6,y-h,6,h,'#b1c5ca');}
 else if(type==='cable'||type==='bridge'){rect(x,y-h/2,w,type==='bridge'?14:5,done?'#83ffab':'#d3bc79');for(let n=0;n<5;n++)rect(x+n*w/5,y-h/2,w/12,4,'#52e7dd');}
 else if(type==='tunnel'){rect(x,y-h,w,h,'#030912');edge('#697689');}
 else if(type==='van'){rect(x,y-h,w,h*.8,'#b7cbd1');rect(x+w*.7,y-h*.85,w*.23,h*.32,'#274964');rect(x+w*.12,y-h*.2,w*.17,h*.2,'#071426');rect(x+w*.75,y-h*.2,w*.17,h*.2,'#071426');edge('#a2f1ef');}
 else if(type==='glass'){rect(x,y-h,w,h,'#92ecff38');edge('#b7ffff');ctx.beginPath();ctx.moveTo(x+8,y-8);ctx.lineTo(x+w-8,y-h+8);ctx.stroke();}
 else if(type==='medicine'){rect(x,y-h,w,h,'#e3f2ee');rect(x+w*.43,y-h*.85,w*.14,h*.7,'#ff7192');rect(x+w*.18,y-h*.57,w*.64,h*.14,'#ff7192');}
 else{const color={roof:'#2e435c',platform:'#2e435c',generator:'#365a68',crate:'#795439',door:'#4c5a6c',tools:'#997441'}[type]||'#334d62';rect(x,y-h,w,h,color);edge();for(let n=1;n<4;n++)rect(x+6,y-h+n*h/4,w-12,3,'#111f32');if(type==='generator')rect(x+w*.65,y-h*.8,w*.2,h*.18,done?'#86ffa0':'#ffcc5e');}
 ctx.font='bold 14px monospace';ctx.textAlign='center';ctx.fillStyle='#c8ffed';ctx.shadowColor='#000';ctx.shadowBlur=5;ctx.fillText(o.label,x+w/2,y+19,Math.max(90,w+40));ctx.restore();
}
