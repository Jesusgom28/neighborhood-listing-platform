
-- CIS 3610 Examination: Row-Level Security
-- Run in the separate examination project.

BEGIN;

-- Grant table permissions; RLS still restricts rows.
GRANT SELECT ON public.properties, public.sponsors,
    public.property_sponsors TO anon, authenticated;

GRANT INSERT ON public.inquiries TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
    ON public.properties TO authenticated;

GRANT SELECT ON public.inquiries TO authenticated;

GRANT SELECT ON public.profiles TO authenticated;

-- Profiles: users can read their own profile.
CREATE POLICY "Users read own profile"
ON public.profiles FOR SELECT TO authenticated
USING (id = (SELECT auth.uid()));

-- Properties: public sees approved listings only.
CREATE POLICY "Public reads approved properties"
ON public.properties FOR SELECT TO anon, authenticated
USING (status = 'approved');

-- Owners can also see their own listings.
CREATE POLICY "Owners read own properties"
ON public.properties FOR SELECT TO authenticated
USING (owner_id = (SELECT auth.uid()));

-- Owners create drafts under their own identity.
CREATE POLICY "Owners insert own drafts"
ON public.properties FOR INSERT TO authenticated
WITH CHECK (
    owner_id = (SELECT auth.uid())
    AND status = 'draft'
    AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = (SELECT auth.uid())
          AND role = 'property_owner'
    )
);

-- Owners may only update drafts or rejected listings.
CREATE POLICY "Owners update editable properties"
ON public.properties FOR UPDATE TO authenticated
USING (
    owner_id = (SELECT auth.uid())
    AND status IN ('draft', 'rejected')
)
WITH CHECK (
    owner_id = (SELECT auth.uid())
    AND status IN ('draft', 'rejected')
);

-- Owners may delete their own non-live listings.
CREATE POLICY "Owners delete own properties"
ON public.properties FOR DELETE TO authenticated
USING (
    owner_id = (SELECT auth.uid())
    AND status IN ('draft', 'rejected')
);

-- Only active sponsors are publicly visible.
CREATE POLICY "Public reads active sponsors"
ON public.sponsors FOR SELECT TO anon, authenticated
USING (active_status = true);

-- Only links for approved properties are visible.
CREATE POLICY "Public reads approved sponsor links"
ON public.property_sponsors FOR SELECT TO anon, authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.properties
        WHERE properties.id = property_sponsors.property_id
          AND properties.status = 'approved'
    )
);

-- Anyone can submit an inquiry for an approved listing.
CREATE POLICY "Public submits inquiries"
ON public.inquiries FOR INSERT TO anon, authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.properties
        WHERE properties.id = inquiries.property_id
          AND properties.status = 'approved'
    )
);

-- Owners can read inquiries for their properties.
CREATE POLICY "Owners read property inquiries"
ON public.inquiries FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.properties
        WHERE properties.id = inquiries.property_id
          AND properties.owner_id = (SELECT auth.uid())
    )
);

COMMIT;
