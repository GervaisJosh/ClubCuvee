// src/utils/embeddingService.ts

import { OpenAI } from "openai";

// Initialize the OpenAI client with your API key.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your environment
});

/**
 * Retrieves a 768-dimensional embedding for a given text summary.
 *
 * @param text - The text summary to be embedded.
 * @returns A Promise that resolves to an array of numbers representing the embedding.
 */
export async function getOpenAIEmbedding(text: string): Promise<number[]> {
  if (!text || text.trim().length === 0) {
    throw new Error("Input text for embedding is empty.");
  }

  try {
    // Call the OpenAI Embeddings API using the updated client interface.
    // In OpenAI Node.js client v4, the response is returned as an array of embedding objects.
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    // Since the response is an array, check the first element for the embedding.
    if (Array.isArray(response) && response.length > 0 && response[0].embedding) {
      return response[0].embedding;
    } else {
      throw new Error("No embedding data returned from OpenAI API.");
    }
  } catch (error: any) {
    console.error("Error obtaining embedding from OpenAI:", error.message);
    throw error;
  }
}
