
-- CIS 3610 Neighborhood Listing Platform
-- Migration 004: Contextual Sponsor Selection
-- Requires migrations 001-003

-- Administrative approval and campaign configuration.
ALTER TABLE public.sponsors
ADD COLUMN status TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
ADD COLUMN tier TEXT NOT NULL DEFAULT 'SILVER'
    CHECK (tier IN ('SILVER', 'GOLD', 'PLATINUM')),
ADD COLUMN priority INTEGER NOT NULL DEFAULT 0,
ADD COLUMN placement TEXT NOT NULL DEFAULT 'PROPERTY_DETAIL'
    CHECK (placement IN ('PROPERTY_DETAIL', 'SEARCH_RESULTS')),
ADD COLUMN start_date DATE,
ADD COLUMN end_date DATE,
ADD COLUMN target_zip VARCHAR(5)
    CHECK (target_zip ~ '^[0-9]{5}$'),
ADD COLUMN impression_count BIGINT NOT NULL DEFAULT 0
    CHECK (impression_count >= 0);

-- A campaign must have valid dates and a target ZIP.
ALTER TABLE public.sponsors
ADD CONSTRAINT sponsors_campaign_validity
CHECK (
    start_date IS NULL
    OR end_date IS NULL
    OR start_date <= end_date
);

-- Ensure the sponsor has a usable campaign configuration
-- before marking it approved.
ALTER TABLE public.sponsors
ADD CONSTRAINT sponsors_approved_requirements
CHECK (
    status <> 'APPROVED'
    OR (
        start_date IS NOT NULL
        AND end_date IS NOT NULL
        AND target_zip IS NOT NULL
        AND website_url IS NOT NULL
    )
);

-- Approved sponsors must still be active and within
-- their campaign dates to qualify for placement.
-- Exact ZIP matching will be used initially.
-- Geographic radius matching can be added using
-- verified coordinates rather than ZIP-number distance.

-- No new client INSERT, UPDATE, or DELETE grants.
-- Administrative changes remain server-side.
