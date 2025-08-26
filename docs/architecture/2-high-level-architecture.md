# 2. High Level Architecture

### Technical Summary

The MBTI Coaching Platform MVP utilizes a **portable Next.js full-stack architecture** with containerization support, enabling deployment flexibility across Vercel, traditional cloud providers, or self-hosted environments. The system operates without a database in MVP phase, using localStorage for session persistence and static JSON files for content delivery.

**Key Architectural Decisions:**
- **Portable Design:** Docker containerization for platform independence
- **MVP Data Strategy:** localStorage + static files (no database dependency)  
- **Phased Approach:** Ready for Supabase integration in Phase 2
- **Edge-First:** Optimized for edge computing and global performance
- **Bilingual Core:** Native Arabic/English support with RTL layouts

### System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        U[Users - Mobile/Desktop]
        AR[Arabic RTL Support]
        EN[English Support]
    end
    
    subgraph "Application Layer - Containerized"
        NX[Next.js App - Docker Container]
        SSR[SSR/SSG Pages]
        API[API Routes]
        EDGE[Edge-Compatible Functions]
    end
    
    subgraph "Data Layer - MVP"
        LS[localStorage - Session State]
        JSON[Static JSON - Questions/Results]
        MEM[In-Memory - Temporary Cache]
    end
    
    subgraph "Future Phase 2"
        SUPA[Supabase PostgreSQL]
        AUTH[Supabase Auth]
        STORE[Supabase Storage]
    end
    
    subgraph "External Services"
        OAI[OpenAI API - Chatbot]
        VAN[Analytics - Vercel]
    end
    
    U --> NX
    AR --> NX
    EN --> NX
    
    NX --> SSR
    NX --> API
    NX --> EDGE
    
    API --> LS
    API --> JSON
    API --> MEM
    API --> OAI
    
    NX -.-> SUPA
    NX -.-> AUTH
    NX -.-> STORE
    
    NX --> VAN
```
