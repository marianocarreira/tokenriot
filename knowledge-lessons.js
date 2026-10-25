// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import {KNOWLEDGE_BANK,knowledgeSet} from './knowledge-bank.js';
// Original short study notes, with links to the manufacturer's own course or guide.
const LESSON_TEXT=[
 [
  [
   "Tools turn answers into actions",
   "OpenAI function calling connects a model with your application. The model requests a named function and supplies inputs; your code implements the actual operation. Start with a small read-only tool whose purpose is easy to describe.",
   "Sketch a delivery-status tool and its order ID input."
  ],
  [
   "Complete the tool loop",
   "A generated function call is a request, not a completed operation. Execute the permitted function and send its output back. The model can then answer using real information instead of inventing the result.",
   "Trace: question → tool request → your code → result → answer."
  ],
  [
   "Design a useful schema",
   "A tool schema names the arguments, describes their types and identifies required fields. Useful descriptions explain what each input means. Validate arguments in your application before using them.",
   "Define a required order_id and one invalid example."
  ]
 ],
 [
  [
   "Meet Claude client tools",
   "Claude can request a client tool when it needs a capability your application provides. The definition describes the operation; your code supplies the implementation. Keep each tool focused so its purpose and inputs are clear.",
   "Name one piece of live information your app could retrieve."
  ],
  [
   "Return the real result",
   "After a client tool request, your application runs the allowed operation and returns its result to Claude. Only then can the assistant use the retrieved information in its response. Handle errors explicitly rather than pretending the operation succeeded.",
   "Compare a requested lookup with a completed lookup."
  ],
  [
   "Describe tool inputs",
   "An input schema explains the expected arguments and their types. Clear descriptions help Claude construct a usable request. Your application still needs to validate the values and handle missing information.",
   "Describe a city parameter another developer could understand."
  ]
 ],
 [
  [
   "Gemini meets your functions",
   "Function calling connects Gemini to application functions and external APIs. The model selects a function and provides parameters; the integration performs the real operation. Use it when a request needs information beyond generated text.",
   "List the inputs of a weather lookup."
  ],
  [
   "Run the actual operation",
   "A custom function declaration describes a capability; it does not fetch weather by itself. Your code, or an SDK integration configured with that implementation, must execute the operation and return the result.",
   "Mark where the real weather service is called."
  ],
  [
   "Make parameters explicit",
   "A typed location parameter gives Gemini a clearer interface than a vague instruction to look something up. Describe required inputs and validate them before calling the service. Decide how the application handles incomplete requests.",
   "Specify what should happen when no city is supplied."
  ]
 ],
 [
  [
   "Give Llama a clear task",
   "A prompt communicates your task and useful context to Llama. Specific instructions make the intended behavior easier to understand. Fluent wording still needs checking against the task and reliable evidence.",
   "Rewrite “help with this” as a specific task."
  ],
  [
   "Teach with examples",
   "For classification, define the allowed labels and provide representative examples. Show how you distinguish similar cases rather than including only obvious ones. Then test on examples you did not use while writing the prompt.",
   "Write a support ticket and its intended category."
  ],
  [
   "Specify missing-data behavior",
   "When extracting information, define the output format and explain what should happen when a value is absent. An explicit unknown can be more useful than a plausible invented date.",
   "Create a document with no date and define the expected result."
  ]
 ],
 [
  [
   "Connect Grok to your app",
   "Function tools expose specific application operations to Grok. A tool definition describes its inputs and purpose. The model can request it, while your application remains responsible for execution and permissions.",
   "Choose a read-only tool for a shop assistant."
  ],
  [
   "Look up before answering",
   "An inventory tool call is a request, not proof that a product is available. Execute the lookup and return what the service actually reports. If the service fails, report that failure rather than inventing stock.",
   "Plan the response to an unavailable inventory service."
  ],
  [
   "Define the inventory interface",
   "A parameter schema documents inputs such as a product ID. Required fields and meaningful descriptions help the model produce a usable request. Validate those values before querying the inventory system.",
   "Give one valid product ID and one invalid request."
  ]
 ],
 [
  [
   "Bedrock knowledge bases",
   "Amazon Bedrock Knowledge Bases can retrieve relevant information from connected sources. This adds company information as context for generated responses. The quality and relevance of the source data matter to the final answer.",
   "Choose a document that could answer a customer question."
  ],
  [
   "Retrieve, then generate",
   "RAG retrieves useful source passages and adds them to the generation context. It does not retrain the model for every question. Check whether the retrieved material actually contains the evidence needed to answer.",
   "Separate retrieval from generation in a simple diagram."
  ],
  [
   "Keep source content current",
   "If a policy changes but the knowledge base still contains old content, retrieval may return outdated evidence. Update the source and synchronize its indexed content as appropriate. Verify that the revised information is retrievable.",
   "Write a test for yesterday’s policy update."
  ]
 ],
 [
  [
   "Ground answers with RAG",
   "RAG augments a model request with relevant retrieved information. In a Foundry application, this can help answer questions from company documents. Prepare the source data and consider the questions users will ask.",
   "Choose a question that needs a company manual."
  ],
  [
   "Retrieve relevant evidence",
   "A retrieval system should select passages that help answer the question. More text is not automatically better. Respect access permissions and inspect whether the returned context includes the necessary evidence.",
   "Identify the passage needed for a particular policy question."
  ],
  [
   "Refresh and evaluate",
   "Old indexed documents can lead to outdated answers. Refresh source content and evaluate both the retrieved passages and the generated response. Check that each claim is supported by the updated material.",
   "Design a regression case for a revised manual."
  ]
 ],
 [
  [
   "Qwen and tool calling",
   "Tool use connects Qwen requests with implemented functions. A definition explains the operation and its arguments. Your integration coordinates model output, actual execution and returned results.",
   "Design a small calendar lookup tool."
  ],
  [
   "Handle the call in your app",
   "Parse and validate tool calls before executing permitted functions. Return the actual result to the model. Generated arguments are model output, so do not treat them as unrestricted commands.",
   "Describe the handling of an invalid calendar date."
  ],
  [
   "Write clear tool definitions",
   "Tool names and parameter descriptions help Qwen call the intended function. Specify expected formats instead of relying on vague descriptions. Test both ordinary input and missing fields.",
   "Document a date format for your calendar lookup."
  ]
 ],
 [
  [
   "Authenticate DeepSeek requests",
   "An API key authenticates requests to DeepSeek. It is a credential, not an instruction and not a guarantee of answer accuracy. Keep credentials separate from user-visible prompt content.",
   "Identify the authentication part of an API request."
  ],
  [
   "Keep credentials on the server",
   "Private provider keys belong in trusted server-side infrastructure. A public browser bundle can be inspected by visitors. Let the browser call your backend and keep credentials out of public responses.",
   "Draw the browser → backend → provider request path."
  ],
  [
   "Configure the client correctly",
   "A client needs the provider endpoint, valid authentication and a supported model identifier. Consult DeepSeek’s API guide when adapting an existing client. Handle configuration and request failures explicitly in the application.",
   "List the three configuration values to verify first."
  ]
 ],
 [
  [
   "Make a Kimi API request",
   "A Kimi integration sends model requests and receives generated responses. Understand the provider endpoint, requested model and conversation messages. Verify that the output meets the needs of your application.",
   "Describe the input and expected result of a small request."
  ],
  [
   "Display streaming output",
   "Streaming lets an interface show content incrementally while generation continues. Handle partial content, completion and errors. Incremental output improves responsiveness, but does not establish factual correctness.",
   "Design an indicator for an unfinished response."
  ],
  [
   "Connect the right provider",
   "Configure the client with Kimi’s endpoint, valid credentials and a supported model. Consult the provider guide when adapting an existing integration. Configuration errors should produce useful application feedback.",
   "Plan a test for an incorrectly configured endpoint."
  ]
 ],
 [
  [
   "Fluency is not evidence",
   "An LLM can produce convincing text that contains mistakes. Check a factual claim against reliable evidence instead of judging its confidence or length. A grounded answer should make its supporting information easy to inspect.",
   "Name the evidence needed to check one factual claim."
  ],
  [
   "Find the relevant passage",
   "Retrieval selects source material for the generation step. A useful passage contains information relevant to the question. If the evidence is missing, generating a longer answer does not fix the problem.",
   "Match a question to the passage that answers it."
  ],
  [
   "Check the citation",
   "A citation should support the associated claim. Locate the relevant source passage and compare its meaning with the response. Evaluate retrieval quality as well as how faithfully the answer uses that evidence.",
   "Describe a citation that fails to support its claim."
  ]
 ],
 [
  [
   "Meet the Vercel AI SDK",
   "Vercel’s AI SDK provides tools for building AI features. The streamText function supports incremental text generation. Understand the provider setup and response flow before adding interface behavior.",
   "Sketch a small streaming assistant interface."
  ],
  [
   "Streaming is an interface choice",
   "Incremental responses let a user start reading while generation continues. Distinguish unfinished output from a completed response and handle failures. Streaming does not remove token costs or guarantee factual accuracy.",
   "Design feedback for a response that is still arriving."
  ],
  [
   "Protect provider keys",
   "Use private provider credentials in trusted server-side code. Browser bundles are inspectable, so they are not safe places for secrets. Keep your interface separate from the authenticated provider request.",
   "Mark the trust boundary between UI and model provider."
  ]
 ]
];
const RESOURCES=[
 [
  "OpenAI Academy",
  "https://academy.openai.com/public/clubs/work-users-ynjqu/resources/workspace-agents"
 ],
 [
  "Claude Academy",
  "https://academy.claude.com/collections/build-with-claude"
 ],
 [
  "Google Skills",
  "https://www.skills.google/focuses/85642?locale=en&parent=catalog"
 ],
 [
  "Meta Llama guides",
  "https://dev.meta.ai/llama/docs/how-to-guides/prompting"
 ],
 [
  "xAI developer guides",
  "https://docs.x.ai/developers/tools/function-calling"
 ],
 [
  "AWS Skill Builder",
  "https://skillbuilder.aws/learn/K5FK8EE82U/building-generative-ai-applications-using-amazon-bedrock-includes-labs/UX8DFX691K"
 ],
 [
  "Microsoft Learn",
  "https://learn.microsoft.com/en-us/training/modules/rag-fundamentals/"
 ],
 [
  "Qwen learning guides",
  "https://qwen.readthedocs.io/en/latest/framework/function_call.html"
 ],
 [
  "DeepSeek API guides",
  "https://api-docs.deepseek.com/"
 ],
 [
  "Kimi developer guides",
  "https://platform.kimi.ai/docs/overview"
 ],
 [
  "Microsoft Learn: RAG concepts",
  "https://learn.microsoft.com/en-us/training/modules/rag-fundamentals/"
 ],
 [
  "Vercel Academy",
  "https://vercel.com/academy/ai-sdk"
 ]
];
export function bookLesson(stage,index){
 const entry=KNOWLEDGE_BANK[stage],text=LESSON_TEXT[stage]?.[index];if(!entry||!text)throw Error('Unknown book lesson');
 return {id:stage+':'+index,stage,index,company:entry.name,title:text[0],body:text[1],exercise:text[2],resource:RESOURCES[stage][0],url:RESOURCES[stage][1],source:entry.source,question:entry.questions.filter(q=>q.level==='medium')[index]};
}

export function learningLesson(stage,level,index=0){const entry=KNOWLEDGE_BANK[stage],questions=knowledgeSet(stage,level),question=questions[((index%questions.length)+questions.length)%questions.length];const legacy=null;const text=question.lesson||{title:level==='hard'?'Advanced practice':'Applied practice',body:question.explanation,exercise:'Explain why the other answers are incorrect.'};return {id:question.id,stage,index,company:entry.badgeName,level,title:legacy?.title||text.title,body:legacy?.body||text.body,exercise:legacy?.exercise||text.exercise,resource:RESOURCES[stage][0],url:RESOURCES[stage][1],source:question.source||entry.source,question};}
