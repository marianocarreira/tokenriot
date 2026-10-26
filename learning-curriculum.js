// SPDX-FileCopyrightText: 2026 Mariano Carreira
// SPDX-License-Identifier: GPL-3.0-only
// Original provider-specific preparation material, with official reference links.
import {CHINESE_TOPICS} from './learning-curriculum-zh.js';
export const CURRICULUM_VERSION=3;
export const CURRICULUM_TRANSLATIONS={};
export const CURRICULUM_CHINESE={};
export const PROVIDER_TOPICS=[
 [
  [
   "Responses API§Responses API",
   "An API for generating OpenAI responses with optional tools.§Una API para generar respuestas de OpenAI con herramientas opcionales.",
   "build a new OpenAI text-and-tools backend§crear un backend de OpenAI con texto y herramientas",
   "a Responses tool request appears, but no real delivery lookup happens. What is missing?§aparece una solicitud de herramienta en Responses, pero no se consulta el envío real. ¿Qué falta?",
   "Execute the permitted function and return its output for that call.§Ejecutar la función permitida y devolver su resultado para esa llamada.",
   "A generated tool call requests application work; it does not execute your business code.§La llamada solicita trabajo a tu aplicación; no ejecuta tu código de negocio.",
   "https://developers.openai.com/api/docs/guides/function-calling"
  ],
  [
   "Structured Outputs§Structured Outputs",
   "A way to constrain an OpenAI response to a supplied schema.§Una forma de ajustar la respuesta de OpenAI a un esquema definido.",
   "extract an invoice into predictable fields§extraer una factura en campos predecibles",
   "a response matches its JSON schema, but the invoice total is wrong. What still needs checking?§la respuesta cumple el esquema JSON, pero el total de la factura es incorrecto. ¿Qué falta revisar?",
   "Validate the extracted values against the invoice.§Validar los valores extraídos contra la factura.",
   "Schema compliance concerns structure; source evidence is still needed for factual accuracy.§Cumplir el esquema garantiza la estructura; los datos todavía necesitan respaldo en la fuente.",
   "https://developers.openai.com/api/docs/guides/structured-outputs"
  ],
  [
   "File search§Búsqueda en archivos",
   "An OpenAI tool for retrieving information from uploaded files.§Una herramienta de OpenAI para recuperar información de archivos cargados.",
   "answer using uploaded product manuals§responder con manuales de producto cargados",
   "file search keeps finding an old handbook. What directly addresses this?§la búsqueda encuentra siempre un manual viejo. ¿Qué lo corrige directamente?",
   "Update the indexed files and check the retrieved passages.§Actualizar los archivos indexados y revisar los fragmentos recuperados.",
   "Retrieval can only use the content available in its configured file store.§La recuperación usa el contenido disponible en el almacén de archivos configurado.",
   "https://developers.openai.com/api/docs/guides/tools-file-search"
  ],
  [
   "Conversation state§Estado de conversación",
   "The messages or response references used to continue an OpenAI conversation.§Los mensajes o referencias de respuestas usados para continuar una conversación de OpenAI.",
   "continue a conversation with its earlier context§continuar una conversación con su contexto anterior",
   "a follow-up loses the earlier order details. What should the integration restore?§una pregunta posterior pierde los datos del pedido. ¿Qué debe restaurar la integración?",
   "Pass the relevant conversation history or supported response reference.§Pasar el historial relevante o una referencia de respuesta admitida.",
   "Your integration must connect follow-up requests to the appropriate conversation state.§La integración debe vincular las nuevas solicitudes con el estado de la conversación correcta.",
   "https://developers.openai.com/api/docs/guides/conversation-state"
  ],
  [
   "Image inputs§Entradas de imagen",
   "A way to provide pictures to an OpenAI model that supports vision.§Una forma de enviar imágenes a un modelo de OpenAI con visión.",
   "ask a vision-capable model about a screenshot§preguntar por una captura a un modelo con visión",
   "an image URL points to an inaccessible private file. What should change?§la URL de una imagen apunta a un archivo privado inaccesible. ¿Qué debe cambiar?",
   "Provide the image through a supported accessible input method.§Enviar la imagen mediante un método de entrada admitido y accesible.",
   "A filename alone does not supply the image pixels to the model.§El nombre de un archivo por sí solo no entrega sus píxeles al modelo.",
   "https://developers.openai.com/api/docs/guides/images-vision"
  ],
  [
   "Evals§Evaluaciones",
   "Tests for measuring whether OpenAI outputs meet defined criteria.§Pruebas para medir si las respuestas de OpenAI cumplen criterios definidos.",
   "compare two versions of an OpenAI assistant§comparar dos versiones de un asistente de OpenAI",
   "a prompt improves one demo but fails real support cases. How should it be assessed?§un prompt mejora una demostración pero falla en soporte real. ¿Cómo se evalúa?",
   "Compare both versions on representative held-out support cases.§Comparar ambas versiones con casos representativos de soporte reservados.",
   "Use explicit criteria and examples that were not used to tune the prompt.§Usá criterios explícitos y ejemplos que no se usaron para ajustar el prompt.",
   "https://developers.openai.com/api/docs/guides/evals"
  ]
 ],
 [
  [
   "Messages API§Messages API",
   "The Claude API interface for sending messages and receiving content.§La interfaz de la API de Claude para enviar mensajes y recibir contenido.",
   "send a conversation to Claude from your backend§enviar una conversación a Claude desde tu backend",
   "a follow-up request omits earlier messages and Claude loses context. What should be supplied?§una solicitud omite los mensajes anteriores y Claude pierde el contexto. ¿Qué hay que enviar?",
   "Include the relevant prior user and assistant messages.§Incluir los mensajes previos relevantes del usuario y del asistente.",
   "A stateless Messages request needs the conversation context your application wants Claude to use.§Una solicitud sin estado de Messages necesita el contexto que tu aplicación quiere que use Claude.",
   "https://platform.claude.com/docs/en/build-with-claude/working-with-messages"
  ],
  [
   "System parameter§Parámetro system",
   "The top-level field for application instructions in Claude Messages requests.§El campo superior para las instrucciones de la aplicación en solicitudes Messages de Claude.",
   "set the overall behavior of a Claude assistant§definir el comportamiento general de un asistente de Claude",
   "application instructions were mixed into a customer document. What improves the separation?§las instrucciones de la aplicación se mezclaron con un documento del cliente. ¿Qué mejora la separación?",
   "Put trusted application instructions in system and treat the document as data.§Colocar las instrucciones confiables en system y tratar el documento como datos.",
   "The system field and user-provided document content serve different roles.§El campo system y el contenido de un documento del usuario cumplen funciones diferentes.",
   "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/system-prompts"
  ],
  [
   "Client tool use§Herramientas de cliente",
   "Claude requests a named tool that your application implements.§Claude solicita una herramienta con nombre que implementa tu aplicación.",
   "let Claude request your inventory function§permitir que Claude solicite tu función de inventario",
   "Claude returned tool_use and is still waiting for inventory data. What completes the loop?§Claude devolvió tool_use y sigue esperando el inventario. ¿Qué completa el ciclo?",
   "Return a tool_result linked to the matching tool_use ID.§Devolver un tool_result vinculado al ID de tool_use correspondiente.",
   "Matching the tool result to its request lets Claude use the actual returned information.§Vincular el resultado con su solicitud permite que Claude use la información real obtenida.",
   "https://platform.claude.com/docs/en/agents-and-tools/tool-use/implement-tool-use"
  ],
  [
   "Prompt caching§Caché de prompts",
   "Reusing eligible repeated prompt prefixes in Claude requests.§La reutilización de prefijos repetidos elegibles en solicitudes a Claude.",
   "reuse a long stable instruction prefix with Claude§reutilizar un prefijo largo y estable de instrucciones con Claude",
   "the supposedly cached prefix changes on every request. What would improve cache reuse?§el prefijo supuestamente cacheado cambia en cada solicitud. ¿Qué mejora su reutilización?",
   "Keep reusable prefix content stable and inspect cache usage.§Mantener estable el prefijo reutilizable y revisar el uso de caché.",
   "Prefix reuse depends on the provider caching rules and the actual repeated content.§La reutilización depende de las reglas de caché y del contenido que realmente se repite.",
   "https://platform.claude.com/docs/en/build-with-claude/prompt-caching"
  ],
  [
   "Content blocks§Bloques de contenido",
   "Claude message parts that can represent text, images or tool activity.§Partes de los mensajes de Claude que pueden representar texto, imágenes o herramientas.",
   "handle a Claude response with both text and tool activity§procesar una respuesta de Claude con texto y herramientas",
   "your renderer assumes every content block is text. What needs fixing?§tu interfaz supone que cada bloque es texto. ¿Qué hay que corregir?",
   "Inspect each block type and handle its supported structure.§Inspeccionar el tipo de cada bloque y manejar su estructura admitida.",
   "A Messages content array can contain more than plain text.§El arreglo content de Messages puede contener más que texto plano.",
   "https://platform.claude.com/docs/en/api/messages"
  ],
  [
   "Claude Code§Claude Code",
   "An agentic coding tool that works with a software project.§Una herramienta de programación con agentes que trabaja sobre un proyecto de software.",
   "ask a coding agent to inspect a repository§pedir a un agente de programación que inspeccione un repositorio",
   "Claude Code proposes a destructive shell command. What should the workflow require?§Claude Code propone un comando destructivo. ¿Qué debe exigir el flujo?",
   "Review the command and enforce its permission or approval boundary.§Revisar el comando y aplicar su límite de permisos o aprobación.",
   "Repository access does not make every proposed command appropriate to execute.§El acceso al repositorio no autoriza automáticamente todo comando propuesto.",
   "https://code.claude.com/docs/en/permissions"
  ]
 ],
 [
  [
   "Google AI Studio§Google AI Studio",
   "A Google workspace for trying Gemini prompts and developing API integrations.§Un espacio de Google para probar prompts de Gemini y desarrollar integraciones de API.",
   "try a Gemini prompt before writing an application§probar un prompt de Gemini antes de escribir una aplicación",
   "a prototype works in AI Studio but the app has no API credential. What must be configured?§el prototipo funciona en AI Studio, pero la app no tiene credencial de API. ¿Qué falta configurar?",
   "Configure the appropriate Gemini API credential in the backend.§Configurar la credencial adecuada de Gemini API en el backend.",
   "An interactive prototype and an authenticated application request are separate steps.§Un prototipo interactivo y una solicitud autenticada de la aplicación son pasos diferentes.",
   "https://ai.google.dev/gemini-api/docs/api-key"
  ],
  [
   "Gemini multimodal inputs§Entradas multimodales de Gemini",
   "Supported combinations of text, images, audio or video as model input.§Combinaciones admitidas de texto, imágenes, audio o video como entrada del modelo.",
   "ask Gemini about the contents of an image§preguntar a Gemini por el contenido de una imagen",
   "the chosen Gemini model does not support the supplied media type. What should you check?§el modelo elegido no admite el tipo de medio enviado. ¿Qué se debe revisar?",
   "Choose a model and input format that support that media.§Elegir un modelo y un formato de entrada que admitan ese medio.",
   "Model capabilities and supported input formats must match the intended task.§Las capacidades del modelo y los formatos admitidos deben coincidir con la tarea.",
   "https://ai.google.dev/gemini-api/docs/image-understanding"
  ],
  [
   "Grounding with Google Search§Fundamentación con Google Search",
   "Connecting a Gemini response to information retrieved through Google Search.§Vincular una respuesta de Gemini con información recuperada mediante Google Search.",
   "ground a Gemini answer in current public web information§fundamentar una respuesta de Gemini con información pública actual de la web",
   "a grounded answer includes source links. What must the interface preserve?§una respuesta fundamentada incluye enlaces a fuentes. ¿Qué debe conservar la interfaz?",
   "Display the relevant grounding references and required search presentation.§Mostrar las referencias relevantes y la presentación de búsqueda requerida.",
   "Grounding metadata helps users inspect the sources associated with the generated answer.§Los metadatos de fundamentación permiten revisar las fuentes relacionadas con la respuesta.",
   "https://ai.google.dev/gemini-api/docs/google-search"
  ],
  [
   "Function calling§Llamadas a funciones",
   "Gemini selecting a declared application function and its arguments.§Gemini selecciona una función declarada de la aplicación y sus argumentos.",
   "connect Gemini to a custom weather function§conectar Gemini a una función propia del clima",
   "Gemini requests get_weather but the JSON declaration never fetches weather. Why?§Gemini solicita get_weather, pero la declaración JSON nunca consulta el clima. ¿Por qué?",
   "The application must execute the declared function and return its result.§La aplicación debe ejecutar la función declarada y devolver su resultado.",
   "A function declaration describes an interface, not its external implementation.§La declaración describe una interfaz, no implementa el servicio externo.",
   "https://ai.google.dev/gemini-api/docs/function-calling"
  ],
  [
   "Structured output§Salida estructurada",
   "A Gemini response constrained to an expected output structure.§Una respuesta de Gemini ajustada a una estructura de salida esperada.",
   "receive predictable JSON fields from Gemini§recibir campos JSON predecibles de Gemini",
   "Gemini emits valid structured JSON with a nonexistent product ID. What remains necessary?§Gemini genera JSON estructurado válido con un ID de producto inexistente. ¿Qué sigue siendo necesario?",
   "Validate the product ID against your actual catalog.§Validar el ID del producto contra tu catálogo real.",
   "Output structure and application-level data validity are different checks.§La estructura de salida y la validez de los datos de la aplicación requieren verificaciones diferentes.",
   "https://ai.google.dev/gemini-api/docs/structured-output"
  ],
  [
   "Context caching§Caché de contexto",
   "Reusing supported input context across Gemini requests.§Reutilizar contexto de entrada admitido entre solicitudes a Gemini.",
   "reuse the same large source context in several Gemini requests§reutilizar el mismo contexto extenso en varias solicitudes a Gemini",
   "a request references an expired explicit Gemini cache. What should happen?§una solicitud referencia una caché explícita de Gemini vencida. ¿Qué corresponde hacer?",
   "Recreate the cache or supply the needed context again.§Recrear la caché o volver a proporcionar el contexto necesario.",
   "Cached context has provider-managed limits and lifetime; an expired reference is not permanent memory.§El contexto cacheado tiene límites y duración; una referencia vencida no es memoria permanente.",
   "https://ai.google.dev/gemini-api/docs/caching"
  ]
 ],
 [
  [
   "Llama model weights§Pesos de un modelo Llama",
   "Model parameters that can be loaded into a compatible inference runtime.§Parámetros del modelo que se cargan en un entorno compatible de inferencia.",
   "run a Llama model on infrastructure you control§ejecutar un modelo Llama en infraestructura que controlás",
   "you downloaded Llama weights but no service answers requests. What is missing?§descargaste pesos de Llama, pero ningún servicio responde solicitudes. ¿Qué falta?",
   "Load the compatible model in an inference runtime or server.§Cargar el modelo compatible en un entorno o servidor de inferencia.",
   "Model files alone are not a running API service.§Los archivos del modelo por sí solos no son un servicio de API en ejecución.",
   "https://github.com/meta-llama/llama-models"
  ],
  [
   "Model card§Ficha del modelo",
   "Documentation of a Llama release, its capabilities and intended use.§Documentación de una versión de Llama, sus capacidades y usos previstos.",
   "check the intended uses and limitations of a Llama release§revisar los usos previstos y límites de una versión de Llama",
   "a team assumes every Llama release supports the same modalities. What should guide selection?§un equipo supone que todas las versiones admiten las mismas modalidades. ¿Qué debe guiar la elección?",
   "Read the exact release model card and test its documented capabilities.§Leer la ficha de la versión concreta y probar sus capacidades documentadas.",
   "Capabilities vary by model release; a family name is not a complete specification.§Las capacidades varían según la versión; el nombre de la familia no es una especificación completa.",
   "https://github.com/meta-llama/llama-models/blob/main/models/llama4/MODEL_CARD.md"
  ],
  [
   "Chat template§Plantilla de chat",
   "The model-specific formatting of Llama conversation messages.§El formato de mensajes de conversación específico del modelo Llama.",
   "format role-based messages for an instruct-tuned Llama model§dar formato a mensajes con roles para un modelo Llama ajustado a instrucciones",
   "an instruct Llama model receives another model family’s control tokens. What should change?§un Llama de instrucciones recibe tokens de control de otra familia. ¿Qué se debe cambiar?",
   "Apply the tokenizer chat template for the exact Llama checkpoint.§Aplicar la plantilla de chat del tokenizador de ese checkpoint de Llama.",
   "Instruction models expect a particular message format and control-token structure.§Los modelos de instrucciones esperan un formato de mensajes y tokens de control determinados.",
   "https://github.com/meta-llama/llama-models/blob/main/models/llama3_3/prompt_format.md"
  ],
  [
   "Quantization§Cuantización",
   "Representing Llama weights at lower numerical precision to reduce memory use.§Representar los pesos de Llama con menor precisión numérica para reducir memoria.",
   "reduce the memory needed to load Llama weights§reducir la memoria necesaria para cargar los pesos de Llama",
   "a quantized Llama fits in memory but performs worse on your task. What should be compared?§un Llama cuantizado entra en memoria, pero rinde peor en tu tarea. ¿Qué se debe comparar?",
   "Measure quality and memory across supported quantization choices.§Medir calidad y memoria con distintas opciones de cuantización admitidas.",
   "Lower memory use can involve a quality tradeoff that needs task-specific evaluation.§Usar menos memoria puede afectar la calidad y requiere evaluar la tarea concreta.",
   "https://github.com/meta-llama/llama-models"
  ],
  [
   "Llama license§Licencia de Llama",
   "The terms governing use and distribution of a particular Llama release.§Los términos que regulan el uso y distribución de una versión concreta de Llama.",
   "check whether a planned Llama distribution follows its terms§revisar si una distribución de Llama cumple sus términos",
   "downloadable weights are assumed to mean unrestricted redistribution. What must be reviewed?§se supone que descargar los pesos permite redistribuir sin restricciones. ¿Qué hay que revisar?",
   "Check the specific release license and applicable use terms.§Revisar la licencia de esa versión y los términos de uso aplicables.",
   "Availability of model files does not remove the terms that accompany them.§Que los archivos estén disponibles no elimina los términos que los acompañan.",
   "https://github.com/meta-llama/llama-models/blob/main/models/llama4/LICENSE"
  ],
  [
   "Inference serving§Servicio de inferencia",
   "Running a Llama model behind an application-facing request interface.§Ejecutar un modelo Llama detrás de una interfaz de solicitudes para aplicaciones.",
   "expose a loaded Llama model to several application clients§ofrecer un modelo Llama cargado a varios clientes de una aplicación",
   "a Llama service has long queues under concurrent load. What should be measured?§el servicio de Llama tiene colas largas con varias solicitudes simultáneas. ¿Qué conviene medir?",
   "Benchmark concurrency, batching and latency on the chosen serving runtime.§Medir concurrencia, procesamiento por lotes y latencia en el servidor elegido.",
   "Serving behavior depends on the runtime and available compute, not just the prompt.§El servicio depende del entorno de ejecución y los recursos, no solo del prompt.",
   "https://github.com/meta-llama/llama-models"
  ]
 ],
 [
  [
   "Grok API§API de Grok",
   "An interface for integrating xAI models into your application.§Una interfaz para integrar modelos de xAI en tu aplicación.",
   "generate a Grok response from a backend§generar una respuesta de Grok desde un backend",
   "a Grok chat subscription is mistaken for an application API credential. What is needed?§se confunde una suscripción de chat con una credencial de API. ¿Qué se necesita?",
   "Configure API access and a credential from the xAI API console.§Configurar acceso y una credencial desde la consola de API de xAI.",
   "Consumer chat access and authenticated developer API requests are different integrations.§El acceso al chat y las solicitudes autenticadas de la API son integraciones distintas.",
   "https://docs.x.ai/overview"
  ],
  [
   "Web Search§Búsqueda web",
   "A Grok tool for retrieving information from public web sources.§Una herramienta de Grok para recuperar información de fuentes públicas de la web.",
   "look up recent information on public websites§consultar información reciente en sitios públicos",
   "a Grok answer about today’s news has no retrieved evidence. What should be enabled and checked?§una respuesta sobre noticias de hoy no tiene evidencia recuperada. ¿Qué debe habilitarse y revisarse?",
   "Use web search and inspect its sources before relying on the answer.§Usar búsqueda web y revisar sus fuentes antes de confiar en la respuesta.",
   "Fresh web facts need actual retrieval; model fluency is not proof of a current lookup.§Los datos actuales necesitan recuperación real; la fluidez no demuestra una consulta reciente.",
   "https://docs.x.ai/docs/guides/tools/search-tools"
  ],
  [
   "X Search§Búsqueda en X",
   "A Grok tool for searching content on X.§Una herramienta de Grok para buscar contenido en X.",
   "find public discussion on X rather than general websites§encontrar publicaciones públicas en X en lugar de sitios web generales",
   "a result is from an unrelated X account. What can narrow the intended research?§un resultado proviene de una cuenta de X ajena al tema. ¿Qué puede acotar la investigación?",
   "Apply supported X search constraints and verify the returned posts.§Aplicar filtros admitidos de búsqueda en X y verificar las publicaciones obtenidas.",
   "Source, account and date relevance should be checked against the research task.§La fuente, la cuenta y la fecha deben contrastarse con la investigación solicitada.",
   "https://docs.x.ai/docs/guides/tools/search-tools"
  ],
  [
   "Image understanding§Comprensión de imágenes",
   "Providing pictures to a vision-capable Grok model for analysis.§Enviar imágenes a un modelo Grok con visión para analizarlas.",
   "ask Grok to describe a photograph§pedirle a Grok que describa una fotografía",
   "Grok sees only a local filename instead of image data. What should be supplied?§Grok recibe solo un nombre de archivo local en vez de la imagen. ¿Qué se debe enviar?",
   "Send the image using a supported image input representation.§Enviar la imagen con una representación de entrada admitida.",
   "The model needs accessible image content, not just the name of a local file.§El modelo necesita el contenido accesible de la imagen, no solo un nombre local.",
   "https://docs.x.ai/docs/guides/image-understanding"
  ],
  [
   "Function calling§Llamadas a funciones",
   "Grok requesting application-defined functions with arguments.§Grok solicita funciones definidas por la aplicación junto con sus argumentos.",
   "let Grok request a private order-status function§permitir que Grok solicite una función privada de pedidos",
   "a Grok function call asks for an order the user cannot access. What must the backend do?§una llamada solicita un pedido al que el usuario no tiene acceso. ¿Qué debe hacer el backend?",
   "Enforce order access permissions before running or returning the lookup.§Aplicar los permisos del pedido antes de consultar o devolver sus datos.",
   "A generated function argument does not grant access to customer information.§Un argumento generado no concede acceso a información del cliente.",
   "https://docs.x.ai/developers/tools/function-calling"
  ],
  [
   "Streaming§Streaming",
   "Receiving a Grok response incrementally as it is generated.§Recibir una respuesta de Grok progresivamente mientras se genera.",
   "show Grok text before the entire response finishes§mostrar texto de Grok antes de que termine toda la respuesta",
   "the stream stops partway through a Grok answer. What should the interface indicate?§el stream se corta a mitad de la respuesta. ¿Qué debe indicar la interfaz?",
   "Mark the response as incomplete and handle the stream failure.§Marcar la respuesta como incompleta y gestionar el fallo del stream.",
   "Partial output should not be presented as a successfully completed response.§La salida parcial no debe presentarse como una respuesta completada correctamente.",
   "https://docs.x.ai/docs/guides/streaming-response"
  ]
 ],
 [
  [
   "Bedrock model catalog§Catálogo de modelos de Bedrock",
   "A selection of foundation models accessible through Amazon Bedrock.§Una selección de modelos fundacionales accesibles mediante Amazon Bedrock.",
   "compare model options offered by Amazon Bedrock§comparar modelos ofrecidos por Amazon Bedrock",
   "switching a Bedrock model makes some request options unsupported. What must be checked?§al cambiar de modelo algunas opciones dejan de estar admitidas. ¿Qué hay que revisar?",
   "Check the selected model’s supported request capabilities and parameters.§Revisar las capacidades y parámetros admitidos del modelo seleccionado.",
   "A shared service does not make all model capabilities identical.§Un servicio compartido no vuelve idénticas las capacidades de todos sus modelos.",
   "https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html"
  ],
  [
   "Converse API§Converse API",
   "A common conversation interface for supported Bedrock models.§Una interfaz común de conversación para modelos compatibles de Bedrock.",
   "use a consistent message interface across supported Bedrock models§usar una interfaz consistente de mensajes entre modelos compatibles de Bedrock",
   "a Converse request assumes every model supports image input. What should guide that request?§una solicitud Converse supone que todos los modelos admiten imágenes. ¿Qué debe guiarla?",
   "Match Converse features to the capabilities of the selected model.§Ajustar las funciones de Converse a las capacidades del modelo elegido.",
   "The common interface still has model-specific feature support.§La interfaz común conserva diferencias de funciones según el modelo.",
   "https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html"
  ],
  [
   "Knowledge Bases§Bases de conocimiento",
   "Managed retrieval from connected data sources for Bedrock applications.§Recuperación gestionada de fuentes conectadas para aplicaciones de Bedrock.",
   "answer Bedrock questions using company documents§responder preguntas en Bedrock usando documentos de la empresa",
   "a Bedrock knowledge base returns a policy that was replaced yesterday. What needs updating?§la base devuelve una política reemplazada ayer. ¿Qué debe actualizarse?",
   "Update the source and synchronize the knowledge base content.§Actualizar la fuente y sincronizar el contenido de la base.",
   "Retrieved policy evidence depends on the version indexed in the knowledge base.§La evidencia recuperada depende de la versión indexada en la base.",
   "https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html"
  ],
  [
   "Guardrails§Guardrails",
   "Configurable checks for selected content and application policies in Bedrock.§Verificaciones configurables de contenido y políticas de aplicación en Bedrock.",
   "apply content-policy checks around Bedrock model interactions§aplicar controles de políticas de contenido a interacciones con modelos de Bedrock",
   "a Bedrock guardrail blocks prohibited content. Does that prove all remaining facts are correct?§un guardrail bloquea contenido prohibido. ¿Eso prueba que el resto de los datos es correcto?",
   "Keep factual evaluation as well as the configured content checks.§Mantener la evaluación factual además de los controles de contenido.",
   "Content-policy checks do not replace checking evidence and task quality.§Los controles de contenido no reemplazan la revisión de evidencia y calidad de la tarea.",
   "https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html"
  ],
  [
   "Bedrock Agents§Agentes de Bedrock",
   "Model-based orchestration that can use configured action groups and knowledge.§Orquestación con modelos que puede usar grupos de acciones y conocimiento configurados.",
   "orchestrate a Bedrock assistant with business action groups§orquestar un asistente de Bedrock con grupos de acciones de negocio",
   "an agent action group is described but its business operation never runs. What must be connected?§se describe un grupo de acciones, pero nunca se ejecuta la operación de negocio. ¿Qué falta conectar?",
   "Implement the action execution path or handle its return-of-control flow.§Implementar la ejecución de la acción o gestionar el flujo de devolución de control.",
   "An action description must be connected to an implementation or application handler.§La descripción de una acción debe conectarse con su implementación o manejador.",
   "https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html"
  ],
  [
   "IAM permissions§Permisos IAM",
   "AWS identity policies that control allowed Bedrock operations.§Políticas de identidad de AWS que controlan las operaciones permitidas en Bedrock.",
   "grant a backend limited access to required Bedrock operations§dar a un backend acceso limitado a las operaciones necesarias de Bedrock",
   "a backend receives AccessDenied from Bedrock. What should be reviewed first?§un backend recibe AccessDenied de Bedrock. ¿Qué debe revisarse primero?",
   "Review the calling identity and required resource permissions.§Revisar la identidad que llama y los permisos necesarios sobre los recursos.",
   "Authorization failures should be diagnosed through the relevant AWS identity and policy settings.§Los fallos de autorización se diagnostican revisando la identidad y las políticas correspondientes de AWS.",
   "https://docs.aws.amazon.com/bedrock/latest/userguide/security-iam.html"
  ]
 ],
 [
  [
   "Foundry project§Proyecto de Foundry",
   "A workspace for organizing a Microsoft Foundry application’s resources.§Un espacio para organizar los recursos de una aplicación de Microsoft Foundry.",
   "organize a team’s Foundry models and connected tools§organizar modelos de Foundry y herramientas conectadas del equipo",
   "the application points to the wrong Foundry project endpoint. What needs checking?§la aplicación apunta al endpoint de otro proyecto. ¿Qué debe revisarse?",
   "Verify the intended Foundry project endpoint and its configured connections.§Verificar el endpoint del proyecto correcto y sus conexiones configuradas.",
   "Project configuration identifies which application resources the integration can use.§La configuración del proyecto identifica los recursos que puede usar la integración.",
   "https://learn.microsoft.com/en-us/azure/foundry/what-is-foundry"
  ],
  [
   "Model deployment§Despliegue de modelo",
   "A configured model instance or deployment made available to a Foundry application.§Una instancia o despliegue de modelo configurado para una aplicación de Foundry.",
   "configure the model that a Foundry application will call§configurar el modelo que llamará una aplicación de Foundry",
   "a request uses a catalog label where the configured endpoint needs a deployment name. What should be used?§se usa una etiqueta del catálogo donde el endpoint espera el nombre del despliegue. ¿Qué corresponde usar?",
   "Use the model or deployment identifier required by that endpoint.§Usar el identificador de modelo o despliegue que requiere ese endpoint.",
   "The application must follow the identifier format expected by its configured service.§La aplicación debe usar el formato de identificador que espera el servicio configurado.",
   "https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/deploy-models-managed"
  ],
  [
   "Microsoft Entra identity§Identidad de Microsoft Entra",
   "Identity-based authentication and authorization for supported Azure resources.§Autenticación y autorización por identidad para recursos compatibles de Azure.",
   "authenticate an Azure-hosted backend without embedding a personal key§autenticar un backend en Azure sin incrustar una clave personal",
   "a managed identity authenticates but cannot access the model resource. What may be missing?§una identidad administrada autentica, pero no accede al recurso. ¿Qué puede faltar?",
   "Assign the required resource role to that managed identity.§Asignar a esa identidad el rol necesario sobre el recurso.",
   "Authentication identifies the caller; role assignments determine its allowed access.§La autenticación identifica al cliente; los roles determinan el acceso permitido.",
   "https://learn.microsoft.com/en-us/azure/ai-services/authentication"
  ],
  [
   "Azure AI Search§Azure AI Search",
   "An Azure service for indexing and retrieving searchable content.§Un servicio de Azure para indexar y recuperar contenido consultable.",
   "retrieve relevant company document passages for a Foundry assistant§recuperar fragmentos relevantes de documentos para un asistente de Foundry",
   "a Search-backed assistant retrieves documents from the wrong department. What boundary is needed?§el asistente recupera documentos de un departamento sin acceso autorizado. ¿Qué límite hace falta?",
   "Apply access-aware filters or authorization before exposing retrieved content.§Aplicar filtros de acceso o autorización antes de exponer el contenido recuperado.",
   "Search relevance does not by itself establish that a user may view a document.§La relevancia de búsqueda no demuestra que un usuario pueda ver el documento.",
   "https://learn.microsoft.com/en-us/azure/search/search-what-is-azure-search"
  ],
  [
   "Foundry evaluations§Evaluaciones de Foundry",
   "Measurements for assessing model or agent behavior and quality.§Mediciones para evaluar el comportamiento y calidad de modelos o agentes.",
   "measure the quality of a Foundry assistant before deployment§medir la calidad de un asistente de Foundry antes de desplegarlo",
   "a Foundry answer sounds fluent but is unsupported by its retrieved documents. What should be measured?§la respuesta suena fluida pero no tiene respaldo en los documentos. ¿Qué debe medirse?",
   "Evaluate grounding and relevance using representative test cases.§Evaluar fundamentación y relevancia con casos de prueba representativos.",
   "Quality evaluation should inspect evidence support, not just attractive wording.§La evaluación debe revisar el respaldo de la evidencia, no solo una redacción atractiva.",
   "https://learn.microsoft.com/en-us/azure/ai-foundry/how-to/develop/evaluate-sdk"
  ],
  [
   "Content Safety§Content Safety",
   "Services for detecting selected harmful content categories in an application.§Servicios para detectar determinadas categorías de contenido dañino en una aplicación.",
   "screen user-generated content in a Microsoft AI application§revisar contenido de usuarios en una aplicación de IA de Microsoft",
   "a Content Safety policy rejects a response. What should the application do?§una política de Content Safety rechaza una respuesta. ¿Qué debe hacer la aplicación?",
   "Handle the rejection and present an appropriate supported fallback.§Gestionar el rechazo y mostrar una alternativa adecuada y admitida.",
   "A policy result needs explicit application handling rather than an assumed successful answer.§El resultado de una política requiere manejo explícito, no suponer que hubo una respuesta exitosa.",
   "https://learn.microsoft.com/en-us/azure/ai-services/content-safety/overview"
  ]
 ],
 [
  [
   "Qwen checkpoints§Checkpoints de Qwen",
   "Published Qwen model parameters and configuration for compatible runtimes.§Parámetros y configuración de modelos Qwen publicados para entornos compatibles.",
   "select a specific Qwen model to load locally§elegir un modelo concreto de Qwen para cargar localmente",
   "a Qwen checkpoint fails in an older unsupported runtime. What should be checked?§un checkpoint falla en un entorno antiguo no compatible. ¿Qué hay que revisar?",
   "Use the checkpoint’s documented compatible runtime and configuration.§Usar el entorno y la configuración compatibles documentados para ese checkpoint.",
   "Model architecture and runtime support must match the checkpoint being loaded.§La arquitectura y el entorno deben ser compatibles con el checkpoint que se carga.",
   "https://qwen.readthedocs.io/en/latest/getting_started/quickstart.html"
  ],
  [
   "Qwen-VL§Qwen-VL",
   "The Qwen model family focused on visual and language understanding.§La familia Qwen orientada a comprensión visual y de lenguaje.",
   "ask a Qwen model about an image§preguntar a un modelo Qwen por una imagen",
   "a Qwen-VL integration passes image text instead of supported image inputs. What should change?§una integración envía texto sobre la imagen en vez de una entrada visual admitida. ¿Qué debe cambiar?",
   "Use the chosen Qwen-VL model’s documented image preprocessing and input format.§Usar el preprocesamiento y formato de imagen documentados del modelo Qwen-VL elegido.",
   "A vision model still needs its actual image input prepared correctly.§Un modelo de visión necesita que la entrada real de imagen esté preparada correctamente.",
   "https://github.com/QwenLM/Qwen2.5-VL"
  ],
  [
   "Qwen-Coder§Qwen-Coder",
   "Qwen models specialized for programming-related tasks.§Modelos Qwen especializados en tareas de programación.",
   "choose a Qwen family oriented toward code generation§elegir una familia de Qwen orientada a generar código",
   "Qwen-Coder proposes code that looks plausible. What should decide whether to use it?§Qwen-Coder propone código que parece válido. ¿Qué debe decidir si se usa?",
   "Run relevant tests and review the proposed code in its project context.§Ejecutar pruebas pertinentes y revisar el código en el contexto del proyecto.",
   "A coding specialization does not make generated patches automatically correct.§La especialización en código no vuelve automáticamente correctos los cambios generados.",
   "https://github.com/QwenLM/Qwen3-Coder"
  ],
  [
   "Qwen chat template§Plantilla de chat de Qwen",
   "The tokenizer-defined role and message formatting for a Qwen checkpoint.§El formato de roles y mensajes definido por el tokenizador de un checkpoint Qwen.",
   "format user and assistant turns for Qwen inference§dar formato a turnos del usuario y asistente para inferencia con Qwen",
   "a Qwen instruct model prints unexpected control tokens after custom manual formatting. What should be used?§un modelo imprime tokens de control inesperados tras un formato manual. ¿Qué debe usarse?",
   "Apply the exact checkpoint’s supported chat template.§Aplicar la plantilla de chat admitida por ese checkpoint concreto.",
   "The model’s chat format is part of its expected input interface.§El formato de chat del modelo forma parte de su interfaz de entrada esperada.",
   "https://qwen.readthedocs.io/en/latest/inference/transformers.html"
  ],
  [
   "Qwen quantization§Cuantización de Qwen",
   "Lower-precision Qwen weights that can reduce model memory requirements.§Pesos de Qwen de menor precisión que pueden reducir la memoria necesaria.",
   "load a smaller-memory representation of a Qwen checkpoint§cargar una representación de un checkpoint Qwen que use menos memoria",
   "a chosen Qwen quantization is unsupported by the serving engine. What must match?§la cuantización elegida no es compatible con el servidor. ¿Qué debe coincidir?",
   "Choose a weight format and quantization supported by that engine.§Elegir un formato de pesos y cuantización compatibles con ese servidor.",
   "Quantized artifacts and runtime support must be compatible.§Los archivos cuantizados deben ser compatibles con el entorno de ejecución.",
   "https://qwen.readthedocs.io/en/latest/quantization/llama_cpp.html"
  ],
  [
   "Qwen tool calling§Herramientas con Qwen",
   "Connecting Qwen-generated tool requests to implemented application functions.§Conectar solicitudes de herramientas de Qwen con funciones implementadas por la aplicación.",
   "let Qwen request a calendar lookup through your application§permitir que Qwen solicite una consulta de calendario en tu aplicación",
   "Qwen emits a calendar call with an invalid date. What should happen before execution?§Qwen genera una consulta con una fecha inválida. ¿Qué debe pasar antes de ejecutarla?",
   "Validate the date and reject or clarify invalid arguments.§Validar la fecha y rechazar o aclarar los argumentos inválidos.",
   "Generated function arguments still require application-side validation.§Los argumentos generados requieren validación de la aplicación.",
   "https://qwen.readthedocs.io/en/latest/framework/function_call.html"
  ]
 ],
 [
  [
   "DeepSeek base URL§URL base de DeepSeek",
   "The API host configured so a compatible SDK sends requests to DeepSeek.§El servidor de API configurado para que un SDK compatible envíe solicitudes a DeepSeek.",
   "point an OpenAI-compatible SDK at the DeepSeek service§dirigir un SDK compatible con OpenAI al servicio de DeepSeek",
   "the client still calls another provider after a DeepSeek model name is set. What is wrong?§el cliente sigue llamando a otro proveedor tras elegir un modelo de DeepSeek. ¿Qué está mal?",
   "Configure the DeepSeek base URL as well as its model and credential.§Configurar la URL base de DeepSeek además de su modelo y credencial.",
   "A model name alone does not change the server targeted by the SDK.§El nombre del modelo por sí solo no cambia el servidor al que apunta el SDK.",
   "https://api-docs.deepseek.com/"
  ],
  [
   "DeepSeek chat messages§Mensajes de chat de DeepSeek",
   "Role-based messages supplied to the DeepSeek chat completion interface.§Mensajes con roles enviados a la interfaz de chat de DeepSeek.",
   "provide user and assistant turns to DeepSeek chat§proporcionar turnos de usuario y asistente al chat de DeepSeek",
   "a second DeepSeek request refers to an earlier question but sends no history. What must be added?§una segunda solicitud se refiere a una pregunta anterior, pero no envía historial. ¿Qué debe agregarse?",
   "Send the relevant chronological conversation messages in the request.§Enviar los mensajes relevantes en orden cronológico dentro de la solicitud.",
   "The application controls which conversation turns are included in a chat request.§La aplicación controla qué turnos incluye en una solicitud de chat.",
   "https://api-docs.deepseek.com/guides/multi_round_chat"
  ],
  [
   "Thinking mode§Modo de razonamiento",
   "A supported DeepSeek request mode for additional reasoning on a task.§Un modo admitido de DeepSeek para dedicar razonamiento adicional a una tarea.",
   "configure a DeepSeek model’s supported reasoning behavior§configurar el comportamiento de razonamiento admitido por un modelo de DeepSeek",
   "a DeepSeek integration assumes an obsolete model alias controls all reasoning behavior. What should it check?§una integración supone que un alias antiguo controla todo el razonamiento. ¿Qué debe revisar?",
   "Use the current model’s documented thinking settings and supported parameters.§Usar las opciones de razonamiento y parámetros documentados del modelo actual.",
   "Model identifiers and reasoning controls can change; configure the documented interface rather than relying on an old alias.§Los identificadores y controles pueden cambiar; configurá la interfaz documentada en vez de depender de un alias antiguo.",
   "https://api-docs.deepseek.com/"
  ],
  [
   "DeepSeek streaming§Streaming de DeepSeek",
   "Incremental output from DeepSeek chat requests configured for streaming.§Salida progresiva de solicitudes de chat de DeepSeek configuradas con streaming.",
   "display DeepSeek text as response chunks arrive§mostrar texto de DeepSeek mientras llegan fragmentos de la respuesta",
   "the UI replaces earlier DeepSeek text with each new chunk. What should it do instead?§la interfaz reemplaza el texto anterior con cada fragmento. ¿Qué debería hacer?",
   "Accumulate content deltas until the stream completes.§Acumular los incrementos de contenido hasta que termine el stream.",
   "Streaming chunks are incremental pieces, not complete standalone answers.§Los fragmentos de streaming son partes incrementales, no respuestas completas independientes.",
   "https://api-docs.deepseek.com/"
  ],
  [
   "Token usage§Uso de tokens",
   "Provider-reported counts of input and output tokens in DeepSeek requests.§Conteos informados por DeepSeek de tokens de entrada y salida de las solicitudes.",
   "measure actual DeepSeek request token consumption§medir el consumo real de tokens de una solicitud de DeepSeek",
   "billing is estimated by counting visible words in the DeepSeek answer. What should replace that estimate?§se estima el consumo contando palabras visibles. ¿Qué debería reemplazar esa estimación?",
   "Use the provider’s returned usage counts and relevant pricing categories.§Usar los conteos de uso del proveedor y las categorías de precio correspondientes.",
   "Word counts are not the same as token usage, especially when other output categories apply.§Contar palabras no equivale al uso de tokens, especialmente si existen otras categorías de salida.",
   "https://api-docs.deepseek.com/quick_start/token_usage"
  ],
  [
   "DeepSeek context cache§Caché de contexto de DeepSeek",
   "Automatic reuse of eligible repeated request prefixes by the DeepSeek API.§Reutilización automática de prefijos repetidos elegibles en la API de DeepSeek.",
   "benefit from repeated DeepSeek prompt prefixes§aprovechar prefijos repetidos en prompts de DeepSeek",
   "a request expects a cache hit despite changing its entire prefix. What should be inspected?§se espera un acierto de caché pese a cambiar todo el prefijo. ¿Qué hay que inspeccionar?",
   "Check repeated prefix content and reported cache hit or miss usage.§Revisar el prefijo repetido y el uso informado de aciertos o fallos de caché.",
   "Cache reuse depends on eligible matching prefix content, not merely a similar topic.§La caché depende de prefijos elegibles coincidentes, no solo de un tema parecido.",
   "https://api-docs.deepseek.com/guides/kv_cache/"
  ]
 ],
 [
  [
   "Kimi API platform§Plataforma de API de Kimi",
   "Moonshot’s developer platform for integrating Kimi models into applications.§La plataforma de desarrollo de Moonshot para integrar modelos Kimi en aplicaciones.",
   "create a Kimi-backed application with authenticated API access§crear una aplicación con Kimi mediante acceso autenticado a su API",
   "a Kimi client uses a key from an unrelated provider. What should be configured?§un cliente usa una clave de otro proveedor. ¿Qué debe configurarse?",
   "Use a valid Kimi platform credential with the matching API endpoint.§Usar una credencial válida de la plataforma Kimi con el endpoint correspondiente.",
   "A compatible API shape does not make provider credentials interchangeable.§Que las APIs tengan formatos compatibles no vuelve intercambiables las credenciales.",
   "https://www.kimi.ai/help/kimi-api/api-overview"
  ],
  [
   "File parsing§Lectura de archivos",
   "Kimi API capabilities for obtaining usable content from supported files.§Capacidades de la API de Kimi para obtener contenido utilizable de archivos admitidos.",
   "ask Kimi about the contents of a supplied document§preguntar a Kimi por el contenido de un documento proporcionado",
   "a document filename is sent but its contents were never supplied. What is missing?§se envía el nombre del documento, pero nunca su contenido. ¿Qué falta?",
   "Upload or parse the document through a supported file workflow and supply its usable content.§Cargar o procesar el documento mediante un flujo admitido y proporcionar su contenido utilizable.",
   "A local path does not automatically make a file available to a remote Kimi request.§Una ruta local no vuelve automáticamente disponible un archivo para una solicitud remota a Kimi.",
   "https://www.kimi.ai/help/kimi-api/api-overview"
  ],
  [
   "Kimi tool calls§Llamadas a herramientas de Kimi",
   "Kimi requests to execute functions described by your application.§Solicitudes de Kimi para ejecutar funciones descritas por tu aplicación.",
   "connect Kimi to a custom search or database function§conectar Kimi con una función propia de búsqueda o base de datos",
   "Kimi emits several tool call IDs but the app returns one unlabeled result. What should be returned?§Kimi emite varios IDs de llamada, pero la app devuelve un resultado sin identificar. ¿Qué hay que devolver?",
   "Return each required tool result linked to its corresponding call ID.§Devolver cada resultado requerido vinculado a su ID de llamada correspondiente.",
   "Tool result linkage lets the next model step associate outputs with the correct requests.§Vincular resultados permite asociar cada salida con la solicitud correcta en el siguiente paso.",
   "https://github.com/MoonshotAI/Kimi-K2/blob/main/docs/tool_call_guidance.md"
  ],
  [
   "Context window budget§Presupuesto de contexto",
   "The supported token capacity available for a selected Kimi model’s request and response.§La capacidad de tokens admitida para la solicitud y respuesta del modelo Kimi elegido.",
   "fit a long Kimi document task within the chosen model’s limits§ajustar una tarea documental larga a los límites del modelo Kimi elegido",
   "input nearly fills the Kimi context window and output is still required. What should be planned?§la entrada casi llena el contexto y todavía se necesita una salida. ¿Qué debe planificarse?",
   "Estimate input size and reserve space for the response within the model limit.§Estimar el tamaño de entrada y reservar espacio para la respuesta dentro del límite.",
   "A large context window is finite and must accommodate the intended request and response.§Una ventana de contexto grande es finita y debe admitir la solicitud y respuesta previstas.",
   "https://www.kimi.ai/help/kimi-api/api-troubleshooting"
  ],
  [
   "Multi-turn conversation§Conversación de varios turnos",
   "Supplying the conversation turns needed for Kimi follow-up requests.§Proporcionar los turnos necesarios para las solicitudes posteriores a Kimi.",
   "let Kimi answer a follow-up about a previous message§permitir que Kimi responda una pregunta sobre un mensaje anterior",
   "the application sends private conversation history from another Kimi user. What boundary failed?§la aplicación envía el historial privado de otro usuario de Kimi. ¿Qué límite falló?",
   "Keep conversation state scoped to the authorized user or session.§Mantener el estado de conversación limitado al usuario o sesión autorizados.",
   "Conversation continuity must not mix separate users’ private message histories.§La continuidad de conversación no debe mezclar historiales privados de usuarios diferentes.",
   "https://www.kimi.ai/help/kimi-api/api-overview"
  ],
  [
   "Kimi model selection§Selección de modelo Kimi",
   "Choosing a supported Kimi model identifier and its documented capabilities.§Elegir un identificador de modelo Kimi admitido y sus capacidades documentadas.",
   "select a Kimi model that supports the required task and inputs§elegir un modelo Kimi compatible con la tarea y sus entradas",
   "a Kimi request uses an unavailable model ID copied from an old example. What is the right fix?§una solicitud usa un ID no disponible copiado de un ejemplo antiguo. ¿Cómo se corrige?",
   "Choose an available model ID from the current Kimi platform documentation.§Elegir un ID disponible de la documentación actual de la plataforma Kimi.",
   "Old examples are not a guarantee that a model remains available under the same identifier.§Un ejemplo antiguo no garantiza que un modelo siga disponible con el mismo identificador.",
   "https://www.kimi.ai/help/kimi-api/api-overview"
  ]
 ],
 [
  [
   "Provider adapters§Adaptadores de proveedor",
   "Application connectors that translate a shared interface to a provider-specific API.§Conectores que traducen una interfaz compartida a la API de cada proveedor.",
   "connect several AI vendors behind a common application interface§conectar varios proveedores de IA detrás de una interfaz común",
   "a vendor switch preserves syntax but changes supported capabilities. What needs testing?§un cambio de proveedor conserva la sintaxis, pero cambia las capacidades. ¿Qué hay que probar?",
   "Run compatibility tests against the new provider’s actual features.§Ejecutar pruebas de compatibilidad con las funciones reales del nuevo proveedor.",
   "A common interface does not eliminate provider-specific differences.§Una interfaz común no elimina las diferencias entre proveedores.",
   "https://ai-sdk.dev/docs/foundations/providers-and-models"
  ],
  [
   "Evidence citations§Citas de evidencia",
   "References linking an AI claim to supporting source material.§Referencias que vinculan una afirmación de IA con fuentes que la respaldan.",
   "let users inspect the source behind an AI claim§permitir que el usuario revise la fuente de una afirmación de IA",
   "an answer includes a real citation whose passage does not support the claim. What should be verified?§la respuesta tiene una cita real cuyo fragmento no respalda la afirmación. ¿Qué hay que verificar?",
   "Compare the specific cited passage with the associated claim.§Comparar el fragmento citado con la afirmación correspondiente.",
   "A citation’s existence is not enough; its contents must support the statement.§No alcanza con que exista una cita; su contenido debe respaldar la afirmación.",
   "https://learn.microsoft.com/en-us/azure/foundry/concepts/retrieval-augmented-generation"
  ],
  [
   "Input and output usage§Uso de entrada y salida",
   "Separate categories of tokens sent to and generated by a provider.§Categorías separadas de tokens enviados y generados por un proveedor.",
   "compare AI request costs with matching units§comparar costos de solicitudes de IA con unidades equivalentes",
   "two quotes use different per-million-token categories. How should they be compared?§dos cotizaciones usan categorías diferentes por millón de tokens. ¿Cómo se comparan?",
   "Align the input/output categories, units and applicable usage amounts.§Alinear las categorías de entrada/salida, unidades y cantidades de uso aplicables.",
   "Comparable pricing requires comparable units and token categories.§Comparar precios requiere unidades y categorías de tokens equivalentes.",
   "https://ai-sdk.dev/docs/ai-sdk-core/generating-text"
  ],
  [
   "User authorization§Autorización del usuario",
   "Application rules deciding what information and actions a user may access.§Reglas de la aplicación que determinan qué información y acciones puede usar un usuario.",
   "restrict an AI workflow to the caller’s permitted data§limitar un flujo de IA a los datos permitidos del usuario",
   "one model proposes sending another user’s document to a tool. What must be checked?§un modelo propone enviar el documento de otro usuario a una herramienta. ¿Qué debe comprobarse?",
   "Authorize the user’s access and the tool operation before exposing the data.§Autorizar el acceso del usuario y la operación antes de exponer los datos.",
   "A model’s request cannot substitute for the application’s permission checks.§Una solicitud del modelo no reemplaza los controles de permisos de la aplicación.",
   "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview"
  ],
  [
   "Evaluation set§Conjunto de evaluación",
   "Representative examples used to measure an assistant against stated criteria.§Ejemplos representativos para medir un asistente con criterios definidos.",
   "compare assistants on the same realistic tasks§comparar asistentes con las mismas tareas realistas",
   "one assistant was tuned on every evaluation example. What makes the comparison more useful?§un asistente se ajustó con todos los ejemplos de evaluación. ¿Qué mejora la comparación?",
   "Use additional held-out cases and consistent evaluation criteria.§Usar casos adicionales reservados y criterios consistentes de evaluación.",
   "Independent cases help reveal behavior beyond the examples used for tuning.§Los casos independientes revelan el comportamiento más allá de los ejemplos usados para ajustar.",
   "https://developers.openai.com/api/docs/guides/evals"
  ],
  [
   "Retrieval pipeline§Proceso de recuperación",
   "The steps that find relevant source passages for an AI response.§Los pasos que buscan fragmentos de fuentes relevantes para una respuesta de IA.",
   "supply relevant source evidence before generating an answer§proporcionar evidencia relevante antes de generar una respuesta",
   "the generator cannot answer because retrieval returned unrelated passages. Which stage needs inspection?§el generador no puede responder porque recibió fragmentos ajenos al tema. ¿Qué etapa hay que inspeccionar?",
   "Inspect document indexing, query retrieval and passage relevance.§Inspeccionar la indexación, la búsqueda y la relevancia de los fragmentos.",
   "Improving wording alone cannot fix missing or irrelevant retrieved evidence.§Mejorar la redacción no resuelve evidencia recuperada que falta o no es relevante.",
   "https://learn.microsoft.com/en-us/azure/foundry/concepts/retrieval-augmented-generation"
  ]
 ],
 [
  [
   "AI SDK§AI SDK",
   "Vercel’s TypeScript toolkit for building AI applications with multiple providers.§El conjunto de herramientas TypeScript de Vercel para crear aplicaciones de IA con varios proveedores.",
   "build an AI feature in a TypeScript application§crear una función de IA en una aplicación TypeScript",
   "the app treats AI SDK as if it were a hosted language model. What is the missing distinction?§la app trata AI SDK como si fuera un modelo de lenguaje alojado. ¿Qué distinción falta?",
   "Configure an actual model provider; AI SDK is the integration toolkit.§Configurar un proveedor real de modelos; AI SDK es el conjunto de herramientas de integración.",
   "The SDK coordinates requests but is not itself the model generating the answer.§El SDK coordina las solicitudes, pero no es el modelo que genera la respuesta.",
   "https://ai-sdk.dev/docs/introduction"
  ],
  [
   "Provider integration§Integración de proveedor",
   "An AI SDK adapter for configuring a particular model service.§Un adaptador de AI SDK para configurar un servicio concreto de modelos.",
   "connect an AI SDK app to a chosen model vendor§conectar una app de AI SDK con un proveedor elegido",
   "an AI SDK model configuration points to the wrong provider. What must be corrected?§la configuración del modelo apunta a otro proveedor. ¿Qué debe corregirse?",
   "Select the matching provider integration and its required model configuration.§Elegir la integración correspondiente y la configuración de modelo que requiere.",
   "A provider adapter identifies how the application reaches that model service.§El adaptador define cómo la aplicación accede a ese servicio de modelos.",
   "https://ai-sdk.dev/docs/foundations/providers-and-models"
  ],
  [
   "streamText§streamText",
   "An AI SDK function for generating text incrementally.§Una función de AI SDK para generar texto de forma progresiva.",
   "start delivering AI SDK text while generation continues§empezar a entregar texto con AI SDK mientras continúa la generación",
   "a backend uses streamText but the UI expects the chat message stream protocol. What response is needed?§el backend usa streamText, pero la interfaz espera el protocolo de mensajes de chat. ¿Qué respuesta necesita?",
   "Return the UI-message stream response expected by the client transport.§Devolver la respuesta de stream de mensajes de UI que espera el transporte del cliente.",
   "The server stream format must match the protocol consumed by the chat interface.§El formato del stream del servidor debe coincidir con el protocolo que consume la interfaz.",
   "https://ai-sdk.dev/docs/ai-sdk-ui/chatbot"
  ],
  [
   "useChat§useChat",
   "An AI SDK UI hook for managing a chat interface and its messages.§Un hook de AI SDK UI para gestionar una interfaz de chat y sus mensajes.",
   "manage chat messages and response state in a React UI§gestionar mensajes y estado de respuesta en una interfaz React",
   "useChat UI messages are passed to a model API without the expected conversion. What should be done?§se pasan mensajes de UI de useChat a una API sin la conversión requerida. ¿Qué corresponde hacer?",
   "Convert UI messages to model messages using the supported SDK conversion.§Convertir los mensajes de UI a mensajes de modelo con la conversión admitida del SDK.",
   "UI message parts and model input messages serve different interfaces.§Los mensajes de UI y los mensajes de entrada al modelo pertenecen a interfaces diferentes.",
   "https://ai-sdk.dev/docs/ai-sdk-ui/chatbot"
  ],
  [
   "Tool definitions§Definiciones de herramientas",
   "AI SDK descriptions and input schemas for functions an assistant can call.§Descripciones y esquemas de entrada de AI SDK para funciones que puede llamar un asistente.",
   "expose a typed weather tool to an AI SDK assistant§ofrecer una herramienta del clima con entradas tipadas a un asistente de AI SDK",
   "an AI SDK tool has a schema but never retrieves weather. What implementation is missing?§una herramienta tiene esquema, pero nunca consulta el clima. ¿Qué implementación falta?",
   "Provide its permitted execution handler or supported tool-result handling.§Proporcionar su manejador de ejecución permitido o el manejo admitido del resultado.",
   "A tool schema describes arguments; an execution path performs the real work.§El esquema describe argumentos; una vía de ejecución realiza el trabajo real.",
   "https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling"
  ],
  [
   "AI Gateway§AI Gateway",
   "Vercel’s unified gateway for accessing supported AI model providers.§El acceso unificado de Vercel a proveedores de modelos de IA compatibles.",
   "route model requests through Vercel’s unified AI gateway§dirigir solicitudes de modelos mediante el acceso unificado de Vercel",
   "a browser bundle exposes the app’s private AI Gateway credential. What should change?§el código público del navegador expone la credencial privada de AI Gateway. ¿Qué debe cambiar?",
   "Keep the private gateway credential in trusted server-side configuration.§Mantener la credencial privada del gateway en la configuración confiable del servidor.",
   "A gateway does not make a private server credential safe to publish in browser code.§Un gateway no vuelve seguro publicar una credencial privada en el código del navegador.",
   "https://vercel.com/docs/ai-gateway"
  ]
 ]
];
const curriculumNames=['OpenAI','Anthropic','Google','Meta','xAI','Amazon','Microsoft','Qwen','DeepSeek','Kimi','AI Alliance','Vercel'];
const pair=value=>value.split('§');
function register(en,es,zh){CURRICULUM_TRANSLATIONS[en]=es;if(typeof zh==='string'&&zh)CURRICULUM_CHINESE[en]=zh;return en;}
export function buildCurriculum(bank){return bank.map((entry,stage)=>{const name=curriculumNames[stage],topics=PROVIDER_TOPICS[stage],questions=[];for(const [i,level] of ['Easy','Medium','Hard'].entries())register(name+' '+level,name+' '+level,name+' '+['简单','中等','困难'][i]);
 for(const [difficulty,level] of ['easy','medium','hard'].entries())for(let index=0;index<topics.length;index++){const topic=topics[index],next=topics[(index+1)%topics.length],other=topics[(index+2)%topics.length],zh=CHINESE_TOPICS[stage][index],withChinese=(row,column)=>[...pair(row[column]),CHINESE_TOPICS[stage][topics.indexOf(row)][column]],title=[...pair(topic[0]),zh[0]],definition=[...pair(topic[1]),zh[1]],use=[...pair(topic[2]),zh[2]],problem=[...pair(topic[3]),zh[3]],fix=[...pair(topic[4]),zh[4]],detail=[...pair(topic[5]),zh[5]];
 const prompt=difficulty===0?['In '+name+', what is '+title[0]+'?','En '+name+', ¿qué es '+title[1]+'?','在 '+name+' 中，'+title[2]+'是什么？']:difficulty===1?['Your '+name+' app needs to '+use[0]+'. Which feature fits?','Tu aplicación de '+name+' necesita '+use[1]+'. ¿Qué función corresponde?','你的 '+name+' 应用需要'+use[2]+'。哪项功能适合？']:['In '+name+', '+problem[0],'En '+name+', '+problem[1],'在 '+name+' 中，'+problem[2]];
 const column=difficulty===0?1:difficulty===1?0:4,choices=[withChinese(topic,column),withChinese(next,column),withChinese(other,column)],answer=(stage+index+difficulty)%3;// Deterministic rotation keeps answer positions balanced.
 const ordered=Array.from({length:3},(_,i)=>choices[(i-answer+3)%3]);
 const explanation=difficulty===0?definition:difficulty===1?[definition[0]+' '+detail[0],definition[1]+' '+detail[1],definition[2]+detail[2]]:[fix[0]+' '+detail[0],fix[1]+' '+detail[1],fix[2]+detail[2]];
 const body=[definition[0]+' Use it to '+use[0]+'. '+detail[0],definition[1]+' Usalo para '+use[1]+'. '+detail[1],definition[2]+'可用于'+use[2]+'。'+detail[2]],exercise=['Explain a concrete '+name+' example using '+title[0]+'.','Explicá un ejemplo concreto de '+name+' que use '+title[1]+'.','举一个在 '+name+' 中使用'+title[2]+'的具体例子。'];
 questions.push({id:stage+'-expertise3-'+level+'-'+index,level,topic:register(...title),prompt:register(...prompt),options:ordered.map(o=>register(...o)),answer,explanation:register(...explanation),source:topic[6],lesson:{title:register(...title),body:register(...body),exercise:register(...exercise)}});
 }
 return {...entry,badgeName:name,questions};
});}
