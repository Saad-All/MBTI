# 5. API Specification

Based on the REST API choice from our tech stack, here's the complete OpenAPI 3.0 specification for the MBTI Coaching Platform MVP.

### REST API Specification

```yaml
openapi: 3.0.0
info:
  title: MBTI Coaching Platform API
  version: 1.0.0
  description: |
    RESTful API for MBTI personality assessment platform supporting three assessment formats:
    - Life Scenarios (binary choices)
    - A/B Traits (binary choices) 
    - SAIS Methodology (5-point distribution)
    
    Supports bilingual content (Arabic/English) and session persistence.
    
servers:
  - url: https://mbti-platform.vercel.app/api
    description: Production environment
  - url: http://localhost:3000/api
    description: Local development

paths:
  /questions/{format}:
    get:
      summary: Get questions for specific assessment format
      parameters:
        - name: format
          in: path
          required: true
          schema:
            type: string
            enum: [core, scenarios, traits, sais]
        - name: language
          in: query
          required: true
          schema:
            type: string
            enum: [en, ar]
      responses:
        200:
          description: Questions retrieved successfully
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Question'

  /assessment/validate:
    post:
      summary: Validate question response (especially SAIS distribution)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/QuestionResponse'
      responses:
        200:
          description: Response is valid
        400:
          description: Invalid response (SAIS doesn't total 5)

  /assessment/calculate:
    post:
      summary: Calculate MBTI type from all responses
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                sessionId:
                  type: string
                responses:
                  type: array
                  items:
                    $ref: '#/components/schemas/QuestionResponse'
      responses:
        200:
          description: MBTI type calculated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MBTIResults'

  /chat:
    post:
      summary: AI chatbot conversation
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                message:
                  type: string
                sessionId:
                  type: string
                mbtiType:
                  type: string
                language:
                  type: string
                  enum: [en, ar]
      responses:
        200:
          description: Chatbot response generated
          content:
            application/json:
              schema:
                type: object
                properties:
                  response:
                    type: string
                  timestamp:
                    type: string
                    format: date-time

components:
  schemas:
    Question:
      type: object
      properties:
        id:
          type: integer
        format:
          type: string
          enum: [core, scenarios, traits, sais]
        mbtiDimension:
          type: string
          enum: [E-I, S-N, T-F, J-P]
        content:
          type: object
          properties:
            question:
              type: string
            optionA:
              type: string
            optionB:
              type: string
    
    QuestionResponse:
      type: object
      properties:
        questionId:
          type: integer
        responseType:
          type: string
          enum: [binary, distribution]
        selectedOption:
          type: string
          enum: [A, B]
        distributionA:
          type: integer
          minimum: 0
          maximum: 5
        distributionB:
          type: integer
          minimum: 0
          maximum: 5
      required:
        - questionId
        - responseType
```
