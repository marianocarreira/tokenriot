// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
// Radial dead zone avoids drift; retain the full angle and variable speed.
export function joystickVector(x,y,radius,deadZone=.14){
 const distance=Math.hypot(x,y),travel=Math.min(1,distance/Math.max(1,radius));
 const magnitude=Math.max(0,(travel-deadZone)/(1-deadZone));
 return {x:distance?x/distance*magnitude:0,y:distance?y/distance*magnitude:0,
  thumbX:distance?x/distance*travel*radius:0,thumbY:distance?y/distance*travel*radius:0};
}

export function bindJoystick(element,{move,navigate,playing}){
 let pointer=null,menuDirection=null,repeat=null;
 const stopRepeat=()=>{clearInterval(repeat);repeat=null;menuDirection=null;};
 const reset=()=>{pointer=null;stopRepeat();move(0,0);element.style.setProperty('--stick-x','0px');element.style.setProperty('--stick-y','0px');element.classList.remove('engaged');};
 const update=e=>{
  const rect=element.getBoundingClientRect(),radius=rect.width*.29;
  const vector=joystickVector(e.clientX-rect.left-rect.width/2,e.clientY-rect.top-rect.height/2,radius);
  element.style.setProperty('--stick-x',vector.thumbX+'px');element.style.setProperty('--stick-y',vector.thumbY+'px');
  if(playing()){stopRepeat();move(vector.x,vector.y);return;}
  move(0,0);
  const direction=Math.hypot(vector.x,vector.y)<.35?null:Math.abs(vector.x)>Math.abs(vector.y)?(vector.x>0?'ArrowRight':'ArrowLeft'):(vector.y>0?'ArrowDown':'ArrowUp');
  if(direction===menuDirection)return;stopRepeat();menuDirection=direction;
  if(direction){navigate(direction);repeat=setInterval(()=>navigate(direction),210);}
 };
 element.addEventListener('pointerdown',e=>{if(pointer!==null)return;e.preventDefault();pointer=e.pointerId;element.setPointerCapture(pointer);element.classList.add('engaged');update(e);});
 element.addEventListener('pointermove',e=>{if(e.pointerId===pointer){e.preventDefault();update(e);}});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])element.addEventListener(event,e=>{if(e.pointerId===pointer)reset();});
 return reset;
}
