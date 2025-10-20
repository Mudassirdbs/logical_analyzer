"use client";

import { useState, useEffect, useRef } from "react";
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
  const [error, setError] = useState<string | null>(null);
  // Speech-to-text state
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSpeech = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      setSpeechSupported(Boolean(hasSpeech));
    }
  }, []);

  const startListening = () => {
    if (!speechSupported || isListening) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "it-IT";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let interim = "";
      let finalChunk = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalChunk += transcript + " ";
        } else {
          interim += transcript;
        }
      }
      if (finalChunk) {
        setInputText((prev) => {
          const spaced = prev && !prev.endsWith(" ") ? prev + " " : prev;
          const combined = (spaced + finalChunk).trim();
          return combined.length > 500 ? combined.slice(0, 500) : combined;
        });
        if (error) setError(null);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };
    recognition.onend = () => {
      // Do not auto-restart to keep UX predictable
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    try {
      const analysis = await analyzeLogic(inputText);
      setResult(analysis);
    } catch (error) {
      console.error("Analysis error:", error);
      setError(error instanceof Error ? error.message : "Errore durante l'analisi");
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
        {/* Main Analysis Interface */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="sentence-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quale frase devo analizzare?
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    disabled={!speechSupported}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border transition-colors ${
                      isListening
                        ? "bg-red-600 border-red-700 text-white hover:bg-red-700"
                        : speechSupported
                          ? "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                          : "bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {/* mic icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                      <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z"/>
                      <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V21H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-3.08A7 7 0 0 0 19 11Z"/>
                    </svg>
                    {isListening ? "Ferma dettatura" : speechSupported ? "Dettatura" : "Non supportato"}
                  </button>
                </div>
              </div>
              {!speechSupported && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Il riconoscimento vocale non è supportato nel tuo browser. Prova con Chrome su desktop.
                </p>
              )}
              <textarea
                id="sentence-input"
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Inserisci la tua frase qui..."
                maxLength={500}
                className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Limite: 500 caratteri
                </span>
                <span className={`text-xs ${inputText.length > 450 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                  {inputText.length}/500
                </span>
              </div>
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

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-800 dark:text-red-200 text-sm">
                  <strong>Errore:</strong> {error}
                </p>
              </div>
            </div>
          )}

          {/* Example Sentences */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Frasi di Esempio</h3>
            <div className="flex flex-wrap gap-2">
              {exampleSentences.map((sentence, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputText(sentence);
                    if (error) setError(null);
                  }}
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
