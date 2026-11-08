
-- CIS 3610 Lab 7
-- Allow trusted server-side access to sponsor marketing copy.
-- Public and authenticated users remain restricted.

GRANT SELECT ON TABLE public.sponsor_marketing_copy
TO service_role;
