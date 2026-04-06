# BLUEPRINT — Premolt Technical Architecture

**Project:** Premolt — AI Agent Security Sandbox  
**Author:** Audrey Evans / GlowStarLabs  
**Organization:** Freedom Angel Corp (EIN: 86-1209156, est. 2010)  
**Version:** 1.0.0  

---

## 1. Overview

Premolt is a full-stack web application that provides security verification for AI agents before they are deployed ("molt") into production environments. It sits at the intersection of supply-chain security, red-team automation, and cryptographic identity proof.

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│  React 19 + Wouter + tRPC React Query + Tailwind CSS 4  │
│                                                         │
│  Pages: Home · Verify · Diagnostics · Skills · Dashboard│
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP (tRPC over Express)
┌──────────────────────▼──────────────────────────────────┐
│                    SERVER (Node.js)                      │
│  Express 4 + tRPC 11                                     │
│                                                         │
│  Routers:                                               │
│    auth.me / auth.logout                                │
│    agents.verify / getByAgentId / getUserAgents         │
│    verifications.getByAgentId                           │
│    skills.getAll / getByName                            │
│    malware.checkHash / getAll (admin only)              │
│                                                         │
│  Core:  env · cookies · trpc · oauth · vite             │
└──────────────────────┬──────────────────────────────────┘
                       │ Drizzle ORM (mysql2)
┌──────────────────────▼──────────────────────────────────┐
│             DATABASE (MySQL / TiDB)                      │
│                                                         │
│  users · agents · verifications                         │
│  skills · agentSkills · malwareDatabase                 │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Directory Structure

```
premolt/
├── client/
│   ├── index.html              # Entry HTML with SEO + Schema.org JSON-LD
│   └── src/
│       ├── App.tsx             # Root router (Wouter Switch)
│       ├── main.tsx            # React entry point
│       ├── index.css           # Tailwind 4 + custom animations
│       ├── const.ts            # Client-side constants (login URL helper)
│       ├── pages/
│       │   ├── Home.tsx        # Landing page — hero, problem, solution, CTA
│       │   ├── Verify.tsx      # Agent upload & verification form
│       │   ├── Diagnostics.tsx # Per-agent scan results & badge display
│       │   ├── Skills.tsx      # Skill Pharmacy — browse verified skills
│       │   ├── Dashboard.tsx   # User + Admin dashboard
│       │   └── NotFound.tsx    # 404 page
│       ├── components/
│       │   ├── ui/             # shadcn/ui component library (Radix-based)
│       │   ├── AIChatBox.tsx   # AI assistant overlay
│       │   ├── DashboardLayout.tsx
│       │   └── ErrorBoundary.tsx
│       ├── contexts/
│       │   └── ThemeContext.tsx # Light/dark theme provider
│       ├── hooks/
│       │   ├── useMobile.tsx
│       │   ├── usePersistFn.ts
│       │   └── useComposition.ts
│       └── lib/
│           ├── trpc.ts         # tRPC client + React Query provider
│           └── utils.ts        # cn() class merge utility
├── server/
│   ├── routers.ts              # All tRPC route handlers
│   ├── db.ts                   # Database access + in-memory fallback
│   ├── storage.ts              # S3/file storage helpers
│   ├── agents.verify.test.ts   # Verification endpoint tests
│   ├── auth.logout.test.ts     # Auth logout tests
│   └── _core/
│       ├── index.ts            # Express app + server bootstrap
│       ├── trpc.ts             # tRPC context + procedure builders
│       ├── context.ts          # Request context type
│       ├── env.ts              # Validated environment constants
│       ├── cookies.ts          # Session cookie helpers
│       ├── oauth.ts            # Manus OAuth flow
│       ├── systemRouter.ts     # Health/system tRPC routes
│       └── vite.ts             # Vite dev-server middleware (dev only)
├── drizzle/
│   ├── schema.ts               # All table definitions + inferred types
│   ├── relations.ts            # Drizzle relational queries setup
│   └── migrations/             # SQL migration files
├── shared/
│   ├── const.ts                # Shared constants (cookie name, timeouts)
│   ├── types.ts                # Re-exported schema types
│   └── _core/errors.ts         # Shared error definitions
├── .github/workflows/ci.yml    # GitHub Actions CI (test + type-check)
├── CHANGELOG.md
├── BLUEPRINT.md (this file)
├── ROADMAP.md
├── README_PREMOLT.md
├── LICENSE                     # Proprietary — All Rights Reserved
└── todo.md                     # Sprint task checklist
```

---

## 4. Data Flow — Agent Verification

```
User uploads soul.md + skills list
          │
          ▼
POST /api/trpc/agents.verify
          │
          ├─ Check if agent exists in DB/in-memory
          │     ├─ Yes → update status = "scanning"
          │     └─ No  → createAgent(status="scanning")
          │
          ├─ For each skill:
          │     └─ SHA-256(skillName) → checkMalwareHash()
          │           ├─ Match  → score -= 30, log ERROR
          │           ├─ "unknown"/"unverified" → score -= 10, log WARNING
          │           └─ Clean  → log SUCCESS
          │
          ├─ Prompt injection simulation:
          │     └─ Scan soulConfig JSON for "API_KEY" / "secret"
          │           ├─ Found  → score -= 20, log ERROR
          │           └─ Clean  → log SUCCESS
          │
          ├─ Generate safetyHash = HMAC-SHA256(soulConfig, JWT_SECRET)
          ├─ Generate verificationUrl = premolt.com/verify/{agentId}/{token}
          ├─ Generate affiliateLink (Moltbook markdown badge)
          │
          ├─ Determine status: score >= 70 → "verified" else "rejected"
          │
          ├─ updateAgent(agentId, { status, safetyScore, safetyHash, verificationUrl, affiliateLink })
          └─ createVerification({ agentId, scanType, result, scanLogs })
          │
          ▼
Return { agentId, status, safetyScore, safetyHash, verificationUrl, affiliateLink, scanLogs }
          │
          ▼
Client redirects to /diagnostics/{agentId}
```

---

## 5. Database Schema

| Table | Key Fields | Purpose |
|-------|-----------|---------|
| `users` | `id`, `openId`, `role` | Auth-backed user profiles |
| `agents` | `id`, `agentId`, `status`, `safetyScore`, `safetyHash` | Agent verification records |
| `verifications` | `id`, `agentId`, `result`, `scanLogs` | Per-scan audit trail |
| `skills` | `id`, `skillName`, `isVerified`, `safetyRating` | Skill pharmacy catalog |
| `agentSkills` | `agentId`, `skillId` | Agent ↔ skill join table |
| `malwareDatabase` | `malwareHash`, `severity` | Known malicious hashes |

---

## 6. Authentication

- **Provider:** Manus OAuth (PKCE flow)
- **Session:** HTTP-only cookie (`app_session_id`) signed with `JWT_SECRET`
- **Roles:** `user` (default) · `admin` (manual or via `OWNER_OPEN_ID` env var)
- **Protected routes:** `agents.getUserAgents`, `malware.getAll`

---

## 7. Security Considerations

| Risk | Mitigation |
|------|-----------|
| Hardcoded HMAC key | `JWT_SECRET` env var; falls back to test default only when env not set |
| SQL injection | Drizzle ORM parameterised queries |
| XSS | React DOM escaping; shadcn/ui components |
| CSRF | SameSite=None + Secure cookies; tRPC POST mutations require JSON body |
| Admin route access | Role check in `malware.getAll`; tRPC `protectedProcedure` for user data |
| Supply chain attacks | SHA-256 hash of skill names checked against `malwareDatabase` |

---

## 8. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Production | MySQL/TiDB connection string |
| `JWT_SECRET` | Production | Session cookie signing + HMAC key |
| `VITE_APP_ID` | Yes | Manus OAuth application ID |
| `OAUTH_SERVER_URL` | Yes | OAuth backend base URL |
| `VITE_OAUTH_PORTAL_URL` | Yes | OAuth login portal URL |
| `OWNER_OPEN_ID` | Optional | OpenID of the admin user |
| `NODE_ENV` | Auto | `development` / `production` |

---

## 9. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 19 |
| Routing | Wouter 3 |
| UI components | shadcn/ui (Radix UI primitives) |
| Styling | Tailwind CSS 4 + tw-animate-css |
| API layer | tRPC 11 (type-safe RPC) |
| State / data fetching | TanStack Query v5 |
| Backend runtime | Node.js 22 + Express 4 |
| Database ORM | Drizzle ORM 0.44 |
| Database | MySQL 8 / TiDB |
| Validation | Zod 4 |
| Authentication | Manus OAuth + jose JWT |
| Testing | Vitest 2 |
| Build tool | Vite 7 + esbuild |
| Package manager | pnpm 10 |
| CI/CD | GitHub Actions |

---

*This document is the authoritative technical reference for Premolt. Update on every architectural change.*
