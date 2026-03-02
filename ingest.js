import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { Index } from "@upstash/vector";
import 'dotenv/config';

const index = new Index({ 
  url: process.env.UPSTASH_VECTOR_REST_URL, 
  token: process.env.UPSTASH_VECTOR_REST_TOKEN 
});

async function ingestPDF(filePath) {
  try {
    console.log("Reading PDF...");
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.splitDocuments(docs);
    console.log(`Split into ${chunks.length} chunks. Batch uploading to Upstash...`);

    
    const batchSize = 10;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize).map((chunk, index) => ({
        id: `chunk-${i + index}`,
        data: chunk.pageContent,
        metadata: { 
            source: filePath, 
            page: chunk.metadata.loc?.pageNumber || "unknown" 
        }
      }));

      await index.upsert(batch);
      console.log(`Uploaded chunks ${i} to ${Math.min(i + batchSize, chunks.length)}...`);
    }

    console.log("✅ Ingestion Complete! Your Cloud Memory is full.");
  } catch (error) {
    console.error("❌ Ingestion Failed:", error);
  }
}

ingestPDF("./docs/ch1.pdf");