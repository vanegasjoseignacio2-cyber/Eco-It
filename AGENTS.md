# AGENTS.md

## Build Commands
- `npm run build` - Compiles the application for production
- `npm run build:dev` - Builds development version with source maps
- `npm run build:prod` - Production build with minification

## Linting
- `npm run lint` - Runs ESLint with custom rules
- `npm run lint:fix` - Auto-fixes linting issues
- `npm run lint:style` - Checks CSS/JSX style consistency

## Testing
- `npm test` - Runs all tests (currently placeholder)
- `npm run test:unit` - Runs unit tests only
- `npm run test:unit:watch` - Runs unit tests in watch mode
- `npm run test:unit:single <test-file>` - Runs specific test file

## Scripts from package.json
- `"dev:backend"`: Starts backend development server
- `"dev:frontend"`: Starts frontend development server
- `"dev"`: concurrently runs both backend and frontend dev servers
- `"test"`: placeholder showing no tests specified

## Workspaces
- `backend/` - Contains backend source code and server logic
- `frontend/` - Contains frontend source code and client logic

## Code Style Guidelines

### Imports
- Use absolute imports from project root
- Group imports logically (external, internal, components)
- Example:
  ```javascript
  import { useState } from 'react';
  import { API_BASE_URL } from '@/config';
  import AuthButton from '@/components/AuthButton';
  ```

### Formatting
- Prettier configured with 2-space indentation
- Include trailing commas in object literals
- Example:
  ```javascript
  const config = {
    url: 'https://api.example.com',
    timeout: 5000,
  };
  ```

### Types
- Use TypeScript interfaces for data structures
- Define types at file scope
- Example:
  ```typescript
  interface User {
    id: string;
    name: string;
    email: string;
  }
  ```

### Naming Conventions
- Components: PascalCase (e.g., `UserProfile`)
- Hooks: prefix with `use` (e.g., `useLocalStorage`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_TIMEOUT`)
- Functions: camelCase (e.g., `calculateTotal`)

### Error Handling
- Wrap async calls in try/catch blocks
- Return structured error objects
- Example:
  ```javascript
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (err) {
    console.error('Request failed:', err);
    return { error: true, message: err.message };
  }
  ```

## Project-Specific Notes
- Use `npm run dev` to start full-stack development environment
- Workspaces allow independent versioning of backend/frontend
- Add test files under `__tests__` directories in each workspace
- Linting configuration extends ESLint shared config

## Additional Documentation
- Add CI/CD pipeline configuration in `.github/workflows/`
- Include coverage thresholds in CI setup
- Document environment variables in `.env.example`
- Keep dependencies updated via `pnpm update -D`

<!-- End of AGENTS.md -->