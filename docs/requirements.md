
# CIS 3610 Practical Examination
## Product Requirements & Acceptance Criteria

### Project: Sponsor-Backed Property Listing & Inquiry Subsystem

The purpose of this subsystem is to allow property owners to submit property listings, enable visitors to browse approved listings and active sponsors, and provide administrators with secure oversight of platform records.

## Story 1 — Property Owner

**User Story:** As a registered property owner, I want to submit listing drafts so that prospective buyers can review them once verified by administrative staff.

**Scope Estimate:** Medium

**Acceptance Criteria:**

- **Given** an authenticated property owner, **when** they submit a valid property listing, **then** the system saves the listing with `status = 'draft'` and sets `owner_id` to their authenticated user ID (`auth.uid()`).
- **Given** a property owner, **when** they attempt to update another owner's listing, **then** the system denies the operation.
- **Given** a property owner, **when** they attempt to update their own approved listing, **then** the system denies the operation.

**Technical Traceability:**
- Database: `profiles`, `properties`
- Migration: `supabase/migrations/20261029140000_exam_schema_persistence.sql`
- Route: `src/app/api/properties/route.ts` — POST
- Security: Owner-scoped RLS policies

## Story 2 — Public Inquirer

**User Story:** As a prospective neighborhood resident, I want to view approved properties alongside their tier-level sponsors and submit an inquiry without seeing prior inquiries from other users.

**Scope Estimate:** Large

**Acceptance Criteria:**

- **Given** an anonymous visitor, **when** they request property listings, **then** the system returns only properties with `status = 'approved'`.
- **Given** an approved property associated with sponsors, **when** its sponsors are displayed, **then** only sponsors with `active_status = true` are visible.
- **Given** a visitor, **when** they submit an inquiry with a valid email address and a message containing at least 10 characters, **then** the system saves the inquiry.
- **Given** an anonymous visitor, **when** they attempt to read previously submitted inquiries, **then** access is denied.

**Technical Traceability:**
- Database: `properties`, `sponsors`, `property_sponsors`, `inquiries`
- Migration: `supabase/migrations/20261029140000_exam_schema_persistence.sql`
- Route: `src/app/api/properties/route.ts` — GET
- Inquiry handling: RLS INSERT policy; inquiry route to be implemented if needed
- Security: Public-read and inquiry-isolation RLS policies

## Story 3 — Platform Administrator

**User Story:** As a platform administrator, I want full override authority across all records and tables to conduct compliance audits.

**Scope Estimate:** Large

**Acceptance Criteria:**

- **Given** an authorized administrator, **when** they access platform records through an elevated server-side operation, **then** they can read records across all five tables.
- **Given** an authorized administrator, **when** they perform a permitted administrative update, **then** the operation succeeds.
- **Given** an unauthorized user, **when** they attempt an administrator-only operation, **then** the system denies access.
- **Given** a public visitor, **when** they interact with the application, **then** elevated service credentials are never exposed.

**Technical Traceability:**
- Database: All five examination tables
- Migration: `supabase/migrations/20261029140000_exam_schema_persistence.sql`
- Server credentials: `src/lib/supabaseServer.ts`
- Security: Elevated service execution restricted to authorized server operations
- Audit: `docs/security-audit.md`

## Requirements Traceability Summary

| Story | Scope | Database Tables | Route / Security |
|---|---|---|---|
| Property Owner | Medium | profiles, properties | POST /api/properties; owner RLS |
| Public Inquirer | Large | properties, sponsors, property_sponsors, inquiries | GET /api/properties; public and inquiry RLS |
| Platform Administrator | Large | All five tables | Authorized server execution; security audit |

## Verification Plan

The implementation will be verified through schema validation, database migration execution, positive and negative RLS tests, API response testing, and confirmation that unauthorized users cannot access restricted records.

Test outcomes will be documented in `docs/security-audit.md`.
