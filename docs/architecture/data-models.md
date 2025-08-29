# 4. Data Models

Based on the PRD requirements and assessment flows, I've identified the core data models that will be shared between frontend and backend. These models are designed to work with both MVP localStorage approach and future Supabase PostgreSQL integration.

### Assessment Session Model

**Purpose:** Tracks user's complete assessment journey including progress, responses, and results across all three formats (Life Scenarios, A/B Traits, SAIS Methodology).

```typescript
interface AssessmentSession {
  sessionId: string;
  language: 'en' | 'ar';
  currentStep: AssessmentStep;
  startTime: Date;
  completionTime?: Date;
  selectedFormat?: 'scenarios' | 'traits' | 'sais';
  coreResponses: QuestionResponse[];
  extendedResponses: QuestionResponse[];
  calculatedType?: string;
  confidence?: number;
  progress: number;
  isComplete: boolean;
}

type AssessmentStep = 
  | 'landing'
  | 'core-questions' 
  | 'interim-results'
  | 'format-selection'
  | 'extended-questions'
  | 'final-results'
  | 'coaching-chat';
```

### Question Response Model with SAIS Validation

**Purpose:** Stores individual question responses with format-specific validation, especially ensuring SAIS 5-point distribution constraints.

```typescript
interface QuestionResponse {
  responseId: string;
  sessionId: string;
  questionId: number;
  questionType: 'core' | 'extended';
  responseType: 'binary' | 'distribution';
  
  // Binary responses (Core + Scenarios + Traits)
  selectedOption?: 'A' | 'B';
  
  // SAIS distribution responses (must total exactly 5)
  distributionA?: number; // 0-5
  distributionB?: number; // 0-5
  
  // Metadata
  responseTime: Date;
  timeSpent: number; // milliseconds
  mbtiDimension: 'E-I' | 'S-N' | 'T-F' | 'J-P';
}

// SAIS Validation Function
function validateSAISDistribution(pointA: number, pointB: number): boolean {
  return (
    pointA >= 0 && pointA <= 5 &&
    pointB >= 0 && pointB <= 5 &&
    pointA + pointB === 5 &&
    Number.isInteger(pointA) &&
    Number.isInteger(pointB)
  );
}

// Valid SAIS combinations: (5,0), (4,1), (3,2), (2,3), (1,4), (0,5)
const VALID_SAIS_COMBINATIONS = [
  [5, 0], [4, 1], [3, 2], [2, 3], [1, 4], [0, 5]
];
```

### MBTI Results Model

**Purpose:** Represents calculated personality assessment results with format-specific content variations.

```typescript
interface MBTIResults {
  sessionId: string;
  calculatedType: string; // e.g., 'ENFP'
  confidence: number; // 0.0 - 1.0
  assessmentFormat: 'scenarios' | 'traits' | 'sais';
  language: 'en' | 'ar';
  
  // Dimension scores
  dimensions: {
    'E-I': { score: number; preference: 'E' | 'I' };
    'S-N': { score: number; preference: 'S' | 'N' };
    'T-F': { score: number; preference: 'T' | 'F' };
    'J-P': { score: number; preference: 'J' | 'P' };
  };
  
  // Format-specific content
  content: {
    title: string;
    description: string;
    strengths: string[];
    challenges: string[];
    careerSuggestions: string[];
    relationshipInsights: string[];
    developmentAreas: string[];
  };
  
  calculatedAt: Date;
}
```

### Question Database Model

**Purpose:** Structured representation of all assessment questions across three formats with bilingual content.

```typescript
interface Question {
  id: number;
  format: 'core' | 'scenarios' | 'traits' | 'sais';
  mbtiDimension: 'E-I' | 'S-N' | 'T-F' | 'J-P';
  
  // Bilingual content
  content: {
    en: {
      question: string;
      optionA: string;
      optionB: string;
      context?: string; // For scenarios
    };
    ar: {
      question: string;
      optionA: string;
      optionB: string;
      context?: string;
    };
  };
  
  // Scoring metadata
  scoring: {
    optionA: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
    optionB: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  };
  
  order: number;
  required: boolean;
}
```
