# SPDX-FileCopyrightText: 2026 Mariano Carreira
# SPDX-License-Identifier: GPL-3.0-only
"""Original energetic 16-bit beat-em-up adventure score, FM instruments and funk-rock rhythm.
No source-game recordings or melodies are used.
"""
import numpy as np,json
import generate_rock_audio as base
SR=base.SR
BPMS=[146,142,152,148,158,150,144]
HOOKS=[
 [0,7,10,12,7,5,3,7,0,3,5,10,7,5,3,2],
 [0,7,8,12,11,7,5,1,0,1,5,8,7,5,1,7],
 [0,4,7,12,14,12,9,7,4,7,9,16,14,12,7,4],
 [0,7,12,14,12,11,7,4,0,4,7,11,14,12,11,7],
 [0,7,10,12,13,12,7,6,0,3,7,10,7,6,3,1],
 [0,3,7,10,12,10,7,5,0,5,7,12,10,7,5,3],
 [0,3,7,10,12,14,12,10,2,5,9,12,10,9,7,5]]
def fm(note,duration,index=2,decay=5,ratio=2):
 t=np.arange(round(duration*SR))/SR;p=2*np.pi*base.midi(note)*t
 return base.envelope((np.sin(p+index*np.exp(-t*9)*np.sin(p*ratio))+.15*np.sin(p*2))*np.exp(-t*decay),.003,.025)
def compose(i,theme):
 name,_,roots=theme[:3];beat=60/BPMS[i];bars=16;bus=np.zeros((round(bars*4*beat*SR),2));hook=HOOKS[i]
 for bar in range(bars):
  root=roots[(bar//2)%4];section=bar//4
  # Tight syncopated FM/slap bass, rather than a gentle sustained pad.
  for k,at in enumerate([0,.5,.75,1.5,2,2.75,3.25,3.5]):
   interval=[0,0,12,7,0,10,7,12][(k+i)%8] if bar%2 else [0,0,7,0,0,12,7,10][k]
   bass=fm(root-12+interval,beat*.38,2.4,9,2);base.add(bus,bass,(bar*4+at)*beat,.23)
  # Bright singing FM lead with small call/response variations.
  for step in range(8):
   if bar%4==3 and step in [1,5]:continue
   n=root+24+hook[(step+bar%2*8)%16];lead=fm(n,beat*(.43 if step%4 else .7),1.7+i*.08,5,2)
   at=(bar*4+step*.5)*beat;pan=.22 if step%2 else -.22
   base.add(bus,lead,at,.108,pan);base.add(bus,lead,at+beat*.75,.022,-pan)
  # FM guitar/brass power-chord stabs: harmonic, gritty but not noisy distortion.
  for at in ([0,.75,2,2.75] if section%2==0 else [0,1.5,2.5,3.5]):
   chord=sum(fm(root+o,beat*.35,1.8,9,1) for o in [0,7,12]);chord=base.eq(chord,90,3800)
   base.add(bus,chord,(bar*4+at)*beat,.10,-.55);base.add(bus,chord,(bar*4+at)*beat+.008,.075,.55)
  for b in ([0,.75,2,2.5,3.5] if bar%2 else [0,1.5,2,2.75]):base.add(bus,base.KICK,(bar*4+b)*beat,.60)
  for b in [1,3]:
   at=(bar*4+b)*beat;base.add(bus,base.SNARE,at,.40);base.add(bus,base.SNARE,at+.055,.075,-.35)
  for h in range(8):base.add(bus,base.HAT,(bar*4+h*.5)*beat,.45 if h%2 else .6,.3)
  if bar%4==0:base.add(bus,base.CRASH,bar*4*beat,.32,-.3)
  if bar%4==3:
   for k,at in enumerate([3.25,3.5,3.75]):
    t=np.arange(round(.15*SR))/SR;freq=[140,115,92][k];tom=np.sin(2*np.pi*(freq*t+1.2*(1-np.exp(-t*18))))*np.exp(-t*22);base.add(bus,base.envelope(tom),(bar*4+at)*beat,.25,(-.4+k*.4))
  # Sparse arcade sparkle keeps 16-bit identity behind the main instruments.
  if section%2 and bar%2:
   sparkle=fm(root+43,beat*.17,1.1,20,3);base.add(bus,sparkle,(bar*4+3.75)*beat,.025,.6)
 peak=float(np.max(np.abs(bus)));bus*=min(1,.81/max(peak,1e-8));entry=base.save('adventure-'+name+'-v3.wav',bus,False)
 entry.update(company=name,bpm=BPMS[i],style='Energetic original 16-bit FM adventure / syncopated funk-rock');return entry


BPMS[0]=150
HOOKS[0]=[0,7,12,15,14,10,7,3,0,3,5,7,10,7,5,2]
manifest=[compose(0,('vercel','',[48,51,46,53]))]
(base.ROOT/'vercel-music-manifest.json').write_text(json.dumps(manifest,indent=2))
