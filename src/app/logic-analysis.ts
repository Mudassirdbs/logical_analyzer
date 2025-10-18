// English Logic Analysis Engine
// Frontend client that calls the server-side API

interface AnalysisResult {
  sentence: string;
  wordAnalysis: Array<{
    word: string;
    type: string;
    definition: string;
  }>;
  sentenceType: string;
  confidence: number;
}

// Main analysis function that calls our API endpoint
export async function analyzeLogic(text: string): Promise<AnalysisResult> {
  if (!text.trim()) {
    return {
      sentence: 'No input provided',
      wordAnalysis: [],
      sentenceType: 'simple',
      confidence: 0
    };
  }
  
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const analysis = await response.json();
    return analysis;
    
  } catch (error) {
    console.error('Analysis API call failed:', error);
    
    // Return a fallback response if API fails
    return {
      sentence: text,
      wordAnalysis: [{
        word: text,
        type: 'ERROR',
        definition: 'Unable to analyze sentence due to server error. Please try again.'
      }],
      sentenceType: 'simple',
      confidence: 0.1
    };
  }
}
