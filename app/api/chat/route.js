import { NextResponse } from 'next/server';

// Optional: import your assistant logic here
// import { runJabrilAgent } from '@/lib/agents/jabril'; // adjust path as needed

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

    // 🔮 Replace this with your actual assistant logic
    const reply = await runJabrilAgent(chatInput, {
      sessionId,
      history: messages,
    });

    return NextResponse.json({ reply }, { status: 200 });
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
