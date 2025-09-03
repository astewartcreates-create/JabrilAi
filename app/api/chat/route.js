// /app/api/chat/route.js

export async function POST(req) {
  const { ChatOpenAI } = await import('@langchain/openai');
  const { BufferMemory } = await import('@langchain/core/memory');
  const { PromptTemplate } = await import('@langchain/core/prompts');
  const { ConversationChain } = await import('@langchain/core/chains');

  const body = await req.json();
  const userInput = body.input || '';

  const jabrilPrompt = PromptTemplate.fromTemplate(`
You are Jabril, an AI assistant for the Black Civilization Research Archive.
You speak with cultural awareness, clarity, and warmth.
Answer questions with historical depth and relevance.
If the question is unclear, ask for clarification.

Chat History:
{history}

User: {input}
Jabril:
  `);

  const model = new ChatOpenAI({
    temperature: 0.7,
    modelName: 'gpt-4',
  });

  const memory = new BufferMemory({
    returnMessages: true,
    memoryKey: 'history',
  });

  const chain = new ConversationChain({
    llm: model,
    prompt: jabrilPrompt,
    memory,
  });

  const response = await chain.call({ input: userInput });

  return new Response(JSON.stringify({ output: response.response }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
