// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
// Stable stage ids keep existing art and combat rules attached to their companies.
export const CAMPAIGN_ORDER=[0,1,11,2,3,4,5,6,7,8,9,10];
export const stageNumber=id=>CAMPAIGN_ORDER.indexOf(id)+1;
export const nextStage=id=>CAMPAIGN_ORDER[CAMPAIGN_ORDER.indexOf(id)+1]??null;
export const stageRegion=id=>id===11||id<5?'bay':id<7?'north':'china';
