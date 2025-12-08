# Kick Deal Frontend - Copilot Instructions

## Project Overview

**Kick Deal** is a Next.js 14 e-commerce marketplace for soccer/football equipment. It features:
- Product browsing with category-based filtering (축구화, 풋살화, 유니폼, etc.)
- Real-time chat using WebSocket (STOMP protocol) with Bearer token authentication
- User authentication with JWT tokens (access-token, refreshtoken stored in localStorage)
- Responsive UI that disables mobile view (screens ≤1051px show blank page)

## Core Architecture

### Frontend Stack
- **Framework**: Next.js 14 (App Router) with 'use client' directive for interactivity
- **Styling**: Emotion (@emotion/styled) + Tailwind CSS + CSS Modules
- **HTTP**: axios with baseURL pattern: `https://api.leegunwoo.com`
- **Real-time**: @stomp/stompjs for WebSocket messaging in chat feature
- **Language**: TypeScript with strict mode enabled

### Key Services/Flows

1. **Authentication** (`src/app/login/page.tsx`, `src/components/loginform.tsx`)
   - POST to `/users` endpoint with email/password
   - Stores `access-token`, `refreshtoken` in localStorage
   - Header component fetches user info on mount if token exists

2. **Product Details** (`src/app/product/[id]/page.tsx`)
   - Dynamic route with product ID
   - Fetches from `/products/{id}` (no auth required for GET)
   - Category conversion using `Category.tsx` utility (display names)
   - Routes conversion using `RouterCategory.tsx` (URL paths)

3. **Chat System** (`src/app/chatRoom/[id]/page.tsx`, `src/hooks/useWebsoket.ts`)
   - WebSocket connection at room ID with STOMP protocol
   - Message interface: `{ id, content, sender, timeStamp, senderName }`
   - Connection states: 'idle' | 'connecting' | 'connected' | 'error'
   - Requires valid access-token; returns 'NO_TOKEN' error if missing
   - `setMessages` state is exposed for external updates
   - **Important**: See full `useWebsoket.ts` for deduplication logic and connect Promise handling

### Category Mapping

Categories are enum-like constants mapped between:
- API format (SOCCER_SHOE, FOOTBALL_SHOE, etc.)
- Display names (축구화, 풋살화, etc.) - `Category.tsx`
- URL routes (soccershoe, footballshoe, etc.) - `RouterCategory.tsx`

## Development Workflow

### Commands
```bash
npm run dev       # Start dev server on http://localhost:3000
npm run build     # Production build
npm run lint      # ESLint with Next.js config
npm run start     # Serve production build
```

### File Organization
- `src/app/` - Page components (route-based, use '[id]' for dynamic routes)
- `src/components/` - Shared components (Header, NavigationBar, LoginForm, etc.)
- `src/hooks/` - Custom React hooks (useWebSocket for STOMP communication)
- `src/utils/` - Utility functions/constants (Category mappings)

## Critical Patterns & Conventions

### State Management & Token Handling
```tsx
// Always check for access-token before making authenticated requests
const token = localStorage.getItem('access-token');
// Never forget Bearer prefix in Authorization header
headers: { Authorization: `Bearer ${token}` }
```

### useWebSocket Hook Pattern
- Manages STOMP client lifecycle (connect/disconnect)
- Exposes `messages`, `connectionState`, `sendMessage`, `sendTyping`
- Call `await connect()` before sending messages (idempotent - won't reconnect if already connected)
- Handle 'NO_TOKEN' error gracefully (redirect to login)

### Client Components
- Most pages use `'use client'` directive (interactive components)
- Layout is hybrid: checks `isMobile` at runtime, shows blank page if true (see `src/app/layout.tsx`)
- Responsive breakpoint: 1051px

### Styling
- Emotion styled components are primary pattern (`styled.div`, `styled.button`, etc.)
- Tailwind CSS is available but not heavily used in current codebase
- Color scheme: Main color `#ff4757` (red) used in chat components

### API Patterns
- All requests use axios with full URL (https://api.leegunwoo.com)
- GET requests typically unguarded; POST/PATCH/DELETE require `Authorization: Bearer {token}`
- Error handling: catch blocks log to console, user-friendly alerts in UI
- Loading states managed with useState, no global state library (Redux not used)

## Common Tasks

### Adding a New Product Category
1. Add category enum value to backend API
2. Add mapping in `src/utils/Category.tsx` (display name)
3. Add route mapping in `src/utils/RouterCategory.tsx` (URL path)
4. Create new page in `src/app/{routeName}/page.tsx` if needed

### Creating a New Authenticated Page
```tsx
'use client';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function NewPage() {
  const token = localStorage.getItem('access-token');
  if (!token) router.push('/login');
  // fetch with: headers: { Authorization: `Bearer ${token}` }
}
```

### Sending Chat Messages
```tsx
const { messages, sendMessage, connectionState } = useWebSocket(roomId);
if (connectionState === 'connected') {
  sendMessage({ content: 'message text' });
}
```

## Known Quirks & Gotchas

1. **Mobile Blocking**: Layout returns empty `<div/>` for screens ≤1051px (intentional design)
2. **Dynamic Routes**: Must use `useParams()` to access `[id]` parameters in page components
3. **WebSocket Token**: Connection fails silently if token expires mid-session (no auto-refresh implemented)
4. **Lint Errors**: Some minor ESLint warnings exist in form components (unused variables, etc.) - run `npm run lint` to see
5. **Username Storage**: Header stores username in localStorage under key "name" after first load
