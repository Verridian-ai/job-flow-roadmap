# Pull Request Merge Plan

**Date**: November 13, 2025
**Total PRs**: 23 open pull requests
**Strategy**: Merge by dependency order (foundation → features)

---

## Merge Order Strategy

`★ Insight ─────────────────────────────────────`

**Why Merge Order Matters**:

When merging PRs from parallel development, order matters to prevent integration conflicts:
1. **Infrastructure First**: Database schemas and component libraries are dependencies for other features
2. **Security Next**: RBAC and RLS are required by all authenticated features
3. **Core Services**: Authentication, payments, and AI must be in place before features that use them
4. **Features Last**: UI features that depend on infrastructure can be merged after their dependencies

This "bottom-up" merge strategy minimizes conflicts and ensures each PR has its dependencies in place.

`─────────────────────────────────────────────────`

---

## Phase 1: Foundation Infrastructure (Merge First)
**Dependencies**: None | **Risk**: Low | **Priority**: Critical

### Agent-5: Core Infrastructure
- [ ] **PR #4** - INFRA-001: Database Schema (13 points)
  - Branch: `agent5/infra-convex`
  - Impact: Required by ALL other features
  - Tables: 15 tables, 60+ indexes, 5 search indexes

- [ ] **PR #8** - INFRA-002: Component Library (8 points)
  - Branch: `agent5/infra-components`
  - Impact: UI components used across all pages
  - Components: Button, Input, Card, Modal, Badge, Alert, Select, Textarea

**Why First**: These PRs create the foundational data layer and UI components that all other features depend on.

---

## Phase 2: Security & AI Infrastructure
**Dependencies**: Phase 1 | **Risk**: Low | **Priority**: Critical

### Agent-5: Security & AI
- [ ] **PR #13** - SEC-001: Security Implementation (8 points)
  - Branch: `agent5/security`
  - Impact: RBAC, RLS, validation used by all authenticated features
  - Features: Rate limiting, CSRF protection, audit logging

- [ ] **PR #19** - INFRA-004: AI Integration (8 points)
  - Branch: `agent5/infra-ai`
  - Impact: Required by resume generation features
  - Features: Caching, retry logic, usage tracking

**Why Second**: Security must be in place before merging authenticated features. AI infrastructure enables resume features.

---

## Phase 3: Authentication System
**Dependencies**: Phase 1, 2 | **Risk**: Medium | **Priority**: Critical

### Agent-1: Authentication
- [ ] **PR #7** - US-AUTH-001: WorkOS SSO (8 points)
  - Branch: `agent1/us-auth-001`
  - Impact: Base authentication system
  - Features: Google/Microsoft OAuth, session management

- [ ] **PR #12** - US-AUTH-002: User Registration (5 points)
  - Branch: `agent1/us-auth-002`
  - Depends: PR #7 (WorkOS SSO)
  - Features: Email verification, profile creation, role assignment

- [ ] **PR #17** - US-AUTH-003: Session Management (5 points)
  - Branch: `agent1/us-auth-003`
  - Depends: PR #7, #12
  - Features: Remember me, multi-device, session revocation

- [ ] **PR #21** - US-AUTH-006: RBAC (3 points)
  - Branch: `agent1/us-auth-006`
  - Depends: PR #7, #13 (Security)
  - Features: 3 roles, 25+ permissions, protected routes

- [ ] **PR #23** - US-AUTH-007: Row-Level Security (3 points)
  - Branch: `agent1/us-auth-007`
  - Depends: PR #21, #13
  - Features: RLS policies, ownership verification

**Why Third**: Authentication is required for all user-facing features. Merge in dependency order (SSO → Registration → Enhancement).

---

## Phase 4: Payment Infrastructure
**Dependencies**: Phase 1, 2, 3 | **Risk**: Medium | **Priority**: High

### Agent-4: Payments
- [ ] **PR #3** - US-PAY-001: Stripe Integration (8 points)
  - Branch: `agent4/payment-stripe`
  - Depends: PR #7 (Auth for users)
  - Features: Payment intents, subscriptions, webhooks

- [ ] **PR #9** - US-PAY-002: Stripe Connect (8 points)
  - Branch: `agent4/payment-connect`
  - Depends: PR #3
  - Features: Coach payouts, transfers, earnings tracking

- [ ] **PR #11** - US-PAY-003: Escrow System (5 points)
  - Branch: `agent4/payment-escrow`
  - Depends: PR #3, #9
  - Features: Payment holding, release on completion, refunds

- [ ] **PR #15** - US-PAY-004: Subscription Plans (5 points)
  - Branch: `agent4/payment-subscriptions`
  - Depends: PR #3
  - Features: 3-tier plans, feature gating, usage tracking

**Why Fourth**: Payment infrastructure is required by marketplace and coaching features. Merge base Stripe before Connect and escrow.

---

## Phase 5: AI Resume Features
**Dependencies**: Phase 1, 2, 3, 4 | **Risk**: Medium | **Priority**: High

### Agent-2: Resume & STAR Stories
- [ ] **PR #1** - US-RES-001: STAR Story Creation (5 points)
  - Branch: `agent2/star-story-creation`
  - Depends: PR #4 (Schema), #19 (AI), #7 (Auth)
  - Features: Story creation, AI scoring, category organization

- [ ] **PR #5** - US-RES-003: AI Resume Generation (13 points)
  - Branch: `agent2/ai-resume-generation`
  - Depends: PR #1, #19 (AI)
  - Features: 3-step wizard, ATS scoring, keyword analysis

**Why Fifth**: Resume features depend on auth, database schema, and AI integration.

---

## Phase 6: Coach Platform
**Dependencies**: Phase 1, 2, 3, 4 | **Risk**: Medium | **Priority**: High

### Agent-3: Coaching Features
- [ ] **PR #6** - US-COACH-001: Coach Onboarding (5 points)
  - Branch: `agent3/coach-onboarding`
  - Depends: PR #7 (Auth), #4 (Schema)
  - Features: 6-step wizard, availability, pricing, certifications

- [ ] **PR #2** - US-INT-004: Coach Directory (5 points)
  - Branch: `agent3/coach-directory`
  - Depends: PR #6
  - Features: Search, filters, reviews, sorting

- [ ] **PR #10** - US-INT-005: Coach Profile Pages (3 points)
  - Branch: `agent3/coach-profile`
  - Depends: PR #2, #6
  - Features: Detailed profiles, reviews, availability display

- [ ] **PR #18** - US-COACH-002/006/007: Profile Builder (13 points)
  - Branch: `agent3/coach-builder`
  - Depends: PR #6, #10
  - Features: Profile management, availability calendar, pricing config

- [ ] **PR #14** - US-INT-007: Session Booking (5 points)
  - Branch: `agent3/session-booking`
  - Depends: PR #10, #18, #3 (Stripe)
  - Features: Calendar, time slots, payment integration, confirmations

**Why Sixth**: Coach features build on auth and payments. Merge onboarding before directory before booking.

---

## Phase 7: Marketplace
**Dependencies**: Phase 1, 2, 3, 4, 5, 6 | **Risk**: High | **Priority**: High

### Agent-4: Marketplace Features
- [ ] **PR #16** - US-MARK-001: Marketplace Infrastructure (8 points)
  - Branch: `agent4/marketplace-infra`
  - Depends: PR #4 (Schema), #7 (Auth), #11 (Escrow)
  - Features: Homepage, task listings, filters, real-time updates

- [ ] **PR #20** - US-MARK-002/003: Task Creation & Bidding (13 points)
  - Branch: `agent4/marketplace-bidding`
  - Depends: PR #16, #6 (Coaches exist)
  - Features: Task creation, coach bidding, bid comparison

- [ ] **PR #22** - US-MARK-004: Bid Selection & Assignment (5 points)
  - Branch: `agent4/marketplace-assignment`
  - Depends: PR #20, #11 (Escrow)
  - Features: Bid selection, task assignment, payment capture

**Why Last**: Marketplace integrates resume features (verification tasks), coach features (bidders), and payments (escrow). Requires most dependencies.

---

## Merge Command Reference

### For Each PR (in order above):

```bash
# 1. Check PR details
gh pr view <PR_NUMBER>

# 2. Check for conflicts
gh pr checks <PR_NUMBER>

# 3. Merge (use squash to keep clean history)
gh pr merge <PR_NUMBER> --squash --delete-branch

# Alternative: Rebase merge (preserves individual commits)
gh pr merge <PR_NUMBER> --rebase --delete-branch

# Alternative: Merge commit (creates merge commit)
gh pr merge <PR_NUMBER> --merge --delete-branch
```

### Batch Merge Script (Use with caution!)

```bash
# Phase 1: Infrastructure
gh pr merge 4 --squash --delete-branch --body "Merge INFRA-001: Database Schema"
gh pr merge 8 --squash --delete-branch --body "Merge INFRA-002: Component Library"

# Phase 2: Security & AI
gh pr merge 13 --squash --delete-branch --body "Merge SEC-001: Security"
gh pr merge 19 --squash --delete-branch --body "Merge INFRA-004: AI Integration"

# Phase 3: Authentication (in order!)
gh pr merge 7 --squash --delete-branch --body "Merge US-AUTH-001: WorkOS SSO"
gh pr merge 12 --squash --delete-branch --body "Merge US-AUTH-002: Registration"
gh pr merge 17 --squash --delete-branch --body "Merge US-AUTH-003: Session Management"
gh pr merge 21 --squash --delete-branch --body "Merge US-AUTH-006: RBAC"
gh pr merge 23 --squash --delete-branch --body "Merge US-AUTH-007: RLS"

# Continue with remaining phases...
```

---

## Conflict Resolution Strategy

If merge conflicts occur:

1. **Check which files conflict**:
   ```bash
   gh pr view <PR_NUMBER> --json files --jq '.files[].path'
   ```

2. **Common conflict scenarios**:
   - Schema conflicts: Database table definitions (resolve by combining)
   - Import conflicts: New imports added to same file (combine both)
   - Component conflicts: Multiple components in same directory (usually auto-resolves)

3. **Resolution process**:
   ```bash
   # Fetch latest master
   git checkout master
   git pull origin master

   # Checkout PR branch
   git checkout <branch-name>

   # Rebase on master
   git rebase master

   # Resolve conflicts
   git add <resolved-files>
   git rebase --continue

   # Force push (updates PR)
   git push --force-with-lease

   # Merge PR via GitHub
   gh pr merge <PR_NUMBER> --squash
   ```

---

## Post-Merge Checklist

After each phase:
- [ ] Verify master branch builds successfully
- [ ] Run any CI/CD checks
- [ ] Update agent.md with merged PRs
- [ ] Clean up worktrees for merged branches

After all merges:
- [ ] Update AGENT_PROGRESS_SUMMARY.md
- [ ] Tag release: `v0.2.0-sprint2-complete`
- [ ] Create Sprint 3 planning document
- [ ] Clean up all worktrees

---

## Estimated Merge Time

- **Phase 1**: 5 minutes (2 PRs, no conflicts expected)
- **Phase 2**: 5 minutes (2 PRs, low conflict risk)
- **Phase 3**: 15 minutes (5 PRs, sequential merge)
- **Phase 4**: 10 minutes (4 PRs, payment related)
- **Phase 5**: 5 minutes (2 PRs, resume features)
- **Phase 6**: 15 minutes (5 PRs, coach platform)
- **Phase 7**: 10 minutes (3 PRs, marketplace)

**Total**: ~65 minutes for all 23 PRs

---

## Risk Assessment

**Low Risk** (Phases 1-2): Infrastructure PRs with no feature overlap
**Medium Risk** (Phases 3-6): Sequential features, some file overlap
**High Risk** (Phase 7): Marketplace integrates multiple systems

**Mitigation**:
- Merge in strict order
- Test after each phase
- Keep worktrees available for quick fixes

---

**Ready to start merging? Begin with Phase 1 (PR #4 and #8).**
