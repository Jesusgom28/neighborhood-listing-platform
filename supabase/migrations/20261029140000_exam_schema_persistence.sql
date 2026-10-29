
-- CIS 3610 Practical Examination
-- Migration: 20261029140000_exam_schema_persistence.sql
-- Run ONLY in the separate examination Supabase project.

BEGIN;

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY
        REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'public'
        CHECK (role IN (
            'admin', 'property_owner', 'sponsor', 'public'
        )),
    created_at TIMESTAMPTZ NOT NULL
        DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.sponsors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL CHECK (char_length(name) >= 2),
    tier TEXT NOT NULL
        CHECK (tier IN ('gold', 'silver', 'bronze')),
    active_status BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL
        DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL
        REFERENCES public.profiles(id) ON DELETE RESTRICT,
    address TEXT NOT NULL,
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    bedrooms INTEGER NOT NULL CHECK (bedrooms >= 0),
    bathrooms NUMERIC(3,1) NOT NULL CHECK (bathrooms >= 0),
    square_feet INTEGER NOT NULL CHECK (square_feet > 0),
    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN (
            'draft', 'pending', 'approved', 'rejected'
        )),
    created_at TIMESTAMPTZ NOT NULL
        DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.property_sponsors (
    property_id UUID NOT NULL
        REFERENCES public.properties(id) ON DELETE CASCADE,
    sponsor_id UUID NOT NULL
        REFERENCES public.sponsors(id) ON DELETE CASCADE,
    PRIMARY KEY (property_id, sponsor_id)
);

CREATE TABLE public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL
        REFERENCES public.properties(id) ON DELETE CASCADE,
    inquirer_email TEXT NOT NULL
        CHECK (
            inquirer_email ~*
            '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
        ),
    message TEXT NOT NULL
        CHECK (char_length(message) >= 10),
    created_at TIMESTAMPTZ NOT NULL
        DEFAULT timezone('utc'::text, now())
);

-- Enable default-deny Row-Level Security.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

COMMIT;
