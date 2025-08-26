# 10. Frontend Architecture

Based on the front-end specification and PRD requirements, this section defines the complete frontend architecture for the bilingual MBTI platform with three assessment formats and specialized SAIS 5-point distribution interface.

### Component Architecture

The frontend follows a hierarchical component structure optimized for the unique requirements of MBTI assessment flows, bilingual content delivery, and format-specific user experiences.

#### Component Organization
```
src/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Internationalized routes (en/ar)
│   │   ├── layout.tsx            # Root layout with providers
│   │   ├── page.tsx              # Landing page
│   │   ├── assessment/
│   │   │   ├── layout.tsx        # Assessment flow layout
│   │   │   ├── page.tsx          # Assessment start
│   │   │   ├── core/page.tsx     # 4 core questions
│   │   │   ├── interim/page.tsx  # Interim results
│   │   │   ├── format/page.tsx   # Format selection
│   │   │   ├── scenarios/page.tsx # Life scenarios
│   │   │   ├── traits/page.tsx   # A/B traits
│   │   │   └── sais/page.tsx     # SAIS methodology
│   │   ├── results/
│   │   │   ├── layout.tsx        # Results layout
│   │   │   ├── page.tsx          # Results display
│   │   │   └── [type]/page.tsx   # Type-specific results
│   │   ├── chat/page.tsx         # AI chatbot
│   │   └── coaching/page.tsx     # Lead capture
│   ├── api/                      # API routes
│   │   ├── questions/route.ts
│   │   ├── calculate-mbti/route.ts
│   │   ├── chat/route.ts
│   │   └── coaching-leads/route.ts
│   └── globals.css
├── components/
│   ├── assessment/
│   │   ├── QuestionCard.tsx      # Generic question wrapper
│   │   ├── BinaryChoice.tsx      # A/B selection component
│   │   ├── SAISDistribution.tsx  # 5-point distribution UI
│   │   ├── ProgressBar.tsx       # Assessment progress
│   │   └── FormatSelector.tsx    # Format selection grid
│   ├── results/
│   │   ├── TypeDisplay.tsx       # MBTI type presentation
│   │   ├── DimensionChart.tsx    # Visual dimension scores
│   │   ├── InsightCards.tsx      # Personality insights
│   │   └── ShareResults.tsx      # Social sharing
│   ├── chat/
│   │   ├── ChatWindow.tsx        # Main chat interface
│   │   ├── MessageBubble.tsx     # Individual messages
│   │   └── ChatInput.tsx         # Message input field
│   ├── layout/
│   │   ├── Header.tsx            # App header with language toggle
│   │   ├── Footer.tsx            # App footer
│   │   └── LanguageToggle.tsx    # Bilingual switcher
│   └── ui/                       # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Slider.tsx            # For SAIS distribution
│       └── Progress.tsx
├── lib/
│   ├── stores/
│   │   ├── assessmentStore.ts    # Zustand assessment state
│   │   ├── resultsStore.ts       # Results state
│   │   └── chatStore.ts          # Chat state
│   ├── services/
│   │   ├── api.ts                # API client
│   │   ├── storage.ts            # localStorage abstraction
│   │   └── validation.ts         # Input validation
│   ├── utils/
│   │   ├── mbti-calculator.ts    # Type calculation logic
│   │   ├── sais-validator.ts     # SAIS distribution validation
│   │   └── i18n-helpers.ts       # Internationalization utils
│   └── types/
│       ├── assessment.ts         # Assessment type definitions
│       ├── results.ts            # Results type definitions
│       └── api.ts                # API response types
├── data/
│   ├── questions/
│   │   ├── core-en.json          # Core questions English
│   │   ├── core-ar.json          # Core questions Arabic
│   │   ├── scenarios-en.json     # Life scenarios English
│   │   ├── scenarios-ar.json     # Life scenarios Arabic
│   │   ├── traits-en.json        # A/B traits English
│   │   ├── traits-ar.json        # A/B traits Arabic
│   │   ├── sais-en.json          # SAIS questions English
│   │   └── sais-ar.json          # SAIS questions Arabic
│   └── results/
│       ├── types-en.json         # MBTI types English content
│       └── types-ar.json         # MBTI types Arabic content
└── public/
    ├── locales/
    │   ├── en/
    │   │   └── common.json        # English UI translations
    │   └── ar/
    │       └── common.json        # Arabic UI translations
    └── images/                    # Static assets
```

### State Management Architecture

```typescript
// Global Store Structure (Zustand)
interface AppState {
  // Assessment State
  assessment: {
    sessionId: string;
    currentStep: AssessmentStep;
    language: 'en' | 'ar';
    responses: QuestionResponse[];
    selectedFormat: 'scenarios' | 'traits' | 'sais' | null;
    progress: number;
    isComplete: boolean;
  };
  
  // Results State
  results: {
    mbtiType: string | null;
    confidence: number;
    formatSpecificContent: any;
    isLoading: boolean;
  };
  
  // UI State
  ui: {
    theme: 'light' | 'dark';
    direction: 'ltr' | 'rtl';
    sidebarOpen: boolean;
    currentPage: string;
  };
  
  // Chatbot State
  chat: {
    messages: ChatMessage[];
    isTyping: boolean;
    sessionActive: boolean;
  };
}
```

### Routing Architecture

```typescript
// App Router Structure with Internationalization
app/
├── [locale]/                    # Dynamic locale segment (en/ar)
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Landing page
│   ├── assessment/
│   │   ├── layout.tsx          # Assessment flow layout
│   │   ├── page.tsx            # Assessment start
│   │   ├── core/
│   │   │   └── page.tsx        # 4 core questions
│   │   ├── interim/
│   │   │   └── page.tsx        # Interim results
│   │   ├── format/
│   │   │   └── page.tsx        # Format selection
│   │   ├── scenarios/
│   │   │   └── page.tsx        # Life scenarios
│   │   ├── traits/
│   │   │   └── page.tsx        # A/B traits
│   │   └── sais/
│   │       └── page.tsx        # SAIS methodology
│   ├── results/
│   │   ├── layout.tsx          # Results layout
│   │   ├── page.tsx            # Results display
│   │   └── [type]/
│   │       └── page.tsx        # Type-specific results
│   ├── chat/
│   │   └── page.tsx            # AI chatbot interface
│   └── coaching/
│       └── page.tsx            # Lead capture form
├── api/                        # API routes
│   ├── questions/
│   │   └── route.ts
│   ├── calculate-mbti/
│   │   └── route.ts
│   ├── chat/
│   │   └── route.ts
│   └── coaching-leads/
│       └── route.ts
└── globals.css
```
