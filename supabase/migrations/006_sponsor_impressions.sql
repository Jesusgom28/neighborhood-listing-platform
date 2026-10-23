
-- Migration 006: Privacy-conscious sponsor impressions

CREATE TABLE IF NOT EXISTS public.sponsor_impressions (
    impression_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sponsor_id INTEGER NOT NULL
        REFERENCES public.sponsors(sponsor_id),
    property_id INTEGER NOT NULL
        REFERENCES public.properties(property_id),
    placement TEXT NOT NULL
        CHECK (placement IN ('PROPERTY_DETAIL', 'SEARCH_RESULTS')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security.
ALTER TABLE public.sponsor_impressions
ENABLE ROW LEVEL SECURITY;

-- No public access policies.
-- Impression recording will use a validated server-side endpoint.

CREATE INDEX IF NOT EXISTS idx_sponsor_impressions_sponsor
ON public.sponsor_impressions (sponsor_id, created_at);
