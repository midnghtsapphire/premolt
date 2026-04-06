# Changelog

All notable changes to Premolt are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- In-memory store fallback in `server/db.ts` so all tests run without a live database connection
- `HMAC_SECRET` sourced from `JWT_SECRET` env var instead of hardcoded literal in `server/routers.ts`
- `hmacSecret` field on the `ENV` constant in `server/_core/env.ts`
- Schema.org JSON-LD structured data (Freedom Angel Corp parent org + Premolt WebApplication) in `client/index.html`
- Full SEO meta tags (Open Graph, Twitter Card, canonical URL, robots, description, keywords) in `client/index.html`
- GitHub Actions CI workflow (`.github/workflows/ci.yml`) — runs type-check and tests on every push/PR
- `CHANGELOG.md` — auto-documentation of every change per revvel-standards
- `BLUEPRINT.md` — technical architecture and data-flow reference
- `ROADMAP.md` — 12-month strategic roadmap
- Proprietary license clarification: updated `LICENSE` file formatting, `package.json` `license` field, and README

### Fixed
- `server/db.ts` `createAgent` and `updateAgent` no longer throw "Database not available" in test/no-DB environments
- `server/db.ts` `createVerification` no longer throws in test/no-DB environments

---

## [1.0.0] — 2026-01-01

### Added
- Initial release: Premolt AI Agent Security Sandbox
- Landing page with animated shield hero section
- Agent verification API (tRPC `agents.verify` mutation)
- Supply chain check against known malware hash database
- Prompt injection vulnerability simulation
- Safety score calculation (0–100)
- Cryptographic safety hash (HMAC-SHA256) and shareable verification URL
- Affiliate link generation for Moltbook integration
- Diagnostics dashboard with real-time scan logs
- Skill Pharmacy — browse and search verified safe skills
- User Dashboard — view agent history and badges (requires authentication)
- Admin Dashboard — malware database management, flagged agents, analytics
- Database schema: `users`, `agents`, `verifications`, `skills`, `agentSkills`, `malwareDatabase`
- Drizzle ORM with MySQL/TiDB support
- Manus OAuth authentication integration
- vitest test suite: agent verification, re-verification, badge generation, logout
- Tailwind CSS 4 security design system (trust blue + verification green palette)
- Custom animations: `shield-pulse`, `scan-line`, `shell-harden`
