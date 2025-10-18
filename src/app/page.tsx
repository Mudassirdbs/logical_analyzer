"use client";

import { useState } from "react";
import { analyzeLogic } from "./logic-analysis";

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

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeLogic(inputText);
      setResult(analysis);
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const exampleSentences = [
    "The student reads books in the library",
    "She gave him a beautiful gift yesterday",
    "Located in East Asia, China shares borders with 14 nations, including India, Russia, and Vietnam",
    "The teacher is explaining the lesson clearly to the students",
    "With a history spanning over 5000 years, China has played a major role in shaping world civilization"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Logical Analysis
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Free and Fast Online Logic Analysis
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Enter an English sentence below to perform automatic logical analysis
          </p>
        </div>

        {/* Main Analysis Interface */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="mb-4">
              <label htmlFor="sentence-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Which sentence should I analyze?
              </label>
              <textarea
                id="sentence-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your sentence here..."
                className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!inputText.trim() || isAnalyzing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                "Analyze Sentence"
              )}
            </button>
          </div>

          {/* Example Sentences */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Example Sentences</h3>
            <div className="flex flex-wrap gap-2">
              {exampleSentences.map((sentence, index) => (
                <button
                  key={index}
                  onClick={() => setInputText(sentence)}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm transition-colors duration-200"
                >
                  {sentence}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Logical Analysis</h2>

              {/* Sentence Display */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Logical analysis of the sentence:
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500">
                  <p className="text-gray-800 dark:text-gray-200 font-medium">&quot;{result.sentence}&quot;</p>
                </div>
              </div>

              {/* Word-by-Word Analysis */}
              <div className="space-y-3">
                {result.wordAnalysis.map((analysis, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-start gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="font-semibold text-gray-800 dark:text-gray-200 min-w-[100px] sm:min-w-[120px]">
                      {analysis.word}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-blue-600 dark:text-blue-400 mb-1">
                        {analysis.type}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {analysis.definition}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Analysis Summary */}
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-sm font-medium text-purple-800 dark:text-purple-200">Sentence Type</div>
                  <div className="text-purple-900 dark:text-purple-100 font-semibold capitalize">{result.sentenceType}</div>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-sm font-medium text-orange-800 dark:text-orange-200">Analysis Confidence</div>
                  <div className="text-orange-900 dark:text-orange-100 font-semibold">{(result.confidence * 100).toFixed(1)}%</div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-400">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> Because it is processed automatically, the online logic analysis tool is prone to errors.
                  This analysis is provided for educational purposes and may not be 100% accurate.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
