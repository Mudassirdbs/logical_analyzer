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
  const [error, setError] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const [interimText, setInterimText] = useState("");
  const [theme, setTheme] = useState<ThemeColors | null>(null);

  const lastHeightRef = useRef<number>(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  function sendHeightToParent() {
    if (typeof window === "undefined") return;
    if (window.parent && window.parent !== window) {
      const container = document.getElementById('logic-analyzer-container');
      if (container) {
        let height = container.scrollHeight;
        height = Math.max(height, 600);
        if (Math.abs(height - lastHeightRef.current) > 20) {
          if (height > 0) {
            console.log(`Sending height ${height} to parent`);
            window.parent.postMessage({ height }, '*');
          }
          lastHeightRef.current = height;
        }
      }
    }
  };
  function debouncedSendHeight() {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      sendHeightToParent();
    }, 300);
  }

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
      } else if (event.data && event.data.type === 'send-height') {
        sendHeightToParent();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Height on mount/resize/result change
    sendHeightToParent();

    const observer = new ResizeObserver(debouncedSendHeight);
    const targetElement = document.body;
    if (targetElement) {
      observer.observe(targetElement);
    }

    // Add scroll event listener, debounced
    function onScroll() {
      debouncedSendHeight();
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      window.removeEventListener('scroll', onScroll);
    };
  }, [result]);

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

  const characterPercentage = (displayedText.length / 500) * 100;

  return (
    <div style={bodyStyle} id="logic-analyzer-container">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Main Input Card */}
          <div className="glass-card rounded-2xl p-8 mb-8 fade-in-up">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="sentence-input" className="block text-lg font-semibold gradient-text">
                  Quale frase devo analizzare?
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    disabled={!speechSupported}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isListening ? 'pulse-recording' : 'hover-lift'
                      }`}
                    style={isListening
                      ? {
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: '#ffffff',
                        boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)'
                      }
                      : speechSupported
                        ? {
                          background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                          color: '#ffffff',
                          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                        }
                        : {
                          background: 'rgba(156, 163, 175, 0.2)',
                          color: '#9ca3af',
                          cursor: 'not-allowed'
                        }
                    }
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                      <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Z" />
                      <path d="M19 11a1 1 0 1 0-2 0 5 5 0 0 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 6 6.92V21H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-3.08A7 7 0 0 0 19 11Z" />
                    </svg>
                    {isListening ? "Ferma dettatura" : speechSupported ? "Dettatura" : "Non supportato"}
                  </button>
                </div>
              </div>
              {!speechSupported && (
                <p className="text-sm opacity-60 mb-3">
                  Il riconoscimento vocale non è supportato nel tuo browser. Prova con Chrome su desktop.
                </p>
              )}
              <div className="relative">
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
                  className="w-full h-32 px-4 py-3 rounded-xl resize-none transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{
                    background: 'rgba(255, 255, 255, 0.5)',
                    backdropFilter: 'blur(8px)',
                    border: '2px solid rgba(147, 197, 253, 0.3)',
                    color: '#1f2937',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
                  }}
                />
                {/* Character counter progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs opacity-60">
                      Limite: 500 caratteri
                    </span>
                    <span className={`text-xs font-medium ${displayedText.length > 450 ? 'text-red-500' : 'opacity-70'}`}>
                      {displayedText.length}/500
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300 rounded-full"
                      style={{
                        width: `${characterPercentage}%`,
                        background: characterPercentage > 90
                          ? 'var(--gradient-warm)'
                          : 'var(--gradient-primary)'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!inputText.trim() || isAnalyzing}
              className="w-full font-semibold py-4 px-6 rounded-xl transition-all duration-300 text-white relative overflow-hidden group"
              style={!inputText.trim() || isAnalyzing
                ? {
                  background: 'rgba(156, 163, 175, 0.3)',
                  color: '#9ca3af',
                  cursor: 'not-allowed'
                }
                : {
                  background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
                  transform: 'translateY(0)',
                }
              }
              onMouseEnter={(e) => {
                if (inputText.trim() && !isAnalyzing) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(99, 102, 241, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (inputText.trim() && !isAnalyzing) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(99, 102, 241, 0.4)';
                }
              }}
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analizzando...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
                  </svg>
                  Analizza Frase
                </span>
              )}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="glass-card rounded-2xl p-5 mb-8 fade-in-up" style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
              borderLeft: '4px solid #ef4444'
            }}>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-red-600 dark:text-red-400 font-medium">
                    <strong>Errore:</strong> {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Example Sentences */}
          {!result && (
            <div className="glass-card rounded-2xl p-8 mb-8 fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-xl font-bold mb-4 gradient-text">Frasi di Esempio</h3>
              <div className="flex flex-wrap gap-3">
                {exampleSentences.map((sentence, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputText(sentence);
                      setInterimText("");
                      if (error) setError(null);
                    }}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover-lift"
                    style={{
                      background: 'rgba(255, 255, 255, 0.5)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(147, 197, 253, 0.3)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                      color: '#1f2937'
                    }}
                  >
                    {sentence}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="glass-card rounded-2xl p-8 fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-2xl font-bold mb-6 gradient-text">Analisi Logica</h2>

              {/* Sentence Display */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 opacity-80">
                  Analisi logica della frase:
                </h3>
                <div className="p-5 rounded-xl relative overflow-hidden" style={{
                  background: 'var(--gradient-accent)',
                  boxShadow: '0 4px 16px rgba(6, 182, 212, 0.2)'
                }}>
                  <p className="text-white font-medium text-lg relative z-10">&quot;{result.sentence}&quot;</p>
                  <div className="absolute inset-0 bg-white opacity-10" />
                </div>
              </div>

              {/* Word Analysis */}
              <div className="space-y-4 mb-8">
                {result.wordAnalysis.map((analysis, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-start gap-3 p-5 rounded-xl hover-lift"
                    style={{
                      background: 'var(--glass-bg)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid var(--glass-border)',
                      animation: 'staggerFadeIn 0.4s ease-out forwards',
                      animationDelay: `${index * 0.05}s`,
                      opacity: 0
                    }}
                  >
                    <div className="font-bold text-lg min-w-[120px] sm:min-w-[140px]" style={{
                      background: 'var(--gradient-primary)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {analysis.word}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-base mb-2" style={{ color: '#06b6d4' }}>
                        {analysis.type}
                      </div>
                      <div className="text-sm opacity-80 leading-relaxed">
                        {analysis.definition}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Metadata Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div className="p-5 rounded-xl relative overflow-hidden" style={{
                  background: 'var(--gradient-purple)',
                  boxShadow: '0 4px 16px rgba(168, 85, 247, 0.2)'
                }}>
                  <div className="relative z-10">
                    <div className="text-sm font-medium text-white opacity-90 mb-1">Tipo di Frase</div>
                    <div className="text-white text-xl font-bold capitalize">{result.sentenceType}</div>
                  </div>
                  <div className="absolute inset-0 bg-white opacity-10" />
                </div>
                <div className="p-5 rounded-xl relative overflow-hidden" style={{
                  background: 'var(--gradient-success)',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.2)'
                }}>
                  <div className="relative z-10">
                    <div className="text-sm font-medium text-white opacity-90 mb-1">Affidabilità Analisi</div>
                    <div className="text-white text-xl font-bold">{(result.confidence * 100).toFixed(1)}%</div>
                  </div>
                  <div className="absolute inset-0 bg-white opacity-10" />
                </div>
              </div>

              {/* Disclaimer */}
              <div className="p-5 rounded-xl relative overflow-hidden" style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(251, 146, 60, 0.05) 100%)',
                borderLeft: '4px solid #f59e0b'
              }}>
                <p className="text-sm leading-relaxed opacity-80">
                  <strong className="font-semibold">Nota:</strong> Poiché viene elaborata automaticamente, lo strumento di analisi logica online è soggetto a errori.
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
