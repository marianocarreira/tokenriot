// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import {secureHTML} from './build-security.mjs';
import {resolve,sep} from 'node:path';
import {build} from 'esbuild';
import {mkdir,readFile,writeFile,copyFile,rm} from 'node:fs/promises';
const out='mobile-dist';await mkdir(out,{recursive:true});
await build({entryPoints:['mobile/main.js'],bundle:true,format:'esm',target:'chrome120',outfile:out+'/mobile.js',minify:true,legalComments:'none',plugins:[{
 name:'mobile-navigation-prompts',setup(builder){
  builder.onLoad({filter:/(?:app|game-view|cinematics|world-finale|results-rewards)\.js$/},async({path})=>({contents:(await readFile(path,'utf8')).replaceAll('Press Enter','Tap screen').replaceAll('PRESS ANY KEY','TAP SCREEN').replaceAll(' · CTRL+P: Player 2 terminal',''),loader:'js'}));
 }
}]});
let html=await readFile('index.html','utf8');html=html.replace('<option value="2">2 Players</option>','').replace('width=device-width,initial-scale=1','width=device-width,initial-scale=1,viewport-fit=cover').replace('src="app.js"','src="mobile.js?v=campaign-checkpoints-1"').replace('</head>','<link rel="stylesheet" href="mobile.css?v=campaign-checkpoints-1"></head>');
await writeFile(out+'/index.html',html);await copyFile('style.css',out+'/style.css');await copyFile('mobile/mobile.css',out+'/mobile.css');
const sprites=await readFile('sprites.js','utf8'),app=await readFile('app.js','utf8');
const names=new Set([...sprites.matchAll(/['"]([^'"/]+\.png)['"]/g)].map(m=>m[1]));
for(const m of (app+html).matchAll(/['"](?:assets\/)?([^'"/]+\.wav)['"]/g))if(/^[a-z][a-z0-9-]+\.wav$/.test(m[1]))names.add(m[1]);
for(const name of ['openai','anthropic','google','meta','x','amazon','microsoft','vercel'])names.add('adventure-'+name+'-v3.wav');
for(const name of ['qwen','deepseek','kimi','finale'])names.add('oriental-'+name+'.wav');
const assetDir=resolve(out,'assets');if(!assetDir.startsWith(resolve('.')+sep)||assetDir!==resolve('mobile-dist/assets'))throw Error('Invalid build asset directory');
await rm(assetDir,{recursive:true,force:true});await mkdir(assetDir,{recursive:true});
for(const name of names)await copyFile('assets/'+name,assetDir+'/'+name);
await writeFile(out+'/asset-manifest.json',JSON.stringify([...names].sort(),null,2));
await secureHTML(out+'/index.html');
console.log(names.size+' runtime media assets included.');
console.log('Android web bundle built without server, credentials, tests or private saves.');
