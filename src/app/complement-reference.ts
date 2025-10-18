// English Grammar Complement Reference
// Comprehensive information about English grammatical complements

export interface ComplementInfo {
  name: string;
  type: 'direct' | 'indirect' | 'phrasal';
  definition: string;
  examples: string[];
  patterns: string[];
}

export const complementReference: ComplementInfo[] = [
  {
    name: 'Direct Object',
    type: 'direct',
    definition: 'The noun or pronoun that receives the action of the verb directly',
    examples: ['She reads books', 'He kicked the ball', 'They built a house'],
    patterns: ['Subject + Verb + Direct Object']
  },
  {
    name: 'Indirect Object',
    type: 'indirect',
    definition: 'The noun or pronoun that receives the direct object or benefits from the action',
    examples: ['She gave him a book', 'I told her the truth', 'We sent them a letter'],
    patterns: ['Subject + Verb + Indirect Object + Direct Object']
  },
  {
    name: 'Subject Complement',
    type: 'direct',
    definition: 'A word or phrase that follows a linking verb and describes or renames the subject',
    examples: ['She is a teacher', 'The sky looks blue', 'He became famous'],
    patterns: ['Subject + Linking Verb + Subject Complement']
  },
  {
    name: 'Object Complement',
    type: 'direct',
    definition: 'A word or phrase that follows and modifies the direct object',
    examples: ['They elected him president', 'We painted the house red', 'I found the book interesting'],
    patterns: ['Subject + Verb + Direct Object + Object Complement']
  },
  {
    name: 'Prepositional Phrase',
    type: 'phrasal',
    definition: 'A phrase that begins with a preposition and ends with a noun or pronoun',
    examples: ['The book is on the table', 'She walked through the park', 'He lives in New York'],
    patterns: ['Preposition + Object of Preposition']
  },
  {
    name: 'Adverbial Phrase',
    type: 'phrasal',
    definition: 'A phrase that modifies a verb, adjective, or adverb',
    examples: ['She runs very quickly', 'He is quite tall', 'They arrived yesterday'],
    patterns: ['Adverb + Adjective/Adverb', 'Time/Location expressions']
  },
  {
    name: 'Adjectival Phrase',
    type: 'phrasal',
    definition: 'A phrase that modifies a noun or pronoun',
    examples: ['The book on the shelf', 'A man of great wisdom', 'The house with the red door'],
    patterns: ['Prepositional phrase modifying noun']
  },
  {
    name: 'Appositive',
    type: 'direct',
    definition: 'A noun or noun phrase that renames or explains another noun',
    examples: ['My brother, John, is coming', 'Paris, the capital of France', 'The teacher, Mrs. Smith'],
    patterns: ['Noun + Comma + Appositive + Comma']
  },
  {
    name: 'Participle Phrase',
    type: 'phrasal',
    definition: 'A phrase that begins with a participle and modifies a noun',
    examples: ['The running water', 'The broken window', 'The excited children'],
    patterns: ['Present/Past Participle + Modifiers']
  },
  {
    name: 'Gerund Phrase',
    type: 'phrasal',
    definition: 'A phrase that begins with a gerund and functions as a noun',
    examples: ['Swimming is good exercise', 'I enjoy reading books', 'His favorite activity is hiking'],
    patterns: ['Gerund + Modifiers/Objects']
  },
  {
    name: 'Infinitive Phrase',
    type: 'phrasal',
    definition: 'A phrase that begins with an infinitive and can function as a noun, adjective, or adverb',
    examples: ['To learn is important', 'I want to travel', 'The book to read is on the shelf'],
    patterns: ['To + Verb + Modifiers/Objects']
  },
  {
    name: 'Absolute Phrase',
    type: 'phrasal',
    definition: 'A phrase that modifies the entire sentence rather than a specific word',
    examples: ['The weather being nice, we went for a walk', 'His work finished, he went home'],
    patterns: ['Noun + Participle + Modifiers']
  },
  {
    name: 'Noun Clause',
    type: 'phrasal',
    definition: 'A clause that functions as a noun in the sentence',
    examples: ['What he said is true', 'I believe that you are right', 'Who she is remains a mystery'],
    patterns: ['That/What/Who/Where/When/Why + Subject + Verb']
  },
  {
    name: 'Adjective Clause',
    type: 'phrasal',
    definition: 'A clause that modifies a noun or pronoun',
    examples: ['The book that I read', 'The man who came yesterday', 'The place where we met'],
    patterns: ['Relative Pronoun + Subject + Verb']
  },
  {
    name: 'Adverb Clause',
    type: 'phrasal',
    definition: 'A clause that modifies a verb, adjective, or adverb',
    examples: ['She left when it started raining', 'He works hard so that he can succeed'],
    patterns: ['Subordinating Conjunction + Subject + Verb']
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

export function getComplementsByType(type: 'direct' | 'indirect' | 'phrasal'): ComplementInfo[] {
  return complementReference.filter(comp => comp.type === type);
}
