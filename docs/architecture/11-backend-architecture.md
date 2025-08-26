# 11. Backend Architecture

### API Layer Architecture

The backend follows a clean architecture pattern with clear separation of concerns, designed for the MVP's lightweight requirements while being ready for future database integration.

#### API Routes Structure

```typescript
// Core API Architecture
src/app/api/
├── questions/
│   ├── route.ts              # GET /api/questions
│   ├── core/route.ts         # GET /api/questions/core
│   ├── scenarios/route.ts    # GET /api/questions/scenarios
│   ├── traits/route.ts       # GET /api/questions/traits
│   └── sais/route.ts         # GET /api/questions/sais
├── assessment/
│   ├── validate/route.ts     # POST /api/assessment/validate
│   ├── progress/route.ts     # GET/POST /api/assessment/progress
│   └── calculate/route.ts    # POST /api/assessment/calculate
├── results/
│   ├── route.ts              # GET /api/results/[type]
│   └── content/route.ts      # GET /api/results/content
├── chat/
│   ├── route.ts              # POST /api/chat
│   └── context/route.ts      # GET /api/chat/context
└── coaching/
    └── leads/route.ts        # POST /api/coaching/leads
```

#### Service Layer Architecture

```typescript
// Service Layer Design
services/
├── AssessmentService.ts      # Business logic for assessments
├── MBTICalculatorService.ts  # MBTI type calculation engine
├── ContentService.ts         # Bilingual content management
├── ValidationService.ts      # Response validation (SAIS 5-point)
├── ChatbotService.ts        # OpenAI integration
├── StorageService.ts        # localStorage abstraction
└── AnalyticsService.ts      # Usage tracking
```
