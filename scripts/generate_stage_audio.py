# SPDX-FileCopyrightText: 2026 Mariano Carreira
# SPDX-License-Identifier: GPL-3.0-only
"""Original looping action/synth rock for selection, plus a dramatic Stage 1 cue."""
import math, random, wave, struct
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]/'assets'
SR=32000

def render(name,bpm,bars,stage=False):
 beat=60/bpm;duration=beat*4*bars;count=round(SR*duration);rng=random.Random(301 if stage else 102);data=[];prev=0
 roots=[82.4069,97.9989,110,73.4162] if not stage else [82.4069,82.4069,87.3071,73.4162]
 for n in range(count):
  t=n/SR;b=t/beat;step=int(b*2);p=b*2%1;root=roots[int(b/4)%4]
  env=min(1,p*35)*math.exp(-p*2.5)
  chord=(math.sin(math.tau*root*2*t)+.38*math.sin(math.tau*root*3*t))
  grit=math.tanh(chord*(2.6 if stage else 1.3))*env*(.17 if stage else .10)
  bass=math.sin(math.tau*root*t)*.13*math.exp(-p*1.7)
  arp=[root*4,root*6,root*8,root*5,root*6,root*8,root*3,root*6][step%8]
  chip=(1 if (t*arp)%1<.28 else -1)*.035*math.exp(-p*5)
  k=t%(beat*2);kick=math.sin(math.tau*(46*k+60*.02*(1-math.exp(-k/.02))))*math.exp(-k*27)*.40 if k<.22 else 0
  noise=rng.uniform(-1,1);high=noise-prev;prev=noise
  sn=(t-beat)%(beat*2);snare=(noise*.17+math.sin(math.tau*190*sn)*.08)*math.exp(-sn*29) if sn<.18 else 0
  hat=high*.035*math.exp(-(t%(beat/2))*110)
  pad=(math.sin(math.tau*root*4*t)+math.sin(math.tau*root*6.002*t))*.025
  hit=0
  if stage:
   hit=(math.sin(math.tau*48*t)*.34+noise*.10)*math.exp(-t*5)
   # A second stab marks the comic's fictional far-future twist.
   z=t-8.2
   if z>=0:hit+=math.sin(math.tau*(110*z+35*z*z))*.1*math.exp(-z*3)
  fade=min(1,t/.006,(duration-t)/.012)
  common=(grit+bass+kick+snare+hat+pad+hit)*fade
  data.append((common+chip*fade,common-chip*.65*fade))
 peak=max(abs(x) for pair in data for x in pair);scale=.78/max(1,peak/.85)
 with wave.open(str(ROOT/name),'wb') as w:
  w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR)
  w.writeframes(b''.join(struct.pack('<hh',*(round(v*scale*32767) for v in pair)) for pair in data))
 print(name,round(duration,3),'seconds')
render('token-riot-selection.wav',128,4)
render('token-riot-stage1.wav',160,8,True)
