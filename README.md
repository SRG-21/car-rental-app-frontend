# Car Rental Portfolio App

A production-grade React + Vite + TypeScript car rental application showcasing SDE-3 level fullstack development skills.

## 🚀 Features

- **Advanced Search**: Location-based car search with interactive map (React Leaflet + OpenStreetMap)
- **Smart Filtering**: Filter by fuel type, seats, and sort by distance
- **Authentication**: Complete auth flow with JWT tokens and automatic refresh
- **Booking System**: End-to-end car rental booking with optimistic updates
- **Booking History**: View and manage past and upcoming rentals
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Accessibility**: WCAG 2.1 compliant with full keyboard navigation
- **Testing**: Comprehensive unit, integration, and E2E tests
- **API Mocking**: MSW for development and testing without backend

## 🛠 Tech Stack

### Frontend
- **React 18+** - UI library with latest features
- **Vite 5+** - Lightning-fast build tool
- **TypeScript 5+** - Type safety throughout
- **React Router v6** - Client-side routing

### State Management
- **TanStack Query v5** - Server state management with caching
- **React Context** - Auth state management

### Styling
- **Tailwind CSS 3+** - Utility-first CSS framework
- **PostCSS** - CSS processing

### API & Mocking
- **Axios** - HTTP client with interceptors
- **MSW v2.x** - API mocking for dev and tests

### Testing
- **Vitest** - Unit test framework
- **React Testing Library** - Component testing
- **Playwright** - E2E testing

### Code Quality
- **ESLint** - Linting with TypeScript + React rules
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting

## 📦 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
copy .env.example .env

# Initialize MSW service worker
npx msw init public/ --save
```

### Environment Configuration

The app supports both mocked and real API modes:

**`.env` Configuration:**
```env
# API URL (for real backend)
VITE_API_URL=http://localhost:3000

# Enable/Disable MSW Mocking
VITE_ENABLE_MOCKING=true   # Use mock data (no backend needed)
# VITE_ENABLE_MOCKING=false # Use real backend API
```

**Modes:**
- **Mock Mode** (`VITE_ENABLE_MOCKING=true`): MSW intercepts all API calls with mock data
- **Real API Mode** (`VITE_ENABLE_MOCKING=false`): Connects to actual backend server

### Development

```bash
# Start dev server with MSW (default)
npm run dev

# Open http://localhost:5173
```

**To switch between mock and real API:**
1. Edit `.env` file
2. Set `VITE_ENABLE_MOCKING=true` for mock mode (no backend needed)
3. Set `VITE_ENABLE_MOCKING=false` for real API mode (backend required)
4. Restart dev server

The app runs with MSW (Mock Service Worker) by default, so no backend is needed for development.

### Testing

```bash
# Run unit tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run e2e

# Run E2E tests with UI
npm run e2e:ui

# Type checking
npm run typecheck

# Linting
npm run lint

# Format code
npm run format
```

### Build

```bash
# Production build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/           # Base UI components (Button, Input, etc.)
│   ├── ErrorBoundary.tsx
│   ├── Layout.tsx
│   ├── LoadingSpinner.tsx
│   └── ProtectedRoute.tsx
├── contexts/         # React Context providers
│   └── AuthContext.tsx
├── hooks/            # Custom React hooks
│   ├── useAuth.ts
│   ├── useSearch.ts
│   ├── useCar.ts
│   ├── useBookings.ts
│   └── useDebounce.ts
├── mocks/            # MSW configuration
│   ├── handlers/     # API route handlers
│   ├── data/         # Seed data
│   ├── browser.ts    # Browser worker
│   └── server.ts     # Node server for tests
├── pages/            # Page components
│   ├── Auth/         # Login, Signup
│   ├── Search/       # Search with map and filters
│   ├── Car/          # Car details
│   ├── Booking/      # Booking flow
│   ├── Profile/      # Profile and booking history
│   └── NotFoundPage.tsx
├── services/         # API services
│   ├── api.ts        # Axios instance with interceptors
│   ├── auth.service.ts
│   ├── car.service.ts
│   └── booking.service.ts
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
│   ├── geo.ts        # Haversine distance calculation
│   ├── date.ts       # Date formatting & validation
│   ├── token.ts      # Token storage & decoding
│   └── format.ts     # Number/string formatting
├── styles/           # Global CSS
└── tests/            # Test setup and utilities
```


## 🏗 Architecture Highlights

### Clean Architecture
- **Separation of Concerns**: Services, hooks, components
- **Type Safety**: End-to-end TypeScript coverage
- **API Layer**: Centralized Axios instance with interceptors

### Token Refresh Queue
Prevents duplicate refresh token calls when multiple requests fail with 401:
```typescript
// Token refresh queue to prevent race conditions
let isRefreshing = false;
let failedQueue: Array<{resolve, reject}> = [];
```

### Debounced Search
Reduces API calls during user input:
```typescript
const useDebounce = (value, delay) => {
  // Delays API call by 300ms after user stops typing
};
```

### Optimistic Updates
Immediately shows booking in UI before server confirmation:
```typescript
queryClient.setQueryData(['bookings'], (old) => [...old, newBooking]);
```

### Accessibility Features
- Semantic HTML5 elements
- ARIA labels and roles
- Focus management
- Keyboard navigation
- Skip to content link
- Screen reader announcements

### Performance Optimizations
- Code splitting with React.lazy()
- Image placeholders
- TanStack Query caching (5min stale time)
- Debounced search
- Memoized calculations




## 🧪 Testing Strategy

### Test Pyramid
- **70% Unit Tests**: Components, utils, hooks
- **20% Integration Tests**: User flows with MSW
- **10% E2E Tests**: Critical paths with Playwright

### Coverage Thresholds
```json
{
  "statements": 70,
  "branches": 65,
  "functions": 70,
  "lines": 65
}
```

## 🎯 Production Considerations

For production deployment, consider:

1. **Backend Integration**: Replace MSW with real API endpoints
2. **Security**:
   - Move tokens from localStorage to httpOnly cookies
   - Add CSRF protection
   - Implement rate limiting
3. **Monitoring**:
   - Add Sentry for error tracking
   - Add analytics (Google Analytics, Mixpanel)
4. **Performance**:
   - Configure CDN for static assets
   - Add service worker for offline support
   - Implement progressive image loading
5. **SEO**:
   - Add meta tags for each page
   - Implement server-side rendering (Next.js)
6. **Compliance**:
   - GDPR cookie consent
   - Privacy policy

## 💡 Interview Talking Points

This project demonstrates:

1. **Race Condition Handling**: Token refresh queue prevents duplicate calls
2. **Optimistic Updates**: Better UX with immediate feedback
3. **Debouncing**: Reduces API calls and improves performance
4. **Type Safety**: Full TypeScript coverage for maintainability
5. **Testing Best Practices**: Comprehensive test coverage with proper mocking
6. **Accessibility**: WCAG 2.1 compliance for inclusive design
7. **Security**: JWT auth flow with automatic token refresh
8. **Performance**: Code splitting, caching, and optimization techniques
9. **Clean Architecture**: Separation of concerns, SOLID principles
10. **Developer Experience**: ESLint, Prettier, Husky for code quality

## 📝 License

MIT

