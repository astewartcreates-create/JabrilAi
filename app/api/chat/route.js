import { NextResponse } from "next/server";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

export async function POST(req) {
  try {
    if (!N8N_WEBHOOK_URL) {
      return NextResponse.json(
        { error: "N8N_WEBHOOK_URL is not configured in env" },
        { status: 500 }
      );
    }

    const { messages, sessionId } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "'messages' must be a non-empty array" },
        { status: 400 }
      );
    }

    // Send messages as chatInput — n8n expects that key
    const bodyPayload = {
      chatInput: messages,
      sessionId,
    };

    const res = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyPayload),
    });

    const text = await res.text();
    console.log("n8n raw response:", text);

    if (!res.ok) {
      return NextResponse.json(
        { error: `n8n webhook error: ${res.status} ${res.statusText}`, details: text },
        { status: res.status }
      );
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON returned from n8n", raw: text },
        { status: 500 }
      );
    }

    // Return the reply, fallback to raw data string if no reply found
    return NextResponse.json({
      reply: data.reply || data.answer || JSON.stringify(data),
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}





