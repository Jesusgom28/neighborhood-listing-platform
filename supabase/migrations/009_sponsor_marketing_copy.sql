
-- CIS 3610 Lab 7: Sponsor Marketing Copy
-- Requires migrations 001-008

CREATE TABLE public.sponsor_marketing_copy (
    copy_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    sponsor_id INTEGER NOT NULL
        REFERENCES public.sponsors(sponsor_id)
        ON DELETE CASCADE,

    copy_text VARCHAR(120) NOT NULL,

    status TEXT NOT NULL DEFAULT 'DRAFT'
        CHECK (
            status IN (
                'DRAFT',
                'APPROVED',
                'REJECTED',
                'EXPIRED'
            )
        ),

    source_facts TEXT NOT NULL,

    approved_by TEXT,
    approved_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT marketing_copy_not_blank
        CHECK (LENGTH(TRIM(copy_text)) > 0),

    CONSTRAINT marketing_copy_approval_required
        CHECK (
            status <> 'APPROVED'
            OR (
                approved_by IS NOT NULL
                AND LENGTH(TRIM(approved_by)) > 0
                AND approved_at IS NOT NULL
            )
        )
);

-- Enable Row Level Security.
ALTER TABLE public.sponsor_marketing_copy
ENABLE ROW LEVEL SECURITY;

-- No public access to drafts or approval records.
REVOKE ALL ON public.sponsor_marketing_copy
FROM PUBLIC, anon, authenticated;

-- No client-side policies or write permissions.
-- Future publishing must use an authorized
-- server-side workflow.
