# SPDX-FileCopyrightText: 2026 Mariano Carreira
# SPDX-License-Identifier: GPL-3.0-only
"""Quieter melodic electronic action loops, preserving seven independent company identities."""
import numpy as np, json
import generate_rock_audio as base
SR=base.SR
BPMS=[122,118,128,124,132,126,120]
NAMES=['openai','anthropic','google','meta','x','amazon','microsoft']
MELODIES=[
 [0,7,10,7,3,5,7,12,10,7,5,3,2,5,7,3],
 [0,1,7,8,7,1,0,5,8,7,5,1,0,7,8,5],
 [0,4,7,12,9,7,4,2,4,7,11,9,7,4,2,7],
 [0,7,12,11,7,4,2,4,0,4,7,14,12,11,7,4],
 [0,7,3,5,7,10,7,3,0,2,3,7,5,3,2,7],
 [0,3,7,10,7,5,3,7,0,5,7,12,10,7,5,3],
 [0,3,7,10,12,10,7,5,2,5,9,12,10,9,7,3]]
def triangle(phase):return 2/np.pi*np.arcsin(np.sin(2*np.pi*phase))
def compose(index,theme):
 name,_,roots,_,=theme[:4];bpm=BPMS[index];beat=60/bpm;bars=16;bus=np.zeros((round(bars*4*beat*SR),2));melody=MELODIES[index]
 for bar in range(bars):
  root=roots[(bar//2)%4]+(12 if index==2 else 0);section=bar//4
  # Clean low-register pulse, no distorted guitar or broadband wash.
  for step in range(8):
   at=(bar*4+step*.5)*beat;length=beat*.42;t=np.arange(round(length*SR))/SR;f=base.midi(root-12);bass=(np.sin(2*np.pi*f*t)+triangle(f*t)*.25)*np.exp(-t*5)
   base.add(bus,base.envelope(bass,.006,.03),at,.16)
   if step%2==0 or section%2:
    n=root+19+melody[(step+bar*2)%16];f=base.midi(n);t=np.arange(round(beat*.43*SR))/SR;phase=f*t
    lead=(np.sin(2*np.pi*phase)+.22*np.sin(4*np.pi*phase)+.2*triangle(phase))*np.exp(-t*6)
    lead=base.envelope(lead,.012,.045);pan=(-.3 if step%2 else .3)
    base.add(bus,lead,at,.072,pan);base.add(bus,lead,at+beat*.75,.017,-pan)
  # A soft clean pluck is an accent, rather than the main rhythm instrument.
  if bar%2==0:
   clean=base.eq(base.pluck(base.midi(root+12),beat*1.6,3300+bar+index*9),80,2500)
   base.add(bus,clean,bar*4*beat,.075,-.55)
  t=np.arange(round(4*beat*SR))/SR;pad=sum(np.sin(2*np.pi*base.midi(root+o)*t) for o in [12,19,24]);pad*=np.sin(np.pi*np.arange(len(t))/len(t))**2
  base.add(bus,pad,bar*4*beat,.025,.35)
  for b in ([0,2,2.75] if index in [2,5] else [0,2]):base.add(bus,base.KICK,(bar*4+b)*beat,.40)
  for b in [1,3]:base.add(bus,base.SNARE,(bar*4+b)*beat,.22)
  for h in range(8):base.add(bus,base.HAT,(bar*4+h*.5)*beat,.28 if h%2 else .36,.3)
  if bar%8==0:base.add(bus,base.CRASH,bar*4*beat,.16,-.3)
  if section%2 and bar%2:
   t=np.arange(round(beat*.18*SR))/SR;f=base.midi(root+31);chip=triangle(f*t)*np.exp(-t*20);base.add(bus,base.envelope(chip), (bar*4+3.5)*beat,.022,.5)
 # Comfortable peak and a softer master, without re-amplifying the quieter arrangement.
 peak=np.max(np.abs(bus));bus*=min(1,.70/max(peak,1e-8))
 result=base.save('action-'+name+'-v2.wav',bus,False);result.update(company=name,bpm=bpm,style='Melodic electronic action, clean pluck, restrained 8-bit accents');return result
manifest=[compose(i,t) for i,t in enumerate(base.THEMES)]
(base.ROOT/'action-music-manifest.json').write_text(json.dumps(manifest,indent=2))
