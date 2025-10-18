"use client";

import { useState } from "react";
import { analyzeLogic } from "./logic-analysis";
import { getAllComplements, type ComplementInfo } from "./complement-reference";

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
  const [showReference, setShowReference] = useState(false);

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
    "Il bambino gioca nel parco",
    "Maria legge un libro interessante",
    "Gli studenti studiano per l'esame",
    "Il gatto dorme sul divano",
    "Noi mangiamo la pizza insieme"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Analisi Logica
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Analisi Logica Gratuita e Veloce Online
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Inserisci una frase italiana qui sotto per eseguire l&apos;analisi logica automatica
          </p>
        </div>

        {/* Main Analysis Interface */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="mb-4">
              <label htmlFor="sentence-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quale frase devo analizzare?
              </label>
              <textarea
                id="sentence-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Inserisci la tua frase qui..."
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
                  Analizzando...
                </>
              ) : (
                "Analizza Frase"
              )}
            </button>
          </div>

          {/* Example Sentences */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Frasi di Esempio</h3>
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
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Analisi Logica</h2>

              {/* Sentence Display */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Analisi logica della frase:
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
                  <div className="text-sm font-medium text-purple-800 dark:text-purple-200">Tipo di Frase</div>
                  <div className="text-purple-900 dark:text-purple-100 font-semibold capitalize">{result.sentenceType}</div>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-sm font-medium text-orange-800 dark:text-orange-200">Affidabilità Analisi</div>
                  <div className="text-orange-900 dark:text-orange-100 font-semibold">{(result.confidence * 100).toFixed(1)}%</div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-400">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Nota:</strong> Poiché viene elaborata automaticamente, lo strumento di analisi logica online è soggetto a errori.
                  Questa analisi è fornita a scopo educativo e potrebbe non essere accurata al 100%.
                </p>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Cos&apos;è l&apos;Analisi Logica?</h3>
              <button
                onClick={() => setShowReference(!showReference)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors duration-200"
              >
                {showReference ? 'Nascondi Riferimento' : 'Mostra Riferimento Complementi'}
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              L&apos;analisi logica consiste nel trovare il soggetto, il predicato e i vari complementi di una frase.
              Questo strumento utilizza librerie NLP avanzate e AI per identificare automaticamente questi elementi grammaticali e aiutarti a comprendere la struttura delle frasi italiane.
            </p>

            {showReference && (
              <div className="mt-6">
                <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-4">Riferimento Completo dei Complementi</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {getAllComplements().map((complement: ComplementInfo, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-sm font-medium text-gray-800 dark:text-white mb-1">
                        {complement.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                        {complement.definition}
                      </div>
                      {complement.prepositions && complement.prepositions.length > 0 && (
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          Preposizioni: {complement.prepositions.join(', ')}
                        </div>
                      )}
                      {complement.examples && complement.examples.length > 0 && (
                        <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                          Esempio: {complement.examples[0]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
