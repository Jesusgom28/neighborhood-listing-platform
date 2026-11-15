
-- CIS 3610: Local and CI test fixtures
-- Authentication users must be created through the Supabase Auth API.
-- This SQL file does not create or modify auth.users.

DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Find the test user created through Supabase Auth.
    SELECT id INTO test_user_id
    FROM auth.users
    WHERE email = 'lab8-ci@example.com';

    -- The authentication user must exist before property seeding.
    -- Skip the property when running migrations on a fresh database.
    IF test_user_id IS NULL THEN
        RAISE NOTICE
            'CI test user does not exist yet; skipping property fixture.';
        RETURN;
    END IF;

    -- Add the fictional property only if it does not exist.
    IF NOT EXISTS (
        SELECT 1
        FROM public.properties
        WHERE owner_id = test_user_id
          AND address->>'street' = '123 CI Test Street'
    ) THEN
        INSERT INTO public.properties (
            owner_id,
            address,
            price,
            bedrooms,
            bathrooms,
            square_feet,
            amenities,
            zip_code,
            is_approved
        )
        VALUES (
            test_user_id,
            '{"street":"123 CI Test Street","city":"Los Angeles","state":"CA"}'::jsonb,
            450000,
            3,
            2,
            1500,
            ARRAY['Parking', 'Air Conditioning'],
            '90039',
            TRUE
        );
    END IF;
END;
$$;
