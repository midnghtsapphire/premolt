# ROADMAP — Premolt

**Project:** Premolt — AI Agent Security Sandbox  
**Author:** Audrey Evans / GlowStarLabs  
**Organization:** Freedom Angel Corp (EIN: 86-1209156, est. 2010)  
**Period:** 2026 – 2027  

---

## Vision

Premolt becomes the **"Passport Office" for the Network State** — the mandatory security clearance every AI agent must pass before entering any secure digital environment. No agent molts into production without a Premolt Identity.

---

## Phase 1 — MVP (Complete ✅)

**Timeline:** Q1 2026

| Feature | Status |
|---------|--------|
| Landing page + hero section | ✅ Done |
| Agent upload form (soul.md + public key) | ✅ Done |
| Supply chain check (SHA-256 vs malware DB) | ✅ Done |
| Prompt injection simulation | ✅ Done |
| Safety score (0–100) + status (verified/rejected) | ✅ Done |
| Cryptographic safety hash (HMAC-SHA256) | ✅ Done |
| Shareable verification URL + badge | ✅ Done |
| Affiliate link generation (Moltbook) | ✅ Done |
| Diagnostics dashboard with scan logs | ✅ Done |
| Skill Pharmacy — browse verified skills | ✅ Done |
| User Dashboard (auth required) | ✅ Done |
| Admin Dashboard (role-gated) | ✅ Done |
| MySQL/TiDB schema with Drizzle ORM | ✅ Done |
| Manus OAuth authentication | ✅ Done |
| vitest test suite (8 tests passing) | ✅ Done |
| GitHub Actions CI workflow | ✅ Done |
| Schema.org JSON-LD (Freedom Angel Corp + WebApplication) | ✅ Done |
| CHANGELOG, BLUEPRINT, ROADMAP documentation | ✅ Done |
| Proprietary license | ✅ Done |

---

## Phase 2 — Enhanced Security (Q2 2026)

**Goal:** Real-world threat intelligence and sandboxed execution.

| Feature | Priority |
|---------|----------|
| Docker container isolation for agent execution | P0 |
| Real threat intelligence feed integration (MISP, VirusTotal API) | P0 |
| Advanced red-teaming: file system access, network exfiltration tests | P1 |
| Real SHA-256 hashing of actual skill code (not just skill name) | P1 |
| Webhook alerts for rejected/flagged agents | P1 |
| Rate limiting on verification endpoint | P1 |
| PostgreSQL migration option alongside MySQL | P2 |
| Batch verification API (verify multiple agents at once) | P2 |

---

## Phase 3 — Network State Integration (Q3 2026)

**Goal:** Decentralized identity and territory-based trust systems.

| Feature | Priority |
|---------|----------|
| DID (Decentralized Identifier) credential issuance (W3C VC standard) | P0 |
| On-chain verification anchoring (Ethereum / Polygon) | P1 |
| Network state partnerships (agent territory access control) | P1 |
| Verified agent registry — public directory of cleared agents | P1 |
| Agent reputation scoring (cumulative across re-verifications) | P2 |
| Peer-review verification (multi-party consensus for high-risk agents) | P2 |

---

## Phase 4 — Platform & Monetization (Q4 2026)

**Goal:** Subscription tiers, API access, and affiliate marketing engine.

| Feature | Priority |
|---------|----------|
| Stripe subscription billing (Free / Starter $9 / Pro $29 / Business $99 / Enterprise $299) | P0 |
| Token-based usage metering (verifications consume tokens) | P0 |
| Public REST API + API key management | P1 |
| White-label verification badges for enterprise customers | P1 |
| Amazon affiliate auto-linker (tag: `meetaudreyeva-20`) | P1 |
| Email newsletter system (double opt-in, subscriber dashboard) | P1 |
| Marketing campaign generator (20/50/100/200/500 tiers via OpenRouter) | P2 |
| Blog system with auto-generated SEO posts | P2 |
| 50+ FAQ page with schema markup | P2 |
| Sitemap.xml + robots.txt | P2 |

---

## Phase 5 — Mobile & Ecosystem (Q1–Q2 2027)

**Goal:** Cross-platform reach and deep Revvel ecosystem integration.

| Feature | Priority |
|---------|----------|
| Expo React Native mobile app (iOS + Android via EAS Build) | P1 |
| Integration with MindMappr bot (Telegram/Slack agent verification) | P1 |
| Cross-app backlinks with all Revvel ecosystem apps | P1 |
| Premolt MCP server for Claude/Cursor AI coding tools | P2 |
| Accessibility modes: WCAG AAA, ADHD Mode, Dyslexic Mode, ECO CODE | P2 |
| Multi-language support (Spanish, French, Japanese) | P3 |

---

## Phase 6 — Enterprise & Compliance (Q3 2027)

**Goal:** Enterprise-grade security and regulatory compliance.

| Feature | Priority |
|---------|----------|
| SOC 2 Type II audit preparation | P0 |
| HIPAA-compliant data handling for medical AI agents | P1 |
| GDPR/CCPA data deletion and export APIs | P1 |
| SSO integration (SAML 2.0, OIDC) for enterprise customers | P1 |
| Audit log export (CSV/JSON) for compliance reporting | P2 |
| Penetration testing and CVE disclosure policy | P2 |

---

## KPIs

| Metric | Q2 2026 Target | Q4 2026 Target | Q2 2027 Target |
|--------|---------------|----------------|----------------|
| Monthly active users | 500 | 5,000 | 25,000 |
| Agents verified | 1,000 | 20,000 | 150,000 |
| Monthly recurring revenue | $0 (free) | $5,000 | $50,000 |
| Test coverage | 90% | 90% | 90% |
| Lighthouse score | 90+ | 90+ | 90+ |

---

*This roadmap is reviewed and updated at the start of every sprint. For task-level details, see `todo.md`.*
