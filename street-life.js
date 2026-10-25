// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
// Decorative back sidewalk only: no colliders, enemies, rewards or game-state writes.
export const STREET_SCENES=[
 {food:'TACOS',truck:'#35847e',awning:'#efb461',flowers:'#f394ce'},
 {food:'LEMONADE',truck:'#be7558',awning:'#f6d68d',flowers:'#a4c7fa'},
 {food:'NOODLES',truck:'#5e76aa',awning:'#edc66e',flowers:'#f89a9a'},
 {food:'COFFEE',truck:'#497aa0',awning:'#e6b38c',flowers:'#be91ec'},
 {food:'BBQ',truck:'#ad5a56',awning:'#e6b979',flowers:'#eeb16c'},
 {food:'SOUP',truck:'#5c7c65',awning:'#e6ad56',flowers:'#df9dc3'},
 {food:'DONUTS',truck:'#647a9a',awning:'#c1dfe7',flowers:'#eab8d1'},
 {food:'DUMPLINGS',truck:'#8f555a',awning:'#efc578',flowers:'#ed94b6'},
 {food:'TEA',truck:'#4f7b78',awning:'#a7d7b7',flowers:'#c9a7ed'},
 {food:'BAO',truck:'#74608e',awning:'#eab8cc',flowers:'#eda974'},
 {food:'WATER',truck:'#4e827c',awning:'#afd8e7',flowers:'#e3cf7e'},
 {food:'PIZZA',truck:'#545d74',awning:'#e8d0b1',flowers:'#cf9ce5'}
];
export function streetLayout(stage){return {truck:150+(stage%3)*35,flowers:700+(stage%2)*60,play:1170+(stage%4)*25,baseline:459};}
function wheel(c,x,y){c.fillStyle='#172332';c.beginPath();c.arc(x,y,11,0,Math.PI*2);c.fill();c.fillStyle='#8f9ba0';c.beginPath();c.arc(x,y,5,0,Math.PI*2);c.fill();}
function foodTruck(c,s){
 c.fillStyle='#0b152255';c.beginPath();c.ellipse(0,1,100,8,0,0,Math.PI*2);c.fill();
 c.fillStyle='#243542';c.fillRect(-91,-80,130,70);c.fillStyle=s.truck;c.fillRect(-91,-75,130,58);c.fillRect(37,-61,42,44);c.fillStyle='#233744';c.fillRect(44,-55,27,23);c.fillStyle='#7696a0';c.fillRect(46,-53,22,4);c.fillStyle='#182a37';c.fillRect(-76,-62,79,36);c.fillStyle='#c2a887';c.fillRect(-80,-25,90,5);
 c.fillStyle=s.awning;c.beginPath();c.moveTo(-88,-70);c.lineTo(9,-70);c.lineTo(18,-58);c.lineTo(-96,-58);c.closePath();c.fill();c.fillStyle='#efe4c7';for(let i=0;i<5;i++)c.fillRect(-88+i*22,-69,10,11);
 c.fillStyle='#d8c394';c.fillRect(-69,-38,12,12);c.fillStyle='#87b4ae';c.fillRect(-49,-42,9,16);c.fillStyle='#eacdab';c.fillRect(-30,-33,22,7);c.fillStyle='#b8cabd';c.fillRect(36,-17,49,4);c.fillStyle='#ffe7aa';c.fillRect(77,-28,5,9);wheel(c,-60,-6);wheel(c,55,-6);
 c.fillStyle='#e9ddbc';c.font='bold 10px monospace';c.textAlign='center';c.fillText(s.food,-27,-85);
 // Quiet vendor behind the counter.
 c.fillStyle='#c79b7b';c.beginPath();c.arc(-20,-49,6,0,Math.PI*2);c.fill();c.fillStyle='#ece1ce';c.fillRect(-27,-46,14,19);c.fillStyle='#e5d8bf';c.fillRect(-28,-57,16,3);
}
function flowerStall(c,s){
 c.fillStyle='#152b2e';c.fillRect(-42,-8,85,7);c.fillStyle='#4b6656';c.fillRect(-44,-27,90,18);c.fillStyle='#9b7c56';c.fillRect(-41,-29,83,5);c.fillStyle='#b09b75';c.fillRect(-43,-104,3,77);c.fillRect(41,-104,3,77);
 c.fillStyle=s.awning;c.beginPath();c.moveTo(-52,-107);c.lineTo(50,-107);c.lineTo(58,-88);c.lineTo(-60,-88);c.closePath();c.fill();c.fillStyle='#f0dbbd';for(let i=0;i<5;i++)c.fillRect(-49+i*21,-102,9,14);
 for(let i=0;i<5;i++){const x=-33+i*17;c.fillStyle='#8b725b';c.fillRect(x-6,-40,12,14);c.strokeStyle='#5e8e67';c.lineWidth=2;for(let j=0;j<3;j++){const dx=(j-1)*5,y=-55-(i+j)%3*6;c.beginPath();c.moveTo(x,-38);c.lineTo(x+dx,y);c.stroke();c.fillStyle=j%2?s.flowers:'#f2d88c';c.beginPath();c.arc(x+dx,y,4,0,Math.PI*2);c.fill();}}
 c.fillStyle='#e5d5b4';c.fillRect(-24,-20,48,12);c.fillStyle='#526558';c.font='bold 8px monospace';c.textAlign='center';c.fillText('FLOWERS',0,-11);
}
function child(c,x,y,shirt,skin,flip){c.save();c.translate(x,y);c.scale(flip,1);c.strokeStyle='#485d73';c.lineWidth=4;c.beginPath();c.moveTo(-3,-11);c.lineTo(-5,0);c.moveTo(3,-11);c.lineTo(6,0);c.stroke();c.fillStyle=shirt;c.fillRect(-6,-28,12,19);c.fillStyle=skin;c.beginPath();c.arc(0,-35,7,0,Math.PI*2);c.fill();c.fillStyle='#453d3d';c.beginPath();c.arc(0,-38,7,Math.PI,Math.PI*2);c.fill();c.strokeStyle=skin;c.lineWidth=3;c.beginPath();c.moveTo(5,-25);c.lineTo(13,-19);c.stroke();c.restore();}
function playground(c,t){
 // Small static hopscotch markings and two children, entirely behind the play lane.
 c.strokeStyle='#b9b5a875';c.lineWidth=1;for(let i=0;i<4;i++)c.strokeRect(-22+i*13,-7,12,7);
 child(c,-43,-5,'#d2a66c','#c49776',1);child(c,44,-4,'#a1a8ce','#94735d',-1);
 const x=Math.sin(t*.5)*4;c.fillStyle='#e9d5a2';c.beginPath();c.arc(x,-11,6,0,Math.PI*2);c.fill();c.strokeStyle='#7e9f9c';c.beginPath();c.arc(x,-11,6,-.6,1.9);c.stroke();
 c.fillStyle='#4b6058';c.fillRect(-96,-5,25,6);c.fillStyle='#76906a';c.beginPath();c.ellipse(-83,-21,15,18,0,0,Math.PI*2);c.fill();
}
export function drawStreetLife(c,g){
 const s=STREET_SCENES[g.stage]||STREET_SCENES[0],layout=streetLayout(g.stage),offset=g.camera*.82,period=1800;
 c.save();c.globalAlpha=.86;
 for(let tile=Math.floor(offset/period)-1;tile<=Math.floor((offset+1280)/period)+1;tile++)for(const [key,draw] of [['truck',()=>foodTruck(c,s)],['flowers',()=>flowerStall(c,s)],['play',()=>playground(c,g.time)]]){
  const x=tile*period+layout[key]-offset;if(x< -160||x>1440)continue;c.save();c.translate(x,layout.baseline);draw();c.restore();
 }
 c.restore();
}
