# Field Ops MVP (Trip Checklist)

This MVP adds a shared `/field-ops` board for trip testing workflows:

- Approved participant name selection
- Shared trip code gate
- Route-grouped tasks
- Task assignment/status/notes updates
- Task photo uploads
- Shared gallery with route and participant filters

## Current backend shape

The backend is implemented as a Netlify Function at:

- `netlify/functions/field-ops.mjs`

The function currently stores state in temporary runtime storage (`/tmp`) for fast MVP iteration.

### Why this is temporary

- It is suitable for low-friction field testing.
- It is **not durable** enough for long-term production storage.

## Environment variables

- `FIELD_OPS_ACTIVE_SLUG` (default: `apr-2026-field-test`)
- `FIELD_OPS_ACTIVE_TITLE` (default: `Universal Hunt Trip Board — April 2026 Field Test`)
- `FIELD_OPS_TRIP_CODE` (default: `universal-ops`)
- `FIELD_OPS_PARTICIPANTS` (comma-separated names)

Example:

```bash
FIELD_OPS_TRIP_CODE="my-shared-code"
FIELD_OPS_PARTICIPANTS="Mike,Alice,Bob"
```

## API routes

Redirected by `netlify.toml`:

- `GET /api/field-ops/board?slug=...`
- `POST /api/field-ops/session`
- `GET /api/field-ops/tasks?slug=...`
- `POST /api/field-ops/tasks/:id/update`
- `POST /api/field-ops/tasks/:id/upload`
- `GET /api/field-ops/gallery?slug=...`
- `GET /api/field-ops/attachments/:id`
- `DELETE /api/field-ops/attachments/:id`

## Frontend route

- `src/pages/FieldOps.tsx`
- Route: `/field-ops`

## Next hardening pass

1. Replace `/tmp` storage with Netlify DB + Netlify Blobs adapters.
2. Add upload retry + duplicate-submission guard.
3. Add activity log table/view for auditing task updates.
