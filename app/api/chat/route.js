export async function POST(req) {
  const body = await req.json();
  const { sessionId, chatInput } = body;

  if (!chatInput) {
    return new Response(JSON.stringify({ error: 'Missing chatInput' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch('https://antoniayii.app.n8n.cloud/webhook/4cfa1b3-8708-404a-8e69-8621d82359ce/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId, chatInput }),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error forwarding to n8n:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}





