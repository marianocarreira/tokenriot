// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const {CSP,HEADERS}=createRequire(import.meta.url)('../security-policy.cjs');
export async function secureHTML(file){let html=await readFile(file,'utf8');html=html.replace(/<meta name="referrer"[^>]*>/gi,'');html=html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/gi,'');html=html.replace(/(<meta charset="utf-8">)/i,'$1<meta http-equiv="Content-Security-Policy" content="'+CSP.replaceAll('"','&quot;')+'"><meta name="referrer" content="no-referrer">');await writeFile(file,html);}
export async function writeHeaders(file){await writeFile(file,'/*\n'+Object.entries(HEADERS).map(([k,v])=>'  '+k+': '+v).join('\n')+'\n');}
if(process.argv[1]?.endsWith('build-security.mjs')){await secureHTML('index.html');console.log('Game security policy applied.');}
