"use client";

import { useState, useEffect, useRef } from "react";
import { analyzeLogic } from "./logic-analysis";

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

interface SpeechRecognitionEventResult {
  0: { transcript: string };
  isFinal: boolean;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionEventResult[];
}

interface ISpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionConstructor = new () => ISpeechRecognition;

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

interface ThemeColors {
  textColor: string;
  backgroundColor: string;
  linkColor: string;
  borderColor: string;
  buttonColor?: string;
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const [interimText, setInterimText] = useState("");
  const [theme, setTheme] = useState<ThemeColors | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSpeech = window.SpeechRecognition || window.webkitSpeechRecognition;
      setSpeechSupported(Boolean(hasSpeech));
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'wp-theme' && event.data.colors) {
        setTheme(event.data.colors);
        
        const root = document.documentElement;
        root.style.setProperty('--wp-text-color', event.data.colors.textColor);
        root.style.setProperty('--wp-bg-color', event.data.colors.backgroundColor);
        root.style.setProperty('--wp-link-color', event.data.colors.linkColor);
        root.style.setProperty('--wp-border-color', event.data.colors.borderColor);
        if (event.data.colors.buttonColor) {
          root.style.setProperty('--wp-button-color', event.data.colors.buttonColor);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let lastHeight = 0;
    let throttleTimeout: NodeJS.Timeout | null = null;

    const sendHeightToParent = () => {
      if (window.parent && window.parent !== window) {
        const height = document.documentElement.scrollHeight;
        if (Math.abs(height - lastHeight) > 20) {
          window.parent.postMessage({ height }, '*');
          lastHeight = height;
        }
      }
    };

    const throttledSendHeight = () => {
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
      throttleTimeout = setTimeout(sendHeightToParent, 300);
    };

    sendHeightToParent();
    
    const observer = new ResizeObserver(throttledSendHeight);
    const targetElement = document.body;
    if (targetElement) {
      observer.observe(targetElement);
    }

    return () => {
      observer.disconnect();
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
    };
  }, [result, showReference]);

  const composeLive = (base: string, interim: string) => {
    const spaced = base && !base.endsWith(" ") ? base + " " : base;
    const combined = (spaced + interim).trim();
    return combined.length > 500 ? combined.slice(0, 500) : combined;
  };

  const startListening = () => {
    if (!speechSupported || isListening) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "it-IT";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
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
      setInterimText(interim);
      if (finalChunk) {
        setInputText((prev) => composeLive(prev, finalChunk));
        if (error) setError(null);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
      setInterimText("");
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { }
      recognitionRef.current = null;
    }
    setIsListening(false);
    setInterimText("");
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

  const displayedText = isListening && interimText
    ? composeLive(inputText, interimText)
    : inputText;

  const bodyStyle = theme ? {
    backgroundColor: 'var(--wp-bg-color)',
    color: 'var(--wp-text-color)',
  } : {};

  const cardStyle = theme ? {
    backgroundColor: 'var(--wp-bg-color)',
    color: 'var(--wp-text-color)',
    borderColor: 'var(--wp-border-color)',
    border: '1px solid var(--wp-border-color)',
  } : {};

  return (
    <div className="min-h-screen" style={bodyStyle}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-lg shadow-lg p-6 mb-6" style={cardStyle}>
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
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm border transition-colors"
                    style={isListening 
                      ? { backgroundColor: '#dc2626', borderColor: '#b91c1c', color: '#ffffff' }
                      : speechSupported
                        ? theme 
                          ? { backgroundColor: 'var(--wp-bg-color)', borderColor: 'var(--wp-border-color)', color: 'var(--wp-text-color)' }
                          : { backgroundColor: '#f3f4f6', borderColor: '#e5e7eb', color: '#1f2937' }
                        : { backgroundColor: '#f3f4f6', borderColor: '#e5e7eb', color: '#9ca3af' }
                    }
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                      <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z" />
                      <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V21H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-3.08A7 7 0 0 0 19 11Z" />
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
                value={displayedText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setInterimText("");
                  if (error) setError(null);
                }}
                placeholder="Inserisci la tua frase qui..."
                maxLength={500}
                className="w-full h-24 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                style={theme ? { 
                  backgroundColor: 'var(--wp-bg-color)', 
                  color: 'var(--wp-text-color)',
                  borderColor: 'var(--wp-border-color)'
                } : {}}
              />
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Limite: 500 caratteri
                </span>
                <span className={`text-xs ${displayedText.length > 450 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                  {displayedText.length}/500
                </span>
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!inputText.trim() || isAnalyzing}
              className="w-full text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
              style={!inputText.trim() || isAnalyzing 
                ? {} 
                : theme 
                  ? { backgroundColor: 'var(--wp-button-color)', color: '#ffffff' }
                  : { backgroundColor: '#2563eb' }
              }
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

          <div className="rounded-lg shadow-lg p-6 mb-6" style={cardStyle}>
            <h3 className="text-lg font-semibold mb-3" style={theme ? { color: 'var(--wp-text-color)' } : {}}>Frasi di Esempio</h3>
            <div className="flex flex-wrap gap-2">
              {exampleSentences.map((sentence, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputText(sentence);
                    setInterimText("");
                    if (error) setError(null);
                  }}
                  className="px-3 py-1 rounded-full text-sm transition-colors duration-200"
                  style={theme 
                    ? { 
                        backgroundColor: 'var(--wp-bg-color)', 
                        color: 'var(--wp-text-color)',
                        border: '1px solid var(--wp-border-color)'
                      }
                    : {}
                  }
                >
                  {sentence}
                </button>
              ))}
            </div>
          </div>

          {result && (
            <div className="rounded-lg shadow-lg p-6" style={cardStyle}>
              <h2 className="text-xl font-semibold mb-4" style={theme ? { color: 'var(--wp-text-color)' } : {}}>Analisi Logica</h2>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Analisi logica della frase:
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500">
                  <p className="text-gray-800 dark:text-gray-200 font-medium">&quot;{result.sentence}&quot;</p>
                </div>
              </div>

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

              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-400">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Nota:</strong> Poiché viene elaborata automaticamente, lo strumento di analisi logica online è soggetto a errori.
                  Questa analisi è fornita a scopo educativo e potrebbe non essere accurata al 100%.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
