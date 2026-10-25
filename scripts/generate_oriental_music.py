# SPDX-FileCopyrightText: 2026 Mariano Carreira
# SPDX-License-Identifier: GPL-3.0-only
"""Original pentatonic action music: plucked zither, bowed lead, bamboo flute and arcade drums."""
import numpy as np,json
import generate_rock_audio as b
SR=b.SR

def instrument(note,duration,kind):
 t=np.arange(round(duration*SR))/SR;f=b.midi(note);p=2*np.pi*f*t
 if kind=='pluck':
  y=sum(np.sin(p*k+.002*k*np.sin(t*18))*np.exp(-t*(3+k*1.8))/k for k in range(1,9))
 elif kind=='bow':
  p+=.032*np.sin(2*np.pi*5.8*t);y=sum(np.sin(p*k)/k**1.6 for k in range(1,7))*(1-np.exp(-t*22))
 else:y=(np.sin(p+.025*np.sin(t*33))+.18*np.sin(2*p)+.06*np.sin(3*p))*(1-np.exp(-t*35))
 return b.envelope(y,.008,.07)

def compose(name,root,bpm,pattern,boss=False,story=False):
 beat=60/bpm;bus=np.zeros((round(64*beat*SR),2));scale=[0,2,4,7,9]
 for bar in range(16):
  # Shared pentatonic pitch collection; contrasting melodic contours per location.
  anchor=root+([0,7,9,4][bar//4] if not story else [0,4,7,0][bar//4])
  for j in range(8):
   degree=pattern[(j+bar%4*2)%len(pattern)];note=anchor+12+scale[degree%5]+12*(degree//5)
   at=(bar*4+j*.5)*beat
   b.add(bus,instrument(note,beat*.9,'pluck'),at,.14,(-1 if j%2 else 1)*.4)
   b.add(bus,instrument(note,beat*.9,'pluck'),at+beat*.75,.026,(-1 if j%2 else 1)*-.4)
  for j in [0,2]:
   degree=pattern[(bar+j)%len(pattern)];note=anchor+24+scale[degree%5]
   b.add(bus,instrument(note,beat*1.7,'bow' if boss or bar%4<2 else 'flute'),(bar*4+j)*beat,.115,-.12)
  for j in [0,1.5,2,3.5]:
   t=np.arange(round(beat*.4*SR))/SR
   bass=np.sin(2*np.pi*b.midi(anchor-12)*t)*np.exp(-t*12)
   b.add(bus,bass,(bar*4+j)*beat,.3)
  for j in ([0,2] if story else [0,.75,2,2.75]):b.add(bus,b.KICK,(bar*4+j)*beat,.42 if story else .64)
  for j in [1,3]:b.add(bus,b.SNARE,(bar*4+j)*beat,.18 if story else .32)
  for j in range(8):b.add(bus,b.HAT,(bar*4+j*.5)*beat,.25 if story else .4,.25)
  if boss and bar%2==1:
   for j in [3,3.5,3.75]:b.add(bus,b.KICK,(bar*4+j)*beat,.4)
 # Circular reverb preserves tails across the loop boundary.
 bus+=np.roll(bus,round(beat*.75*SR),axis=0)*.1
 bus*=.8/max(np.max(np.abs(bus)),1e-8)
 entry=b.save('oriental-'+name+'.wav',bus,False)
 entry.update(bpm=bpm,scale='major pentatonic',instruments='zither plucks, bowed strings, bamboo-style flute, electronic bass, arcade drums',original=True)
 return entry
if __name__=='__main__':
 manifest=[compose('qwen',50,144,[0,2,4,5,4,2,1,3]),compose('deepseek',45,140,[0,3,1,4,5,3,2,0]),compose('kimi',52,148,[4,2,0,1,3,5,4,2]),compose('finale',47,152,[0,4,3,5,2,4,1,0],True),compose('story',50,112,[0,1,3,4,2,1,0,3],story=True),compose('boss',45,156,[0,3,4,5,4,3,1,0],boss=True)]
 (b.ROOT/'oriental-music-manifest.json').write_text(json.dumps(manifest,indent=2))
 print('Generated six distinct original oriental action loops.')
