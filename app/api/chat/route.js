// /app/api/chat/route.js

import { NextResponse } from 'next/server';
import { createJabrilAgent } from '@/lib/agents/Jabril'; // Make sure this path matches your project structure

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages, sessionId } = body;

    // Validate messages array
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Missing or invalid messages array' },
        { status: 400 }
      );
    }

    // Extract last user message
    const lastUserMessage = messages[messages.length - 1];
    if (
      !lastUserMessage ||
      lastUserMessage.role !== 'user' ||
      typeof lastUserMessage.text !== 'string' ||
      !lastUserMessage.text.trim()
    ) {
      return NextResponse.json(
        { error: 'Missing or invalid user message' },
        { status: 400 }
      );
    }

    const chatInput = lastUserMessage.text.trim();

    // Create the Jabril agent
    const agent = createJabrilAgent();

    // Call the agent with the input
    const result = await agent.call({ input: chatInput });

    // Return the response
    return NextResponse.json({ reply: result?.response || result }, { status: 200 });
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
