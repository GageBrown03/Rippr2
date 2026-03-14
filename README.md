# Pokémon Pack Opener

A Pokémon pack opening and collection management web app built with Next.js, Prisma, and Anthropic AI.

## Setup

1. `npm install`
2. Set `DATABASE_URL` and `ANTHROPIC_API_KEY` in `.env`
3. `npx prisma db push`
4. `npm run seed`
5. `npm run dev`

## Features

- Cookie-based authentication
- Virtual currency (PokéCoins) with daily rewards
- Weighted random pack opening (1-10 packs at once)
- Personal card collection with filtering and sorting
- Showcase your best pulls (up to 12)
- AI-generated card flavor text via Anthropic
