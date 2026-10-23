
-- CIS 3610 Neighborhood Listing Platform
-- Migration 005: Secure Sponsor RLS
-- Requires Migration 004

-- Remove the original policy that allowed all active
-- sponsors to be publicly visible.
DROP POLICY IF EXISTS "Public reads active sponsors"
ON public.sponsors;

-- Public clients can only read approved, active
-- sponsors with currently valid campaigns.
CREATE POLICY "Public reads eligible sponsors"
ON public.sponsors
FOR SELECT TO anon, authenticated
USING (
    status = 'APPROVED'
    AND is_active = TRUE
    AND CURRENT_DATE BETWEEN start_date AND end_date
);

-- Remove unrestricted sponsor column access.
REVOKE SELECT ON public.sponsors FROM anon, authenticated;

-- Grant access only to public-facing fields.
GRANT SELECT (
    sponsor_id,
    business_name,
    description,
    website_url,
    status,
    is_active,
    tier,
    priority,
    placement,
    target_zip,
    start_date,
    end_date
)
ON public.sponsors TO anon, authenticated;
