
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
