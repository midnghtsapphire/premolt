# Premolt - AI Agent Security Sandbox

**The Security Layer for the Agentic Web**

Premolt is a comprehensive security verification platform for AI agents. Before agents "molt" into production environments, Premolt provides rigorous testing, security scanning, and identity verification to ensure they are safe, secure, and free from malware.

---

## 🛡️ Overview

AI agents with root access, internet connectivity, and untrusted input create a security nightmare. Premolt solves this by providing:

- **Identity Validation**: Cryptographic proof and verifiable credentials using zero-knowledge proofs
- **Security Scanning**: Automated red teaming tests for prompt injection vulnerabilities
- **Skill Auditing**: Supply chain verification against known malware databases
- **Verification Badges**: Shareable verification URLs and affiliate marketing links

---

## ✨ Features

### Core Platform Features

1. **Landing Page**
   - Hero section with animated lobster shell hardening visual
   - Clear explanation of agent verification concept
   - Elegant, trust-focused design system

2. **Agent Verification**
   - Upload soul.md configuration files
   - Public key input for cryptographic verification
   - Real-time security scanning with live logs
   - Safety score calculation (0-100)

3. **Diagnostics Dashboard**
   - Agent vital signs (memory integrity, skill safety)
   - Real-time security scan logs
   - Automated red teaming simulation results
   - Verification status indicators

4. **Skill Pharmacy**
   - Browse verified, safe skills
   - Search and filter functionality
   - Safety ratings and download statistics
   - Repository links for each skill

5. **User Dashboard**
   - Verification history for authenticated users
   - Past scans and issued credentials
   - User profile with verification statistics

6. **Admin Dashboard** (Admin-only)
   - Malware database management
   - Flagged agents review system
   - Platform usage statistics
   - Manual verification override tools

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22.x
- pnpm 10.x
- MySQL/TiDB database

### Installation

```bash
# Install dependencies
pnpm install

# Push database schema
pnpm db:push

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

### Environment Variables

The following environment variables are automatically configured:

- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - Session cookie signing secret
- `VITE_APP_ID` - Manus OAuth application ID
- `OAUTH_SERVER_URL` - OAuth backend base URL
- `VITE_OAUTH_PORTAL_URL` - OAuth login portal URL

---

## 📊 Database Schema

### Tables

- **users** - User authentication and profiles
- **agents** - AI agents submitted for verification
- **verifications** - Verification history and scan results
- **skills** - Available skills for agents
- **agentSkills** - Relationship between agents and skills
- **malwareDatabase** - Known malware hashes and signatures

---

## 🔒 Security Features

### Supply Chain Verification

Every skill is checked against known malware databases:
- SHA-256 hash verification
- Repository source validation
- Dependency analysis

### Prompt Injection Testing

Automated red teaming attempts:
- API key extraction tests
- File system access tests
- Configuration leak detection

### Cryptographic Proof

Each verified agent receives:
- Safety hash (HMAC-SHA256)
- Unique verification URL
- Shareable affiliate link

---

## 🧪 Testing

The platform includes comprehensive test coverage:

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test agents.verify.test.ts
```

### Test Coverage

- ✅ Agent verification API
- ✅ Security scanning logic
- ✅ Supply chain checks
- ✅ Badge generation
- ✅ User authentication

---

## 🎨 Design System

### Color Palette

- **Primary**: Deep trust blue (oklch(0.45 0.15 250))
- **Accent**: Verification green (oklch(0.65 0.18 160))
- **Destructive**: Security alert red (oklch(0.55 0.22 25))

### Custom Animations

- `animate-shield-pulse` - Pulsing shield effect
- `animate-scan-line` - Scanning line animation
- `animate-shell-harden` - Shell hardening animation

---

## 📡 API Endpoints

### Public Endpoints

- `POST /api/trpc/agents.verify` - Verify an agent
- `GET /api/trpc/agents.getByAgentId` - Get agent details
- `GET /api/trpc/skills.getAll` - List all verified skills
- `GET /api/trpc/skills.getByName` - Get skill by name

### Protected Endpoints (Authentication Required)

- `GET /api/trpc/agents.getUserAgents` - Get user's agents
- `GET /api/trpc/verifications.getByAgentId` - Get verification history

### Admin Endpoints (Admin Role Required)

- `GET /api/trpc/malware.getAll` - Get malware database

---

## 🔄 Verification Flow

1. **Upload Configuration**
   - User uploads agent's soul.md file
   - Provides agent ID and optional public key
   - Lists installed skills

2. **Security Scanning**
   - Supply chain check against malware database
   - Prompt injection vulnerability tests
   - Configuration analysis for exposed secrets

3. **Score Calculation**
   - Base score: 100
   - Deductions for risky skills (-10 to -30)
   - Deductions for weak configuration (-20)
   - Final status: verified (≥70) or rejected (<70)

4. **Badge Generation**
   - Safety hash (cryptographic proof)
   - Verification URL (shareable)
   - Affiliate link (for Moltbook)

5. **Results Display**
   - Real-time scan logs
   - Safety score visualization
   - Verification badge with copy/share options

---

## 🌟 Key Technologies

- **Frontend**: React 19, Tailwind CSS 4, shadcn/ui
- **Backend**: Express 4, tRPC 11
- **Database**: MySQL/TiDB with Drizzle ORM
- **Authentication**: Manus OAuth
- **Testing**: Vitest
- **Type Safety**: TypeScript, Zod

---

## 📈 Roadmap

### Phase 1: MVP (Complete)
- ✅ Basic verification flow
- ✅ Security scanning
- ✅ Skill pharmacy
- ✅ User dashboard

### Phase 2: Enhanced Security
- [ ] Docker container isolation
- [ ] Advanced red teaming
- [ ] Real-time threat intelligence

### Phase 3: Network State Integration
- [ ] DID (Decentralized Identity) credentials
- [ ] Network state partnerships
- [ ] Verified agent territories

---

## 🤝 Contributing

This project follows Extreme Programming (XP) and Agile methodologies:

- **Iterative Development**: Features delivered in sprints
- **Test-Driven Development**: Tests written before implementation
- **Continuous Integration**: Automated testing and deployment
- **Pair Programming**: Collaborative development approach

### Code Review Process

All code must pass through:
1. **Dev Environment**: Local development and testing
2. **Test Environment**: Integration testing
3. **Code Review**: Using Coderabbit (connected to GitHub)
4. **Live Environment**: Production deployment

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🔗 Links

- **Live Demo**: [Premolt.com](https://premolt.com)
- **Documentation**: [docs.premolt.com](https://docs.premolt.com)
- **GitHub**: [github.com/premolt](https://github.com/premolt)
- **Support**: [help@premolt.com](mailto:help@premolt.com)

---

## 💡 The Vision

Premolt becomes the "Passport Office" for the Network State. No agent enters a secure digital territory without a Premolt Identity. We're building the security layer that makes the agentic web safe, trustworthy, and verifiable.

**Before they molt, they must be safe.**

---

Built with ❤️ using Extreme Programming and Rapid Development methodologies.
