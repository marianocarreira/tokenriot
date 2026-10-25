# SPDX-FileCopyrightText: 2026 Mariano Carreira
# SPDX-License-Identifier: GPL-3.0-only
"""Seven original company-inspired synth/chiptune action loops; no sampled music."""
import math, random, wave, array, json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]/'assets'
SR=24000
THEMES=[
 ('openai',152,[40,40,43,38],[0,7,12,7,3,10,7,5,0,12,10,7,5,3,2,7],0,'Distorted synth rock / token factory'),
 ('anthropic',136,[38,41,36,37],[0,1,7,12,8,7,1,0,12,7,8,13,7,1,0,7],1,'Dark safety-lab arpeggios / asymmetric pulse'),
 ('google',144,[48,53,55,52],[0,4,7,12,14,12,7,4,2,7,9,14,12,9,7,4],2,'Bright search-campus electro funk'),
 ('meta',128,[42,45,49,47],[0,7,12,16,12,7,4,11,0,4,12,19,16,12,11,7],3,'Social-network dance synth / neon pulse'),
 ('x',164,[36,36,37,34],[0,0,7,0,12,10,7,6,0,7,13,12,6,7,3,1],4,'Industrial launch-pad rock / thruster bass'),
 ('amazon',140,[45,41,43,40],[0,7,3,7,10,7,12,7,0,3,5,7,10,12,7,3],5,'Mechanical logistics breakbeat / scanner chips'),
 ('microsoft',132,[43,46,41,48],[0,3,7,10,12,10,7,3,2,5,9,12,14,12,9,5],6,'Retro PC / DOS squarewave action anthem')]
def midi(n):return 440*2**((n-69)/12)
def synth(theme):
 name,bpm,roots,melody,mode,description=theme; beat=60/bpm; duration=beat*32; count=round(duration*SR); rng=random.Random(700+mode); out=array.array('h'); previous=0
 for n in range(count):
  t=n/SR; b=t/beat; step=int(b*4); q=b*4%1; eighth=b*2%1; root=roots[int(b//8)%4]; freq=midi(root); note=midi(root+24+melody[(step//(2 if mode in [1,3] else 1))%16]); env=min(1,q*45)*math.exp(-q*(2.5 if mode==3 else 5))
  sq=1 if t*note%1<(.25 if mode in [1,5] else .5) else -1
  lead=(sq*.048+math.sin(math.tau*note*t)*.025)*env
  if mode==2:lead=(math.sin(math.tau*note*t)+.3*math.sin(math.tau*note*2*t))*.074*env
  bassnote=freq*(2 if mode==5 and int(b*2)%4==3 else 1); bass=math.tanh(2*math.sin(math.tau*bassnote*t))*.14*math.exp(-eighth*1.4)
  grit=math.tanh(3*(math.sin(math.tau*freq*2*t)+.4*math.sin(math.tau*freq*3*t)))*(.10 if mode in [0,4] else .03)*math.exp(-eighth*4)
  noise=rng.uniform(-1,1); high=noise-previous;previous=noise
  kick_phase=b%(1 if mode==3 else 2);kick_t=kick_phase*beat; kick=math.sin(math.tau*(48*kick_t+1.6*(1-math.exp(-kick_t*40))))*.42*math.exp(-kick_t*27)
  snare_t=((b-1)%2)*beat;snare=(noise*.18+math.sin(math.tau*180*snare_t)*.07)*math.exp(-snare_t*35)
  hat=high*.028*math.exp(-q*8);pad=(math.sin(math.tau*freq*4*t)+math.sin(math.tau*freq*6*t))*.021
  tick=math.sin(math.tau*(1500 if mode==5 else 900)*t)*.035*math.exp(-q*20) if mode in [1,5,6] else 0
  sweep=math.sin(math.tau*(30*t+2*t*t))*noise*.035 if mode==4 else 0
  fade=min(1,t/.006,(duration-t)/.006); common=(bass+grit+kick+snare+hat+pad+tick+sweep)*fade
  left=math.tanh((common+lead*fade)*1.15)*.79;right=math.tanh((common+lead*.65*fade)*1.15)*.79
  out.extend([round(left*32767),round(right*32767)])
 path=ROOT/('theme-'+name+'.wav')
 with wave.open(str(path),'wb') as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR);f.writeframes(out.tobytes())
 print(path.name,round(duration,2),'seconds',flush=True)
 return {'company':name,'bpm':bpm,'seconds':duration,'style':description,'file':path.name}
(ROOT/'company-music.json').write_text(json.dumps([synth(x) for x in THEMES],indent=2))
