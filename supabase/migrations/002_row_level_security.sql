
-- CIS 3610 Neighborhood Listing Platform
-- Migration 002: Row-Level Security Policies
-- Requires Migration 001

-- ============================================
-- 1. DEFAULT-DENY PERMISSIONS
-- ============================================

REVOKE ALL ON TABLE
    public.profiles,
    public.properties,
    public.sponsors,
    public.property_sponsors,
    public.inquiries
FROM anon, authenticated;

-- Keep RLS enabled on every application table.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. PROFILES
-- ============================================

-- Users can read only their own profile.
GRANT SELECT ON public.profiles TO authenticated;

CREATE POLICY "Users read own profile"
ON public.profiles
FOR SELECT TO authenticated
USING (user_id = (SELECT auth.uid()));

-- Profiles and administrator flags are created
-- or modified only through trusted server code.
-- No client INSERT, UPDATE, or DELETE grants.

-- ============================================
-- 3. PROPERTIES: READ
-- ============================================

-- Public can read approved properties.
-- Anonymous users may read public listing fields only.
GRANT SELECT (
    property_id,
    address,
    price,
    bedrooms,
    bathrooms,
    square_feet,
    amenities,
    zip_code,
    is_approved,
    created_at
)
ON public.properties TO anon;

-- Authenticated users may read property records.
-- RLS determines which rows they can access.
GRANT SELECT ON public.properties TO authenticated;

CREATE POLICY "Public reads approved properties"
ON public.properties
FOR SELECT TO anon, authenticated
USING (is_approved = TRUE);

-- Owners can also read their own drafts.
CREATE POLICY "Owners read own properties"
ON public.properties
FOR SELECT TO authenticated
USING (owner_id = (SELECT auth.uid()));

-- ============================================
-- 4. PROPERTIES: INSERT
-- ============================================

-- Grant only the columns owners may supply.
GRANT INSERT (
    owner_id,
    address,
    price,
    bedrooms,
    bathrooms,
    square_feet,
    amenities,
    zip_code
)
ON public.properties TO authenticated;

-- Required for generated property IDs.
GRANT USAGE ON SEQUENCE
public.properties_property_id_seq
TO authenticated;

CREATE POLICY "Owners insert own properties"
ON public.properties
FOR INSERT TO authenticated
WITH CHECK (
    owner_id = (SELECT auth.uid())
    AND is_approved = FALSE
);

-- ============================================
-- 5. PROPERTIES: UPDATE
-- ============================================

-- Owners cannot change owner_id, is_approved,
-- property_id, or administrative metadata.
GRANT UPDATE (
    address,
    price,
    bedrooms,
    bathrooms,
    square_feet,
    amenities,
    zip_code
)
ON public.properties TO authenticated;

CREATE POLICY "Owners update unapproved properties"
ON public.properties
FOR UPDATE TO authenticated
USING (
    owner_id = (SELECT auth.uid())
    AND is_approved = FALSE
)
WITH CHECK (
    owner_id = (SELECT auth.uid())
    AND is_approved = FALSE
);

-- No client DELETE permission or policy.

-- ============================================
-- 6. SPONSORS
-- ============================================

-- Public can read active sponsors.
GRANT SELECT ON public.sponsors
TO anon, authenticated;

CREATE POLICY "Public reads active sponsors"
ON public.sponsors
FOR SELECT TO anon, authenticated
USING (is_active = TRUE);

-- Sponsor creation, updates, and deletion
-- are restricted to trusted server code.

-- ============================================
-- 7. PROPERTY SPONSORS
-- ============================================

GRANT SELECT ON public.property_sponsors
TO anon, authenticated;

-- Show relationships only when the property
-- is approved and the sponsor is active.
CREATE POLICY "Public reads approved sponsorships"
ON public.property_sponsors
FOR SELECT TO anon, authenticated
USING (
    EXISTS (
        SELECT 1
        FROM public.properties p
        WHERE p.property_id =
              property_sponsors.property_id
          AND p.is_approved = TRUE
    )
    AND EXISTS (
        SELECT 1
        FROM public.sponsors s
        WHERE s.sponsor_id =
              property_sponsors.sponsor_id
          AND s.is_active = TRUE
    )
);

-- Only trusted server code changes sponsorships.

-- ============================================
-- 8. INQUIRIES
-- ============================================

-- Users can read only inquiries they sent.
GRANT SELECT ON public.inquiries
TO authenticated;

CREATE POLICY "Senders read own inquiries"
ON public.inquiries
FOR SELECT TO authenticated
USING (sender_id = (SELECT auth.uid()));

-- Users can submit inquiries about approved
-- property listings.
GRANT INSERT (
    property_id,
    sender_id,
    message
)
ON public.inquiries TO authenticated;

GRANT USAGE ON SEQUENCE
public.inquiries_inquiry_id_seq
TO authenticated;

CREATE POLICY "Users create own inquiries"
ON public.inquiries
FOR INSERT TO authenticated
WITH CHECK (
    sender_id = (SELECT auth.uid())
    AND EXISTS (
        SELECT 1
        FROM public.properties p
        WHERE p.property_id = inquiries.property_id
          AND p.is_approved = TRUE
    )
);

-- No client UPDATE or DELETE policies.

-- ============================================
-- 9. SECURITY DESIGN NOTES
-- ============================================

-- The service_role bypasses RLS and must
-- NEVER be exposed in browser-side code.
--
-- Administrative actions require trusted
-- server-side authorization.
--
-- RLS does not replace server-side validation.
-- API routes must validate inputs and verify
-- authentication before modifying records.
--
-- All client access defaults to denied unless
-- explicitly granted and permitted by RLS.
