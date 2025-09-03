// /app/api/chat/route.js

import { createJabrilAgent } from '@/lib/agents/Jabril';

export async function POST(req) {
  try {
    const body = await req.json();
    const userInput = body.input?.trim();

    if (!userInput) {
      return new Response(JSON.stringify({ error: 'Missing input' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const agent = createJabrilAgent();
    const response = await agent.call({ input: userInput });

    return new Response(JSON.stringify({ output: response.response }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Agent error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
