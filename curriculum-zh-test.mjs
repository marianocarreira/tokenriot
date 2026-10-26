// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import assert from 'node:assert/strict';
import {KNOWLEDGE_BANK} from './knowledge-bank.js';
import {PROVIDER_TOPICS,CURRICULUM_TRANSLATIONS,CURRICULUM_CHINESE} from './learning-curriculum.js';
import {CHINESE_TOPICS} from './learning-curriculum-zh.js';

assert.equal(CHINESE_TOPICS.length,PROVIDER_TOPICS.length);
assert.equal(CHINESE_TOPICS.length,12);
for(const [stage,topics] of CHINESE_TOPICS.entries()){
 assert.equal(topics.length,6,'Six provider-specific topics at stage '+stage);
 for(const topic of topics){
  assert.equal(topic.length,6);
  for(const field of topic)assert.ok(typeof field==='string'&&field.trim(),'Every Chinese topic field is supplied');
  for(const index of [1,2,3,4,5])assert.match(topic[index],/\p{Script=Han}/u,'Chinese sentence field '+index);
 }
}
assert.deepEqual(Object.keys(CURRICULUM_CHINESE).sort(),Object.keys(CURRICULUM_TRANSLATIONS).sort(),'Chinese covers every generated curriculum translation');
let count=0;
const technicalTitles=new Set(CHINESE_TOPICS.flat().map(topic=>topic[0]).filter(title=>!(/\p{Script=Han}/u.test(title))));
for(const group of KNOWLEDGE_BANK)for(const q of group.questions){
 count++;
 assert.ok(q.answer>=0&&q.answer<q.options.length);
 for(const source of [q.prompt,q.explanation,q.lesson.body,q.lesson.exercise,...q.options]){
  assert.ok(CURRICULUM_CHINESE[source],q.id+' missing translation: '+source);
  assert.ok(/\p{Script=Han}/u.test(CURRICULUM_CHINESE[source])||technicalTitles.has(CURRICULUM_CHINESE[source]),q.id+' untranslated text');
 }
 assert.ok(CURRICULUM_CHINESE[q.lesson.title],q.id+' missing lesson title');
}
assert.equal(count,216);
assert.match(CURRICULUM_CHINESE['OpenAI Hard'],/困难/);
assert.match(CURRICULUM_CHINESE['Return a tool_result linked to the matching tool_use ID.'],/tool_result.*tool_use|tool_use.*tool_result/);
assert.match(CURRICULUM_CHINESE['Validate the date and reject or clarify invalid arguments.'],/日期/);
console.log('PASS Chinese curriculum: all 72 topics, 216 questions, answer choices, explanations and lesson exercises; technical identifiers preserved.');
