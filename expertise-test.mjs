// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import assert from 'node:assert/strict';
import {expertiseScore} from './expertise-score.js';
import {badgeMotion} from './badge-rewards.js';
assert.deepEqual(expertiseScore(['0|0:easy','0|0:easy','0|1:medium','0|11:hard','1|2:hard','bad','0|99:hard'],1,26),{badgeCount:3,badgeBonus:850,score:876});
assert.deepEqual(expertiseScore(['0|0:easy','1|2:hard'],2,26),{badgeCount:2,badgeBonus:600,score:626});
const start=badgeMotion(0,200,-100),large=badgeMotion(.45,200,-100),end=badgeMotion(1,200,-100);
assert.ok(start.scale<.1&&large.scale>1&&start.rotation!==large.rotation,'badge grows while rotating');
assert.ok(Math.abs(end.x-200)<.001&&Math.abs(end.y+100)<.001&&end.scale<.11,'badge shrinks into the HUD destination');
assert.deepEqual(expertiseScore([],1,-1),{badgeCount:0,badgeBonus:0,score:0});
console.log('PASS expertise scores, duplicate protection, solo/co-op badges and spinning flight path.');
