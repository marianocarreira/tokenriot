// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
// One coin represents one saved output token. Expertise adds points, never coins.
export function rewardValuation(result){
 const accounts=result?.players?.length?result.players:[result];
 const rows=accounts.filter(Boolean).map(account=>({tokens:account.tokens,rate:account.usdPerToken,brand:account.brand,model:account.modelName,cached:!!account.cached,pricedAt:account.pricedAt}));
 if(!rows.length||rows.some(row=>!Number.isSafeInteger(row.tokens)||row.tokens<0||!Number.isFinite(row.rate)||row.rate<0))return null;
 return {rows,tokens:rows.reduce((n,row)=>n+row.tokens,0),usd:rows.reduce((n,row)=>n+row.tokens*row.rate,0)};
}
export function rewardUSD(value){return '$'+Number(value).toFixed(8);}
function rewardText(c,label,x,y,size=20,color='#c7ebda',font='monospace',maxWidth){c.fillStyle=color;c.font='600 '+size+'px '+font;c.textAlign='center';if(maxWidth)c.fillText(label,x,y,maxWidth);else c.fillText(label,x,y);}
function rewardGlow(c,x,y,r,color){const g=c.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'#00351b00');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);}
function rewardSpark(c,x,y,size,tone='#d8fff0'){c.save();c.shadowColor=tone;c.shadowBlur=14;c.fillStyle=tone;c.beginPath();c.moveTo(x,y-size);c.quadraticCurveTo(x+size*.15,y-size*.15,x+size,y);c.quadraticCurveTo(x+size*.15,y+size*.15,x,y+size);c.quadraticCurveTo(x-size*.15,y+size*.15,x-size,y);c.quadraticCurveTo(x-size*.15,y-size*.15,x,y-size);c.fill();c.restore();}
function rewardMedal(c,x,y,r,kind,t){
 c.save();c.translate(x,y);c.shadowColor=kind==='coin'?'#ffc72c80':'#00ffad70';c.shadowBlur=20;c.shadowOffsetY=6;
 const gold=kind==='coin',g=c.createLinearGradient(-r,-r,r,r);g.addColorStop(0,gold?'#fff4aa':'#b8ffdf');g.addColorStop(.18,gold?'#f9cd4b':'#29e8a0');g.addColorStop(.48,gold?'#ba740e':'#08784e');g.addColorStop(.72,gold?'#ffe38a':'#4cfac0');g.addColorStop(1,gold?'#80500d':'#034c35');c.fillStyle=g;c.strokeStyle=gold?'#ffe99c':'#8affe0';c.lineWidth=2;
 c.beginPath();if(kind==='score'){c.moveTo(0,-r);c.quadraticCurveTo(12,-r,20,-r+12);c.lineTo(r-6,-10);c.quadraticCurveTo(r+3,0,r-6,10);c.lineTo(13,r-5);c.quadraticCurveTo(0,r+6,-13,r-5);c.lineTo(-r+6,10);c.quadraticCurveTo(-r-3,0,-r+6,-10);c.lineTo(-20,-r+12);c.closePath();}else c.arc(0,0,r,0,Math.PI*2);c.fill();c.stroke();
 c.shadowBlur=0;c.shadowOffsetY=0;c.strokeStyle=gold?'#754100':'#004e36';c.lineWidth=5;c.beginPath();if(kind==='score'){c.moveTo(0,-r+13);c.lineTo(r-14,0);c.lineTo(0,r-13);c.lineTo(-r+14,0);c.closePath();}else c.arc(0,0,r-9,0,Math.PI*2);c.stroke();
 c.strokeStyle=gold?'#fff1a7':'#a0ffe0';c.lineWidth=1.5;c.beginPath();c.arc(0,0,r-14,Math.PI*1.04,Math.PI*1.83);c.stroke();
 if(kind==='badge'){for(let side of [-1,1])for(let i=0;i<6;i++){const a=-1.03+i*.34,xx=side*Math.cos(a)*r*.69,yy=Math.sin(a)*r*.69;c.save();c.translate(xx,yy);c.rotate(side*(a+.6));c.fillStyle=i%2?'#b0ffe0':'#50c995';c.beginPath();c.ellipse(0,0,4,10,side*.4,0,Math.PI*2);c.fill();c.restore();}c.fillStyle='#c1ffe3';c.beginPath();for(let n=0;n<10;n++){const a=-Math.PI/2+n*Math.PI/5,rr=n%2?r*.19:r*.43;c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}c.closePath();c.fill();}
 else{c.save();c.shadowColor=gold?'#fff5b3':'#a2ffdb';c.shadowBlur=3;rewardText(c,gold?'TR':'I',0,gold?20:24,gold?56:69,gold?'#fff0b0':'#d5fff0','Georgia');c.restore();}
 // A clipped specular sweep gives the metal a moving reflection.
 c.save();c.beginPath();if(kind==='score'){c.moveTo(0,-r);c.lineTo(r,0);c.lineTo(0,r);c.lineTo(-r,0);c.closePath();}else c.arc(0,0,r-2,0,Math.PI*2);c.clip();const sweep=(t*.18)%2-1,shine=c.createLinearGradient(-r+sweep*r*2,-r,r+sweep*r*2,r);shine.addColorStop(0,'#ffffff00');shine.addColorStop(.45,'#ffffff00');shine.addColorStop(.5,'#ffffff55');shine.addColorStop(.55,'#ffffff00');shine.addColorStop(1,'#ffffff00');c.fillStyle=shine;c.fillRect(-r,-r,r*2,r*2);c.restore();c.restore();
}
function rewardPlatform(c,x,y,r,kind,t){
 rewardGlow(c,x,y-13,r*1.8,kind==='coin'?'#c5a63124':'#00e78528');
 c.save();c.fillStyle='#000c08';c.shadowColor='#000';c.shadowBlur=18;c.beginPath();c.ellipse(x,y+19,r*1.16,12,0,0,Math.PI*2);c.fill();c.restore();
 c.save();c.beginPath();c.rect(x-r*1.3,y+15,r*2.6,45);c.clip();c.translate(x,y+28);c.scale(1,-.25);c.globalAlpha=.16;rewardMedal(c,0,65,r,kind,t);c.restore();
 const beam=c.createLinearGradient(x-r,y,x+r,y);beam.addColorStop(0,'#34ffb500');beam.addColorStop(.5,kind==='coin'?'#fbe29d':'#90ffcd');beam.addColorStop(1,'#34ffb500');c.fillStyle=beam;c.fillRect(x-r,y+16,r*2,2);
}
function rewardMiniBadges(c,badges,x,y){
 const visible=badges.slice(0,72),cols=12,rows=Math.ceil(visible.length/cols),gap=19;
 for(let i=0;i<visible.length;i++){const b=visible[i],row=Math.floor(i/cols),rowCount=Math.min(cols,visible.length-row*cols),xx=x+(i%cols-(rowCount-1)/2)*gap,yy=y+row*18;
 c.save();const g=c.createLinearGradient(xx-7,yy-7,xx+7,yy+7),tone=b.level==='hard'?['#ffe7ff','#a065c8']:b.level==='medium'?['#e7ffff','#669ca9']:['#fff5b5','#af7824'];g.addColorStop(0,tone[0]);g.addColorStop(1,tone[1]);c.fillStyle=g;c.shadowColor=tone[0];c.shadowBlur=4;c.beginPath();c.arc(xx,yy,7,0,Math.PI*2);c.fill();c.shadowBlur=0;c.strokeStyle=tone[0];c.lineWidth=.6;c.stroke();rewardText(c,b.mark||'TR',xx,yy+2.2,5,'#133a29');c.restore();}
 return rows;
}
export function drawRewardShowcase(c,t,result,loading=false,error='',backdrop=null){
 c.save();c.fillStyle='#001d19';c.fillRect(0,0,1280,720);
 if(backdrop){c.save();c.globalAlpha=.18;c.filter='blur(9px)';c.drawImage(backdrop,-12,-12,1304,744);c.restore();}
 rewardGlow(c,145,105,470,'#0c966850');rewardGlow(c,1160,530,520,'#00794f4d');rewardGlow(c,680,25,430,'#21eab02e');
 for(let i=0;i<26;i++){const x=(i*197+Math.sin(t*.17+i)*19)%1280,y=(i*97+t*(2+i%3))%720;rewardGlow(c,x,y,3+i%4,'#3cffb520');}
 c.save();c.shadowColor='#000e';c.shadowBlur=45;c.shadowOffsetY=22;c.fillStyle='#00140feb';c.beginPath();c.roundRect(118,67,1044,577,18);c.fill();c.restore();
 const edge=c.createLinearGradient(118,67,1162,644);edge.addColorStop(0,'#5dffc65e');edge.addColorStop(.45,'#14785816');edge.addColorStop(1,'#1edb9242');c.strokeStyle=edge;c.lineWidth=1;c.beginPath();c.roundRect(118,67,1044,577,18);c.stroke();
 rewardText(c,'CONGRATULATIONS!',640,118,30,'#74ffc4','Georgia');rewardText(c,'ONE PLANET. ONE VICTORY.',640,149,15,'#5d9c88');
 const rise=Math.min(1,Math.max(0,t)/1.3),score=Math.round((result?.score??((result?.tokens||0)+(result?.badgeBonus||0)))*rise),tokens=result?.tokens||0,bonus=result?.badgeBonus||0,count=result?.badgeCount||0;
 const bob=Math.sin(t*1.4)*3,roundness=c.canvas?.clientWidth>0&&c.canvas?.clientHeight>0?(c.canvas.clientHeight/720)/(c.canvas.clientWidth/1280):1;
 for(const [x,r,kind] of [[339,65,'score'],[640,83,'coin'],[941,65,'badge']]){c.save();c.translate(x,0);c.scale(roundness,1);rewardPlatform(c,0,336,r,kind,t);rewardMedal(c,0,259+bob,r,kind,t);c.restore();}
 rewardSpark(c,592,202,8+Math.sin(t*3)*2,'#fff0af');rewardSpark(c,694,287,5,'#ffe9a6');rewardSpark(c,304,224,5,'#a5ffdc');rewardSpark(c,979,210,6,'#a5ffdc');
 rewardText(c,'FINAL SCORE',339,384,16,'#7fbd9e');rewardText(c,score.toLocaleString('en-US'),339,422,40,'#dcffe9','Georgia');rewardText(c,'EXPERTISE BONUS +'+bonus,339,449,15,'#60b893');
 rewardText(c,'TOKEN COINS',640,384,16,'#c2b77d');rewardText(c,'TR × '+tokens.toLocaleString('en-US'),640,422,40,'#fff0b0','Georgia');rewardText(c,'WATER '+(result?.waterPercent||0)+'%',640,449,15,'#60b893');
 rewardText(c,'BADGES WON',941,384,16,'#7fbd9e');rewardText(c,String(count),941,422,40,'#dcffe9','Georgia');
 const badges=result?.badges||[];if(badges.length)rewardMiniBadges(c,badges,941,444);else rewardText(c,'EXPERTISE',941,449,15,'#60b893');
 const value=rewardValuation(result),cashY=518;
 rewardText(c,'ESTIMATED VALUE',640,488,15,'#66ac93');
 if(loading){rewardText(c,'Calculating estimated value...',640,cashY,22,'#9de5c2','Georgia');}
 else if(error||!value){rewardText(c,'Valuation unavailable · R: retry',640,cashY,18,'#b0d6c6');}
 else{rewardText(c,rewardUSD(value.usd)+' USD',640,cashY,34,'#baffd7','Georgia');
  const formula=value.rows.map(row=>row.tokens.toLocaleString('en-US')+' × '+rewardUSD(row.rate)+(value.rows.length>1?' '+row.brand:'')).join('  +  ');rewardText(c,formula+' = '+rewardUSD(value.usd)+' USD',640,547,16,'#8ec5a6', 'monospace',930);
  const brands=[...new Set(value.rows.map(row=>row.brand).filter(Boolean))].join(' + ');rewardText(c,(brands?brands+' · ':'')+'estimated output-token price',640,570,13,'#4e8872');}
 // Keep the earned collection compact even after collecting all difficulties.
 
 rewardText(c,'Press Enter',640,675,17,'#8bc9aa');c.restore();
}
