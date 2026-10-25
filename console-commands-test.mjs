// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import assert from 'node:assert/strict';
import {normalizeConsoleCommand as normalize} from './console-commands.js';
for(const [input,expected] of [['t','tools'],['sa','subagents'],['s','skills'],[' t   VaCuUm ','tool vacuum'],['s heal','skill heal'],['sa uncle','subagent uncle-bob'],['sa linus','subagent linus'],['uncle','subagent uncle-bob'],['linus','subagent linus'],['t uncle','subagent uncle-bob'],['tool linus','subagent linus'],['helper bob','subagent uncle-bob'],['subagent Uncle Bob','subagent uncle-bob'],['sub-agent Linus Torvalds','subagent linus'],['SALIR','exit'],['exit','exit'],['clear','clear'],['SAVE 2','save 2'],['guardar 3','save 3'],['list','list'],['partidas','list'],['cargar 4','resume 4'],['continuar 1','resume 1'],['model Claude Sonnet','model claude sonnet'],['sa nobody','subagent nobody'],['salir now','exit now']])assert.equal(normalize(input),expected,input);
console.log('PASS console list/action aliases, short helper names, case/whitespace and backward-compatible commands.');
