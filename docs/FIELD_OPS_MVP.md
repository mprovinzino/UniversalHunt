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

The function now stores board state and attachments in Netlify Blobs when running on Netlify, with a `/tmp` fallback for local/off-platform development. It also keeps a lightweight activity feed for task/attachment events.

### Why this is still MVP-shaped

- It is durable enough for live field testing on Netlify.
- It still uses a single shared JSON document for board metadata, so highly concurrent editing is not yet modeled like a full database-backed system.

## Environment variables

- `FIELD_OPS_ACTIVE_SLUG` (default: `apr-2026-field-test`)
- `FIELD_OPS_ACTIVE_TITLE` (default: `Universal Hunt Trip Board — April 2026 Field Test`)
- `FIELD_OPS_TRIP_CODE` (default: `hunt`)
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
- `GET /api/field-ops/activity?slug=...`

## Frontend route

- `src/pages/FieldOps.tsx`
- Route: `/field-ops`

## Next hardening pass

1. Consider a normalized database layer if board history, analytics, or concurrent editing become more complex.
2. Add richer upload progress/offline-resume UX for spotty park connectivity.
3. Add operator tooling for board reset/export and attachment cleanup.
