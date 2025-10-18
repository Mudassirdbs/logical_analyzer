# App Analisi Logica

Un'applicazione web moderna per eseguire l'analisi logica delle frasi italiane utilizzando librerie NLP avanzate e AI. Questo strumento identifica automaticamente soggetti, predicati e vari complementi grammaticali per aiutare gli utenti a comprendere la struttura delle frasi.

## Caratteristiche

- **Analisi Potenziata da AI**: Utilizza Google Gemini AI per una maggiore accuratezza e comprensione del contesto
- **Integrazione Librerie NLP**: Costruita con librerie NLP robuste per l'analisi grammaticale italiana
- **Risultati Completi**: Identifica soggetti, predicati, complementi, tipi di frase e punteggi di affidabilità
- **Riferimento Educativo**: Riferimento completo dei complementi con esempi e spiegazioni
- **UI Moderna**: Design pulito e reattivo con supporto per la modalità scura
- **Frasi di Esempio**: Esempi italiani pre-caricati per aiutare gli utenti a iniziare

## Come Funziona

L'analisi logica consiste nel trovare:
1. **Soggetto** - La persona, animale o cosa che compie o subisce l'azione
2. **Predicato** - L'azione o stato espresso dal verbo
3. **Complementi** - Elementi aggiuntivi che completano il significato della frase
4. **Tipo di Frase** - Classificazione di frase semplice, composta o complessa
5. **Punteggio di Affidabilità** - Livello di fiducia dell'AI per l'analisi

## Stack Tecnologico

- **Frontend**: Next.js 15 con React 19
- **Backend**: Next.js API Routes per l'elaborazione lato server
- **Styling**: Tailwind CSS v4
- **Linguaggio**: TypeScript
- **Motore AI**: Google Gemini API (solo lato server)
- **Gestore Pacchetti**: Bun per una gestione rapida delle dipendenze
- **Architettura**: Separazione client-server per la sicurezza delle chiavi API

## Complementi Supportati

L'app riconosce vari tipi di complementi italiani tra cui:
- Complemento Oggetto
- Complemento Predicativo del Soggetto
- Complemento d'Agente
- Complemento di Specificazione
- Complemento di Termine
- Complemento di Luogo
- Complemento di Tempo
- Complemento di Causa
- Complemento di Fine o Scopo
- Complemento di Mezzo o Strumento
- Complemento di Modo o Maniera
- Complemento di Compagnia
- Complemento di Materia
- Complemento di Qualità
- Complemento di Età
- Complemento di Prezzo
- Complemento di Vantaggio
- Complemento di Svantaggio
- Complemento di Sostituzione
- Complemento di Esclusione
- Complemento Concessivo
- Complemento Vocativo

## Iniziare

1. **Installa le Dipendenze**:
   ```bash
   bun install
   ```

2. **Configura le Variabili d'Ambiente**:
   ```bash
   cp env.example .env.local
   # Modifica .env.local e aggiungi la tua chiave API Google Gemini
   ```

3. **Avvia il Server di Sviluppo**:
```bash
   bun run dev
   ```

4. **Apri nel Browser**:
   Naviga su [http://localhost:3000](http://localhost:3000)

## Configurazione API

### Google Gemini API
1. Visita [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nuova chiave API
3. Aggiungila al tuo file `.env.local` come `GEMINI_API_KEY`

L'app funzionerà senza la chiave API utilizzando solo le librerie NLP, ma il potenziamento AI fornisce una maggiore accuratezza.

## Utilizzo

1. Inserisci una frase italiana nell'area di testo
2. Clicca "Analizza Frase" per elaborare il testo
3. Visualizza i risultati che mostrano soggetti, predicati, complementi, tipo di frase e affidabilità identificati
4. Usa il pulsante "Mostra Riferimento Complementi" per esplorare tutti i tipi di complementi

## Frasi di Esempio

Prova queste frasi di esempio:
- "Il bambino gioca nel parco"
- "Maria legge un libro interessante"
- "Gli studenti studiano per l'esame"
- "Il gatto dorme sul divano"
- "Noi mangiamo la pizza insieme"

## Sviluppo

L'applicazione utilizza un'architettura client-server sicura:

1. **Frontend**: Componenti React che inviano testo all'endpoint API
2. **Backend**: Route API Next.js che gestiscono le chiamate Gemini AI in modo sicuro
3. **Sicurezza**: La chiave API non viene mai esposta al client-side
4. **Gestione Errori**: Risposte di fallback eleganti quando i servizi AI non sono disponibili

### Architettura

- **Client-side**: Componenti React con TypeScript, nessuna chiave API esposta
- **Server-side**: Route API Next.js gestiscono tutto l'elaborazione AI
- **Sicurezza**: Chiave API Gemini memorizzata in modo sicuro nelle variabili d'ambiente
- **Gestione Errori**: Gestione errori completa con risposte di fallback
- **Prestazioni**: Chiamate API ottimizzate con codici di stato HTTP appropriati

## Contribuire

Questo è un progetto di apprendimento che dimostra l'integrazione moderna di NLP e AI. Sentiti libero di fare fork e migliorare:

- Aggiungi più tipi di complementi
- Migliora gli algoritmi di analisi
- Integra modelli AI aggiuntivi
- Aggiungi più lingue
- Migliora l'UI/UX

## Licenza

Questo progetto è open source e disponibile sotto la Licenza MIT.
