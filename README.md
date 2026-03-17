# Agentic RAG Document Assistant 🧠

An intelligent, stateful Retrieval-Augmented Generation (RAG) system built with LangGraph and Upstash. This isn't just a basic chatbot—it utilizes a "Plan-and-Execute" architecture to break down complex queries, retrieve highly specific context from ingested documents, and synthesize answers with precise source citations.

## 🚀 Features

* **Agentic Workflow:** Uses LangGraph to orchestrate a multi-step reasoning process (Planner → Executor → Synthesizer).
* **Serverless Vector Memory:** Integrates Upstash Vector for lightning-fast, zero-maintenance cloud document retrieval.
* **Source Grounding:** Enforces strict LLM citations, linking generated answers directly to specific document page numbers to eliminate hallucinations.
* **Full-Stack Implementation:** A seamless bridge between a custom Node.js/Express backend and a responsive React frontend.
* **PDF Ingestion Pipeline:** Automated parsing, chunking (`RecursiveCharacterTextSplitter`), and embedding generation for large documents.

## 🛠️ Tech Stack

* **Orchestration:** LangGraph, LangChain
* **LLM Inference:** Llama 3 (via Groq for ultra-low latency)
* **Vector Database:** Upstash Vector
* **Backend:** Node.js, Express
* **Frontend:** React, Next.js
* **Document Processing:** pdf-parse

## 🏗️ System Architecture

1. **Ingestion:** A PDF is loaded, chunked, and embedded into Upstash Vector.
2. **Planning:** User query hits the `PlannerNode`, which breaks the question into actionable search steps.
3. **Execution:** The `ExecutorNode` queries Upstash for each step, retrieving text chunks and metadata (page numbers).
4. **Synthesis:** The `SynthesizerNode` compiles the context and generates a final response with strict source citations.

## ⚙️ Local Setup

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/agentic-rag-bot.git
cd agentic-rag-bot
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Variables
Create a `.env` file in the root directory and add your API keys:
\`\`\`env
GROQ_API_KEY=your_groq_api_key
UPSTASH_VECTOR_REST_URL=your_upstash_url
UPSTASH_VECTOR_REST_TOKEN=your_upstash_token
\`\`\`

### 4. Ingest Data
Place your target PDF in the root directory (e.g., `data.pdf`) and run the ingestion script to populate your Upstash index:
\`\`\`bash
node ingest.js
\`\`\`

### 5. Run the Application
Start the development server:
\`\`\`bash
npm run dev
\`\`\`
The frontend will be available at `http://localhost:3000`.


## 🔮 Future Improvements
* Build an admin dashboard to visualize and manage Upstash vector clusters.
* Add session memory so the agent remembers context across multiple chat turns.
* Implement a hybrid search (Keyword + Vector) for even higher retrieval accuracy.
