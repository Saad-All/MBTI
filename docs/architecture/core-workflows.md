# 8. Core Workflows

The following sequence diagrams illustrate key system workflows showing component interactions, external API integration, and error handling paths for critical user journeys.

### Complete Assessment Flow - End-to-End Journey

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend App
    participant SM as State Manager
    participant API as API Gateway
    participant CE as MBTI Calculator
    participant SA as Storage Adapter
    participant CR as Content Repository
    participant RR as Results Renderer

    Note over U,RR: Complete Assessment Journey (14-16 questions)

    U->>FE: Visit landing page
    FE->>U: Display language selection
    U->>FE: Select language (ar/en)
    FE->>SM: Initialize session
    SM->>SA: Create session in localStorage
    
    Note over U,RR: Core Questions Phase (4 questions)
    
    FE->>API: GET /api/questions/core?lang=ar
    API->>CR: Fetch core questions
    CR->>API: Return 4 core questions
    API->>FE: Questions in Arabic
    
    loop Core Questions (4 times)
        FE->>U: Display question with A/B options
        U->>FE: Select option (A or B)
        FE->>SM: Store response
        SM->>SA: Save to localStorage
    end
    
    Note over U,RR: Interim Results Phase
    
    FE->>API: POST /api/assessment/calculate-interim
    API->>CE: Calculate preliminary type
    CE->>API: Return interim insights
    API->>FE: Interim results
    FE->>U: Show interim personality insights
    
    Note over U,RR: Format Selection Phase
    
    FE->>U: Display 3 format options
    U->>FE: Select format (scenarios/traits/sais)
    FE->>SM: Store format choice
    
    Note over U,RR: Extended Questions Phase (10-12 questions)
    
    FE->>API: GET /api/questions/{format}?lang=ar
    API->>CR: Fetch format-specific questions
    CR->>API: Return extended questions
    
    alt SAIS Format Selected
        loop SAIS Questions (12 times)
            FE->>U: Display 5-point distribution UI
            U->>FE: Distribute 5 points (A+B=5)
            FE->>API: POST /api/assessment/validate
            API->>CE: Validate distribution totals 5
            CE->>API: Validation result
            alt Invalid Distribution
                API->>FE: Error: Points don't total 5
                FE->>U: Show error, request correction
            else Valid Distribution
                FE->>SM: Store valid response
                SM->>SA: Save to localStorage
            end
        end
    else Binary Format (Scenarios/Traits)
        loop Extended Questions (10 times)
            FE->>U: Display question with A/B options
            U->>FE: Select option (A or B)
            FE->>SM: Store response
            SM->>SA: Save to localStorage
        end
    end
    
    Note over U,RR: Final Results Calculation
    
    FE->>API: POST /api/assessment/calculate-final
    API->>SM: Get all responses
    SM->>SA: Retrieve from localStorage
    SA->>SM: Return complete response set
    SM->>API: Send all responses
    API->>CE: Calculate final MBTI type
    CE->>API: Return results with confidence
    
    API->>CR: Get format-specific content
    CR->>API: Return personalized content
    API->>FE: Complete results package
    
    FE->>RR: Render results page
    RR->>U: Display personality type & insights
    
    Note over U,RR: Optional Coaching Chat
    
    U->>FE: Click "Ask Questions" button
    FE->>API: POST /api/chat/initialize
    API->>SM: Get MBTI type & language
    SM->>API: Return user context
    API->>FE: Chat session ready
    FE->>U: Display chat interface
```

### SAIS 5-Point Distribution Validation Workflow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as SAIS UI Component
    participant VL as Validation Layer
    participant SM as State Manager

    Note over U,SM: SAIS 5-Point Distribution Validation

    U->>UI: Interact with slider/input for Option A
    UI->>VL: Validate current value (0-5)
    
    alt Valid Range
        VL->>UI: Value accepted
        UI->>UI: Auto-calculate Option B (5 - A)
        UI->>U: Update Option B display
        
        UI->>VL: Validate total (A + B = 5)
        
        alt Total Equals 5
            VL->>UI: Distribution valid
            UI->>U: Show confirmation (green state)
            U->>UI: Submit response
            UI->>SM: Store valid response
            SM->>UI: Proceed to next question
        else Total Not Equal 5
            VL->>UI: Distribution invalid
            UI->>U: Show error state (red highlighting)
            UI->>U: Disable submit button
        end
        
    else Invalid Range
        VL->>UI: Value rejected
        UI->>U: Reset to previous valid value
        UI->>U: Show range error message
    end
```
