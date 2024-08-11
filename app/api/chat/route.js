// app/api/chat/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { input } = await request.json();

  try {
    // Simulated response from a Gemini-like API
    const response = await queryGemini(input);
    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/chat:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Simulated function for querying the Gemini API
const queryGemini = async (input) => {
  // Replace this with actual API call
  return `You asked: "${input}". This is a simulated response.`;
};
