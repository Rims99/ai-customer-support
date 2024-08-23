import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { TextServiceClient } from '@google-ai/generativelanguage'; // Correct import for the Google API
import fetch from 'node-fetch';

// Set global fetch to node-fetch
global.fetch = fetch;

const systemPrompt = `
You are a rate my professor agent to help students find classes, that takes in user questions and answers them.
For every user question, the top 3 professors that match the user question are returned.
Use them to answer the question if needed.
`;

export async function POST(req) {
  const data = await req.json();

  // Initialize Pinecone client
  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  const index = pc.index('rag').namespace('ns1');

  // Initialize the Google Generative Language client
  const client = new TextServiceClient();

  // Extract the text from the request
  const text = data.prompt; // Assuming you send a prompt in the request body

  // Generate text embedding
  const embeddingResponse = await client.embedText({
    contents: [{ text }],
    model: 'text-embedding-3-small',
  });

  const embedding = embeddingResponse.embeddings[0].embedding;

  // Query Pinecone index
  const results = await index.query({
    topK: 5,
    includeMetadata: true,
    vector: embedding,
  });

  // Prepare the result string
  let resultString = '';
  results.matches.forEach((match) => {
    resultString += `
    Returned Results:
    Professor: ${match.id}
    Review: ${match.metadata.review}
    Subject: ${match.metadata.subject}
    Stars: ${match.metadata.stars}
    \n\n`;
  });

  // Prepare the last message content
  const lastMessageContent = text + resultString;

  // Create a completion request
  const completionResponse = await client.generateText({
    model: 'text-bison-001', // Ensure this model is compatible with Gemini
    prompt: lastMessageContent,
    temperature: 0.7,
    maxOutputTokens: 150,
    topP: 0.95,
    topK: 40,
  });

  // Return the generated response
  return NextResponse.json({ response: completionResponse });
}
