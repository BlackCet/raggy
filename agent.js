import { Annotation, StateGraph, START, END } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { Index } from "@upstash/vector";
import { z } from "zod";
import 'dotenv/config';


const index = new Index({ url: process.env.UPSTASH_VECTOR_REST_URL, token: process.env.UPSTASH_VECTOR_REST_TOKEN });
const model = new ChatGroq({ apiKey: process.env.GROQ_API_KEY, model: "llama-3.3-70b-versatile" });


const AgentState = Annotation.Root({
  input: Annotation(),
  plan: Annotation(),
  pastSteps: Annotation({ reducer: (x, y) => x.concat(y), default: () => [] }),
  response: Annotation(),
});


const plannerNode = async (state) => {
  const planSchema = z.object({ steps: z.array(z.string()) });
  const structuredModel = model.withStructuredOutput(planSchema);
  const res = await structuredModel.invoke(`Break this into 2 steps: ${state.input}`);
  return { plan: res.steps };
};


const executorNode = async (state) => {
  const step = state.plan[state.pastSteps.length];
  
  const results = await index.query({ data: step, topK: 1, includeData: true });
  const context = results[0]?.data || "No data found";
  return { pastSteps: [context] };
};


const synthesizerNode = async (state) => {
  const finalAns = await model.invoke(
    `Use the following context chunks to answer. 
     If you use information from a chunk, mention its source/page if available.
     
     Context: ${state.pastSteps.join("\n\n---\n\n")}
     
     User Question: ${state.input}`
  );
  return { response: finalAns.content };
};


const workflow = new StateGraph(AgentState)
  .addNode("planner", plannerNode)
  .addNode("executor", executorNode)
  .addNode("synthesizer", synthesizerNode)
  .addEdge(START, "planner")
  .addEdge("planner", "executor")
  .addConditionalEdges("executor", (s) => s.pastSteps.length < s.plan.length ? "executor" : "synthesizer")
  .addEdge("synthesizer", END);

export const agent = workflow.compile();