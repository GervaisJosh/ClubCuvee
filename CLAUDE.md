# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 🧠 Project Summary

**Club Cuvee** is a full-stack SaaS platform that powers personalized wine clubs for restaurants and wine shops. It uses vector search, wine theory, and guest purchasing behavior to recommend wines, manage inventory, and grow recurring revenue via memberships.

---

## ⚙️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS with custom luxury fonts
- **Backend Services**: Supabase (PostgreSQL + Auth + Storage)
- **AI Integration**: OpenAI / Pinecone (vector DB for wine embeddings)
- **Image Handling**: AWS S3 or Supabase storage (processed wine bottle images)
- **Auth**: Supabase Auth (email/password)
- **Hosting**: Vercel (planned)
- **Optional**: Stripe (for handling restaurant payments)

---

## 📁 Project Structure

- `/src/components/`: Reusable UI components
- `/src/pages/`: All route-level components
- `/src/services/`: API logic (Supabase, Pinecone, Claude, Stripe)
- `/src/utils/`: General-purpose utilities
- `/src/styles/`: Tailwind config, font imports
- `/public/images/`: Static assets and wine bottle images
- `/tests/`: Custom tests for algorithms and integrations

---

## 🧪 Recommendation Engine Notes

- Wines are vectorized using metadata + a custom recommendation algorithm.
- User profiles are stored in Supabase, and their preferences are embedded and compared using Pinecone.
- The algorithm outputs compatibility scores and wine suggestions from inventory.
- Inventory, metadata, and images are pulled dynamically from Supabase or CSV.

---

## 🛠️ Build/Dev Commands

- `npm run dev`: Start development server
- `npm run build`: Build the project
- `npm run lint`: Run ESLint on the codebase
- `npm run test:recommendations`: Run recommendation system tests
- `npm run preview`: Preview the final build

---

## 🧾 Code Style Guidelines

- **Types**: Use TypeScript interfaces with strict typing
- **Components**: React functional components with `FC<Props>`
- **Imports**: Grouped: libraries → components → utils → styles
- **Naming**: PascalCase for components, camelCase for variables/functions
- **Path Aliases**: Use `@/` for `src/` imports
- **State Management**: React Context API
- **Styling**: Tailwind CSS utility classes
- **Error Handling**: Use `try/catch` with type guards
- **API Services**: Centralized in `services/` with typed responses
- **Testing**: Use targeted scripts in `/tests` to validate output

---

## 🔮 Future Development Priorities

- [ ] Claude-assisted feature planning and refactors
- [ ] Stripe-based subscription onboarding for restaurants
- [ ] Admin view: Wine performance analytics, club metrics
- [ ] Customer dashboard: Review wines, update preferences
- [ ] Claude chatbot to help restaurant admins configure their wine tiers
- [ ] Improve Pinecone chunking and metadata abstraction for smarter recs

---

## 🤖 Claude Code Tips

- You can inspect files for context.
- You can modify existing components, generate new ones, or assist with backend queries.
- Follow project conventions and preserve visual aesthetics (fonts/colors/layout spacing).
- If unsure, output your suggestion as a separate file or comment block.
- ALWAYS WRITE IN COMPLETE CODE AND AVOID PLACEHOLDER TEXT WHENEVER POSSIBLE.
