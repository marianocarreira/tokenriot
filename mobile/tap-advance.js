// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
const screens=new Set(['intro','title','difficulty','selector','company','comic','map','defeat','continue','gameover','results','flight','credits','disclaimer','curtain']);
export function bindTapAdvance(surface,{state,blocked,advance}){
 let start=null;
 const ignore=target=>target.closest('button,a,input,textarea,select,[role="option"],[role="listbox"],#touch-controls,#combat-terminal,#settings-panel,#knowledge-panel');
 surface.addEventListener('pointerdown',e=>{
  if(e.isPrimary===false||e.button>0||blocked()||!screens.has(state())||ignore(e.target)){start=null;return;}
  start={id:e.pointerId,x:e.clientX,y:e.clientY,screen:state()};
 });
 surface.addEventListener('pointerup',e=>{
  const tap=start;start=null;
  if(!tap||tap.id!==e.pointerId||tap.screen!==state()||blocked()||ignore(e.target)||Math.hypot(e.clientX-tap.x,e.clientY-tap.y)>18)return;
  e.preventDefault();advance();
 });
 surface.addEventListener('pointercancel',()=>{start=null;});
}
