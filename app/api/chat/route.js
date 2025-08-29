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

    // Convert array of messages to a single string with role labels
    const chatInput = messages
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const bodyPayload = {
      chatInput,
      sessionId,
    };

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

    // Ensure the response has a usable reply
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





