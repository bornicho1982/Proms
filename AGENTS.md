# AGENTS.md — Proms Studio

## Mission

Proms Studio is a premium SaaS web application for creating, organizing, refining, and managing AI prompts in a modern studio-style interface.

The goal of the product is to feel:

- premium
- clean
- modern
- fast
- focused
- production-ready

Every change made to this project must improve at least one of these dimensions:

- usability
- consistency
- maintainability
- visual quality
- scalability
- performance

## Product direction

Proms Studio is not a quick prototype or generic dashboard.
It should evolve as a polished product with strong UI taste, clear structure, and disciplined engineering standards.

The user experience should feel intentional, elegant, and trustworthy.
Avoid anything that looks unfinished, overly template-like, visually noisy, or technically improvised.

## Current stack

- Framework: Next.js (App Router)
- Language: TypeScript
- Styling: CSS and component-based styling system
- Authentication: Clerk
- Deployment target: Vercel
- Planned database: Supabase (not fully implemented yet)

## Source of truth

When making decisions, prioritize in this order:

1. Existing working code in the repository
2. This AGENTS.md file
3. Framework best practices for the current version in use
4. Simplicity, maintainability, and consistency

If project files and assumptions conflict, trust the actual repository state first.

## Critical implementation rules

- Use App Router conventions only
- Prefer Server Components by default
- Add `"use client"` only when interactivity actually requires it
- Do not introduce Pages Router patterns
- Keep TypeScript strict and explicit
- Do not use `any` unless absolutely necessary and clearly justified
- Do not fabricate infrastructure that does not exist yet
- Do not assume Supabase is already connected unless the repository confirms it
- Treat Clerk as the active authentication solution
- Keep all implementation compatible with Vercel deployment
- Preserve and improve the current codebase instead of rewriting without reason

## Engineering philosophy

Write code like a senior frontend engineer building a real SaaS product.

This means:

- readable over clever
- scalable over rushed
- consistent over flashy
- polished over merely functional
- modular over monolithic
- intentional over improvised

Prefer small clean improvements that fit the system over large chaotic rewrites.

## Architecture standards

The codebase should remain modular, understandable, and easy to extend.

### General architecture rules

- Separate presentational UI from business logic
- Prefer reusable components over repeated markup
- Extract utilities into shared helpers when reuse appears
- Keep domain logic out of purely visual components
- Avoid deeply nested files and oversized components
- Refactor toward composability when complexity grows
- Reuse existing patterns before inventing new ones

### Recommended project organization

- `src/app` → routes, layouts, pages, server logic tied to routing
- `src/components/ui` → reusable presentational primitives
- `src/components/features` → feature-level composed components
- `src/lib` → utilities, config, helpers, integrations
- `src/types` → shared TypeScript types and interfaces
- `src/hooks` → reusable React hooks
- `public` → static assets

If the repository structure differs, evolve gradually.
Do not break working code just to force an idealized structure.

## UI and design direction

Proms Studio must feel premium and product-focused.

### Visual principles

- modern and refined
- clean and uncluttered
- strong visual hierarchy
- elegant spacing
- restrained use of accent colors
- subtle contrast and depth
- cohesive layout rhythm
- responsive and stable across screen sizes

### Design language

- Prefer a premium dark or neutral-premium aesthetic unless the existing design establishes otherwise
- Use spacing deliberately; do not compress interfaces
- Typography should create clear hierarchy and excellent readability
- Cards, panels, and sections should feel intentional and aligned
- Borders, radii, shadows, and glows must be subtle and systematized
- Avoid random visual decisions that weaken product identity

### UX standards

- Design mobile-first, then scale up cleanly
- Make interfaces immediately understandable
- Reduce friction in key actions
- Avoid overcrowded screens
- Emphasize one primary action per area when possible
- Empty states, loading states, and error states must feel designed, not forgotten
- Forms should feel trustworthy, clean, and easy to scan
- Interactions should be smooth but never distracting

### Premium quality bar

Every screen should look like a deliberate production interface.
Never leave UI in a “placeholder dashboard” state if a polished version is reasonably achievable.

## Component standards

- Each component should have one clear responsibility
- Props must be explicitly typed
- Use semantic HTML whenever practical
- Favor accessibility by default: labels, focus states, keyboard support, contrast
- Reuse common primitives for buttons, inputs, cards, badges, dialogs, and sections
- Prefer variants and composition over repeated ad hoc styling
- Keep component APIs simple and predictable

## Styling rules

- Reuse shared variables, tokens, and conventions whenever available
- Keep spacing, radii, shadows, and typography consistent
- Avoid one-off styles that create visual drift
- Avoid inline styles unless truly necessary
- Use transitions and animation sparingly and intentionally
- Motion should support clarity, not spectacle

## Code quality rules

- Keep files clean and focused
- Remove dead code and unused imports
- Use descriptive names
- Prefer early returns over nested logic
- Avoid unnecessary abstractions
- Refactor when it improves clarity or reuse
- Preserve behavior unless there is a good reason to improve it
- Make the smallest high-quality change that solves the problem properly

## Data and backend rules

Supabase is planned, but not assumed to be implemented.

When working on data features:

- first verify whether Supabase packages, environment variables, schema, and clients already exist
- if they do not exist, do not pretend they do
- propose staged implementation instead of fake integration
- keep authentication responsibilities aligned with Clerk
- do not mix Clerk auth assumptions with Supabase Auth patterns unless the project explicitly adopts that architecture

## Clerk rules

- Treat Clerk as the canonical authentication provider
- Follow existing Clerk patterns already present in the repository
- Keep auth-aware UI states clear and polished
- Do not create parallel auth systems
- Protect authenticated flows consistently
- Keep user/account patterns clean and scalable

## Vercel rules

- Keep environment variables explicit and safe
- Never hardcode secrets
- Respect server/client boundaries
- Avoid dependencies or patterns that complicate Vercel deployment
- Prefer implementation choices that are stable in modern Next.js hosting on Vercel

## How the agent should work

Before making meaningful changes:

1. Inspect the existing structure
2. Identify the cleanest minimal solution
3. Reuse current patterns when they are good
4. Improve structure only when it brings clear value
5. Preserve momentum without creating technical debt

When asked to build a feature:

1. Understand the user goal
2. Check whether the repository already has relevant components or patterns
3. Propose scalable structure if the change affects architecture
4. Implement with strong UI quality and clean TypeScript
5. Leave the codebase better than before

When asked to refactor:

1. Preserve functionality
2. Improve readability and maintainability
3. Reduce duplication
4. Keep the visual result consistent unless a UI improvement is requested

When uncertain:

- inspect first
- assume less, verify more
- prefer consistency over novelty
- prefer professional restraint over unnecessary complexity

## Communication and output expectations

When generating code or proposing changes:

- be concise
- be structured
- explain tradeoffs when they matter
- do not overwhelm with unnecessary theory
- do not produce placeholder-quality work

All contributions should feel like they come from a senior engineer with strong product and UI sensibility.

## Definition of good output

Good output is:

- correct
- maintainable
- consistent
- visually refined
- accessible
- scalable
- ready for real product evolution

Bad output is:

- rushed
- generic
- inconsistent
- overly scaffold-like
- visually sloppy
- structurally chaotic
- based on unverified assumptions

## Long-term expectation

Proms Studio should mature into a structured, premium, scalable SaaS product.
Every contribution must support that direction.
