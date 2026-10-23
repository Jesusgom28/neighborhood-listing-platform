
-- Migration 007: Validated sponsor impression recording

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
    );

    RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.record_sponsor_impression(
    INTEGER, INTEGER, TEXT
) FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.record_sponsor_impression(
    INTEGER, INTEGER, TEXT
) FROM anon, authenticated;
