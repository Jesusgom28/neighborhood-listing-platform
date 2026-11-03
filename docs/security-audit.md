
# CIS 3610 Practical Examination
## Row-Level Security Audit

### Purpose

This document verifies the security requirements of the Sponsor-Backed Property Listing & Inquiry Subsystem.

The examination database uses PostgreSQL Row-Level Security (RLS) to restrict access based on authentication, ownership, and administrative authorization.

### Database Tables

RLS is enabled on:

- profiles
- properties
- sponsors
- property_sponsors
- inquiries

### Authorization Test Matrix

| Role | Operation | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| Anonymous | Read approved property | Allowed | Not tested | Pending |
| Anonymous | Read draft property | Denied | Not tested | Pending |
| Owner A | Update own draft property | Allowed | Not tested | Pending |
| Owner A | Update Owner B property | Denied | Not tested | Pending |
| Owner A | Update approved property | Denied | Not tested | Pending |
| Inquirer | Submit valid inquiry | Allowed | Not tested | Pending |
| Inquirer | Read existing inquiries | Denied | Not tested | Pending |
| Admin | Read all records using authorized elevated execution | Allowed | Not tested | Pending |
| Admin | Modify records using authorized elevated execution | Allowed | Not tested | Pending |

### Implementation Evidence

The examination schema migration executed successfully in Supabase.

Migration:
`20261029140000_exam_schema_persistence.sql`

The initial RLS policy SQL also executed successfully.

Migration:
`20261029141000_exam_rls_policies.sql`

Successful SQL execution confirms that the statements were accepted. It does not independently prove the authorization outcomes.

### Security Requirements

1. Anonymous visitors may read approved properties only.
2. Public visitors may view active sponsors.
3. Property owners may create drafts associated with their authenticated identity.
4. Property owners must not modify other owners' properties.
5. Approved listings must not be editable by ordinary property owners.
6. Public users may submit valid inquiries without reading prior inquiries.
7. Administrative operations must use authorized server-side execution.
8. Service-role credentials must never be exposed to client-side code.

### Outstanding Verification

- Create test users with distinct roles.
- Create approved and draft properties.
- Execute positive and negative authorization tests.
- Verify owner role restrictions.
- Verify inquiry isolation.
- Verify authorized administrative operations.
- Record actual results and supporting evidence.

### Conclusion

The examination database schema and initial RLS policies have been applied successfully. Authorization testing and final security verification remain pending.



## API Verification Results — November 2, 2026

The following tests were performed against the examination
Supabase project using the Next.js property API.

| Test | Expected | Actual | Result |
|---|---|---|---|
| Public GET /api/properties | 200 | 200, empty properties array | PASS |
| POST without authentication | 401 | 401 Authentication required | PASS |
| Authenticated property owner POST | 201 | 201, property draft created | PASS |
| POST with negative price | 400 | 400, price validation error | PASS |

### Property Creation Evidence

An authenticated test owner successfully created a property.

Property ID:
572d84b2-aecb-4e00-8bbd-afbf97ed9cbe

### Validation Evidence

A negative price of -100 was rejected with HTTP 400.

Response:
Property validation failed — Price cannot be negative.

### Remaining Security Tests

- Verify that Owner A cannot modify Owner B's property.
- Verify that anonymous users cannot read draft properties.
- Verify that owners cannot approve their own properties.
- Verify inquiry access restrictions.
- Verify authorized administrative operations.

These remaining tests have not yet been marked as passed.



### Additional RLS Verification — November 2, 2026

| Test | Expected Result | Actual Result | Status |
|---|---|---|---|
| Owner B reads Owner A's draft | 0 visible records | 0 records | PASS |
| Owner B updates Owner A's draft | 0 updated records | 0 records | PASS |
| Owner A attempts to approve own draft | RLS rejection | PostgreSQL error 42501 | PASS |

The tests used simulated authenticated user identities in the Supabase SQL Editor.

The approval attempt was rejected with:
"new row violates row-level security policy for table properties"

The tests do not yet establish that all RLS policies are secure.



### Inquiry Security Verification

| Test | Actual Result | Status |
|---|---|---|
| Anonymous inquiry submission for approved property | INSERT completed without error | PASS |
| Anonymous user attempts to read inquiries | PostgreSQL error 42501: permission denied | PASS |

The inquiry tests used the Supabase SQL Editor with
the anonymous database role.

Anonymous users were permitted to submit inquiries
about approved properties but were denied SELECT
access to private inquiry records.

Administrative authorization and authenticated
cross-owner inquiry access still require verification.


