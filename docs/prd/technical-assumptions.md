# Technical Assumptions

### Repository Structure: Monorepo

Single Next.js application repository with clear folder organization for components, API routes, utilities, and styling. This provides optimal developer experience for a single full-stack developer while maintaining clear separation for future scaling.

### Service Architecture

**CRITICAL DECISION:** Next.js Full-Stack Application with Edge Runtime API routes and hybrid data management. The application leverages Next.js's hybrid architecture with server-side rendering for performance, Edge Runtime for fast API responses, and multiple data storage strategies for reliability and flexibility.

**Rationale:** Next.js with enhanced architecture addresses performance risks while maintaining rapid development capability within the 2-week constraint.

### Testing Requirements

**CRITICAL DECISION:** Focused testing strategy emphasizing MBTI algorithm validation with basic integration testing. Prioritize testing for:
- **MBTI scoring algorithm accuracy** (Jest with comprehensive test cases against known results)
- **Critical assessment flows** (Basic E2E for completion paths)
- **API route functionality** (Edge Runtime performance testing)
- **Mobile responsive behavior** (Manual testing checklist)
- **State persistence reliability** (Local + server backup validation)

**Manual testing convenience:** Next.js development server with hot reload plus assessment state debugging tools.

### Additional Technical Assumptions and Requests

**Enhanced Next.js Configuration:**
- **Framework:** Next.js 13+ with Pages Router and built-in internationalization (i18n) support
- **Runtime:** Edge Runtime for API routes to maximize performance and handle concurrent users
- **TypeScript:** Full TypeScript implementation for type safety across frontend and API routes
- **Rendering Strategy:** Hybrid approach optimized for assessment flow performance with locale-based routing
- **Internationalization:** Next.js i18n with Arabic (ar) and English (en) locale support, RTL layout detection

**Frontend Technology Stack:**
- **Styling:** Tailwind CSS with responsive design system and RTL support configuration
- **State Management:** Hybrid approach - React Context for UI state (including locale), multiple persistence layers for assessment data
- **Animations:** Framer Motion for engaging transitions and progress indicators (RTL-compatible)
- **UI Components:** Headless UI for accessible component primitives with RTL layout support
- **Typography:** CSS configuration for Arabic fonts with proper fallbacks and text rendering

**Backend Integration (Enhanced API Routes):**
- **Edge Runtime API Routes:** Fast MBTI calculations with response caching
- **Data Storage:** Vercel KV for dynamic content (questions, configurations), static files for assets
- **Session Management:** Multi-layered persistence (localStorage + sessionStorage + server backup)
- **Validation:** Runtime input validation with comprehensive error handling

**Data Management Strategy:**
- **Dynamic Content:** Vercel KV for multilingual question sets (Life Scenarios, A/B Choice, SAIS Methodology), scoring configurations, A/B testing variants
- **Static Assets:** Next.js public folder for images, Arabic/Latin fonts, base content
- **Internationalization:** Next.js i18n with locale-based routing and content delivery
- **State Persistence:** Progressive enhancement - local storage with server backup including language and methodology preferences
- **Content Versioning:** Dynamic content updates without redeployment, with language-specific and methodology-specific versioning
- **SAIS Integration:** Specialized scoring algorithms for 5-point distribution system with tie prevention

**AI Integration with Fallbacks:**
- **Primary:** OpenAI API integration through Edge Runtime API routes
- **Fallback System:** High-quality static responses categorized by MBTI type and user intent
- **Error Handling:** Graceful degradation ensuring users always receive valuable guidance
- **Cost Control:** Response caching and usage monitoring

**Deployment & Infrastructure:**
- **Primary Hosting:** Vercel (optimized for Next.js) with Edge Runtime deployment
- **Data Storage:** Vercel KV for dynamic content with backup strategies
- **Monitoring:** Vercel Analytics plus custom metrics for completion rates and performance
- **Environment Management:** Vercel environment variables with secrets management

**Performance Optimizations:**
- **Edge Runtime:** Sub-100ms API response times for MBTI calculations
- **Response Caching:** Cache common result patterns to reduce computation load
- **Code Splitting:** Automatic optimization of assessment components
- **Progressive Enhancement:** Core functionality works without JavaScript

**Risk Mitigation Architecture:**
- **Algorithm Validation:** Continuous testing framework with known MBTI result verification
- **State Recovery:** Multiple fallback layers for assessment progress persistence
- **Mobile Reliability:** Comprehensive touch interaction testing and responsive design validation
- **Service Reliability:** Smart fallback systems for all external dependencies

**Security & Compliance:**
- **API Security:** Edge Runtime with rate limiting and input validation
- **Data Protection:** Minimal data persistence with clear retention policies
- **Privacy Ready:** Architecture supports future GDPR compliance when adding user accounts

**Project Structure:**
```
/pages
  /api               # Edge Runtime API routes
  /assessment        # Assessment flow pages
  /results          # Results and chatbot pages
/components         # Essential UI components with RTL support
/lib                # MBTI algorithms, validation, state management, i18n utilities
/utils              # Helpers, fallback responses, caching, locale utilities
/locales            # Translation files (en.json, ar.json)
  /en               # English translations
  /ar               # Arabic translations
/data               # Static configurations, multilingual content
/styles             # Tailwind + global styles + RTL configurations
/public/fonts       # Arabic and Latin font files
```

**This architecture delivers the MVP within 3-week timeline (including SAIS methodology) while building confidence in scalability and reliability.**
