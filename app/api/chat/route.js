import { createJabrilAgent } from "@/lib/agents/jabrilAgent";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { input, sessionId } = req.body;

  console.log("Incoming request:", { input, sessionId });

  if (!input || !sessionId) {
    console.log("Missing input or sessionId");
    return res.status(400).json({ error: "Missing input or sessionId" });
  }

  try {
    const jabrilAgent = createJabrilAgent();

    const response = await jabrilAgent.call({ input });

    console.log("Agent response:", response);

    res.status(200).json({
      output: response.response,
      sessionId,
    });
  } catch (error) {
    console.error("Jabril agent error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}