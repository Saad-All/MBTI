# 13. Security

### Security Considerations for MVP

#### API Security

```typescript
// Rate Limiting Configuration
const rateLimits = {
  assessment: "10 requests per minute per IP",
  chat: "5 requests per minute per session", 
  coaching: "2 requests per minute per IP",
  global: "100 requests per minute per IP"
};

// Input Validation
const validationSchema = {
  saisDistribution: {
    pointA: { min: 0, max: 5, type: "integer" },
    pointB: { min: 0, max: 5, type: "integer" },
    total: { exact: 5 } // Must equal exactly 5
  },
  language: { enum: ["en", "ar"] },
  questionId: { type: "string", pattern: /^[a-zA-Z0-9_-]+$/ }
};
```

#### Data Protection

```typescript
// Data Sanitization
const sanitizeUserInput = (input: any) => {
  // Remove XSS vectors
  // Validate MBTI response formats
  // Ensure SAIS distribution compliance
  return cleanInput;
};

// Session Security
const sessionConfig = {
  httpOnly: false, // localStorage based for MVP
  secure: true,    // HTTPS only
  sameSite: "strict",
  maxAge: 3600000  // 1 hour session timeout
};
```

#### API Key Protection

```typescript
// Server-side API key management
const openaiConfig = {
  apiKey: process.env.OPENAI_API_KEY, // Server-side only
  timeout: 30000, // 30 second timeout
  retries: 3,
  model: "gpt-3.5-turbo"
};

// Client-side API calls (no direct OpenAI access)
const clientApiCall = async (endpoint: string, data: any) => {
  return fetch(`/api/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
};
```
