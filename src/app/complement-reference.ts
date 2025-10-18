// Riferimento Complementi Grammaticali Italiani
// Informazioni complete sui complementi grammaticali italiani

export interface ComplementInfo {
  name: string;
  type: 'diretto' | 'indiretto';
  group?: number;
  definition: string;
  examples: string[];
  prepositions: string[];
}

export const complementReference: ComplementInfo[] = [
  {
    name: 'Complemento Oggetto',
    type: 'diretto',
    definition: 'indica la persona, animale o cosa su cui ricade direttamente l\'azione compiuta dal soggetto ed espressa da un verbo transitivo in forma attiva o riflessiva.',
    examples: ['Il bambino mangia la mela', 'Maria legge un libro'],
    prepositions: []
  },
  {
    name: 'Complemento Predicativo del Soggetto',
    type: 'diretto',
    definition: 'È costituito da un sostantivo o da un aggettivo che completa il significato del predicato con un verbo intransitivo o transitivo passivo.',
    examples: ['Il cielo è azzurro', 'Maria sembra felice'],
    prepositions: []
  },
  {
    name: 'Complemento d\'Agente',
    type: 'indiretto',
    group: 1,
    definition: 'indica la persona o l\'animale da cui è compiuta l\'azione espressa dal verbo passivo.',
    examples: ['Il libro è stato scritto da Marco', 'La casa è stata costruita dagli operai'],
    prepositions: ['da', 'dal', 'dalla', 'dai', 'dagli', 'dalle']
  },
  {
    name: 'Complemento di Specificazione',
    type: 'indiretto',
    group: 1,
    definition: 'specifica il significato del termine a cui si riferisce, che altrimenti rimarrebbe generico.',
    examples: ['Il libro di storia', 'La casa di Maria', 'Il colore del cielo'],
    prepositions: ['di', 'del', 'dello', 'della', 'dei', 'degli', 'delle']
  },
  {
    name: 'Complemento di Termine',
    type: 'indiretto',
    group: 1,
    definition: 'indica la persona, animale o cosa su cui finisce l\'azione compiuta dal soggetto espressa dal predicato.',
    examples: ['Parlo a Marco', 'Scrivo alla madre', 'Telefono agli amici'],
    prepositions: ['a', 'al', 'allo', 'alla', 'ai', 'agli', 'alle']
  },
  {
    name: 'Complemento di Luogo',
    type: 'indiretto',
    group: 2,
    definition: 'indica dove avviene l\'azione, dove si trova qualcuno o qualcosa, o dove si verifica una certa situazione.',
    examples: ['Vivo a Roma', 'Sono in casa', 'Cammino per strada'],
    prepositions: ['in', 'a', 'su', 'sopra', 'sotto', 'davanti', 'dietro', 'vicino', 'lontano', 'dentro', 'fuori']
  },
  {
    name: 'Complemento di Tempo',
    type: 'indiretto',
    group: 2,
    definition: 'indica il momento o il periodo di tempo in cui avviene l\'azione espressa dal predicato.',
    examples: ['Arrivo domani', 'Studio di sera', 'Parto alle otto'],
    prepositions: ['a', 'di', 'in', 'per', 'durante', 'prima', 'dopo']
  },
  {
    name: 'Complemento di Causa',
    type: 'indiretto',
    group: 3,
    definition: 'indica il motivo, la causa per cui qualcosa viene fatto o accade.',
    examples: ['Piango per la gioia', 'Non esco per il freddo', 'È successo per errore'],
    prepositions: ['per', 'a causa di', 'per colpa di']
  },
  {
    name: 'Complemento di Fine o Scopo',
    type: 'indiretto',
    group: 3,
    definition: 'indica verso quale fine è diretta l\'azione espressa dal predicato.',
    examples: ['Studio per imparare', 'Lavoro per guadagnare', 'Esco per divertirmi'],
    prepositions: ['per', 'al fine di', 'allo scopo di']
  },
  {
    name: 'Complemento di Mezzo o Strumento',
    type: 'indiretto',
    group: 3,
    definition: 'indica il mezzo (persona o animale) o lo strumento (oggetto o entità astratta) di cui ci si serve per compiere l\'azione.',
    examples: ['Scrivo con la penna', 'Viaggio in treno', 'Comunico per telefono'],
    prepositions: ['con', 'per mezzo di', 'tramite']
  },
  {
    name: 'Complemento di Modo o Maniera',
    type: 'indiretto',
    group: 3,
    definition: 'indica il modo in cui si svolge l\'azione espressa dal predicato.',
    examples: ['Cammino lentamente', 'Parlo chiaramente', 'Lavoro con impegno'],
    prepositions: ['con', 'in modo', 'in maniera']
  },
  {
    name: 'Complemento di Compagnia',
    type: 'indiretto',
    group: 4,
    definition: 'indica la persona o l\'animale con cui qualcuno si trova in una certa situazione o compie o subisce l\'azione.',
    examples: ['Vado con gli amici', 'Pranzo con la famiglia', 'Studio con Maria'],
    prepositions: ['con', 'insieme a']
  },
  {
    name: 'Complemento di Materia',
    type: 'indiretto',
    group: 4,
    definition: 'indica il materiale di cui è fatto un oggetto.',
    examples: ['Una statua di marmo', 'Un tavolo di legno', 'Una collana d\'oro'],
    prepositions: ['di', 'in']
  },
  {
    name: 'Complemento di Qualità',
    type: 'indiretto',
    group: 5,
    definition: 'indica una qualità o caratteristica di qualcuno o qualcosa.',
    examples: ['Un uomo di coraggio', 'Una donna di intelligenza', 'Un bambino di bontà'],
    prepositions: ['di', 'di grande', 'di poco']
  },
  {
    name: 'Complemento di Età',
    type: 'indiretto',
    group: 5,
    definition: 'specifica l\'età di qualcuno o qualcosa.',
    examples: ['Un bambino di cinque anni', 'Una donna di trent\'anni', 'Un albero di cento anni'],
    prepositions: ['di', 'dell\'età di']
  },
  {
    name: 'Complemento di Prezzo',
    type: 'indiretto',
    group: 5,
    definition: 'indica il costo di qualcosa o qualcuno.',
    examples: ['Ho comprato un libro di venti euro', 'Una casa di centomila euro'],
    prepositions: ['di', 'a', 'per']
  },
  {
    name: 'Complemento di Vantaggio',
    type: 'indiretto',
    group: 5,
    definition: 'indica la persona o la cosa per cui si compie l\'azione.',
    examples: ['Lavoro per la famiglia', 'Studio per il futuro', 'Faccio questo per te'],
    prepositions: ['per', 'a favore di', 'a beneficio di']
  },
  {
    name: 'Complemento di Svantaggio',
    type: 'indiretto',
    group: 5,
    definition: 'indica la persona o la cosa a danno della quale si compie l\'azione.',
    examples: ['È successo contro di me', 'Lavoro a danno della salute'],
    prepositions: ['contro', 'a danno di', 'a scapito di']
  },
  {
    name: 'Complemento di Sostituzione',
    type: 'indiretto',
    group: 6,
    definition: 'indica qualcuno o qualcosa che viene sostituito o scambiato con un altro.',
    examples: ['Sostituisco il vecchio con il nuovo', 'Cambio il dollaro con l\'euro'],
    prepositions: ['con', 'in cambio di', 'al posto di']
  },
  {
    name: 'Complemento di Esclusione',
    type: 'indiretto',
    group: 6,
    definition: 'indica chi o cosa rimane escluso rispetto a quanto espresso dal predicato.',
    examples: ['Tutti tranne lui', 'Nessuno eccetto Maria', 'Tutto senza eccezioni'],
    prepositions: ['tranne', 'eccetto', 'salvo', 'fuorché', 'senza']
  },
  {
    name: 'Complemento Concessivo',
    type: 'indiretto',
    group: 6,
    definition: 'indica nonostante cosa o chi si realizza l\'azione.',
    examples: ['Vado nonostante la pioggia', 'Studio malgrado la stanchezza'],
    prepositions: ['nonostante', 'malgrado', 'benché', 'sebbene']
  },
  {
    name: 'Complemento Vocativo',
    type: 'indiretto',
    group: 6,
    definition: 'indica la persona o l\'essere animato di cui si vuole richiamare l\'attenzione o che si vuole pregare, onorare, esaltare.',
    examples: ['Marco, vieni qui!', 'Signora, scusi!', 'Dio, aiutaci!'],
    prepositions: []
  }
];

export function getComplementInfo(type: string): ComplementInfo | undefined {
  return complementReference.find(comp => 
    comp.name.toLowerCase().includes(type.toLowerCase()) ||
    type.toLowerCase().includes(comp.name.toLowerCase())
  );
}

export function getAllComplements(): ComplementInfo[] {
  return complementReference;
}

export function getComplementsByType(type: 'diretto' | 'indiretto'): ComplementInfo[] {
  return complementReference.filter(comp => comp.type === type);
}
