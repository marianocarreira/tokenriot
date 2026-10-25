# SPDX-FileCopyrightText: 2026 Mariano Carreira
# SPDX-License-Identifier: GPL-3.0-only
"""Original 5-second electronic rock / chiptune sting. No samples or external audio."""
import math, random, wave, struct
from pathlib import Path
RATE=44100
SECONDS=5
BEAT=60/192
rng=random.Random(2086)
out=[]
notes=[82.4069,82.4069,123.4708,82.4069,97.9989,82.4069,110,116.5409,
       82.4069,82.4069,123.4708,146.8324,110,97.9989,82.4069,82.4069]
noise_prev=0.0
for n in range(RATE*SECONDS):
 t=n/RATE;beat=t/BEAT;step=int(beat*2);phase=(beat*2)%1;note=notes[step%len(notes)]
 # Palm-muted distorted power chords: root, fifth, octave, with slight detune and stereo spread.
 chord_env=math.exp(-phase*5)*(min(1,phase*22))
 def guitar(detune):
  root=note*2*detune
  v=(math.sin(math.tau*root*t)+.55*math.sin(math.tau*root*1.5*t)+.34*math.sin(math.tau*root*2.003*t))
  return math.tanh(v*3.8)*chord_env*.25
 left=guitar(.998);right=guitar(1.002)
 # Tight sub/bass with an 8-bit pulse edge.
 bass=(math.sin(math.tau*note*t)*.11+(1 if (t*note)%1<.28 else -1)*.035)*math.exp(-phase*2.5)
 ktime=t%(BEAT*2)
 if ktime<.20:
  kick=math.sin(math.tau*(45*ktime+90*.018*(1-math.exp(-ktime/.018))))*math.exp(-ktime*24)*.60
 else:kick=0
 noise=rng.uniform(-1,1);high=noise-noise_prev;noise_prev=noise
 snare_age=(t-BEAT)%(BEAT*2)
 snare=(noise*.27+math.sin(math.tau*185*snare_age)*.16)*math.exp(-snare_age*25) if snare_age<.18 else 0
 hat_age=t%(BEAT/2);hat=high*.09*math.exp(-hat_age*100)
 # Fast digital arpeggio, harmonically tied to the E-minor riff.
 arp=[659.255,783.991,987.767,1318.51][int(t/(BEAT/2))%4]
 arp_env=math.exp(-phase*4)*.043
 chip=(1 if (t*arp)%1<.22 else -1)*arp_env
 crash=noise*.065*math.exp(-((t-3)%5)*4) if t>=3 else 0
 # Energy burst aligned with the duo's cooperative pulse at 3.0 seconds.
 z=t-3
 zap=(math.sin(math.tau*(1500*z-950*z*z))*.12*math.exp(-z*7)) if 0<=z<.5 else 0
 # Final low power chord and descending digital tail.
 end=t-4.375
 finale=(math.tanh(2.8*(math.sin(math.tau*164.8138*t)+.6*math.sin(math.tau*247.2207*t)))*.15*math.exp(-end*4)) if end>=0 else 0
 env=min(1,t/.008,max(0,(5-t)/.12))
 common=bass+kick+snare+hat+crash+zap+finale
 out.append(((left+common+chip)*env,(right+common-chip*.6)*env))
peak=max(abs(v) for pair in out for v in pair)
scale=.88/peak
path=Path(__file__).resolve().parents[1]/'assets'/'token-riot-intro.wav'
with wave.open(str(path),'wb') as wav:
 wav.setnchannels(2);wav.setsampwidth(2);wav.setframerate(RATE)
 wav.writeframes(b''.join(struct.pack('<hh',*(round(v*scale*32767) for v in pair)) for pair in out))
print(f'Created original stereo soundtrack: {SECONDS}s, {RATE}Hz, {path.stat().st_size} bytes')
