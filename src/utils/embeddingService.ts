// embeddingService.ts
import { OpenAI } from "openai";

// Initialize the OpenAI client with your API key.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your environment
});

/**
 * Retrieves a 1536-dimensional embedding for a given text summary.
 *
 * @param text - The text summary to be embedded.
 * @returns A Promise that resolves to an array of numbers representing the embedding.
 */
export async function getOpenAIEmbedding(text: string): Promise<number[]> {
  if (!text || text.trim().length === 0) {
    throw new Error("Input text for embedding is empty.");
  }

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002", // Use the ada-002 model
      input: text,
    });

    // Access the embedding from the response's data property.
    if (response.data && response.data.length > 0 && response.data[0].embedding) {
      return response.data[0].embedding;
    } else {
      throw new Error("No embedding data returned from OpenAI API.");
    }
  } catch (error: any) {
    console.error("Error obtaining embedding from OpenAI:", error.message);
    throw error;
  }
}
