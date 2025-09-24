# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wordz is a Next.js web application built with React, TypeScript, and Tailwind CSS. The project uses Supabase for backend services and follows modern web development practices with comprehensive tooling for code quality and development workflow.

## Development Commands

### Essential Commands

- `yarn dev` - Start development server (runs on http://localhost:3000)
- `yarn build` - Create production build
- `yarn start` - Start production server
- `yarn lint` - Run ESLint with auto-fix
- `yarn format` - Format code with Prettier

### Package Management

- Uses Yarn (v1.22.22) as the package manager
- Node.js version requirement: >=22.0.0

## Architecture and Structure

### Directory Structure

- `src/app/` - Next.js App Router pages and layouts
- `src/components/ui/` - Reusable UI components (uses shadcn/ui patterns)
- `src/integrations/` - External service integrations (Supabase)
- `src/lib/` - Utility functions and helpers
- `public/` - Static assets
- `supabase/` - Supabase configuration and schema files

### Key Dependencies

- **Next.js 15.5.3** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling framework
- **Supabase** - Backend services (authentication, database)
- **shadcn/ui components** - UI component library using Radix UI primitives

### Component Architecture

- Uses shadcn/ui design patterns with `class-variance-authority` for component variants
- Utility-first CSS with Tailwind CSS
- TypeScript path alias `@/*` maps to `src/*`
- Component styling uses `cn()` utility function for class merging (clsx + tailwind-merge)

### Supabase Integration

- Client configuration in `src/integrations/supabase.ts`
- Requires `SUPABASE_URL` and `SUPABASE_KEY` environment variables
- Environment variables template available in `.env.example`

## Code Quality and Development Workflow

### Linting and Formatting

- ESLint with TypeScript, React, and React Hooks rules
- Prettier for code formatting
- Pre-commit hooks via Husky
- Staged file linting with lint-staged

### TypeScript Configuration

- Strict mode enabled
- Path aliases: `@/*` → `src/*`
- Includes Next.js plugin for enhanced TypeScript support

### Git Workflow

- Husky pre-commit hooks ensure code quality
- lint-staged runs formatting and linting on staged files
- Current branch: `feat/backend`

## Environment Setup

1. Copy `.env.example` to `.env` and configure Supabase credentials
2. Install dependencies: `yarn install`
3. Start development: `yarn dev`

## Important Notes

- Always run `yarn lint` before committing to ensure code quality
- Use the `cn()` utility for combining Tailwind classes in components
- Follow existing component patterns when creating new UI components
- Supabase integration requires proper environment variable configuration
