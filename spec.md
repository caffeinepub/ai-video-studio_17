# AI Video Studio

## Current State
- Full-stack AI video generation platform with Motoko backend and React frontend
- Users can submit text prompts with style and duration options to create video jobs
- Jobs cycle through: pending → processing → completed
- LibraryPage and JobDetailPage poll `simulateProgress()` every 3-4 seconds to advance job status
- LandingPage shows public stats and a gallery of latest jobs
- Backend has authorization roles: `#user` and `#admin`

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- `simulateProgress()`: Change permission check from `#admin` to `#user` so regular logged-in users can call it to advance their own jobs' statuses
- `getLatestJobs()`: Change permission check from `#admin` to no auth required (public query) so the landing page gallery works for all visitors
- `simulateProgress()` time threshold: Reduce from 90 seconds (90_000_000_000 ns) to 10 seconds (10_000_000_000 ns) so jobs advance quickly during demo use
- `simulateProgress()` logic: Only advance jobs owned by the caller (not all jobs), to avoid users advancing each other's jobs

### Remove
- Nothing

## Implementation Plan
1. Update `simulateProgress` to require `#user` permission (not `#admin`), filter to only advance the caller's own jobs, and use a 10-second threshold
2. Update `getLatestJobs` to be a public query with no auth required
3. Keep all other backend logic unchanged
4. No frontend changes needed - the polling logic is already correct
