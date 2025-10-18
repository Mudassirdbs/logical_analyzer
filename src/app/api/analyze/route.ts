import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI on the server side
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;
    
    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `
    Perform a detailed logical analysis of this English sentence: "${text}"
    
    Analyze each word/phrase and provide a JSON response with this exact structure:
    {
      "sentence": "${text}",
      "wordAnalysis": [
        {
          "word": "specific word or phrase",
          "type": "GRAMMATICAL FUNCTION",
          "definition": "detailed definition explaining the grammatical function"
        }
      ],
      "sentenceType": "simple|compound|complex",
      "confidence": 0.95
    }
    
    For each word/phrase, identify its grammatical function:
    - SUBJECT: The person, animal, or thing that performs or undergoes the action
    - VERBAL PREDICATE: The action performed or undergone by the subject
    - DIRECT OBJECT: The noun or pronoun that receives the action of the verb directly
    - INDIRECT OBJECT: The noun or pronoun that receives the direct object or benefits from the action
    - SUBJECT COMPLEMENT: A word or phrase that follows a linking verb and describes or renames the subject
    - OBJECT COMPLEMENT: A word or phrase that follows and modifies the direct object
    - PREPOSITIONAL PHRASE: A phrase that begins with a preposition and ends with a noun or pronoun
    - ADVERBIAL PHRASE: A phrase that modifies a verb, adjective, or adverb
    - ADJECTIVAL PHRASE: A phrase that modifies a noun or pronoun
    - APPOSITIVE: A noun or noun phrase that renames or explains another noun
    - PARTICIPLE PHRASE: A phrase that begins with a participle and modifies a noun
    - GERUND PHRASE: A phrase that begins with a gerund and functions as a noun
    - INFINITIVE PHRASE: A phrase that begins with an infinitive
    - ABSOLUTE PHRASE: A phrase that modifies the entire sentence
    - NOUN CLAUSE: A clause that functions as a noun
    - ADJECTIVE CLAUSE: A clause that modifies a noun or pronoun
    - ADVERB CLAUSE: A clause that modifies a verb, adjective, or adverb
    - ARTICLE: A word that specifies a noun
    - ADJECTIVE: A word that modifies a noun or pronoun
    - ADVERB: A word that modifies a verb, adjective, or adverb
    - CONJUNCTION: A word that connects words, phrases, or clauses
    - PREPOSITION: A word that shows the relationship between a noun/pronoun and other words
    - PRONOUN: A word that takes the place of a noun
    - DETERMINER: A word that introduces a noun
    
    Provide detailed definitions for each grammatical function. Be educational and precise.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    // Extract JSON from markdown code blocks if present
    let jsonText = responseText;
    if (responseText.includes('```json')) {
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }
    } else if (responseText.includes('```')) {
      const jsonMatch = responseText.match(/```\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }
    }
    
    const analysis = JSON.parse(jsonText);
    
    return NextResponse.json(analysis);
    
  } catch (error) {
    console.error('Analysis API error:', error);
    
    // Return a fallback response if AI fails
    const fallbackAnalysis = {
      sentence: 'Unable to analyze',
      wordAnalysis: [{
        word: 'Analysis Error',
        type: 'ERROR',
        definition: 'Unable to analyze sentence due to server error. Please try again.'
      }],
      sentenceType: 'simple',
      confidence: 0.1
    };
    
    return NextResponse.json(fallbackAnalysis);
  }
}
