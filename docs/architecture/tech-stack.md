# 3. Tech Stack

This is the **DEFINITIVE technology selection** for the entire project. All development must use these exact versions.

### Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| **Frontend Language** | TypeScript | 5.3+ | Type-safe development | Prevents runtime errors, essential for complex MBTI logic |
| **Frontend Framework** | Next.js | 14.2+ | Full-stack React framework | SSR/SSG capabilities, App Router, built-in i18n |
| **UI Component Library** | Headless UI + Radix | 1.7+ / 2.0+ | Unstyled accessible components | Flexibility for custom SAIS 5-point UI, RTL support |
| **State Management** | Zustand | 4.4+ | Lightweight state management | Simple API, TypeScript native, perfect for assessment flows |
| **Styling Framework** | Tailwind CSS | 3.3+ | Utility-first styling | Rapid development, RTL support, consistent design system |
| **Form Management** | React Hook Form | 7.48+ | Form validation and state | Complex SAIS 5-point validation, performance optimized |
| **Internationalization** | next-i18next | 15.2+ | Bilingual support | Native Next.js integration, RTL support, type-safe |
| **API Type** | REST | Native | Backend communication | Simple, predictable, edge-compatible |
| **Runtime Environment** | Node.js | 18+ | Server execution | Stable LTS, Vercel optimized, container compatible |
| **Package Manager** | npm | 10+ | Dependency management | Built-in, reliable, widespread adoption |
| **Containerization** | Docker | 24+ | Portable deployment | Multi-platform deployment capability |

### Verified Compatible Package.json

```json
{
  "dependencies": {
    "next": "14.2.32",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "typescript": "5.3.3",
    "@headlessui/react": "^1.7.17",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-progress": "^1.0.3",
    "tailwindcss": "^3.3.6",
    "clsx": "^2.0.0",
    "@heroicons/react": "^2.2.0",
    "zustand": "^4.4.7",
    "react-hook-form": "^7.48.2",
    "next-i18next": "^15.2.0",
    "openai": "^4.20.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/node": "^20.9.0",
    "eslint": "^8.53.0",
    "eslint-config-next": "14.2.32",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31"
  }
}
```

