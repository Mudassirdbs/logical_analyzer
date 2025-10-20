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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed: ${response.status}`);
    }

    const analysis = await response.json();
    return analysis;

  } catch (error) {
    console.error('Analysis API call failed:', error);

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
