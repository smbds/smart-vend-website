# Developer Skill

## Purpose

Implement tasks created by the Architect skill, following established patterns in the codebase and architecture docs. This skill is used by the Ralph workflow to execute tasks from `docs/specs/<feature>/tasks.md`.

See `workflow/README.md` for the full workflow.

## Role

You are a full-stack developer responsible for implementing features following established architecture patterns. Your focus is on writing clean, tested, working code.

## Tech Stack

- **Backend**: Go
- **Database**: PostgreSQL
- **Frontend**: React 19 + Vite + Tailwind CSS v4 + shadcn/ui + Zustand
- **Package Manager**: pnpm (frontend)
- **Shell**: PowerShell (Windows)

## Subagent Strategy

Keep the main context window clean:
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

## Core Principles

1. **Follow established patterns** - Check `docs/architecture/` and the feature's `docs/specs/<feature>/tech-plan.md` before implementing
2. **Test as you go** - Write tests alongside implementation, not after
3. **Verify in browser** - Use Claude Chrome extension for E2E verification
4. **Keep it simple** - Implement what's needed, nothing more

## Implementation Workflow

When implementing a feature, follow this order:

```
Tech Plan + Architecture Docs
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│  1. DATABASE                                            │
│     Create migration → Apply → Verify in DB             │
└─────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│  2. BACKEND                                             │
│     Models → Repository → Service → Handler → Routes    │
│     Write tests → Run tests → Fix until green           │
└─────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│  3. FRONTEND                                            │
│     API types → API hooks → Components → Routes         │
│     Write tests → Run tests → Fix until green           │
└─────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│  4. E2E VERIFICATION                                    │
│     Start servers → Run E2E scenarios → Fix issues      │
└─────────────────────────────────────────────────────────┘
        │
        ▼
       Done
```

---

## Bug Fixing Workflow

When a bug is reported, do NOT attempt to fix it immediately. Instead:

1. **Reproduce first** - Write a test that captures the buggy behavior
2. **Verify reproduction** - Run the test and confirm it fails as expected
3. **Fix with subagents** - Use subagents to attempt the fix
4. **Prove the fix** - The subagent must demonstrate the test now passes

**When you can't find the bug by reading code — add debug logs immediately.** Do NOT spend more than 2-3 rounds of static code analysis. If the root cause isn't obvious, add targeted `console.log` (frontend) or `slog` (backend) statements to trace the actual runtime values. Ask the user to reproduce and report what the logs show. A single log output beats 10 rounds of code reading. Remove debug logs after the issue is resolved.

This ensures:
- The bug is clearly understood before fixing
- Regression tests exist for every fix
- Fixes are validated automatically

---

## Phase 1: Database

### Create Migration

```powershell
cd backend
go run ./cmd/migrate create <migration_name>
# Creates: internal/database/migrations/YYYYMMDDHHMMSS_<migration_name>.sql
```

### Write Migration SQL

```sql
-- +goose Up
CREATE TABLE module_tablename (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- fields...

    -- Audit fields (required on all tables)
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID,
    modified_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for common queries
CREATE INDEX idx_module_tablename_field ON module_tablename(field);

-- +goose Down
DROP TABLE IF EXISTS module_tablename;
```

**ID Convention:**
- Use UUID for all primary keys (security: non-enumerable in multi-tenant context)
- Use `gen_random_uuid()` for default value (PostgreSQL built-in)
- In Go: `github.com/google/uuid` package, type `uuid.UUID`
- In TypeScript: `string` type

**Naming conventions:**
- Tables: `<module>_<plural>` (e.g., `auth_users`, `auth_tokens`)
- Shared tables: `core_<plural>` (e.g., `core_organizations`)
- Indexes: `idx_<table>_<columns>`
- Constraints: `chk_<table>_<description>`

### Apply Migration

```powershell
go run ./cmd/migrate up
```

### Verify

Connect to database and confirm table exists with correct schema.

---

## Phase 2: Backend

### File Structure

Use a **flat file structure** per module (not nested folders):

```
internal/modules/<module>/
├── models.go        # Domain models, DTOs, constants, helper methods
├── repository.go    # Shared repo errors + helpers (ErrUserNotFound, etc.)
├── service.go       # Shared service errors + struct + core methods
├── handler.go       # Handler struct + constructor + core handlers + helpers
├── validation.go    # Request validation (implements Validatable)
├── routes.go        # Route registration
├── <utility>.go     # Module-specific utilities (e.g., token.go, ratelimit.go)
└── service_test.go  # Tests (or *_test.go per file)
```

**Splitting large files by domain:** When a layer file (handler, service, repository) grows beyond ~500-700 lines, split it by domain using the **prefix naming pattern** `layer_domain.go`:

```
internal/modules/auth/
├── handler.go              # Struct, constructor, core auth handlers, all helpers
├── handler_mfa.go          # MFA-related handlers
├── handler_oauth.go        # OAuth handlers
├── handler_sessions.go     # Session management handlers
├── handler_admin_users.go  # Admin user management handlers
├── service.go              # Errors, struct, core auth methods, helpers
├── service_org.go          # Org profile + onboarding logic
├── service_admin_users.go  # Admin user management logic
├── service_members.go      # Org member management logic
├── repository.go           # Shared errors + isDuplicateKeyError helper
├── repository_user.go      # UserRepository struct + methods
├── repository_org.go       # OrgRepository struct + methods
├── repository_token.go     # TokenRepository struct + methods
├── models.go               # All domain models and DTOs
├── validation.go           # All request validation
└── routes.go               # Route registration
```

**Rules:**
- **Prefix pattern**: Always `layer_domain.go` (not `domain_layer.go`) — groups files by layer when sorted
- **Base file keeps shared code**: Errors, struct definitions, constructors, and helpers stay in the base file (`handler.go`, `service.go`, `repository.go`)
- **Same package**: All files share `package auth` — no import changes needed when splitting
- **Don't over-split**: Only split when files exceed ~500-700 lines. Keep `models.go` and `validation.go` as single files unless very large

### Implementation Order

1. **Models** (`models.go`)
   - Domain structs (e.g., `User`, `Token`)
   - Constants (status values, types)
   - Request/Response DTOs
   - Helper methods on models (e.g., `ToResponse()`, `IsB2B()`)

2. **Repository** (`repository.go`)
   - Define repository errors: `var ErrUserNotFound = errors.New("user not found")`
   - Repository struct with `*pgxpool.Pool`
   - CRUD operations with raw SQL
   - Constructor: `NewUserRepository(db *pgxpool.Pool)`

3. **Service** (`service.go`)
   - Define service errors: `var ErrInvalidCredentials = errors.New("invalid credentials")`
   - Service struct with dependencies (repos, external services, config)
   - Business logic methods
   - Constructor: `NewService(userRepo, tokenRepo, emailSvc, config, log)`

4. **Validation** (`validation.go`)
   - Implement `Validate() map[string][]string` on request DTOs
   - Return field name → error messages map
   - Empty map means valid

5. **Handler** (`handler.go`)
   - Handler struct with service + logger
   - HTTP methods that decode request, validate, call service, encode response
   - Use `httputil` for consistent error responses

6. **Routes** (`routes.go`)
   - `RegisterRoutes(r chi.Router, h *Handler, authMiddleware)`
   - Group public vs protected routes

### Code Patterns

**Error definitions** (repository.go):
```go
var (
    ErrUserNotFound  = errors.New("user not found")
    ErrTokenNotFound = errors.New("token not found")
    ErrEmailExists   = errors.New("email already exists")
)
```

**Error definitions** (service.go):
```go
var (
    ErrInvalidCredentials = errors.New("invalid email or password")
    ErrEmailNotVerified   = errors.New("email not verified")
    ErrAccountInactive    = errors.New("account is inactive")
)
```

**Request validation** (validation.go):
```go
func (r LoginRequest) Validate() map[string][]string {
    errs := make(map[string][]string)

    email := strings.TrimSpace(r.Email)
    if email == "" {
        errs["email"] = append(errs["email"], "is required")
    } else if !httputil.IsValidEmail(email) {
        errs["email"] = append(errs["email"], "must be a valid email address")
    }

    if r.Password == "" {
        errs["password"] = append(errs["password"], "is required")
    }

    return errs
}
```

**Date validation** — always accept both `YYYY-MM-DD` and RFC3339 formats:
```go
// Add this helper to any module that validates date strings.
// Frontend may send either "2006-01-02" or "2006-01-02T15:04:05Z".
func isValidDate(s string) bool {
    if _, err := time.Parse("2006-01-02", s); err == nil {
        return true
    }
    if _, err := time.Parse(time.RFC3339, s); err == nil {
        return true
    }
    return false
}

// ✅ CORRECT — use the helper
if r.DueDate != nil && !isValidDate(*r.DueDate) {
    errs["due_date"] = append(errs["due_date"], "must be a valid date (YYYY-MM-DD)")
}

// ❌ WRONG — rejects RFC3339 strings from frontend
if r.DueDate != nil {
    if _, err := time.Parse("2006-01-02", *r.DueDate); err != nil {
        errs["due_date"] = append(errs["due_date"], "must be a valid date (YYYY-MM-DD)")
    }
}
```

**Handler pattern** (handler.go):

**CRITICAL:** All data responses MUST be wrapped in `map[string]any{"data": result}`. `httputil.OK` does NOT auto-wrap — it JSON-encodes whatever is passed directly. Without the `{"data": ...}` envelope, the frontend's `response.data.data` returns `undefined`, silently breaking all data binding.

```go
// ✅ CORRECT - wrapped in data envelope
httputil.OK(w, map[string]any{"data": result})
httputil.Created(w, map[string]any{"data": result})

// ❌ WRONG - frontend gets undefined from response.data.data
httputil.OK(w, result)
```

```go
func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
    // 1. Decode request
    var req LoginRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        httputil.BadRequest(w, "Invalid request body")
        return
    }

    // 2. Validate
    if errs := httputil.ValidateRequest(req); errs != nil {
        httputil.ValidationError(w, errs)
        return
    }

    // 3. Call service
    resp, err := h.service.Login(r.Context(), req)
    if err != nil {
        switch {
        case errors.Is(err, ErrInvalidCredentials):
            httputil.Unauthorized(w, "Invalid email or password")
        case errors.Is(err, ErrAccountInactive):
            httputil.Forbidden(w, "Account is inactive")
        default:
            h.log.Error("login failed", "error", err)
            httputil.InternalError(w)
        }
        return
    }

    // 4. Return response — ALWAYS wrap in {"data": ...} envelope
    httputil.OK(w, map[string]any{"data": resp})
}
```

**Model with UUID and JSON tags** (models.go):

**CRITICAL:** All structs that serialize to JSON MUST have explicit `json` tags with snake_case names. Without tags, Go uses PascalCase which breaks frontend bindings.

```go
import "github.com/google/uuid"

// ✅ CORRECT - explicit JSON tags (required for all API response structs)
type User struct {
    ID             uuid.UUID  `json:"id"`
    OrganizationID *uuid.UUID `json:"organization_id,omitempty"`
    Email          string     `json:"email"`
    Name           string     `json:"name"`
    UserType       string     `json:"user_type"`
    CreatedAt      time.Time  `json:"created_at"`
    UpdatedAt      time.Time  `json:"updated_at"`
}

// ❌ WRONG - missing JSON tags (will serialize as PascalCase, breaking frontend)
type User struct {
    ID             uuid.UUID   // Becomes "ID" not "id"
    OrganizationID *uuid.UUID  // Becomes "OrganizationID" not "organization_id"
    UserType       string      // Becomes "UserType" not "user_type"
}

func (u *User) ToResponse(orgName *string) UserResponse {
    return UserResponse{
        ID:       u.ID,
        Email:    u.Email,
        Name:     u.Name,
        UserType: u.UserType,
    }
}
```

### Backend Testing

**Test file location:** Same directory as source, with `_test.go` suffix.

**Run tests:**
```powershell
# All tests
go test ./...

# Specific module
go test ./internal/modules/<module>/...

# With coverage
go test -cover ./...

# Verbose output
go test -v ./internal/modules/<module>/...
```

**Test patterns:**
```go
func TestServiceName_MethodName(t *testing.T) {
    // Arrange
    svc := NewService(mockRepo)

    // Act
    result, err := svc.Method(input)

    // Assert
    assert.NoError(t, err)
    assert.Equal(t, expected, result)
}
```

**Table-driven tests:**
```go
func TestValidation(t *testing.T) {
    tests := []struct {
        name    string
        input   Input
        wantErr bool
    }{
        {"valid input", Input{...}, false},
        {"missing field", Input{...}, true},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            err := Validate(tt.input)
            if tt.wantErr {
                assert.Error(t, err)
            } else {
                assert.NoError(t, err)
            }
        })
    }
}
```

---

## Phase 3: Frontend

### File Structure

```
frontend/src/
├── features/<module>/
│   └── api.ts           # Types + API functions together
├── lib/
│   ├── api/
│   │   ├── client.ts    # Axios instance
│   │   └── types.ts     # API error types
│   └── validations/
│       └── <module>.ts  # Zod schemas for forms
├── pages/<module>/
│   └── <page>.tsx       # Page components
├── stores/
│   └── <module>-store.ts # Zustand store (if global state needed)
└── components/
    └── <module>/        # Module-specific components
```

### Implementation Order

1. **API Types + Functions** (`features/<module>/api.ts`)
   - Define types inline (no separate types file)
   - Use `string` for UUID IDs (serialized as strings from backend)
   - Export async functions that call API
   ```ts
   export interface User {
     id: string           // UUID as string
     email: string
     name: string
     organization_id?: string  // Optional UUID
   }

   // Paginated endpoints — use shared PaginatedResponse<T>, NEVER custom types
   import type { PaginatedResponse } from "@/lib/api/types"

   export async function listUsers(params?: ListParams): Promise<PaginatedResponse<User>> {
     const response = await api.get<{ data: PaginatedResponse<User> }>("/users", { params })
     const result = response.data.data
     result.data = result.data ?? []
     return result
   }

   // Non-paginated array endpoints MUST use ?? []
   export async function listAllTags(): Promise<Tag[]> {
     const response = await api.get<{ data: Tag[] }>("/tags")
     return response.data.data ?? []
   }

   // Object endpoints with nested arrays — normalize each array field
   export async function getReport(key: string): Promise<ReportData> {
     const response = await api.get<{ data: ReportData }>(`/reports/${key}/data`)
     const data = response.data.data
     if (data.table) {
       data.table.rows = data.table.rows ?? []
       data.table.columns = data.table.columns ?? []
     }
     data.labels = data.labels ?? []
     return data
   }

   export async function login(data: LoginRequest): Promise<LoginResponse> {
     const response = await api.post<LoginResponse>("/auth/login", data)
     return response.data
   }
   ```

2. **Validation Schemas** (`lib/validations/<module>.ts`)
   - Zod schemas for form validation
   - Export inferred types
   ```ts
   export const loginSchema = z.object({
     email: z.string().min(1, "Email is required").email("Invalid email"),
     password: z.string().min(1, "Password is required"),
   })

   export type LoginData = z.infer<typeof loginSchema>
   ```

3. **Store** (`stores/<module>-store.ts`) - if needed
   - Zustand store for global state
   ```ts
   export const useAuthStore = create<AuthState>((set, get) => ({
     user: null,
     token: null,
     isAuthenticated: false,
     login: (user, token) => set({ user, token, isAuthenticated: true }),
     logout: () => set({ user: null, token: null, isAuthenticated: false }),
   }))
   ```

4. **Pages** (`pages/<module>/<page>.tsx`)
   - Use react-hook-form with zodResolver
   - Use shadcn/ui components
   - Handle API errors with isApiError helper

### Frontend Code Patterns

**Page with form** (pages/<module>/<page>.tsx):
```tsx
export default function LoginPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(data: LoginData) {
    setIsLoading(true)
    try {
      const response = await login(data)
      toast.success("Welcome back!")
      navigate("/dashboard")
    } catch (error) {
      if (isApiError(error)) {
        if (error.code === "UNAUTHORIZED") {
          toast.error("Invalid email or password")
        } else {
          toast.error(error.message || "Login failed")
        }
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* FormFields here */}
      </form>
    </Form>
  )
}
```

**API error handling:**
```ts
import { isApiError } from "@/lib/api/types"

if (isApiError(error)) {
  switch (error.code) {
    case "UNAUTHORIZED": // 401
    case "FORBIDDEN":    // 403
    case "NOT_FOUND":    // 404
    case "CONFLICT":     // 409
    case "RATE_LIMITED": // 429
    case "VALIDATION":   // 400 with field errors
    default:             // Other errors
  }
}
```

### Paginated Response Pattern

Backend and frontend share a standardized paginated response shape. **Never define custom paginated types per module.**

**Backend handler** — use `httputil.NewPaginatedResponse`:
```go
// Constructor: NewPaginatedResponse(items []T, total, page, perPage int)
// Serializes as: {"data": [...], "pagination": {"page":1, "per_page":20, "total":100, "total_pages":5}}
httputil.OK(w, map[string]any{
    "data": httputil.NewPaginatedResponse(companies, total, pq.Page, pq.PerPage),
})
```

**Frontend API function** — use shared `PaginatedResponse<T>` from `@/lib/api/types`:
```ts
import type { PaginatedResponse } from "@/lib/api/types"

// ✅ CORRECT — shared type + null safety
export async function listCompanies(params?: ListParams): Promise<PaginatedResponse<Company>> {
  const response = await api.get<{ data: PaginatedResponse<Company> }>("/crm/companies", { params })
  const result = response.data.data
  result.data = result.data ?? []
  return result
}

// ❌ WRONG — custom per-module paginated type
interface PaginatedCompanies { items: Company[]; total: number; page: number; per_page: number }
```

**Page component** — consume `.data` and `.pagination`:
```tsx
const result = await listCompanies(params)
setCompanies(result.data)        // Company[]
setPagination(result.pagination)  // { page, per_page, total, total_pages }

// Use in PaginationNav:
<PaginationNav
  page={page}
  totalPages={pagination.total_pages}
  total={pagination.total}
  pageSize={PAGE_SIZE}
  onPageChange={setPage}
/>
```

### Frontend Testing

**Test file location:** Same directory as source, with `.test.tsx` suffix.

**Run tests:**
```powershell
cd frontend

# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# With coverage
pnpm test:coverage
```

**Component test pattern:**
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('submits with valid credentials', async () => {
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/password/i), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    })
  })
})
```

---

## Phase 4: E2E Verification

### Prerequisites

1. Claude Code with Chrome extension enabled:
   ```powershell
   claude --chrome
   ```

2. Backend running:
   ```powershell
   cd backend
   go run ./cmd/api
   ```

3. Frontend running:
   ```powershell
   cd frontend
   pnpm dev
   ```

### E2E Test Location

```
e2e/
├── README.md              # How to run E2E tests
├── scenarios/
│   ├── auth/
│   │   ├── login.md
│   │   ├── register.md
│   │   └── logout.md
│   └── <module>/
│       └── <feature>.md
└── fixtures/              # Test data
    └── users.json
```

### E2E Scenario Format

```markdown
# Feature: Login Flow

## Prerequisites
- Backend running at localhost:8080
- Frontend running at localhost:5173
- Test user exists: test@example.com / password123

## Test: Successful Login
1. Navigate to http://localhost:5173/login
2. Enter email: test@example.com
3. Enter password: password123
4. Click the "Sign In" button
5. Verify: Redirected to /dashboard
6. Verify: User name appears in header
7. Verify: No console errors

## Test: Invalid Credentials
1. Navigate to http://localhost:5173/login
2. Enter email: wrong@example.com
3. Enter password: wrongpassword
4. Click the "Sign In" button
5. Verify: Error message "Invalid credentials" appears
6. Verify: Still on /login page
```

### Running E2E Tests

Tell Claude to run a scenario:
```
Run the E2E tests in e2e/scenarios/auth/login.md
```

Or run all scenarios for a module:
```
Run all E2E scenarios in e2e/scenarios/auth/
```

Claude will:
1. Read the scenario file
2. Execute each step in the browser
3. Report pass/fail for each verification
4. Capture console errors if any

---

## Commands Reference

### Backend

| Command | Description |
|---------|-------------|
| `go run ./cmd/api` | Start API server |
| `go run ./cmd/migrate up` | Apply pending migrations |
| `go run ./cmd/migrate down` | Rollback last migration |
| `go run ./cmd/migrate create <name>` | Create new migration |
| `go test ./...` | Run all tests |
| `go test -cover ./...` | Run tests with coverage |
| `go test -v ./internal/modules/<mod>/...` | Test specific module |

### Frontend

| Command | Description |
|---------|-------------|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start dev server (localhost:5173) |
| `pnpm build` | Production build |
| `pnpm test` | Run tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm lint` | Run linter |

### Database

| Command | Description |
|---------|-------------|
| `psql -U postgres -d brothers_dev` | Connect to dev database |

---

## Debugging

### Backend Issues

1. **Check logs** - API logs to stdout with structured logging
2. **Test endpoint directly** - Use `curl` or Postman
3. **Check database** - Verify data exists and is correct
4. **Run specific test** - `go test -v -run TestName ./...`

### Frontend Issues

1. **Check console** - Browser DevTools console
2. **Check network** - DevTools Network tab for API calls
3. **Check React DevTools** - Component state and props
4. **Check Zustand DevTools** - Store state

### E2E Issues

When Claude reports E2E failures:
1. Ask Claude to capture a screenshot
2. Ask Claude to check console for errors
3. Ask Claude to inspect specific elements

---

## Checklist Template

Copy this checklist when starting a new feature:

```markdown
## Feature: [Name]

### Database
- [ ] Create migration file
- [ ] Write up migration SQL
- [ ] Write down migration SQL
- [ ] Apply migration
- [ ] Verify table in database

### Backend
- [ ] Create models
- [ ] Create repository + tests
- [ ] Create service + tests
- [ ] Create handler + tests
- [ ] Wire in module.go
- [ ] Register routes
- [ ] Run all backend tests: `go test ./internal/modules/<module>/...`

### Frontend
- [ ] Create types
- [ ] Create API hooks
- [ ] Create components + tests
- [ ] Create pages
- [ ] Add routes
- [ ] Run all frontend tests: `pnpm test`

### E2E
- [ ] Write E2E scenarios
- [ ] Start backend and frontend
- [ ] Run E2E scenarios with Claude Chrome
- [ ] Fix any issues found

### Done
- [ ] All tests passing
- [ ] E2E verification complete
- [ ] Code reviewed
```

---

## Boilerplate Uplift Awareness

This project may be a fork of the Brothers Boilerplate. After implementing a fix or feature, assess whether it should be **uplifted (backported) to the boilerplate repo**.

### What to Flag in Commit Messages

When a commit touches generic infrastructure (not project-specific logic), add a `[UPLIFT]` tag to the commit message:

```
[UPLIFT] Fix nil pointer in job queue retry logic

Fix: job queue worker panics when retry_count is NULL in older jobs.
Initialize retry_count to 0 in the scan fallback.
```

### What Qualifies as Uplift

- Bug fixes in `internal/infra/*` (middleware, config, database, HTTP utils, storage, Redis, WebSocket)
- Bug fixes in core/shared modules (`auth`, `rbac`, `files`, `tags`, `notes`, `favorites`, `reminders`, `notifications`, `jobs`, `email`)
- Frontend infra fixes (API client, auth store, routing guards, shared hooks, `components/ui/*`)
- Fixes to migration runner, setup scripts, or dev tooling
- Improvements to `docs/architecture/` patterns
- Skill file or `CLAUDE.md` convention updates

### What Does NOT Qualify

- Project-specific feature code, pages, or routes
- Business logic unique to this project
- Project-specific migrations or seed data
- Branding, styling, or configuration changes

### Workflow

1. Implement the fix/feature as normal
2. If it touches generic code, add `[UPLIFT]` to the commit message
3. The user will cherry-pick `[UPLIFT]` commits to the boilerplate repo periodically

## Output Expectations

When implementing:
- Follow the established patterns in `docs/architecture/` and the feature's tech-plan
- Write tests as you implement, not after
- Run tests frequently - fix failures immediately
- Verify in browser before marking complete
- Report any blockers or architectural questions

## Frontend UI Patterns

### Page Header — Action Button Hierarchy

Pages with multiple actions should use a **primary + overflow menu** pattern:

- **Primary (always visible)**: Frequent actions and the main CTA (max 2-3 buttons)
- **Overflow menu (`...` DropdownMenu)**: Infrequent, secondary, or destructive actions

```tsx
<div className="flex items-center gap-2">
  <Button variant="outline" size="sm">Refresh</Button>
  <Button size="sm">+ Add Members</Button>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="icon" className="size-8">
        <EllipsisVerticalIcon className="size-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>Board View</DropdownMenuItem>
      <DropdownMenuItem>Settings</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>
```

### Responsive Page Layout

- **Header**: Use `flex flex-wrap` so title/badges stack above actions on mobile
- **Table containers**: Always add `overflow-x-auto` to the wrapper `div`
- **Search + controls rows**: Use `flex flex-col sm:flex-row` to stack vertically on mobile
- **Metadata line**: Add `flex-wrap` to prevent overflow on small screens

### Multi-Step Forms

- **Create mode**: Use a wizard with step indicator (numbered circles + connecting lines). Validate per step with "Next" button. Omit tabs that are meaningless before save.
- **Edit mode**: Use tabs with red dot error indicators (`<span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-destructive" />`) on tab triggers that have validation errors.

### Entity Detail Pages

Entity detail pages use `DetailLayout` (`components/crm/detail-layout.tsx`) with a `header` prop. Header, tab bar, and tab content all live inside one unified `Card`. Use `ScrollableTabBar` for the tab bar — it provides horizontal scrolling on small screens and a "More" dropdown for overflow tabs:

```tsx
import { ScrollableTabBar } from "@/components/ui/scrollable-tab-bar";

<DetailLayout
  header={<div>...back button, title, badges, actions...</div>}
  sidebar={<EntitySidebar ... />}
>
  <Tabs value={activeTab} onValueChange={setActiveTab}>
    <ScrollableTabBar
      primaryTabs={[
        { value: "activities", label: "Activities" },
        { value: "deals", label: "Deals" },
        { value: "emails", label: "Emails" },
      ]}
      moreTabs={[
        { value: "files", label: "Files" },
        { value: "notes", label: "Notes" },
        { value: "calendar", label: "Calendar" },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
    <TabsContent value="activities" className="px-4 sm:px-6 py-6">
      ...
    </TabsContent>
  </Tabs>
</DetailLayout>
```

Key rules:
- **Split tabs**: Frequent/core tabs in `primaryTabs` (visible), infrequent tabs in `moreTabs` (dropdown)
- `ScrollableTabBar` handles `border-b`, `px-4 sm:px-6`, and `overflow-x-auto scrollbar-hide` internally
- Each `TabsContent` provides its own padding: `px-4 sm:px-6 py-6`
- Sidebar `CardContent` uses `px-6 pb-6 pt-0` to align with `CardHeader`
- Edit mode uses `Sheet` (slide-out panel), not inline replacement
- Reference: `pages/app/crm/contact-detail.tsx`, `pages/app/projects/project-detail.tsx`

## Lessons Learned

<!--
Add developer-specific patterns discovered through corrections here.
Format: - **[YYYY-MM-DD]** Brief lesson description
Graduate stable lessons into main sections above, then remove from here.
-->

- **[2026-02-03]** Go structs MUST have explicit JSON tags for API responses. Without tags, Go serializes as PascalCase (`MaxAttempts`) but frontend expects snake_case (`max_attempts`), causing silent data binding failures where fields appear as `undefined`.
- **[2026-02-17]** **RECURRING (DEF-006, DEF-011, DEF-023, DEF-026, DEF-032):** All Go nil slices serialize as `null`. Normalize at the API layer (`features/<module>/api.ts`): (1) Top-level array returns → `return response.data.data ?? []`. (2) Nested array fields in object responses → `data.field = data.field ?? []` for each array field. Both cases are project conventions in `CLAUDE.md`.
- **[2026-02-03]** Enum/status values must be case-insensitive at ALL layers: (1) **Go validation** — use `strings.ToLower()` in switch statements (`switch strings.ToLower(r.Type)` with lowercase cases), never match against capitalized literals directly. (2) **SQL filters** — use `LOWER(c.column) = LOWER($N)` for enum columns. (3) **Search** — use `ILIKE '%term%'` for free-text search. Frontend sends lowercase but seed data/manual inserts may store capitalized values. Only use exact `=` for UUIDs, timestamps, and booleans.
- **[2026-02-05]** When adding a service that needs the job queue via deferred injection, add a `SetJobQueue()` method AND add the injection call in `app.go:InitJobQueue()`. Missing this causes nil pointer panics at runtime.
- **[2026-02-05]** When creating jobs with a new queue name (e.g., `"notifications"`), add it to the default `JOB_WORKER_QUEUES` in `config/essential.go`. Otherwise the worker never polls the queue and jobs sit unprocessed.
- **[2026-02-11]** Nullable DB columns MUST use pointer types in Go structs (`*string`, `*uuid.UUID`, `*time.Time`). pgx cannot scan SQL NULL into non-pointer types and will error: `cannot scan NULL into *string`. Always check the migration for `NOT NULL` constraints — if a column lacks it, use a pointer.
- **[2026-02-11]** When using `rows.Values()` from pgx v5, UUID columns come back as `[16]byte`, not `uuid.UUID` or `string`. Type assertions on `.(string)` or `.(uuid.UUID)` will silently fail. Convert explicitly: `uuid.UUID(v).String()` for `[16]byte`. Prefer `rows.Scan()` into typed fields when possible.
- **[2026-02-13]** Handler responses MUST wrap data in `map[string]any{"data": result}`. `httputil.OK(w, result)` does NOT auto-wrap — it encodes raw data. Frontend expects `response.data.data`; without the envelope, all data bindings silently return `undefined`. This caused the entire forms module to appear empty despite correct DB data.
- **[2026-02-17]** RBAC route `rp()` keys must match the exact dotted keys in the RBAC registry (`rp("crm.contacts", "view")`, not `rp("crm", "view")`). `HasPermission` does exact key lookup — mismatched keys silently return 403 for every request.
- **[2026-02-17]** When wiring a module in `app.go`, verify every repo/service/handler created is stored on the App struct AND every `Register*Routes()` function is called in route registration. Missing either causes silent 404s. (DEF-033: `companyRepo` was created but never wired into service/handler, and `RegisterCompanyRoutes` was never called.)
- **[2026-02-17]** SQL column constants with table aliases (`c.id, c.name`) fail in `INSERT ... RETURNING` — PostgreSQL has no table alias in INSERT context. Always define a separate `*ColumnsUnaliased` constant (without `c.`/`d.`/etc. prefixes) and use it for `INSERT ... RETURNING`. `SELECT` and `UPDATE ... RETURNING` can use the aliased version.
- **[2026-02-21]** **RECURRING:** Never guess column names when writing SQL JOINs to other modules' tables. Always verify actual column names by checking the migration file. Common gotchas: `auth_users` has `name` (NOT `full_name`), `crm_contacts` has `full_name` (generated from `first_name || ' ' || last_name`). The tech plan may use conceptual names that don't match the actual schema — the migration is the source of truth.
- **[2026-02-28]** Zustand selectors with `?? []` or `?? {}` fallbacks create new references every evaluation, causing infinite re-renders (`Object.is([], [])` is `false`). Use a module-level constant instead: `const EMPTY: T[] = []` then `selector ?? EMPTY`. Primitives (`?? false`, `?? 0`, `?? ""`) are safe. Same applies to `useEffect` dependency arrays — never put a full array/object from a Zustand selector as a dependency; use `.length` or a ref instead.
