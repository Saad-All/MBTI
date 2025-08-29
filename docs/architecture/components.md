# 6. Components

Based on the architectural patterns, tech stack, and data models, I'll identify the major logical components across the fullstack system with clear boundaries and interfaces.

### Frontend Application Component

**Responsibility:** Main Next.js web application providing the complete user interface for MBTI assessment, results display, and coaching lead capture with bilingual support.

**Key Interfaces:**
- `/` - Landing page with language selection
- `/assessment/*` - Assessment flow pages (core, interim, format, extended)
- `/results/*` - Results display with format-specific content
- `/chat` - AI chatbot interface
- API client services for backend communication

**Dependencies:** Next.js App Router, React components, Zustand state management, Tailwind CSS, next-i18next

### MBTI Calculation Engine Component

**Responsibility:** Core business logic for calculating personality types from user responses across all three assessment formats.

**Key Interfaces:**
- `calculateMBTIType(responses: QuestionResponse[]): MBTIResults`
- `validateSAISDistribution(pointA: number, pointB: number): boolean`
- `calculateDimensionScores(responses: QuestionResponse[]): DimensionScores`

**Dependencies:** Assessment data models, validation utilities

### Content Management Component

**Responsibility:** Manages bilingual content delivery for questions, results, and user interface elements with RTL layout support.

**Key Interfaces:**
- `getQuestions(format: string, language: string): Question[]`
- `getResultsContent(type: string, format: string, language: string): ResultsContent`
- `translateInterface(language: string): InterfaceTranslations`

**Dependencies:** Static JSON files, i18next configuration

### Session Management Component

**Responsibility:** Handles user session persistence, progress tracking, and state management throughout the assessment journey.

**Key Interfaces:**
- `createSession(): AssessmentSession`
- `saveProgress(sessionId: string, data: Partial<AssessmentSession>): void`
- `restoreSession(sessionId: string): AssessmentSession | null`

**Dependencies:** localStorage abstraction, session validation

### AI Chatbot Component

**Responsibility:** Integrates with OpenAI API to provide personalized MBTI guidance and post-assessment conversations.

**Key Interfaces:**
- `generateResponse(message: string, context: ChatContext): Promise<string>`
- `initializeChatSession(mbtiType: string, language: string): ChatSession`
- `manageChatHistory(sessionId: string): ChatMessage[]`

**Dependencies:** OpenAI API client, conversation context management
