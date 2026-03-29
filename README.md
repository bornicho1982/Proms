# Proms Studio

Proms Studio is a premium SaaS web application for creating, organizing, refining, and managing AI prompts through a polished studio-style interface.

This project is being built as a modern, scalable product with a strong focus on:

- premium UI quality
- clean information architecture
- maintainable frontend engineering
- fast iteration
- future-ready backend integration

## Status

This project is in active development.

The current focus is:

- building a strong frontend foundation
- professionalizing the architecture
- improving UI consistency and product polish
- preparing the codebase for future data integration

## Stack

- Next.js (App Router)
- TypeScript
- Clerk for authentication
- Vercel for deployment
- Supabase planned for database features

## Product goals

Proms Studio is designed to become a focused workspace for prompt creation and management.

Core product goals:

- help users create and organize prompts efficiently
- provide a premium and modern studio experience
- keep the interface elegant, clear, and trustworthy
- support long-term scalability as features grow

## Development principles

The codebase follows these principles:

- modular architecture
- reusable components
- strong TypeScript discipline
- premium, production-minded UI
- maintainable feature evolution
- consistency over improvisation

## Project structure

```text
src/
  app/
  components/
    ui/
    features/
  lib/
  hooks/
  types/
public/
```

The structure will continue evolving as the product grows, but the goal is to keep clear separation between routing, UI primitives, feature components, and shared utilities.

## Authentication

Authentication is handled with Clerk.

Any user/account flows should align with Clerk patterns already present in the codebase.

## Data layer

Supabase is planned as the future database solution, but database integration should only be implemented when the relevant client setup, environment variables, and schema decisions are ready.

Until then, avoid assuming a fully connected backend exists.

## Deployment

The primary deployment target is Vercel.

Implementation decisions should remain compatible with modern Vercel-hosted Next.js applications.

## Getting started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Roadmap

Planned areas of work include:

- stronger design system foundations
- refined studio layouts and navigation
- prompt organization and management workflows
- backend/data integration with Supabase
- improved account-aware experiences with Clerk
- better scalability and production readiness

## Notes for AI agents

This repository includes an `AGENTS.md` file as the primary instruction source for coding agents.
If you are an AI assistant working in this repository, follow `AGENTS.md` first.

## License

Add the project license here when decided.
