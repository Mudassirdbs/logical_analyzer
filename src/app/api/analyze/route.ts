import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

    if (text.length > 500) {
      return NextResponse.json(
        { error: 'Text too long. Maximum 500 characters allowed.' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Log API key presence (do not log the full key)
    console.log('API Key present:', !!process.env.GEMINI_API_KEY);
    if (process.env.GEMINI_API_KEY) {
      console.log('API Key prefix:', process.env.GEMINI_API_KEY.substring(0, 4));
    }

    // Use a standard valid model name
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    Esegui un'analisi logica dettagliata di questa frase italiana: "${text}"
    
    Analizza ogni parola/frase e fornisci una risposta JSON con questa struttura esatta:
    {
      "sentence": "${text}",
      "wordAnalysis": [
        {
          "word": "parola o frase specifica",
          "type": "FUNZIONE GRAMMATICALE",
          "definition": "definizione dettagliata che spiega la funzione grammaticale"
        }
      ],
      "sentenceType": "semplice|composta|complessa",
      "confidence": 0.95
    }
    
    Per ogni parola/frase, identifica la sua funzione grammaticale:
    - SOGGETTO: La persona, animale o cosa che compie o subisce l'azione
    - PREDICATO VERBALE: L'azione compiuta o subita dal soggetto
    - COMPLEMENTO OGGETTO: Il sostantivo o pronome che riceve direttamente l'azione del verbo
    - COMPLEMENTO DI TERMINE: Il sostantivo o pronome che riceve l'oggetto diretto o beneficia dell'azione
    - COMPLEMENTO PREDICATIVO DEL SOGGETTO: Una parola o frase che segue un verbo copulativo e descrive o rinomina il soggetto
    - COMPLEMENTO PREDICATIVO DELL'OGGETTO: Una parola o frase che segue e modifica l'oggetto diretto
    - COMPLEMENTO DI SPECIFICAZIONE: Specifica il significato del termine a cui si riferisce
    - COMPLEMENTO DI LUOGO: Indica dove avviene l'azione o dove si trova qualcuno o qualcosa
    - COMPLEMENTO DI TEMPO: Indica il momento o periodo di tempo in cui avviene l'azione
    - COMPLEMENTO DI CAUSA: Indica il motivo o la causa per cui qualcosa viene fatto o accade
    - COMPLEMENTO DI FINE O SCOPO: Indica verso quale fine è diretta l'azione
    - COMPLEMENTO DI MEZZO O STRUMENTO: Indica il mezzo o strumento usato per compiere l'azione
    - COMPLEMENTO DI MODO O MANIERA: Indica il modo in cui si svolge l'azione
    - COMPLEMENTO DI COMPAGNIA: Indica la persona o animale con cui qualcuno si trova
    - COMPLEMENTO DI MATERIA: Indica il materiale di cui è fatto un oggetto
    - COMPLEMENTO DI QUALITÀ: Indica una qualità o caratteristica di qualcuno o qualcosa
    - COMPLEMENTO DI QUANTITÀ: Indica la quantità o misura di qualcuno o qualcosa
    - COMPLEMENTO DI ETÀ: Specifica l'età di qualcuno o qualcosa
    - COMPLEMENTO DI PREZZO: Indica il costo di qualcosa
    - COMPLEMENTO DI VANTAGGIO: Indica la persona o cosa per cui si compie l'azione
    - COMPLEMENTO DI SVANTAGGIO: Indica la persona o cosa a danno della quale si compie l'azione
    - COMPLEMENTO DI SOSTITUZIONE: Indica qualcuno o qualcosa che viene sostituito
    - COMPLEMENTO DI ESCLUSIONE: Indica chi o cosa rimane escluso
    - COMPLEMENTO CONCESSIVO: Indica nonostante cosa o chi si realizza l'azione
    - COMPLEMENTO DI COLPA: Indica la colpa o il reato di cui qualcuno è accusato
    - COMPLEMENTO DI PENA: Indica la condanna o pena inflitta
    - COMPLEMENTO VOCATIVO: Indica la persona o essere animato di cui si vuole richiamare l'attenzione
    - ARTICOLO: Una parola che specifica un sostantivo
    - AGGETTIVO: Una parola che modifica un sostantivo o pronome
    - AVVERBIO: Una parola che modifica un verbo, aggettivo o altro avverbio
    - CONGIUNZIONE: Una parola che collega parole, frasi o proposizioni
    - PREPOSIZIONE: Una parola che mostra la relazione tra un sostantivo/pronome e altre parole
    - PRONOME: Una parola che sostituisce un sostantivo
    - DETERMINANTE: Una parola che introduce un sostantivo
    
    Fornisci definizioni dettagliate per ogni funzione grammaticale. Sii educativo e preciso.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    console.log('Model response:', responseText);

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
    // @ts-ignore
    if (error.response) {
      // @ts-ignore
      console.error('API Error Response:', JSON.stringify(error.response, null, 2));
    }
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

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
