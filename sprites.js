// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
// All coordinates refer to the ORIGINAL 1448 x 1086 supplied sheets.
// Frames are individually measured, not a uniform atlas.
export const companies=['OpenAI','Claude','Gemini','Llama','Qwen','DeepSeek','Mistral','Grok','Kimi','Gemma'];
export const companyBulletIndices=[0,1,2,3,4,5,6,7,8,9];
export const art={};
// Measured actor bounds: generated figures cross the atlas's nominal column lines.
const CHINA_BOSS_CROPS={combat:[[0,0,300,520],[304,0,294,520],[596,0,286,520],[880,0,314,520],[1198,0,338,520]],defeated:[[0,530,306,494],[304,530,298,494],[602,530,296,494],[870,530,360,494],[1186,530,350,494]]};
function chinaBossFrame(box){const sx=art.chinaBosses.width/1536,sy=art.chinaBosses.height/1024;return trimAlpha(isolateCharacter(keyedCrop(art.chinaBosses,box.map((v,i)=>Math.round(v*(i%2?sy:sx))),true)));}

const frames={Nano:{idle:[[24,59,148,294],[178,59,149,294],[332,59,157,294],[490,59,158,294]],walk:[[716,59,168,294],[886,59,170,294],[1065,59,171,294],[1240,59,170,294]],run:[[25,434,194,272],[208,434,194,272],[383,434,235,272],[603,434,232,272]],attack:[[555,802,193,252],[749,802,230,252],[749,802,230,252],[1198,802,228,252]]},Pili:{idle:[[35,56,144,300],[200,56,142,300],[359,56,144,300],[519,56,142,300]],walk:[[718,56,177,300],[894,56,182,300],[1070,56,182,300],[1247,56,177,300]],run:[[18,431,178,282],[180,431,202,282],[376,431,235,282],[596,431,239,282]],attack:[[543,800,207,259],[746,800,228,259],[746,800,228,259],[1193,800,237,259]]}};
frames.Nano.crouch=[[344,870,174,185]];frames.Pili.crouch=[[352,852,177,210]];
frames.Nano.jump=[[866,465,197,255],[1080,420,175,235],[1257,475,175,245]];frames.Pili.jump=[[873,487,194,239],[1080,417,180,240],[1263,475,180,245]];
const sprites={};
function imageFile(file){return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error('Asset unavailable: '+file));i.src='./assets/'+file;});}
export function cut(source,box){
 const [x,y,w,h]=box,out=document.createElement('canvas');out.width=w;out.height=h;const ctx=out.getContext('2d',{willReadFrequently:true});ctx.drawImage(source,x,y,w,h,0,0,w,h);
 const pixels=ctx.getImageData(0,0,w,h),data=pixels.data,seen=new Uint8Array(w*h),queue=new Int32Array(w*h);let head=0,tail=0;
 // Flood only the exterior cream/white paper. Enclosed pale details in the original art survive.
 const offer=n=>{if(n<0||n>=w*h||seen[n])return;seen[n]=1;const p=n*4,r=data[p],g=data[p+1],b=data[p+2];if(r>204&&g>199&&b>186&&Math.max(r,g,b)-Math.min(r,g,b)<58){queue[tail++]=n;data[p+3]=0;}};
 for(let xx=0;xx<w;xx++){offer(xx);offer((h-1)*w+xx);}for(let yy=0;yy<h;yy++){offer(yy*w);offer(yy*w+w-1);}
 while(head<tail){const n=queue[head++];if(n%w)offer(n-1);if(n%w<w-1)offer(n+1);offer(n-w);offer(n+w);}
 ctx.putImageData(pixels,0,0);return out;
}

function isolateCharacter(canvas){
 const ctx=canvas.getContext('2d',{willReadFrequently:true}),w=canvas.width,h=canvas.height,pixels=ctx.getImageData(0,0,w,h),data=pixels.data,labels=new Int32Array(w*h),queue=new Int32Array(w*h);let id=0,best=0,bestSize=0;
 for(let start=0;start<w*h;start++){
  if(labels[start]||!data[start*4+3])continue;
  id++;let head=0,tail=1;queue[0]=start;labels[start]=id;
  while(head<tail){const n=queue[head++],x=n%w,y=Math.floor(n/w);
   for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,yy=y+dy,k=yy*w+xx;if(xx>=0&&xx<w&&yy>=0&&yy<h&&!labels[k]&&data[k*4+3]){labels[k]=id;queue[tail++]=k;}}
  }
  if(tail>bestSize){bestSize=tail;best=id;}
 }
 for(let n=0;n<w*h;n++)if(labels[n]!==best)data[n*4+3]=0;
 ctx.putImageData(pixels,0,0);return canvas;
}

export async function loadAssets(){
 const files={vercelSprites:'vercel-sprites-keyed.png',vercel:'vercel-soma.png',travelPlane:'travel-plane-v2-keyed.png',chinaMap:'china-route-map-v2.png',chinaCity:'china-city-atlas.png',chinaBosses:'china-bosses-keyed.png',curtainCall:'curtain-call.png',supportTools:'support-tools-keyed.png',anthropicUpgrade:'anthropic-upgrade-keyed.png',updateExtras:'gameplay-update-keyed.png',xDetailed:'x-detailed-atlas.png',amazonDetailed:'amazon-detailed-keyed.png',msDetailed:'microsoft-detailed-atlas.png',brandsDetailed:'brand-enemies-keyed.png',texas:'spacex-starbase-texas.png',googleCampus:'googleplex-campus.png',seattleMap:'seattle-route-map.png',defeated:'defeated-bosses.png',stories:'stage-stories-atlas.png',north:'seattle-redmond-atlas.png',northBosses:'seattle-bosses.png',metaCampus:'meta-menlo-park-sunset.png',howard:'howard-street-day.png',anthropicStar:'anthropic-star.png',anthropicCrab:'anthropic-crab.png',anthropicVariants:'anthropic-variants.png',laptopAtlas:'player-laptop-atlas.png',defenseAtlas:'player-defense-atlas.png',mission:'mission-bay.png',enemyAtlas:'enemy-atlas.png',bossAtlas:'boss-atlas.png',map:'san-francisco-map.png',comic:'stage1-comic-atlas.png',Nano:'cyberpunk_hooded_character_sprite_sheet.png',Pili:'cyberpunk_pixel_sprite_sheet.png',bullets:'ai_projectile_pixel_sprite_sheet.png',select:'neon_cyberpunk_character_select.png',company:'neon_ai_company_selection_menu.png',rivals:'neon_rivals_token_riot_arena.png',title:'neon_token_riot_arena_initializing.png'};
 await Promise.all(Object.entries(files).map(async([key,file])=>{art[key]=await imageFile(file);}));
 const vr=Math.round(art.vercelSprites.height*.485);sprites.vercel=Array.from({length:8},(_,i)=>{const x=Math.floor(i%4*art.vercelSprites.width/4),right=Math.floor((i%4+1)*art.vercelSprites.width/4),y=i<4?0:vr,h=i<4?vr:art.vercelSprites.height-vr;return trimAlpha(isolateCharacter(keyedCrop(art.vercelSprites,[x,y,right-x,h],true)));});
 sprites.travelPlane=atlasCells(art.travelPlane,3,1,true);
 art.chinaScenes=Array.from({length:3},(_,i)=>rawCrop(art.chinaCity,[0,Math.floor(i*art.chinaCity.height/3),art.chinaCity.width,Math.floor(art.chinaCity.height/3)]));
 art.amazon=rawCrop(art.north,[0,0,art.north.width,Math.floor(art.north.height/2)]);art.redmond=rawCrop(art.north,[0,Math.floor(art.north.height/2),art.north.width,Math.floor(art.north.height/2)]);
 const logo=document.createElement('canvas');logo.width=640;logo.height=280;const lc=logo.getContext('2d',{willReadFrequently:true});lc.drawImage(art.title,530,320,640,280,0,0,640,280);const lp=lc.getImageData(0,0,640,280);for(let n=0;n<lp.data.length;n+=4){const brightness=Math.max(lp.data[n],lp.data[n+1],lp.data[n+2]);lp.data[n+3]=Math.max(0,Math.min(255,(brightness-125)*3));}lc.putImageData(lp,0,0);art.logo=logo;
 for(const name of ['Nano','Pili']){sprites[name]={};for(const [pose,boxes] of Object.entries(frames[name]))sprites[name][pose]=boxes.map(box=>isolateCharacter(cut(art[name],box)));}
 // Generated pose atlas preserves the original identities; measured row split avoids clipping boots.
 for(const [row,name] of ['Nano','Pili'].entries()){
  const top=row===0?0:372,bottom=row===0?372:art.defenseAtlas.height;
  const cells=Array.from({length:6},(_,col)=>{const x=Math.floor(col*art.defenseAtlas.width/6),right=Math.floor((col+1)*art.defenseAtlas.width/6);return trimAlpha(isolateCharacter(rawCrop(art.defenseAtlas,[x,top,right-x,bottom-top])));});
  sprites[name].guard=cells.slice(0,2);sprites[name].crouchWalk=cells.slice(2);
 }
 for(const [row,name] of ['Nano','Pili'].entries()){
  const top=Math.floor(row*art.laptopAtlas.height/2),bottom=Math.floor((row+1)*art.laptopAtlas.height/2);
  const cells=Array.from({length:4},(_,col)=>{const x=Math.floor(col*art.laptopAtlas.width/4),right=Math.floor((col+1)*art.laptopAtlas.width/4);return trimAlpha(isolateCharacter(rawCrop(art.laptopAtlas,[x,top,right-x,bottom-top])));});
  sprites[name].laptopOpening=cells.slice(0,2);sprites[name].laptop=cells.slice(2);
 }
 // Compose the foot shuffle before applying glow, preserving the exact original crouch body/head.
 for(const name of ['Nano','Pili']){
  const source=sprites[name].crouch[0],split=Math.floor(source.height*.76),half=Math.floor(source.width/2);
  sprites[name].crouchWalk=[0,3,0,-3].map(stride=>{const out=document.createElement('canvas');out.width=source.width;out.height=source.height;const ctx=out.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.drawImage(source,0,0,source.width,split,0,0,source.width,split);ctx.drawImage(source,0,split,half,source.height-split,0,split-Math.max(0,stride)*.6,half,source.height-split);ctx.drawImage(source,half,split,source.width-half,source.height-split,half,split-Math.max(0,-stride)*.6,source.width-half,source.height-split);return out;});
 }
 sprites.supportTools=atlasCells(art.supportTools,3,2,true);
 sprites.anthropicUpgrade=atlasCells(art.anthropicUpgrade,4,3,true);sprites.updateExtras=atlasCells(art.updateExtras,3,2,true);sprites.updateExtras[4]=trimAlpha(keyedCrop(art.updateExtras,[490,550,560,410]));
 sprites.xDetailed=atlasCells(art.xDetailed,4,2);sprites.xDetailed[6]=trimAlpha(isolateCharacter(rawCrop(art.xDetailed,[Math.floor(art.xDetailed.width*.442),Math.floor(art.xDetailed.height*.5),Math.floor(art.xDetailed.width*.316),Math.floor(art.xDetailed.height*.5)])));sprites.xDetailed[7]=trimAlpha(isolateCharacter(rawCrop(art.xDetailed,[Math.floor(art.xDetailed.width*.748),Math.floor(art.xDetailed.height*.5),Math.floor(art.xDetailed.width*.252),Math.floor(art.xDetailed.height*.5)])));sprites.amazonDetailed=[[90,115,325,445],[580,35,365,548],[1080,90,400,490],[15,575,410,425],[378,666,610,310],[989,640,547,275]].map((box,i)=>{const crop=keyedCrop(art.amazonDetailed,box,true);return trimAlpha(i===3||i===4?isolateCharacter(crop):crop);});sprites.msDetailed=atlasCells(art.msDetailed,4,2);sprites.brandsDetailed=atlasCells(art.brandsDetailed,3,2,true);
 sprites.bullets=Array.from({length:15},(_,i)=>cut(art.bullets,[i%5*290,Math.floor(i/5)*300+125,290,205]));
 const rowBounds=[0,340,645,935,art.enemyAtlas.height];sprites.pets=Array.from({length:16},(_,i)=>{const col=i%4,row=Math.floor(i/4),w=art.enemyAtlas.width/4;return trimAlpha(rawCrop(art.enemyAtlas,[Math.floor(col*w),rowBounds[row],Math.ceil(w),rowBounds[row+1]-rowBounds[row]]));});
 sprites.anthropic=[trimAlpha(cut(art.anthropicCrab,[0,0,art.anthropicCrab.width,art.anthropicCrab.height])),...Array.from({length:9},(_,i)=>trimAlpha(cut(art.anthropicVariants,[Math.floor(i%3*art.anthropicVariants.width/3),Math.floor(Math.floor(i/3)*art.anthropicVariants.height/3),Math.floor(art.anthropicVariants.width/3),Math.floor(art.anthropicVariants.height/3)])))];
 const star=rawCrop(art.anthropicStar,[0,0,art.anthropicStar.width,art.anthropicStar.height]),sc=star.getContext('2d'),sp=sc.getImageData(0,0,star.width,star.height);for(let i=0;i<sp.data.length;i+=4)if(Math.max(sp.data[i],sp.data[i+1],sp.data[i+2])<60)sp.data[i+3]=0;sc.putImageData(sp,0,0);sprites.anthropic.push(trimAlpha(star));
 sprites.chinaDefeated=CHINA_BOSS_CROPS.defeated.map(chinaBossFrame);
 const bossBoxes=[[0,60,414,720],[413,60,381,720],[792,60,374,720],[1165,60,375,720],[1540,60,443,720]];sprites.bosses=bossBoxes.map(box=>trimAlpha(isolateCharacter(rawCrop(art.bossAtlas,box))));for(let i=0;i<2;i++)sprites.bosses.push(trimAlpha(rawCrop(art.northBosses,[Math.floor(i*art.northBosses.width/2),0,Math.floor(art.northBosses.width/2),art.northBosses.height])));sprites.bosses.push(...CHINA_BOSS_CROPS.combat.map(chinaBossFrame));
}
export function drawCharacter(c,name,x,y,height,pose='idle',time=0,direction=1,glow='#45eaff',variant=0){
 const list=sprites[name][pose],base=list[Math.floor(time*(pose==='run'?12:8))%list.length],frame=variant?alternateFrame(base,name):base,w=frame.width/frame.height*height;
 c.save();c.translate(Math.round(x),Math.round(y));c.scale(direction,1);c.imageSmoothingEnabled=false;c.shadowColor=glow;c.shadowBlur=14;c.drawImage(frame,-w/2,-height,w,height);c.restore();
}
export function drawBullet(c,index,x,y,width,direction=1){const frame=sprites.bullets[index%10];c.save();c.translate(x,y);c.scale(direction,1);c.imageSmoothingEnabled=false;c.drawImage(frame,-width/2,-width*.35,width,width*.707);c.restore();}

function rawCrop(source,box){const out=document.createElement('canvas');out.width=box[2];out.height=box[3];out.getContext('2d').drawImage(source,...box,0,0,out.width,out.height);return out;}
function trimAlpha(source){
 const ctx=source.getContext('2d',{willReadFrequently:true}),data=ctx.getImageData(0,0,source.width,source.height).data;let minX=source.width,minY=source.height,maxX=0,maxY=0;
 for(let y=0;y<source.height;y++)for(let x=0;x<source.width;x++)if(data[(y*source.width+x)*4+3]>30){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);}
 return minX<=maxX&&minY<=maxY?rawCrop(source,[minX,minY,maxX-minX+1,maxY-minY+1]):source;
}
export function drawPet(c,index,x,y,height=100,hit=false,direction=1){const f=sprites.pets[index%16],w=f.width/f.height*height;c.save();c.translate(x,y);c.scale(direction,1);if(hit)c.filter='brightness(2.5)';c.drawImage(f,-w/2,-height,w,height);c.restore();}
export function drawBoss(c,index,x,y,height=280,direction=1,hit=false,defeated=false){const f=index===12?sprites.vercel[defeated?1:0]:defeated&&index>=7?sprites.chinaDefeated[(index-7)%5]:sprites.bosses[index%sprites.bosses.length],w=f.width/f.height*height;c.save();c.translate(x,y);c.scale(direction,1);if(hit)c.filter='brightness(2.4)';c.drawImage(f,-w/2,-height,w,height);c.restore();}

export function drawAnthropicEnemy(c,index,x,y,height=102,hit=false,direction=1,flying=false){drawDetailed(c,sprites.anthropicUpgrade[flying?10:index%10],x,y,height,112,hit,direction);}

export function drawMetaEnemy(c,index,x,y,height=88,hit=false){drawDetailed(c,sprites.brandsDetailed[3+index%3],x,y,height,105,hit);}

const alternateFrames=new WeakMap();
function alternateFrame(source,name){if(alternateFrames.has(source))return alternateFrames.get(source);const out=rawCrop(source,[0,0,source.width,source.height]),c=out.getContext('2d'),p=c.getImageData(0,0,out.width,out.height);for(let i=0;i<p.data.length;i+=4){const r=p.data[i],g=p.data[i+1],b=p.data[i+2];if(name==='Nano'&&Math.max(r,g,b)<115){p.data[i]=Math.round(r*.45);p.data[i+1]=Math.min(255,g+26);p.data[i+2]=Math.min(255,b+95);}else if(name==='Pili'&&r>g*1.35&&b>g*1.15&&r>100){p.data[i]=Math.round(r*.25);p.data[i+1]=Math.min(255,r*.85);p.data[i+2]=Math.min(255,r*.78);}}if(name==='Pili'){for(let y=Math.floor(out.height*.32);y<out.height*.65;y++)for(let x=0;x<out.width;x++){if(x>out.width*.28&&x<out.width*.72)continue;const i=(y*out.width+x)*4,r=p.data[i],g=p.data[i+1],b=p.data[i+2];if(p.data[i+3]&&r>g*1.12&&g>b*1.08&&r>125){p.data[i]=Math.round(r*.25);p.data[i+1]=Math.round(r*.8);p.data[i+2]=Math.round(r*.72);}}}c.putImageData(p,0,0);alternateFrames.set(source,out);return out;}

export function drawGoogleEnemy(c,index,x,y,height=88,hit=false){drawDetailed(c,sprites.brandsDetailed[index%3],x,y,height,105,hit);}
export function drawGBike(c,x,y,time,direction=-1){
 c.save();c.translate(Math.round(x),Math.round(y));c.scale(direction,1);c.lineWidth=5;c.strokeStyle='#173047';
 for(const wheel of [-37,37]){c.fillStyle='#142339';c.beginPath();c.arc(wheel,-17,20,0,Math.PI*2);c.fill();c.strokeStyle='#c9e9ef';c.lineWidth=3;c.stroke();c.strokeStyle='#647e8e';c.lineWidth=2;for(let i=0;i<4;i++){const a=time*24+i*Math.PI/2;c.beginPath();c.moveTo(wheel,-17);c.lineTo(wheel+Math.cos(a)*17,-17+Math.sin(a)*17);c.stroke();}}
 const line=(ax,ay,bx,by,color)=>{c.strokeStyle=color;c.lineWidth=5;c.beginPath();c.moveTo(ax,ay);c.lineTo(bx,by);c.stroke();};
 line(-37,-17,-14,-49,'#ea4335');line(-14,-49,8,-17,'#fbbc05');line(8,-17,-37,-17,'#34a853');line(-14,-49,28,-49,'#4285f4');line(28,-49,8,-17,'#4285f4');line(28,-49,37,-17,'#34a853');line(28,-49,28,-66,'#fbbc05');line(28,-66,42,-66,'#fbbc05');line(-14,-49,-17,-60,'#ea4335');line(-27,-60,-7,-60,'#172d3d');
 c.fillStyle='#fbbc05';c.fillRect(24,-60,18,12);c.strokeStyle='#8ad5ed77';c.lineWidth=2;for(let i=0;i<3;i++){c.beginPath();c.moveTo(-90-i*22,-24-i*12);c.lineTo(-59-i*22,-24-i*12);c.stroke();}c.restore();
}

export function drawMetaBoomerang(c,x,y,time){c.save();c.translate(x,y);c.rotate(Math.sin(time*6)*.09);drawDetailed(c,sprites.updateExtras[3],0,26,52,106);c.restore();}
export const ROCKET_NAMES=['FALCON 1','FALCON 9','FALCON HEAVY','SUPER HEAVY','STARSHIP','GROK BOT'];
export const MICROSOFT_ENEMIES=['CLIPPY','MERLIN','ROVER','PEEDY','AZURE','BALLMER','COPILOT','LINKS'];
function atlasCells(source,columns,rows,keyed=false){return Array.from({length:columns*rows},(_,i)=>{const x=Math.floor(i%columns*source.width/columns),y=Math.floor(Math.floor(i/columns)*source.height/rows),right=Math.floor((i%columns+1)*source.width/columns),bottom=Math.floor((Math.floor(i/columns)+1)*source.height/rows);return trimAlpha((keyed?keyedCrop:rawCrop)(source,[x,y,right-x,bottom-y]));});}
function drawDetailed(c,frame,x,y,height,maxWidth=Infinity,hit=false,direction=1){const scale=Math.min(height/frame.height,maxWidth/frame.width),w=Math.round(frame.width*scale),h=Math.round(frame.height*scale);c.save();c.translate(Math.round(x),Math.round(y));c.scale(direction,1);c.imageSmoothingEnabled=false;if(hit)c.filter='brightness(2.2)';c.drawImage(frame,-w/2,-h,w,h);c.restore();}
export function drawRocketEnemy(c,index,x,y,height=108,hit=false){drawDetailed(c,sprites.xDetailed[index%6],x,y,height,100,hit);}
export function drawFlyingRocket(c,x,y,time,direction=-1){drawDetailed(c,sprites.xDetailed[6],x,y+22,44,220,false,direction===-1?1:-1);}
export function drawTesla(c,x,y,time,direction=-1){drawDetailed(c,sprites.xDetailed[7],x,y,72,185,false,direction===-1?1:-1);}
export function drawAmazonEnemy(c,index,x,y,height=100,hit=false,direction=1){drawDetailed(c,(index%3===1?sprites.amazonDetailed[1]:sprites.updateExtras[index%3===0?0:1]),x,y,index%3===1?122:height,100,hit,direction);}
export function drawMicrosoftEnemy(c,index,x,y,height=108,hit=false,direction=1){drawDetailed(c,sprites.msDetailed[index%8],x,y,index%8===5?137:height,105,hit,index%8===4?1:direction);}
export function drawAmazonHazard(c,kind,x,y,time,direction=-1){const index=kind==='cart'?3:kind==='van'?4:5;drawDetailed(c,sprites.amazonDetailed[index],x,y+(kind==='plane'?25:0),kind==='cart'?78:kind==='van'?96:50,kind==='cart'?130:kind==='van'?210:260,false,direction===-1?1:-1);}

// Chroma-key extraction is part of sprite loading; source art remains untouched.
function keyedCrop(source,box,all=false){
 const out=rawCrop(source,box),c=out.getContext('2d',{willReadFrequently:true}),w=out.width,h=out.height,p=c.getImageData(0,0,w,h),d=p.data;
 const matches=n=>{const i=n*4;return d[i]>180&&d[i+2]>150&&d[i+1]<110&&d[i]-d[i+1]>80&&d[i+2]-d[i+1]>60;};
 if(all){for(let n=0;n<w*h;n++)if(matches(n))d[n*4+3]=0;}
 else{const seen=new Uint8Array(w*h),queue=new Int32Array(w*h);let head=0,tail=0;const offer=n=>{if(n<0||n>=w*h||seen[n])return;seen[n]=1;if(matches(n)){d[n*4+3]=0;queue[tail++]=n;}};for(let x=0;x<w;x++){offer(x);offer((h-1)*w+x);}for(let y=0;y<h;y++){offer(y*w);offer(y*w+w-1);}while(head<tail){const n=queue[head++];if(n%w)offer(n-1);if(n%w<w-1)offer(n+1);offer(n-w);offer(n+w);}}
 c.putImageData(p,0,0);return out;
}

export function drawDOSRunner(c,x,y,time,direction=-1){drawDetailed(c,sprites.updateExtras[Math.floor(time*9)%2?5:2],x,y,95,145,false,direction===-1?1:-1);}
export function drawHoverRoadster(c,x,y,time,direction=-1){const z=24+Math.sin(time*5)*5;drawDetailed(c,sprites.updateExtras[4],x,y-z,72,185,false,direction===-1?1:-1);}
export function drawEnemyProjectile(c,shot,camera,time){
 const kind=shot.kind||'code',x=shot.x-camera,y=shot.y;c.save();c.translate(Math.round(x),Math.round(y));c.rotate(Math.sin(time*9+shot.x*.01)*.16);c.imageSmoothingEnabled=false;
 const box=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
 const polygon=(points,color)=>{c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();};
 if(kind==='triangle'){polygon([[0,-18],[-19,15],[19,15]],'#e9fcff');box(-3,-2,6,5,'#4fd9ed');
 }else if(kind==='cookie'){box(-16,-11,32,7,'#613421');box(-17,-3,34,7,'#d1a15b');box(-16,5,32,7,'#613421');for(let i=0;i<4;i++)box(-12+i*7,-9,3,3,'#a36b4a');
 }else if(['web','play','like','photo','message','azure','copilot','grok','star'].includes(kind)){
  const frame=kind==='web'?sprites.brandsDetailed[0]:kind==='play'?sprites.brandsDetailed[2]:kind==='like'?sprites.brandsDetailed[3]:kind==='photo'?sprites.brandsDetailed[4]:kind==='message'?sprites.brandsDetailed[5]:kind==='azure'?sprites.msDetailed[4]:kind==='copilot'?sprites.msDetailed[6]:kind==='grok'?sprites.xDetailed[5]:sprites.anthropicUpgrade[10];drawDetailed(c,frame,0,16,32,38);
 }else if(kind==='missile'){drawDetailed(c,sprites.xDetailed[6],0,8,18,53,false,shot.vx<0?1:-1);
 }else if(kind==='parcel'){box(-16,-13,32,26,'#a86d37');polygon([[-16,-13],[0,-19],[16,-13],[0,-7]],'#dbab68');box(-2,-12,5,22,'#efd49f');box(-10,-1,9,6,'#eee2c5');
 }else if(['book','blueprint'].includes(kind)){box(-17,-12,34,25,kind==='book'?'#9b5340':'#3984b4');box(-13,-9,12,19,'#fff0c9');box(2,-9,12,19,'#fff0c9');box(-1,-10,2,22,'#604634');for(let n=0;n<3;n++){box(-10,-5+n*5,8,1,'#8e9caf');box(4,-5+n*5,7,1,'#8e9caf');}
 }else if(['code','error','window','server','developers','token'].includes(kind)){box(-19,-13,38,26,'#213750');box(-17,-11,34,5,kind==='error'?'#eb7765':'#63aaf2');c.fillStyle='#e7ffff';c.font='bold 13px monospace';c.textAlign='center';c.fillText(kind==='developers'?'DEV':kind==='token'?'AI':kind==='server'?'[::]':'</>',0,9);
 }else if(kind==='battery'){box(-14,-10,28,20,'#a4c639');box(14,-5,4,10,'#d2e2b4');box(-7,-3,12,6,'#37571e');box(-3,-7,4,14,'#37571e');
 }else if(['clip','plug','tool','weight','headphones','glasses','bone'].includes(kind)){c.strokeStyle=kind==='bone'?'#e7d7ac':'#aebcc9';c.lineWidth=5;c.beginPath();if(kind==='clip'){c.moveTo(-8,9);c.lineTo(-8,-9);c.quadraticCurveTo(12,-23,12,-3);c.lineTo(12,11);c.quadraticCurveTo(-7,23,-7,4);c.lineTo(-7,-4);c.stroke();}else if(kind==='weight'){box(-18,-12,8,24,'#6495c1');box(10,-12,8,24,'#6495c1');box(-10,-3,20,6,'#cdd5e1');}else if(kind==='bone'){box(-12,-4,24,8,'#e7d7ac');for(const dx of [-13,13]){box(dx-4,-9,8,18,'#e7d7ac');}}else{c.moveTo(-14,7);c.lineTo(-7,-8);c.lineTo(9,-8);c.lineTo(15,7);c.stroke();box(-17,-3,7,14,'#d2e2eb');box(11,-3,7,14,'#d2e2eb');}
 }else if(['leaf','plant','feather'].includes(kind)){polygon([[-16,8],[-8,-13],[16,-16],[12,8],[-3,14]],kind==='feather'?'#77d7ae':'#7dc75c');box(-2,-9,3,25,'#d0db91');
 }else if(kind==='flame'){polygon([[-14,11],[-14,-1],[-4,-18],[1,-6],[8,-14],[15,5],[7,15],[-5,16]],'#ff883b');polygon([[-7,10],[0,-5],[8,9],[3,16]],'#fff18a');
 }else if(kind==='drop'){polygon([[0,-18],[-12,3],[-10,12],[0,17],[10,12],[12,3]],'#6fdfff');box(-6,1,3,8,'#d9ffff');
 }else if(kind==='heart'){polygon([[0,-4],[-8,-13],[-17,-9],[-17,0],[0,17],[17,0],[17,-9],[8,-13]],'#e981ab');
 }else if(kind==='chip'){box(-13,-11,26,22,'#1b754e');box(-7,-6,14,12,'#133849');for(let n=0;n<4;n++){box(-17,-9+n*6,5,3,'#dacb80');box(12,-9+n*6,5,3,'#dacb80');}
 }else if(kind==='rock'){polygon([[-15,5],[-10,-10],[8,-14],[17,0],[10,13],[-6,15]],'#b4a48a');
 }else{c.fillStyle='#eac879';c.font='bold 27px monospace';c.textAlign='center';c.fillText(kind==='note'?'♪':kind==='glyph'?'✧':kind==='record'?'▣':'✦',0,10);}
 c.restore();
}

export function drawSupportDrone(c,x,y,time,firing=false){drawDetailed(c,sprites.supportTools[firing?1:0],x,y,70,140);c.save();c.strokeStyle='#99edff';c.globalAlpha=.6;c.lineWidth=2;for(const dx of [-37,37]){c.beginPath();c.ellipse(x+dx,y-48,22,2+Math.abs(Math.sin(time*45))*3,0,0,Math.PI*2);c.stroke();}c.restore();}
export function drawSupportHelper(c,h,camera,time){const punch=h.punch>0,index=h.variant==='uncle-bob'?(punch?5:4):(punch?3:2);c.save();if(!punch)c.translate(0,Math.sin(time*24)*3);drawDetailed(c,sprites.supportTools[index],h.x-camera,h.y,190,195);c.restore();}
export function drawChinaEnemy(c,stage,index,x,y,time,hit=false,direction=1,flying=false){
 const colors=['#ae8cff','#6ddfff','#e8a5ff','#91f5df'],color=colors[stage-7],logo=[4,5,8,0][stage-7];c.save();c.translate(Math.round(x),Math.round(y));c.scale(direction,1);if(hit)c.filter='brightness(2.5)';const bob=Math.sin(time*7+index)*3;c.translate(0,bob);c.fillStyle='#0b1a32';c.strokeStyle=color;c.lineWidth=3;
 if(stage===8){c.beginPath();c.ellipse(0,-50,48,28,0,0,7);c.fill();c.stroke();c.beginPath();c.moveTo(-42,-50);c.lineTo(-68,-78);c.lineTo(-63,-33);c.closePath();c.fill();c.stroke();c.fillStyle='#aafaff';c.fillRect(25,-61,7,7);}
 else{c.fillRect(-35,-88,70,68);c.strokeRect(-35,-88,70,68);c.fillStyle='#283a58';c.fillRect(-28,-80,56,43);c.fillStyle=color;c.fillRect(-30,-90,60,4);if(stage===9){c.beginPath();c.arc(0,-103,18,0,7);c.fill();c.fillStyle='#15233e';c.beginPath();c.arc(8,-109,16,0,7);c.fill();}else{c.fillRect(-34,-108,6,19);c.fillRect(28,-108,6,19);}}
 drawBullet(c,logo,0,-55,57,1);c.fillStyle='#233e56';for(const side of [-1,1]){c.fillRect(side<0?-49:35,-60,14,27);c.fillStyle=color;c.fillRect(side<0?-48:36,-35,12,8);c.fillStyle='#233e56';}
 if(flying){c.strokeStyle=color;c.beginPath();c.ellipse(0,-11,51,11,0,0,7);c.stroke();c.fillStyle='#a8ffff88';c.fillRect(-24,-10,12,9+Math.sin(time*12)*4);c.fillRect(12,-10,12,9+Math.cos(time*12)*4);}else{for(const side of [-1,1]){const foot=Math.sin(time*9+side)*4;c.fillStyle='#344b65';c.fillRect(side<0?-28:13,-20,16,17+foot);c.fillStyle=color;c.fillRect(side<0?-35:13,-6+foot,25,9);}}
 c.restore();
}

export function drawTravelPlane(c,pose,x,y,width){const f=sprites.travelPlane[pose],height=width*f.height/f.width;c.save();c.imageSmoothingEnabled=false;c.translate(Math.round(x),Math.round(y));c.scale(-1,1);c.drawImage(f,-width/2,-height/2,width,height);c.restore();}

export function drawVercelEnemy(c,index,x,y,height=104,hit=false,direction=1){drawDetailed(c,sprites.vercel[2+index%5],x,y,height,130,hit,direction);}
