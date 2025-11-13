#!/bin/bash

# Merge Remaining PRs Script
# Run this to merge all PRs in dependency order

echo "======================================"
echo "BATCH PR MERGE SCRIPT"
echo "======================================"
echo ""

# Track successes and failures
SUCCESS=()
CONFLICTS=()
FAILED=()

# Function to merge PR
merge_pr() {
    local PR_NUM=$1
    local TITLE=$2
    local POINTS=$3
    local AGENT=$4

    echo "----------------------------------------"
    echo "Merging PR #$PR_NUM: $TITLE"
    echo "Points: $POINTS | Agent: $AGENT"
    echo "----------------------------------------"

    if gh pr merge $PR_NUM --squash --body "✅ Merge $TITLE ($POINTS points) - $AGENT" 2>&1 | tee /tmp/merge_$PR_NUM.log; then
        if grep -q "CONFLICTING\|not mergeable" /tmp/merge_$PR_NUM.log; then
            echo "⚠️  PR #$PR_NUM has conflicts - skipping for now"
            CONFLICTS+=("$PR_NUM: $TITLE")
        else
            echo "✅ PR #$PR_NUM merged successfully"
            SUCCESS+=("$PR_NUM: $TITLE")
        fi
    else
        if grep -q "CONFLICTING\|not mergeable" /tmp/merge_$PR_NUM.log; then
            echo "⚠️  PR #$PR_NUM has conflicts - skipping for now"
            CONFLICTS+=("$PR_NUM: $TITLE")
        else
            echo "❌ PR #$PR_NUM failed to merge"
            FAILED+=("$PR_NUM: $TITLE")
        fi
    fi
    echo ""
}

# PHASE 1: Infrastructure (Partially complete)
echo "=== PHASE 1: INFRASTRUCTURE ==="
# PR #4 - Already merged ✅
# PR #8 - Has conflicts, will try later

# PHASE 2: Security & AI (Partially complete)
echo "=== PHASE 2: SECURITY & AI ==="
# PR #13 - Already merged ✅
# PR #19 - Already merged ✅

# PHASE 3: Authentication
echo "=== PHASE 3: AUTHENTICATION ==="
# PR #7 - Already merged ✅
merge_pr 12 "US-AUTH-002: User Registration Flow" 5 "Agent-1"
merge_pr 17 "US-AUTH-003: Enhanced Session Management" 5 "Agent-1"
merge_pr 21 "US-AUTH-006: Role-Based Access Control" 3 "Agent-1"
merge_pr 23 "US-AUTH-007: Row-Level Security" 3 "Agent-1"

# PHASE 4: Payments
echo "=== PHASE 4: PAYMENTS ==="
merge_pr 3 "US-PAY-001: Stripe Payment Integration" 8 "Agent-4"
merge_pr 9 "US-PAY-002: Stripe Connect for Coach Payouts" 8 "Agent-4"
merge_pr 11 "US-PAY-003: Escrow Payment System" 5 "Agent-4"
merge_pr 15 "US-PAY-004: Subscription Plans" 5 "Agent-4"

# PHASE 5: Resume Features
echo "=== PHASE 5: RESUME FEATURES ==="
merge_pr 1 "US-RES-001: STAR Story Creation" 5 "Agent-2"
merge_pr 5 "US-RES-003: AI Resume Generation" 13 "Agent-2"

# PHASE 6: Coach Platform
echo "=== PHASE 6: COACH PLATFORM ==="
merge_pr 6 "US-COACH-001: Coach Onboarding Flow" 5 "Agent-3"
merge_pr 2 "US-INT-004: Coach Directory" 5 "Agent-3"
merge_pr 10 "US-INT-005: Enhanced Coach Profile Pages" 3 "Agent-3"
merge_pr 18 "US-COACH-002/006/007: Comprehensive Coach Profile Builder" 13 "Agent-3"
merge_pr 14 "US-INT-007: Session Booking" 5 "Agent-3"

# PHASE 7: Marketplace
echo "=== PHASE 7: MARKETPLACE ==="
merge_pr 16 "US-MARK-001: Marketplace Infrastructure" 8 "Agent-4"
merge_pr 20 "US-MARK-002/003: Task Creation & Bidding" 13 "Agent-4"
merge_pr 22 "US-MARK-004: Bid Selection & Assignment" 5 "Agent-4"

# Try conflicting PRs again
echo "=== RETRY: CONFLICTING PRs ==="
merge_pr 8 "INFRA-002: Component Library" 8 "Agent-5"

# Summary
echo ""
echo "======================================"
echo "MERGE SUMMARY"
echo "======================================"
echo ""
echo "✅ Successfully Merged (${#SUCCESS[@]}):"
printf '%s\n' "${SUCCESS[@]}"
echo ""
echo "⚠️  Has Conflicts (${#CONFLICTS[@]}):"
printf '%s\n' "${CONFLICTS[@]}"
echo ""
echo "❌ Failed (${#FAILED[@]}):"
printf '%s\n' "${FAILED[@]}"
echo ""
echo "======================================"
