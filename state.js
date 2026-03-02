import { Annotation } from "@langchain/langgraph";

export const AgentState = Annotation.Root({
  input: Annotation(),        
  plan: Annotation(),         
  pastSteps: Annotation({     
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  response: Annotation(),     
});