
-- Prevent duplicate sponsor impressions within
-- the same UTC calendar minute.

CREATE UNIQUE INDEX IF NOT EXISTS
    idx_sponsor_impressions_minute
ON public.sponsor_impressions (
    sponsor_id,
    property_id,
    placement,
    date_trunc('minute', created_at AT TIME ZONE 'UTC')
);

-- Update the recording function to handle duplicates.

CREATE OR REPLACE FUNCTION public.record_sponsor_impression(
    p_sponsor_id INTEGER,
    p_property_id INTEGER,
    p_placement TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_selected_sponsor_id INTEGER;
    v_inserted_id BIGINT;
BEGIN
    IF p_placement IS DISTINCT FROM 'PROPERTY_DETAIL' THEN
        RETURN FALSE;
    END IF;

    SELECT s.sponsor_id
    INTO v_selected_sponsor_id
    FROM public.properties p
    JOIN public.sponsors s
        ON s.target_zip = p.zip_code
    WHERE p.property_id = p_property_id
      AND p.is_approved = TRUE
      AND s.status = 'APPROVED'
      AND s.is_active = TRUE
      AND s.placement = p_placement
      AND CURRENT_DATE BETWEEN s.start_date AND s.end_date
    ORDER BY
        CASE s.tier
            WHEN 'PLATINUM' THEN 3
            WHEN 'GOLD' THEN 2
            WHEN 'SILVER' THEN 1
            ELSE 0
        END DESC,
        s.priority DESC,
        s.sponsor_id ASC
    LIMIT 1;

    IF v_selected_sponsor_id IS NULL
       OR v_selected_sponsor_id <> p_sponsor_id THEN
        RETURN FALSE;
    END IF;

    INSERT INTO public.sponsor_impressions (
        sponsor_id,
        property_id,
        placement
    )
    VALUES (
        p_sponsor_id,
        p_property_id,
        p_placement
    )
    ON CONFLICT DO NOTHING
    RETURNING impression_id INTO v_inserted_id;

    RETURN v_inserted_id IS NOT NULL;
END;
$$;

-- Keep the recording function inaccessible to visitors.
REVOKE ALL ON FUNCTION public.record_sponsor_impression(
    INTEGER, INTEGER, TEXT
) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.record_sponsor_impression(
    INTEGER, INTEGER, TEXT
) TO service_role;

-- Allow the server-side service role to read sponsor data.
GRANT SELECT ON TABLE public.sponsors TO service_role;
