import { StateGraph, START, END } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { AgentState } from "./state.js";
import { plannerNode } from "./planner.js";
import { executorNode } from "./executor.js";
import 'dotenv/config';

const model = new ChatGroq({ 
  apiKey: process.env.GROQ_API_KEY, 
  model: "llama-3.3-70b-versatile" 
});


const synthesizerNode = async (state) => {
  const finalAns = await model.invoke(
    `Use the following context chunks to answer. 
     If you use information from a chunk, mention its source/page if available.
     
     Context: ${state.pastSteps.join("\n\n---\n\n")}
     
     User Question: ${state.input}`
  );
  return { response: finalAns.content };
};

const shouldContinue = (state) => {
  if (state.pastSteps.length < state.plan.length) {
    return "execute";
  }
  return "synthesize";
};

const workflow = new StateGraph(AgentState)
  .addNode("planner", plannerNode)
  .addNode("executor", executorNode)
  .addNode("synthesize", synthesizerNode) 
  .addEdge(START, "planner")
  .addEdge("planner", "executor")
  .addConditionalEdges("executor", shouldContinue, {
    execute: "executor",
    synthesize: "synthesize",
  })
  .addEdge("synthesize", END);

const app = workflow.compile();

console.log("--- Agent is Thinking ---");
const result = await app.invoke({ 
  input: "What registers do I need to configure to use a high-priority edge-triggered External Interrupt 0?" 
});

console.log("\nFINAL ANSWER:\n", result.response);