import { Pinecone } from '@pinecone-database/pinecone';

// Initialize the Pinecone client
const pinecone = new Pinecone({
  apiKey: import.meta.env.VITE_PINECONE_API_KEY!, 
});

export default pinecone;
