---
description: Git collaboration rules for multi-developer workflow
---

# Git Collaboration Workflow

Whenever working on this codebase:
1. **Before starting work or making code changes:**
   - Always execute `git pull origin main` to pull any recent commits made by the collaborator/partner.
2. **Before pushing code:**
   - Ensure local changes are cleanly staged and committed.
   - Run `git pull origin main` to ensure we are up to date and resolve any upstream conflicts cleanly.
   - Verify build status with `npm run build` so production doesn't break.
   - Push cleanly to `origin main` (or the respective working branch).

