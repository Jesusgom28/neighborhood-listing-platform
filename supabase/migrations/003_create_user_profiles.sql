
-- CIS 3610 Neighborhood Listing Platform
-- Migration 003: Automatic User Profiles

-- Create a profile for each new auth user.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (
        user_id,
        display_name,
        is_admin
    )
    VALUES (
        NEW.id,
        COALESCE(
            NULLIF(
                SPLIT_PART(NEW.email, '@', 1),
                ''
            ),
            'New User'
        ),
        FALSE
    );

    RETURN NEW;
END;
$$;

-- Restrict direct execution of this function.
REVOKE ALL ON FUNCTION public.handle_new_user()
FROM PUBLIC, anon, authenticated;

-- Run automatically after user registration.
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
