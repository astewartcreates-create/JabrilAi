// /lib/agents/Jabril.js

import { ChatOpenAI } from '@langchain/openai';
import { BufferMemory } from '@langchain/core/memory';
import { PromptTemplate } from '@langchain/core/prompts';

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

export const createJabrilAgent = () => {
  const model = new ChatOpenAI({
    temperature: 0.7,
    modelName: 'gpt-4', // or 'gpt-3.5-turbo' depending on your setup
  });

  const memory = new BufferMemory({
    returnMessages: true,
    memoryKey: 'history',
  });

  return new ConversationChain({
    llm: model,
    prompt: jabrilPrompt,
    memory,
  });
};