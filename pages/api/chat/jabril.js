// pages/api/chat/jabril.js

export default async function handler(req, res) {
  console.log("✅ Route hit");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.status(200).json({
    output: "Hello from Jabril route",
    sessionId: "test123"
  });
}