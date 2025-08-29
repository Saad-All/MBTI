# 1. Introduction

This document outlines the complete fullstack architecture for MBTI Coaching Platform MVP, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.

This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process for modern fullstack applications where these concerns are increasingly intertwined.

### Starter Template or Existing Project

Based on the PRD and front-end specification, this is a **greenfield project** with specific technology recommendations:
- **Framework:** Next.js 14.2+ with App Router (specified in PRD)
- **Deployment:** Portable containerized architecture supporting Vercel, AWS, GCP, and self-hosted
- **Database:** MVP without database (localStorage), Phase 2 with Supabase PostgreSQL
- **Internationalization:** Bilingual support (English/Arabic) with RTL layouts

