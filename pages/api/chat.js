import { agent } from "../../agent.js";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    const { message } = req.body;
  
    const result = await agent.invoke({ input: message });

    return res.status(200).json({ 
      response: result.response,
      plan: result.plan 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Agent failed to think." });
  }
}