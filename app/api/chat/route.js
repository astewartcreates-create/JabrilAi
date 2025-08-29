import { NextResponse } from 'next/server';

const N8N_WEBHOOK_URL = "https://anthonyai.app.n8n.cloud/webhook/e4cf1ab3-8708-404a-8e69-62d12f837506/chat";

export async function POST(request) {
  try {
    const bodyPayload = await request.json();

    console.log("Incoming request to Jabril route:", bodyPayload);

    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyPayload),
    });

    const rawText = await res.text();
    console.log("n8n raw response:", rawText);

    if (!res.ok) {
      return NextResponse.json(
        {
          error: `n8n webhook error: ${res.status} ${res.statusText}`,
          details: rawText,
        },
        { status: res.status }
      );
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON returned from n8n", raw: rawText },
        { status: 500 }
      );
    }

    const reply = data.reply || data.output?.reply || data.output || rawText;
    const history = data.history || data.output?.history || [];

    return NextResponse.json({ reply, history });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}





