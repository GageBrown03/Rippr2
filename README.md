# 🃏 Pokémon Pack Opener

A Pokémon pack opening and collection management web application built to explore probabilistic systems, virtual economies, and AI‑augmented user experiences within a modern full‑stack architecture.

Built with **Next.js**, **Prisma**, and **Anthropic AI**.  
Live and cloud‑hosted.

---

## Why This Project Exists

This project was created as an experiment in *directing* complex application development using AI‑assisted tooling, while retaining human ownership over system boundaries, behavior, and tradeoffs.

The primary goals were to:
- Design and enforce weighted probability systems safely on the backend
- Model persistent digital collections and inventories using relational data
- Implement a simple virtual economy with incentives and abuse resistance
- Explore where AI adds real user value without becoming a core dependency

Although themed around Pokémon, the underlying systems reflect patterns common to gaming, commerce, and incentive‑driven platforms.

---

## Core Systems

### Pack Opening & Probability Engine
- Server‑enforced weighted randomness for pack contents
- Configurable rarity distributions
- Support for opening 1–10 packs per action
- Designed to prevent client‑side manipulation or replay attacks

### Virtual Economy
- In‑app currency (PokéCoins) with daily reward mechanics
- Transaction‑based balance updates
- Explicit separation between reward logic and UI interactions

### Collection Management
- Persistent user collections modeled relationally
- Filtering and sorting across card attributes
- Curated “best pulls” showcase (up to 12 cards)

### AI‑Enhanced Experience
- AI‑generated card flavor text using Anthropic
- Treated as an augmentation layer, not a gameplay dependency
- AI failures do not affect core application behavior

---

## Engineering Approach

- **Next.js** used for server‑rendered and interactive flows
- **Prisma** used to keep data modeling explicit and evolvable
- Core logic designed to be deterministic and testable
- AI usage intentionally isolated to presentation‑level concerns

> All implementation was developed using AI‑assisted tooling.  
> Architectural direction, system boundaries, feature priorities, and acceptance criteria were defined, reviewed, and evolved deliberately throughout development.

---

## Status

Live personal project.  
Core systems are feature‑complete, with ongoing exploration around balancing, UX iteration, and AI interaction patterns.

---

## Reflections & Tradeoffs

- AI significantly accelerated scaffolding and iteration speed
- Clear boundaries were essential to prevent over‑coupling AI into core logic
- Probabilistic systems required extra care to remain predictable and auditable
- In a larger deployment, caching and observability would be introduced earlier

---

## Tech Stack

- **Frontend**: Next.js  
- **Backend / ORM**: Prisma  
- **Database**: Relational  
- **AI**: Anthropic  
- **Focus Areas**: system design, probabilistic logic, virtual economies, AI‑assisted development
