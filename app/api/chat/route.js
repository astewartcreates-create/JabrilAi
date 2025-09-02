export async function POST(req) {
  try {
    // Parse incoming request
    const body = await req.json();
    console.log("Incoming payload:", body);

    const { sessionId, chatInput } = body;

    // Validate input
    if (!chatInput) {
      console.log("Missing chatInput");
      return new Response(JSON.stringify({ error: "Missing chatInput" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Prepare payload for n8n
    const payload = { sessionId, chatInput };
    console.log("Forwarding to n8n with payload:", payload);

    // Send to n8n webhook
    const response = await fetch("https://anthonyai.app.n8n.cloud/webhook/05754c4d-e148-446a-b787-67a81696d679/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const raw = await response.text();
    console.log("n8n raw response:", raw);

    // Try to parse JSON
    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      console.log("Failed to parse n8n response");
      return new Response(JSON.stringify({ error: "Invalid JSON from n8n", raw }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return successful response
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Route crashed:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}




