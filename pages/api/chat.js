export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { chatInput, sessionId } = req.body;

  // Call your n8n webhook or AI agent here
  const response = await fetch("https://your-n8n-instance.com/webhook/jabril", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatInput, sessionId })
  });

  const data = await response.json();
  res.status(200).json(data);
}
