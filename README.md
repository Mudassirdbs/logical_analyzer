# Logic Analysis App

A modern web application for performing logical analysis of English sentences using advanced NLP libraries and AI. This tool automatically identifies subjects, predicates, and various grammatical complements to help users understand sentence structure.

## Features

- **AI-Powered Analysis**: Uses Google Gemini AI for enhanced accuracy and context understanding
- **NLP Library Integration**: Built with compromise.js for robust English grammar parsing
- **Comprehensive Results**: Identifies subjects, predicates, complements, sentence types, and confidence scores
- **Educational Reference**: Complete complement reference with examples and explanations
- **Modern UI**: Clean, responsive design with dark mode support
- **Example Sentences**: Pre-loaded English examples to help users get started

## How It Works

Logical analysis consists of finding:
1. **Subject** - The person, animal, or thing performing the action
2. **Predicate** - The action or state expressed by the verb
3. **Complements** - Additional elements that complete the meaning of the sentence
4. **Sentence Type** - Simple, compound, or complex sentence classification
5. **Confidence Score** - AI confidence level for the analysis

## Technology Stack

- **Frontend**: Next.js 15 with React 19
- **Backend**: Next.js API Routes for server-side processing
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **AI Engine**: Google Gemini API (server-side only)
- **Package Manager**: Bun for fast dependency management
- **Architecture**: Client-server separation for API key security

## Supported Complements

The app recognizes various types of English complements including:
- Direct Object
- Indirect Object  
- Subject Complement
- Object Complement
- Prepositional Phrase
- Adverbial Phrase
- Adjectival Phrase
- Appositive
- Participle Phrase
- Gerund Phrase
- Infinitive Phrase
- Absolute Phrase
- Noun Clause
- Adjective Clause
- Adverb Clause

## Getting Started

1. **Install Dependencies**:
   ```bash
   bun install
   ```

2. **Set up Environment Variables**:
   ```bash
   cp env.example .env.local
   # Edit .env.local and add your Google Gemini API key
   ```

3. **Run Development Server**:
```bash
   bun run dev
   ```

4. **Open in Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Setup

### Google Gemini API
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file as `GEMINI_API_KEY`

The app will work without the API key using only the NLP library, but AI enhancement provides better accuracy.

## Usage

1. Enter an English sentence in the text area
2. Click "Analyze Sentence" to process the text
3. View the results showing identified subjects, predicates, complements, sentence type, and confidence
4. Use the "Show Complement Reference" button to explore all complement types

## Example Sentences

Try these example sentences:
- "The student reads books in the library"
- "She gave him a beautiful gift yesterday"
- "The teacher is explaining the lesson clearly"
- "They built a house on the hill"
- "I found the book very interesting"

## Development

The application uses a secure client-server architecture:

1. **Frontend**: React components that send text to the API endpoint
2. **Backend**: Next.js API route that handles Gemini AI calls securely
3. **Security**: API key is never exposed to the client-side
4. **Error Handling**: Graceful fallback responses when AI services are unavailable

### Architecture

- **Client-side**: React components with TypeScript, no API keys exposed
- **Server-side**: Next.js API routes handle all AI processing
- **Security**: Gemini API key stored securely in environment variables
- **Error Handling**: Comprehensive error handling with fallback responses
- **Performance**: Optimized API calls with proper HTTP status codes

## Contributing

This is a learning project demonstrating modern NLP and AI integration. Feel free to fork and enhance:

- Add more complement types
- Improve the analysis algorithms
- Integrate additional AI models
- Add more languages
- Enhance the UI/UX

## License

This project is open source and available under the MIT License.
