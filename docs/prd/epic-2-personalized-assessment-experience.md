# Epic 2: Personalized Assessment Experience

**Epic Goal:** Enable users to complete their chosen question format (Life Scenarios, A/B Choice, or SAIS Methodology) with robust state management and deliver contextualized final results that match their assessment approach. This epic delivers the core personalization value proposition by providing 10 additional questions in the user's preferred style and presenting results that are specifically tailored to their chosen format (life-focused insights for scenarios, trait-focused insights for A/B choices, depth-focused insights for SAIS methodology).

### Story 2.1: Life Choice Scenario Questions Implementation
**As a** user who chose Life Choice Scenarios,  
**I want** to answer 10 engaging real-world situation questions that feel relevant to my daily life,  
**so that** my personality assessment feels practical and relatable rather than abstract.

**Acceptance Criteria:**
1. 10 life scenario questions covering remaining MBTI dimensions with balanced coverage
2. Each scenario presents realistic situations with clear choice options (2-3 alternatives per question)
3. Scenarios cover diverse life areas: work decisions, social situations, problem-solving approaches, planning styles
4. Questions display with contextual explanations to eliminate ambiguity
5. Progress indicator continues from interim results (questions 5-14 of total assessment)
6. Response validation ensures user selects one option before proceeding
7. Questions dynamically loaded based on interim results to avoid redundant dimension testing
8. Mobile-optimized interface with touch-friendly selection buttons

### Story 2.2: A/B Personality Choice Questions Implementation
**As a** user who chose A/B Personality Traits,  
**I want** to answer 10 direct personality preference questions with clear either/or choices,  
**so that** I can efficiently express my trait preferences without scenario interpretation.

**Acceptance Criteria:**
1. 10 A/B choice questions covering remaining MBTI dimensions with forced-choice format
2. Each question presents two clear personality trait descriptions (e.g., "I prefer detailed planning" vs. "I prefer spontaneous flexibility")
3. Questions cover cognitive preferences, communication styles, decision-making patterns, and energy sources
4. Clean, minimal interface emphasizing the binary choice without distracting elements
5. Progress indicator continues from interim results (questions 5-14 of total assessment)
6. Response validation prevents proceeding without selection
7. Questions dynamically selected based on interim results to refine unclear dimensions
8. Consistent visual design with scenario format for seamless user experience

### Story 2.3: SAIS Methodology Questions Implementation
**As a** user who chose SAIS Methodology,  
**I want** to answer 10 consciousness-focused questions using a 5-point distribution system that prevents ties,  
**so that** I receive deep, spiritually-aware personality insights based on internal awareness and energy dynamics.

**Acceptance Criteria:**
1. 10 SAIS methodology questions covering remaining MBTI dimensions with consciousness-based framing
2. 5-point distribution interface for each question (users allocate 5 points between A and B options)
3. Visual point allocation system with sliders or point selectors preventing ties
4. Questions focus on internal awareness, energy dynamics, and consciousness themes
5. Progress indicator continues from interim results (questions 5-14 of total assessment)
6. Input validation ensures exactly 5 points distributed per question before proceeding
7. Questions dynamically loaded based on interim results using SAIS methodology sample questions
8. Arabic language support with culturally appropriate consciousness-based terminology
9. Scoring system tracks point distribution for accurate MBTI calculation
10. Mobile-optimized point distribution interface with clear visual feedback
11. The Data/Questions are already in MBTI\src\data\questions\SAIS_questions.md || src\data\results\MBTI_All_Types_Cleaned.md


### Story 2.4: Enhanced State Persistence for Extended Assessment
**As a** user progressing through my chosen format,  
**I want** my extended assessment progress continuously saved with recovery capabilities,  
**so that** I can complete my assessment reliably even with interruptions or technical issues.

**Acceptance Criteria:**
1. Extended assessment state includes format choice, question responses, and current position
2. Auto-save triggers after each question response with multiple persistence layers
3. Server-side backup updated every 2 questions to manage load while ensuring recovery
4. State recovery detects interruptions and offers seamless continuation from exact position
5. Format-specific progress tracking maintains separate question pools and numbering
6. Graceful error handling for storage failures with user notification and retry options
7. Assessment data structure supports both question formats without conflicts
8. State expiration extended to 48 hours for users in extended assessment phase

### Story 2.5: Life-Focused Results for Scenario Users
**As a** user who completed Life Choice Scenarios,  
**I want** results that explain how my personality influences my living patterns, thinking approaches, and daily decisions,  
**so that** I receive actionable insights relevant to real-world situations I encounter.

**Acceptance Criteria:**
1. Results page emphasizes life application over abstract personality theory
2. Insights organized by life domains: relationships, work approaches, decision-making patterns, stress responses
3. Each insight includes specific examples of how personality type manifests in daily situations
4. Action-oriented recommendations for leveraging personality strengths in life contexts
5. Visual presentation uses life-themed imagery and relatable language over clinical terminology
6. Results acknowledge user's scenario-based assessment approach in presentation style
7. Coaching connection options emphasize life coaching and practical guidance services
8. Chatbot prompts focused on life application questions and situational guidance

### Story 2.6: Trait-Focused Results for A/B Choice Users
**As a** user who completed A/B Personality Traits,  
**I want** results that explain my personality traits, professional tendencies, and cognitive preferences,  
**so that** I understand my core personality patterns and can apply them to career and personal development.

**Acceptance Criteria:**
1. Results page emphasizes trait understanding and professional application
2. Insights organized by personality dimensions: cognitive style, communication patterns, work preferences, leadership tendencies
3. Each trait explanation includes professional context and career implications
4. Development recommendations focused on leveraging traits for career advancement
5. Visual presentation uses professional themes and trait-focused language
6. Results acknowledge user's preference for direct trait assessment in presentation approach
7. Coaching connection options emphasize career coaching and professional development services
8. Chatbot prompts focused on trait exploration and professional application questions

### Story 2.7: Depth-Focused Results for SAIS Methodology Users
**As a** user who completed SAIS Methodology questions,  
**I want** results that explain my consciousness patterns, internal energy dynamics, and psychological insights,  
**so that** I understand my personality from a depth perspective focused on inner awareness and consciousness development.

**Acceptance Criteria:**
1. Results page emphasizes consciousness, inner awareness, and psychological understanding
2. Insights organized by consciousness domains: energy source patterns, awareness styles, value-based decision making, life structure preferences
3. Each insight includes examples of how personality type manifests in consciousness and spiritual development
4. Recommendations focused on inner growth, consciousness expansion, and authentic self-expression
5. Visual presentation uses depth-themed imagery and consciousness-focused language
6. Results acknowledge user's preference for consciousness-based assessment approach
7. Coaching connection options emphasize spiritual coaching, consciousness development, and inner work services
8. Chatbot prompts focused on consciousness exploration, inner awareness, and spiritual development questions
9. Arabic language support with appropriate spiritual and consciousness terminology
10. Integration with SAIS scoring system ensuring accurate personality type calculation
11. The Data/Questions are already in MBTI\src\data\questions\SAIS_questions.md || src\data\results\MBTI_All_Types_Cleaned.md

### Story 2.8: Dynamic Results Processing & Reveal Experience
**As a** user completing either assessment format,  
**I want** an engaging transition from my final question to personalized results,  
**so that** I feel anticipation and excitement about discovering my complete personality insights.

**Acceptance Criteria:**
1. Dramatic processing screen displays while final MBTI calculation occurs
2. Processing animation reflects user's chosen format (life scenes for scenarios, trait symbols for A/B, consciousness symbols for SAIS)
3. Calculation API route processes complete 14-question response set with format context
4. Results reveal experience builds anticipation with progressive disclosure of personality type
5. Final MBTI type presentation includes confidence score and assessment completion celebration
6. Smooth transition from processing to format-appropriate results presentation (life-focused, trait-focused, or depth-focused)
7. Error handling provides graceful fallback if calculation fails, with retry options
8. Performance optimization ensures sub-3-second processing time for user satisfaction

