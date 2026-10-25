// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
// Expertise contributes score points; the coin wallet and price valuation stay monetary-neutral.
export const EXPERTISE_POINTS={easy:100,medium:250,hard:500};
export function expertiseScore(ids=[],players=1,tokens=0){const badges=[...new Set(ids)].filter(id=>{const m=/^([01])\|([0-9]|1[01]):(easy|medium|hard)$/.exec(id);return m&&Number(m[1])<players;});const badgeBonus=badges.reduce((sum,id)=>sum+EXPERTISE_POINTS[id.split(':')[1]],0);return{badgeCount:badges.length,badgeBonus,score:Math.max(0,Number(tokens)||0)+badgeBonus};}
