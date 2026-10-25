# SPDX-FileCopyrightText: 2026 Mariano Carreira
# SPDX-License-Identifier: GPL-3.0-only
"""Original alternative-metal/electronic game score, physical plucked strings and synthesized drums.
No commercial recordings, melodies or artist vocals are used.
Requires numpy. Source ouch voice is rendered locally by Windows SAPI.
"""
from pathlib import Path
import numpy as np, wave, json
SR=32000
ROOT=Path(__file__).resolve().parents[1]/'assets'
rng=np.random.default_rng(9021)
def midi(n): return 440*2**((n-69)/12)
def envelope(a,attack=.003,release=.015):
 a=a.copy();n=len(a);k=min(int(SR*attack),n//2);r=min(int(SR*release),n//2)
 if k:a[:k]*=np.linspace(0,1,k)
 if r:a[-r:]*=np.linspace(1,0,r)
 return a
def save(name,a,normalize=True):
 if a.ndim==1:a=np.column_stack((a,a))
 peak=float(np.max(np.abs(a)))
 if normalize and peak:a=a*(.87/peak)
 a=np.clip(a,-.98,.98)
 with wave.open(str(ROOT/name),'wb') as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR);f.writeframes((a*32767).astype('<i2').tobytes())
 print(name,round(len(a)/SR,2),'seconds',flush=True)
 return {'file':name,'seconds':len(a)/SR,'peak':float(np.max(np.abs(a)))}
def eq(a,low=70,high=5700):
 spec=np.fft.rfft(a);hz=np.fft.rfftfreq(len(a),1/SR);curve=(hz/(hz+low))**2/(1+(hz/high)**4);return np.fft.irfft(spec*curve,n=len(a))
def pluck(freq,duration,seed,palm=False):
 n=int(duration*SR);period=max(8,int(SR/freq));r=np.random.default_rng(seed);a=np.zeros(n);a[:min(n,period)]=r.uniform(-1,1,min(n,period));damping=.977 if palm else .995
 for start in range(period,n,period):
  count=min(period,n-start);previous=a[start-period:start-period+period];smooth=(previous+np.roll(previous,1))*.5*damping;a[start:start+count]=smooth[:count]
 a*=np.exp(-np.arange(n)/SR*(12 if palm else 2.1));a=envelope(a,.002,.02);return a
def guitar(note,duration,seed,palm=False):
 a=sum(pluck(midi(note+offset),duration,seed+offset*13,palm)*gain for offset,gain in [(0,1),(7,.62),(12,.4)])
 return eq(np.tanh(a*7),95,4800)*.36
def drums():
 t=np.arange(int(SR*.55))/SR
 kick=np.sin(2*np.pi*(45*t+2.2*(1-np.exp(-t*55))))*np.exp(-t*19)+rng.normal(0,1,len(t))*.09*np.exp(-t*190)
 snare=eq(rng.normal(0,1,len(t)),900,9500)*np.exp(-t*18)*.55+np.sin(2*np.pi*185*t)*np.exp(-t*25)*.35
 hat=eq(rng.normal(0,1,int(SR*.12)),6000,14000)*np.exp(-np.arange(int(SR*.12))/SR*65)*.15
 t2=np.arange(int(SR*1.6))/SR;crash=eq(rng.normal(0,1,len(t2)),3500,13000)*np.exp(-t2*3)*.17
 return [envelope(v) for v in [kick,snare,hat,crash]]
KICK,SNARE,HAT,CRASH=drums()
def add(bus,signal,start,gain=1,pan=0,wrap=True):
 offset=int(round(start*SR));n=len(bus)
 weights=np.array([1-max(0,pan)*.65,1+min(0,pan)*.65])*gain
 for k in range(0,len(signal),max(1,n)):
  part=signal[k:k+n];index=(offset+k)%n
  first=min(len(part),n-index);bus[index:index+first]+=part[:first,None]*weights
  if first<len(part) and wrap:bus[:len(part)-first]+=part[first:,None]*weights
THEMES=[
 ('openai',148,[36,39,34,31],[0,0,-1,0,7,-1,0,0,3,-1,0,10,7,0,-1,0]),
 ('anthropic',140,[38,37,41,36],[0,-1,0,1,-1,0,7,0,1,-1,0,8,7,-1,1,0]),
 ('google',150,[40,43,45,38],[0,0,7,-1,3,0,-1,7,10,-1,7,3,0,-1,5,7]),
 ('meta',136,[42,38,45,40],[0,-1,7,0,12,-1,7,0,3,3,-1,7,10,-1,7,0]),
 ('x',160,[36,34,37,31],[0,0,0,-1,1,0,-1,0,7,-1,0,0,6,7,-1,0]),
 ('amazon',146,[38,41,36,34],[0,-1,0,7,0,3,-1,0,10,-1,7,0,3,0,-1,7]),
 ('microsoft',142,[43,39,41,38],[0,7,-1,0,3,-1,7,10,0,0,-1,3,7,5,-1,0])]
def rock(name,bpm,roots,riff,boss=False,story=False):
 bars=16 if not boss and not story else 8;beat=60/bpm;duration=bars*4*beat;bus=np.zeros((round(duration*SR),2));seed=1500+sum(map(ord,name));r=np.random.default_rng(seed)
 for bar in range(bars):
  section=bar//4;root=roots[(bar//2)%len(roots)];pattern=riff if bar%4!=3 else riff[4:]+riff[:4]
  for step,interval in enumerate(pattern):
   at=(bar*4+step/4)*beat
   if interval<0:continue
   palm=step%4!=0 or section%2==0;length=beat*(.24 if palm else .8)
   for channel in [-1,1]:add(bus,guitar(root+interval,length,seed+bar*97+step*5+(channel+1),palm),at+(0 if channel<0 else .006),.9 if not story else .38,channel*.9)
   tb=np.arange(int(length*SR))/SR;bass=np.sin(2*np.pi*midi(root+interval-12)*tb)*np.exp(-tb*(8 if palm else 3));add(bus,bass,at,.2)
   if section%2==1 and step%2==0:
    f=midi(root+24+[0,3,7,10,12,7,5,3][(step//2+bar)%8]);tt=np.arange(int(beat*.3*SR))/SR;chip=np.where((tt*f)%1<.25,1.,-1.)*np.exp(-tt*22);add(bus,chip,at,.018,(-1 if step%4 else 1)*.6)
  kicks=[0,.75,2,2.5,3.5] if boss else ([0,1.75,2.5] if section%2 else [0,.75,2,2.75])
  if story:kicks=[0,2.5]
  for b in kicks:add(bus,KICK,(bar*4+b)*beat,.72 if not story else .42)
  for b in [1,3]:
   at=(bar*4+b)*beat;add(bus,SNARE,at,.56 if not story else .28)
   for delay,gain,pan in [(.037,.12,-.65),(.081,.07,.65),(.13,.04,-.3)]:add(bus,SNARE,at+delay,gain,pan)
  for h in range(8 if not boss else 16):add(bus,HAT,(bar*4+h*(.5 if not boss else .25))*beat,.55 if h%2 else .8,(-.35 if h%2 else .35))
  if bar%4==0:add(bus,CRASH,bar*4*beat,.65,-.15)
  if bar%4==3:
   for f in [3.25,3.5,3.75]:add(bus,SNARE,(bar*4+f)*beat,.22+float(f-3)*.2, float(f-3)*.5)
  # Distant electronic chord, less bright than the guitars.
  tt=np.arange(round(4*beat*SR))/SR;pad=sum(np.sin(2*np.pi*midi(root+o)*tt) for o in [12,19,24])*np.sin(np.pi*np.arange(len(tt))/len(tt))**2;add(bus,pad,bar*4*beat,.014)
  if boss or story:
   tt=np.arange(int(SR*beat*2))/SR;pulse=np.sin(2*np.pi*(midi(root+12)*tt+tt*tt*1.5))*np.exp(-tt*1.5);add(bus,pulse,(bar*4+2)*beat,.06,.6)
 bus=np.tanh(bus*1.3)*.8
 return save('rock-'+name+'.wav',bus)
def comedy():
 beat=60/116;bus=np.zeros((round(16*beat*SR),2));melody=[67,71,74,76,74,71,69,66,67,64,60,59,60,64,67,55]
 for i,note in enumerate(melody):
  length=beat*(.28 if i%4<3 else .7);t=np.arange(round(length*SR))/SR;f=midi(note)*(1+.012*np.sin(2*np.pi*6*t));phase=np.cumsum(f)/SR
  kazoo=(np.sin(2*np.pi*phase)+.6*np.sin(2*np.pi*phase*2)+.25*np.sin(2*np.pi*phase*3))*np.exp(-t*7)
  add(bus,envelope(kazoo,.008,.04),i*beat,.13,(-.2 if i%2 else .2))
  root=48 if i//4%2==0 else 43;tt=np.arange(round(beat*.35*SR))/SR;oom=np.sin(2*np.pi*midi(root)*tt)*np.exp(-tt*11);add(bus,oom,i*beat,.3)
  if i%2:add(bus,HAT,i*beat,.35)
  if i%4==3:
   tt=np.arange(round(beat*.8*SR))/SR;fall=np.sin(2*np.pi*(440*tt-170*tt*tt))*np.exp(-tt*7);add(bus,fall,(i+.1)*beat,.09)
 return save('boss-defeat-comedy.wav',bus)
def effects():
 result=[]
 for name,freq,speed,duration in [('player-shot',1100,150,.13),('enemy-shot',630,110,.16),('blob-pop',220,45,.28),('guard-tick',900,600,.08)]:
  t=np.arange(round(duration*SR))/SR;phase=2*np.pi*(freq*t+(speed-freq)/(2*duration)*t*t);signal=(np.sin(phase)+.25*np.sin(phase*2))*np.exp(-t*(18 if name!='blob-pop' else 12))
  if name=='blob-pop':signal+=rng.normal(0,1,len(t))*.16*np.exp(-t*28)
  result.append(save('sfx-'+name+'.wav',envelope(signal),True))
 with wave.open(str(ROOT/'ouch-voice-source.wav'),'rb') as f:
  width=f.getsampwidth();channels=f.getnchannels();rate=f.getframerate();raw=f.readframes(f.getnframes());voice=np.frombuffer(raw,dtype='<i2').astype(float)/32768
  if channels>1:voice=voice.reshape(-1,channels).mean(1)
 active=np.flatnonzero(np.abs(voice)>.008)
 if len(active):voice=voice[max(0,active[0]-int(rate*.025)):min(len(voice),active[-1]+int(rate*.04))]
 for name,pitch in [('nano',.8),('pili',1.08)]:
  grid=np.arange(0,len(voice),rate/SR*pitch);v=np.interp(grid,np.arange(len(voice)),voice);result.append(save('sfx-ouch-'+name+'.wav',envelope(v,.004,.025)))
 return result
if __name__=='__main__':
 manifest=[rock(*theme) for theme in THEMES];manifest.append(rock('boss-pressure',168,[36,37,34,31],THEMES[4][3],True));manifest.append(rock('villain-tension',112,[36,37,31,34],THEMES[1][3],False,True));manifest.append(comedy());manifest+=effects();(ROOT/'rock-audio-manifest.json').write_text(json.dumps(manifest,indent=2))
