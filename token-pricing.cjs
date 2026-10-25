// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
const fs=require('node:fs');
const REFERENCES=Object.freeze({OpenAI:'openai/gpt-4o-mini',Claude:'anthropic/claude-haiku-4.5',Gemini:'google/gemini-2.5-flash-lite',Llama:'meta-llama/llama-3.3-70b-instruct',Qwen:'qwen/qwen-2.5-7b-instruct',DeepSeek:'deepseek/deepseek-chat-v3-0324',Mistral:'mistralai/ministral-8b-2512',Grok:'x-ai/grok-4.3',Kimi:'moonshotai/kimi-k2',Gemma:'google/gemma-3-4b-it'});
const SOURCE='https://openrouter.ai/api/v1/models';
function createPricing(fetcher=fetch,{cacheFile,now=()=>new Date().toISOString()}={}){
 let cache={};if(cacheFile)try{cache=JSON.parse(fs.readFileSync(cacheFile,'utf8'));}catch(e){if(e.code!=='ENOENT')cache={};}
 let pending=null,refreshedAt=null;
 async function refresh(){if(pending)return pending;pending=(async()=>{const r=await fetcher(SOURCE,{signal:AbortSignal.timeout(7000)});if(!r.ok)throw Error('Price source unavailable');const body=await r.json();if(!Array.isArray(body.data))throw Error('Invalid price catalog');const at=now();refreshedAt=at;for(const [brand,id] of Object.entries(REFERENCES)){const model=body.data.find(m=>m.id===id),raw=model?.pricing?.completion,rate=typeof raw==='string'&&raw.trim()?Number(raw):typeof raw==='number'?raw:NaN;if(!Number.isFinite(rate)||rate<0)continue;cache[brand]={brand,modelId:id,modelName:String(model.name||id).slice(0,100),usdPerToken:rate,pricedAt:at,source:SOURCE,basis:'completion'};}if(cacheFile)fs.writeFileSync(cacheFile,JSON.stringify(cache,null,2));})();try{await pending;}finally{pending=null;}}
 return {async quote(brand){if(!Object.hasOwn(REFERENCES,brand))throw Error('Unsupported brand');let live=true;try{await refresh();}catch{live=false;}const q=cache[brand];if(!q||q.modelId!==REFERENCES[brand]||!Number.isFinite(q.usdPerToken)||q.usdPerToken<0||typeof q.modelName!=='string'||typeof q.pricedAt!=='string'||!Number.isFinite(Date.parse(q.pricedAt))||q.source!==SOURCE||q.basis!=='completion')throw Error('No verified price is available. Retry pricing when online.');return {...q,cached:!live||q.pricedAt!==refreshedAt};}};
}
function calculateEarnings(tokens,quote){if(!Number.isSafeInteger(tokens)||tokens<0||!Number.isFinite(quote.usdPerToken)||quote.usdPerToken<0)throw Error('Invalid valuation');return {...quote,tokens,usd:tokens*quote.usdPerToken};}
module.exports={REFERENCES,SOURCE,createPricing,calculateEarnings};
