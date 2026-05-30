# KRATOS 1.0 — Anti-Backend Rules

## 1. Absolute Prohibitions

### 1.1 Backend Directory Structure
**NEVER MODIFY**: `backend/` directory and all its subdirectories
- `backend/app/` - FastAPI application core
- `backend/data/` - SQLite databases and data files
- `backend/services/` - Python service implementations
- `backend/lib/` - Shared library code
- `backend/tests/` - Test suite
- Any `.py` files within the backend directory

### 1.2 Data Layer
**NEVER MODIFY**: Data storage and schema definitions
- SQLite database files (`*.db`)
- Database schema definitions
- Data migration scripts
- Seed data files
- Data model definitions

### 1.3 API Contracts
**NEVER MODIFY**: API endpoint contracts and routing
- FastAPI route definitions
- API request/response schemas
- Endpoint URLs and HTTP methods
- Authentication and authorization logic
- CORS and middleware configurations

### 1.4 Service Layer
**NEVER MODIFY**: Business logic and service implementations
- Collector implementations
- Service function definitions
- Business rule implementations
- Integration with external systems
- Data processing pipelines

## 2. Allowed Frontend Modifications

### 2.1 Visual Layer Only
**ONLY MODIFY**: Presentation and user interface components
- CSS styles and design tokens
- React component structure and layout
- UI state management
- Visual feedback and animations
- Accessibility enhancements

### 2.2 Data Consumption
**ALLOWED**: Reading from existing API endpoints
- Use existing `useLiveKratos.ts` hook
- Use existing `useApi.ts` hook
- Consume data from `/live/stream` SSE endpoint
- Consume data from `/live/snapshot` REST endpoint
- Consume data from `/mission/lens` endpoint
- Any other existing GET endpoints

### 2.3 Component Creation
**ALLOWED**: Creating new UI components
- GlassPanel and related components
- Status indicators and badges
- Layout components (cards, grids, etc.)
- Interactive elements (buttons, inputs, etc.)
- Data visualization components

## 3. Specific Component Rules

### 3.1 Live Data Hooks
**READ-ONLY**: Existing live data hooks
- `useLiveKratos.ts` - SSE connection management
- `useApi.ts` - REST API consumption
- These hooks are already implemented and working
- Create new hooks only for additional UI state, not data fetching

### 3.2 Existing Components
**CAN EXTEND**: Existing UI components in `components/ui/`
- Add new variants or props
- Create new components following existing patterns
- Reuse existing CSS classes and design tokens
- Maintain consistent API design

### 3.3 New Components
**CREATE FREELY**: New UI components following design system
- GlassPanel components
- StatusChip/SeverityBadge components
- LoadingSkeleton variants
- EmptyState/ErrorState customizations
- Any visual components that enhance the UI

## 4. CSS and Styling Rules

### 4.1 Design Tokens
**USE EXCLUSIVELY**: Existing design tokens from `tokens.css`
- Color variables (`--kr-*`)
- Spacing variables (`--kr-space-*`)
- Typography variables (`--kr-font-*`)
- Motion variables (`--kr-duration-*`, `--kr-ease-*`)
- Do not create new CSS custom properties

### 4.2 CSS Classes
**EXTEND CAREFULLY**: Existing CSS class system
- Use existing utility classes when possible
- Create new classes following BEM-like naming
- Prefix new classes with `kr-` for consistency
- Do not override existing component styles globally

### 4.3 Component Styles
**SCOPE PROPERLY**: CSS-in-JS or component-level styling
- Use inline styles for dynamic values
- Use CSS modules for component-specific styles
- Avoid global CSS changes
- Maintain encapsulation

## 5. Integration Points

### 5.1 API Consumption
**CONSUME ONLY**: Existing endpoints with no modifications
- `/live/stream` - Server-Sent Events for live updates
- `/live/snapshot` - REST endpoint for current state
- `/mission/lens` - Mission intelligence data
- `/health` - System health status
- Any other existing GET endpoints

### 5.2 Data Transformation
**TRANSFORM IN UI**: Data formatting and presentation logic
- Date formatting and localization
- Number formatting and units
- Text truncation and ellipsis
- Sorting and filtering in memory
- State derivation and computation

### 5.3 Error Handling
**HANDLE GRACEFULLY**: API errors and edge cases
- Network errors and timeouts
- HTTP error status codes
- Invalid or missing data
- Rate limiting and throttling
- Fallback to cached or mock data

## 6. Testing and Validation

### 6.1 Build Requirements
**MUST PASS**: All existing build and test processes
- `npm run build` must succeed
- `npm run test` must pass
- No TypeScript compilation errors
- No ESLint warnings or errors

### 6.2 Runtime Validation
**MUST WORK**: With existing backend unchanged
- SSE connection must remain functional
- REST endpoints must return expected data
- No breaking changes to data contracts
- Backward compatibility maintained

### 6.3 Performance Requirements
**MUST MEET**: Performance and loading criteria
- No blocking of main thread
- Efficient re-renders and updates
- Proper loading states and skeletons
- Memory leak prevention

## 7. Emergency Stop Conditions

### 7.1 Backend Modification Detection
**IMMEDIATE STOP**: If any backend file is modified
- Any `.py` file change
- Any database file modification
- Any configuration file change in backend
- Any service implementation change

### 7.2 API Contract Violation
**IMMEDIATE STOP**: If API consumption breaks contracts
- Sending data to GET-only endpoints
- Expecting modified response formats
- Calling non-existent endpoints
- Ignoring required authentication

### 7.3 Build Failure
**IMMEDIATE STOP**: If build process fails
- TypeScript compilation errors
- CSS processing failures
- Asset optimization errors
- Bundle size limits exceeded

## 8. Safe Practices

### 8.1 Component Isolation
**RECOMMENDED**: Create self-contained components
- Single responsibility principle
- Clear prop interfaces
- Internal state management
- Proper error boundaries

### 8.2 Data Flow Patterns
**RECOMMENDED**: Follow established data patterns
- Unidirectional data flow
- Container/presentational component separation
- State lifting when necessary
- Context for shared state

### 8.3 Error Boundaries
**RECOMMENDED**: Implement proper error handling
- Component-level error boundaries
- Graceful degradation
- User-friendly error messages
- Recovery mechanisms

These rules ensure that frontend development can proceed safely without risking the stability and integrity of the existing backend system. Any violation of these rules should be immediately corrected or the work stopped.