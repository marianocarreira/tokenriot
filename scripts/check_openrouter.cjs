// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
const assert=require('node:assert/strict');
(async()=>{
 const base='http://127.0.0.1:4173';
 const config=await (await fetch(base+'/api/config')).json();assert.equal(config.endpoint,'https://openrouter.ai/api/v1');assert.equal(config.model,'google/gemma-4-31b-it:free');assert.equal(config.hasKey,true);assert.ok(!JSON.stringify(config).includes('sk-or-'));
 assert.equal((await fetch(base+'/.env.local')).status,403);
 const response=await fetch(base+'/api/llm',{method:'POST',headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(60000),body:JSON.stringify({session:'mission-v3-verification',config:{endpoint:config.endpoint,model:config.model,key:''},action:'generate',stage:0,character:'Nano'})});
 const result=await response.json();if(!response.ok)throw Error(result.error||'Model verification failed');assert.ok(result.id&&result.mission_name&&result.description&&result.ui_objects.length>=2&&result.payment>0&&!result.expected_responses);console.log('PASS: private key is not exposed; OpenRouter generated a valid game challenge through the local server.');
})().catch(error=>{console.error('Verification: '+error.message);process.exitCode=1;});
