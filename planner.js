import { ChatGroq } from "@langchain/groq";
import { z } from "zod";
import 'dotenv/config';
const planSchema = z.object({
  steps: z.array(z.string()).describe("Detailed steps to answer the query")
});

export async function plannerNode(state) {
  const model = new ChatGroq({ 
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile" 
  }).withStructuredOutput(planSchema);

  const res = await model.invoke([
    ["system", "You are a strategic planner. Break the user's request into 3 logical search steps."],
    ["human", state.input]
  ]);

  return { plan: res.steps };
}