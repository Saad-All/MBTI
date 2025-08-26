# 7. External APIs

Based on the PRD requirements and component design, the MBTI platform requires integration with specific external services for AI chatbot functionality and analytics.

### OpenAI API

- **Purpose:** AI-powered chatbot providing personalized MBTI guidance and post-assessment conversation
- **Documentation:** https://platform.openai.com/docs/api-reference
- **Base URL(s):** https://api.openai.com/v1
- **Authentication:** Bearer token (API key in headers)
- **Rate Limits:** 3,500 requests/minute (Tier 1), 10,000 tokens/minute

**Key Endpoints Used:**
- `POST /chat/completions` - Generate chatbot responses with MBTI context
- `GET /models` - Verify available models and capabilities

**Integration Notes:** 
- Primary model: `gpt-3.5-turbo` for cost efficiency
- Fallback model: `gpt-4` for complex personality analysis
- Context window: 4,000 tokens per conversation
- Response streaming for better UX

### Vercel Analytics (Optional - Post-MVP)

- **Purpose:** User behavior tracking and performance monitoring
- **Documentation:** https://vercel.com/docs/analytics
- **Base URL(s):** Built into Vercel platform
- **Authentication:** Automatic with Vercel deployment
- **Rate Limits:** No explicit limits (usage-based billing)

**Key Metrics Tracked:**
- Assessment completion rates
- Format selection preferences
- Session duration and drop-off points
- Geographic distribution of users
- Language preference analytics
