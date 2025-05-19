# Coding Standards

This document outlines the coding standards and conventions to be followed for the Design Studio Productivity App project. Adhering to these standards will help maintain code quality, readability, and consistency across the codebase.

## 1. General Principles

*   **Readability:** Write code that is easy to read and understand. Prioritize clarity over conciseness where ambiguity might arise.
*   **Simplicity (KISS - Keep It Simple, Stupid):** Prefer simple solutions over complex ones.
*   **DRY (Don't Repeat Yourself):** Avoid code duplication. Utilize functions, components, and modules to encapsulate reusable logic.
*   **Consistency:** Follow the established patterns and conventions within the project.
*   **Comments:**
    *   Write comments to explain complex logic, non-obvious decisions, or workarounds.
    *   Avoid commenting on obvious code. Good code should be largely self-documenting.
    *   Use `TODO:`, `FIXME:`, `NOTE:` prefixes for actionable comments.

## 2. Language Specific Standards

### 2.1. TypeScript / JavaScript (Frontend & Next.js API Routes)

*   **Style Guide:** We will primarily follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) as a base, with some project-specific adjustments.
*   **Linting & Formatting:**
    *   **ESLint:** Will be configured to enforce code quality and style rules.
    *   **Prettier:** Will be used for automatic code formatting to ensure consistent style.
    *   These will be set up with pre-commit hooks to ensure compliance.
*   **Naming Conventions:**
    *   `camelCase` for variables, functions, and object properties.
    *   `PascalCase` for classes, React components, types, and interfaces.
    *   `UPPER_SNAKE_CASE` for constants.
    *   File names for React components should be `PascalCase.tsx` (e.g., `UserProfile.tsx`).
    *   Other `.ts` or `.js` files should be `camelCase.ts` or `kebab-case.ts`.
*   **Types:**
    *   Use TypeScript for all new code.
    *   Define clear types and interfaces for data structures, props, and function signatures.
    *   Avoid `any` where possible. Use `unknown` for values whose type is truly unknown and perform type checking.
*   **Modules:**
    *   Use ES6 modules (`import`/`export`).
    *   Prefer named exports over default exports for better discoverability and refactoring.
*   **React Specific:**
    *   Functional components with Hooks are preferred over class components.
    *   Follow the rules of Hooks.
    *   Component props should be clearly typed using interfaces.
    *   Keep components small and focused on a single responsibility.

### 2.2. Python (AI Chat Core - FastAPI)

*   **Style Guide:** Follow [PEP 8 -- Style Guide for Python Code](https://www.python.org/dev/peps/pep-0008/).
*   **Linting & Formatting:**
    *   **Flake8:** For linting (combines PyFlakes, pycodestyle, McCabe).
    *   **Black:** For uncompromising code formatting.
    *   **isort:** For sorting imports.
    *   These will be set up with pre-commit hooks.
*   **Naming Conventions:**
    *   `snake_case` for variables, functions, methods, and modules.
    *   `PascalCase` (CapWords) for classes.
    *   `UPPER_SNAKE_CASE` for constants.
*   **Type Hinting:**
    *   Use Python type hints for all new code. This is especially important for FastAPI route handlers and Pydantic models.
*   **Docstrings:**
    *   Write clear docstrings for all modules, classes, functions, and methods, following [PEP 257 -- Docstring Conventions](https://www.python.org/dev/peps/pep-0257/). Google style docstrings are preferred.
*   **FastAPI Specific:**
    *   Use Pydantic models for request and response validation and serialization.
    *   Utilize FastAPI's dependency injection system for cleaner code.

## 3. Commit Messages

*   Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.
*   Example: `feat: add user authentication endpoint`
*   Example: `fix: resolve issue with prompt repository filtering`
*   Example: `docs: update CODING_STANDARDS.md with Python guidelines`

## 4. Directory Structure

*   A clear and consistent directory structure will be established for the frontend (Next.js), backend (Next.js API routes), and the AI Chat Core service. This will be detailed in a separate `DIRECTORY_STRUCTURE.md` or within the README of each sub-project in the monorepo.
    *   (Initial thought for Next.js: `src/app` for app router, `src/components`, `src/lib`, `src/styles`, `src/types`)
    *   (Initial thought for AI Core: standard FastAPI project structure)

## 5. Testing

*   **Unit Tests:** All critical logic, utility functions, and components should have unit tests.
    *   Frontend: Jest + React Testing Library.
    *   AI Core: Pytest.
*   **Integration Tests:** For interactions between different parts of the system (e.g., API route calling AI Core).
*   **End-to-End (E2E) Tests:** (Post-MVP) For critical user flows.
    *   Playwright or Cypress.

## 6. Environment Variables

*   All configuration that varies between environments (local, development, staging, production) or contains sensitive information must be managed via environment variables.
*   A `.env.example` file should be maintained in each service/project root, listing all required environment variables with placeholder or default values.
*   Never commit `.env` files or actual secrets to the repository.

## 7. Review Process

*   All code changes must be submitted via Pull Requests (PRs).
*   PRs must be reviewed by at least one other team member before merging.
*   PRs should include a clear description of the changes and link to any relevant issues.
*   Automated checks (linting, formatting, tests) must pass before a PR can be merged.

This document is a living document and may be updated as the project evolves.