import { Index } from "@upstash/vector";
import 'dotenv/config';

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

export async function executorNode(state) {
 
  const currentStep = state.plan[state.pastSteps.length];
  
  
  const results = await index.query({
    data: currentStep,
    topK: 1,
    includeData: true, 
  });

  const context = results[0]?.data || "No information found for this step.";
  
    return { pastSteps: [context] };
}