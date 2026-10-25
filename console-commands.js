// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
// Text-command aliases only: these do not take over movement or combat keys.
export function normalizeConsoleCommand(value){
 const words=String(value).trim().toLowerCase().replace(/\s+/g,' ').split(' ');
 const prefixes={t:'tool',sa:'subagent',s:'skill',salir:'exit',guardar:'save',partidas:'list',cargar:'resume',continuar:'resume'};
 if(Object.hasOwn(prefixes,words[0]))words[0]=prefixes[words[0]];
 const names={'uncle':'uncle-bob','uncle-bob':'uncle-bob','unclebob':'uncle-bob','bob':'uncle-bob','linus':'linus','linus-torvalds':'linus','torvalds':'linus'};
 const first=words[0],name=words.slice(1).join('-');
 if(words.length===1&&Object.hasOwn(names,first))return 'subagent '+names[first];
 if(['tool','tools','subagent','subagents','sub-agent','sub-agents','helper'].includes(first)&&Object.hasOwn(names,name))return 'subagent '+names[name];
 if(words.length===1&&['tool','skill','subagent'].includes(first))return first+'s';
 return words.join(' ');
}
