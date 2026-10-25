// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
// Parked learning vans live on the sidewalk, outside the combat lane.
export function createLearningCenters(stage){return (stage===10?[0]:[0,3,6]).map((zone,index)=>({id:stage+':center:'+index,stage,index,zone,x:zone*1050+390+(stage*47+index*83)%180,y:488+(stage%3)*5,visited:false}));}
export function nearbyLearningCenter(g,p=g.player){if(!p||p.hp<=0||p.z>16||['gameover','victory'].includes(g.phase))return null;return (g.learningCenters||[]).find(k=>k.zone===g.zone&&Math.abs(p.x-k.x)<94&&Math.abs(p.y-k.y)<38)||null;}
export function enterLearningCenter(g,p=g.player){const center=nearbyLearningCenter(g,p);if(!center||g.learningEvents.length)return false;center.visited=true;g.learningEvents.push({id:center.id,stage:g.stage,level:g.difficulty,owner:p.playerIndex||0});return true;}
function round(c,x,y,w,h,r,fill,stroke){c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.stroke();}}
export function drawLearningCenters(c,g){for(const k of g.learningCenters||[]){const x=k.x-g.camera,y=k.y-22;if(k.zone!==g.zone||x< -170||x>1450)continue;c.save();c.translate(Math.round(x),Math.round(y));c.lineWidth=3;
 const accent=['#5ee9c0','#ffb97e','#90b8ff','#da9cfc'][g.stage%4];
 c.fillStyle='#07132075';c.beginPath();c.ellipse(0,7,148,15,0,0,Math.PI*2);c.fill();
 // Curved painted coachwork, cream roof, sloped windshield and inset panels.
 round(c,-133,-113,265,110,[24,36,18,18],'#102f42','#081a2d');round(c,-128,-122,250,91,[24,38,12,12],accent,'#132e3c');
 c.fillStyle='#f8e8be';c.beginPath();c.moveTo(-123,-105);c.quadraticCurveTo(-130,-142,-96,-144);c.lineTo(81,-144);c.quadraticCurveTo(108,-144,118,-112);c.closePath();c.fill();
 c.fillStyle='#173b50';c.beginPath();c.moveTo(77,-111);c.lineTo(104,-111);c.lineTo(120,-74);c.lineTo(79,-74);c.closePath();c.fill();c.fillStyle='#83e4e866';c.beginPath();c.moveTo(84,-107);c.lineTo(99,-107);c.lineTo(109,-81);c.lineTo(84,-81);c.fill();
 round(c,-112,-102,164,60,8,'#142c3a','#37636b');round(c,-105,-95,150,45,5,'#304e5a');
 // Serving shelf with a laptop and small books inside; no loose street pickups.
 round(c,-121,-44,183,9,4,'#f9d6a0','#674b42');c.fillStyle='#27445a';c.fillRect(-52,-81,35,24);c.fillStyle='#89ffe2';c.fillRect(-48,-77,27,16);c.fillStyle='#edc88d';c.fillRect(-58,-56,47,4);for(let i=0;i<4;i++){c.fillStyle=['#ff8e95','#f1c875','#7ad2cc','#c6a1ff'][i];c.fillRect(6+i*8,-74+i%2*4,6,20-i%2*4);}
 // Striped scalloped awning and warm lights.
 c.fillStyle='#154a54';c.beginPath();c.moveTo(-128,-112);c.lineTo(59,-112);c.lineTo(69,-94);c.lineTo(-139,-94);c.closePath();c.fill();for(let i=0;i<10;i++){c.fillStyle=i%2?'#f7e5bd':'#e77f78';c.beginPath();c.moveTo(-128+i*19,-112);c.lineTo(-109+i*19,-112);c.lineTo(-118+i*21,-94);c.lineTo(-139+i*21,-94);c.closePath();c.fill();c.beginPath();c.arc(-129+i*21,-94,10,0,Math.PI);c.fill();}
 for(let i=0;i<7;i++){c.fillStyle='#fff3b6';c.beginPath();c.arc(-112+i*25,-86,2.5,0,7);c.fill();}
 // Neon sign follows the rounded roof, with hand-painted trim.
 round(c,-116,-169,218,30,11,'#122f3b','#f3c985');c.fillStyle='#d3fff1';c.font='bold 17px monospace';c.textAlign='center';c.fillText('LEARNING CENTER',-7,-148,203);
 c.fillStyle='#36595f';c.fillRect(75,-61,39,4);c.fillStyle='#ffe7a3';c.fillRect(119,-51,9,13);c.fillStyle='#ee8e82';c.fillRect(-132,-42,6,13);round(c,-137,-18,275,8,4,'#e8cf9a');
 for(const wx of [-87,87]){c.fillStyle='#091624';c.beginPath();c.arc(wx,-5,21,0,7);c.fill();c.fillStyle='#607b87';c.beginPath();c.arc(wx,-5,12,0,7);c.fill();c.fillStyle='#e6e9d0';c.beginPath();c.arc(wx,-5,5,0,7);c.fill();}
 // Chalkboard crest and flower pot finish the sidewalk silhouette.
 c.fillStyle='#f6db9a';c.font='bold 17px monospace';c.fillText('TR',-20,-18);c.fillStyle='#aa7463';c.beginPath();c.moveTo(-154,-28);c.lineTo(-129,-28);c.lineTo(-133,-6);c.lineTo(-150,-6);c.closePath();c.fill();for(let i=0;i<5;i++){c.fillStyle=i%2?'#6bc397':'#a8d996';c.beginPath();c.ellipse(-143+(i-2)*5,-36-(i%2)*8,5,13,(i-2)*.4,0,7);c.fill();}
 c.restore();}
 const near=(g.players||[g.player]).map(p=>({p,k:nearbyLearningCenter(g,p)})).find(x=>x.k);if(near){c.save();c.font='bold 16px monospace';c.textAlign='center';const x=Math.max(145,Math.min(1135,near.k.x-g.camera));round(c,x-132,near.k.y+25,264,28,12,'#082e36d9','#79f8d5');c.fillStyle='#d9fff0';c.fillText('V · LEARNING CENTER',x,near.k.y+45);c.restore();}
}
