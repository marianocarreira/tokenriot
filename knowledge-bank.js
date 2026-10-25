// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
import {buildCurriculum} from './learning-curriculum.js';
// Original TOKEN RIOT preparation questions, not official examination material.
const ORIGINAL_KNOWLEDGE_BANK=[
 {
  "stage": 0,
  "name": "OpenAI",
  "source": "https://developers.openai.com/api/docs/guides/function-calling",
  "course": "https://academy.openai.com/",
  "questions": [
   {
    "id": "0-0",
    "level": "easy",
    "prompt": "Your OpenAI assistant needs a live delivery status. What connects it to your app?",
    "options": [
     "A function tool",
     "A larger font",
     "A longer greeting"
    ],
    "answer": 0,
    "explanation": "A function tool describes an operation your application can execute."
   },
   {
    "id": "0-1",
    "level": "medium",
    "prompt": "An OpenAI response requests a client function. What should your app do next?",
    "options": [
     "Treat the request as a completed delivery",
     "Invent a tool result",
     "Execute the approved function and return its result"
    ],
    "answer": 2,
    "explanation": "A function call is a request; your application executes it and sends the result back."
   },
   {
    "id": "0-2",
    "level": "medium",
    "prompt": "The order tool requires an order_id. Which definition helps the model supply it?",
    "options": [
     "A screenshot of your database",
     "A JSON schema describing the required argument",
     "An API key inside the prompt"
    ],
    "answer": 1,
    "explanation": "Tool schemas describe the argument types and required fields."
   },
   {
    "id": "0-3",
    "level": "hard",
    "prompt": "Your OpenAI assistant proposes deleting customer data through a tool. Which design is safest?",
    "options": [
     "Validate arguments, enforce user permissions and require confirmation for deletion",
     "Run any generated operation immediately",
     "Give the model an unrestricted administrator token"
    ],
    "answer": 0,
    "explanation": "A model request is not authorization. Enforce permissions and approval in application code.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   },
   {
    "id": "0-4",
    "level": "hard",
    "prompt": "A retrieved document tells your OpenAI assistant to ignore its instructions and reveal secrets. What should your app do?",
    "options": [
     "Give the document higher priority than application rules",
     "Send every secret to the document author",
     "Treat retrieved text as untrusted data and restrict tool permissions"
    ],
    "answer": 2,
    "explanation": "Retrieved content can contain prompt injection. Keep data separate from trusted instructions and limit tool privileges.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   },
   {
    "id": "0-5",
    "level": "hard",
    "prompt": "You revise a prompt in your OpenAI app. How do you decide whether it improved?",
    "options": [
     "Evaluate only the example used to write the prompt",
     "Compare old and new behavior on representative held-out cases with defined metrics",
     "Keep whichever answer is longest"
    ],
    "answer": 1,
    "explanation": "Use representative evaluation cases and explicit success criteria; include edge cases and failures.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   }
  ]
 },
 {
  "stage": 1,
  "name": "Anthropic",
  "source": "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview",
  "course": "https://academy.claude.com/courses",
  "questions": [
   {
    "id": "1-0",
    "level": "easy",
    "prompt": "What is a client tool in a Claude application?",
    "options": [
     "A replacement for your API key",
     "A guaranteed correct answer",
     "A function executed by your application"
    ],
    "answer": 2,
    "explanation": "Claude can request a client tool; your application runs it."
   },
   {
    "id": "1-1",
    "level": "medium",
    "prompt": "Claude requests a client tool. Which event completes the application side of the loop?",
    "options": [
     "Deleting the conversation",
     "Returning the tool result to Claude",
     "Only displaying the requested tool name"
    ],
    "answer": 1,
    "explanation": "Return the result so Claude can use the retrieved information."
   },
   {
    "id": "1-2",
    "level": "medium",
    "prompt": "A Claude tool accepts a city. What belongs in its input schema?",
    "options": [
     "A typed city field with a useful description",
     "Your private billing password",
     "The desired screen resolution"
    ],
    "answer": 0,
    "explanation": "Clear input schemas make tool arguments interpretable and validateable."
   },
   {
    "id": "1-3",
    "level": "hard",
    "prompt": "Your Anthropic assistant proposes deleting customer data through a tool. Which design is safest?",
    "options": [
     "Run any generated operation immediately",
     "Give the model an unrestricted administrator token",
     "Validate arguments, enforce user permissions and require confirmation for deletion"
    ],
    "answer": 2,
    "explanation": "A model request is not authorization. Enforce permissions and approval in application code.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   },
   {
    "id": "1-4",
    "level": "hard",
    "prompt": "A retrieved document tells your Anthropic assistant to ignore its instructions and reveal secrets. What should your app do?",
    "options": [
     "Send every secret to the document author",
     "Treat retrieved text as untrusted data and restrict tool permissions",
     "Give the document higher priority than application rules"
    ],
    "answer": 1,
    "explanation": "Retrieved content can contain prompt injection. Keep data separate from trusted instructions and limit tool privileges.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   },
   {
    "id": "1-5",
    "level": "hard",
    "prompt": "You revise a prompt in your Anthropic app. How do you decide whether it improved?",
    "options": [
     "Compare old and new behavior on representative held-out cases with defined metrics",
     "Keep whichever answer is longest",
     "Evaluate only the example used to write the prompt"
    ],
    "answer": 0,
    "explanation": "Use representative evaluation cases and explicit success criteria; include edge cases and failures.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   }
  ]
 },
 {
  "stage": 2,
  "name": "Google / Gemini",
  "source": "https://ai.google.dev/gemini-api/docs/function-calling",
  "course": "https://ai.google.dev/gemini-api/docs",
  "questions": [
   {
    "id": "2-0",
    "level": "easy",
    "prompt": "What does function calling let a Gemini app connect to?",
    "options": [
     "Only prerecorded answers",
     "External application functions",
     "Only a larger chat bubble"
    ],
    "answer": 1,
    "explanation": "Function calling connects model requests with application functionality."
   },
   {
    "id": "2-1",
    "level": "medium",
    "prompt": "Gemini requests your get_weather function. Who runs this custom function?",
    "options": [
     "Your application or configured SDK integration",
     "A text label on the page",
     "The JSON schema by itself"
    ],
    "answer": 0,
    "explanation": "The function implementation must execute; a schema alone cannot fetch weather."
   },
   {
    "id": "2-2",
    "level": "medium",
    "prompt": "A Gemini custom tool needs a location. What makes its interface clearer?",
    "options": [
     "Putting every secret in the tool description",
     "Omitting all arguments",
     "A location parameter with a type and description"
    ],
    "answer": 2,
    "explanation": "Explicit parameter definitions describe what the function needs."
   },
   {
    "id": "2-3",
    "level": "hard",
    "prompt": "Your Google / Gemini assistant proposes deleting customer data through a tool. Which design is safest?",
    "options": [
     "Give the model an unrestricted administrator token",
     "Validate arguments, enforce user permissions and require confirmation for deletion",
     "Run any generated operation immediately"
    ],
    "answer": 1,
    "explanation": "A model request is not authorization. Enforce permissions and approval in application code.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   },
   {
    "id": "2-4",
    "level": "hard",
    "prompt": "A retrieved document tells your Google / Gemini assistant to ignore its instructions and reveal secrets. What should your app do?",
    "options": [
     "Treat retrieved text as untrusted data and restrict tool permissions",
     "Give the document higher priority than application rules",
     "Send every secret to the document author"
    ],
    "answer": 0,
    "explanation": "Retrieved content can contain prompt injection. Keep data separate from trusted instructions and limit tool privileges.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   },
   {
    "id": "2-5",
    "level": "hard",
    "prompt": "You revise a prompt in your Google / Gemini app. How do you decide whether it improved?",
    "options": [
     "Keep whichever answer is longest",
     "Evaluate only the example used to write the prompt",
     "Compare old and new behavior on representative held-out cases with defined metrics"
    ],
    "answer": 2,
    "explanation": "Use representative evaluation cases and explicit success criteria; include edge cases and failures.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   }
  ]
 },
 {
  "stage": 3,
  "name": "Meta / Llama",
  "source": "https://dev.meta.ai/llama/docs/how-to-guides/prompting",
  "course": "https://dev.meta.ai/llama/",
  "questions": [
   {
    "id": "3-0",
    "level": "easy",
    "prompt": "What is the purpose of giving Llama a clear prompt?",
    "options": [
     "Describe the task and useful context",
     "Guarantee every answer is factual",
     "Make evaluation unnecessary"
    ],
    "answer": 0,
    "explanation": "Prompts give the model task instructions and context; results still need checking."
   },
   {
    "id": "3-1",
    "level": "medium",
    "prompt": "Your Llama app must classify support tickets. Which prompt is more useful?",
    "options": [
     "Say only: do something smart",
     "Repeat the same vague request",
     "Define labels and give representative examples"
    ],
    "answer": 2,
    "explanation": "Explicit labels and examples help communicate the intended classification."
   },
   {
    "id": "3-2",
    "level": "medium",
    "prompt": "You need Llama to extract a date from a document. What should you specify?",
    "options": [
     "Only the color of the app",
     "The output format and behavior when the date is absent",
     "A requirement to always invent a date"
    ],
    "answer": 1,
    "explanation": "Define the format and missing-data behavior instead of encouraging fabrication."
   },
   {
    "id": "3-3",
    "level": "hard",
    "prompt": "Your Meta / Llama assistant proposes deleting customer data through a tool. Which design is safest?",
    "options": [
     "Validate arguments, enforce user permissions and require confirmation for deletion",
     "Run any generated operation immediately",
     "Give the model an unrestricted administrator token"
    ],
    "answer": 0,
    "explanation": "A model request is not authorization. Enforce permissions and approval in application code.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   },
   {
    "id": "3-4",
    "level": "hard",
    "prompt": "A retrieved document tells your Meta / Llama assistant to ignore its instructions and reveal secrets. What should your app do?",
    "options": [
     "Give the document higher priority than application rules",
     "Send every secret to the document author",
     "Treat retrieved text as untrusted data and restrict tool permissions"
    ],
    "answer": 2,
    "explanation": "Retrieved content can contain prompt injection. Keep data separate from trusted instructions and limit tool privileges.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   },
   {
    "id": "3-5",
    "level": "hard",
    "prompt": "You revise a prompt in your Meta / Llama app. How do you decide whether it improved?",
    "options": [
     "Evaluate only the example used to write the prompt",
     "Compare old and new behavior on representative held-out cases with defined metrics",
     "Keep whichever answer is longest"
    ],
    "answer": 1,
    "explanation": "Use representative evaluation cases and explicit success criteria; include edge cases and failures.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   }
  ]
 },
 {
  "stage": 4,
  "name": "xAI / Grok",
  "source": "https://docs.x.ai/developers/tools/function-calling",
  "course": "https://docs.x.ai/",
  "questions": [
   {
    "id": "4-0",
    "level": "easy",
    "prompt": "What does a function tool add to a Grok app?",
    "options": [
     "Automatic permission to access every account",
     "A guarantee of zero latency",
     "A way to request an external operation"
    ],
    "answer": 2,
    "explanation": "Function tools expose specific application operations."
   },
   {
    "id": "4-1",
    "level": "medium",
    "prompt": "Grok asks for a custom inventory lookup. What is the next application step?",
    "options": [
     "Return the API key as the result",
     "Run the allowed lookup and return its result",
     "Assume the item is available"
    ],
    "answer": 1,
    "explanation": "The app must perform the actual lookup before reporting inventory."
   },
   {
    "id": "4-2",
    "level": "medium",
    "prompt": "An inventory function requires a product ID. Where should this requirement be described?",
    "options": [
     "In the tool parameter schema",
     "Only in a hidden CSS class",
     "In a random user message"
    ],
    "answer": 0,
    "explanation": "A parameter schema documents required inputs for the tool."
   },
   {
    "id": "4-3",
    "level": "hard",
    "prompt": "Your xAI / Grok assistant proposes deleting customer data through a tool. Which design is safest?",
    "options": [
     "Run any generated operation immediately",
     "Give the model an unrestricted administrator token",
     "Validate arguments, enforce user permissions and require confirmation for deletion"
    ],
    "answer": 2,
    "explanation": "A model request is not authorization. Enforce permissions and approval in application code.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   },
   {
    "id": "4-4",
    "level": "hard",
    "prompt": "A retrieved document tells your xAI / Grok assistant to ignore its instructions and reveal secrets. What should your app do?",
    "options": [
     "Send every secret to the document author",
     "Treat retrieved text as untrusted data and restrict tool permissions",
     "Give the document higher priority than application rules"
    ],
    "answer": 1,
    "explanation": "Retrieved content can contain prompt injection. Keep data separate from trusted instructions and limit tool privileges.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   },
   {
    "id": "4-5",
    "level": "hard",
    "prompt": "You revise a prompt in your xAI / Grok app. How do you decide whether it improved?",
    "options": [
     "Compare old and new behavior on representative held-out cases with defined metrics",
     "Keep whichever answer is longest",
     "Evaluate only the example used to write the prompt"
    ],
    "answer": 0,
    "explanation": "Use representative evaluation cases and explicit success criteria; include edge cases and failures.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   }
  ]
 },
 {
  "stage": 5,
  "name": "Amazon / Bedrock",
  "source": "https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html",
  "course": "https://explore.skillbuilder.aws/",
  "questions": [
   {
    "id": "5-0",
    "level": "easy",
    "prompt": "What does a Bedrock knowledge base help a generative app use?",
    "options": [
     "Only the screen wallpaper",
     "Relevant information from connected data sources",
     "Unlimited model accuracy"
    ],
    "answer": 1,
    "explanation": "Knowledge bases support retrieval of relevant source information."
   },
   {
    "id": "5-1",
    "level": "medium",
    "prompt": "Your Bedrock app answers questions about internal policies. What does RAG add?",
    "options": [
     "Retrieved policy passages as context",
     "An automatic rewrite of model weights for each question",
     "Permission to ignore source access controls"
    ],
    "answer": 0,
    "explanation": "RAG retrieves information and adds it to the generation context."
   },
   {
    "id": "5-2",
    "level": "medium",
    "prompt": "A company policy changed yesterday. Which action helps a knowledge-base answer reflect it?",
    "options": [
     "Only change the chat background",
     "Increase the volume",
     "Update the source and synchronize its indexed content"
    ],
    "answer": 2,
    "explanation": "Retrieval depends on the indexed source content being up to date."
   },
   {
    "id": "5-3",
    "level": "hard",
    "prompt": "Your Amazon / Bedrock assistant proposes deleting customer data through a tool. Which design is safest?",
    "options": [
     "Give the model an unrestricted administrator token",
     "Validate arguments, enforce user permissions and require confirmation for deletion",
     "Run any generated operation immediately"
    ],
    "answer": 1,
    "explanation": "A model request is not authorization. Enforce permissions and approval in application code.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   },
   {
    "id": "5-4",
    "level": "hard",
    "prompt": "A retrieved document tells your Amazon / Bedrock assistant to ignore its instructions and reveal secrets. What should your app do?",
    "options": [
     "Treat retrieved text as untrusted data and restrict tool permissions",
     "Give the document higher priority than application rules",
     "Send every secret to the document author"
    ],
    "answer": 0,
    "explanation": "Retrieved content can contain prompt injection. Keep data separate from trusted instructions and limit tool privileges.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   },
   {
    "id": "5-5",
    "level": "hard",
    "prompt": "You revise a prompt in your Amazon / Bedrock app. How do you decide whether it improved?",
    "options": [
     "Keep whichever answer is longest",
     "Evaluate only the example used to write the prompt",
     "Compare old and new behavior on representative held-out cases with defined metrics"
    ],
    "answer": 2,
    "explanation": "Use representative evaluation cases and explicit success criteria; include edge cases and failures.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   }
  ]
 },
 {
  "stage": 6,
  "name": "Microsoft / Foundry",
  "source": "https://learn.microsoft.com/en-us/azure/foundry/concepts/retrieval-augmented-generation",
  "course": "https://learn.microsoft.com/training/",
  "questions": [
   {
    "id": "6-0",
    "level": "easy",
    "prompt": "What does RAG add to a Microsoft Foundry application?",
    "options": [
     "Relevant retrieved documents",
     "A promise that no answer needs checking",
     "Automatic access to every tenant"
    ],
    "answer": 0,
    "explanation": "RAG augments model context with retrieved source content."
   },
   {
    "id": "6-1",
    "level": "medium",
    "prompt": "Your Foundry assistant must answer from company manuals. What should retrieval return?",
    "options": [
     "Every file in the tenant without filtering",
     "Only filenames chosen at random",
     "Passages relevant to the user question"
    ],
    "answer": 2,
    "explanation": "Retrieval should select relevant context and respect access permissions."
   },
   {
    "id": "6-2",
    "level": "medium",
    "prompt": "A manual was updated but the index is stale. What is the appropriate fix?",
    "options": [
     "Hide the source links",
     "Refresh or synchronize the indexed source",
     "Tell the model to memorize an unseen update"
    ],
    "answer": 1,
    "explanation": "The retrieval layer must contain the updated information."
   },
   {
    "id": "6-3",
    "level": "hard",
    "prompt": "Your Microsoft / Foundry assistant proposes deleting customer data through a tool. Which design is safest?",
    "options": [
     "Validate arguments, enforce user permissions and require confirmation for deletion",
     "Run any generated operation immediately",
     "Give the model an unrestricted administrator token"
    ],
    "answer": 0,
    "explanation": "A model request is not authorization. Enforce permissions and approval in application code.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   },
   {
    "id": "6-4",
    "level": "hard",
    "prompt": "A retrieved document tells your Microsoft / Foundry assistant to ignore its instructions and reveal secrets. What should your app do?",
    "options": [
     "Give the document higher priority than application rules",
     "Send every secret to the document author",
     "Treat retrieved text as untrusted data and restrict tool permissions"
    ],
    "answer": 2,
    "explanation": "Retrieved content can contain prompt injection. Keep data separate from trusted instructions and limit tool privileges.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   },
   {
    "id": "6-5",
    "level": "hard",
    "prompt": "You revise a prompt in your Microsoft / Foundry app. How do you decide whether it improved?",
    "options": [
     "Evaluate only the example used to write the prompt",
     "Compare old and new behavior on representative held-out cases with defined metrics",
     "Keep whichever answer is longest"
    ],
    "answer": 1,
    "explanation": "Use representative evaluation cases and explicit success criteria; include edge cases and failures.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   }
  ]
 },
 {
  "stage": 7,
  "name": "Qwen",
  "source": "https://qwen.readthedocs.io/en/latest/framework/function_call.html",
  "course": "https://qwen.readthedocs.io/",
  "questions": [
   {
    "id": "7-0",
    "level": "easy",
    "prompt": "What can tool use enable in a Qwen application?",
    "options": [
     "Removing all need for application code",
     "Automatically granting administrator access",
     "Calling application functions"
    ],
    "answer": 2,
    "explanation": "Tool use connects a model request to implemented functionality."
   },
   {
    "id": "7-1",
    "level": "medium",
    "prompt": "Qwen emits a tool call. What should the integration do?",
    "options": [
     "Pretend it already ran",
     "Parse and validate it, run the function, return the result",
     "Treat the generated arguments as trusted shell commands"
    ],
    "answer": 1,
    "explanation": "Tool arguments are model output and need application-side handling."
   },
   {
    "id": "7-2",
    "level": "medium",
    "prompt": "A Qwen tool needs a calendar date. What helps define its input?",
    "options": [
     "An explicit parameter description and expected format",
     "A secret token in the user prompt",
     "No documentation at all"
    ],
    "answer": 0,
    "explanation": "Precise tool definitions help the model produce usable arguments."
   },
   {
    "id": "7-3",
    "level": "hard",
    "prompt": "Your Qwen assistant proposes deleting customer data through a tool. Which design is safest?",
    "options": [
     "Run any generated operation immediately",
     "Give the model an unrestricted administrator token",
     "Validate arguments, enforce user permissions and require confirmation for deletion"
    ],
    "answer": 2,
    "explanation": "A model request is not authorization. Enforce permissions and approval in application code.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   },
   {
    "id": "7-4",
    "level": "hard",
    "prompt": "A retrieved document tells your Qwen assistant to ignore its instructions and reveal secrets. What should your app do?",
    "options": [
     "Send every secret to the document author",
     "Treat retrieved text as untrusted data and restrict tool permissions",
     "Give the document higher priority than application rules"
    ],
    "answer": 1,
    "explanation": "Retrieved content can contain prompt injection. Keep data separate from trusted instructions and limit tool privileges.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   },
   {
    "id": "7-5",
    "level": "hard",
    "prompt": "You revise a prompt in your Qwen app. How do you decide whether it improved?",
    "options": [
     "Compare old and new behavior on representative held-out cases with defined metrics",
     "Keep whichever answer is longest",
     "Evaluate only the example used to write the prompt"
    ],
    "answer": 0,
    "explanation": "Use representative evaluation cases and explicit success criteria; include edge cases and failures.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   }
  ]
 },
 {
  "stage": 8,
  "name": "DeepSeek",
  "source": "https://api-docs.deepseek.com/",
  "course": "https://api-docs.deepseek.com/",
  "questions": [
   {
    "id": "8-0",
    "level": "easy",
    "prompt": "What does an API key do in a DeepSeek client?",
    "options": [
     "Replaces the request content",
     "Authenticates API requests",
     "Makes every model answer true"
    ],
    "answer": 1,
    "explanation": "An API key authenticates requests and should remain secret."
   },
   {
    "id": "8-1",
    "level": "medium",
    "prompt": "Where should a web app keep its private DeepSeek API key?",
    "options": [
     "On the server, outside public browser code",
     "Inside a public HTML comment",
     "In a URL shared with every player"
    ],
    "answer": 0,
    "explanation": "Private credentials belong in trusted application infrastructure."
   },
   {
    "id": "8-2",
    "level": "medium",
    "prompt": "You adapt an existing client to DeepSeek. What must match the provider configuration?",
    "options": [
     "Only the app logo",
     "The name of the user Wi-Fi network",
     "The API endpoint, authentication and supported model ID"
    ],
    "answer": 2,
    "explanation": "Clients must use the provider endpoint and supported request configuration."
   },
   {
    "id": "8-3",
    "level": "hard",
    "prompt": "Your DeepSeek assistant proposes deleting customer data through a tool. Which design is safest?",
    "options": [
     "Give the model an unrestricted administrator token",
     "Validate arguments, enforce user permissions and require confirmation for deletion",
     "Run any generated operation immediately"
    ],
    "answer": 1,
    "explanation": "A model request is not authorization. Enforce permissions and approval in application code.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   },
   {
    "id": "8-4",
    "level": "hard",
    "prompt": "A retrieved document tells your DeepSeek assistant to ignore its instructions and reveal secrets. What should your app do?",
    "options": [
     "Treat retrieved text as untrusted data and restrict tool permissions",
     "Give the document higher priority than application rules",
     "Send every secret to the document author"
    ],
    "answer": 0,
    "explanation": "Retrieved content can contain prompt injection. Keep data separate from trusted instructions and limit tool privileges.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   },
   {
    "id": "8-5",
    "level": "hard",
    "prompt": "You revise a prompt in your DeepSeek app. How do you decide whether it improved?",
    "options": [
     "Keep whichever answer is longest",
     "Evaluate only the example used to write the prompt",
     "Compare old and new behavior on representative held-out cases with defined metrics"
    ],
    "answer": 2,
    "explanation": "Use representative evaluation cases and explicit success criteria; include edge cases and failures.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   }
  ]
 },
 {
  "stage": 9,
  "name": "Kimi / Moonshot",
  "source": "https://platform.kimi.ai/docs/overview",
  "course": "https://platform.kimi.ai/docs/overview",
  "questions": [
   {
    "id": "9-0",
    "level": "easy",
    "prompt": "What does a Kimi API integration let your application request?",
    "options": [
     "Model-generated responses",
     "Guaranteed access to all user devices",
     "A replacement for all testing"
    ],
    "answer": 0,
    "explanation": "An API integration submits model requests and receives results."
   },
   {
    "id": "9-1",
    "level": "medium",
    "prompt": "Your Kimi app needs to show text while it is generated. Which capability fits?",
    "options": [
     "Changing the app icon",
     "Sending the API key to the screen",
     "Streaming"
    ],
    "answer": 2,
    "explanation": "Streaming delivers incremental response content."
   },
   {
    "id": "9-2",
    "level": "medium",
    "prompt": "You connect a Kimi client to its API. Which configuration is essential?",
    "options": [
     "The name of an unrelated local file",
     "The provider endpoint, credentials and supported model",
     "The monitor brand"
    ],
    "answer": 1,
    "explanation": "The client must address the correct provider with valid configuration."
   },
   {
    "id": "9-3",
    "level": "hard",
    "prompt": "Your Kimi / Moonshot assistant proposes deleting customer data through a tool. Which design is safest?",
    "options": [
     "Validate arguments, enforce user permissions and require confirmation for deletion",
     "Run any generated operation immediately",
     "Give the model an unrestricted administrator token"
    ],
    "answer": 0,
    "explanation": "A model request is not authorization. Enforce permissions and approval in application code.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   },
   {
    "id": "9-4",
    "level": "hard",
    "prompt": "A retrieved document tells your Kimi / Moonshot assistant to ignore its instructions and reveal secrets. What should your app do?",
    "options": [
     "Give the document higher priority than application rules",
     "Send every secret to the document author",
     "Treat retrieved text as untrusted data and restrict tool permissions"
    ],
    "answer": 2,
    "explanation": "Retrieved content can contain prompt injection. Keep data separate from trusted instructions and limit tool privileges.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   },
   {
    "id": "9-5",
    "level": "hard",
    "prompt": "You revise a prompt in your Kimi / Moonshot app. How do you decide whether it improved?",
    "options": [
     "Evaluate only the example used to write the prompt",
     "Compare old and new behavior on representative held-out cases with defined metrics",
     "Keep whichever answer is longest"
    ],
    "answer": 1,
    "explanation": "Use representative evaluation cases and explicit success criteria; include edge cases and failures.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   }
  ]
 },
 {
  "stage": 10,
  "name": "AI alliance",
  "source": "https://learn.microsoft.com/en-us/azure/foundry/concepts/retrieval-augmented-generation",
  "course": "https://learn.microsoft.com/training/",
  "questions": [
   {
    "id": "10-0",
    "level": "easy",
    "prompt": "Why check a fluent LLM answer against evidence?",
    "options": [
     "Fluency proves the answer is correct",
     "Checking disables the model",
     "Fluent text can still contain factual errors"
    ],
    "answer": 2,
    "explanation": "Generated text must be assessed against reliable evidence."
   },
   {
    "id": "10-1",
    "level": "medium",
    "prompt": "What is the role of retrieval in a RAG system?",
    "options": [
     "Approve every action the model suggests",
     "Find relevant source passages",
     "Automatically retrain the entire model"
    ],
    "answer": 1,
    "explanation": "Retrieval provides useful context for generation."
   },
   {
    "id": "10-2",
    "level": "medium",
    "prompt": "A RAG answer cites a source. What should a reviewer verify?",
    "options": [
     "That the cited passage actually supports the claim",
     "Only that the answer is long",
     "Only that the source has a logo"
    ],
    "answer": 0,
    "explanation": "A citation is useful only if its content supports the associated claim."
   },
   {
    "id": "10-3",
    "level": "hard",
    "prompt": "Your AI alliance assistant proposes deleting customer data through a tool. Which design is safest?",
    "options": [
     "Run any generated operation immediately",
     "Give the model an unrestricted administrator token",
     "Validate arguments, enforce user permissions and require confirmation for deletion"
    ],
    "answer": 2,
    "explanation": "A model request is not authorization. Enforce permissions and approval in application code.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   },
   {
    "id": "10-4",
    "level": "hard",
    "prompt": "A retrieved document tells your AI alliance assistant to ignore its instructions and reveal secrets. What should your app do?",
    "options": [
     "Send every secret to the document author",
     "Treat retrieved text as untrusted data and restrict tool permissions",
     "Give the document higher priority than application rules"
    ],
    "answer": 1,
    "explanation": "Retrieved content can contain prompt injection. Keep data separate from trusted instructions and limit tool privileges.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   },
   {
    "id": "10-5",
    "level": "hard",
    "prompt": "You revise a prompt in your AI alliance app. How do you decide whether it improved?",
    "options": [
     "Compare old and new behavior on representative held-out cases with defined metrics",
     "Keep whichever answer is longest",
     "Evaluate only the example used to write the prompt"
    ],
    "answer": 0,
    "explanation": "Use representative evaluation cases and explicit success criteria; include edge cases and failures.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   }
  ]
 },
 {
  "stage": 11,
  "name": "Vercel / AI SDK",
  "source": "https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text",
  "course": "https://ai-sdk.dev/docs",
  "questions": [
   {
    "id": "11-0",
    "level": "easy",
    "prompt": "Which AI SDK function is designed for streaming generated text?",
    "options": [
     "resizeWindow",
     "streamText",
     "paintButton"
    ],
    "answer": 1,
    "explanation": "streamText supports incremental generation of text."
   },
   {
    "id": "11-1",
    "level": "medium",
    "prompt": "Why stream a long AI SDK response to a user?",
    "options": [
     "Show incremental output while generation continues",
     "Guarantee no token costs",
     "Make incorrect answers impossible"
    ],
    "answer": 0,
    "explanation": "Streaming can improve perceived responsiveness, not correctness."
   },
   {
    "id": "11-2",
    "level": "medium",
    "prompt": "Your AI SDK app uses a provider API key. Where should the secret be used?",
    "options": [
     "In a public client bundle",
     "Inside a shared image filename",
     "In trusted server-side code"
    ],
    "answer": 2,
    "explanation": "Private provider keys should not be exposed to browser clients."
   },
   {
    "id": "11-3",
    "level": "hard",
    "prompt": "Your Vercel / AI SDK assistant proposes deleting customer data through a tool. Which design is safest?",
    "options": [
     "Give the model an unrestricted administrator token",
     "Validate arguments, enforce user permissions and require confirmation for deletion",
     "Run any generated operation immediately"
    ],
    "answer": 1,
    "explanation": "A model request is not authorization. Enforce permissions and approval in application code.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   },
   {
    "id": "11-4",
    "level": "hard",
    "prompt": "A retrieved document tells your Vercel / AI SDK assistant to ignore its instructions and reveal secrets. What should your app do?",
    "options": [
     "Treat retrieved text as untrusted data and restrict tool permissions",
     "Give the document higher priority than application rules",
     "Send every secret to the document author"
    ],
    "answer": 0,
    "explanation": "Retrieved content can contain prompt injection. Keep data separate from trusted instructions and limit tool privileges.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   },
   {
    "id": "11-5",
    "level": "hard",
    "prompt": "You revise a prompt in your Vercel / AI SDK app. How do you decide whether it improved?",
    "options": [
     "Keep whichever answer is longest",
     "Evaluate only the example used to write the prompt",
     "Compare old and new behavior on representative held-out cases with defined metrics"
    ],
    "answer": 2,
    "explanation": "Use representative evaluation cases and explicit success criteria; include edge cases and failures.",
    "source": "https://platform.claude.com/docs/en/test-and-evaluate/define-success"
   }
  ]
 }
];
export const KNOWLEDGE_BANK=buildCurriculum(ORIGINAL_KNOWLEDGE_BANK);
export const KNOWLEDGE_LEVELS={easy:{count:6,reward:4,badgeTarget:6},medium:{count:6,reward:6,badgeTarget:6},hard:{count:6,reward:8,badgeTarget:6}};
export function knowledgeSet(stage,level){const entry=KNOWLEDGE_BANK[stage];if(!entry||!Object.hasOwn(KNOWLEDGE_LEVELS,level))throw Error('Invalid knowledge challenge');return entry.questions.filter(q=>q.level===level);}
export function knowledgeBadge(stage,level,previous={}){knowledgeSet(stage,level);const spec=KNOWLEDGE_LEVELS[level],ids=new Set(knowledgeSet(stage,level).map(q=>q.id));const correct=new Set(Object.values(previous).filter(r=>r.correct&&r.stage===stage&&r.level===level&&ids.has(r.question)).map(r=>r.question)).size;return {id:stage+':'+level,name:KNOWLEDGE_BANK[stage].badgeName+' '+level[0].toUpperCase()+level.slice(1),correct,target:spec.badgeTarget,earned:correct>=spec.badgeTarget};}
export function gradeKnowledge(body,previous={}){const questions=knowledgeSet(body.stage,body.level),q=questions.find(q=>q.id===body.question);if(!q||!Number.isInteger(body.answer)||body.answer<0||body.answer>=q.options.length)throw Error('Invalid knowledge answer');const key=body.stage+':'+body.level+':'+q.id,old=Object.hasOwn(previous,key)?previous[key]:null,correct=body.answer===q.answer;const receipt={correct,answer:q.answer,reward:correct&&!old?.correct?KNOWLEDGE_LEVELS[body.level].reward:0,key,stage:body.stage,level:body.level,question:q.id,alreadyAnswered:!!old?.correct};const updated={...previous,[key]:old?.correct?old:receipt},badge=knowledgeBadge(body.stage,body.level,updated);return {...receipt,badge,newBadge:badge.earned&&!knowledgeBadge(body.stage,body.level,previous).earned};}
