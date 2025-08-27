# MBTI Coaching Platform

A comprehensive bilingual (English/Arabic) MBTI assessment and coaching platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🌍 **Bilingual Support**: Full Arabic (RTL) and English (LTR) language support
- 🧠 **MBTI Assessment**: Multiple assessment formats (Scenarios, Traits, SAIS 5-point scale)
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- ⚡ **Edge Runtime**: Optimized API routes with Vercel Edge Functions
- 🔄 **State Management**: Zustand for lightweight, efficient state management
- 📱 **Mobile-First**: Responsive design optimized for all devices

## Tech Stack

- **Framework**: Next.js 14.0+ with App Router
- **Language**: TypeScript 5.3+ with strict mode
- **Styling**: Tailwind CSS 3.3+ with RTL support
- **State Management**: Zustand 4.4+
- **Form Management**: React Hook Form 7.48+
- **UI Components**: Headless UI 1.7+ and Radix UI 2.0+
- **Internationalization**: next-i18next 15.2+
- **Runtime**: Node.js 18+ with Edge Runtime

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 10+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MBTI
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Application Configuration  
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENVIRONMENT=development

# Authentication (Future Use)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### API Health Check

Test the health check endpoint:
```bash
curl http://localhost:3000/api/health
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | OpenAI API key for AI-powered features | Yes | - |
| `NEXT_PUBLIC_APP_URL` | Application base URL | Yes | `http://localhost:3000` |
| `NEXT_PUBLIC_ENVIRONMENT` | Environment name | No | `development` |
| `NEXTAUTH_URL` | NextAuth.js URL | No | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | NextAuth.js secret | No | - |

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Internationalized routes (en/ar)
│   │   ├── layout.tsx            # Root layout with providers
│   │   └── page.tsx              # Landing page
│   ├── api/                      # API routes with Edge Runtime
│   │   └── health/route.ts       # Health check endpoint
│   └── globals.css               # Global styles
├── components/                   # Reusable components
│   ├── assessment/               # Assessment-specific components
│   ├── layout/                   # Layout components
│   └── ui/                       # Base UI components
├── lib/                          # Utilities and services
│   ├── stores/                   # Zustand stores
│   ├── services/                 # API clients
│   ├── utils/                    # Helper functions
│   └── types/                    # TypeScript definitions
├── data/                         # Static data files
│   ├── questions/                # Question data by language
│   └── results/                  # Result content
└── public/                       # Static assets
    ├── locales/                  # Translation files
    │   ├── en/common.json        # English translations
    │   └── ar/common.json        # Arabic translations
    ├── fonts/                    # Arabic font files
    └── images/                   # Static images
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Internationalization

The platform supports Arabic and English with:

- **RTL/LTR Layout**: Automatic direction switching
- **Font Loading**: IBM Plex Arabic and Noto Sans Arabic for Arabic content
- **Locale Routing**: `/en/` and `/ar/` route prefixes
- **Language Detection**: Automatic language detection from browser preferences

## Deployment

This project is configured for deployment on Vercel with:

- **Edge Functions**: API routes optimized for Edge Runtime
- **Environment Variables**: Secure configuration management
- **Custom Domain**: SSL certificate support
- **Automatic Deployment**: Connected to Git repository

## License

This project is proprietary and confidential.
