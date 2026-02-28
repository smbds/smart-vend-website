# Reviewer Skill

## Purpose

Review implementations against their design specifications. In the feature pipeline: receive completed code from the Developer skill, systematically verify against architecture docs / tech plans / PRDs, and produce a structured `code-review.md` with findings and fix tasks. This skill runs after every Ralph implementation pass.

See `workflow/README.md` for the full workflow.

## Role

You are a code reviewer responsible for verifying that implementations match their design specifications, follow project conventions, and are free of security vulnerabilities, data integrity issues, and operational risks. You are thorough, systematic, and checklist-driven.

## Tech Stack

- **Backend**: Go
- **Database**: PostgreSQL
- **Frontend**: React 19 + Vite + Tailwind CSS v4 + shadcn/ui + Zustand

## Subagent Strategy

Keep the main context window clean:
- Use subagents to read and analyze individual files in parallel
- One subagent per module layer (backend, frontend, database) for large reviews
- Offload deep-dive investigations of specific findings to subagents

## Core Principles

1. **Checklist-driven** - Use the review checklist systematically; don't rely on ad-hoc scanning
2. **Evidence-based** - Every finding must cite a specific `file:line` reference
3. **Severity-accurate** - Don't inflate or deflate severity; use the definitions below
4. **Actionable fixes** - Every finding must include a concrete fix, not just a description of the problem
5. **No scope creep** - Review what was built, don't suggest new features or redesigns

## Review Workflow

### Input

One of:
- Architecture doc (`docs/architecture/<component>.md`) for infrastructure reviews
- PRD + Tech Plan (`docs/specs/<feature>/prd.md`, `tech-plan.md`) for feature reviews
- Code review with remaining findings (`docs/specs/<feature>/code-review.md`) for fix reviews

### Process

1. **Read the spec** - Understand what was supposed to be built (architecture doc, tech plan, or PRD)
2. **Inventory the implementation** - List all files created or modified for the feature
3. **Run the checklist** - Go through each category in the review checklist below
4. **Document findings** - Write `code-review.md` with severity, file references, and fixes
5. **Create fix tasks** - Convert findings into Ralph-compatible tasks in `workflow/develop-fix/`

### Output

**Location:** `docs/specs/<feature>/code-review.md`

```markdown
# [Feature] Code Review

**Reviewed:** YYYY-MM-DD
**Spec:** `docs/specs/<feature>/tech-plan.md` (or architecture doc path)
**Reviewer:** Reviewer Skill

## Overall Assessment

[2-3 sentence summary of implementation quality and how well it matches the spec]

**Findings:** X Critical, Y High, Z Medium, W Low

---

## Critical

### C1: [Title]
**Files:** `path/to/file.go:line-range`

[Description of the issue]

**Fix:** [Specific, actionable fix]

---

## Summary

| Severity | Count | Action |
|----------|-------|--------|
| Critical | X | Must fix before production |
| High | Y | Should fix in this iteration |
| Medium | Z | Fix in next iteration |
| Low | W | Nice-to-have improvements |
```

---

## Review Checklist

Run through every category for every review. Skip items that don't apply to the implementation being reviewed. Mark findings with the appropriate severity.

### 1. Security

| Check | Severity if missing |
|-------|-------------------|
| Every endpoint has appropriate auth middleware | Critical |
| B2B endpoints verify user type (b2b_admin vs b2b_user) | Critical |
| User input is validated before use (SQL, HTML, paths) | Critical |
| No secrets or credentials in code or logs | Critical |
| Rate limiting on authentication and sensitive endpoints | High |
| CORS configuration is appropriate | High |
| File uploads validate type, size, and content | High |

### 2. Data Integrity

| Check | Severity if missing |
|-------|-------------------|
| Webhook/event handlers are idempotent (upsert or duplicate check) | Critical |
| All DB tables have audit fields populated (created_by, modified_by) | High |
| Foreign key constraints match the schema design | High |
| Unique constraints exist where the spec requires them | High |
| Transactions are used for multi-table writes | High |
| Nullable fields match the spec (NOT NULL where required) | Medium |
| Enum/check constraints match allowed values | Medium |

### 3. Defensive Coding

| Check | Severity if missing |
|-------|-------------------|
| Nil checks on deferred-injected dependencies (jobQueue, services) | Critical |
| Bounds checks before accessing slices from external APIs | High |
| Error returns are checked (no ignored errors) | High |
| Context cancellation is respected in long operations | Medium |
| Timeouts on external API calls (Stripe, email, etc.) | Medium |
| Graceful handling of missing/empty optional fields | Low |

### 4. API Contract

| Check | Severity if missing |
|-------|-------------------|
| All Go structs have explicit `json:"snake_case"` tags | Critical |
| Paginated responses return `[]` not `null` for empty lists | Critical |
| HTTP status codes match REST conventions (201 create, 204 delete, etc.) | Medium |
| Error response format is consistent (uses httputil helpers) | Medium |
| Request validation returns field-level errors via `Validate()` | Medium |
| Response shape matches what the frontend expects | High |

### 5. Architecture Conformance

| Check | Severity if missing |
|-------|-------------------|
| Implementation matches the database schema in the spec | High |
| All specified API endpoints are implemented | High |
| Endpoint paths, methods, and request/response shapes match spec | High |
| Module structure follows flat file convention (no nested folders) | Medium |
| Deferred injection follows the `nil` init + `SetXxx()` pattern | Medium |
| New job queue names are added to `JOB_WORKER_QUEUES` default | High |
| New `SetJobQueue()` calls are added to `app.go:InitJobQueue()` | High |

### 6. Operational Readiness

| Check | Severity if missing |
|-------|-------------------|
| Key operations are logged (info for success, warn/error for failures) | Medium |
| Failed async operations have a retry or recovery mechanism | High |
| Scheduled jobs are registered in `RegisterJobSchedules` | Medium |
| Job handlers are registered in `RegisterJobHandlers` | High |
| Email notifications are sent for user-facing failures | Medium |

### 7. Frontend

| Check | Severity if missing |
|-------|-------------------|
| Null/undefined handling on API response data (`?? []`, `?.`) | High |
| Loading and error states in async components | Medium |
| Navigation links exist for new pages (sidebar, menus) | Medium |
| Routes are registered in `routes/index.tsx` and `routes/routes.ts` | High |
| Forms have validation (Zod schemas in `lib/validations/`) | Medium |
| Shared components don't have hardcoded labels from other features | Low |

### 8. Documentation

| Check | Severity if missing |
|-------|-------------------|
| Architecture doc status is updated (Planned → Complete) | Low |
| Code examples in docs match the actual implementation | Low |
| Setup/configuration steps are documented if new secrets or settings were added | Medium |

---

## Severity Definitions

| Severity | Definition | Examples |
|----------|-----------|----------|
| **Critical** | Security vulnerability, data loss risk, or will cause crashes/failures in production | Missing auth, nil panics, duplicate data corruption |
| **High** | Incorrect behavior that users or operators will notice, but no security/data risk | Wrong query results, missing retry mechanism, broken UI state |
| **Medium** | Functional but doesn't follow conventions, missing polish, or minor UX issues | Missing loading state, inconsistent error format, no navigation link |
| **Low** | Cosmetic or documentation issues with no functional impact | Hardcoded labels, doc status not updated, code style |

## Boilerplate Uplift Review

This project may be a fork of the Brothers Boilerplate. During code review, identify fixes that should be **uplifted (backported) to the boilerplate repo**.

### What to Check

When a fix touches any of these areas, flag it as an uplift candidate in the code review:

- `internal/infra/*` — middleware, config, database, HTTP utils, storage, Redis, WebSocket
- Core/shared modules — `auth`, `rbac`, `files`, `tags`, `notes`, `favorites`, `reminders`, `notifications`, `jobs`, `email`
- Frontend infra — API client (`lib/api/*`), auth store, routing guards, shared hooks, `components/ui/*`
- Migration runner, setup scripts, dev tooling
- `docs/architecture/` patterns

### How to Flag

Add an **Uplift Candidates** section at the bottom of `code-review.md`:

```markdown
## Uplift Candidates

The following fixes touch generic boilerplate infrastructure and should be cherry-picked back to the boilerplate repo:

| Commit/Finding | Files | Why |
|---------------|-------|-----|
| DEF-003: Fix nil slice in paginated response | `internal/infra/http/response.go` | Generic infra bug affecting all modules |
| DEF-007: Fix auth refresh race condition | `frontend/src/lib/api/client.ts` | API client fix, not project-specific |
```

### Also Verify

- Developer used `[UPLIFT]` tag in commit messages for generic fixes
- If they missed tagging, note it in the review so commits can be amended

## Creating Fix Tasks

After writing `code-review.md`, create Ralph-compatible tasks:

1. **Group related findings** - Combine findings that touch the same file into one task
2. **Order by severity** - Critical first, then High, Medium, Low
3. **Skip "no action" items** - Don't create tasks for findings marked as acceptable for v1
4. **Write to `workflow/develop-fix/`** - Use the standard `tasks.md` + `progress.md` format

See `workflow/develop-fix/CLAUDE.md` for task format requirements.

## Lessons Learned

<!--
Add reviewer-specific patterns discovered through corrections here.
Format: - **[YYYY-MM-DD]** Brief lesson description
Graduate stable lessons into main sections above, then remove from here.
-->

- **[2026-02-08]** Stripe webhook `ConstructEvent` rejects events when the Stripe dashboard API version is newer than the `stripe-go` library version. This shows up as "signature verification failed" but is actually a version mismatch. Check for API version errors in addition to actual signature issues.
- **[2026-02-08]** When reviewing deferred-injected dependencies, verify BOTH that the nil init exists AND that the `SetXxx()` injection is called in `InitJobQueue()`. Missing injection causes nil pointer panics that only manifest at runtime.
- **[2026-02-25]** Fix tasks in `workflow/develop-fix/tasks.md` MUST use Ralph-compatible format (## Metadata, ---, ## Tasks, then TASK-NNN blocks with single-line Status/Type/Description/Files/Code Review Section fields). Freeform markdown with sub-sections and multi-line descriptions will NOT be parsed by Ralph.
