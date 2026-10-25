// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
(async()=>{const response=await fetch('https://openrouter.ai/api/v1/models');if(!response.ok)throw Error('HTTP '+response.status);const data=await response.json();console.log(JSON.stringify(data.data.filter(m=>Number(m.pricing?.prompt)===0&&Number(m.pricing?.completion)===0&&!/guard|embed|safety|moderation/i.test(m.id)).map(m=>({id:m.id,parameters:m.supported_parameters})),null,2));})().catch(e=>{console.error(e.message);process.exitCode=1;});
